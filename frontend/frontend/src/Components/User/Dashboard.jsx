import { baseUrl } from "../../config";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./Dashboard.css";

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

    axios
      .get(`${baseUrl}/student/dashboard/${studentId}`)
      .then((res) => setDashbarData(res.data))
      .catch(() => setDashbarData({}));

    axios
      .get(`${baseUrl}/chat/student/unread/${studentId}/`)
      .then((res) => setUnreadCount(res.data.unread || 0))
      .catch(() => setUnreadCount(0));

    const loadOverallProgress = async () => {
      try {
        const enrolledRes = await axios.get(`${baseUrl}/fetch-enrolled-courses/${studentId}`);
        const enrollments = Array.isArray(enrolledRes.data) ? enrolledRes.data : [];
        const courses = enrollments.map((item) => item?.course).filter(Boolean);

        let videosDone = 0;
        let videosTotal = 0;
        let assignmentsDone = 0;
        let assignmentsTotal = 0;

        if (courses.length > 0) {
          const progressResponses = await Promise.all(
            courses.map((course) =>
              axios
                .get(`${baseUrl}/certificate-status/${studentId}/${course.id}/`)
                .then((res) => res.data)
                .catch(() => null)
            )
          );

          progressResponses.forEach((row) => {
            const progress = row?.progress;
            if (!progress) return;
            videosDone += Number(progress?.videos?.done || 0);
            videosTotal += Number(progress?.videos?.total || 0);
            assignmentsDone += Number(progress?.assignments?.done || 0);
            assignmentsTotal += Number(progress?.assignments?.total || 0);
          });

          const [eligibilityRows, interviewHistoryRes] = await Promise.all([
            Promise.all(
              courses.map((course) =>
                axios
                  .get(`${baseUrl}/interview/eligibility/${studentId}/${course.id}/`)
                  .then((res) => res.data)
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

        const quizRes = await axios
          .get(`${baseUrl}/student-assigned-quizzes/${studentId}/`)
          .catch(() => ({ data: [] }));

        const assignedQuizzes = Array.isArray(quizRes.data) ? quizRes.data : [];
        const quizzesTotal = assignedQuizzes.length;

        let quizzesAttended = 0;
        if (quizzesTotal > 0) {
          const attempts = await Promise.all(
            assignedQuizzes.map((quiz) =>
              axios
                .get(`${baseUrl}/fetch-quiz-attempt-status/${quiz.id}/${studentId}`)
                .then((res) => Boolean(res?.data?.bool))
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

  const enrolledCourses = dashbarData.enrolled_courses || 0;
  const favoriteCourses = dashbarData.favorite_courses || 0;
  const completedAssignments = dashbarData.complete_assignments || 0;
  const pendingAssignments = dashbarData.pending_assignments || 0;

  const barData = [
    { name: "Enrolled", value: enrolledCourses },
    { name: "Favorites", value: favoriteCourses },
    { name: "Completed", value: completedAssignments },
    { name: "Pending", value: pendingAssignments },
  ];

  const chartHeight = isMobile ? 230 : 260;

  const videoPercent = progressMetrics.videosTotal
    ? Math.round((progressMetrics.videosDone / progressMetrics.videosTotal) * 100)
    : 0;
  const assignmentPercent = progressMetrics.assignmentsTotal
    ? Math.round((progressMetrics.assignmentsDone / progressMetrics.assignmentsTotal) * 100)
    : 0;
  const quizPercent = progressMetrics.quizzesTotal
    ? Math.round((progressMetrics.quizzesAttended / progressMetrics.quizzesTotal) * 100)
    : 0;

  const overallCompletion = Math.round((videoPercent + assignmentPercent + quizPercent) / 3) || 0;

  const focusMessage =
    pendingAssignments > 0
      ? `${pendingAssignments} assignment${pendingAssignments > 1 ? "s are" : " is"} waiting for completion.`
      : interviewMetrics.recommendedCourses > 0
      ? `${interviewMetrics.recommendedCourses} course${interviewMetrics.recommendedCourses > 1 ? "s are" : " is"} ready for AI interview practice.`
      : "Your dashboard is clear. Keep learning momentum with your active courses.";

  const quickLinks = [
    {
      title: "My Courses",
      caption: "Continue current lessons and study material.",
      to: "/my-courses",
      icon: "bi-collection-play-fill",
    },
    {
      title: "Assignments",
      caption: "Review pending tasks and completed submissions.",
      to: "/my-assignments",
      icon: "bi-journal-check",
    },
    {
      title: "Quizzes",
      caption: "Attempt tests and track your quiz progress.",
      to: "/quizzes",
      icon: "bi-patch-question-fill",
    },
    {
      title: "Mock Interviews",
      caption: "Practice job-ready answers with AI guidance.",
      to: "/mock-interviews",
      icon: "bi-mic-fill",
    },
  ];

  const progressCards = [
    {
      label: "Videos",
      percent: videoPercent,
      meta: `${progressMetrics.videosDone}/${progressMetrics.videosTotal}`,
      tone: "cyan",
    },
    {
      label: "Assignments",
      percent: assignmentPercent,
      meta: `${progressMetrics.assignmentsDone}/${progressMetrics.assignmentsTotal}`,
      tone: "blue",
    },
    {
      label: "Quiz Attempts",
      percent: quizPercent,
      meta: `${progressMetrics.quizzesAttended}/${progressMetrics.quizzesTotal}`,
      tone: "gold",
    },
  ];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <p className="dashboard-eyebrow">Student workspace</p>
            <h1 className="upage-title">Student Dashboard</h1>
            <p className="dashboard-subtitle">
              Track course progress, stay ahead on assignments, and move into interview practice
              when you are ready.
            </p>
            <div className="dashboard-hero-actions">
              <Link to="/my-courses" className="hero-btn hero-btn-primary">
                Resume Learning
              </Link>
              <Link to="/mock-interviews" className="hero-btn hero-btn-secondary">
                Open Interviews
              </Link>
            </div>
          </div>

          <div className="dashboard-hero-panel">
            <div className="hero-score-card">
              <span className="hero-score-label">Overall Completion</span>
              <strong>{overallCompletion}%</strong>
              <p>{focusMessage}</p>
            </div>
            <div className="hero-score-meta">
              <div>
                <span>Unread Chats</span>
                <strong>{unreadCount}</strong>
              </div>
              <div>
                <span>Interview Ready</span>
                <strong>{interviewMetrics.unlockedCourses}</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="stats-grid">
          <StatCard title="Enrolled Courses" value={enrolledCourses} icon="bi-journal-bookmark-fill" />
          <StatCard title="Favorite Courses" value={favoriteCourses} icon="bi-heart-fill" />
          <StatCard title="Assignments Done" value={completedAssignments} icon="bi-check-circle-fill" />
          <StatCard title="Pending Assignments" value={pendingAssignments} icon="bi-hourglass-split" />
          <StatCard title="Unread Messages" value={unreadCount} icon="bi-chat-left-dots-fill" />
          <StatCard title="Interview Ready" value={interviewMetrics.unlockedCourses} icon="bi-person-workspace" />
        </div>

        <div className="dashboard-grid">
          <div className="chart-card chart-card-wide">
            <div className="card-heading">
              <div>
                <h6>Course Overview</h6>
                <p>Snapshot of your courses, favorites, and assignment status.</p>
              </div>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={barData} barCategoryGap={18}>
                  <CartesianGrid stroke="rgba(148, 231, 255, 0.12)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#d9f7ff", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "rgba(217,247,255,0.24)" }}
                    tickLine={{ stroke: "rgba(217,247,255,0.24)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#d9f7ff", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "rgba(217,247,255,0.24)" }}
                    tickLine={{ stroke: "rgba(217,247,255,0.24)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(90, 180, 255, 0.08)" }}
                    contentStyle={{
                      background: "rgba(8, 17, 28, 0.96)",
                      border: "1px solid rgba(111, 217, 255, 0.35)",
                      borderRadius: "14px",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#9be7ff", fontWeight: 700 }}
                    itemStyle={{ color: "#f5fdff" }}
                  />
                  <Bar dataKey="value" fill="url(#studentBarGradient)" radius={[10, 10, 0, 0]} />
                  <defs>
                    <linearGradient id="studentBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#78e7ff" />
                      <stop offset="100%" stopColor="#2497ff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card chart-card-wide">
            <div className="card-heading">
              <div>
                <h6>Learning Momentum</h6>
                <p>Progress trend built from your active dashboard metrics.</p>
              </div>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={barData}>
                  <defs>
                    <linearGradient id="studentAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#57d6ff" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#57d6ff" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 231, 255, 0.12)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#d9f7ff", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "rgba(217,247,255,0.24)" }}
                    tickLine={{ stroke: "rgba(217,247,255,0.24)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#d9f7ff", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "rgba(217,247,255,0.24)" }}
                    tickLine={{ stroke: "rgba(217,247,255,0.24)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(8, 17, 28, 0.96)",
                      border: "1px solid rgba(111, 217, 255, 0.35)",
                      borderRadius: "14px",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#9be7ff", fontWeight: 700 }}
                    itemStyle={{ color: "#f5fdff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6fe4ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#studentAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="side-card progress-card">
            <div className="card-heading">
              <div>
                <h6>Progress Breakdown</h6>
                <p>See where your learning effort is strongest.</p>
              </div>
            </div>
            <div className="progress-circles">
              {progressCards.map((item) => (
                <ProgressCircle
                  key={item.label}
                  label={item.label}
                  percent={item.percent}
                  meta={item.meta}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>

          <div className="side-card interview-readiness-card">
            <div className="card-heading">
              <div>
                <h6>Interview Readiness</h6>
                <p>Move from study mode into guided practice at the right time.</p>
              </div>
            </div>
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
              Use AI mock interviews after course practice to improve introductions, technical
              explanations, and delivery confidence.
            </p>
            <Link to="/mock-interviews" className="interview-readiness-link">
              Open Mock Interviews
            </Link>
          </div>

          <div className="side-card quick-actions-card">
            <div className="card-heading">
              <div>
                <h6>Quick Actions</h6>
                <p>Shortcuts for the pages students use most.</p>
              </div>
            </div>
            <div className="quick-actions-grid">
              {quickLinks.map((item) => (
                <Link key={item.title} to={item.to} className="quick-action-item">
                  <div className="quick-action-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.caption}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const ProgressCircle = ({ label, percent, meta, tone }) => {
  const value = Math.max(0, Math.min(100, Number(percent || 0)));
  return (
    <div className={`mini-progress mini-progress-${tone}`}>
      <div
        className="mini-progress-ring"
        style={{
          background: `conic-gradient(var(--progress-accent) ${value * 3.6}deg, rgba(255,255,255,0.14) 0deg)`,
        }}
      >
        <div className="mini-progress-inner">{value}%</div>
      </div>
      <span>{label}</span>
      <small>{meta}</small>
    </div>
  );
};

export default Dashboard;
