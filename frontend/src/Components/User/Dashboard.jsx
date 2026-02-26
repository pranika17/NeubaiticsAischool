


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

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
  const studentId = localStorage.getItem("studentId");
  const [userMessage, setUserMessage] = useState("");
const [reply, setReply] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "LMS | Student Dashboard";

  
    axios.get(`${baseUrl}/student/dashboard/${studentId}`)
      .then(res => setDashbarData(res.data));

    axios.get(`${baseUrl}/chat/student/unread/${studentId}/`)
      .then(res => setUnreadCount(res.data.unread || 0));
  }, [studentId]);


  const sendMessage = async () => {
  if (!userMessage.trim()) return;

  try {
    setLoading(true);

    const res = await axios.post(`${baseUrl}/ai-chat/`, {
      question: userMessage,
      role: "student",
      user_id: studentId
    });

    setReply(res.data.answer);
    setUserMessage("");
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

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

  return (
    <div className="dashboard-layout">
      {/* <Sidebar /> */}

      <div className="dashboard-content">


        {/* AI Chat Assistant */}
<div className="ai-chat-section mt-4">
  <h4>AI Chat Assistant</h4>

  {reply && (
    <div className="ai-message">
      <strong>AI:</strong> {reply}
    </div>
  )}

  <div className="ai-input-group">
    <input
      type="text"
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
      placeholder="Ask about your enrolled courses..."
      className="form-control"
    />

    <button
      onClick={sendMessage}
      disabled={loading}
      className="btn btn-primary mt-2"
    >
      {loading ? "Thinking..." : "Send"}
    </button>
  </div>
</div>
        <h4 className="upage-title">Student Dashboard</h4>

        {/* ✅ TOP CARDS */}
       <div className="stats-grid">
  <StatCard title="Enrolled" value={dashbarData.enrolled_courses} icon="bi-journal-bookmark" />
  <StatCard title="Favorites" value={dashbarData.favorite_courses} icon="bi-heart-fill" />
  <StatCard title="Assignments Done" value={dashbarData.complete_assignments} icon="bi-check-circle-fill" />
  <StatCard title="Pending" value={dashbarData.pending_assignments} icon="bi-clock-fill" />
  <StatCard title="Certificates Achieved" value={unreadCount} icon="bi-mortarboard-fill" />
</div>


        {/* ✅ MAIN GRID */}
        <div className="dashboard-grid">
          {/* BAR CHART */}
          <div className="chart-card">
            <h6>Course Overview</h6>
          <ResponsiveContainer width="100%" height={280}>
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

          {/* AREA CHART */}
          <div className="chart-card">
            <h6>Activity Trend</h6>
    <ResponsiveContainer width="100%" height={280}>
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

          {/* PIE + CTA */}
          <div className="side-card">
            <h6>Progress</h6>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <Link to="/my-assignments" className="cta-btn">
              View Assignments
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