
// // export default TeacherLogin;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const baseUrl = 'http://127.0.0.1:8000/api';

// const TeacherLogin = () => {
//   const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');

//   const [teacherLoginData, setTeacherLoginData] = useState({
//     email: '',
//     password: ''
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     document.title = 'LMS | Teacher Login';

//     if (teacherLoginStatus === 'true') {
//       window.location.href = '/teacher-dashboard';
//     }
//   }, [teacherLoginStatus]);

//   const handleChange = (event) => {
//     setTeacherLoginData({
//       ...teacherLoginData,
//       [event.target.name]: event.target.value
//     });
//   };

//   const submitForm = async () => {
//     if (!teacherLoginData.email || !teacherLoginData.password) {
//       Swal.fire({
//         title: 'Please fill in all fields!',
//         icon: 'warning',
//         toast: true,
//         position: 'top',
//         timer: 2000,
//         timerProgressBar: true,
//         showConfirmButton: false
//       });
//       return;
//     }

//     try {
//       const res = await axios.post(
//         baseUrl + '/teacher-login',
//         {
//           email: teacherLoginData.email,
//           password: teacherLoginData.password,
//         },
//         {
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );

//       // SUCCESS LOGIN
//       if (res.data.bool === true) {
//         localStorage.setItem('teacherLoginStatus', "true");
//         localStorage.setItem('teacherId', res.data.teacher_id);

//         Swal.fire({
//           title: 'Login Successful!',
//           icon: 'success',
//           toast: true,
//           timer: 1800,
//           position: 'top',
//           timerProgressBar: true,
//           showConfirmButton: false
//         });

//         window.location.href = '/teacher-dashboard';
//         return;
//       }

//       // WAITING FOR APPROVAL
//       if (res.data.msg === "waiting_approval") {
//         Swal.fire({
//           title: 'Waiting for Approval',
//           text: 'Your account is not approved by admin yet.',
//           icon: 'info',
//           toast: true,
//           position: 'top',
//           timer: 2500,
//           timerProgressBar: true,
//           showConfirmButton: false
//         });
//         return;
//       }

//       // INVALID LOGIN
//       Swal.fire({
//         title: 'Invalid email or password!',
//         icon: 'error',
//         toast: true,
//         timer: 2000,
//         position: 'top',
//         timerProgressBar: true,
//         showConfirmButton: false
//       });

//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: 'Something went wrong!',
//         icon: 'error',
//         toast: true,
//         timer: 2000,
//         position: 'top',
//         timerProgressBar: true,
//         showConfirmButton: false
//       });
//     }
//   };

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
//           <div className="card border-0 shadow rounded-3 my-5">
//             <div className="card-body p-4 p-sm-5">
//               <div className="text-center">
//                 <h5 className="card-title text-center mb-3 fw-light fs-5 text-dark">
//                   TEACHER SIGN IN
//                 </h5>
//               </div>

//               <div className="form-floating mb-3">
//                 <input
//                   type="email"
//                   value={teacherLoginData.email}
//                   onChange={handleChange}
//                   name="email"
//                   className="form-control"
//                   placeholder="Email"
//                 />
//                 <label>Email address</label>
//               </div>

//               <div className="form-floating mb-3">
//                 <input
//                   type="password"
//                   value={teacherLoginData.password}
//                   onChange={handleChange}
//                   name="password"
//                   className="form-control"
//                   placeholder="Password"
//                 />
//                 <label>Password</label>
//               </div>

//               <div className="d-grid my-4">
//                 <button
//                   onClick={submitForm}
//                   className="btn btn-success rounded-pill btn-login text-uppercase fw-bold"
//                 >
//                   Sign in
//                 </button>

//                 <hr />
//                 <Link
//                   to="/teacher-register"
//                   className="btn btn-danger rounded-pill btn-login text-uppercase fw-bold"
//                 >
//                   SIGN UP
//                 </Link>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherLogin;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api';

const TeacherLogin = () => {
  const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');

  const [teacherLoginData, setTeacherLoginData] = useState({
    email: '',
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
    if (!teacherLoginData.email || !teacherLoginData.password) {
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
        baseUrl + '/teacher-login',
        {
          email: teacherLoginData.email,
          password: teacherLoginData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // SUCCESS LOGIN
      if (res.data.bool === true) {
        localStorage.setItem('teacherLoginStatus', "true");
        localStorage.setItem('teacherId', res.data.teacher_id);

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

      // WAITING FOR APPROVAL
      if (res.data.msg === "waiting_approval") {
        Swal.fire({
          title: 'Waiting for Approval',
          text: 'Your account is not approved by admin yet.',
          icon: 'info',
          toast: true,
          position: 'top',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        return;
      }

      // INVALID LOGIN
      Swal.fire({
        title: 'Invalid email or password!',
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
          type="email"
          name="email"
          value={teacherLoginData.email}
          onChange={handleChange}
          className="form-control custom-input"
          placeholder="Email"
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

    </div>
  </div>
);

};

export default TeacherLogin;
