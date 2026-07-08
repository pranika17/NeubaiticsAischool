



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";

// const baseUrl = "http://127.0.0.1:8000/api/teacher/";

// const TeacherRegister = () => {
//   useEffect(() => {
//     document.title = "LMS | Teacher Register";
//     window.scrollTo(0, 0);
//   }, []);

//   const [teacherData, setTeacherData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     qualification: "",
//     mobile_no: "",
//     skills: "",
//     image: null,
//     status: "",
//   });

//   const [preview, setPreview] = useState(null);

//   const handleChange = (event) => {
//     const { name, value, files } = event.target;
//     if (name === "image") {
//       const file = files[0];
//       setTeacherData({ ...teacherData, image: file });
//       setPreview(file ? URL.createObjectURL(file) : null);
//     } else {
//       setTeacherData({ ...teacherData, [name]: value });
//     }
//   };

//   const submitForm = () => {
//     if (!teacherData.full_name || !teacherData.email || !teacherData.password || !teacherData.mobile_no) {
//       Swal.fire({
//         title: "Please fill all required fields!",
//         icon: "warning",
//         toast: true,
//         timer: 2000,
//         position: "top-right",
//         timerProgressBar: true,
//         showConfirmButton: false,
//       });
//       return;
//     }

//     const formData = new FormData();
//     for (let key in teacherData) {
//       if (teacherData[key]) formData.append(key, teacherData[key]);
//     }

//     axios
//       .post(baseUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then((response) => {
//         setTeacherData({
//           full_name: "",
//           email: "",
//           password: "",
//           qualification: "",
//           mobile_no: "",
//           skills: "",
//           image: null,
//           status: "success",
//         });
//         setPreview(null);

//        Swal.fire({
//     html: `
//         <b>Registered Successfully!</b><br/>
//         <span style="font-size:14px;">You will be allowed to login after <b>Admin Approval</b>.<br/>
//         Please check your email.</span>
//     `,
//     icon: "success",
//     toast: false,
//     position: "center",
//     showConfirmButton: true
// });
//         setTimeout(() => {
//           window.location.href = "/teacher-login";
//         }, 2500);
//       })
//       .catch(() => {
//         setTeacherData({ ...teacherData, status: "error" });
//       });
//   };

//   // Redirect if already logged in
//   const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
//   if (teacherLoginStatus === "true") window.location.href = "/teacher-dashboard";

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
//           <div className="card border-0 shadow rounded-3 my-5">
//             <div className="card-body p-4 p-sm-5">
//               <div className="text-center">
//                 <h5 className="card-title mb-3 fw-light fs-5 text-dark">TEACHER SIGN UP</h5>
//               </div>

//               {teacherData.status === "success" && <h3 className="text-center text-success mb-3">Registered Successfully.</h3>}
//               {teacherData.status === "error" && <h3 className="text-center text-danger mb-3">Please fill all fields correctly.</h3>}

//               {/* Required Fields */}
//               <div className="form-floating mb-3">
//                 <input type="text" name="full_name" value={teacherData.full_name} onChange={handleChange} className="form-control" placeholder="Full Name" />
//                 <label>Full Name</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input type="email" name="email" value={teacherData.email} onChange={handleChange} className="form-control" placeholder="Email" />
//                 <label>Email Id</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input type="password" name="password" value={teacherData.password} onChange={handleChange} className="form-control" placeholder="Password" />
//                 <label>Password</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input type="text" name="qualification" value={teacherData.qualification} onChange={handleChange} className="form-control" placeholder="Qualification" />
//                 <label>Qualification</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input type="number" name="mobile_no" value={teacherData.mobile_no} onChange={handleChange} className="form-control" placeholder="Mobile No" />
//                 <label>Mobile No</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <textarea name="skills" value={teacherData.skills} onChange={handleChange} className="form-control" placeholder="Skills" />
//                 <label>Skills</label>
//                 <div className="form-text">Eg: Python, Java, C, C++, Web Development etc...</div>
//               </div>

             

//               {/* Profile Image */}
//               <div className="form-floating mb-3">
//                 <input type="file" name="image" onChange={handleChange} className="form-control" accept="image/*" />
//                 <label>Profile Image</label>
//                 {preview && <img src={preview} alt="preview" className="mt-2 rounded" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
//               </div>

//               <div className="d-grid my-4">
//                 <button onClick={submitForm} className="btn btn-success rounded-pill btn-login text-uppercase fw-bold">SIGN UP</button>
//                 <hr />
//                 <Link to="/teacher-login" className="btn btn-danger rounded-pill btn-login text-uppercase fw-bold">SIGN IN</Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherRegister;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ProfileImageUpload from "./ProfileImageUpload";
import { baseUrl } from "../../config";

const registerUrl = `${baseUrl}/teacher/`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TeacherRegister = () => {
  useEffect(() => {
    document.title = "LMS | Teacher Register";
    window.scrollTo(0, 0);
  }, []);

  const [teacherData, setTeacherData] = useState({
    full_name: "",
    email: "",
    password: "",
    qualification: "",
    mobile_no: "",
    skills: "",
    image: null,
    status: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      const file = files[0];
      setTeacherData({ ...teacherData, image: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setTeacherData({ ...teacherData, [name]: value });
    }
  };

  const submitForm = () => {
    if (!teacherData.full_name || !teacherData.email || !teacherData.password || !teacherData.mobile_no) {
      Swal.fire({
        title: "Please fill all required fields!",
        icon: "warning",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    if (!emailPattern.test(String(teacherData.email).trim())) {
      Swal.fire({
        title: "Please provide a valid email address!",
        icon: "warning",
        toast: true,
        timer: 2200,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    for (let key in teacherData) {
      if (teacherData[key]) formData.append(key, teacherData[key]);
    }

    axios
      .post(registerUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setTeacherData({
          full_name: "",
          email: "",
          password: "",
          qualification: "",
          mobile_no: "",
          skills: "",
          image: null,
          status: "success",
        });
        setPreview(null);

       Swal.fire({
    html: `
        <b>Registered Successfully!</b><br/>
        <span style="font-size:14px;">You will be allowed to login after <b>Admin Approval</b>.<br/>
        Please check your email.</span>
    `,
    icon: "success",
    toast: false,
    position: "center",
    showConfirmButton: true
});
        setTimeout(() => {
          window.location.href = "/teacher-login";
        }, 2500);
      })
      .catch((error) => {
        setTeacherData({ ...teacherData, status: "error" });
        const errData = error.response?.data;
        const msg = errData?.email?.[0] || errData?.msg || "Please fill all fields correctly.";
        Swal.fire({
          title: msg,
          icon: "error",
          toast: true,
          timer: 2500,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  };

  // Redirect if already logged in
  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  if (teacherLoginStatus === "true") window.location.href = "/teacher-dashboard";

  return (
  <div className="teacher-register-page register-bg d-flex align-items-center justify-content-center">
    <div className="register-card shadow-lg">
      <h3 className="text-center mb-4 text-gradient">
        Teacher Registration
      </h3>

      {/* Required Fields */}
      <div className="form-floating mb-3">
        <input
          type="text"
          name="full_name"
          value={teacherData.full_name}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Full Name"
        />
        <label>Full Name</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="email"
          name="email"
          value={teacherData.email}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Email"
        />
        <label>Email</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          name="password"
          value={teacherData.password}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Password"
        />
        <label>Password</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="text"
          name="qualification"
          value={teacherData.qualification}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Qualification"
        />
        <label>Qualification</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          name="mobile_no"
          value={teacherData.mobile_no}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Mobile No"
        />
        <label>Mobile No</label>
      </div>

      <div className="form-floating mb-3">
        <textarea
          name="skills"
          value={teacherData.skills}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Skills"
        />
        <label>Skills</label>
        <div className="form-text text-info">
          Eg: Python, Java, Web Development
        </div>
      </div>

      {/* Image */}
      {/* Profile Image (Cropped like WhatsApp / Instagram) */}
<div className="mb-3">
  <label className="form-label fw-bold">
    Profile Picture
  </label>

  <ProfileImageUpload
    onImageCropped={(blob) => {
  const file = new File([blob], "profile.jpg", {
    type: "image/jpeg",
  });

  setTeacherData({ ...teacherData, image: file });
  setPreview(URL.createObjectURL(file));
}}

  />

  {preview && (
    <img
      src={preview}
      alt="preview"
      className="mt-3"
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #19b5e8",
      }}
    />
  )}
</div>


      <button
        onClick={submitForm}
        className="btn btn-gradient w-100 mb-3"
      >
        Sign Up
      </button>

      <Link
        to="/teacher-login"
        className="btn btn-outline-info w-100"
      >
        Already have an account? Sign In
      </Link>
    </div>
  </div>
);

};

export default TeacherRegister;
