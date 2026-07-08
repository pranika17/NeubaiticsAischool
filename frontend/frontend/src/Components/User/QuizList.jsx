import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom'; 
import "./QuizList.css";
import { baseUrl } from '../../config';

const QuizList = () => {
  const [quizList, setQuizList] = useState([]);
  const studentId = localStorage.getItem("studentId");

  // Fetch quizzes
  useEffect(() => {
    if (!studentId) {
      setQuizList([]);
      return;
    }

    axios.get(`${baseUrl}/student-assigned-quizzes/${studentId}/`)
      .then(res => setQuizList(res.data))
      .catch(err => console.log(err));
  }, [studentId]);

  // Set page title
  useEffect(() => {
    document.title = 'LMS | Quizzes';
  }, []);

  return (
    <div className='container mt-4'>
      <div className='row'>
        {/* <aside className='col-md-3'>
          <Sidebar />
        </aside> */}

        <section className='col-md-9'>
  <h4 className="quiz-heading">Available Quizzes</h4>

  <div className='row'>
    {quizList.length === 0 && (
      <p className="text-muted">No enrolled quizzes found.</p>
    )}
    {quizList.map((quiz) => {
      const status = quiz.attempt_status || {};
      const completed = Boolean(status.completed || status.bool);
      const passed = Boolean(status.passed);
      const score = Number(status.score || 0);
      const passMark = Number(status.pass_mark || 60);

      return (
        <div key={quiz.id} className='col-md-4 d-flex align-items-stretch'>
          <div className="quiz-card w-100">
            <div className="d-flex flex-column h-100">
              <h5 className="quiz-title">{quiz.title}</h5>

              {completed && (
                <div className={`quiz-status-box ${passed ? "pass" : "fail"}`}>
                  <strong>Completed</strong>
                  <span>Score: {score}%</span>
                  <span>{passed ? "PASS" : `FAIL - Below ${passMark}%`}</span>
                </div>
              )}

              <Link
                className={`quiz-btn mt-auto ${completed ? "completed" : ""}`}
                to={completed ? `/quiz-result/${quiz.id}/${studentId}` : `/take-quiz/${quiz.id}`}
              >
                {completed ? "View Result" : "Start Quiz"}
              </Link>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

      </div>
    </div>
  );
};

export default QuizList;
