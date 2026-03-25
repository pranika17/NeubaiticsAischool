import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom'; 
import "./QuizList.css";
const baseUrl = 'http://127.0.0.1:8000/api';

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
    {quizList.map((quiz) => (
      <div key={quiz.id} className='col-md-4 d-flex align-items-stretch'>
        <div className="quiz-card w-100">
          <div className="d-flex flex-column h-100">
            <h5 className="quiz-title">{quiz.title}</h5>

            <Link
              className="quiz-btn mt-auto"
              to={`/take-quiz/${quiz.id}`}
            >
              Start Quiz
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      </div>
    </div>
  );
};

export default QuizList;
