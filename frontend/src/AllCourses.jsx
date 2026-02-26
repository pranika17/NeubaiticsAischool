import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import watermark from './assets/imageofai.webp';

const baseUrl = 'http://127.0.0.1:8000/api/course/';

const AllCourses = () => {
  const [courseData, setCourseData] = useState([]);
  const [nextUrl, setNextUrl] = useState();
  const [previousUrl, setPreviousUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { window.scrollTo(0, 0) }, []);
  useEffect(() => { document.title = 'LMS | Latest Courses' }, []);
  useEffect(() => { fetchData(baseUrl) }, []);

  const fetchData = (url) => {
    try {
      setLoading(true);
      axios.get(url).then(res => {
        setNextUrl(res.data.next);
        setPreviousUrl(res.data.previous);
        setCourseData(res.data.results);
        setTimeout(() => setLoading(false), 400);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const paginationHandler = (url) => { fetchData(url); };

  return (
    <div className='all-dark-bg mt-4 px-4 allcourses-page'>
      <div className="text-center section-header">
        <h1 className="section-main-title">All Courses</h1>
      </div>

      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && (
        <div className="row mt-4">
          {[...Array(8)].map((_, i) => (
            <div className="col-md-3 mb-4" key={i}>
              <div className="card skeleton-card"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className='row mb-4'>
          {courseData
            .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
            .map((course, index) =>
              <div className='col-md-3 mb-4' key={index}>
                <div className="card course-card">
                  <Link to={`/detail/${course.id}`}>
                    <img
                      src={course.featured_img}
                      height={200}
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
            )}
        </div>
      )}

      <nav aria-label="Page navigation example mt-3">
        <ul className="pagination justify-content-center">
          {previousUrl &&
            <li className='page-item'>
              <button
                className='page-link nav-btn'
                onClick={() => paginationHandler(previousUrl)}
              >
                <i className='bi bi-arrow-left'></i> Previous
              </button>
            </li>
          }
          {nextUrl &&
            <li className='page-item'>
              <button
                className='page-link nav-btn'
                onClick={() => paginationHandler(nextUrl)}
              >
                Next <i className='bi bi-arrow-right'></i>
              </button>
            </li>
          }
        </ul>
      </nav>

      {/* AUTO-SCROLL CAROUSEL */}
      <div className="auto-scroll-carousel">
        <div className="carousel-track">
          {[...courseData, ...courseData].map((course, index) => (
            <div className="carousel-item" key={index}>
              <div className="card course-card">
                <Link to={`/detail/${course.id}`}>
                  <img
                    src={course.featured_img}
                    height={200}
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
        </div>
      </div>

      <style>{`
        html, body { margin:0; padding:0; min-height:100vh; position:relative; }

        .all-dark-bg {
          width:100%; min-height:100vh; padding-bottom:50px;
          color:#fff; position:relative; z-index:0;
        }

        .all-dark-bg::before {
          content:"";
          position:fixed; top:0; left:0;
          width:100%; height:100%;
          background:url(${watermark}) no-repeat center center fixed;
          background-size:cover;
          filter:blur(15px);
          z-index:-1;
        }

        .section-main-title { margin-top:10px; font-size:40px; font-weight:700; color:#fff; }
        .search-wrap { display:flex; justify-content:center; margin-bottom:20px; }
        .search-input { width:300px; padding:10px 15px; border-radius:25px; border:none; outline:none; }

        .course-card {
          background: rgba(0,0,0,0.45);
          border: 1px solid #343a40;
          border-radius: 10px;
          overflow: hidden;
          transition: .3s;
        }
        .course-card:hover { transform: translateY(-5px); box-shadow: 0 0 12px #ffc10755; }
        .course-card img { object-fit: cover; }

        /* FIXED MIN-HEIGHT FOR ALIGNMENT */
        .course-card .card-body {
          min-height: 84px;        
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* Optional title clamp (keeps grid clean) */
        .course-card .card-title {
          margin: 0;
          font-weight: bold;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-card .card-title a {
          color:#ffc107;
          text-decoration:none;
        }

        .skeleton-card {
          height:250px;
          background: linear-gradient(90deg,#5e5e5eff 0%,#8a8a8a 50%,#5e5e5e 100%);
          animation: skeletonGlow 1.2s infinite;
        }
        @keyframes skeletonGlow { 0%{opacity:.4;} 50%{opacity:1;} 100%{opacity:.4;} }

        .nav-btn { background:#ffc107; color:#292621; border-radius:25px; font-weight:bold; padding:8px 20px; border:none; }
        .nav-btn:hover { background:#e0a800; }

        /* AUTO-SCROLL */
        .auto-scroll-carousel {
          width: 100%;
          overflow: hidden;
          position: relative;
          margin: 20px 0;
        }

        .carousel-track {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll 25s linear infinite;
        }

        .carousel-item {
          flex: 0 0 auto;
          margin-right: 16px;
          width: 250px;
        }

        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }

       /* ============================= */
/* DESKTOP RIGHT SHIFT */
/* ============================= */
@media (min-width: 992px) {
  .allcourses-page {
    margin-left: -70px;   /* 👈 same as sidebar width */
  }
}

      `}</style>
    </div>
  );
};

export default AllCourses;

