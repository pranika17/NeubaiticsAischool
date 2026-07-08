import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blog.css";
import { baseUrl } from "../config";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [showVideo, setShowVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/blog-list/`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.log(err));
  }, []);

  const openVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setShowVideo(false);
  };

  return (
    <div className="container mt-4 ">
      <div className="row">
        {blogs.map((blog) => {
          const isExpanded = expandedId === blog.id;

          return (
            <div className="col-md-4 mb-4" key={blog.id}>
              <div className="card blog-card shadow h-100">

                {/* Title */}
                <div className="card-header blog-header">{blog.title}</div>

                {/* ✅ Video Preview Image ONLY */}
                {blog.video_url && (
                  <div
                    className="video-preview-wrapper"
                    onClick={() => openVideo(blog.video_url)}
                  >
                    <video
                      className="video-preview"
                      src={blog.video_url}
                      preload="metadata"
                      muted
                    />
                    
                  </div>
                )}

                {/* Description */}
                <div className="card-body">
                  <div
                    style={{
                      maxHeight: isExpanded ? "200px" : "80px",
                      overflowY: "auto",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    {blog.description}
                  </div>

                  <div className="text-center mt-3">
                    {!isExpanded ? (
                      <button
                        className="btn blog-btn btn-sm"
                        onClick={() => setExpandedId(blog.id)}
                      >
                        View More
                      </button>
                    ) : (
                      <button
                        className="btn blog-btn btn-sm"
                        onClick={() => setExpandedId(null)}
                      >
                        Back
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Video Modal */}
      {showVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeVideo}>✖</button>

            <video controls autoPlay className="modal-video">
              <source src={activeVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
