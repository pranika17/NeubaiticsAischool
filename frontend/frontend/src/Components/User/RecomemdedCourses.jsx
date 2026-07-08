import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RecomemdedCourses.css';
import { baseUrl, defaultCourseImageUrl, resolveMediaUrl } from '../../config';

const sectionConfig = [
  { key: 'interest_matches', title: 'Based on Your Interests', icon: 'bi-stars' },
  { key: 'bridge_courses', title: 'Continue Your Skill Path', icon: 'bi-signpost-split' },
  { key: 'popular_courses', title: 'Popular on Platform', icon: 'bi-fire' },
  { key: 'new_courses', title: 'Newly Added Courses', icon: 'bi-lightning-charge' },
];

const RecomemdedCourses = () => {
  const studentId = localStorage.getItem('studentId');
  const [sections, setSections] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`${baseUrl}/student-course-discovery/${studentId}/`)
      .then((res) => setSections(res.data || {}))
      .catch((error) => console.log(error))
      .finally(() => setLoaded(true));
  }, [studentId]);

  useEffect(() => {
    document.title = 'LMS | Course Discovery';
  }, []);

  const openDescription = (course) => setSelectedCourse(course);
  const closeDescription = () => setSelectedCourse(null);

  return (
    <div className='container-fluid mt-4 discovery-page'>
      <section className='px-2 px-md-3'>
        <div className='discovery-shell'>
          <div className='discovery-header'>
            <h4 className='mb-0 discovery-heading'>
              <i className='bi bi-compass me-2'></i>Course Discovery For You
            </h4>
            <p className='mb-0 discovery-subtitle'>
              Find the next best course from interest matches, popular picks, and new launches.
            </p>
          </div>

          <div className='discovery-body'>
            {loaded && Object.values(sections).every((v) => Array.isArray(v) && v.length === 0) && (
              <p className='text-muted mb-0'>No discovery courses available right now.</p>
            )}

            {sectionConfig.map(({ key, title, icon }) => {
              const list = sections[key] || [];
              if (list.length === 0) return null;

              return (
                <div key={key} className='discovery-section'>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h6 className='fw-bold mb-0'>
                      <i className={`bi ${icon} me-2`}></i>
                      {title}
                    </h6>
                    <span className='discovery-count'>{list.length} course(s)</span>
                  </div>
                  <div className='discovery-grid'>
                    {list.map((course) => {
                      return (
                        <div className='discovery-grid-item' key={course.id}>
                          <div className='discovery-card'>
                            <button
                              type='button'
                              className='discovery-image-link'
                              onClick={() => openDescription(course)}
                            >
                              <img
                                className='discovery-thumb'
                                src={resolveMediaUrl(course.featured_img, defaultCourseImageUrl)}
                                alt={course.title}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = defaultCourseImageUrl;
                                }}
                              />
                            </button>

                            <div className='discovery-card-body'>
                              <button
                                type='button'
                                className='discovery-title discovery-title-btn'
                                onClick={() => openDescription(course)}
                              >
                                {course.title}
                              </button>

                              <p className='discovery-meta-line'>
                                <span className='discovery-tech-chip'>
                                  <i className='bi bi-cpu me-1'></i>
                                  {course.techs || 'General'}
                                </span>
                              </p>

                              <p className='discovery-desc-pill'>
                                {course.description || 'No description available.'}
                              </p>

                              <p className='discovery-meta-line'>
                                <span className='discovery-label'>Teacher:</span>{' '}
                                <Link to={`/teacher-detail/${course.teacher?.id}`} className='discovery-link'>
                                  {course.teacher?.full_name || 'Teacher'}
                                </Link>
                              </p>

                              <div className='d-flex gap-2 mt-auto pt-2'>
                                <button
                                  type='button'
                                  className='btn btn-sm discovery-btn'
                                  onClick={() => openDescription(course)}
                                >
                                  Explore Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCourse && (
        <div className='discovery-modal-backdrop' onClick={closeDescription}>
          <div className='discovery-modal' onClick={(e) => e.stopPropagation()}>
            <div className='d-flex justify-content-between align-items-start mb-2'>
              <h5 className='mb-0'>{selectedCourse.title}</h5>
              <button type='button' className='btn-close btn-close-white' onClick={closeDescription}></button>
            </div>
            <p className='discovery-modal-meta mb-2'>
              <strong>Teacher:</strong> {selectedCourse.teacher?.full_name || 'Teacher'}
            </p>
            <p className='discovery-modal-meta mb-3'>
              <strong>Tech:</strong> {selectedCourse.techs || 'General'}
            </p>
            <p className='discovery-modal-desc'>
              {selectedCourse.description || 'No description provided.'}
            </p>
            <div className='d-flex justify-content-end gap-2 mt-3'>
              <button type='button' className='btn btn-sm discovery-btn-outline' onClick={closeDescription}>
                Close
              </button>
              <Link to={`/user/detail/${selectedCourse.id}`} className='btn btn-sm discovery-btn' onClick={closeDescription}>
                View full details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecomemdedCourses;
