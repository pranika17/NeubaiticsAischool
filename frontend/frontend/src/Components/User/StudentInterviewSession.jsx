import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../config";
import "./StudentInterview.css";

const QUESTION_WAIT_SECONDS = 300;

const StudentInterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [lastFeedback, setLastFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_WAIT_SECONDS);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceInputReady, setVoiceInputReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const timerRef = useRef(null);
  const autoSubmittingRef = useRef(false);
  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const audioUrlRef = useRef("");
  const ttsAbortRef = useRef(null);
  const browserSpeechRef = useRef(null);
  const studentId = localStorage.getItem("studentId");

  const clearVoiceChatAuth = useCallback(() => {
    localStorage.removeItem("chatAuthTokenStudent");
    localStorage.removeItem("chatAuthToken");
  }, []);

  const getChatToken = useCallback(() => {
    return localStorage.getItem("chatAuthTokenStudent") || localStorage.getItem("chatAuthToken");
  }, []);

  useEffect(() => {
    document.title = "LMS | Interview Session";
  }, []);

  useEffect(() => {
    const loadInterview = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/interview/report/${interviewId}/`);
        const payload = res.data;
        setInterview(payload);
        const firstPendingIndex = (payload?.questions || []).findIndex((q) => !q.is_answered);
        setCurrentIndex(firstPendingIndex >= 0 ? firstPendingIndex : 0);
      } catch (error) {
        Swal.fire("Error", "Unable to load interview session.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += `${event.results[i][0]?.transcript || ""} `;
      }
      setAnswerText(transcript.trim());
    };

    recognitionRef.current = recognition;
    setVoiceInputReady(true);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = "";
      }
    };
  }, []);

  const questions = useMemo(() => interview?.questions || [], [interview]);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const answeredCount = questions.filter((item) => item.is_answered).length;
  const answerMap = useMemo(() => {
    return (interview?.answers || []).reduce((acc, item) => {
      const questionId = item?.question?.id;
      if (questionId) {
        acc[questionId] = item;
      }
      return acc;
    }, {});
  }, [interview]);
  const roundGroups = useMemo(() => {
    const groups = [];
    questions.forEach((question) => {
      const last = groups[groups.length - 1];
      if (!last || last.type !== question.round_type) {
        groups.push({ type: question.round_type, count: 1 });
      } else {
        last.count += 1;
      }
    });
    return groups;
  }, [questions]);
  const activeRoundIndex = useMemo(() => {
    return roundGroups.findIndex((group) => group.type === currentQuestion?.round_type);
  }, [currentQuestion?.round_type, roundGroups]);

  useEffect(() => {
    if (!currentQuestion) return;
    setLastFeedback(answerMap[currentQuestion.id] || null);
    setAnswerText(answerMap[currentQuestion.id]?.answer_text || "");
    setTimeLeft(QUESTION_WAIT_SECONDS);
    autoSubmittingRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [answerMap, currentQuestion]);

  const stopAiVoice = useCallback(() => {
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    browserSpeechRef.current = null;
  }, []);

  const speakWithBrowserVoice = useCallback(() => {
    if (!currentQuestion || !window.speechSynthesis) {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Hello. Question ${currentIndex + 1}. ${currentQuestion.question_text}. Please answer when you are ready.`
    );
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    browserSpeechRef.current = utterance;

    utterance.onend = () => {
      browserSpeechRef.current = null;
      if (!currentQuestion.is_answered && voiceInputReady && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    utterance.onerror = () => {
      browserSpeechRef.current = null;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }, [currentIndex, currentQuestion, voiceInputReady]);

  const speakQuestion = useCallback(async () => {
    const chatToken = getChatToken();

    if (!currentQuestion) {
      return;
    }

    if (!voiceEnabled) {
      Swal.fire("Voice Disabled", "Enable voice first, then replay the question.", "info");
      return;
    }

    if (!studentId || !chatToken) {
      Swal.fire("Login Required", "Voice session is missing. Please login again.", "warning");
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    stopAiVoice();

    const controller = new AbortController();
    ttsAbortRef.current = controller;

    try {
      const response = await fetch(`${baseUrl}/ai-voice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatToken}`,
        },
        body: JSON.stringify({
          text: `Hello. Question ${currentIndex + 1}. ${currentQuestion.question_text}. Please answer when you are ready.`,
          role: "student",
          user_id: studentId,
          voice: "marin",
          preferred_language: "english",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearVoiceChatAuth();
          setVoiceEnabled(false);
          Swal.fire("Session Expired", "Voice auth expired. Please login again.", "warning");
          return;
        }
        if (response.status === 503 && speakWithBrowserVoice()) {
          return;
        }
        Swal.fire("Voice Error", "Replay failed. Please try again.", "error");
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      ttsAbortRef.current = null;

      audio.onended = () => {
        audioPlayerRef.current = null;
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = "";
        }
        if (!currentQuestion.is_answered && voiceInputReady && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      await audio.play();
    } catch (error) {
      ttsAbortRef.current = null;
      if (speakWithBrowserVoice()) {
        return;
      }
      Swal.fire("Voice Error", "Unable to play the question audio right now.", "error");
    }
  }, [clearVoiceChatAuth, currentIndex, currentQuestion, getChatToken, isListening, speakWithBrowserVoice, studentId, stopAiVoice, voiceEnabled, voiceInputReady]);

  useEffect(() => {
    speakQuestion();
    return () => {
      stopAiVoice();
    };
  }, [speakQuestion, stopAiVoice]);

  const startVoiceAnswer = useCallback(() => {
    if (!recognitionRef.current || !voiceInputReady) {
      return;
    }
    setAnswerText("");
    stopAiVoice();
    recognitionRef.current.start();
  }, [stopAiVoice, voiceInputReady]);

  const stopVoiceAnswer = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (!currentQuestion || currentQuestion.is_answered || submitting) return undefined;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, submitting]);

  const findNextPendingIndex = (questionList, startIndex = -1) => {
    const nextIndex = questionList.findIndex(
      (item, index) => index > startIndex && !item.is_answered
    );
    if (nextIndex >= 0) return nextIndex;
    return questionList.findIndex((item) => !item.is_answered);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const submitCurrentAnswer = useCallback(async ({ autoAdvance = false } = {}) => {
    if (!currentQuestion) {
      return;
    }

    if (!answerText.trim() && !autoAdvance) {
      Swal.fire("Missing Answer", "Please write your answer before continuing.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${baseUrl}/interview/answer/`, {
        interview_id: interviewId,
        question_id: currentQuestion.id,
        answer_text: answerText.trim(),
      });

      const answerPayload = res?.data?.answer;
      setLastFeedback(answerPayload || null);

      let nextInterviewState = null;
      setInterview((prev) => {
        if (!prev) return prev;
        nextInterviewState = {
          ...prev,
          asked_questions: (prev.asked_questions || 0) + (currentQuestion.is_answered ? 0 : 1),
          questions: prev.questions.map((item) =>
            item.id === currentQuestion.id ? { ...item, is_answered: true } : item
          ),
          answers: answerPayload
            ? [...(prev.answers || []).filter((item) => item.question?.id !== currentQuestion.id), answerPayload]
            : prev.answers || [],
        };
        return nextInterviewState;
      });

      const nextQuestions = nextInterviewState?.questions || questions;
      const nextPendingIndex = findNextPendingIndex(nextQuestions, currentIndex);

      if (nextPendingIndex === -1) {
        const completeRes = await axios.post(`${baseUrl}/interview/complete/`, {
          interview_id: interviewId,
        });
        navigate(`/mock-interview/report/${completeRes.data.id}`);
        return;
      }

      setCurrentIndex(nextPendingIndex);
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.error || "Unable to submit answer.", "error");
    } finally {
      setSubmitting(false);
    }
  }, [answerText, currentIndex, currentQuestion, interviewId, navigate, questions]);

  useEffect(() => {
    if (
      timeLeft !== 0 ||
      !currentQuestion ||
      currentQuestion.is_answered ||
      submitting ||
      autoSubmittingRef.current
    ) {
      return;
    }

    autoSubmittingRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    submitCurrentAnswer({ autoAdvance: true });
  }, [currentQuestion, submitting, timeLeft, submitCurrentAnswer]);

  if (loading) {
    return <div className="student-interview-empty">Loading interview session...</div>;
  }

  if (!interview || !currentQuestion) {
    return <div className="student-interview-empty">Interview session not found.</div>;
  }

  return (
    <div className="student-interview-session">
      <div className="student-interview-session-top">
        <div>
          <h3>{interview.course_title}</h3>
          <p>
            {interview.interview_type} interview. This round uses course-based intro, basic,
            development, and coding questions from your enrolled learning path.
          </p>
        </div>
        <div className="student-interview-session-meta">
          <div className="student-interview-progress-box">
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
          <div className={`student-interview-progress-box ${timeLeft <= 30 ? "danger" : ""}`}>
            <span>Wait {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="student-interview-rounds">
        {roundGroups.map((group, index) => (
          <div
            key={`${group.type}-${index}`}
            className={`student-round-chip ${index === activeRoundIndex ? "active" : ""}`}
          >
            <span>{group.type}</span>
            <small>{group.count} Q</small>
          </div>
        ))}
      </div>

      <div className="student-interview-question-card">
        <div className="student-interview-round">{currentQuestion.round_type}</div>
        <div className="student-interview-voice-bar">
          <span>AI asks this question by voice. You answer through voice only.</span>
          <div className="student-interview-session-actions">
            <button
              type="button"
              className="student-interview-btn secondary"
              onClick={speakQuestion}
              disabled={!currentQuestion || !studentId}
            >
              Replay Question
            </button>
            <button
              type="button"
              className="student-interview-btn secondary"
              onClick={() => {
                stopAiVoice();
                setVoiceEnabled((prev) => !prev);
              }}
            >
              {voiceEnabled ? "Mute Voice" : "Enable Voice"}
            </button>
          </div>
        </div>
        <h4>{currentQuestion.question_text}</h4>
        {currentQuestion.ideal_points ? (
          <div className="student-interview-hint">
            <strong>What the interviewer expects:</strong> {currentQuestion.ideal_points}
          </div>
        ) : null}
        {currentQuestion.coding_prompt ? (
          <div className="student-interview-codehint">
            <strong>Coding focus:</strong> {currentQuestion.coding_prompt}
          </div>
        ) : null}

        <div className="student-interview-observer">
          The AI interviewer is waiting quietly for up to 5 minutes. When time ends, it will
          evaluate the answer and move to the next question automatically.
        </div>

        <div className="student-interview-voice-response">
          <div className="student-interview-voice-controls">
            <button
              type="button"
              className={`student-interview-btn ${isListening ? "secondary" : ""}`}
              onClick={startVoiceAnswer}
              disabled={!voiceInputReady || isListening || submitting}
            >
              Start Answer
            </button>
            <button
              type="button"
              className="student-interview-btn secondary"
              onClick={stopVoiceAnswer}
              disabled={!isListening || submitting}
            >
              Stop Answer
            </button>
            <span className={`student-interview-listen-state ${isListening ? "live" : ""}`}>
              {voiceInputReady
                ? isListening
                  ? "Listening to your answer..."
                  : "Microphone ready"
                : "Voice input not supported in this browser"}
            </span>
          </div>

          <div className="student-interview-transcript">
            <strong>Your voice transcript</strong>
            <p>{answerText || "Your spoken answer will appear here while you speak."}</p>
          </div>
        </div>

        <div className="student-interview-session-actions">
          <button type="button" className="student-interview-btn secondary" onClick={() => navigate("/mock-interviews")}>
            Exit
          </button>
          <button
            type="button"
            className="student-interview-btn secondary"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0 || submitting}
          >
            Previous
          </button>
          <button
            type="button"
            className="student-interview-btn secondary"
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            disabled={isLastQuestion || submitting}
          >
            Next
          </button>
          <button
            type="button"
            className="student-interview-btn"
            onClick={() => {
              stopVoiceAnswer();
              submitCurrentAnswer();
            }}
            disabled={submitting || !answerText.trim()}
          >
            {submitting ? "Evaluating..." : isLastQuestion ? "Submit & Finish" : "Submit & Next"}
          </button>
        </div>
      </div>

      {lastFeedback && (
        <div className="student-interview-feedback-card">
          <h5>AI Feedback</h5>
          <div className="student-interview-feedback-metrics">
            <span>Overall {lastFeedback.score}</span>
            <span>Communication {lastFeedback.communication_score}</span>
            <span>Technical {lastFeedback.technical_score}</span>
            <span>Confidence {lastFeedback.confidence_score}</span>
          </div>
          <p><strong>Your answer summary:</strong> {lastFeedback.answer_summary || "Not available."}</p>
          <p>{lastFeedback.feedback}</p>
          <p><strong>Improve:</strong> {lastFeedback.improvement_tip}</p>
          <p><strong>Missing points:</strong> {lastFeedback.missing_points || "No missing points listed."}</p>
          <p><strong>Better sample answer:</strong> {lastFeedback.sample_answer || "No sample answer generated."}</p>
          <p><strong>Practice next:</strong> {lastFeedback.suggested_followup}</p>
        </div>
      )}
    </div>
  );
};

export default StudentInterviewSession;
