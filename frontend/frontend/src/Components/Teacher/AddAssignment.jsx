import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../config";
import "./AddAssignment.css";

const AddAssignment = () => {
  const { teacher_id, student_id } = useParams();
  const [assignmentData, setAssignmentData] = useState({
    course: "",
    title: "",
    detail: "",
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "LMS | Add Assignment";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!teacher_id || !student_id) return;

    axios
      .get(`${baseUrl}/fetch-all-enrolled-students/${teacher_id}/`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const courses = rows
          .filter((item) => String(item?.student?.id) === String(student_id))
          .map((item) => item.course)
          .filter(Boolean);
        const uniqueCourses = courses.filter(
          (course, index, list) => list.findIndex((item) => item.id === course.id) === index
        );
        setCourseOptions(uniqueCourses);
        if (uniqueCourses.length === 1) {
          setAssignmentData((prev) => ({ ...prev, course: String(uniqueCourses[0].id) }));
        }
      })
      .catch((error) => console.log(error));
  }, [teacher_id, student_id]);

  const handleChange = (event) => {
    setAssignmentData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const formSubmit = async () => {
    if (!teacher_id || !student_id) {
      Swal.fire("Invalid assignment route", "Teacher or student reference is missing.", "error");
      return;
    }

    if (!assignmentData.course || !assignmentData.title.trim() || !assignmentData.detail.trim()) {
      Swal.fire({
        title: "Please select course and fill all fields",
        icon: "warning",
        toast: true,
        timer: 2000,
        position: "top-right",
        showConfirmButton: false,
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(`${baseUrl}/student-assignment/${teacher_id}/${student_id}/`, {
        course: assignmentData.course,
        title: assignmentData.title.trim(),
        detail: assignmentData.detail.trim(),
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "Assignment added successfully",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });

        setAssignmentData((prev) => ({ ...prev, title: "", detail: "" }));
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
      Swal.fire({
        title: "Error adding assignment",
        text: "Please try again later.",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
      });
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
              <span className="teacher-form-kicker">Assignment Builder</span>
              <h2>Give students work with a cleaner presentation</h2>
              <p>Use direct task titles and brief, outcome-based descriptions so submissions stay easier to review later.</p>
            </div>
            <div className="glass-card">
              <h3 className="glass-card-title">
                <i className="bi bi-journal-plus me-2"></i> Add Assignment
              </h3>
              <p className="glass-subtitle">Give assignment to student and track progress</p>
              <div className="teacher-form-chip-row">
                <span className="teacher-form-chip">Clear Task</span>
                <span className="teacher-form-chip">Student Specific</span>
                <span className="teacher-form-chip">Submission Ready</span>
              </div>

              <div className="glass-card-body">
                <div className="mb-3">
                  <label className="form-label">Course</label>
                  <select
                    value={assignmentData.course}
                    onChange={handleChange}
                    name="course"
                    className="form-control glass-input glass-select"
                  >
                    <option value="">Select course</option>
                    {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={assignmentData.title}
                    onChange={handleChange}
                    name="title"
                    className="form-control glass-input"
                    placeholder="Eg: Python Task 1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={assignmentData.detail}
                    onChange={handleChange}
                    name="detail"
                    className="form-control glass-input"
                    rows="5"
                    placeholder="Write assignment details here..."
                  />
                </div>

                <button type="button" onClick={formSubmit} className="btn glass-btn" disabled={submitting}>
                  <i className="bi bi-cloud-upload me-2"></i> {submitting ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddAssignment;
