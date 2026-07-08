import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./QuestionList.css";
import { baseUrl } from '../../config';

const QuestionList = () => {
  const { quiz_id } = useParams();
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    document.title = "LMS | Quiz Questions";
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios
      .get(`${baseUrl}/quiz-questions/${quiz_id}`)
      .then((res) => {
        setQuestionList(res.data.questions);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid mt-4 questionlist-page">
      <div className="row justify-content-center">
        <div className="col-12 questionlist-section">
          <div className="card questionlist-card">
            <h4 className="card-header questionlist-header">Questions List</h4>

            <div className="card-body">
              <div className="questionlist-table-wrap">
                <table className="table table-bordered questionlist-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Options</th>
                      <th>Correct</th>
                    </tr>
                  </thead>

                  <tbody>
                    {questionList.map((q) => (
                      <tr key={q.id}>
                        <td className="question-cell">{q.questions}</td>

                        <td>
                          <ul className="question-options-list">
                            <li>1) {q.ans1}</li>
                            <li>2) {q.ans2}</li>
                            <li>3) {q.ans3}</li>
                            <li>4) {q.ans4}</li>
                          </ul>
                        </td>

                        <td>
                          <span className="right-answer-badge">{q.right_ans}</span>
                        </td>
                      </tr>
                    ))}

                    {questionList.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center question-empty">
                          No questions added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="questionlist-footer">
                <Link to={`/add-question/${quiz_id}`} className="btn btn-success question-add-btn">
                  + Add New Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
