import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import "./addchapter.css"; // ✅ new css file

const baseUrl = "http://127.0.0.1:8000/api";

const AddChapter = () => {
  useEffect(() => {
    document.title = "LMS | Add Chapter";
  }, []);

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    video: "",
    video_url: "",
    remarks: "",
    video_source: "upload",
  });

  const handleChange = (event) => {
    setChapterData({
      ...chapterData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setChapterData({
      ...chapterData,
      [event.target.name]: event.target.files[0],
    });
  };

  const { course_id } = useParams();

  const formSubmit = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("title", chapterData.title);
    _formData.append("description", chapterData.description);
    if (chapterData.video_source === "upload" && chapterData.video) {
      _formData.append("video", chapterData.video);
    }
    if (chapterData.video_source === "url" && chapterData.video_url.trim()) {
      _formData.append("video_url", chapterData.video_url.trim());
    }
    _formData.append("remarks", chapterData.remarks);

    axios
      .post(`${baseUrl}/course-chapters/${course_id}`, _formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Chapter Uploaded!",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="teacher-card">
            <div className="chapterglass-card">
              <h3 className="chapterglass-card-title">
                <i className="bi bi-journal-plus me-2"></i> Add New Chapter Video
              </h3>
              <h3 className="chapterglass-subtitle">
                Upload lesson video and chapter details
              </h3>

              <div className="chapterglass-card-body">
                <div className="mb-3">
                  <label className="form-label">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    className="form-control chapterglass-input"
                    placeholder="Eg: Introduction to Python"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
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
                    onChange={handleChange}
                    className="form-control chapterglass-input"
                    placeholder="Eg: Important basics explained clearly"
                  />
                </div>

                <button
                  className="btn chapterglass-btn"
                  onClick={formSubmit}
                  disabled={
                    !chapterData.title ||
                    (chapterData.video_source === "upload" && !chapterData.video) ||
                    (chapterData.video_source === "url" && !chapterData.video_url.trim())
                  }
                >
                  <i className="bi bi-cloud-upload me-2"></i> Upload Chapter
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
