// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Header = () => {
//   const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
//   const studentLoginStatus = localStorage.getItem("studentLoginStatus");

//   const [searchString, setSearchString] = useState({
//     search: "",
//   });

//   const handleChange = (event) => {
//     setSearchString({
//       ...searchString,
//       [event.target.name]: event.target.value,
//     });
//   };

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg bg-white navbar-light shadow fixed-top p-0">

//         {/* Brand */}
//         <Link to="/" className="navbar-brand px-4 px-lg-5 d-flex align-items-center">
//           <h2 className="m-0 text-primary">
//             <i className="bi bi-book-half ms-1"></i> 
//             <span className="ms-2">NeubAitics AI School</span>
//           </h2>
//         </Link>

//         {/* Mobile Toggle */}
//         <button
//           type="button"
//           className="navbar-toggler me-4"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarCollapse"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Items */}
//         <div className="collapse navbar-collapse" id="navbarCollapse">
//           <div className="navbar-nav ms-auto p-4 p-lg-0">

//             {/* Normal Links */}
//             <Link to="/" className="nav-item nav-link">Home</Link>
//             <Link to="/blog" className="nav-item nav-link">Blog</Link>
            
//             <Link to="/category" className="nav-item nav-link">Category</Link>
//             <Link to="/all-courses" className="nav-item nav-link">Courses</Link>
//             <Link to="/work-shop" className="nav-item nav-link">WorkShop & Events</Link>

//             {/* TEACHER MENU */}
//             <div className="nav-item dropdown">
//               <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Teacher
//               </a>
//               <div className="dropdown-menu fade-down m-0">
//                 {teacherLoginStatus !== "true" && (
//                   <>
//                     <Link className="dropdown-item" to="/teacher-login">Login</Link>
//                     <Link className="dropdown-item" to="/teacher-register">Register</Link>
//                   </>
//                 )}

//                 {teacherLoginStatus === "true" && (
//                   <>
//                     <Link className="dropdown-item" to="/teacher-dashboard">Dashboard</Link>
//                     <Link className="dropdown-item" to="/teacher-logout">Logout</Link>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* STUDENT MENU */}
//             <div className="nav-item dropdown">
//               <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Student
//               </a>
//               <div className="dropdown-menu fade-down m-0">
//                 {studentLoginStatus !== "true" && (
//                   <>
//                     <Link className="dropdown-item" to="/user-login">Login</Link>
//                     <Link className="dropdown-item" to="/user-register">Register</Link>
//                   </>
//                 )}

//                 {studentLoginStatus === "true" && (
//                   <>
//                     <Link className="dropdown-item" to="/user-dashboard">Dashboard</Link>
//                     <Link className="dropdown-item" to="/user-logout">Logout</Link>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* ADMIN */}
//             <a
//               className="nav-link nav-item"
//               target="__blank"
//               href="http://127.0.0.1:8000/admin/login/?next=/admin/"
//             >
//               Admin
//             </a>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Header;













import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  const studentLoginStatus = localStorage.getItem("studentLoginStatus");

  const [searchString, setSearchString] = useState({
    search: "",
  });

  const handleChange = (event) => {
    setSearchString({
      ...searchString,
      [event.target.name]: event.target.value,
    });
  };

  // ✅ Close navbar in mobile after click
  const closeNavbar = () => {
    const navbar = document.getElementById("navbarCollapse");
    if (navbar) {
      const bsCollapse =
        window.bootstrap.Collapse.getInstance(navbar) ||
        new window.bootstrap.Collapse(navbar, { toggle: false });
      bsCollapse.hide();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top p-0">

        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand px-4 px-lg-5 d-flex align-items-center"
          onClick={closeNavbar}
        >
          <h2 className="m-0 text-primary">
            <i className="bi bi-book-half ms-1"></i>
            <span className="ms-2">NeubAitics AI School</span>
          </h2>
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">

            {/* Normal Links */}
            <Link to="/" className="nav-item nav-link" onClick={closeNavbar}>Home</Link>
            <Link to="/blog" className="nav-item nav-link" onClick={closeNavbar}>Blog</Link>
            <Link to="/category" className="nav-item nav-link" onClick={closeNavbar}>Category</Link>
            <Link to="/all-courses" className="nav-item nav-link" onClick={closeNavbar}>Courses</Link>
            <Link to="/work-shop" className="nav-item nav-link" onClick={closeNavbar}>WorkShop & Events</Link>
            <Link to="/faq" className="nav-item nav-link" onClick={closeNavbar}>FAQ</Link>

            {/* TEACHER MENU */}
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                data-bs-toggle="dropdown"
              >
                Teacher
              </button>
              <div className="dropdown-menu fade-down m-0">
                {teacherLoginStatus !== "true" && (
                  <>
                    <Link className="dropdown-item" to="/teacher-login" onClick={closeNavbar}>Login</Link>
                    <Link className="dropdown-item" to="/teacher-register" onClick={closeNavbar}>Register</Link>
                  </>
                )}

                {teacherLoginStatus === "true" && (
                  <>
                    <Link className="dropdown-item" to="/teacher-dashboard" onClick={closeNavbar}>Dashboard</Link>
                    <Link className="dropdown-item" to="/teacher-logout" onClick={closeNavbar}>Logout</Link>
                  </>
                )}
              </div>
            </div>

            {/* STUDENT MENU */}
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                data-bs-toggle="dropdown"
              >
                Student
              </button>
              <div className="dropdown-menu fade-down m-0">
                {studentLoginStatus !== "true" && (
                  <>
                    <Link className="dropdown-item" to="/user-login" onClick={closeNavbar}>Login</Link>
                    <Link className="dropdown-item" to="/user-register" onClick={closeNavbar}>Register</Link>
                  </>
                )}

                {studentLoginStatus === "true" && (
                  <>
                    <Link className="dropdown-item" to="/user-dashboard" onClick={closeNavbar}>Dashboard</Link>
                    <Link className="dropdown-item" to="/user-logout" onClick={closeNavbar}>Logout</Link>
                  </>
                )}
              </div>
            </div>

            {/* ADMIN */}
            <a
              className="nav-link nav-item"
              target="__blank"
              href="http://127.0.0.1:8000/admin/login/?next=/admin/"
              onClick={closeNavbar}
            >
              Admin
            </a>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

