import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AllQuiz.css";
import { baseUrl } from '../../config';

const AllQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [search, setSearch] = useState("");
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    document.title = "LMS | All Quiz";
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    axios.get(`${baseUrl}/teacher-quiz/${teacherId}`).then((res) => setQuizData(res.data));
  };

  const handleDeleteClick = (quiz_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This quiz will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/quiz/${quiz_id}`)
          .then(() => {
            Swal.fire("Deleted!", "Quiz deleted successfully.", "success");
            fetchQuizList();
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete quiz.", "error");
          });
      }
    });
  };

  const filteredQuiz = quizData.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4 allquiz-page">
      <div className="row">
        <section className="col-md-9 allquiz-section">
          <div className="quiz-card">
            <h5 className="card-header">All Quizzes</h5>

            <div className="card-body">
              <div className="d-flex justify-content-between mb-3 align-items-center quiz-toolbar">
                <input
                  type="text"
                  className="form-control w-50 quiz-search cyan-search"
                  placeholder="Search quizzes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="badge text-dark allquiz-total-badge" style={{ background: "#00ffff" }}>
                  Total: {quizData.length}
                </span>
              </div>

              <div className="quiz-table-wrap">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredQuiz.length > 0 ? (
                      filteredQuiz.map((row) => (
                        <tr key={row.id} className="hover-row">
                          <td>
                            <Link
                              to={`/all-questions/${row.id}`}
                              className="fw-semibold text-decoration-none text-info"
                            >
                              {row.title}
                            </Link>
                          </td>

                          <td className="text-center quiz-actions-cell">
                            <div className="quiz-actions-wrap">
                              <Link to={`/edit-question/${row.id}`} className="btn btn-sm neon-btn">
                                Edit
                              </Link>

                              <Link to={`/add-question/${row.id}`} className="btn btn-sm neon-btn">
                                Add Qns
                              </Link>

                              <button
                                onClick={() => handleDeleteClick(row.id)}
                                className="btn btn-sm neon-btn neon-danger"
                              >
                                Delete
                              </button>

                              <Link to={`/all-questions/${row.id}`} className="btn btn-sm neon-btn">
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted py-3">
                          No quizzes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllQuiz;
