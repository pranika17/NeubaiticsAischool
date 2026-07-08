import { baseUrl } from '../../config';
// import Sidebar from './Sidebar'
// import React from 'react'
// import { useEffect } from 'react'
// import axios from 'axios'
// import { useState } from 'react'
// import Swal from 'sweetalert2'

// const baseUrl=baseUrl

// const ProfileSetting = () => {
//     useEffect(()=>{
//         document.title='LMS | Settings'
//       })

//     const studentId=localStorage.getItem('studentId');

//     const [studentData,setStudentData]=useState({
//         'fullname':'',
//         'email':'',
//         'username':'',
//         'interseted_categories':'',
//         'profile_img':'',
//         'p_img':''
//     });

//     useEffect(()=>{
//         try{
//             axios.get(baseUrl+'/student/'+studentId)
//             .then((res)=>{
//                 setStudentData({
//                 fullname:res.data.fullname,
//                 email:res.data.email,
//                 username:res.data.username,
//                 interseted_categories:res.data.interseted_categories,
//                 profile_img:res.data.profile_img,
//                 p_img:''
//               });
//             });
//         }catch(error){
//             console.log(error);
//         }
//       },[]);

//     const handleChange=(event)=>{
//         setStudentData({
//             ...studentData,
//             [event.target.name]:event.target.value
//         });
//     }

//     const handleFileChange=(event)=>{
//         setStudentData({
//             ...studentData,
//             [event.target.name]:event.target.files[0]
//         })
//       }

//     const submitForm=()=>{
//         const studentFormData=new FormData();
//         studentFormData.append("fullname",studentData.fullname)
//         studentFormData.append("email",studentData.email)
//         studentFormData.append("username",studentData.username)
//         studentFormData.append("interseted_categories",studentData.interseted_categories)
//         if(studentData.p_img!==''){
//             studentFormData.append('profile_img',studentData.p_img,studentData.p_img.name);
//         }

//         try{
//                 axios.put(baseUrl+'/student/'+studentId+'/',studentFormData,{
//                     headers: {
//                         'content-type':'multipart/form-data'
//                     }
//                 }).then((response)=>{
//                     if(response.status==200){
//                         Swal.fire({
//                             title:'Profile Updated Successfully',
//                             icon:'success',
//                             toast:true,
//                             timer:3000,
//                             position:'top-right',
//                             timerProgressBar: true,
//                             showConfirmButton: false
//                         });
//                     }
//                     })
//         }catch(error){
//             console.log(error);
//             setStudentData({'status':'error'})
//         }
//     }

//     const studentLoginStatus=localStorage.getItem('studentLoginStatus')
//     if(studentLoginStatus!='true'){
//         window.location.href='/user-login';
//     }

//   return (
//     <div className='container mt-4'>
//         <div className='row'>
//             <aside className='col-md-3'>
//                 <Sidebar />
//             </aside>
//             <section className='col-md-9'>
//                 <div className='card'>
//                     <h5 className='card-header'>
//                     <i class="bi bi-person-lines-fill"/> Profile Settings
//                     </h5>
//                     <div className='card-body'>
//                     <div className="mb-3 row">
//                         <label for="staticEmail" className="col-sm-2 col-form-label">Full Name</label>
//                         <div className="col-sm-10">
//                         <input  name='fullname' type="text"  value={studentData.fullname} onChange={handleChange} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="mb-3 row">
//                         <label for="staticEmail" className="col-sm-2 col-form-label">Email</label>
//                         <div className="col-sm-10">
//                         <input name='email' type="text" value={studentData.email} onChange={handleChange} className="form-control"/>
//                         </div>
//                     </div>
//                     <div className="mb-3 row">
//                         <label for="exampleInputPassword1" className="col-sm-2 col-form-label">Profile Image</label>
//                         <div className="col-sm-10">
//                         <input defaultValue={studentData.featured_img} type="file" onChange={handleFileChange} name='p_img' className="form-control"/>
//                         {studentData.profile_img && 
//                             <p className='mt-2'><img src={studentData.profile_img}  width={300} alt={studentData.fullname} /></p>
//                         }
//                         </div>
//                     </div>
//                     <div className="mb-3 row">
//                         <label for="staticEmail" className="col-sm-2 col-form-label">Username</label>
//                         <div className="col-sm-10">
//                         <input name='username' type="text" value={studentData.username} onChange={handleChange} className="form-control"/>
//                         </div>
//                     </div>
//                     <div className="mb-3 row">
//                         <label for="staticEmail" className="col-sm-2 col-form-label">Interseted Categories</label>
//                         <div className="col-sm-10">
//                         <textarea name='interseted_categories' type="text"  value={studentData.interseted_categories} onChange={handleChange} className="form-control" id="staticEmail" />
//                         </div>
//                     </div>
//                     <hr/>
//                         <button onClick={submitForm} className='btn btn-primary'>Update</button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     </div>
//   )
// }

// export default ProfileSetting




import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import './ProfileSetting.css'
const ProfileSetting = () => {
    useEffect(() => {
        document.title = 'LMS | Settings'
    }, [])

    const studentId = localStorage.getItem('studentId')

    const [studentData, setStudentData] = useState({
        fullname: '',
        email: '',
        username: '',
        interseted_categories: '',
        profile_img: '', // URL from backend
        p_img: null // File object for upload
    })
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: '',
    })

    // Fetch student data
    useEffect(() => {
        axios.get(`${baseUrl}/student/${studentId}/`)
            .then((res) => {
                setStudentData({
                    fullname: res.data.fullname,
                    email: res.data.email,
                    username: res.data.username,
                    interseted_categories: res.data.interseted_categories || '',
                    profile_img: res.data.profile_img || '', // Ensure URL
                    p_img: null
                })
            })
            .catch((error) => console.log(error))
    }, [studentId])

    // Handle input change
    const handleChange = (event) => {
        setStudentData({
            ...studentData,
            [event.target.name]: event.target.value
        })
    }

    // Handle file selection
    const handleFileChange = (event) => {
        setStudentData({
            ...studentData,
            [event.target.name]: event.target.files[0]
        })
    }

    const handlePasswordChange = (event) => {
        setPasswordData({
            ...passwordData,
            [event.target.name]: event.target.value
        })
    }

    // Submit form
    const submitForm = () => {
        const studentFormData = new FormData()
        studentFormData.append('fullname', studentData.fullname)
        studentFormData.append('email', studentData.email)
        studentFormData.append('username', studentData.username)
        studentFormData.append('interseted_categories', studentData.interseted_categories)

        if (studentData.p_img) {
            studentFormData.append('image', studentData.p_img, studentData.p_img.name)
        }


        axios.patch(`${baseUrl}/student/${studentId}/`, studentFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            Swal.fire({
                title: 'Profile Updated Successfully',
                icon: 'success',
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })

            setStudentData(prev => ({
                ...prev,
                fullname: response.data.fullname || prev.fullname,
                email: response.data.email || prev.email,
                username: response.data.username || prev.username,
                interseted_categories: response.data.interseted_categories || '',
                profile_img: response.data.profile_img || prev.profile_img,
                p_img: null
            }))
            localStorage.setItem('studentName', response.data.fullname || studentData.fullname || '')
        }).catch((error) => {
            console.log(error)
            Swal.fire({
                title: 'Error updating profile',
                icon: 'error',
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })
        })
    }

    const submitPasswordForm = () => {
        if (!passwordData.password.trim()) {
            Swal.fire({
                title: 'Please enter a new password',
                icon: 'warning',
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })
            return
        }

        if (passwordData.password !== passwordData.confirmPassword) {
            Swal.fire({
                title: 'Passwords do not match',
                icon: 'warning',
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })
            return
        }

        const studentFormData = new FormData()
        studentFormData.append('password', passwordData.password)

        axios.post(`${baseUrl}/student/change-password/${studentId}/`, studentFormData)
            .then((response) => {
                if (response.data?.bool === false) {
                    throw new Error(response.data?.msg || 'Password update failed')
                }

                setPasswordData({
                    password: '',
                    confirmPassword: '',
                })

                Swal.fire({
                    title: 'Password Updated Successfully',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false
                })
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    title: 'Error updating password',
                    icon: 'error',
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false
                })
            })
    }

    // Check login
    const studentLoginStatus = localStorage.getItem('studentLoginStatus')
    if (studentLoginStatus !== 'true') {
        window.location.href = '/user-login'
    }

    return (
        <div className='container mt-4 student-profile-settings-page'>
            <div className='row'>
                <section className='col-12'>
                    <div className='card student-settings-card'>
                        <h3 className='student-settings-heading'>
                            <i className="bi bi-person-lines-fill" /> Profile Settings
                        </h3>
                        <div className='card-body'>

                            {/* Full Name */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Full Name</label>
                                <div className="col-sm-10">
                                    <input name='fullname' type="text" value={studentData.fullname} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Email</label>
                                <div className="col-sm-10">
                                    <input name='email' type="email" value={studentData.email} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Profile Image */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Profile Image</label>
                                <div className="col-sm-10">
                                    <input type="file" onChange={handleFileChange} name='p_img' className="form-control" />
                                    {/* Preview selected file */}
                                    {studentData.p_img && 
                                        <p className='mt-2'>
                                            <img src={URL.createObjectURL(studentData.p_img)} width={300} alt={studentData.fullname} />
                                        </p>
                                    }
                                    {/* Show existing image */}
                                    {!studentData.p_img && studentData.profile_img &&
                                        <p className='mt-2'>
                                            <img src={studentData.profile_img} width={300} alt={studentData.fullname} />
                                        </p>
                                    }
                                </div>
                            </div>

                            {/* Username */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Username</label>
                                <div className="col-sm-10">
                                    <input name='username' type="text" value={studentData.username} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Interested Categories */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Interested Categories</label>
                                <div className="col-sm-10">
                                    <textarea name='interseted_categories' value={studentData.interseted_categories} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            <div className="student-settings-actions">
                                <button onClick={submitForm} className='btn btn-primary student-settings-btn'>
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='card student-settings-card student-password-card'>
                        <h3 className='student-settings-heading'>
                            <i className="bi bi-shield-lock"></i> Password Settings
                        </h3>
                        <div className='card-body'>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">New Password</label>
                                <div className="col-sm-10">
                                    <input
                                        type="password"
                                        name='password'
                                        value={passwordData.password}
                                        onChange={handlePasswordChange}
                                        className="form-control"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Confirm Password</label>
                                <div className="col-sm-10">
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="form-control"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="student-settings-actions">
                                <button onClick={submitPasswordForm} className='btn btn-primary student-settings-btn'>
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ProfileSetting

