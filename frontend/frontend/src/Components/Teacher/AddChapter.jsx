import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../config";
import "./addchapter.css";

const initialChapterData = {
  title: "",
  description: "",
  video: "",
  video_url: "",
  remarks: "",
  video_source: "upload",
};

const AddChapter = () => {
  const { course_id } = useParams();
  const [chapterData, setChapterData] = useState(initialChapterData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "LMS | Add Chapter";
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (event) => {
    setChapterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    setChapterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.files?.[0] || "",
    }));
  };

  const formSubmit = async () => {
    if (!chapterData.title.trim() || !chapterData.description.trim()) {
      Swal.fire("Missing details", "Title and description are required.", "warning");
      return;
    }

    if (chapterData.video_source === "upload" && !chapterData.video) {
      Swal.fire("Missing video", "Please upload a chapter video.", "warning");
      return;
    }

    if (chapterData.video_source === "url" && !chapterData.video_url.trim()) {
      Swal.fire("Missing URL", "Please provide an external video URL.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("course", course_id);
      formData.append("title", chapterData.title.trim());
      formData.append("description", chapterData.description.trim());
      formData.append("remarks", chapterData.remarks);

      if (chapterData.video_source === "upload" && chapterData.video) {
        formData.append("video", chapterData.video);
      }

      if (chapterData.video_source === "url" && chapterData.video_url.trim()) {
        formData.append("video_url", chapterData.video_url.trim());
      }

      const res = await axios.post(`${baseUrl}/course-chapters/${course_id}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "Chapter uploaded",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });
        setChapterData(initialChapterData);
      }
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Unable to upload chapter. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <section className="col-12">
          <div className="teacher-card">
            <div className="teacher-form-intro">
              <span className="teacher-form-kicker">Chapter Builder</span>
              <h2>Turn lessons into a polished learning sequence</h2>
              <p>Upload video lessons or attach external media links so students can move through each topic with more clarity.</p>
            </div>
            <div className="chapterglass-card">
              <h3 className="chapterglass-card-title">
                <i className="bi bi-journal-plus me-2"></i> Add New Chapter Video
              </h3>
              <h3 className="chapterglass-subtitle">Upload lesson video and chapter details</h3>
              <div className="teacher-form-chip-row">
                <span className="teacher-form-chip">Video Upload</span>
                <span className="teacher-form-chip">External URL</span>
                <span className="teacher-form-chip">Structured Remarks</span>
              </div>

              <div className="chapterglass-card-body">
                <div className="mb-3">
                  <label className="form-label">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    value={chapterData.title}
                    onChange={handleChange}
                    className="form-control chapterglass-input"
                    placeholder="Eg: Introduction to Python"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={chapterData.description}
                    onChange={handleChange}
                    className="form-control chapterglass-input"
                    rows="3"
                    placeholder="Explain what students will learn in this chapter"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Video Source</label>
                  <div className="chapter-video-source">
                    <label className="chapter-source-option">
                      <input
                        type="radio"
                        name="video_source"
                        value="upload"
                        checked={chapterData.video_source === "upload"}
                        onChange={handleChange}
                      />
                      <span>Upload video file</span>
                    </label>
                    <label className="chapter-source-option">
                      <input
                        type="radio"
                        name="video_source"
                        value="url"
                        checked={chapterData.video_source === "url"}
                        onChange={handleChange}
                      />
                      <span>Use external video URL</span>
                    </label>
                  </div>
                </div>

                {chapterData.video_source === "upload" ? (
                  <div className="mb-3">
                    <label className="form-label">Upload Video</label>
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="form-control chapterglass-input"
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">External Video URL</label>
                    <input
                      type="url"
                      name="video_url"
                      value={chapterData.video_url}
                      onChange={handleChange}
                      className="form-control chapterglass-input"
                      placeholder="https://cdn.example.com/course-lesson.mp4"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    name="remarks"
                    value={chapterData.remarks}
                    onChange={handleChange}
                    className="form-control chapterglass-input"
                    placeholder="Eg: Important basics explained clearly"
                  />
                </div>

                <button
                  className="btn chapterglass-btn"
                  onClick={formSubmit}
                  disabled={
                    submitting ||
                    !chapterData.title ||
                    (chapterData.video_source === "upload" && !chapterData.video) ||
                    (chapterData.video_source === "url" && !chapterData.video_url.trim())
                  }
                >
                  <i className="bi bi-cloud-upload me-2"></i> {submitting ? "Uploading..." : "Upload Chapter"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddChapter;
