// import React from 'react'
// import { Link } from 'react-router-dom'
// import TeacherSidebar from './TeacherSidebar'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'
// import Swal from 'sweetalert2'

// const baseUrl='http://127.0.0.1:8000/api'

// const AllQuiz = () => {
//     useEffect(()=>{
//         document.title='LMS | All Quiz'
//       })

//       const [quizData, setQuizData]=useState([]);
//       const teacherId=localStorage.getItem('teacherId');
//       const [totalResult, settotalResult]=useState(0);    

//       useEffect(()=>{
//         try{
//             axios.get(baseUrl+'/teacher-quiz/'+teacherId)
//             .then((res)=>{
//                 setQuizData(res.data)
//             });
//         }catch(error){
//             console.log(error)
//         }
//       },[]);

//       const handleDeleteClick = (quiz_id) =>{
//         Swal.fire({
//             title: 'Confirm',
//             text: 'Are you sure you want to delete data?',
//             icon: 'info',
//             confirmButtonText: 'Continue',
//             showCancelButton:true
//           }).then((result)=>{
//             if(result.isConfirmed){
//                 try{
//                     axios.delete(baseUrl+'/quiz/'+quiz_id)
//                     .then((res)=>{
//                         Swal.fire('success','Data has been deleted Successfully')
//                         try{
//                             axios.get(baseUrl+'/teacher-quiz/'+teacherId)
//                             .then((res)=>{
//                               settotalResult(res.data.length)
//                               setQuizData(res.data)
//                             });
//                         }catch(error){
//                             console.log(error);
//                         }
//                     })
//             }catch(error){
//                 Swal.fire('error','Data has not been deleted !!');
//             }
//             }
//             else{
//                 Swal.fire('error','Data has not been deleted !!');
//             }
//           })
//     }
      

//   return (
//     <div className='container mt-4'>
//         <div className='row'>
//             <aside className='col-md-3'>
//                 <TeacherSidebar />
//             </aside>
//             <section className='col-md-9'>
//                 <div className='card'>
//                     <h5 className='card-header'> All Quiz</h5>
//                     <div className='card-body'>
//                         <table className='table table-bordered'>
//                             <thead>
//                                 <tr>
//                                     <th>Name</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {quizData.map((row,index) => 
//                                     <tr>
//                                     <td>
//                                         <Link to={`/all-questions/` +row.id}>{row.title}</Link>
//                                     </td>
//                                     <td>
//                                         <Link to={`/edit-quiz/` +row.id} className='btn btn-info btn-sm ms-4 mb-2'>Edit</Link>
//                                         <Link to={`/add-question/` +row.id} className='btn btn-success btn-sm ms-2 mb-2'>Add Questions</Link>
//                                         <button onClick={()=>handleDeleteClick(row.id)} className='btn btn-danger btn-sm ms-2 mb-2'>Delete</button>
//                                     </td>
//                                 </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     </div>
//   )
// }

// export default AllQuiz


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "./AllQuiz.css"; // Light CSS only for hover effects

const baseUrl = "http://127.0.0.1:8000/api";

const AllQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [search, setSearch] = useState("");
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    document.title = "LMS | All Quiz";
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    axios
      .get(`${baseUrl}/teacher-quiz/${teacherId}`)
      .then((res) => setQuizData(res.data));
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
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

       <section className="col-md-9">
  <div className="quiz-card">
    <h5 className="card-header">
      📚 All Quizzes
    </h5>

    <div className="card-body">

      {/* Search */}
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <input
          type="text"
          className="form-control w-50 quiz-search cyan-search"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="badge text-dark" style={{background:"#00ffff "}}>
          Total: {quizData.length}
        </span>
      </div>

      {/* Table */}
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
                  <Link to={`/all-questions/${row.id}`} className="fw-semibold text-decoration-none text-info">
                    {row.title}
                  </Link>
                </td>

                <td className="text-center">
                  <Link to={`/edit-question/${row.id}`} className="btn btn-sm neon-btn me-2">
                    Edit
                  </Link>

                  <Link to={`/add-question/${row.id}`} className="btn btn-sm neon-btn me-2">
                    Add Qns
                  </Link>

                  <button
                    onClick={() => handleDeleteClick(row.id)}
                    className="btn btn-sm neon-btn neon-danger me-2"
                  >
                    Delete
                  </button>

                  <Link to={`/all-questions/${row.id}`} className="btn btn-sm neon-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted py-3">
                ❌ No quizzes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  </div>
</section>

      </div>
    </div>
  );
};

export default AllQuiz;

