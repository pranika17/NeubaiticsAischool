import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeMenuButton.css";
import { adminUrl } from "../../config";

const HomeMenuButton = () => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  const studentLoginStatus = localStorage.getItem("studentLoginStatus");

  useEffect(() => {
    const onClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="home-menu-wrap" ref={boxRef}>
      <button
        type="button"
        className="home-menu-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="bi bi-house-door"></i>
        <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
      </button>

      {open && (
        <div className="home-menu-dropdown">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/blog" onClick={() => setOpen(false)}>Blog</Link>
          <Link to="/category" onClick={() => setOpen(false)}>Category</Link>
          <Link to="/all-courses" onClick={() => setOpen(false)}>Courses</Link>
          <Link to="/work-shop" onClick={() => setOpen(false)}>Workshop & Events</Link>

          {teacherLoginStatus === "true" ? (
            <Link to="/teacher-dashboard" onClick={() => setOpen(false)}>Teacher Dashboard</Link>
          ) : (
            <Link to="/teacher-login" onClick={() => setOpen(false)}>Teacher Login</Link>
          )}

          {studentLoginStatus === "true" ? (
            <Link to="/user-dashboard" onClick={() => setOpen(false)}>Student Dashboard</Link>
          ) : (
            <Link to="/user-login" onClick={() => setOpen(false)}>Student Login</Link>
          )}

          <a
            href={adminUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Admin
          </a>
        </div>
      )}
    </div>
  );
};

export default HomeMenuButton;
