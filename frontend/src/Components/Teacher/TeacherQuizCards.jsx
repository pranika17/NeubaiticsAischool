import React from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import "./TeacherQuizCards.css"; // 👈 import style file (same used for AddQuiz & TeacherQuizPage)

const TeacherQuizCards = () => {
  const { quiz_id } = useParams();

  return (
    <div className="dashboard-page container-fluid py-4">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card shadow-lg mb-4">
            <h3 className="glass-card-title ">Quiz Management</h3>

            <div className="row">
              {/* CARD 1 – Students Attempted */}
              <div className="col-md-6 mb-4">
                <div className="inner-card">
                  <h5 className="card-title text-cyan text-primary">Attempted Students</h5>
                  <p className="card-text text-white">
                    View students who attended this quiz and check basic profile & result status.
                  </p>
                  <Link
                    to={`/teacher-attempted-students/${quiz_id}`}
                    className="cyan-btn mt-2"
                  >
                    View Attempted Students
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherQuizCards;
