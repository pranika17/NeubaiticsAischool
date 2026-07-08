import { baseUrl } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const TeacherLogin = () => {
  const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');

  const [teacherLoginData, setTeacherLoginData] = useState({
    login_id: '',
    password: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'LMS | Teacher Login';

    if (teacherLoginStatus === 'true') {
      window.location.href = '/teacher-dashboard';
    }
  }, [teacherLoginStatus]);

  const handleChange = (event) => {
    setTeacherLoginData({
      ...teacherLoginData,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = async () => {
    if (!teacherLoginData.login_id || !teacherLoginData.password) {
      Swal.fire({
        title: 'Please fill in all fields!',
        icon: 'warning',
        toast: true,
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/teacher-login`,
        {
          login_id: teacherLoginData.login_id,
          password: teacherLoginData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (res.data.bool === true) {
        localStorage.setItem('teacherLoginStatus', 'true');
        localStorage.setItem('teacherId', res.data.teacher_id);
        localStorage.setItem('teacherCode', res.data.teacher_code || '');
        localStorage.setItem('teacherName', res.data.teacher_name || '');

        if (res.data.chat_token) {
          localStorage.setItem('chatAuthTokenTeacher', res.data.chat_token);
          localStorage.setItem('chatAuthToken', res.data.chat_token);
        }

        Swal.fire({
          title: 'Login Successful!',
          icon: 'success',
          toast: true,
          timer: 1800,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false
        });

        window.location.href = '/teacher-dashboard';
        return;
      }

      if (res.data.msg === 'waiting_approval') {
        Swal.fire({
          title: 'Waiting for Approval',
          text: res.data.detail || 'Your account is not approved by admin yet. After admin approval, please login.',
          icon: 'info',
          toast: true,
          position: 'top',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        return;
      }

      Swal.fire({
        title: res.data.msg || 'Invalid login details!',
        icon: 'error',
        toast: true,
        timer: 2000,
        position: 'top',
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Something went wrong!',
        icon: 'error',
        toast: true,
        timer: 2000,
        position: 'top',
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="register-page register-bg d-flex align-items-center justify-content-center">
      <div className="register-card shadow-lg">
        <h3 className="text-center mb-4 text-gradient">
          Teacher Sign In
        </h3>

        <div className="mb-3">
          <input
            type="text"
            name="login_id"
            value={teacherLoginData.login_id}
            onChange={handleChange}
            className="form-control custom-input"
            placeholder="Teacher ID or Email"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={teacherLoginData.password}
            onChange={handleChange}
            className="form-control custom-input"
            placeholder="Password"
          />
        </div>

        <button
          onClick={submitForm}
          className="btn btn-gradient w-100 mb-3"
        >
          Sign In
        </button>

        <Link
          to="/teacher-register"
          className="btn btn-outline-light w-100"
        >
          Create Account
        </Link>

        <p className="mt-3 mb-0 text-center text-muted small">
          Use your generated Teacher ID like <strong>TCH00001</strong> or your email.
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
