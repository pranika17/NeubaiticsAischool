// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'

// const TeacherSidebar = () => {
//   useEffect(() => {
//     document.title = 'LMS | Menu'
//   }, [])

//   return (
//     <>
//       <div className="teacher-sidebar">
//         <div className="sidebar-menu">

//           <Link to="/teacher-dashboard" className="menu-item">Dashboard</Link>

//           <div className="menu-title">Courses</div>
//           <Link to="/teacher-my-course" className="menu-sub">My Courses</Link>
//           <Link to="/add-course" className="menu-sub">Add Course</Link>

//           <div className="menu-title">Quizzes</div>
//           <Link to="/teacher-my-quiz" className="menu-sub">My Quizzes</Link>
//           <Link to="/create-quiz" className="menu-sub">Create Quiz</Link>

//           <div className="menu-title">Resources</div>
//           <Link to="/my-resources" className="menu-sub">My Resources</Link>
//           <Link to="/add-resource" className="menu-sub">Add Resource</Link>

//           <div className="menu-title">Assignments</div>
//           <Link to="/my-assignments" className="menu-sub">My Assignments</Link>
//           <Link to="/create-assignment" className="menu-sub">Create Assignment</Link>

//           <div className="menu-title">Students</div>
//           <Link to="/enrolled-students" className="menu-sub">Enrolled Students</Link>
//           <Link to="/student-analytics" className="menu-sub">Student Analytics</Link>

//           <div className="menu-title">Announcements</div>
//           <Link to="/view-announcements" className="menu-sub">View Announcements</Link>
//           <Link to="/add-announcement" className="menu-sub">Add Announcement</Link>

//           <div className="menu-title">Certificates & Achievements</div>
//           <Link to="/generate-certificate" className="menu-sub">Generate Certificate</Link>
//           <Link to="/view-achievements" className="menu-sub">View Achievements</Link>

//           <Link to="/teacher-logout" className="menu-item logout">Logout</Link>

//         </div>
//       </div>

//       <style jsx>{`
//         .teacher-sidebar {
//           position: fixed;
//           left: 0;
//           top: 95px;
//           width: 260px;             /* same width as before */
//           height: auto;
//           background: linear-gradient(180deg, #002b5c, #005f9e);
//           color: white;
//           padding: 15px;
//           border-radius: 0 10px 10px 0;
//           overflow: hidden;
//           z-index: 10;
//         }

//         .sidebar-menu {
//           display: flex;
//           flex-direction: column;
//         }

//         .menu-item {
//           color: #fff;
//           text-decoration: none;
//           padding: 12px 15px;
//           font-size: 16px;
//           font-weight: 600;
//           border-radius: 6px;
//           transition: background 0.2s;
//         }

//         .menu-item:hover {
//           background: rgba(255, 255, 255, 0.15);
//         }

//         .menu-title {
//           margin-top: 20px;
//           margin-bottom: 5px;
//           font-size: 14px;
//           font-weight: 700;
//           opacity: 0.7;
//         }

//         .menu-sub {
//           color: #e6e6e6;
//           text-decoration: none;
//           padding: 10px 20px;
//           font-size: 15px;
//           border-left: 2px solid rgba(255, 255, 255, 0.3);
//           transition: background 0.2s, padding-left 0.2s;
//         }

//         .menu-sub:hover {
//           background: rgba(255, 255, 255, 0.12);
//           padding-left: 25px;
//         }

//         .logout {
//           margin-top: 30px;
//           color: #ffb3b3 !important;
//         }

//         .logout:hover {
//           background: rgba(255, 0, 0, 0.25);
//         }
//       `}</style>
//     </>
//   )
// }

// export default TeacherSidebar

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./TeacherSidebar.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherSidebar = ({ closeSidebar }) => {

  const location = useLocation();
  const teacherId = localStorage.getItem("teacherId");
  const [chatUnread, setChatUnread] = useState(0);
  const [groupUnread, setGroupUnread] = useState(0);

  useEffect(() => {
    document.title = "LMS | Menu";
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    const loadCounts = () => {
      fetch(`${baseUrl}/unread-count/${teacherId}/`)
        .then((res) => res.json())
        .then((data) => setChatUnread(Number(data.count || 0)))
        .catch(() => setChatUnread(0));

      fetch(`${baseUrl}/teacher-group-unread-count/${teacherId}/`)
        .then((res) => res.json())
        .then((data) => setGroupUnread(Number(data.count || 0)))
        .catch(() => setGroupUnread(0));
    };

    loadCounts();
    const timer = setInterval(loadCounts, 10000);
    return () => clearInterval(timer);
  }, [teacherId]);

  const menuItems = [
    { path: "/teacher-dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/teacher-my-course", label: "My Courses", icon: "bi-journal-bookmark", badge: groupUnread },
    { path: "/add-course", label: "Add Course", icon: "bi-plus-circle" },
    { path: "/my-users", label: "My Users", icon: "bi-people", badge: chatUnread },
    { path: "/quiz", label: "All Quiz", icon: "bi-list-check" },
    { path: "/add-quiz", label: "Add Quiz", icon: "bi-plus-square" },
    { path: "/teacher-quiz-page", label: "Quiz Management", icon: "bi-bar-chart" },
    { path: "/teacher-profile-setting", label: "Profile Settings", icon: "bi-gear" },
    { path: "/teacher-change-password", label: "Change Password", icon: "bi-key" },
    { path: "/teacher-logout", label: "Logout", icon: "bi-box-arrow-right", logout: true },
  ];

  return (
  
  <div className="tsidebar-inner">

      <div className="list-group list-group-flush tsidebar-links">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
           <Link
  key={index}
  to={item.path}
  onClick={() => {
    if (window.innerWidth < 992) {
      closeSidebar();
    }
  }}
  className={`tsidebar-link ${isActive ? "active" : ""} ${
    item.logout ? "logout" : ""
  }`}
>

              <i className={`bi ${item.icon} tsidebar-icon`}></i>
              <span>{item.label}</span>
              {item.badge > 0 && <span className="tsidebar-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherSidebar;
