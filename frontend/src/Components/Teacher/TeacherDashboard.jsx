import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "./TeacherDashboard.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherDashboard = () => {
  const teacherId = localStorage.getItem("teacherId");

  const [dashbarData, setDashbarData] = useState({});
  const [students, setStudents] = useState([]);
  const [chatInfo, setChatInfo] = useState({ individuals: [], groups: [] });
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW: progress list
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    document.title = "LMS | Teacher Dashboard";
  }, []);


  const sendMessage = async () => {
  if (!userMessage.trim()) return;

  try {
    setLoading(true);

    const res = await axios.post(`${baseUrl}/ai-chat/`, {
      question: userMessage,
      role: "teacher",
      user_id: teacherId
    });

    setReply(res.data.answer);
    setUserMessage("");
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // Chat info
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/chat-dashboard/${teacherId}/`)
      .then((res) => setChatInfo(res.data))
      .catch((err) => console.log(err));
  }, [teacherId]);

  // Dashboard summary
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/dashboard/${teacherId}/`)
      .then((res) => setDashbarData(res.data))
      .catch((err) => console.log(err));
  }, [teacherId]);

  // Fetch students
  useEffect(() => {
    axios
      .get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}/`)
      .then((res) => {
        const map = new Map();

        res.data.forEach((item) => {
          if (!map.has(item.student.id)) {
            map.set(item.student.id, {
              student: item.student,
              enrolled_time: item.enrolled_time,
              courses: [item.course],
            });
          } else {
            map.get(item.student.id).courses.push(item.course);
          }
        });

        setStudents([...map.values()]);
      })
      .catch((err) => console.log(err));
  }, [teacherId]);

  // ✅ Load progress list for all student+course
  const loadProgress = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/teacher/student-course-progress/${teacherId}/`
      );
      setProgressList(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (teacherId) loadProgress();
    // eslint-disable-next-line
  }, [teacherId]);

  const toggleExpand = (id) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  // ✅ Find progress by student+course
  const getProgressRow = (studentId, courseId) => {
    return progressList.find(
      (x) => x.student?.id === studentId && x.course?.id === courseId
    );
  };

  // ✅ Circular Progress UI
  const ProgressCircle = ({ percent = 0 }) => {
    const p = Math.max(0, Math.min(100, Number(percent || 0)));
    return (
      <div className="td-circle" style={{ "--p": p }}>
        <div className="td-circle-inner">{p}%</div>
      </div>
    );
  };

  // ✅ Approve Certificate
  const approveCertificate = async (student_id, course_id) => {
    Swal.fire({
      title: "Approve Certificate?",
      text: "This will approve certificate for the student.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    }).then(async (r) => {
      if (!r.isConfirmed) return;

      try {
        const res = await axios.post(`${baseUrl}/teacher/approve-certificate/`, {
          student_id,
          course_id,
        });

        Swal.fire("Approved ✅", res.data?.message || "Approved!", "success");
        loadProgress();
      } catch (err) {
        console.log(err);
        Swal.fire("Error", "Approve failed", "error");
      }
    });
  };

  return (
    <div className="tdashboard-wrapper">
      {/* <aside className="tsidebar">
        <TeacherSidebar />
      </aside> */}

      <main className="tdashboard-main">
        <h2 className="tdashboard-title">Dashboard</h2>

        {/* Summary Cards */}
        <div className="card-grid">
          <div className="tglass-card">
            <h5>Total Courses</h5>
            <h2>
              <Link to="/teacher-my-course" className="text-link">
                {dashbarData.total_teacher_course} <i className="bi bi-journals"></i>
              </Link>
            </h2>
          </div>

          <div className="tglass-card">
            <h5>Total Students</h5>
            <h2>
              <Link to="/my-users" className="text-link">
                {dashbarData.total_teacher_students}{" "}
                <i className="bi bi-people-fill"></i>
              </Link>
            </h2>
          </div>

          <div className="tglass-card">
            <h5>Total Chapters</h5>
            <h2>
              <Link to="/teacher-my-course" className="text-link">
                {dashbarData.total_teacher_chapters}{" "}
                <i className="bi bi-stickies-fill"></i>
              </Link>
            </h2>
          </div>

          {/* <div className="tglass-card">
            <h5>Chat With Students</h5>
            <h2>
              <Link to={`/teacher/chat-dashboard/${teacherId}`} className="text-link">
                {chatInfo.individuals.length}{" "}
                <i className="bi bi-chat-left-dots-fill"></i>
              </Link>
            </h2>
          </div> */}
        </div>

        {/* Students Table */}
        <div className="tglass-table">
          <h5 className="table-title">
            <i className="bi bi-people-fill"></i> Enrolled Students
          </h5>

          <table className="modern-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Total Courses</th>
                <th>Latest Enrolled</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="hover-row"
                      onClick={() => toggleExpand(item.student.id)}
                    >
                      <td>{item.student.fullname}</td>
                      <td>{item.student.email}</td>
                      <td>{item.courses.length} Courses</td>
                      <td>{item.enrolled_time?.slice(0, 10)}</td>
                    </tr>

                    {/* ✅ expanded */}
                    {expandedStudent === item.student.id && (
                      <tr className="expand-row">
                        <td colSpan="4">
                          <div className="td-expand-title">
                            <strong>Course Progress:</strong>
                          </div>

                          <div className="td-course-grid">
                            {item.courses.map((c, i) => {
                              const row = getProgressRow(item.student.id, c.id);

                              const percent = row?.progress ?? 0;
                              const eligible = row?.eligible_for_certificate;
                              const approved = row?.certificate_approved;

                              return (
                                <div className="td-course-card" key={i}>
                                  <div className="td-course-top">
                                    <div>
                                      <h6 className="td-course-name">{c?.title}</h6>
                                      <div className="td-course-sub">
                                        Videos: {row?.videos?.done ?? 0}/
                                        {row?.videos?.total ?? 0}
                                      </div>
                                    </div>

                                    <ProgressCircle percent={percent} />
                                  </div>

                                  {/* Status */}
                                  <div className="td-status-row">
                                    <span
                                      className={`td-badge ${
                                        row?.videos_done ? "ok" : "no"
                                      }`}
                                    >
                                      Videos {row?.videos_done ? "✅" : "❌"}
                                    </span>

                                    <span
                                      className={`td-badge ${
                                        row?.assignments_done ? "ok" : "no"
                                      }`}
                                    >
                                      Assignments {row?.assignments_done ? "✅" : "❌"}
                                    </span>

                                    <span
                                      className={`td-badge ${
                                        row?.quiz_passed ? "ok" : "no"
                                      }`}
                                    >
                                      Quiz {row?.quiz_passed ? "✅" : "❌"}
                                    </span>
                                  </div>

                                  {/* Approval Button */}
                                  <div className="td-action">
                                    {eligible ? (
                                      approved ? (
                                        <button className="td-btn td-btn-success" disabled>
                                          Certificate Approved ✅
                                        </button>
                                      ) : (
                                        <button
                                          className="td-btn td-btn-warning"
                                          onClick={() =>
                                            approveCertificate(item.student.id, c.id)
                                          }
                                        >
                                          Approve Certificate
                                        </button>
                                      )
                                    ) : (
                                      <button className="td-btn td-btn-disabled" disabled>
                                        Not Completed
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center muted">
                    No enrolled students yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AI Chat Section */}
        <div className="ai-chat-section mt-4">
          <h4>AI Chat Assistant</h4>
          <div className="ai-chat-container">
            <div className="ai-chat-messages">
              {reply && (
                <div className="ai-message">
                  <strong>AI:</strong> {reply}
                </div>
              )}
            </div>
            <div className="ai-input-group">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask a question about your courses..."
                className="form-control"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;