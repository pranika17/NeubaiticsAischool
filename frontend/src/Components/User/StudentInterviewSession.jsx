import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../config";
import "./StudentInterview.css";

const ROUND_SECONDS = {
  intro: 90,
  technical: 150,
  coding: 240,
  hr: 90,
};

const StudentInterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [lastFeedback, setLastFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognitionReady, setRecognitionReady] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecordingReady, setAudioRecordingReady] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      setAnswerText(transcript);
    };

    recognitionRef.current = recognition;
    setRecognitionReady(true);
  }, []);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return;
    setAudioRecordingReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  const questions = useMemo(() => interview?.questions || [], [interview]);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const answeredCount = questions.filter((item) => item.is_answered).length;
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
    setTimeLeft(ROUND_SECONDS[currentQuestion.round_type] || 120);
    setLastFeedback(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl("");
    }
  }, [currentQuestion, audioPreviewUrl]);

  useEffect(() => {
    if (!currentQuestion || timeLeft <= 0) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [currentQuestion, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || !currentQuestion) return;
    Swal.fire({
      title: "Time Up",
      text: "This round timer ended. Submit your current answer or move to the next question.",
      icon: "info",
    });
  }, [timeLeft, currentQuestion]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
  };

  const toggleAudioRecording = async () => {
    if (!audioRecordingReady) return;

    if (isRecordingAudio && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioPreviewUrl) {
          URL.revokeObjectURL(audioPreviewUrl);
        }
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setIsRecordingAudio(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (error) {
      setIsRecordingAudio(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion || !answerText.trim()) {
      Swal.fire("Missing Answer", "Please write your answer before continuing.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${baseUrl}/interview/answer/`, {
        interview_id: interviewId,
        question_id: currentQuestion.id,
        answer_text: answerText,
      });

      const answerPayload = res?.data?.answer;
      setLastFeedback(answerPayload || null);

      setInterview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          asked_questions: (prev.asked_questions || 0) + (currentQuestion.is_answered ? 0 : 1),
          questions: prev.questions.map((item) =>
            item.id === currentQuestion.id ? { ...item, is_answered: true } : item
          ),
          answers: answerPayload
            ? [...(prev.answers || []).filter((item) => item.question?.id !== currentQuestion.id), answerPayload]
            : prev.answers || [],
        };
      });

      setAnswerText("");
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
        setAudioPreviewUrl("");
      }

      if (isLastQuestion) {
        const completeRes = await axios.post(`${baseUrl}/interview/complete/`, {
          interview_id: interviewId,
        });
        navigate(`/mock-interview/report/${completeRes.data.id}`);
        return;
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.error || "Unable to submit answer.", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            {interview.interview_type} interview. Answer clearly with examples, structure, and
            project context from your course.
          </p>
        </div>
        <div className="student-interview-session-meta">
          <div className="student-interview-progress-box">
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
          <div className={`student-interview-timer ${timeLeft <= 20 ? "danger" : ""}`}>
            <i className="bi bi-stopwatch"></i>
            <span>{formatTime(timeLeft)}</span>
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

        <textarea
          className="student-interview-textarea"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer here. Explain your thinking, not just the final line."
          rows={9}
        />

        <div className="student-interview-voice-tools">
          <button
            type="button"
            className={`student-interview-btn secondary ${isListening ? "active" : ""}`}
            onClick={toggleVoiceInput}
            disabled={!recognitionReady}
          >
            <i className="bi bi-mic-fill"></i>
            {isListening ? "Stop Voice Typing" : "Voice to Text"}
          </button>
          <button
            type="button"
            className={`student-interview-btn secondary ${isRecordingAudio ? "active" : ""}`}
            onClick={toggleAudioRecording}
            disabled={!audioRecordingReady}
          >
            <i className={`bi ${isRecordingAudio ? "bi-stop-fill" : "bi-record-circle-fill"}`}></i>
            {isRecordingAudio ? "Stop Recording" : "Record Answer"}
          </button>
          <button
            type="button"
            className="student-interview-btn secondary"
            onClick={() => setTimeLeft((prev) => prev + 60)}
          >
            <i className="bi bi-plus-circle"></i>
            Add 1 Min
          </button>
        </div>

        {audioPreviewUrl && (
          <div className="student-interview-audio-preview">
            <audio controls>
              <source src={audioPreviewUrl} />
            </audio>
            <span>Audio preview recorded for this answer.</span>
          </div>
        )}

        <div className="student-interview-session-actions">
          <button type="button" className="student-interview-btn secondary" onClick={() => navigate("/mock-interviews")}>
            Exit
          </button>
          <button type="button" className="student-interview-btn" onClick={submitCurrentAnswer} disabled={submitting}>
            {submitting ? "Submitting..." : isLastQuestion ? "Finish Interview" : "Submit & Next"}
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
          <p>{lastFeedback.feedback}</p>
          <p><strong>Improve:</strong> {lastFeedback.improvement_tip}</p>
          <p><strong>Practice next:</strong> {lastFeedback.suggested_followup}</p>
        </div>
      )}
    </div>
  );
};

export default StudentInterviewSession;
