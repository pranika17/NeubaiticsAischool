import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./StudentFeedback.css";

const baseUrl = "http://127.0.0.1:8000/api";

const StudentFeedback = () => {
  const studentId = localStorage.getItem("studentId");
  const studentLoginStatus = localStorage.getItem("studentLoginStatus");
  const [courses, setCourses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "LMS | My Feedback";
    if (studentLoginStatus !== "true") {
      window.location.href = "/user-login";
    }
  }, [studentLoginStatus]);

  useEffect(() => {
    if (!studentId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [coursesRes, feedbackRes] = await Promise.all([
          axios.get(`${baseUrl}/fetch-enrolled-courses/${studentId}`),
          axios.get(`${baseUrl}/course-rating/?student_id=${studentId}`),
        ]);

        const enrolled = Array.isArray(coursesRes?.data) ? coursesRes.data : [];
        const feedbackRows = Array.isArray(feedbackRes?.data?.results)
          ? feedbackRes.data.results
          : Array.isArray(feedbackRes?.data)
          ? feedbackRes.data
          : [];

        const approvedCourses = enrolled
          .filter((row) => row?.course && row?.status === "approved")
          .map((row) => row.course);
        const pendingCourses = enrolled.filter((row) => row?.course && row?.status === "pending");
        setCourses(approvedCourses);
        setPendingCount(pendingCourses.length);

        const nextMap = {};
        approvedCourses.forEach((course) => {
          const existing = feedbackRows.find((item) => Number(item?.course?.id || item?.course) === Number(course.id));
          nextMap[course.id] = {
            rating: existing?.rating ? String(existing.rating) : "",
            reviews: existing?.reviews || "",
          };
        });
        setFeedbackMap(nextMap);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  const hasCourses = useMemo(() => courses.length > 0, [courses]);

  const handleChange = (courseId, field, value) => {
    setFeedbackMap((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { rating: "", reviews: "" }),
        [field]: value,
      },
    }));
  };

  const saveFeedback = async (courseId) => {
    const current = feedbackMap[courseId] || { rating: "", reviews: "" };
    if (!current.rating || !current.reviews.trim()) {
      Swal.fire({
        title: "Feedback incomplete",
        text: "Please select a rating and write your feedback.",
        icon: "warning",
        toast: true,
        timer: 2500,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("student", studentId);
    formData.append("rating", current.rating);
    formData.append("reviews", current.reviews.trim());

    setSavingId(courseId);
    try {
      await axios.post(`${baseUrl}/course-rating/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        title: "Feedback saved",
        text: "Your feedback will now reflect in student testimonials.",
        icon: "success",
        toast: true,
        timer: 2500,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Swal.fire({
        title: "Could not save feedback",
        text: "Please try again.",
        icon: "error",
        toast: true,
        timer: 2500,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="student-feedback-page">
      <div className="student-feedback-header">
        <h4>Student Feedback</h4>
        <p>Share your course experience. Your feedback will appear in the homepage student testimonials.</p>
      </div>

      {loading && <div className="student-feedback-empty">Loading your enrolled courses...</div>}

      {!loading && !hasCourses && (
        <div className="student-feedback-empty">
          {pendingCount > 0
            ? "Your course enrollment is still pending approval. Feedback will unlock after approval."
            : "You need at least one approved enrolled course before leaving feedback."}
        </div>
      )}

      {!loading && hasCourses && (
        <div className="student-feedback-grid">
          {courses.map((course) => {
            const current = feedbackMap[course.id] || { rating: "", reviews: "" };
            return (
              <div className="student-feedback-card" key={course.id}>
                <div className="student-feedback-card-head">
                  <h5>{course.title}</h5>
                  <span>{course.techs || "Course Feedback"}</span>
                </div>

                <label className="student-feedback-label">Rating</label>
                <select
                  className="student-feedback-select"
                  value={current.rating}
                  onChange={(e) => handleChange(course.id, "rating", e.target.value)}
                >
                  <option value="">Select rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>

                <label className="student-feedback-label">Your feedback</label>
                <textarea
                  className="student-feedback-textarea"
                  rows={5}
                  value={current.reviews}
                  onChange={(e) => handleChange(course.id, "reviews", e.target.value)}
                  placeholder="Write what you learned, how the course helped you, and what stood out."
                />

                <button
                  type="button"
                  className="student-feedback-save"
                  onClick={() => saveFeedback(course.id)}
                  disabled={savingId === course.id}
                >
                  {savingId === course.id ? "Saving..." : "Save Feedback"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;
