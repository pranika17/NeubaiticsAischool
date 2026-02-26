import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TeacherSidebar from "./TeacherSidebar";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import './TeacherChatBox.css';

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherChatBox = () => {
  const { studentId } = useParams();
  const teacherId = localStorage.getItem("teacherId");

  const [chatData, setChatData] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [studentImage, setStudentImage] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chats
  const fetchChats = () => {
    axios
      .get(`${baseUrl}/chat/individual/${teacherId}/${studentId}/`)
      .then((res) => setChatData(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch student name
const fetchStudentName = () => {
  axios
    .get(`${baseUrl}/teacher/chat-dashboard/${teacherId}/`)
    .then((res) => {
      const student = res.data.individuals.find(
        (s) => s.id === parseInt(studentId)
      );
      if (student) {
        setStudentName(student.name);
        setStudentImage(student.profile_img); // ✅
      }
    })
    .catch((err) => console.error(err));
};


  useEffect(() => {
    fetchChats();
    fetchStudentName();
  }, [studentId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  // Auto-expand textarea
  const handleInputChange = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Send message
  const sendMessage = () => {
    if (!msg && !image) return;

    const formData = new FormData();
    formData.append("teacher", teacherId);
    formData.append("student", studentId);
    formData.append("sender", "teacher");
    if (msg) formData.append("message", msg);
    if (image) formData.append("image", image);

    axios
      .post(`${baseUrl}/chat/individual/send/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setMsg("");
        setImage(null);
        setShowEmoji(false);
        if (inputRef.current) inputRef.current.style.height = "40px";
        fetchChats();
      });
  };

  // Delete message
  const deleteMessage = (id) => {
    axios.delete(`${baseUrl}/chat/individual/delete/${id}/`).then(() => fetchChats());
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row h-100">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">

          
          <div className="glass-card chat-wrapper">
            {/* HEADER */}
            <div className="chat-header">
  <div className="chat-profile">
    <div className="avatar">
      <img
        src={
          studentImage
            ? `http://127.0.0.1:8000${studentImage}`
            : "/default-avatar.png"
        }
        alt={studentName}
      />
    </div>

    <span className="student-name">
      {studentName || "Loading..."}
    </span>
  </div>
</div>

            {/* CHAT BODY */}
            <div className="chat-body">
              {chatData.map((chat, index) => {
                const isLast = index === chatData.length - 1;
                const sender = chat.sender ? chat.sender.toLowerCase() : "student";
                const isTeacher = sender === "teacher";

                return (
                  <div
                    key={chat.id}
                    ref={isLast ? scrollRef : null}
                    className={`chat-row ${isTeacher ? "chat-right" : "chat-left"}`}

                    
                  >


                    
                    <div className={`chat-bubble ${isTeacher ? "teacher-msg" : "student-msg"}`}>
                      {chat.message && <div className="chat-text">{chat.message}</div>}
                      {chat.image && <img src={chat.image} alt="sent" className="chat-image" />}

                      <div
                        className="msg-actions"
                        onClick={() =>
                          setOpenMenuId(openMenuId === chat.id ? null : chat.id)
                        }
                      >
                        ⋮
                        {openMenuId === chat.id && (
                          <div className="msg-menu">
                            {isTeacher && (
                              <button onClick={() => deleteMessage(chat.id)}>🗑 Delete</button>
                            )}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(chat.message || "")
                              }
                            >
                              📋 Copy
                            </button>
                            <button onClick={() => alert("Reply coming soon")}>↩ Reply</button>
                          </div>
                        )}
                      </div>

                      {isTeacher && (
                        <span className="seen-tick">{chat.is_read ? "✔✔" : "✔"}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="chat-footer">
              <button
                className="btn attach-btn"
                onClick={() => document.getElementById("fileInput").click()}
              >
                +
              </button>

              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => setImage(e.target.files[0])}
              />

              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Type a message..."
                value={msg}
                onChange={handleInputChange}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
                }
              />

              <button className="emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>
                😊
              </button>

              <button className="btn chat-send-btn" onClick={sendMessage}>
                Send
              </button>

              {showEmoji && (
                <div className="emoji-box">
                  <Picker
                    data={data}
                    onEmojiSelect={(e) => setMsg((prev) => prev + e.native)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherChatBox;
