import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

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
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              All Assignments ({totalResult})
              <Link
                className="btn btn-success btn-sm float-end"
                to={`/add-assignment/${teacher_id}/${student_id}`}
              >
                Add Assignment
              </Link>
            </h5>

            <div className="card-body table-responsive">
              <table className="table table-bordered text-white">
  <thead>
    <tr>
      <th>Title</th>
      <th>Status</th>
      <th>Submission</th>
    </tr>
  </thead>

  <tbody>
    {assignmentData.length > 0 ? (
      assignmentData.map((row) => (
        <tr key={row.id}>
          <td>{row.title}</td>

          <td>
            {row.student_status ? (
              <span className="badge rounded-pill bg-success">Completed</span>
            ) : (
              <span className="badge rounded-pill bg-warning">Pending</span>
            )}
          </td>

          <td style={{ whiteSpace: "nowrap" }}>
            {row.upload_file ? (
              <a
                href={
                  row.upload_file.startsWith("http")
                    ? row.upload_file
                    : `http://127.0.0.1:8000${row.upload_file}`
                }
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary me-2"
              >
                View File
              </a>
            ) : (
              <span className="text-muted me-2">No File</span>
            )}

            {row.upload_image ? (
              <a
                href={
                  row.upload_image.startsWith("http")
                    ? row.upload_image
                    : `http://127.0.0.1:8000${row.upload_image}`
                }
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-success"
              >
                View Image
              </a>
            ) : (
              <span className="text-muted">No Image</span>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" className="text-center">
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