import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./StudentChatList.css";
import { baseUrl, defaultAvatarUrl, resolveMediaUrl } from '../../config';

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
                      src={resolveMediaUrl(teacher.profile_img, defaultAvatarUrl)}
                      alt={teacher.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatarUrl;
                      }}
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
