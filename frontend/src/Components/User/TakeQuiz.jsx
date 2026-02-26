



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import './TakeQuiz.css';

const baseUrl = 'http://127.0.0.1:8000/api';

const TakeQuiz = () => {
  const studentId = localStorage.getItem('studentId');
  const { quiz_id } = useParams();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    axios.get(`${baseUrl}/quiz-questions/${quiz_id}`)
      .then(res => {
        const questions = res.data.questions || res.data;
        if (questions.length > 0) {
          setQuestionData([questions[0]]);
          setCurrentQuestionId(questions[0].id);
        } else {
          setQuizFinished(true);
        }
      })
      .catch(err => console.error(err));
  }, [quiz_id]);

  const fetchNextQuestion = () => {
    if (!currentQuestionId) return;
    setLoading(true);

    axios.get(`${baseUrl}/quiz-questions/${quiz_id}/next-question/${currentQuestionId}`)
      .then(res => {
        let questions = res.data.questions || res.data;
        if (!questions || questions.length === 0 || res.data.finished) {
          setQuizFinished(true);
          setQuestionData([]);
        } else {
          setQuestionData(questions);
          setCurrentQuestionId(questions[0].id);
          setFeedback(null);
          setCorrectAnswer('');
        }
      })
      .finally(() => setLoading(false));
  };

  const submitAnswer = async (qid, ans) => {
    if (feedback !== null) return;

    const fd = new FormData();
    fd.append("student", studentId);
    fd.append("quiz", quiz_id);
    fd.append("question", qid);
    fd.append("right_ans", ans);

    try {
      const res = await axios.post(`${baseUrl}/attempt-quiz/`, fd);
      setFeedback(res.data.correct ? "correct" : "wrong");
      setCorrectAnswer(res.data.correct_answer);
    } catch {
      setFeedback("wrong");
      setCorrectAnswer("Server error");
    }
  };

if (quizFinished) {
  return (
    <div className="quiz-finish-box text-center">
      <h3>🎉 Quiz Completed!</h3>
      <button className="glass-btn mt-2" onClick={() => navigate(`/quiz-result/${quiz_id}/${studentId}`)}>
        View Result →
      </button>
    </div>
  );
}


  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3"><Sidebar/></aside> */}
        <section className="col-md-9">
          {questionData.map(q => (
            <div className="glass-card" key={q.id}>
              <h4 className="question-title">{q.questions}</h4>
              {[q.ans1, q.ans2, q.ans3, q.ans4].map((ans,i)=>(
                <button key={i}
                  className="answer-btn"
                  disabled={feedback !== null || loading}
                  onClick={() => submitAnswer(q.id, ans)}
                >
                  {ans}
                </button>
              ))}
              {feedback && (
                <div className={`feedback-box ${feedback}`}>
                  {feedback === "correct" ? "✔ Correct!" : "✘ Wrong!"}<br/>
                  Correct Answer: <strong>{correctAnswer}</strong>
                </div>
              )}
              {feedback && <button className="next-btn" onClick={fetchNextQuestion}>Next →</button>}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default TakeQuiz;
