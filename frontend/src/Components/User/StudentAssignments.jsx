import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api";

const StudentAssignments = () => {
  const studentId = localStorage.getItem("studentId");
  const [assignmentData, setAssignmentData] = useState([]);
  const [uploadData, setUploadData] = useState({
    answer_text: "",
    upload_file: null,
    upload_image: null,
  });

  const fetchAssignments = () => {
    axios
      .get(`${baseUrl}/my-assignments/${studentId}/`)
      .then((res) => setAssignmentData(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    document.title = "LMS | My Assignments";
    fetchAssignments();
  }, [studentId]);

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    setUploadData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const submitAssignment = async (assignmentId) => {
    const formData = new FormData();
    formData.append("answer_text", uploadData.answer_text);

    if (uploadData.upload_file) formData.append("upload_file", uploadData.upload_file);
    if (uploadData.upload_image) formData.append("upload_image", uploadData.upload_image);

    try {
      const res = await axios.patch(
        `${baseUrl}/submit-assignment/${assignmentId}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire({
        title: "Submitted Successfully!",
        icon: "success",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });

      // reset form
      setUploadData({ answer_text: "", upload_file: null, upload_image: null });

      fetchAssignments();
    } catch (err) {
      console.log(err.response?.data || err);
      Swal.fire("Error", "Submission failed!", "error");
    }
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <Sidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">My Assignments</h5>

            <div className="card-body">
              {assignmentData.length > 0 ? (
                assignmentData.map((row) => (
                  <div className="card mb-3" key={row.id}>
                    <div className="card-body">
                      <h6><b>{row.title}</b></h6>
                      <p>{row.detail}</p>

                      {row.student_status ? (
                        <span className="badge bg-success rounded-pill">Submitted</span>
                      ) : (
                        <span className="badge bg-warning rounded-pill">Pending</span>
                      )}

                      <hr />

                      {!row.student_status && (
                        <>
                          <textarea
                            name="answer_text"
                            className="form-control mb-2"
                            placeholder="Write your answer..."
                            value={uploadData.answer_text}
                            onChange={handleUploadChange}
                          />
{/* Upload File */}
<div className="mb-3">
  <label className="form-label fw-bold">Upload File</label>
  <input
    type="file"
    name="upload_file"
    className="form-control"
    onChange={handleUploadChange}
  />
  {uploadData.upload_file && (
    <small className="text-muted">
      Selected: {uploadData.upload_file.name}
    </small>
  )}
</div>

{/* Upload Image */}
<div className="mb-3">
  <label className="form-label fw-bold">Upload Image</label>
  <input
    type="file"
    accept="image/*"
    name="upload_image"
    className="form-control"
    onChange={handleUploadChange}
  />
  {uploadData.upload_image && (
    <small className="text-muted">
      Selected: {uploadData.upload_image.name}
    </small>
  )}
</div>


                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => submitAssignment(row.id)}
                          >
                            Submit Assignment
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No assignments found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentAssignments;