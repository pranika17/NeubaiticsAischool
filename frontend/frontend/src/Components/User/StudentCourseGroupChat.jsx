import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./StudentCourseGroupChat.css";
import { baseUrl } from '../../config';

const StudentCourseGroupChat = () => {
  const { course_id } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = localStorage.getItem("studentId");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const unreadRefs = useRef({});
  const focusMessageId = searchParams.get("focus");

  const loadMessages = () => {
    axios
      .get(`${baseUrl}/chat/group/${course_id}/?viewer=student&student_id=${studentId}`)
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    document.title = "LMS | Course Group Chat";
    loadMessages();
    const timer = setInterval(loadMessages, 5000);
    return () => clearInterval(timer);
  }, [course_id]);

  useEffect(() => {
    const targetId = focusMessageId || messages.find((msg) => msg.is_unread_for_viewer)?.id;
    if (!targetId) return;

    const node = unreadRefs.current[String(targetId)];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [messages, focusMessageId]);

  const courseTitle = useMemo(() => messages[0]?.course_title || "Course Group Chat", [messages]);

  const sendReply = () => {
    if (!message.trim()) return;

    const payload = new FormData();
    payload.append("course", course_id);
    payload.append("sender_type", "student");
    payload.append("student", studentId);
    payload.append("message_type", "message");
    payload.append("message", message);

    axios
      .post(`${baseUrl}/chat/group/send/`, payload)
      .then(() => {
        setMessage("");
        loadMessages();
        Swal.fire({
          title: "Message sent",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          showConfirmButton: false,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="student-course-group-page">
      <div className="course-group-shell">
        <div className="course-group-header">
          <h3>{courseTitle}</h3>
          <span>Student group room</span>
        </div>

        <div className="course-group-feed">
          {messages.length === 0 ? (
            <p className="group-empty">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                ref={(node) => {
                  unreadRefs.current[String(msg.id)] = node;
                }}
                className={`group-card type-${msg.message_type} ${
                  msg.is_unread_for_viewer ? "group-card-unread" : ""
                }`}
              >
                <div className="group-card-top">
                  <div>
                    <span className="group-chip">{msg.message_type}</span>
                    {msg.is_unread_for_viewer && <span className="group-new-pill">Unread</span>}
                    {msg.title && <h5>{msg.title}</h5>}
                  </div>
                  <small>{msg.timestamp}</small>
                </div>

                <p>{msg.message}</p>

                {msg.meeting_link && (
                  <a href={msg.meeting_link} target="_blank" rel="noreferrer" className="group-link">
                    Join Meeting
                  </a>
                )}

                <div className="group-meta">
                  {msg.sender_type === "teacher" ? "Teacher" : msg.student_name || "Student"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="course-group-composer">
          <textarea
            className="form-control group-input group-textarea"
            placeholder="Reply to the course group"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn group-send-btn mt-3" onClick={sendReply}>
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseGroupChat;
