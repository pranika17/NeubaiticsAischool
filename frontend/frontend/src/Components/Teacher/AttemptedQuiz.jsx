import { baseUrl } from '../../config';

// import React, { useEffect, useState } from "react";
// import TeacherSidebar from "./TeacherSidebar";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import QuizResult from "./QuizResult";

// const baseUrl = baseUrl;

// const AttemptedQuiz = () => {
//   useEffect(() => {
//     document.title = "LMS | All Quiz";
//   }, []);

//   const [studentData, setStudentData] = useState([]);
//   const { quiz_id } = useParams();

// useEffect(() => {
//   if (!quiz_id || !student_id) return;   // ✅ STOP invalid call

//   axios
//     .get(`${baseUrl}/fetch-quiz-result/${quiz_id}/${student_id}/`)
//     .then(res => setResult(res.data))
//     .catch(err => console.log(err));

// }, [quiz_id, student_id]);

//   return (
//     <div className="container mt-4 teacher-page">
//       <div className="row">
//         <aside className="col-md-3">
//           <TeacherSidebar />
//         </aside>

//         <section className="col-md-9">
//           <div className="card">
//             <h5 className="card-header">Student List</h5>
//             <div className="card-body">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Username</th>
//                     <th>Results</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {studentData.map((row, index) => (
//                     <tr key={index}>
//                       <td>{row.student.fullname}</td>
//                       <td>{row.student.email}</td>
//                       <td>{row.student.username}</td>

//                       <td>
//                         <button
//                           className="btn btn-primary btn-sm"
//                           data-bs-toggle="modal"
//                           data-bs-target={`#resultModal${row.id}`}
//                         >
//                           Quiz Result
//                         </button>

//                         <div
//                           className="modal fade"
//                           id={`resultModal${row.id}`}
//                           tabIndex="-1"
//                           aria-hidden="true"
//                         >
//                           <div className="modal-dialog modal-lg">
//                             <div className="modal-content p-3">
//                               <div className="modal-header">
//                                 <h5 className="modal-title">
//                                   Result: {row.student.fullname}
//                                 </h5>
//                                 <button
//                                   type="button"
//                                   className="btn-close"
//                                   data-bs-dismiss="modal"
//                                 ></button>
//                               </div>

//                               <div className="modal-body">
//                                 <QuizResult
//                                   quiz={row.quiz.id}
//                                   student={row.student.id}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default AttemptedQuiz;



import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import QuizResult from "./QuizResult";
const AttemptedQuiz = () => {
  useEffect(() => {
    document.title = "LMS | All Quiz";
  }, []);

  const [studentData, setStudentData] = useState([]);
  const { quiz_id } = useParams();
  const teacherId = localStorage.getItem("teacherId");

  // Fetch all students who attempted this quiz
  useEffect(() => {
    if (!quiz_id || !teacherId) return;

    axios
      .get(`${baseUrl}/attempted-quiz/${quiz_id}`, {
        params: { teacher_id: teacherId }
      })
      .then(res => setStudentData(res.data))
      .catch(err => console.log(err));
  }, [quiz_id, teacherId]);

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Student List</h5>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Results</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.student.fullname}</td>
                      <td>{row.student.email}</td>
                      <td>{row.student.username}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target={`#resultModal${row.id}`}
                        >
                          Quiz Result
                        </button>

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
                                  quiz={quiz_id}
                                  student={row.student.id}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
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

export default AttemptedQuiz;
