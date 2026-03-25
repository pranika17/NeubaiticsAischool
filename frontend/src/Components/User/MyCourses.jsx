import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./mycourse.css";

const baseUrl = "http://127.0.0.1:8000/api";


const MyCourses = () => {
  const studentId = localStorage.getItem("studentId");

  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [groupUnreadMap, setGroupUnreadMap] = useState({});
  const navigate = useNavigate();

  // ✅ NEW: progress map
  const [progressMap, setProgressMap] = useState({});
  const [interviewMap, setInterviewMap] = useState({});

  useEffect(() => {
    document.title = "LMS | My Courses";
  }, []);

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`${baseUrl}/fetch-enrolled-courses/${studentId}`)
      .then((res) => setCourseData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    axios
      .get(`${baseUrl}/unread-group-count/${studentId}/`)
      .then((res) => {
        const courses = Array.isArray(res.data?.courses) ? res.data.courses : [];
        const nextMap = courses.reduce((acc, item) => {
          acc[item.course_id] = item;
          return acc;
        }, {});
        setGroupUnreadMap(nextMap);
      })
      .catch((err) => console.log(err));
  }, [studentId]);

  // ✅ fetch certificate status for each course (only when popup open)
  const loadProgressForCourses = async (courses) => {
    try {
      const map = {};
      const nextInterviewMap = {};

      for (const course of courses) {
        const res = await axios.get(
          `${baseUrl}/certificate-status/${studentId}/${course.id}/`
        );
        map[course.id] = res.data;

        try {
          const interviewRes = await axios.get(
            `${baseUrl}/interview/eligibility/${studentId}/${course.id}/`
          );
          nextInterviewMap[course.id] = interviewRes.data;
        } catch (error) {
          nextInterviewMap[course.id] = null;
        }
      }

      setProgressMap(map);
      setInterviewMap(nextInterviewMap);
    } catch (err) {
      console.log(err);
    }
  };

  // Group by teacher
  const groupedByTeacher = courseData.reduce((acc, item) => {
    if (!item.course || !item.course.teacher) return acc;

    const teacherId = item.course.teacher.id;
    const existing = acc.find((t) => t.teacher.id === teacherId);

    if (existing) {
      existing.courses.push(item.course);
    } else {
      acc.push({
        teacher: item.course.teacher,
        courses: [item.course],
      });
    }
    return acc;
  }, []);

  // ✅ Progress circle component
  const ProgressCircle = ({ percent = 0 }) => {
    const p = Math.max(0, Math.min(100, Number(percent || 0)));
    return (
      <div className="st-circle" style={{ "--p": p }}>
        <div className="st-circle-inner">{p}%</div>
      </div>
    );
  };

  // ✅ Download certificate
const handleCertificate = async (course_id) => {
  try {
    const res = await axios.get(
      `${baseUrl}/generate-certificate/${studentId}/${course_id}/`
    );

    if (!res.data.eligible) {
      Swal.fire("Not Ready", "Complete course & wait for approval", "warning");
      return;
    }

    // ✅ Go to certificate page
    navigate(`/certificate/${studentId}/${course_id}`);

  } catch (err) {
    console.log(err);
    Swal.fire("Error", "Certificate generation failed", "error");
  }
};


  return (
    <div className="student-courses-page">
      <h3 className="page-title">My Courses</h3>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : groupedByTeacher.length === 0 ? (
        <p className="text-center">No courses found</p>
      ) : (
        <div className="course-card-grid">
          {groupedByTeacher.map((group) => (
            <div
              key={group.teacher.id}
              className="course-card"
              onClick={() => {
                setSelectedTeacher(group);
                loadProgressForCourses(group.courses);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="avatar-wrap">
                <img
                  src={group.teacher.image_url || "/default-avatar.png"}
                  className="course-img"
                  alt={group.teacher.full_name}
                />
              </div>

              <h5 className="course-title">{group.teacher.full_name}</h5>

              <p className="course-info">Total Courses: {group.courses.length}</p>

              <button className="glass-btn w-100">View Courses</button>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {selectedTeacher && (
        <div className="popup-overlay" onClick={() => setSelectedTeacher(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{selectedTeacher.teacher.full_name}'s Courses</h5>
              <button className="btn btn-sm btn-danger" onClick={() => setSelectedTeacher(null)}>
                ✕
              </button>
            </div>

            <div className="popup-course-grid">
              {selectedTeacher.courses.map((course) => {
                const info = progressMap[course.id];
                const percent = info?.progress?.overall ?? 0;

                const eligible = info?.progress?.eligible;
                const approved = info?.certificate_approved;
                const pdf = info?.pdf_url;
                const interviewInfo = interviewMap[course.id];
                const interviewAllowed = interviewInfo?.allowed;
                const interviewRecommended = interviewInfo?.recommended;

                return (
                  <div key={course.id} className="course-card popup-course-card">
                    {Number(groupUnreadMap[course.id]?.unread_count || 0) > 0 && (
                      <div className="course-unread-pill">
                        {groupUnreadMap[course.id].unread_count} unread
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="course-title">{course.title}</h6>
                      <ProgressCircle percent={percent} />
                    </div>

                    {/* Status badges */}
                    <div className="st-status-row mt-2">
                      <span className={`st-badge ${info?.progress?.videos?.ok ? "ok" : "no"}`}>
                        Videos {info?.progress?.videos?.ok ? "✅" : "❌"}
                      </span>
                      <span className={`st-badge ${info?.progress?.assignments?.ok ? "ok" : "no"}`}>
                        Assign {info?.progress?.assignments?.ok ? "✅" : "❌"}
                      </span>
                      <span className={`st-badge ${info?.progress?.quiz?.ok ? "ok" : "no"}`}>
                        Quiz {info?.progress?.quiz?.ok ? "✅" : "❌"}
                      </span>
                    </div>

                    <div className="course-actions mt-3">
                      <Link to={`/user/detail/${course.id}`} className="glass-btn">
                        View
                      </Link>

                      <Link to={`/user/study-material/${course.id}`} className="glass-btn">
                        Material
                      </Link>

                      <Link to={`/mock-interviews/${course.id}`} className="glass-btn">
                        AI Interview
                      </Link>

                      <Link
                        to={`/student/course-chat/${course.id}${
                          groupUnreadMap[course.id]?.first_unread_message_id
                            ? `?focus=${groupUnreadMap[course.id].first_unread_message_id}`
                            : ""
                        }`}
                        className="glass-btn"
                      >
                        Group Chat
                      </Link>

                      {/* ✅ Certificate Button */}
                      {eligible ? (
                        approved ? (
                          <button
                            className="glass-btn"
                            onClick={() => handleCertificate(course.id)}
                          >
                            🎓 {pdf ? "Download" : "Generate"}
                          </button>
                        ) : (
                          <button className="glass-btn disabled-btn" disabled>
                            ⏳ Waiting Approval
                          </button>
                        )
                      ) : (
                        <button className="glass-btn disabled-btn" disabled>
                          ❌ Not Completed
                        </button>
                      )}
                    </div>

                    <div className="st-status-row mt-2">
                      <span className={`st-badge ${interviewAllowed ? "ok" : "no"}`}>
                        Interview {interviewAllowed ? "Unlocked" : "Locked"}
                      </span>
                      <span className={`st-badge ${interviewRecommended ? "ok" : "no"}`}>
                        {interviewRecommended ? "Recommended" : "Practice More"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
