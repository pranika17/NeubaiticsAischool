// Register.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProfileImageUpload from "../Teacher/ProfileImageUpload";

const baseUrl = 'http://127.0.0.1:8000/api/student/'  // new endpoint
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    useEffect(() => {
        document.title = 'LMS | Student Register'
        window.scrollTo(0, 0)
    }, [])

    const [studentData, setStudentData] = useState({
        fullname: '',
        email: '',
        password: '',
        username: '',
        interseted_categories: '',
        image: null
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image') {
            const file = files[0];
            setStudentData({ ...studentData, image: file });
            setPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setStudentData({ ...studentData, [name]: value });
        }
    }

    const submitForm = () => {
        if (!studentData.fullname || !studentData.email || !studentData.password || !studentData.username || !studentData.interseted_categories) {
            Swal.fire({
                title: 'Please fill all fields!',
                icon: 'warning',
                toast: true,
                timer: 2000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        if (!emailPattern.test(String(studentData.email).trim())) {
            Swal.fire({
                title: 'Please provide a valid email address!',
                icon: 'warning',
                toast: true,
                timer: 2200,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        const formData = new FormData();
        formData.append('fullname', studentData.fullname);
        formData.append('email', studentData.email);
        formData.append('username', studentData.username);
        formData.append('password', studentData.password);
        formData.append('interseted_categories', studentData.interseted_categories);
        if (studentData.image) formData.append('image', studentData.image);

        axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            const data = response.data;
            if (data.bool) {
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
                setTimeout(() => { window.location.href = '/user-login'; }, 2500);
            } else {
                Swal.fire({
                    title: data.msg || 'Registration Failed!',
                    icon: 'error',
                    toast: true,
                    timer: 2500,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        })
       .catch((error) => {
    const errData = error.response?.data;
    let msg = 'Registration Failed!';

    if (errData?.email) {
        msg = errData.email[0]; // "student with this email already exists."
    }

    Swal.fire({
        title: msg,
        icon: 'error',
        toast: true,
        timer: 2500,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false
    });
});

    }
return (
  <div className="student-register-page register-bg d-flex align-items-center justify-content-center">
    <div className="register-card shadow-lg">
      <h3 className="text-center mb-4 text-gradient">
        Student Registration
      </h3>

      <div className="form-floating mb-3">
        <input type="text" name="fullname" onChange={handleChange}
          className="form-control custom-input" placeholder="Full Name" />
        <label>Full Name</label>
      </div>

      <div className="form-floating mb-3">
        <input type="email" name="email" onChange={handleChange}
          className="form-control custom-input" placeholder="Email" />
        <label>Email</label>
      </div>

      <div className="form-floating mb-3">
        <input type="text" name="username" onChange={handleChange}
          className="form-control custom-input" placeholder="Username" />
        <label>Username</label>
      </div>

      <div className="form-floating mb-3">
        <input type="password" name="password" onChange={handleChange}
          className="form-control custom-input" placeholder="Password" />
        <label>Password</label>
      </div>

      <div className="form-floating mb-3">
        <textarea name="interseted_categories" onChange={handleChange}
          className="form-control custom-input" placeholder="Interest" />
        <label>Interest</label>
      </div>

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

      setStudentData({ ...studentData, image: file });
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


      <button onClick={submitForm} className="btn btn-gradient w-100 mb-3">
        Sign Up
      </button>

      <Link to="/user-login" className="btn btn-outline-info w-100">
        Already have an account? Sign In
      </Link>
    </div>
  </div>
);

}

export default Register
