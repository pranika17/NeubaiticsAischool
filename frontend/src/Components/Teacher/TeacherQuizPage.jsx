import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "./TeacherQuizPage.css"; // 👈 add style file

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherQuizPage = () => {
  const teacher_id = localStorage.getItem("teacherId");
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher-quiz/${teacher_id}`)
      .then((res) => setQuizList(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="glass-card shadow-lg p-4">
           <h3 className="glass-card-title">  Quiz Option</h3>

            <p className="text-light mb-3">Choose which quiz you want to manage.</p>

            {quizList.length === 0 ? (
              <p className="text-danger">⚠ No quizzes found.</p>
            ) : (
              quizList.map((quiz) => (
                <Link
                  key={quiz.id}
                  to={`/teacher-quiz-cards/${quiz.id}`}
                  className="cyan-btn w-100 text-center mb-3"
                >
                  {quiz.title}
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherQuizPage;
