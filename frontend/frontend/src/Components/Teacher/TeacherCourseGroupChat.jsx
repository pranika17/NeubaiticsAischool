import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./TeacherCourseGroupChat.css";
import { baseUrl } from '../../config';

const TeacherCourseGroupChat = () => {
  const { course_id } = useParams();
  const [searchParams] = useSearchParams();
  const teacherId = localStorage.getItem("teacherId");
  const [messages, setMessages] = useState([]);
  const unreadRefs = useRef({});
  const focusMessageId = searchParams.get("focus");
  const [formData, setFormData] = useState({
    message_type: "message",
    title: "",
    meeting_link: "",
    message: "",
  });

  const loadMessages = () => {
    axios
      .get(`${baseUrl}/chat/group/${course_id}/?viewer=teacher&teacher_id=${teacherId}`)
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

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const sendMessage = () => {
    if (!formData.message.trim() && !formData.meeting_link.trim()) return;

    const payload = new FormData();
    payload.append("course", course_id);
    payload.append("sender_type", "teacher");
    payload.append("message_type", formData.message_type);
    payload.append("title", formData.title);
    payload.append("meeting_link", formData.meeting_link);
    payload.append("message", formData.message);

    axios
      .post(`${baseUrl}/chat/group/send/`, payload)
      .then(() => {
        setFormData({
          message_type: "message",
          title: "",
          meeting_link: "",
          message: "",
        });
        loadMessages();
        Swal.fire({
          title: "Group post sent",
          icon: "success",
          toast: true,
          timer: 2200,
          position: "top-right",
          showConfirmButton: false,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="course-group-page">
      <div className="course-group-shell">
        <div className="course-group-header">
          <h3>{courseTitle}</h3>
          <span>Teacher group room</span>
        </div>

        <div className="course-group-composer">
          <div className="composer-grid">
            <select
              name="message_type"
              value={formData.message_type}
              onChange={handleChange}
              className="form-control group-input"
            >
              <option value="message">Normal Message</option>
              <option value="instruction">Instruction</option>
              <option value="meeting">Meeting Link</option>
            </select>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control group-input"
              placeholder="Post title"
            />
          </div>

          {formData.message_type === "meeting" && (
            <input
              type="url"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={handleChange}
              className="form-control group-input mt-3"
              placeholder="Meeting link"
            />
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control group-input group-textarea mt-3"
            placeholder="Write message, instruction, or meeting note"
          />

          <button className="btn group-send-btn mt-3" onClick={sendMessage}>
            Send to Group
          </button>
        </div>

        <div className="course-group-feed">
          {messages.length === 0 ? (
            <p className="group-empty">No group posts yet.</p>
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
                    Open Meeting Link
                  </a>
                )}

                <div className="group-meta">
                  {msg.sender_type === "teacher" ? "Teacher" : msg.student_name || "Student"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseGroupChat;
