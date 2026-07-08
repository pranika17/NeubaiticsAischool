import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import AIAssistantWidget from "../Common/AIAssistantWidget";
import PageBackButton from "../Common/PageBackButton";
import HomeMenuButton from "../Common/HomeMenuButton";
import watermark from "../../assets/imageofai.webp";
import "./Userlayout.css";
import { baseUrl } from '../../config';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState("Student");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`${baseUrl}/student/${studentId}/`)
      .then((res) => {
        const name = res?.data?.fullname || res?.data?.username || "Student";
        setStudentName(name);
      })
      .catch(() => {
        setStudentName("Student");
      });
  }, [studentId]);

  return (
    <>
      <div
        className={`user-page-controls ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="user-controls-left">
          <PageBackButton fallback="/user-dashboard" />
        </div>
        <div className="user-controls-center">
          <div className="user-controls-copy">
            
            <span className="user-welcome-text">Welcome, {studentName}</span>
            
          </div>
        </div>
        <div className="user-controls-right">
          <HomeMenuButton />
          <button
            className="user-mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="user-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="layout-wrapper">

        {/* SIDEBAR */}
        <div className={`user-sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* MAIN CONTENT */}
        <div className="user-main-wrapper">

          <div
            className="user-background-layer"
            style={{ backgroundImage: `url(${watermark})` }}
          />

          <div className="user-overlay-layer" />

          <main className="user-main-content">
            <div className="app-page-shell user-page-shell">
              {children}
            </div>
          </main>

        </div>
      </div>

      <AIAssistantWidget
        role="student"
        userId={studentId}
        title="Student AI Assistant"
      />
    </>
  );
};

export default UserLayout;
