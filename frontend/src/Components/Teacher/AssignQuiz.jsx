import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "./AssignQuiz.css";

const baseUrl = "http://127.0.0.1:8000/api";

const AssignQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [courseData, setCourseData] = useState({});
  const teacherId = localStorage.getItem("teacherId");
  const { course_id } = useParams();

  // ✅ Load course + quizzes with assigned status
  const loadData = () => {
    axios
      .get(`${baseUrl}/teacher-course-quizzes/${teacherId}/${course_id}/`)
      .then((res) => setQuizData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${baseUrl}/course/${course_id}`)
      .then((res) => setCourseData(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    document.title = "LMS | Assign Quiz";
    loadData();
  }, [teacherId, course_id]);

  const assignQuiz = (quiz_id) => {
    const _formData = new FormData();
    _formData.append("teacher", teacherId);
    _formData.append("course", course_id);
    _formData.append("quiz", quiz_id);

    axios
      .post(`${baseUrl}/quiz-assign-course/`, _formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Successfully Assigned Quiz!",
            icon: "success",
            toast: true,
            timer: 2500,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // ✅ refresh list after assigning
          loadData();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              Assign Quiz for {courseData.title}
            </h5>

            <div className="card-body">
              <div className="table-scroll">
               <table className="table table-bordered assignquiz-table">
                <thead>
                  <tr>
                    <th>Quiz Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {quizData.length > 0 ? (
                    quizData.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <Link to={`/all-questions/${row.id}`}>
                            {row.title}
                          </Link>
                        </td>

                        <td>
                          {row.assigned ? (
                            <span className="badge bg-success">Assigned</span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            onClick={() => assignQuiz(row.id)}
                            disabled={row.assigned}
                            className={`btn btn-sm ${
                              row.assigned ? "btn-secondary" : "btn-success"
                            }`}
                          >
                            {row.assigned ? "Already Assigned" : "Assign"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No quizzes available
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

export default AssignQuiz;
