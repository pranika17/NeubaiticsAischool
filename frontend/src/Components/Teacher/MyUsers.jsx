import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TeacherSidebar from "./TeacherSidebar";
import "./img.css";
import "./MyUsers.css";

const baseUrl = "http://127.0.0.1:8000/api";

const MyUsers = () => {
  const teacherId = localStorage.getItem("teacherId");
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    document.title = "LMS | Your Candidates";
  }, []);

  useEffect(() => {
    const fetchStudents = () => {
      axios
        .get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}/`)
        .then((res) => setStudentData(res.data))
        .catch((error) => console.log(error));
    };

    fetchStudents();
    const interval = setInterval(fetchStudents, 10000);
    return () => clearInterval(interval);
  }, [teacherId]);

  // ✅ group same student + multiple courses
  const uniqueStudents = studentData.reduce((acc, item) => {
    const existing = acc.find((s) => s.student.id === item.student.id);

    if (existing) {
      // prevent duplicates course titles
      if (!existing.courses.includes(item.course.title)) {
        existing.courses.push(item.course.title);
      }
    } else {
      acc.push({
        student: item.student,
        courses: [item.course.title],
      });
    }
    return acc;
  }, []);

  const placeholderImg =
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=60&name=User";

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="glass-card">
            <h5 className="glass-card-title">
              <i className="bi bi-people-fill me-2"></i> All Enrolled Candidates
            </h5>

            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th className="text-center">Profile</th>
                    <th>Name</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
             {uniqueStudents.length > 0 ? (
  uniqueStudents.map((row, index) => {
    const assignUrl = `/add-assignment/${teacherId}/${row.student.id}`;
    console.log("✅ ASSIGN URL =", assignUrl);

    return (
      <tr
        key={index}
        className="hover-row"
        onClick={() => setSelectedStudent(row)}
      >
        <td className="text-center">
          <img
            className="imgmeet"
            src={row.student.profile_img || placeholderImg}
            alt="Profile"
          />
        </td>

        <td>{row.student.username}</td>

        <td className="text-center" style={{ whiteSpace: "nowrap" }}>
          <Link
            to={`/show-assignment/${teacherId}/${row.student.id}`}
            className="btn neon-btn btn-sm me-2 tooltip-btn"
            onClick={(e) => e.stopPropagation()}
            data-title="View Assignments"
          >
            <i className="bi bi-list-check"></i>
          </Link>

          <Link
            to={assignUrl}
            className="btn neon-btn btn-sm me-2 tooltip-btn"
            onClick={(e) => e.stopPropagation()}
            data-title="Add Assignment"
          >
            <i className="bi bi-plus-circle"></i>
          </Link>

          <Link
            to={`/teacher/chat/${teacherId}/${row.student.id}`}
            className="btn neon-btn whatsapp btn-sm tooltip-btn"
            onClick={(e) => e.stopPropagation()}
            data-title="Chat with Student"
          >
            <i className="bi bi-whatsapp"></i>
          </Link>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="3" className="text-center muted">
      No students enrolled yet
    </td>
  </tr>
)}

                </tbody>
              </table>
            </div>

            {/* ✅ Student Courses */}
            {selectedStudent && (
              <div className="glass-card mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>{selectedStudent.student.username}'s Courses</h5>
                  <button
                    className="btn neon-btn btn-sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                </div>

                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.courses.map((c, i) => (
                      <tr key={i}>
                        <td>{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyUsers;