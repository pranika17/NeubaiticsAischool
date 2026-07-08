

import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./AddQuiz.css";

const baseUrl = "http://127.0.0.1:8000/api";

const AddQuiz = () => {
  const teacherId = localStorage.getItem("teacherId");
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: "",
    detail: "",
    course: "",
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "LMS | Add Quiz";

    if (teacherId) {
      axios
        .get(`${baseUrl}/teacher-course/${teacherId}`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.log(err));
    }
  }, [teacherId]);

  const handleChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value,
    });
  };

  const formSubmit = async () => {
    if (!teacherId) {
      Swal.fire("Error", "Teacher not logged in", "error");
      return;
    }

    if (!quizData.course) {
      Swal.fire("Error", "Please select a course", "error");
      return;
    }

    if (!quizData.title.trim()) {
      Swal.fire("Error", "Quiz title is required", "error");
      return;
    }

    if (!quizData.detail.trim()) {
      Swal.fire("Error", "Quiz detail is required", "error");
      return;
    }

    setLoading(true);

    try {
      // ✅ 1) Create Quiz
      const fd = new FormData();
      fd.append("teacher", teacherId);
      fd.append("title", quizData.title);
      fd.append("detail", quizData.detail);

      const res = await axios.post(`${baseUrl}/quiz/`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });

      const newQuizId = res.data.id;

      // ✅ 2) Assign Quiz to selected course
      const assignFd = new FormData();
      assignFd.append("teacher", teacherId);
      assignFd.append("course", quizData.course);
      assignFd.append("quiz", newQuizId);

      await axios.post(`${baseUrl}/quiz-assign-course/`, assignFd, {
        headers: { "content-type": "multipart/form-data" },
      });

      // ✅ 3) Ask teacher: Add questions now?
      const result = await Swal.fire({
        icon: "success",
        title: "Quiz Submitted Successfully!",
        text: "Do you want to add questions now?",
        showCancelButton: true,
        confirmButtonText: "Yes, Add Questions",
        cancelButtonText: "Later",
      });

      if (result.isConfirmed) {
       navigate(`/add-question/${newQuizId}`);

      } else {
        navigate("/teacher-dashboard"); // or any page you want
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <div className="col-md-9">
          <div className="glass-card">
            <h3 className="glass-card-title">
              <i className="bi bi-plus-square"></i> Add Quiz
            </h3>

            <div className="glass-card-body">
              {/* ✅ Course Dropdown */}
              <div className="mb-3">
                <label className="form-label">Select Course</label>
                <select
                  name="course"
                  value={quizData.course}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quiz Title */}
              <div className="mb-3">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={quizData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Quiz Detail */}
              <div className="mb-3">
                <label className="form-label">Quiz Detail</label>
                <textarea
                  name="detail"
                  className="form-control"
                  value={quizData.detail}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="button"
                onClick={formSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
