import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, Link } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api";

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

  // Delete question
  const handleDelete = (question_id) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Do you really want to delete this question?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/quiz-question/${question_id}/`)
          .then(() => {
            Swal.fire("Deleted!", "Question removed.", "success");
            fetchQuestions();
          })
          .catch(() => Swal.fire("Error", "Unable to delete!", "error"));
      }
    });
  };

  return (
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <div className="col-md-9">
          <div className="card">
            <h4 className="card-header">Questions List</h4>

            <div className="card-body">
              <table className="table table-bordered text-white">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Options</th>
                    <th>Correct</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>

                <tbody>
                  {questionList.map((q, index) => (
                    <tr key={index}>
                      <td>{q.questions}</td>

                      <td>
                        <ul style={{ listStyle: "none", paddingLeft: "0",color:'white' }}>
                          <li>1) {q.ans1}</li>
                          <li>2) {q.ans2}</li>
                          <li>3) {q.ans3}</li>
                          <li>4) {q.ans4}</li>
                        </ul>
                      </td>

                      <td>
                        <strong>{q.right_ans}</strong>
                      </td>

                      {/* <td>
                        <Link
                          to={`/edit-question/${q.id}`}
                          className="btn btn-sm btn-info me-2"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(q.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}

                  {questionList.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No questions added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Link
                to={`/add-question/${quiz_id}`}
                className="btn btn-success mt-3"
              >
                + Add New Question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
