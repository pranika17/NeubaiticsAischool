import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";
import "./AddQuiz.css";

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
    window.scrollTo(0, 0);

    if (!teacherId) {
      setCourses([]);
      return;
    }

    axios
      .get(`${baseUrl}/teacher-course/${teacherId}`)
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.log(err);
        setCourses([]);
      });
  }, [teacherId]);

  const handleChange = (e) => {
    setQuizData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formSubmit = async () => {
    if (!teacherId) {
      Swal.fire("Error", "Teacher not logged in.", "error");
      return;
    }

    if (!quizData.course || !quizData.title.trim() || !quizData.detail.trim()) {
      Swal.fire("Error", "Course, title, and detail are required.", "warning");
      return;
    }

    setLoading(true);

    try {
      const quizFormData = new FormData();
      quizFormData.append("teacher", teacherId);
      quizFormData.append("title", quizData.title.trim());
      quizFormData.append("detail", quizData.detail.trim());

      const res = await axios.post(`${baseUrl}/quiz/`, quizFormData, {
        headers: { "content-type": "multipart/form-data" },
      });

      const newQuizId = res.data.id;

      const assignFormData = new FormData();
      assignFormData.append("teacher", teacherId);
      assignFormData.append("course", quizData.course);
      assignFormData.append("quiz", newQuizId);

      await axios.post(`${baseUrl}/quiz-assign-course/`, assignFormData, {
        headers: { "content-type": "multipart/form-data" },
      });

      const result = await Swal.fire({
        icon: "success",
        title: "Quiz submitted successfully",
        text: "Do you want to add questions now?",
        showCancelButton: true,
        confirmButtonText: "Yes, Add Questions",
        cancelButtonText: "Later",
      });

      if (result.isConfirmed) {
        navigate(`/add-question/${newQuizId}`);
      } else {
        navigate("/teacher-dashboard");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Unable to create quiz. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        <div className="col-12">
          <div className="teacher-form-intro">
            <span className="teacher-form-kicker">Assessment Builder</span>
            <h2>Create quizzes that feel structured and professional</h2>
            <p>Attach the quiz to the right course first, then continue directly into question creation for a smoother workflow.</p>
          </div>
          <div className="glass-card">
            <h3 className="glass-card-title">
              <i className="bi bi-plus-square"></i> Add Quiz
            </h3>
            <div className="teacher-form-chip-row">
              <span className="teacher-form-chip">Course Linked</span>
              <span className="teacher-form-chip">Question Ready</span>
              <span className="teacher-form-chip">Teacher Controlled</span>
            </div>

            <div className="glass-card-body">
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

              <div className="mb-3">
                <label className="form-label">Quiz Detail</label>
                <textarea
                  name="detail"
                  className="form-control"
                  value={quizData.detail}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="button" onClick={formSubmit} className="btn btn-primary" disabled={loading}>
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
