import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkShop.css";

const WorkShop = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/workshops/")
      .then(res => setWorkshops(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    
    <div className="workshop-page">
      <section className="hero-section text-center">
        <h1 className="display-5 fw-bold">Workshops & Events</h1>
        <p className="lead mt-3">
          AI learning at NeubAItics happens through live workshops.
        </p>
      </section>

<div className="container-fluid py-5 px-0">
        <h2 className="text-center fw-bold mb-5 section-title">
          Upcoming Highlights
        </h2>

        <div className="row g-4 justify-content-center">
          {workshops.map(workshop => (
            <div key={workshop.id} className="col-md-6 col-lg-4 d-flex">
              <div className="workshop-card">
                <h4 className="card-title">{workshop.title}</h4>
                <p className="card-text">{workshop.description}</p>
                <p><div class="price">₹50,000</div>
</p>

                <button
                  className="btn btn-cyan"
                  onClick={() => window.location.href = `/regwork/${workshop.id}`}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkShop;
