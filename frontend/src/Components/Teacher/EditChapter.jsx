import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

const EditChapter = () => {
  const { chapter_id } = useParams();

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    prev_video: "",
    video: "",
    video_url: "",
    remarks: "",
    video_source: "upload",
  });

  useEffect(() => {
    document.title = "LMS | Edit Chapter";
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
      video: event.target.files[0] || "",
    }));
  };

  const formSubmit = () => {
    const formData = new FormData();
    formData.append("title", chapterData.title);
    formData.append("description", chapterData.description);
    formData.append("remarks", chapterData.remarks);

    if (chapterData.video_source === "upload") {
      if (chapterData.video) {
        formData.append("video", chapterData.video, chapterData.video.name);
      }
      formData.append("video_url", "");
    } else {
      formData.append("video_url", chapterData.video_url.trim());
    }

    axios
      .put(`${baseUrl}/chapter/${chapter_id}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Chapter updated successfully",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/chapter/${chapter_id}`)
      .then((res) => {
        setChapterData({
          title: res.data.title || "",
          description: res.data.description || "",
          prev_video: res.data.video_stream_url || res.data.video || "",
          video: "",
          video_url: res.data.video_url || "",
          remarks: res.data.remarks || "",
          video_source: res.data.video_url ? "url" : "upload",
        });
      })
      .catch((error) => console.log(error));
  }, [chapter_id]);

  return (
    <div className="container mt-4">
      <div className="row">
        <section className="col-md-9">
          <div className="card">
            <h3 className="card-header">Edit Chapter</h3>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    value={chapterData.title}
                    onChange={handleChange}
                    name="title"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    value={chapterData.description}
                    onChange={handleChange}
                    name="description"
                    className="form-control"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Video Source</label>
                  <div className="d-flex gap-3 flex-wrap">
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="video_source"
                        value="upload"
                        checked={chapterData.video_source === "upload"}
                        onChange={handleChange}
                      />
                      <span>Upload file</span>
                    </label>
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="video_source"
                        value="url"
                        checked={chapterData.video_source === "url"}
                        onChange={handleChange}
                      />
                      <span>External URL</span>
                    </label>
                  </div>
                </div>

                {chapterData.video_source === "upload" ? (
                  <div className="mb-3">
                    <label htmlFor="video" className="form-label">
                      Video File
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      name="video"
                      className="form-control"
                      id="inputGroupFile02"
                    />
                    {chapterData.prev_video && (
                      <video controls width="100%" className="mt-2">
                        <source src={chapterData.prev_video} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="video_url" className="form-label">
                      External Video URL
                    </label>
                    <input
                      type="url"
                      value={chapterData.video_url}
                      onChange={handleChange}
                      name="video_url"
                      className="form-control"
                      placeholder="https://cdn.example.com/lesson.mp4"
                    />
                    {chapterData.video_url && (
                      <a
                        href={chapterData.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="d-inline-block mt-2"
                      >
                        Open current video URL
                      </a>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="remarks" className="form-label">
                    Remarks
                  </label>
                  <textarea
                    value={chapterData.remarks}
                    className="form-control"
                    onChange={handleChange}
                    name="remarks"
                    placeholder="This is basic concept video."
                  ></textarea>
                </div>

                <button type="button" onClick={formSubmit} className="btn btn-primary">
                  Save Chapter
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditChapter;
