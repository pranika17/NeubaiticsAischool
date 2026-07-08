import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ShowAssignment.css";
import { baseUrl, siteUrl } from '../../config';

const ShowAssignment = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    document.title = "LMS | Assignment Details";
  }, []);

  const [assignmentData, setAssignmentData] = useState([]);
  const [totalResult, settotalResult] = useState(0);

  const { teacher_id, student_id } = useParams();

  useEffect(() => {
  axios
  .get(`${baseUrl}/student-assignment/${teacher_id}/${student_id}/`)
  .then((res) => {
    settotalResult(res.data.length);
    setAssignmentData(res.data);

    // ✅ Correct Debugging
    console.log("✅ Assignment API DATA =", res.data);
  })
  .catch((error) => console.log(error));

      
  }, [teacher_id, student_id]);

  return (
    <div className="container mt-4 assignment-page">
      <div className="row">
        <section className="col-md-9 assignment-section">
          <div className="assignment-card">
            <div className="assignment-card-header">
              <h5 className="assignment-title">All Assignments ({totalResult})</h5>
              <Link
                className="btn assignment-add-btn btn-sm"
                to={`/add-assignment/${teacher_id}/${student_id}`}
              >
                Add Assignment
              </Link>
            </div>

            <div className="assignment-table-wrap">
              <table className="assignment-table">
                <thead>
                  <tr>
                    <th className="title-col">Title</th>
                    <th className="status-col text-center">Status</th>
                    <th className="submission-col">Submission</th>
                  </tr>
                </thead>

                <tbody>
                  {assignmentData.length > 0 ? (
                    assignmentData.map((row) => (
                      <tr key={row.id}>
                        <td className="assignment-name">{row.title}</td>

                        <td className="text-center">
                          {row.student_status ? (
                            <span className="assignment-badge completed">Completed</span>
                          ) : (
                            <span className="assignment-badge pending">Pending</span>
                          )}
                        </td>

                        <td>
                          <div className="submission-actions">
                            {row.upload_file ? (
                              <a
                                href={
                                  row.upload_file.startsWith("http")
                                    ? row.upload_file
                                    : `${siteUrl}${row.upload_file}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="btn submission-btn file-btn"
                              >
                                View File
                              </a>
                            ) : (
                              <span className="empty-state">No File</span>
                            )}

                            {row.upload_image ? (
                              <a
                                href={
                                  row.upload_image.startsWith("http")
                                    ? row.upload_image
                                    : `${siteUrl}${row.upload_image}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="btn submission-btn image-btn"
                              >
                                View Image
                              </a>
                            ) : (
                              <span className="empty-state">No Image</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center empty-row">
                        No Assignments Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShowAssignment;
