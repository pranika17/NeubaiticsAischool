import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageBackButton.css";

const PageBackButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <button
      type="button"
      className="page-back-btn"
      onClick={handleBack}
      aria-label="Go back"
    >
      <i className="bi bi-arrow-left"></i>
    </button>
  );
};

export default PageBackButton;
