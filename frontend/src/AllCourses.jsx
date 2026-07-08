import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import watermark from "./assets/imageofai.webp";

const baseUrl = "http://127.0.0.1:8000/api/course/";

const AllCourses = () => {
  const [courseData, setCourseData] = useState([]);
  const [nextUrl, setNextUrl] = useState();
  const [previousUrl, setPreviousUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "LMS | Latest Courses";
    fetchData(baseUrl);
  }, []);

  const fetchData = (url) => {
    if (!url) return;

    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setNextUrl(res.data.next);
        setPreviousUrl(res.data.previous);
        setCourseData(res.data.results || []);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setTimeout(() => setLoading(false), 250);
      });
  };

  const filteredCourses = courseData.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="allcourses-bg mt-4 allcourses-page">
      <div className="allcourses-container">
        <div className="text-center section-header">
          <h1 className="section-main-title">All Courses</h1>
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && (
          <div className="row mt-4 g-4 allcourses-grid">
            {[...Array(8)].map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={i}>
                <div className="card skeleton-card" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="row mb-4 g-4 allcourses-grid">
            {filteredCourses.map((course) => (
              <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={course.id}>
                <div className="card course-card h-100">
                  <Link to={`/detail/${course.id}`}>
                    <img
                      src={course.featured_img}
                      className="card-img-top"
                      alt={course.title}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/detail/${course.id}`}>{course.title}</Link>
                    </h5>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div className="col-12 text-center pt-3">
                <h5 className="empty-state">No courses found.</h5>
              </div>
            )}
          </div>
        )}

        <nav aria-label="All courses pagination" className="pb-2">
          <ul className="pagination justify-content-center gap-2 flex-wrap">
            {previousUrl && (
              <li className="page-item">
                <button className="page-link nav-btn" onClick={() => fetchData(previousUrl)}>
                  <i className="bi bi-arrow-left"></i> Previous
                </button>
              </li>
            )}
            {nextUrl && (
              <li className="page-item">
                <button className="page-link nav-btn" onClick={() => fetchData(nextUrl)}>
                  Next <i className="bi bi-arrow-right"></i>
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="auto-scroll-carousel">
          <div className="carousel-track">
            {[...courseData, ...courseData].map((course, index) => (
              <div className="carousel-item" key={`${course.id}-${index}`}>
                <div className="card course-card h-100">
                  <Link to={`/detail/${course.id}`}>
                    <img src={course.featured_img} className="card-img-top" alt={course.title} />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/detail/${course.id}`}>{course.title}</Link>
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .allcourses-bg {
          width: 100%;
          min-height: 100vh;
          color: #fff;
          position: relative;
          z-index: 0;
          padding-bottom: 40px;
        }

        .allcourses-bg::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(${watermark}) no-repeat center center fixed;
          background-size: cover;
          filter: blur(14px);
          z-index: -1;
        }

        .allcourses-container {
          max-width: 1280px;
          margin-left: auto;margin-right: auto;
	          padding-left: 6px;
	          padding-right: 14px;
          
        }

        .allcourses-grid {
          justify-content: flex-start;
          margin-left: 0 !important;
          margin-right: 0 !important;
	          padding-left: 0;
	          padding-right: 8px;
          
        }

        .allcourses-grid > [class*="col-"] {
	          padding-left: 8px;
          padding-right: 12px;
          
        }

        .section-main-title {
          margin-top: 8px;
          margin-bottom: 14px;
          font-size: 40px;
          font-weight: 700;
          color: #ffffff;
        }

        .search-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
        }

        .search-input {
          width: min(420px, 100%);
          padding: 11px 16px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          outline: none;
          color: #111;
        }

        .course-card {
          background: rgba(0, 0, 0, 0.48);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 14px rgba(255, 193, 7, 0.35);
        }

        .course-card .card-img-top {
          height: 240px;
          width: 100%;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.35);
          padding: 8px;
        }

        .course-card .card-body {
          height: 102px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 12px;
          flex: 0 0 auto;
          
        }

        .course-card .card-title {
          margin: 0;
          font-weight: 700;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-card .card-title a {
          color: #ffc107;
          text-decoration: none;
        }

        .skeleton-card {
          height: 284px;
          border-radius: 12px;
          background: linear-gradient(90deg, #5e5e5e 0%, #8a8a8a 50%, #5e5e5e 100%);
          animation: skeletonGlow 1.2s infinite;
        }

        @keyframes skeletonGlow {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        .empty-state {
          color: #f5f5f5;
          opacity: 0.9;
        }

        .nav-btn {
          background: #ffc107;
          color: #292621;
          border-radius: 24px;
          font-weight: 700;
          padding: 8px 20px;
          border: none;
        }

        .nav-btn:hover {
          background: #e0a800;
        }

        .auto-scroll-carousel {
          width: 100%;
          overflow: hidden;
          position: relative;
          margin: 18px 0 0;
        }

        .carousel-track {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll 25s linear infinite;
        }

        .carousel-item {
          flex: 0 0 auto;
          margin-right: 14px;
          width: 250px;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
          .section-main-title {
            font-size: 30px;
          }

          .course-card .card-img-top {
            height: 210px;
          }

          .allcourses-container {
            padding: 0 10px;
          }

          .carousel-item {
            width: 220px;
          }
        }
      `}</style>
    </div>
  );
};

export default AllCourses;
