import React from "react";
import PageBackButton from "./PageBackButton";
import HomeMenuButton from "./HomeMenuButton";
import "./ControlsOnlyLayout.css";

const ControlsOnlyLayout = ({ children }) => {
  const isTeacher = localStorage.getItem("teacherLoginStatus") === "true";
  const fallback = isTeacher ? "/teacher-dashboard" : "/user-dashboard";

  return (
    <div className="controls-only-layout">
      <div className="controls-only-topbar">
        <PageBackButton fallback={fallback} />
        <HomeMenuButton />
      </div>
      <main className="controls-only-content">{children}</main>
    </div>
  );
};

export default ControlsOnlyLayout;
