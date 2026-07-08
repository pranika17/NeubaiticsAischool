import React from "react";
import ab from "./about.jpg";

const About = () => {
  const values = [
    "Skilled instructors with practical delivery",
    "Online courses and blended learning support",
    "Teacher interaction and guided feedback",
    "Study materials built for revision and clarity",
    "Weekly assignments that reinforce progress",
    "Self-learning pathways with structure",
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="home-about-image-frame about-page-media">
              <img className="img-fluid home-about-image" src={ab} alt="About NeubAitics" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="home-about-panel about-page-panel">
              <h6 className="section-title text-start text-primary pe-3">About Us</h6>
              <h1 className="mb-4">A learning platform designed to feel ambitious and practical.</h1>
              <p className="mb-4">
                NeubAitics focuses on applied learning experiences where students do more than consume lessons. They
                build, discuss, revise, practice, and connect theory with visible outcomes.
              </p>
              <p className="mb-4">
                The goal is not only to teach concepts, but to create confidence through guided learning, structured
                assignments, mentor access, and project-driven progress.
              </p>
              <div className="row gy-3 gx-3 mb-0">
                {values.map((value) => (
                  <div className="col-sm-6" key={value}>
                    <div className="about-value-chip">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      <span>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
