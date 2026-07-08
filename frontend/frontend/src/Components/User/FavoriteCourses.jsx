import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./FavoriteCourses.css";
import { baseUrl } from '../../config';

const FavoriteCourses = () => {
  const studentId = localStorage.getItem("studentId");
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/fetch-favorite-coourses/${studentId}`)
      .then((res) => setCourseData(res.data))
      .catch((err) => console.log(err));
  }, [studentId]);

  useEffect(() => {
    document.title = "LMS | Favorite Courses";
  }, []);

  return (
    <div className="container-fluid mt-4">
      <section className="dashboard-center">
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
                        <Link to={`/user/detail/${row.course.id}`}>{row.course.title}</Link>
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
                      No favorite courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FavoriteCourses;
