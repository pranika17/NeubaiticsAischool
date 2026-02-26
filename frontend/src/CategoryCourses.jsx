import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryCourses.css";

const baseUrl = "http://127.0.0.1:8000/api";

const CategoryCourses = () => {
  const { category_id } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({});
  const [nextUrl, setNextUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);

  useEffect(() => {
    document.title = "LMS | Category Courses";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (category_id) {
      fetchCategoryData(category_id);
      fetchData(`${baseUrl}/course/?category=${category_id}`);
    }
  }, [category_id]);

  const fetchData = async (url) => {
    try {
      const res = await axios.get(url);
      setCourseData(res.data.results || res.data);
      setNextUrl(res.data.next);
      setPreviousUrl(res.data.previous);
    } catch (error) {
      console.error("Fetch Data Error:", error);
    }
  };

  const fetchCategoryData = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/category/${id}/`);
      setCategoryInfo(res.data);
    } catch (error) {
      console.error("Fetch Category Error:", error);
    }
  };

  const paginationHandler = (url) => {
    if (url) fetchData(url);
  };

  return (
    <div className="container mt-4 categorycourses-page">
      <h3 className="mb-4">
        {categoryInfo.title ? categoryInfo.title : "Category"} Courses
      </h3>

      <div className="row">
        {courseData.length > 0 ? (
          courseData.map((course) => (
            <div className="col-lg-4 col-md-6 mb-4" key={course.id}>
              
              <div className="card h-100 shadow-sm">
                <img
                  src={course.featured_img || "/placeholder.jpg"}
                  className="card-img-top"
                  alt={course.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">
                    {course.description
                      ? course.description.slice(0, 60)
                      : "No description available."}
                    ...
                  </p>
                  <Link
                    to={`/detail/${course.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available for this category.</p>
        )}
      </div>

      <div className="text-center mt-4">
        {previousUrl && (
          <button
            className="btn btn-secondary me-2"
            onClick={() => paginationHandler(previousUrl)}
          >
            Previous
          </button>
        )}
        {nextUrl && (
          <button
            className="btn btn-secondary"
            onClick={() => paginationHandler(nextUrl)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCourses;