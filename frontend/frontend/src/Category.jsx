import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { baseUrl } from './config';
import bgImg from "./assets/robot.jpg"
const Category = () => {
  const [categoryData, setCategoryData] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    document.title = 'LMS | Our Categories'
  }, [])

  useEffect(() => {
    axios.get(baseUrl + '/category/')
      .then((res) => setCategoryData(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filtered = categoryData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="category-bg">

      <div className="">

        {/* White Title */}
        <div className="text-center section-header">
          <h1 className="section-main-title">Our Categories</h1>
        </div>

        {/* Search Bar */}
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="row mb-4 mt-4">
          {filtered.map((row, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card">
                <div className="card-body">

                  <h5 className="card-title">
                    <Link to={`/course/${row.id}/${row.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {row.title} ({row.total_courses})
                    </Link>
                  </h5>

                  <p className="card-text">{row.description}</p>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>


      <style>{`

        /* BG */
        .category-bg {
          position: relative;
          min-height: 100vh;
          padding-bottom: 40px;
        }

        .category-bg::before {
          content: "";
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: url(${bgImg}) no-repeat center center fixed;
          background-size: cover;
          filter: blur(10px);
          z-index: -1;
        }

        .card-text {
  color: #ffffffff !important;
}


/* Hover animation */
.card {
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Glow + lift effect */
.card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
  background: rgba(0,0,0,0.75); /* Slightly lighter effect */
}



        /* Header clean */
        .navbar, .navbar-expand-lg, nav {
          background: #ffffff !important;
          border-bottom: none !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }

        /* White heading */
        .section-main-title {
          color: #fff;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 25px;
          text-shadow: 0px 3px 8px rgba(0,0,0,0.4);
        }

        /* Search bar styling */
        .search-wrap {
          text-align: center;
          margin-top: 20px;
        }

        .search-input {
          width: 300px;
          max-width: 500px;
          padding: 12px 18px;
          border-radius: 30px;
          border: none;
          outline: none;
          font-size: 16px;
          box-shadow: 0px 3px 10px rgba(0,0,0,0.2);
        }

        /* Cards */
       .card {
  width: 280px;
  height: 300px;
  margin: auto;
}

        .card-title a {
          color: #ffc107;
          font-weight: 600;
          text-decoration: none;
        }

        
          .card-body {

          

  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

      `}</style>

    </div>
  )
}

export default Category