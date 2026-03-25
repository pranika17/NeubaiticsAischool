// import React from "react";
// import Header from "../Header";
// import TeacherSidebar from "./TeacherSidebar";
// import Footer from "../Footer";
// import watermark from "../../assets/imageofai.webp";   // <-- FIX PATH


// const TeacherLayout = ({ children }) => {
//   return (
//     <>
//       {/* Fixed Header */}
//       <Header />

//       <div className="d-flex">

//         {/* Fixed Sidebar */}
//         <div
//           style={{
//             width: "250px",
//             position: "fixed",
//             top: "70px",
//             left: 0,
//             height: "100vh",
//             backgroundColor: "#0a1a4a",
//             color: "white",
//             overflowY: "auto",
//           }}
//         >
//           <TeacherSidebar />
//         </div>

    
//         {/* MAIN CONTENT OUTER WRAPPER */}
//         <div
//           style={{
//             marginLeft: "10px",
//             width: "100%",
//             minHeight: "130vh",
//             position: "relative",
//           }}
//         >
//           {/* Background Image */}
// <div
//   style={{
//     position: "absolute",
//     inset: 0,
//     backgroundImage: `url(${watermark})`,
//     backgroundSize: "cover",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//     zIndex: -2,
//     filter: "blur(8px)",           // ✅ BLUR
//     transform: "scale(1.05)"       // ✅ avoids blur edge cut
//   }}
// />

          

//           {/* Blur Overlay */}
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
          
//               background: "rgba(8, 8, 8, 0.35)",   // Dark tint improves visibility
//               zIndex: -1,
//             }}
//           />

//           {/* CONTENT */}
//           <main
//             style={{
//               paddingTop: "90px",
//               paddingLeft: "20px",
//               paddingRight: "20px",
//               color: "white",
//             }}
//           >
//             {children}
//           </main>
//         </div>
//       </div>



//           <div style={{ marginLeft: "250px" }}>
//           <Footer />

//         </div>
    
//     </>
//   );
// };

// export default TeacherLayout;



import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherSidebar from "./TeacherSidebar";
import AIAssistantWidget from "../Common/AIAssistantWidget";
import PageBackButton from "../Common/PageBackButton";
import HomeMenuButton from "../Common/HomeMenuButton";
import watermark from "../../assets/imageofai.webp";
import "./Teacherlayout.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("Teacher");
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (!teacherId) return;

    axios
      .get(`${baseUrl}/teacher/${teacherId}/`)
      .then((res) => {
        const name = res?.data?.full_name || "Teacher";
        setTeacherName(name);
      })
      .catch(() => {
        setTeacherName("Teacher");
      });
  }, [teacherId]);

  return (
    <>
      <div
        className={`teacher-page-controls ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="teacher-controls-left">
          <PageBackButton fallback="/teacher-dashboard" />
        </div>
        <div className="teacher-controls-center">
          <span className="teacher-welcome-text">Welcome, {teacherName} 👋</span>
        </div>
        <div className="teacher-controls-right">
          <HomeMenuButton />
          <button
            className="teacher-mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`bi ${sidebarOpen ? "bi-arrow-left" : "bi-list"}`}></i>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="teacher-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="teacher-layout-wrapper">

        {/* Sidebar */}
        <div
          className={`teacher-sidebar ${sidebarOpen ? "open" : ""}`}
        >
          <TeacherSidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <div className="teacher-main-wrapper">

          {/* Background */}
          <div className="teacher-background-layer"
            style={{ backgroundImage: `url(${watermark})` }}
          />

          <div className="teacher-overlay-layer" />

          <main className="teacher-main-content">
            <div className="app-page-shell teacher-page-shell">
              {children}
            </div>
          </main>

        </div>
      </div>

      <AIAssistantWidget
        role="teacher"
        userId={teacherId}
        title="Teacher AI Assistant"
      />
    </>
  );
};

export default TeacherLayout;

