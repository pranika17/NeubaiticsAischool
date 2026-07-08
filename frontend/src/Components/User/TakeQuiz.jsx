import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [codeAnswer, setCodeAnswer] = useState('');
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setAccessError("Please login as student to take this quiz.");
      return;
    }

    axios.get(`${baseUrl}/quiz-questions/${quiz_id}`, {
      params: { student_id: studentId }
    })
      .then(res => {
        const questions = res.data.questions || res.data;
        if (questions.length > 0) {
          setQuestionData([questions[0]]);
          setCurrentQuestionId(questions[0].id);
        } else {
          setQuizFinished(true);
        }
      })
      .catch(err => {
        setAccessError(err.response?.data?.error || "Unable to load quiz.");
        console.error(err);
      });
  }, [quiz_id, studentId]);

  const fetchNextQuestion = () => {
    if (!currentQuestionId) return;
    setLoading(true);

    axios.get(`${baseUrl}/quiz-questions/${quiz_id}/next-question/${currentQuestionId}`, {
      params: { student_id: studentId }
    })
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
          setCodeAnswer('');
        }
      })
      .catch(err => {
        setAccessError(err.response?.data?.error || "Unable to load next question.");
      })
      .finally(() => setLoading(false));
  };

  const submitMCQ = async (qid, ans) => {
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

  const submitCoding = async (qid) => {
    if (!codeAnswer.trim()) return;

    try {
      const res = await axios.post(`${baseUrl}/submit-coding/`, {
        student: studentId,
        quiz: quiz_id,
        question: qid,
        code: codeAnswer
      });

      setFeedback(res.data.correct ? "correct" : "wrong");
      setCorrectAnswer(res.data.solution);
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

  if (accessError) {
    return (
      <div className="take-quiz-page">
        <div className="alert alert-danger">{accessError}</div>
      </div>
    );
  }

  return (
    <div className="take-quiz-page">
      {questionData.map(q => (
        <div className="glass-card" key={q.id}>
          <h4 className="question-title">{q.questions}</h4>

          {/* 🔥 MCQ TYPE */}
          {q.question_type !== "coding" && (
            <>
              {[q.ans1, q.ans2, q.ans3, q.ans4].map((ans, i) => (
                <button
                  key={i}
                  className="answer-btn"
                  disabled={feedback !== null || loading}
                  onClick={() => submitMCQ(q.id, ans)}
                >
                  {ans}
                </button>
              ))}
            </>
          )}

          {/* 🔥 CODING TYPE */}
          {q.question_type === "coding" && (
            <>
              <div className="starter-code-box">
                <h6>Starter Code:</h6>
                <pre>{q.coding_starter_code}</pre>
              </div>

              <textarea
                className="form-control mt-3"
                rows="8"
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                placeholder="Write your solution here..."
                disabled={feedback !== null}
              />

              <button
                className="btn btn-primary mt-2"
                disabled={feedback !== null}
                onClick={() => submitCoding(q.id)}
              >
                Submit Code
              </button>
            </>
          )}

          {feedback && (
            <div className={`feedback-box ${feedback}`}>
              {feedback === "correct" ? "✔ Correct!" : "✘ Wrong!"}
              <br />
              <strong>Solution:</strong>
              <pre>{correctAnswer}</pre>
            </div>
          )}

          {feedback && (
            <button className="next-btn" onClick={fetchNextQuestion}>
              Next →
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TakeQuiz;
