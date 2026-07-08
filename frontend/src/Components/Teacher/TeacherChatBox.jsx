import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./TeacherChatBox.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherChatBox = () => {
  const { studentId } = useParams();
  const teacherId = localStorage.getItem("teacherId");

  const [chatData, setChatData] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentImage, setStudentImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionReady, setRecognitionReady] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecordingReady, setAudioRecordingReady] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fetchChats = () => {
    axios
      .get(`${baseUrl}/chat/individual/${teacherId}/${studentId}/?viewer=teacher`)
      .then((res) => setChatData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  };

  const fetchStudentName = () => {
    axios
      .get(`${baseUrl}/teacher/chat-dashboard/${teacherId}/`)
      .then((res) => {
        const student = res.data.individuals.find((item) => item.id === parseInt(studentId, 10));
        if (student) {
          setStudentName(student.name);
          setStudentImage(student.profile_img);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchChats();
    fetchStudentName();
    const poll = setInterval(fetchChats, 5000);
    return () => clearInterval(poll);
  }, [studentId, teacherId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

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

      setMsg(transcript);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
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

  const incomingUnreadCount = useMemo(
    () => chatData.filter((chat) => chat.sender === "student" && !chat.is_read).length,
    [chatData]
  );

  useEffect(() => {
    document.title = incomingUnreadCount > 0 ? `(${incomingUnreadCount}) LMS | Teacher Chat` : "LMS | Teacher Chat";
  }, [incomingUnreadCount]);

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
  };

  const sendMessage = () => {
    if (!msg.trim() && !image && !audioBlob) return;

    const formData = new FormData();
    formData.append("teacher", teacherId);
    formData.append("student", studentId);
    formData.append("sender", "teacher");
    if (msg.trim()) formData.append("message", msg.trim());
    if (image) formData.append("image", image);
    if (audioBlob) {
      formData.append("audio", audioBlob, `teacher-voice-${Date.now()}.webm`);
      if (msg.trim()) {
        formData.append("audio_transcript", msg.trim());
      }
    }

    axios
      .post(`${baseUrl}/chat/individual/send/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setMsg("");
        setImage(null);
        setAudioBlob(null);
        if (audioPreviewUrl) {
          URL.revokeObjectURL(audioPreviewUrl);
          setAudioPreviewUrl("");
        }
        setShowEmoji(false);
        setOpenMenuId(null);
        if (inputRef.current) inputRef.current.style.height = "44px";
        fetchChats();
      })
      .catch((err) => console.error(err));
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
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setIsRecordingAudio(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (error) {
      console.error(error);
      setIsRecordingAudio(false);
    }
  };

  const deleteMessage = (id) => {
    axios
      .delete(`${baseUrl}/chat/individual/delete/${id}/`)
      .then(() => fetchChats())
      .catch((err) => console.error(err));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const parts = String(timestamp).split(" ");
    return parts[1] || parts[0];
  };

  return (
    <div className="teacher-chat-page">
      <div className="wa-chat-shell">
        <div className="wa-chat-header">
          <div className="wa-chat-profile">
            <div className="wa-avatar">
              <img
                src={studentImage ? `http://127.0.0.1:8000${studentImage}` : "/default-avatar.png"}
                alt={studentName || "Student"}
              />
            </div>
            <div className="wa-chat-meta">
              <span className="wa-chat-name">{studentName || "Loading..."}</span>
              <span className="wa-chat-subtitle">
                {incomingUnreadCount > 0 ? `${incomingUnreadCount} new messages` : "Conversation"}
              </span>
            </div>
          </div>
        </div>

        <div className="wa-chat-body">
          {chatData.map((chat, index) => {
            const isTeacher = String(chat.sender).toLowerCase() === "teacher";
            const isLast = index === chatData.length - 1;
            const statusText = isTeacher ? (chat.is_read ? "Seen" : "Sent") : "";

            return (
              <div
                key={chat.id}
                ref={isLast ? scrollRef : null}
                className={`wa-chat-row ${isTeacher ? "wa-chat-right" : "wa-chat-left"}`}
              >
                <div className={`wa-chat-bubble ${isTeacher ? "wa-outgoing" : "wa-incoming"}`}>
                  <button
                    type="button"
                    className="wa-msg-menu-toggle"
                    onClick={() => setOpenMenuId(openMenuId === chat.id ? null : chat.id)}
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>

                  {openMenuId === chat.id && (
                    <div className="wa-msg-menu">
                      {isTeacher && (
                        <button type="button" onClick={() => deleteMessage(chat.id)}>
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(chat.message || "")}
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {chat.message && <div className="wa-chat-text">{chat.message}</div>}

                  {chat.image_url || chat.image ? (
                    <img src={chat.image_url || chat.image} alt="attachment" className="wa-chat-image" />
                  ) : null}

                  {chat.audio_url && (
                    <div className="wa-audio-wrap">
                      <audio controls className="wa-audio-player">
                        <source src={chat.audio_url} />
                      </audio>
                      {chat.audio_transcript && (
                        <div className="wa-audio-transcript">{chat.audio_transcript}</div>
                      )}
                    </div>
                  )}

                  <div className="wa-chat-status">
                    <span>{formatTime(chat.timestamp)}</span>
                    {isTeacher && (
                      <span className={`wa-seen-state ${chat.is_read ? "seen" : ""}`}>
                        <i className={`bi ${chat.is_read ? "bi-check2-all" : "bi-check2"}`}></i>
                        {statusText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wa-chat-footer">
          <button
            type="button"
            className="wa-icon-btn wa-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <i className="bi bi-paperclip"></i>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <div className="wa-input-wrap">
            {image && <div className="wa-attachment-note">Attached: {image.name}</div>}
            {audioPreviewUrl && (
              <div className="wa-attachment-note wa-audio-preview">
                <audio controls className="wa-audio-player">
                  <source src={audioPreviewUrl} />
                </audio>
              </div>
            )}
            <textarea
              ref={inputRef}
              className="wa-chat-input"
              placeholder="Type a message"
              value={msg}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <button
            type="button"
            className={`wa-icon-btn ${isListening ? "listening" : ""}`}
            onClick={handleVoiceInput}
            disabled={!recognitionReady}
            title={recognitionReady ? "Voice to text" : "Voice input not supported"}
          >
            <i className="bi bi-mic-fill"></i>
          </button>

          <button
            type="button"
            className={`wa-icon-btn ${isRecordingAudio ? "recording" : ""}`}
            onClick={toggleAudioRecording}
            disabled={!audioRecordingReady}
            title={audioRecordingReady ? "Voice note" : "Audio recording not supported"}
          >
            <i className={`bi ${isRecordingAudio ? "bi-stop-fill" : "bi-record-circle-fill"}`}></i>
          </button>

          <button
            type="button"
            className="wa-icon-btn"
            onClick={() => setShowEmoji((prev) => !prev)}
            title="Emoji"
          >
            <i className="bi bi-emoji-smile"></i>
          </button>

          <button type="button" className="wa-send-btn" onClick={sendMessage}>
            <i className="bi bi-send-fill"></i>
          </button>

          {showEmoji && (
            <div className="wa-emoji-box">
              <Picker data={data} onEmojiSelect={(emoji) => setMsg((prev) => prev + emoji.native)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherChatBox;
