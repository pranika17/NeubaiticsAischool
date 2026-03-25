import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import "./AddStudyMaterial.css";

const baseUrl = "http://127.0.0.1:8000/api";

const AddStudyMaterial = () => {
  useEffect(() => {
    document.title = "LMS | Add Study Material";
  }, []);

  const { course_id } = useParams();

  const [studyData, setStudyData] = useState({
    title: "",
    description: "",
    upload: null,     // ✅ IMPORTANT (not "")
    remarks: "",
  });

  const handleChange = (event) => {
    setStudyData({
      ...studyData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setStudyData({
      ...studyData,
      upload: event.target.files[0],   // ✅ store direct
    });
  };

  const formSubmit = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("title", studyData.title);
    _formData.append("description", studyData.description);
    _formData.append("remarks", studyData.remarks);

    // ✅ only add upload if user selected file
    if (studyData.upload) {
      _formData.append("upload", studyData.upload);
    }

    axios
      .post(`${baseUrl}/study-material/${course_id}`, _formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Uploaded Successfully!",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // ✅ reset form
          setStudyData({
            title: "",
            description: "",
            upload: null,
            remarks: "",
          });
        }
      })
      .catch((error) => {
        console.log("❌ Upload error:", error.response?.data || error);
        Swal.fire({
          title: "Upload Failed",
          text: "Check console error",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  };

  return (
    <div className="container-fluid mt-4 asm-page">
      <div className="row justify-content-center">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-12 col-md-10 col-lg-8 col-xl-7 asm-section">
          <div className="teacher-card">
            <div className="g-card">
              <h3 className="g-card-title">
                <i className="bi bi-upload me-2"></i> Add Study Materials
              </h3>

              <div className="g-card-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={studyData.title}
                    onChange={handleChange}
                    name="title"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={studyData.description}
                    onChange={handleChange}
                    name="description"
                    className="form-control"
                    rows="4"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    value={studyData.remarks}
                    className="form-control"
                    onChange={handleChange}
                    name="remarks"
                    rows="3"
                  />
                </div>

                <button
                  type="button"
                  onClick={formSubmit}
                  className="btn g-btn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddStudyMaterial;
