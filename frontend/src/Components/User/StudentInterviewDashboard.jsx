import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../config";
import "./StudentInterview.css";

const INTERVIEW_TYPES = [
  { value: "full", label: "Full Interview" },
  { value: "intro", label: "Self Intro" },
  { value: "technical", label: "Technical" },
  { value: "coding", label: "Coding" },
  { value: "hr", label: "HR" },
];

const StudentInterviewDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");
  const [loading, setLoading] = useState(true);
  const [courseRows, setCourseRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [startingCourseId, setStartingCourseId] = useState(null);

  useEffect(() => {
    document.title = "LMS | Mock Interviews";
  }, []);

  useEffect(() => {
    if (!studentId) {
      setCourseRows([]);
      setHistoryRows([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [enrollmentsRes, historyRes] = await Promise.all([
          axios.get(`${baseUrl}/fetch-enrolled-courses/${studentId}/`),
          axios.get(`${baseUrl}/student/interviews/${studentId}/`),
        ]);

        const enrollments = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [];
        const history = Array.isArray(historyRes.data) ? historyRes.data : [];

        const rows = await Promise.all(
          enrollments
            .filter((item) => item?.course?.id)
            .map(async (item) => {
              const currentCourseId = item.course.id;
              try {
                const eligibilityRes = await axios.get(
                  `${baseUrl}/interview/eligibility/${studentId}/${currentCourseId}/`
                );
                return {
                  course: item.course,
                  eligibility: eligibilityRes.data,
                };
              } catch (error) {
                return {
                  course: item.course,
                  eligibility: null,
                };
              }
            })
        );

        setCourseRows(rows);
        setHistoryRows(history);
      } catch (error) {
        setCourseRows([]);
        setHistoryRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentId]);

  const visibleRows = useMemo(() => {
    if (!courseId) return courseRows;
    return courseRows.filter((row) => String(row.course.id) === String(courseId));
  }, [courseId, courseRows]);

  const latestInterviewMap = useMemo(() => {
    return historyRows.reduce((acc, item) => {
      if (!item?.course) return acc;
      if (!acc[item.course]) {
        acc[item.course] = item;
      }
      return acc;
    }, {});
  }, [historyRows]);

  const handleStartInterview = async (currentCourseId, interviewType) => {
    setStartingCourseId(currentCourseId);
    try {
      const res = await axios.post(`${baseUrl}/interview/start/`, {
        student_id: studentId,
        course_id: currentCourseId,
        interview_type: interviewType,
      });
      const interviewId = res?.data?.interview?.id;
      if (!interviewId) {
        throw new Error("Interview start failed");
      }
      navigate(`/mock-interview/session/${interviewId}`);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.gaps?.[0] ||
        "Unable to start the interview.";
      Swal.fire("Interview Locked", message, "warning");
    } finally {
      setStartingCourseId(null);
    }
  };

  return (
    <div className="student-interview-page">
      <div className="student-interview-hero">
        <div>
          <h3>AI Mock Interviews</h3>
          <p>
            Start course-based interviews after studying chapters, completing assignments,
            and attempting quizzes. The AI interviewer will score your answers and tell you
            exactly what to improve.
          </p>
        </div>
        <div className="student-interview-hero-chip">
          <i className="bi bi-person-workspace"></i>
          <span>{historyRows.length} interviews recorded</span>
        </div>
      </div>

      {loading ? (
        <div className="student-interview-empty">Loading interview readiness...</div>
      ) : visibleRows.length === 0 ? (
        <div className="student-interview-empty">
          No enrolled courses available for interview practice.
        </div>
      ) : (
        <div className="student-interview-grid">
          {visibleRows.map(({ course, eligibility }) => {
            const progress = eligibility?.progress || {};
            const lastInterview = latestInterviewMap[course.id];
            return (
              <div className="student-interview-card" key={course.id}>
                <div className="student-interview-card-top">
                  <div>
                    <h4>{course.title}</h4>
                    <p>{course.techs || "Course-focused interview practice"}</p>
                  </div>
                  <div className={`student-interview-score ${eligibility?.allowed ? "ok" : "hold"}`}>
                    {progress?.overall || 0}%
                  </div>
                </div>

                <div className="student-interview-badges">
                  <span className={`student-pill ${eligibility?.allowed ? "ok" : "no"}`}>
                    {eligibility?.allowed ? "Unlocked" : "Locked"}
                  </span>
                  <span className={`student-pill ${eligibility?.recommended ? "ok" : "warn"}`}>
                    {eligibility?.recommended ? "Recommended Now" : "Need More Practice"}
                  </span>
                </div>

                <div className="student-interview-metrics">
                  <div>Videos: {progress?.videos?.done || 0}/{progress?.videos?.total || 0}</div>
                  <div>Assignments: {progress?.assignments?.done || 0}/{progress?.assignments?.total || 0}</div>
                  <div>Quiz Score: {progress?.quiz?.score || 0}%</div>
                </div>

                {eligibility?.gaps?.length > 0 && (
                  <div className="student-interview-gaps">
                    {eligibility.gaps.slice(0, 3).map((gap, index) => (
                      <div key={index}>
                        <i className="bi bi-arrow-right-short"></i> {gap}
                      </div>
                    ))}
                  </div>
                )}

                <div className="student-interview-actions">
                  {INTERVIEW_TYPES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className="student-interview-btn"
                      disabled={!eligibility?.allowed || startingCourseId === course.id}
                      onClick={() => handleStartInterview(course.id, item.value)}
                    >
                      {startingCourseId === course.id ? "Starting..." : item.label}
                    </button>
                  ))}
                </div>

                {lastInterview && (
                  <div className="student-interview-last">
                    <span>Last score: {lastInterview.overall_score || 0}</span>
                    <Link to={`/mock-interview/report/${lastInterview.id}`}>View Report</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentInterviewDashboard;
