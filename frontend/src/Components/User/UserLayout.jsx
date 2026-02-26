// // import React from "react";
// // import Header from "../Header";
// // import Sidebar from "./Sidebar";
// // import Footer from "../Footer";
// // import watermark from "../../assets/imageofai.webp"; // ✅ same background as teacher

// // const UserLayout = ({ children }) => {
// //   return (
// //     <>
// //       {/* Fixed Header */}
// //       <Header />

// //       <div className="d-flex">
// //         {/* Fixed Sidebar */}
// //         <div
// //           style={{
// //             width: "250px",
// //             position: "fixed",
// //             top: "70px",
// //             left: 0,
// //             height: "100vh",
// //             backgroundColor: "#0a1a4a",
// //             color: "white",
// //             overflowY: "auto",
// //             zIndex: 999, // ✅ keep sidebar top
// //           }}
// //         >
// //           <Sidebar />
// //         </div>

// //         {/* ✅ MAIN CONTENT OUTER WRAPPER (same like teacher) */}
// //         <div
// //           style={{
// //             marginLeft: "10px",
// //             width: "100%",
// //             minHeight: "130vh",
// //             position: "relative",  // ✅ required for background layers
// //           }}
// //         >
// //           {/* Background Image */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               inset: 0,
// //               backgroundImage: `url(${watermark})`,
// //               backgroundSize: "cover",
// //               backgroundRepeat: "no-repeat",
// //               backgroundPosition: "center",
// //               zIndex: -2,
// //               filter: "blur(8px)",           // ✅ BLUR
// //               transform: "scale(1.05)"       // ✅ avoids blur edge cut
// //             }}
// //           />

// //           {/* ✅ Blur Overlay / dark layer */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               inset: 0,
// //               background: "rgba(22, 13, 13, 0.35)",
// //               zIndex: -1,
// //             }}
// //           />

// //           {/* ✅ Main Content */}
// //           <main
// //             style={{
// //               paddingTop: "90px",
// //               paddingLeft: "20px",
// //               paddingRight: "20px",
// //               color: "white", // ✅ matches teacher layout
// //             }}
// //           >
// //             {children}
// //           </main>
// //         </div>
// //       </div>

// //       {/* Footer */}
// //       <div style={{ marginLeft: "250px" }}>
// //         <Footer />
// //       </div>
// //     </>
// //   );
// // };

// // export default UserLayout;



// import React, { useState } from "react";
// import Header from "../Header";
// import Sidebar from "./Sidebar";
// import Footer from "../Footer";
// import watermark from "../../assets/imageofai.webp";
// import "./Userlayout.css"; // ✅ new css file

// const UserLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//       <Header />

//       {/* MOBILE BUTTON */}
//       <button
//         className="mobile-menu-btn"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <i className={`bi ${sidebarOpen ? "bi-arrow-left" : "bi-list"}`}></i>
//       </button>

//       {/* OVERLAY */}
//       {sidebarOpen && (
//         <div
//           className="mobile-overlay"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div className="d-flex">

//         {/* SIDEBAR */}
//         <div className={`user-sidebar ${sidebarOpen ? "open" : ""}`}>
//          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
//         </div>

//         {/* MAIN */}
//         <div className="user-main-wrapper">

//           <div
//             className="background-layer"
//             style={{ backgroundImage: `url(${watermark})` }}
//           />

//           <div className="overlay-layer" />

//           <main className="user-main-content">
//             {children}
//           </main>

//         </div>
//       </div>

//       <div className="footer-wrapper">
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default UserLayout;




import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Footer from "../Footer";
import watermark from "../../assets/imageofai.webp";
import "./Userlayout.css";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header />

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
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
            className="background-layer"
            style={{ backgroundImage: `url(${watermark})` }}
          />

          <div className="overlay-layer" />

          <main className="user-main-content">
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

export default UserLayout;