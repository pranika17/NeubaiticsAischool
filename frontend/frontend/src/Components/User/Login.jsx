import { baseUrl } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';

const Login = () => {
  const studentLoginStatus = localStorage.getItem('studentLoginStatus');

  const [studentLoginData, setStudentLoginData] = useState({
    login_id: '',
    password: ''
  });

  const [sunVisible, setSunVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [whiteTheme, setWhiteTheme] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'LMS | Student Login';

    if (studentLoginStatus === 'true') {
      window.location.href = '/user-dashboard';
    }

    const sunTimer = setTimeout(() => setSunVisible(true), 2200);
    const themeTimer = setTimeout(() => setWhiteTheme(true), 3000);
    const formTimer = setTimeout(() => setFormVisible(true), 4000);

    return () => {
      clearTimeout(sunTimer);
      clearTimeout(themeTimer);
      clearTimeout(formTimer);
    };
  }, [studentLoginStatus]);

  const handleChange = (e) => {
    setStudentLoginData({ ...studentLoginData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    if (!studentLoginData.login_id || !studentLoginData.password) {
      Swal.fire({
        title: 'Please fill in all fields!',
        icon: 'warning',
        toast: true,
        timer: 2000,
        position: 'top',
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/student-login`,
        {
          login_id: studentLoginData.login_id,
          password: studentLoginData.password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (res.data.bool === true) {
        localStorage.setItem('studentLoginStatus', 'true');
        localStorage.setItem('studentId', res.data.student_id);
        localStorage.setItem('studentCode', res.data.student_code || '');
        localStorage.setItem('studentName', res.data.student_name || '');

        if (res.data.chat_token) {
          localStorage.setItem('chatAuthTokenStudent', res.data.chat_token);
          localStorage.setItem('chatAuthToken', res.data.chat_token);
        }

        Swal.fire({
          title: 'Login Successful!',
          icon: 'success',
          toast: true,
          timer: 2000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false
        });

        window.location.href = '/user-dashboard';
        return;
      }

      if (res.data.msg === 'waiting_approval') {
        Swal.fire({
          title: 'Waiting for Approval',
          text: res.data.detail || 'Your account is not approved by admin yet. After admin approval, please login.',
          icon: 'info',
          toast: true,
          timer: 3000,
          position: 'top',
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
    <div className={`login-page ${whiteTheme ? 'day-mode' : ''}`}>
      <div className="login-wrapper">
        <img
          src="/animations/boy.png"
          className="walk-man"
          alt="walking"
        />

        <div className={`login-box ${formVisible ? 'show-box' : ''}`}>
          <h3 className="mb-4 text-primary">STUDENT LOGIN</h3>

          <input
            type="text"
            name="login_id"
            value={studentLoginData.login_id}
            onChange={handleChange}
            placeholder="Student ID or Email"
            className="form-control"
          />

          <input
            type="password"
            name="password"
            value={studentLoginData.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-control"
          />

          <button onClick={submitForm} className="btn signInBtn w-100 mt-2">
            Sign In
          </button>

          <Link to="/user-register" className="btn signUpBtn w-100 mt-2">
            Sign Up
          </Link>

          <p className="mt-3 mb-0 text-center text-muted small">
            Use your generated Student ID like <strong>STD00001</strong> or your email.
          </p>
        </div>
      </div>

      {sunVisible && <div className="sun-rays"></div>}

      {sunVisible && (
        <div className="sun-container">
          <img
            src="/animations/sun.gif"
            className="sun-img"
            alt="sun"
          />
        </div>
      )}
    </div>
  );
};

export default Login;
