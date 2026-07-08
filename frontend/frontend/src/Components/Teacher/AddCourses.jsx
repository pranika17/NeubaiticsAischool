import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../../config";
import "./addcourse.css";

const initialCourseData = {
  category: "",
  title: "",
  description: "",
  f_img: null,
  techs: "",
};

const AddCourses = () => {
  const [cats, setCats] = useState([]);
  const [courseData, setCourseData] = useState(initialCourseData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "LMS | Add Course";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/category/`)
      .then((res) => setCats(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.log(error);
        setCats([]);
      });
  }, []);

  const handleChange = (event) => {
    setCourseData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    setCourseData((prev) => ({
      ...prev,
      [event.target.name]: event.target.files?.[0] || null,
    }));
  };

  const formSubmit = async () => {
    const teacherId = localStorage.getItem("teacherId");

    if (!teacherId) {
      Swal.fire("Login required", "Teacher account not found. Please log in again.", "error");
      return;
    }

    if (!courseData.category || !courseData.title.trim() || !courseData.description.trim() || !courseData.techs.trim()) {
      Swal.fire("Incomplete form", "Category, title, description, and technologies are required.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("category", courseData.category);
      formData.append("teacher_id", teacherId);
      formData.append("title", courseData.title.trim());
      formData.append("description", courseData.description.trim());
      formData.append("techs", courseData.techs.trim());
      if (courseData.f_img) {
        formData.append("featured_img", courseData.f_img);
      }

      await axios.post(`${baseUrl}/course/`, formData, {
        headers: { "content-type": "multipart/form-data" },
      });

      Swal.fire("Success", "Course added successfully.", "success");
      setCourseData(initialCourseData);
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error);
      Swal.fire("Error", "Unable to add course. Check the entered details and try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        <section className="col-12">
          <div className="teacher-card">
            <div className="teacher-form-intro">
              <span className="teacher-form-kicker">Course Builder</span>
              <h2>Create a premium course card for your learners</h2>
              <p>Use a strong title, a clear description, and the right technologies so your course feels valuable at first glance.</p>
            </div>
            <div className="glass-card">
              <h3 className="glass-card-title">
                <i className="bi bi-plus-square"></i> Add Course
              </h3>
              <div className="teacher-form-chip-row">
                <span className="teacher-form-chip">Category</span>
                <span className="teacher-form-chip">Image Ready</span>
                <span className="teacher-form-chip">Technology Tags</span>
              </div>

              <div className="glass-card-body">
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    onChange={handleChange}
                    className="form-control glass-select"
                    value={courseData.category}
                  >
                    <option value="">-- Select Category --</option>
                    {cats.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={handleChange}
                    name="title"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={courseData.description}
                    onChange={handleChange}
                    name="description"
                    className="form-control"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Featured Image</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="f_img"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Technologies</label>
                  <textarea
                    value={courseData.techs}
                    onChange={handleChange}
                    name="techs"
                    className="form-control"
                    placeholder="php, Java, C++..."
                  ></textarea>
                </div>

                <button type="button" onClick={formSubmit} className="btn glass-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddCourses;
