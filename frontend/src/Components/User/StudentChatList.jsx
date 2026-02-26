import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from './Sidebar'

const baseUrl = "http://127.0.0.1:8000/api";

const StudentChatList = () => {
  const studentId = localStorage.getItem("studentId");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/student/chat-dashboard/${studentId}/`)
      .then((res) => setTeachers(res.data.individuals))
      .catch((err) => console.error(err));
  }, [studentId]);

  return (
     <div className="container mt-4 teacher-page">
          <div className="row">
            {/* <aside className="col-md-3">
              <Sidebar />
            </aside> */}
    <section className="col-md-9">

        <div className="card-header bg-primary text-white">
          <h3 className="p-3 bg-primary text-white">Chat with Teacher</h3>
        </div>
        <div className="list-group list-group-flush">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
            <Link
  key={teacher.id}
  to={`/student/chat/${studentId}/${teacher.id}`}
  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
>
  <div className="d-flex align-items-center">
    {/* Student Avatar */}
  <div className="rounded-circle overflow-hidden me-2" style={{ width: '50px', height: '50px' }}>
  <img
    src={teacher.profile_img ? `http://127.0.0.1:8000${teacher.profile_img}` : '/default-avatar.png'}
    alt={teacher.name}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>

    {/* Student Name */}
    <span>{teacher.name}</span>
  </div>

  {teacher.unread > 0 && (
    <span className="badge bg-danger rounded-pill">
      {teacher.unread}
    </span>
  )}
</Link>

            ))
          ) : (
            <div className="list-group-item text-muted">No teachers found</div>
          )}
        </div>
        </section>
      </div>
    </div>
  );
};

export default StudentChatList;
