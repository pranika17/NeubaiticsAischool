import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./img.css";
import "./MyUsers.css";

const baseUrl = "http://127.0.0.1:8000/api";

const MyUsers = () => {
  const teacherId = localStorage.getItem("teacherId");
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});

  useEffect(() => {
    document.title = "LMS | Your Candidates";
  }, []);

  useEffect(() => {
    const fetchStudents = () => {
      axios
        .get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}/`)
        .then((res) => setStudentData(res.data))
        .catch((error) => console.log(error));

      axios
        .get(`${baseUrl}/teacher/chat-dashboard/${teacherId}/`)
        .then((res) => {
          const individuals = Array.isArray(res.data?.individuals) ? res.data.individuals : [];
          const nextMap = individuals.reduce((acc, item) => {
            acc[item.id] = Number(item.unread || 0);
            return acc;
          }, {});
          setUnreadMap(nextMap);
        })
        .catch((error) => console.log(error));
    };

    fetchStudents();
    const interval = setInterval(fetchStudents, 10000);
    return () => clearInterval(interval);
  }, [teacherId]);

  const uniqueStudents = studentData.reduce((acc, item) => {
    const existing = acc.find((s) => s.student.id === item.student.id);

    if (existing) {
      const alreadyExists = existing.courses.some((c) => c.id === item.course.id);
      if (!alreadyExists) {
        existing.courses.push({
          id: item.course.id,
          title: item.course.title,
          enrolled_time: item.enrolled_time || "",
        });
      }
    } else {
      acc.push({
        student: item.student,
        courses: [
          {
            id: item.course.id,
            title: item.course.title,
            enrolled_time: item.enrolled_time || "",
          },
        ],
      });
    }
    return acc;
  }, []);

  const placeholderImg =
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=60&name=User";

  return (
    <div className="container mt-4 teacher-page ">
      <div className="row">
        <section className="col-md-9 myusers-section">
          <div className="glass-card">
            <h5 className="glass-card-title">
              <i className="bi bi-people-fill me-2"></i> All Enrolled Candidates
            </h5>

            <div className="table-responsive users-table-wrap">
              <table className="modern-table users-table">
                <thead>
                  <tr>
                    <th className="text-center profile-col">Profile</th>
                    <th className="text-center name-col">Name</th>
                    <th className="text-center actions-col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {uniqueStudents.length > 0 ? (
                    uniqueStudents.map((row, index) => {
                      const assignUrl = `/add-assignment/${teacherId}/${row.student.id}`;

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

                          <td className="text-center">
                            <button
                              type="button"
                              className="student-name-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(row);
                              }}
                            >
                              {row.student.username}
                            </button>
                          </td>

                          <td className="text-center actions-cell">
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
                              className="btn neon-btn whatsapp btn-sm tooltip-btn chat-action-btn"
                              onClick={(e) => e.stopPropagation()}
                              data-title="Chat with Student"
                            >
                              <i className="bi bi-whatsapp"></i>
                              {Number(unreadMap[row.student.id] || 0) > 0 && (
                                <span className="chat-action-badge">
                                  {unreadMap[row.student.id]}
                                </span>
                              )}
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

            {selectedStudent && (
              <div className="details-card-wrap">
                <div className="glass-card details-card">
                  <div className="d-flex justify-content-between align-items-center mb-3 details-head">
                    <h5>{selectedStudent.student.username}'s Enrolled Details</h5>
                    <button className="btn neon-btn btn-sm" onClick={() => setSelectedStudent(null)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                  </div>

                  <div className="table-responsive details-table-wrap">
                    <table className="modern-table details-table">
                    <thead>
                      <tr>
                        <th className="text-center serial-col">#</th>
                        <th>Course Name</th>
                        <th className="text-center date-col">Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.courses.map((c, i) => (
                        <tr key={i}>
                          <td className="text-center">{i + 1}</td>
                          <td>{c.title}</td>
                          <td className="text-center">
                            {c.enrolled_time ? c.enrolled_time.slice(0, 10) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyUsers;
