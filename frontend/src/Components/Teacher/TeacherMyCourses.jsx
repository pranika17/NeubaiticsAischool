import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./TeacherMyCourse.css";

const baseUrl = "http://127.0.0.1:8000/api";

const TeacherMyCourses = () => {
  const [courseData, setCourseData] = useState([]);
  const [groupUnreadMap, setGroupUnreadMap] = useState({});
  const teacherId = localStorage.getItem("teacherId");
  const [totalResult, settotalResult] = useState(0);

  useEffect(() => {
    document.title = "LMS | Uploaded Courses";
  }, []);

  useEffect(() => {
    try {
      axios.get(`${baseUrl}/teacher-course/${teacherId}`).then((res) => {
        setCourseData(res.data);
        settotalResult(res.data.length);
      });

      axios.get(`${baseUrl}/teacher-group-unread-count/${teacherId}/`).then((res) => {
        const courses = Array.isArray(res.data?.courses) ? res.data.courses : [];
        const nextMap = courses.reduce((acc, item) => {
          acc[item.course_id] = item;
          return acc;
        }, {});
        setGroupUnreadMap(nextMap);
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
          axios.delete(`${baseUrl}/teacher-course-detail/${course_id}`).then(() => {
            Swal.fire("Success", "Course deleted successfully!", "success");

            axios.get(`${baseUrl}/teacher-course/${teacherId}`).then((res) => {
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
    <div className="container-fluid mt-4 teacher-page tmc-page">
      <h1 className="tpage-title">
        <i className="bi bi-journals"></i> My Courses
      </h1>

      <h3 className="total-course-count mb-3">Total Courses: {totalResult}</h3>

      <div className="tmc-course-card-grid">
        {courseData.map((course) => (
          <div key={course.id} className="tmc-course-card">
            {Number(groupUnreadMap[course.id]?.unread_count || 0) > 0 && (
              <div className="tmc-unread-pill">{groupUnreadMap[course.id].unread_count} unread</div>
            )}

            <img src={course.featured_img} alt={course.title} className="tmc-course-img" />

            <h4 className="tmc-course-title">
              <Link to={`/all-chapters/${course.id}`}>{course.title}</Link>
            </h4>

            <p className="tmc-course-info">
              <i className="bi bi-star-fill text-warning"></i>&nbsp;
              Rating : {course.course_rating ? course.course_rating : "0"}/5
            </p>

            <p className="tmc-course-info">
              <Link to={`/enrolled-students/${course.id}`}>
                {course.total_enrolled_students} <i className="bi bi-people-fill"></i>
              </Link>
            </p>

            <div className="tmc-course-actions">
              <Link to={`/edit-course/${course.id}`} className="btn tmc-btn" title="Edit Course">
                <i className="bi bi-pencil-square"></i>
              </Link>

              <Link
                to={`/study-material/${course.id}`}
                className="btn tmc-btn"
                title="Study Material"
              >
                Study Material
              </Link>

              <Link to={`/add-chapter/${course.id}`} className="btn tmc-btn" title="Add Chapter">
                Add Chapter
              </Link>

              <Link to={`/assign-quiz/${course.id}`} className="btn tmc-btn" title="Assign Quiz">
                Assign Quiz
              </Link>

              <Link
                to={`/teacher/course-chat/${course.id}${
                  groupUnreadMap[course.id]?.first_unread_message_id
                    ? `?focus=${groupUnreadMap[course.id].first_unread_message_id}`
                    : ""
                }`}
                className="btn tmc-btn"
                title="Course Group Chat"
              >
                Group Chat
              </Link>

              <button
                onClick={() => handleDeleteClick(course.id)}
                className="btn tmc-danger"
                title="Delete Course"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}

        {courseData.length === 0 && (
          <div className="text-center mt-5">
            <h5>No courses uploaded yet.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMyCourses;
