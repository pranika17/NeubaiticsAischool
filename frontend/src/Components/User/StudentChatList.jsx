import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./StudentChatList.css";

const baseUrl = "http://127.0.0.1:8000/api";

const StudentChatList = () => {
  const studentId = localStorage.getItem("studentId");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/student/chat-dashboard/${studentId}/`)
      .then((res) => setTeachers(res.data.individuals || []))
      .catch((err) => console.error(err));
  }, [studentId]);

  return (
    <div className="student-chat-list-page">
      <div className="student-chat-list-card">
        <div className="student-chat-list-header">
          <h3>Chat with Teacher</h3>
        </div>

        <div className="student-chat-list-body">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <Link
                key={teacher.id}
                to={`/student/chat/${studentId}/${teacher.id}`}
                className="student-chat-item"
              >
                <div className="student-chat-item-left">
                  <div className="student-chat-avatar">
                    <img
                      src={
                        teacher.profile_img
                          ? `http://127.0.0.1:8000${teacher.profile_img}`
                          : "/default-avatar.png"
                      }
                      alt={teacher.name}
                    />
                  </div>
                  <span>{teacher.name}</span>
                </div>

                {teacher.unread > 0 && (
                  <span className="student-chat-badge">{teacher.unread}</span>
                )}
              </Link>
            ))
          ) : (
            <div className="student-chat-empty">No teachers found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChatList;
