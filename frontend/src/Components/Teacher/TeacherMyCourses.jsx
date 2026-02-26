import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "./TeacherMyCourse.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherMyCourses = () => {
  const [courseData, setCourseData] = useState([]);
  const teacherId = localStorage.getItem("teacherId");
  const [totalResult, settotalResult] = useState(0);

  useEffect(() => {
    document.title = "LMS | Uploaded Courses";
  }, []);

  useEffect(() => {
    try {
      axios.get(`${baseUrl}/teacher-course/${teacherId}`)
        .then((res) => {
          setCourseData(res.data);
          settotalResult(res.data.length);
        });
    } catch (error) {
      console.log(error);
    }
  }, [teacherId]);

  const handleDeleteClick = (course_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this course?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`${baseUrl}/teacher-course-detail/${course_id}`)
            .then(() => {
              Swal.fire("Success", "Course deleted successfully!", "success");

              // Reload list
              axios.get(`${baseUrl}/teacher-course/${teacherId}`)
                .then((res) => {
                  setCourseData(res.data);
                  settotalResult(res.data.length);
                });
            });
        } catch (error) {
          Swal.fire("Error", "Course not deleted!", "error");
        }
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <h1 className="tpage-title">
            <i className="bi bi-journals"></i> My Courses
          </h1>

          <h3 className="total-course-count mb-3">
  Total Courses: {totalResult}
</h3>


          <div className="course-card-grid">
            {courseData.map((course) => (
              <div key={course.id} className="course-card">
                <img
                  src={course.featured_img}
                  alt={course.title}
                  className="course-img"
                />

                <h4 className="course-title">
                  <Link to={`/all-chapters/${course.id}`}>{course.title}</Link>
                </h4>

                <p className="course-info">
                  <i className="bi bi-star-fill text-warning"></i>&nbsp;
                  Rating : {course.course_rating ? course.course_rating : "0"}/5
                </p>

                <p className="course-info">
                  <Link to={`/enrolled-students/${course.id}`}>
                    {course.total_enrolled_students}{" "}
                    <i className="bi bi-people-fill"></i>
                  </Link>
                </p>

                <div className="course-actions">
                  <Link
                    to={`/edit-course/${course.id}`}
                    className="btn glass-btn"
                    title="Edit Course"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <Link
                    to={`/study-material/${course.id}`}
                    className="btn glass-btn"
                    title="Study Material"
                  >
                    Study Material
                  </Link>

                  <Link
                    to={`/add-chapter/${course.id}`}
                    className="btn glass-btn"
                    title="Add Chapter"
                  >
                    Add Chapter
                  </Link>

                  {/* ✅ NEW ASSIGN QUIZ BUTTON */}
                  <Link
                    to={`/assign-quiz/${course.id}`}
                    className="btn glass-btn"
                    title="Assign Quiz"
                  >
                    Assign Quiz
                  </Link>

                  <button
                    onClick={() => handleDeleteClick(course.id)}
                    className="btn glass-danger"
                    title="Delete Course"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* if no course */}
            {courseData.length === 0 && (
              <div className="text-center mt-5">
                <h5>No courses uploaded yet.</h5>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherMyCourses;