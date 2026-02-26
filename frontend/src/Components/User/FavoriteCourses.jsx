



// import React from 'react'
// import { Link, useParams } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'

// const baseUrl='http://127.0.0.1:8000/api'

// const FavoriteCourses = () => {

//     const studentId=localStorage.getItem('studentId')
//     const [courseData,setCourseData]=useState([])

//     useEffect(()=>{
//         try{
//             axios.get(baseUrl+'/fetch-favorite-coourses/'+studentId)
//             .then((res)=>{
//                 setCourseData(res.data)
//             });
//         }catch(error){
//             console.log(error)
//         }
//       },[]);

//     useEffect(()=>{
//         document.title='LMS | Favorite Courses'
//       })
//   return (
//     <div className='container mt-4'>
//         <div className='row'>
//             <aside className='col-md-3'>
//                 <Sidebar />
//             </aside>
//             <section className='col-md-9'>
//                 <div className='card'>
//                     <h5 className='card-header'><i class="bi bi-heart-fill text-danger"></i> Favorite Courses</h5>
//                     <div className='card-body table-responsive'>
//                         <table className='table table-striped table-hover'>
//                             <thead>
//                                 <tr>
//                                     <th className='text-center'>ThumbNail</th>
//                                     <th className='text-center'>Name</th>
//                                     <th className='text-center'>created By</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                             {courseData.map((row,index) =>
//                                 <tr>
//                                 <td className='text-center'><Link to={`/detail/`+row.course.id}><img className='round' width="80 " src={row.course.featured_img}/></Link></td>
//                                 <td className='text-center'><Link to={`/detail/`+row.course.id}>{row.course.title}</Link></td>
//                                 <td className='text-center'><Link to={`/teacher-detail/`+row.course.id}>{row.course.teacher.full_name}</Link></td>
//                                 </tr>
//                             )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     </div>
//   )
// }

// export default FavoriteCourses

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./FavoriteCourses.css";

const baseUrl = "http://127.0.0.1:8000/api";

const FavoriteCourses = () => {
  const studentId = localStorage.getItem("studentId");
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/fetch-favorite-coourses/${studentId}`)
      .then((res) => setCourseData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    document.title = "LMS | Favorite Courses";
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* <aside className="col-md-3">
          <Sidebar />
        </aside> */}

        <section className="col-md-9 dashboard-center">
          <div className="fav-card">
            <div className="fav-card-header">
              <i className="bi bi-heart-fill text-danger"></i>
              <span> Favorite Courses</span>
            </div>

            <div className="fav-card-body table-responsive">
              <table className="fav-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Created By</th>
                  </tr>
                </thead>

                <tbody>
                  {courseData.length > 0 ? (
                    courseData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/detail/${row.course.id}`}>
                            {row.course.title}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/teacher-detail/${row.course.teacher.id}`}>
                            {row.course.teacher.full_name}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="empty-text">
                        No favorite courses found 💔
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

export default FavoriteCourses;
