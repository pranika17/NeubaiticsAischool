import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { baseUrl, defaultAvatarUrl, resolveMediaUrl } from '../../config';
import "./TeacherChatList.css";
const TeacherChatList = () => {
  const [students, setStudents] = useState([]);
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/chat-dashboard/${teacherId}/`)
      .then((res) => setStudents(res.data.individuals))
      .catch((err) => console.error(err));
  }, [teacherId]);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <TeacherSidebar />
      </aside> */}

      {/* Main Content */}
      <main className="dashboard-main">
        <h2 className="dashboard-title">Chat With Students</h2>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div className="glass-card-header ">
            <h4 className="text-white" >
              <i className="bi bi-chat-left-dots "></i> Students List
            </h4>
          </div>

          <div className="chat-list-wrapper">
            {students.length > 0 ? (
              students.map((student) => (
                <Link
  key={student.id}
  to={`/teacher/chat/${teacherId}/${student.id}`}
  className="chat-list-item"
>
  {/* Left section */}
  <div className="chat-profile">
    <div className="avatar">
      <img
        src={resolveMediaUrl(student.profile_img, defaultAvatarUrl)}
        alt={student.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultAvatarUrl;
        }}
      />
    </div>

    <div className="chat-info">
      <span className="student-name">{student.name}</span>
      <span className="last-message">
        Tap to continue chat
      </span>
    </div>
  </div>

  {/* Right section */}
  <div className="chat-meta">
    <span className="chat-time"> </span>

    {student.unread > 0 && (
      <span className="badge red">{student.unread}</span>
    )}
  </div>
</Link>

              ))
            ) : (
              <div className="empty-data">No students found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherChatList;
