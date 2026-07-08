


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "./Dashboard.css";

const baseUrl = "http://127.0.0.1:8000/api";

const Dashboard = () => {
  const [dashbarData, setDashbarData] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [progressMetrics, setProgressMetrics] = useState({
    videosDone: 0,
    videosTotal: 0,
    assignmentsDone: 0,
    assignmentsTotal: 0,
    quizzesAttended: 0,
    quizzesTotal: 0,
  });
  const [interviewMetrics, setInterviewMetrics] = useState({
    unlockedCourses: 0,
    recommendedCourses: 0,
    completedInterviews: 0,
  });
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    document.title = "LMS | Student Dashboard";

  
    axios.get(`${baseUrl}/student/dashboard/${studentId}`)
      .then(res => setDashbarData(res.data));

    axios.get(`${baseUrl}/chat/student/unread/${studentId}/`)
      .then(res => setUnreadCount(res.data.unread || 0));

    const loadOverallProgress = async () => {
      try {
        const enrolledRes = await axios.get(`${baseUrl}/fetch-enrolled-courses/${studentId}`);
        const enrollments = Array.isArray(enrolledRes.data) ? enrolledRes.data : [];
        const courses = enrollments
          .map((e) => e?.course)
          .filter(Boolean);

        let videosDone = 0;
        let videosTotal = 0;
        let assignmentsDone = 0;
        let assignmentsTotal = 0;

        if (courses.length > 0) {
          const progressResponses = await Promise.all(
            courses.map((course) =>
              axios
                .get(`${baseUrl}/certificate-status/${studentId}/${course.id}/`)
                .then((r) => r.data)
                .catch(() => null)
            )
          );

          progressResponses.forEach((row) => {
            const p = row?.progress;
            if (!p) return;
            videosDone += Number(p?.videos?.done || 0);
            videosTotal += Number(p?.videos?.total || 0);
            assignmentsDone += Number(p?.assignments?.done || 0);
            assignmentsTotal += Number(p?.assignments?.total || 0);
          });

          const [eligibilityRows, interviewHistoryRes] = await Promise.all([
            Promise.all(
              courses.map((course) =>
                axios
                  .get(`${baseUrl}/interview/eligibility/${studentId}/${course.id}/`)
                  .then((r) => r.data)
                  .catch(() => null)
              )
            ),
            axios.get(`${baseUrl}/student/interviews/${studentId}/`).catch(() => ({ data: [] })),
          ]);

          const unlockedCourses = eligibilityRows.filter((row) => row?.allowed).length;
          const recommendedCourses = eligibilityRows.filter((row) => row?.recommended).length;
          const completedInterviews = (Array.isArray(interviewHistoryRes.data) ? interviewHistoryRes.data : []).filter(
            (item) => item?.status === "completed"
          ).length;

          setInterviewMetrics({
            unlockedCourses,
            recommendedCourses,
            completedInterviews,
          });
        }

        let quizzesTotal = 0;
        let quizzesAttended = 0;
        const quizRes = await axios
          .get(`${baseUrl}/student-assigned-quizzes/${studentId}/`)
          .catch(() => ({ data: [] }));

        const assignedQuizzes = Array.isArray(quizRes.data) ? quizRes.data : [];
        quizzesTotal = assignedQuizzes.length;

        if (quizzesTotal > 0) {
          const attempts = await Promise.all(
            assignedQuizzes.map((q) =>
              axios
                .get(`${baseUrl}/fetch-quiz-attempt-status/${q.id}/${studentId}`)
                .then((r) => Boolean(r?.data?.bool))
                .catch(() => false)
            )
          );
          quizzesAttended = attempts.filter(Boolean).length;
        }

        setProgressMetrics({
          videosDone,
          videosTotal,
          assignmentsDone,
          assignmentsTotal,
          quizzesAttended,
          quizzesTotal,
        });
      } catch {
        setProgressMetrics({
          videosDone: 0,
          videosTotal: 0,
          assignmentsDone: 0,
          assignmentsTotal: 0,
          quizzesAttended: 0,
          quizzesTotal: 0,
        });
        setInterviewMetrics({
          unlockedCourses: 0,
          recommendedCourses: 0,
          completedInterviews: 0,
        });
      }
    };

    loadOverallProgress();
  }, [studentId]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const barData = [
    { name: "Enrolled", value: dashbarData.enrolled_courses || 0 },
    { name: "Favorite", value: dashbarData.favorite_courses || 0 },
    { name: "Completed", value: dashbarData.complete_assignments || 0 },
    { name: "Pending", value: dashbarData.pending_assignments || 0 }
  ];

  const pieData = [
    { name: "Completed", value: dashbarData.complete_assignments || 0 },
    { name: "Pending", value: dashbarData.pending_assignments || 0 }
  ];

  const COLORS = ["#00c9e8", "#1c808d"];
  const chartHeight = isMobile ? 220 : 240;
  const pieHeight = isMobile ? 120 : 110;
  const pieInnerRadius = isMobile ? 34 : 32;
  const pieOuterRadius = isMobile ? 52 : 50;

  const videoPercent = progressMetrics.videosTotal
    ? Math.round((progressMetrics.videosDone / progressMetrics.videosTotal) * 100)
    : 0;
  const assignmentPercent = progressMetrics.assignmentsTotal
    ? Math.round((progressMetrics.assignmentsDone / progressMetrics.assignmentsTotal) * 100)
    : 0;
  const quizPercent = progressMetrics.quizzesTotal
    ? Math.round((progressMetrics.quizzesAttended / progressMetrics.quizzesTotal) * 100)
    : 0;

  return (
    <div className="dashboard-layout">
      {/* <Sidebar /> */}

      <div className="dashboard-content">

        <h4 className="upage-title">Student Dashboard</h4>

        {/* ✅ TOP CARDS */}
       <div className="stats-grid">
  <StatCard title="Enrolled" value={dashbarData.enrolled_courses} icon="bi-journal-bookmark" />
  <StatCard title="Favorites" value={dashbarData.favorite_courses} icon="bi-heart-fill" />
  <StatCard title="Assignments Done" value={dashbarData.complete_assignments} icon="bi-check-circle-fill" />
  <StatCard title="Pending" value={dashbarData.pending_assignments} icon="bi-clock-fill" />
  <StatCard title="Certificates Achieved" value={unreadCount} icon="bi-mortarboard-fill" />
  <StatCard title="Interview Ready" value={interviewMetrics.unlockedCourses} icon="bi-person-workspace" />
</div>


        {/* ✅ MAIN GRID */}
        <div className="dashboard-grid">
          {/* BAR CHART */}
          <div className="chart-card">
            <h6>Course Overview</h6>
            <div className="chart-box">
          <ResponsiveContainer width="100%" height={chartHeight}>
  <BarChart data={barData}>
    <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />

    <XAxis
      dataKey="name"
      tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
      tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
    />

    <YAxis
      tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
      tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
    />

    <Tooltip
      contentStyle={{
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(0,255,255,0.35)",
        borderRadius: "12px",
        color: "#fff",
      }}
      labelStyle={{ color: "#00ffff", fontWeight: 700 }}
      itemStyle={{ color: "#fff" }}
    />

    <Bar dataKey="value" fill="#00c9e8" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
            </div>

          </div>

          {/* AREA CHART */}
          <div className="chart-card">
            <h6>Activity Trend</h6>
            <div className="chart-box">
    <ResponsiveContainer width="100%" height={chartHeight}>
  <AreaChart data={barData}>
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00c9e8" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#00c9e8" stopOpacity={0} />
      </linearGradient>
    </defs>

    <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />

    <XAxis
      dataKey="name"
      tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
      tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
    />

    <YAxis
      tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
      tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
    />

    <Tooltip
      contentStyle={{
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(0,255,255,0.35)",
        borderRadius: "12px",
        color: "#fff",
      }}
      labelStyle={{ color: "#00ffff", fontWeight: 700 }}
      itemStyle={{ color: "#fff" }}
    />

    <Area
      type="monotone"
      dataKey="value"
      stroke="#00c9e8"
      strokeWidth={2}
      fillOpacity={1}
      fill="url(#colorUv)"
    />
  </AreaChart>
</ResponsiveContainer>
            </div>

          </div>

          {/* PIE + CTA */}
          <div className="side-card">
            <h6>Progress</h6>
            <div className="progress-circles">
              <ProgressCircle
                label="Videos"
                percent={videoPercent}
                meta={`${progressMetrics.videosDone}/${progressMetrics.videosTotal}`}
              />
              <ProgressCircle
                label="Assignments"
                percent={assignmentPercent}
                meta={`${progressMetrics.assignmentsDone}/${progressMetrics.assignmentsTotal}`}
              />
              <ProgressCircle
                label="Quiz Attended"
                percent={quizPercent}
                meta={`${progressMetrics.quizzesAttended}/${progressMetrics.quizzesTotal}`}
              />
            </div>

            <div className="pie-chart-wrap">
            <ResponsiveContainer width="100%" height={pieHeight}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={pieInnerRadius}
                  outerRadius={pieOuterRadius}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            </div>

          </div>

          <div className="side-card interview-readiness-card">
            <h6>Interview Readiness</h6>
            <div className="interview-readiness-metrics">
              <div>
                <strong>{interviewMetrics.unlockedCourses}</strong>
                <span>Unlocked Courses</span>
              </div>
              <div>
                <strong>{interviewMetrics.recommendedCourses}</strong>
                <span>Recommended Now</span>
              </div>
              <div>
                <strong>{interviewMetrics.completedInterviews}</strong>
                <span>Completed Interviews</span>
              </div>
            </div>
            <p className="interview-readiness-copy">
              Use AI interviews after course practice to improve self-introduction,
              technical answers, coding explanation, and confidence.
            </p>
            <Link to="/mock-interviews" className="interview-readiness-link">
              Open Mock Interviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ✅ NORMAL STAT CARD */
const StatCard = ({ title, value, icon }) => (
  <div className="stat-card stat-card-flex">
    <div className="stat-text">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value || 0}</div>
    </div>

    <div className="stat-icon">
      <i className={`bi ${icon}`}></i>
    </div>



    
  </div>
);

const ProgressCircle = ({ label, percent, meta }) => {
  const value = Math.max(0, Math.min(100, Number(percent || 0)));
  return (
    <div className="mini-progress">
      <div
        className="mini-progress-ring"
        style={{
          background: `conic-gradient(#00ffff ${value * 3.6}deg, rgba(255,255,255,0.14) 0deg)`,
        }}
      >
        <div className="mini-progress-inner">{value}%</div>
      </div>
      <span>{label}</span>
      <small>{meta}</small>
    </div>
  );
};

/* ✅ QUIZ CARD WITH LINK */
// const QuizCard = () => (
//   <div className="stat-card quiz-card">
//     <span className="stat-title">Take Quiz </span>

//     <Link to="/quizzes" className="quiz-link">
//        <i className="bi bi-pencil-square"></i>
//     </Link>
//   </div>
// );

export default Dashboard;
