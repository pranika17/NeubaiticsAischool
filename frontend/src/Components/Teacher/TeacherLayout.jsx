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




import React, { useState } from "react";
import Header from "../Header";
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../Footer";
import watermark from "../../assets/imageofai.webp";
import "./Teacherlayout.css";

const TeacherLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header />

      {/* MOBILE MENU BUTTON */}
   <button
  className="mobile-menu-btn"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  <i className={`bi ${sidebarOpen ? "bi-arrow-left" : "bi-list"}`}></i>
</button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="d-flex">

        {/* Sidebar */}
        <div
          className={`teacher-sidebar ${sidebarOpen ? "open" : ""}`}
        >
          <TeacherSidebar />
        </div>

        {/* Main */}
        <div className="teacher-main-wrapper">

          {/* Background */}
          <div className="background-layer"
            style={{ backgroundImage: `url(${watermark})` }}
          />

          <div className="overlay-layer" />

          <main className="teacher-main-content">
            {children}
          </main>

        </div>
      </div>

      <div className="footer-wrapper">
        <Footer />
      </div>
    </>
  );
};

export default TeacherLayout;

