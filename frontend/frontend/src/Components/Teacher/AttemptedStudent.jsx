import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import './AttemptedStudent.css'
import { baseUrl } from '../../config';

import QuizResult from "./QuizResult";
const AttemptedStudent = () => {
  useEffect(() => {
    document.title = "LMS | All Attempted Students";
  }, []);

  const [studentData, setStudentData] = useState([]);
  const { quiz_id } = useParams();
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (!quiz_id || !teacherId) return;

    axios
      .get(`${baseUrl}/attempted-quiz/${quiz_id}`, {
        params: { teacher_id: teacherId }
      })
      .then((res) => {
        setStudentData(res.data);
      })
      .catch((error) => console.log(error));
  }, [quiz_id, teacherId]);

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
           <div className="teacher-card"></div>
          <div className="glass-card">
             <h3 className="glass-card-title"><i className="bi bi-plus-square"></i> Students Attempted Quiz</h3>
             <div className="glass-card-body">
              <table className="table custom-table text-white">

                <thead>
                  <tr>
                    <th className="cyan-text">Name</th>
                    <th className="cyan-text">Email</th>
                  
                    <th className="cyan-text">Result</th>
                  </tr>
                </thead>

                <tbody>
                  {studentData.map((row, index) => (
                    <tr key={index}>
                      <td className="white-text">{row.student.fullname}</td>
                      <td className="white-text">{row.student.email}</td>
                     

                      <td>
                        <Link
  to={`/quiz-result/${row.quiz.id}/${row.student.id}`}
  className="btn btn-primary btn-sm"
>
  View Result
</Link>


                        {/* FIXED MODAL STRUCTURE */}
                        <div
                          className="modal fade"
                          id={`resultModal${row.id}`}
                          tabIndex="-1"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content p-3">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  Result: {row.student.fullname}
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                ></button>
                              </div>

                              <div className="modal-body">
                                <QuizResult
                                  quiz={row.quiz.id}
                                  student={row.student.id}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* END MODAL */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AttemptedStudent;
