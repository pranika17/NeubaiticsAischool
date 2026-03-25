import os
import re
import json
from datetime import datetime
from pathlib import Path


def build_vector_index():
    """
    Kept for compatibility with AppConfig.ready().
    We now use direct LLM chat with role-scoped context.
    """
    return None


def _load_openai_key():
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if key:
        return key

    file_path = Path(__file__).resolve()
    env_paths = [
        file_path.parent.parent / ".env",
        file_path.parent.parent.parent / ".env",
    ]

    for env_path in env_paths:
        if not env_path.exists():
            continue
        for line in env_path.read_text(encoding="utf-8").splitlines():
            text = line.strip()
            if not text or text.startswith("#") or "=" not in text:
                continue
            name, value = text.split("=", 1)
            if name.strip() == "OPENAI_API_KEY":
                loaded = value.strip().strip("'").strip('"')
                if loaded:
                    return loaded
    return ""


def _sanitize_history(history):
    safe_items = []
    if not isinstance(history, list):
        return safe_items

    for item in history[-10:]:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role", "")).lower().strip()
        content = str(item.get("content", "")).strip()
        if role in {"user", "assistant"} and content:
            safe_items.append({"role": role, "content": content[:1200]})
    return safe_items


def _tokenize_text(value):
    return {
        token
        for token in re.findall(r"[a-z0-9]+", str(value or "").lower())
        if len(token) >= 3
    }


def _score_context_chunk(question, chunk):
    question_text = str(question or "").strip().lower()
    chunk_text = str(chunk or "").strip().lower()
    if not question_text or not chunk_text:
        return 0

    score = 0
    question_tokens = _tokenize_text(question_text)
    chunk_tokens = _tokenize_text(chunk_text)
    overlap = question_tokens.intersection(chunk_tokens)
    score += len(overlap) * 3

    if chunk_text.startswith("student profile:") or chunk_text.startswith("teacher profile:"):
        score += 4
    if chunk_text.startswith("student summary:") or chunk_text.startswith("teacher summary:"):
        score += 5
    if "course:" in chunk_text:
        score += 2
    if "study material" in chunk_text or "study document" in chunk_text:
        score += 2
    if "chapter" in chunk_text:
        score += 2
    if "assignment" in question_text and "assignment" in chunk_text:
        score += 5
    if "quiz" in question_text and "quiz" in chunk_text:
        score += 5
    if "progress" in question_text and "progress" in chunk_text:
        score += 5
    if "dashboard" in question_text and "summary" in chunk_text:
        score += 4
    return score


def _select_relevant_context(question, context_chunks, limit=12):
    unique_chunks = []
    seen = set()
    for chunk in context_chunks or []:
        text = str(chunk or "").strip()
        if not text:
            continue
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        unique_chunks.append(text)

    if not unique_chunks:
        return []

    ranked = [
        (_score_context_chunk(question, chunk), index, chunk)
        for index, chunk in enumerate(unique_chunks)
    ]
    ranked.sort(key=lambda item: (-item[0], item[1]))

    selected = [chunk for score, _, chunk in ranked[:limit] if score > 0]
    minimum = min(4, len(unique_chunks))
    if len(selected) < minimum:
        for chunk in unique_chunks:
            if chunk not in selected:
                selected.append(chunk)
            if len(selected) >= min(limit, len(unique_chunks)):
                break
    return selected[:limit]


def _fallback_response(question, context_chunks, role):
    selected_context = _select_relevant_context(question, context_chunks, limit=4)
    context_text = "\n".join(selected_context[:2]) if selected_context else "No scoped LMS context found."
    return (
        "I could not reach the AI model right now. "
        "Please try again in a moment.\n\n"
        f"{role.capitalize()} context snapshot:\n{context_text}\n\n"
        f"Question received: {question}"
    )


def _normalize_language(preferred_language):
    language = str(preferred_language or "english").strip().lower()
    allowed = {"english", "tamil", "hindi"}
    return language if language in allowed else "english"


def _build_capability_answer(role, current_page=None, capability_prompts=None):
    role_name = "teacher" if role == "teacher" else "student"
    page_line = f"You are currently on {current_page}." if current_page else None
    prompts = [str(item).strip() for item in (capability_prompts or []) if str(item).strip()]

    lines = [
        f"You can ask me {role_name}-side questions about your LMS data and the page you are using.",
    ]
    if page_line:
        lines.append(page_line)
    if prompts:
        lines.append("Good prompts:")
        lines.extend(f"- {item}" for item in prompts[:8])
    lines.append("I will stay inside your own role and records.")
    return "\n".join(lines)


def _rule_based_casual_answer(question, role="student", current_page=None, capability_prompts=None):
    q = str(question or "").strip().lower()
    if not q:
        return None

    now = datetime.now()
    if re.search(r"\b(time|current time|what.*time)\b", q):
        return f"The current server time is {now.strftime('%I:%M %p')}."

    if re.search(r"\b(date|today|day)\b", q):
        return f"Today is {now.strftime('%A, %B %d, %Y')}."

    if any(g in q for g in ["hello", "hi", "hey", "good morning", "good evening"]):
        return "Hi. I can help with courses, assignments, quizzes, documents, progress, and dashboard questions."

    if re.search(r"\b(what can i ask|what can you do|help me use|how can you help|capabilities|example prompts|sample prompts)\b", q):
        return _build_capability_answer(role, current_page=current_page, capability_prompts=capability_prompts)

    return None


def get_ai_response(
    question,
    context_chunks=None,
    role="student",
    history=None,
    user_id=None,
    current_path=None,
    current_page=None,
    capability_prompts=None,
    role_scope=None,
    preferred_language="english",
):
    context_chunks = context_chunks or []
    history = _sanitize_history(history)
    selected_context = _select_relevant_context(question, context_chunks, limit=12)
    preferred_language = _normalize_language(preferred_language)

    casual = _rule_based_casual_answer(
        question,
        role=role,
        current_page=current_page,
        capability_prompts=capability_prompts,
    )
    if casual:
        return casual

    key = _load_openai_key()
    if not key:
        return _fallback_response(question, selected_context, role)

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

        guard = (
            "You are Neubaitics LMS assistant, a role-scoped LMS copilot. "
            "Use the provided LMS context as the source of truth for dashboard, course, chapter, study material, "
            "quiz, assignment, enrollment, student-progress, certificate, and chat-dashboard questions. "
            "Never fabricate records, counts, names, dates, permissions, links, or statuses. "
            "If the answer is partially supported, say what is known and what is missing. "
            "If the user asks for another person's private data, admin-only data, or actions outside their role, refuse briefly and redirect to allowed help. "
            "Do not claim to open pages, submit forms, change database records, or perform actions unless the app already confirmed that action elsewhere."
        )

        role_policy = (
            "Audience role: teacher. Focus only on the teacher's own dashboard, courses, enrollments, students, chapters, study materials, quizzes, assignments, and chat dashboard. "
            "You may summarize student performance only at the level supported by this teacher's scoped data."
            if role == "teacher"
            else "Audience role: student. Focus only on the student's own dashboard, enrolled courses, study materials, chapters, quizzes, assignments, progress, certificates, favorites, and chat dashboard. "
            "If a course is pending or rejected, explain that limitation clearly."
        )

        answer_style = (
            "Write natural, direct, voice-friendly answers that feel professional. "
            "Start with the answer. "
            "Use concrete names, counts, and statuses from context when available. "
            "Prefer short paragraphs or short bullets. "
            "If the question is broad, give a summary first and then the most relevant details. "
            "When the user asks what they can do, give practical example prompts tailored to their role and current page. "
            "When the user asks page-related questions, anchor the answer to the current page if provided. "
            f"Reply in {preferred_language.capitalize()} unless the user explicitly asks for another language."
        )

        scoped_context = "\n".join(selected_context[:12]) if selected_context else "No scoped context."
        page_context = "\n".join(
            [
                f"Current page path: {current_path or 'unknown'}",
                f"Current page name: {current_page or 'unknown'}",
                f"Role scope summary: {role_scope or 'not provided'}",
                "Role-tailored example prompts:",
                *[
                    f"- {item}"
                    for item in (capability_prompts or [])[:10]
                    if str(item).strip()
                ],
            ]
        ).strip()

        messages = [
            {"role": "system", "content": guard},
            {"role": "system", "content": role_policy},
            {"role": "system", "content": answer_style},
            {"role": "system", "content": f"Current server datetime: {datetime.now().isoformat()}"},
            {"role": "system", "content": f"Page and capability context:\n{page_context}"},
            {"role": "system", "content": f"Scoped LMS context:\n{scoped_context}"},
        ]
        messages.extend(history)
        messages.append({"role": "user", "content": str(question).strip()[:1800]})

        resp = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.2,
            max_tokens=500,
        )
        text = (resp.choices[0].message.content or "").strip()
        return text or "I could not generate a response."
    except Exception:
        return _fallback_response(question, selected_context, role)


def generate_structured_quiz(question, context_chunks=None):
    context_chunks = context_chunks or []
    key = _load_openai_key()

    if not key:
        return {"error": "OpenAI key missing"}

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        context_text = "\n".join(context_chunks[:10])

        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert university professor. "
                    "You must generate STRICT JSON only. "
                    "No explanation. No markdown."
                ),
            },
            {
                "role": "user",
                "content": f"""
Context:
{context_text}

Instruction:
{question}

Return ONLY this format:
{{
  "questions": "...",
  "ans1": "...",
  "ans2": "...",
  "ans3": "...",
  "ans4": "...",
  "right_ans": "..."
}}
""",
            },
        ]

        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=messages,
            temperature=0.4,
            max_tokens=400,
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        return {"error": str(e)}


def generate_tts_audio(text, voice="alloy"):
    cleaned = " ".join(str(text or "").replace("\r", " ").split())
    if not cleaned:
        return {"error": "Text is required"}

    key = _load_openai_key()
    if not key:
        return {"error": "OpenAI key missing"}

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        model_name = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
        selected_voice = (voice or os.getenv("OPENAI_TTS_VOICE", "alloy")).strip().lower()
        allowed_voices = {
            "alloy",
            "ash",
            "ballad",
            "coral",
            "echo",
            "sage",
            "shimmer",
            "verse",
            "marin",
            "cedar",
        }
        if selected_voice not in allowed_voices:
            selected_voice = "alloy"

        response = client.audio.speech.create(
            model=model_name,
            voice=selected_voice,
            input=cleaned[:4000],
            response_format="mp3",
            speed=1.0,
            instructions=(
                "Speak in a natural, clear, confident, conversational tone. "
                "Sound human and professional. Avoid sounding robotic, rushed, or overly dramatic."
            ),
        )
        return {
            "audio": bytes(response.content),
            "content_type": "audio/mpeg",
            "voice": selected_voice,
        }
    except Exception as e:
        return {"error": str(e)}


def translate_text(text, target_language="english"):
    cleaned = " ".join(str(text or "").replace("\r", " ").split())
    if not cleaned:
        return {"text": ""}

    target_language = _normalize_language(target_language)
    if target_language == "english":
        return {"text": cleaned}

    key = _load_openai_key()
    if not key:
        return {"error": "OpenAI key missing"}

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Translate the user's text into {target_language.capitalize()}. "
                        "Preserve headings, bullets, names, numbers, route names, and LMS terminology. "
                        "Return only the translated text."
                    ),
                },
                {"role": "user", "content": cleaned[:3000]},
            ],
            temperature=0.1,
            max_tokens=700,
        )
        translated = (response.choices[0].message.content or "").strip()
        return {"text": translated or cleaned}
    except Exception as e:
        return {"error": str(e)}


def generate_mock_interview_questions(prompt, context_chunks=None):
    context_chunks = context_chunks or []
    key = _load_openai_key()
    if not key:
        return {"error": "OpenAI key missing"}

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        context_text = "\n".join(context_chunks[:12])
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.3,
            max_tokens=1200,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert mock interviewer for job-ready technical students. "
                        "Generate STRICT JSON only with practical, course-specific interview questions. "
                        "Do not use markdown."
                    ),
                },
                {
                    "role": "user",
                    "content": f"""
Context:
{context_text}

Instruction:
{prompt}

Return ONLY JSON in this format:
{{
  "questions": [
    {{
      "round_type": "intro",
      "question_text": "...",
      "ideal_points": "...",
      "coding_prompt": ""
    }}
  ]
}}
""",
                },
            ],
        )
        content = (response.choices[0].message.content or "").strip()
        match = re.search(r"\{.*\}", content, re.DOTALL)
        parsed = json.loads(match.group(0) if match else content)
        questions = parsed.get("questions") or []
        cleaned = []
        for item in questions:
            if not isinstance(item, dict):
                continue
            cleaned.append(
                {
                    "round_type": str(item.get("round_type", "technical")).strip().lower(),
                    "question_text": str(item.get("question_text", "")).strip(),
                    "ideal_points": str(item.get("ideal_points", "")).strip(),
                    "coding_prompt": str(item.get("coding_prompt", "")).strip(),
                }
            )
        return {"questions": [q for q in cleaned if q["question_text"]]}
    except Exception as e:
        return {"error": str(e)}


def evaluate_mock_interview_answer(prompt, context_chunks=None):
    context_chunks = context_chunks or []
    key = _load_openai_key()
    if not key:
        return {"error": "OpenAI key missing"}

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        context_text = "\n".join(context_chunks[:12])
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.2,
            max_tokens=700,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert interviewer evaluating a student's answer. "
                        "Return STRICT JSON only. Be constructive, specific, and course-aware."
                    ),
                },
                {
                    "role": "user",
                    "content": f"""
Context:
{context_text}

Instruction:
{prompt}

Return ONLY JSON in this format:
{{
  "score": 0,
  "communication_score": 0,
  "technical_score": 0,
  "confidence_score": 0,
  "feedback": "...",
  "improvement_tip": "...",
  "suggested_followup": "..."
}}
""",
                },
            ],
        )
        content = (response.choices[0].message.content or "").strip()
        match = re.search(r"\{.*\}", content, re.DOTALL)
        parsed = json.loads(match.group(0) if match else content)
        return {
            "score": max(0, min(100, int(parsed.get("score", 0) or 0))),
            "communication_score": max(0, min(100, int(parsed.get("communication_score", 0) or 0))),
            "technical_score": max(0, min(100, int(parsed.get("technical_score", 0) or 0))),
            "confidence_score": max(0, min(100, int(parsed.get("confidence_score", 0) or 0))),
            "feedback": str(parsed.get("feedback", "")).strip(),
            "improvement_tip": str(parsed.get("improvement_tip", "")).strip(),
            "suggested_followup": str(parsed.get("suggested_followup", "")).strip(),
        }
    except Exception as e:
        return {"error": str(e)}
