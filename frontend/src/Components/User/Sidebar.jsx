

// import React, { useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./Sidebar.css";

// const Sidebar = ({ closeSidebar }) => {
//   const location = useLocation();

//   useEffect(() => {
//     document.title = "LMS | Student Menu";
//   }, []);

//   const menuItems = [
//     { path: "/user-dashboard", label: "Dashboard", icon: "bi-speedometer2" },
//     { path: "/my-courses", label: "My Courses", icon: "bi-journal-bookmark" },
//     { path: "/favorite-courses", label: "Favorite Courses", icon: "bi-heart-fill" },
//     { path: "/my-teachers", label: "My Teachers", icon: "bi-people-fill" },
//     { path: "/recommended-courses", label: "Recommended Courses", icon: "bi-stars" },
//     { path: "/my-assignments", label: "Assignments", icon: "bi-card-checklist" },
//     { path: "/quizzes", label: "Take Quiz", icon: "bi-pencil-square" },

//     { path: "/profile-setting", label: "Profile Settings", icon: "bi-gear" },
//     { path: "/change-password", label: "Change Password", icon: "bi-shield-lock" },
//     { path: "/user-logout", label: "Logout", icon: "bi-box-arrow-right", logout: true },
//   ];

//   return (
//     <div className="student-sidebar">
      

//       <div className="sidebar-menu">
//         {menuItems.map((item, index) => {
//           const isActive = location.pathname === item.path;

//           return (
//           <Link
//   key={index}
//   to={item.path}
//   onClick={() => {
//     if (window.innerWidth < 992 ) {
//       closeSidebar();
//     }
//   }}
//   className={`sidebar-link ${isActive ? "active" : ""} ${
//     item.logout ? "logout" : ""
//   }`}
// >
//               <i className={`bi ${item.icon}`} style={{ fontSize: "18px" }}></i>
//               <span>{item.label}</span>
              
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = "LMS | Student Menu";
  }, []);

  const menuItems = [
    { path: "/user-dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/my-courses", label: "My Courses", icon: "bi-journal-bookmark" },
    { path: "/favorite-courses", label: "Favorite Courses", icon: "bi-heart-fill" },
    { path: "/my-teachers", label: "My Teachers", icon: "bi-people-fill" },
    { path: "/recommended-courses", label: "Recommended Courses", icon: "bi-stars" },
    { path: "/my-assignments", label: "Assignments", icon: "bi-card-checklist" },
    { path: "/quizzes", label: "Take Quiz", icon: "bi-pencil-square" },
    { path: "/profile-setting", label: "Profile Settings", icon: "bi-gear" },
    { path: "/change-password", label: "Change Password", icon: "bi-shield-lock" },
    { path: "/user-logout", label: "Logout", icon: "bi-box-arrow-right", logout: true },
  ];

  return (
    <div className="student-sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 992 && closeSidebar) {
                  closeSidebar();
                }
              }}
              className={`sidebar-link ${isActive ? "active" : ""} ${
                item.logout ? "logout" : ""
              }`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;