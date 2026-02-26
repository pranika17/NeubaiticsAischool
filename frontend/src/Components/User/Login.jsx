// // import React from 'react'
// // import { useEffect } from 'react'
// // import { useState } from 'react'
// // import axios from 'axios'
// // import { Link } from 'react-router-dom'
// // import Swal from 'sweetalert2'

// // const baseUrl='http://127.0.0.1:8000/api'

// // const Login = () => {

// //     const studentLoginStatus=localStorage.getItem('studentLoginStatus');

// //     useEffect(() => {
// //       window.scrollTo(0, 0)
// //     }, [])
    
// //     const [studentLoginData,setStudentLoginData]=useState({
// //         email:'',
// //         password:''
// //       });

// //       const [errorMsg, setErrorMsg]=useState('')

// //       const handleChange=(event)=>{
// //         setStudentLoginData({
// //             ...studentLoginData,
// //             [event.target.name]:event.target.value
// //         });
// //     }

// //     const submitForm=()=>{
// //         const studentFormData=new FormData;
// //         studentFormData.append('email',studentLoginData.email)
// //         studentFormData.append('password',studentLoginData.password)
// //         try{
// //             axios.post(baseUrl+'/student-login', studentFormData)
// // .then((res)=> {
// //     if(res.data.bool === true){
// //         localStorage.setItem('studentLoginStatus', 'true');
// //         localStorage.setItem('studentId', res.data.student_id);
// //         window.location.href='/user-dashboard';
// //     } else {
// //         Swal.fire({
// //             title: res.data.msg || 'Invalid email or password!',
// //             icon:'error',
// //             toast:true,
// //             timer:2000,
// //             position:'top',
// //             timerProgressBar: true,
// //             showConfirmButton: false
// //         });
// //     }
// // })

            
// //         }catch(error){
// //             console.log(error)
// //         }
// //     }

// //     if(studentLoginStatus=='true'){
// //         window.location.href='/user-dashboard';
// //     }

// //     useEffect(()=>{
// //         document.title='LMS | Login'
// //       })

// //   return (
// //   <>
// //     <div class="container">
// //     <div class="row">
// //       <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
// //         <div class="card border-0 shadow rounded-3 my-5">
// //           <div class="card-body p-4 p-sm-5">
// //           <div class="text-center wow fadeInUp">
// //           <h5 class="card-title text-center mb-3 fw-light fs-5 text-dark">STUDENT SIGN IN</h5>
// //           </div>            
// //             {errorMsg && <p className='text-danger'>{errorMsg}</p>}
// //               <div class="form-floating mb-3">
// //                 <input type="email" value={studentLoginData.email} onChange={handleChange} name='email' class="form-control" id="floatingInput" placeholder="name@example.com"/>
// //                 <label for="floatingInput">Email address</label>
// //               </div>
// //               <div class="form-floating mb-3">
// //                 <input value={studentLoginData.password} name='password' type="password" onChange={handleChange} class="form-control" id="floatingPassword" placeholder="Password"/>
// //                 <label for="floatingPassword">Password</label>
// //               </div>
// //               <div class="d-grid my-4">
// //                 <button onClick={submitForm} class="btn btn-success rounded-pill btn-login text-uppercase fw-bold" type="submit" >Sign in</button>
// //                 <hr className=''/>
// //                 <Link to='/user-register' class="btn btn-danger rounded-pill btn-login text-uppercase fw-bold" type="submit" >SIGN UP</Link>
// //               </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     </div>
// //   </>
// //   )
// // }

// // export default Login



// // import React from 'react'
// // import { useEffect } from 'react'
// // import { useState } from 'react'
// // import axios from 'axios'
// // import { Link } from 'react-router-dom'
// // import Swal from 'sweetalert2'

// // const baseUrl='http://127.0.0.1:8000/api'

// // const Login = () => {

// //     const studentLoginStatus=localStorage.getItem('studentLoginStatus');

// //     useEffect(() => {
// //       window.scrollTo(0, 0)
// //     }, [])
    
// //     const [studentLoginData,setStudentLoginData]=useState({
// //         email:'',
// //         password:''
// //       });

// //       const [errorMsg, setErrorMsg]=useState('')

// //       const handleChange=(event)=>{
// //         setStudentLoginData({
// //             ...studentLoginData,
// //             [event.target.name]:event.target.value
// //         });
// //     }

// //     const submitForm=()=>{
// //         const studentFormData=new FormData;
// //         studentFormData.append('email',studentLoginData.email)
// //         studentFormData.append('password',studentLoginData.password)
// //         try{
// //             axios.post(baseUrl+'/student-login', studentFormData)
// // .then((res)=> {
// //     if(res.data.bool === true){
// //         localStorage.setItem('studentLoginStatus', 'true');
// //         localStorage.setItem('studentId', res.data.student_id);
// //         window.location.href='/user-dashboard';
// //     } else {
// //         Swal.fire({
// //             title: res.data.msg || 'Invalid email or password!',
// //             icon:'error',
// //             toast:true,
// //             timer:2000,
// //             position:'top',
// //             timerProgressBar: true,
// //             showConfirmButton: false
// //         });
// //     }
// // })

            
// //         }catch(error){
// //             console.log(error)
// //         }
// //     }

// //     if(studentLoginStatus=='true'){
// //         window.location.href='/user-dashboard';
// //     }

// //     useEffect(()=>{
// //         document.title='LMS | Login'
// //       })

// //   return (
// //   <>
// //     <div class="container">
// //     <div class="row">
// //       <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
// //         <div class="card border-0 shadow rounded-3 my-5">
// //           <div class="card-body p-4 p-sm-5">
// //           <div class="text-center wow fadeInUp">
// //           <h5 class="card-title text-center mb-3 fw-light fs-5 text-dark">STUDENT SIGN IN</h5>
// //           </div>            
// //             {errorMsg && <p className='text-danger'>{errorMsg}</p>}
// //               <div class="form-floating mb-3">
// //                 <input type="email" value={studentLoginData.email} onChange={handleChange} name='email' class="form-control" id="floatingInput" placeholder="name@example.com"/>
// //                 <label for="floatingInput">Email address</label>
// //               </div>
// //               <div class="form-floating mb-3">
// //                 <input value={studentLoginData.password} name='password' type="password" onChange={handleChange} class="form-control" id="floatingPassword" placeholder="Password"/>
// //                 <label for="floatingPassword">Password</label>
// //               </div>
// //               <div class="d-grid my-4">
// //                 <button onClick={submitForm} class="btn btn-success rounded-pill btn-login text-uppercase fw-bold" type="submit" >Sign in</button>
// //                 <hr className=''/>
// //                 <Link to='/user-register' class="btn btn-danger rounded-pill btn-login text-uppercase fw-bold" type="submit" >SIGN UP</Link>
// //               </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     </div>
// //   </>
// //   )
// // }

// // export default Login

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const baseUrl = 'http://127.0.0.1:8000/api';

// const Login = () => {
//   const studentLoginStatus = localStorage.getItem('studentLoginStatus');

//   const [studentLoginData, setStudentLoginData] = useState({
//     email: '',
//     password: ''
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     document.title = "LMS | Student Login";
//     if (studentLoginStatus === "true") {
//       window.location.href = "/user-dashboard";
//     }
//   }, [studentLoginStatus]);

//   const handleChange = (e) => {
//     setStudentLoginData({ ...studentLoginData, [e.target.name]: e.target.value });
//   };

//   const submitForm = async () => {
//     if (!studentLoginData.email || !studentLoginData.password) {
//       Swal.fire({
//         title: 'Please fill in all fields!',
//         icon: 'warning',
//         toast: true,
//         timer: 2000,
//         position: 'top',
//         timerProgressBar: true,
//         showConfirmButton: false
//       });
//       return;
//     }

//     try {
//       const res = await axios.post(baseUrl + "/student-login", {
//         email: studentLoginData.email,
//         password: studentLoginData.password
//       }, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // SUCCESS LOGIN
//       if (res.data.bool === true) {
//         localStorage.setItem("studentLoginStatus", "true");
//         localStorage.setItem("studentId", res.data.student_id);

//         Swal.fire({
//           title: "Login Successful!",
//           icon: "success",
//           toast: true,
//           timer: 2000,
//           position: "top",
//           timerProgressBar: true,
//           showConfirmButton: false
//         });

//         window.location.href = "/user-dashboard";
//         return;
//       }

//       // WAITING FOR APPROVAL
//       if (res.data.msg === "waiting_approval") {
//         Swal.fire({
//           title: "Waiting for Approval",
//           text: "Your account has been created but is not approved by admin yet.",
//           icon: "info",
//           toast: true,
//           timer: 3000,
//           position: "top",
//           timerProgressBar: true,
//           showConfirmButton: false
//         });
//         return;
//       }

//       // INVALID CREDENTIALS
//       Swal.fire({
//         title: res.data.msg || "Invalid credentials!",
//         icon: "error",
//         toast: true,
//         timer: 2000,
//         position: "top",
//         timerProgressBar: true,
//         showConfirmButton: false
//       });

//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Something went wrong!",
//         icon: "error",
//         toast: true,
//         timer: 2000,
//         position: "top",
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
//             <div className="card-body p-4 p-sm-5 text-center">
//               <h5 className="card-title mb-3 fw-light fs-5 text-dark">STUDENT SIGN IN</h5>

//               <div className="form-floating mb-3">
//                 <input
//                   type="email"
//                   value={studentLoginData.email}
//                   onChange={handleChange}
//                   name="email"
//                   className="form-control"
//                   placeholder="Email"
//                 />
//                 <label>Email Address</label>
//               </div>

//               <div className="form-floating mb-3">
//                 <input
//                   type="password"
//                   value={studentLoginData.password}
//                   onChange={handleChange}
//                   name="password"
//                   className="form-control"
//                   placeholder="Password"
//                 />
//                 <label>Password</label>
//               </div>

//               <div className="d-grid my-4">
//                 <button onClick={submitForm} className="btn btn-success rounded-pill btn-login text-uppercase fw-bold">
//                   Sign In
//                 </button>

//                 <hr />
//                 <Link to="/user-register" className="btn btn-danger rounded-pill btn-login text-uppercase fw-bold">
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

// export default Login;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';

const baseUrl = 'http://127.0.0.1:8000/api';

const Login = () => {
  const studentLoginStatus = localStorage.getItem('studentLoginStatus');

  const [studentLoginData, setStudentLoginData] = useState({
    email: '',
    password: ''
  });

  const [sunVisible, setSunVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  // const sunTimer = setTimeout(() => setSunVisible(true), 4200);

  const [whiteTheme, setWhiteTheme] = useState(false); // triggers dark → white

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "LMS | Student Login";

    if (studentLoginStatus === "true") {
      window.location.href = "/user-dashboard";
    }

    // Sun appears after 2s
    const sunTimer = setTimeout(() => setSunVisible(true), 2200);
    // Background changes to white after 3s
    const themeTimer = setTimeout(() => setWhiteTheme(true), 3000);
    // Form appears after 4s
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
    if (!studentLoginData.email || !studentLoginData.password) {
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
      const res = await axios.post(baseUrl + "/student-login", {
        email: studentLoginData.email,
        password: studentLoginData.password
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // SUCCESS LOGIN
      if (res.data.bool === true) {
        localStorage.setItem("studentLoginStatus", "true");
        localStorage.setItem("studentId", res.data.student_id);

        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top",
          timerProgressBar: true,
          showConfirmButton: false
        });

        window.location.href = "/user-dashboard";
        return;
      }

      // WAITING FOR APPROVAL
      if (res.data.msg === "waiting_approval") {
        Swal.fire({
          title: "Waiting for Approval",
          text: "Your account has been created but is not approved by admin yet.",
          icon: "info",
          toast: true,
          timer: 3000,
          position: "top",
          timerProgressBar: true,
          showConfirmButton: false
        });
        return;
      }

      // INVALID CREDENTIALS
      Swal.fire({
        title: res.data.msg || "Invalid credentials!",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className={`login-page ${whiteTheme ? "day-mode" : ""}`}>
      <div className="login-wrapper">

        {/* Walking Man */}
        <img 
          src="/animations/boy.png"
          className="walk-man"
          alt="walking"
        />

        {/* Login Box */}
        <div className={`login-box ${formVisible ? "show-box" : ""}`}>
          <h3 className="mb-4 text-primary">STUDENT LOGIN</h3>

          <input
            type="email"
            name="email"
            value={studentLoginData.email}
            onChange={handleChange}
            placeholder="Email"
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
        </div>
      </div>

      {/* Sun */}
     {/* Sun + Light Effect */}
{/* FULL PAGE RAYS (BACKGROUND ONLY) */}
{sunVisible && <div className="sun-rays"></div>}

{/* SUN */}
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
