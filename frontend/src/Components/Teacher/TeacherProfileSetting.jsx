import TeacherSidebar from './TeacherSidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import './TeacherProfileSetting.css'

const baseUrl = 'http://127.0.0.1:8000/api'

const TeacherProfileSetting = () => {
    useEffect(() => {
        document.title = 'LMS | Settings'
    }, [])

    const teacherId = localStorage.getItem('teacherId')

    const [teacherData, setTeacherData] = useState({
        full_name: '',
        email: '',
        qualification: '',
        mobile_no: '',
        skills: '',
        profile_img: '', // URL from backend
        p_img: null, // File object for upload
        face_url: '',
        insta_url: '',
        twit_url: '',
        web_url: '',
        you_url: '',
    })

    // Fetch teacher data
    useEffect(() => {
        axios.get(`${baseUrl}/teacher/${teacherId}/`)
            .then((res) => {
                setTeacherData({
                    full_name: res.data.full_name,
                    email: res.data.email,
                    qualification: res.data.qualification,
                    mobile_no: res.data.mobile_no,
                    skills: res.data.skills,
                    profile_img: res.data.image_url || '',
                    p_img: null,
                    face_url: res.data.face_url || '',
                    insta_url: res.data.insta_url || '',
                    twit_url: res.data.twit_url || '',
                    web_url: res.data.web_url || '',
                    you_url: res.data.you_url || '',
                })
            })
            .catch((error) => console.log(error))
    }, [teacherId])

    // Handle text input change
    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        })
    }

    // Handle file input change
    const handleFileChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.files[0]
        })
    }

    // Submit form
    const submitForm = () => {
        const teacherFormData = new FormData()
        teacherFormData.append('full_name', teacherData.full_name)
        teacherFormData.append('email', teacherData.email)
        teacherFormData.append('qualification', teacherData.qualification)
        teacherFormData.append('mobile_no', teacherData.mobile_no)
        teacherFormData.append('skills', teacherData.skills)
        

        if (teacherData.p_img) {
            teacherFormData.append('image', teacherData.p_img, teacherData.p_img.name)
        }

        axios.patch(`${baseUrl}/teacher/${teacherId}/`, teacherFormData, {
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

            // Update displayed profile_img with new image URL if returned
            if (response.data.image_url) {
                setTeacherData(prev => ({
                    ...prev,
                    profile_img: response.data.image_url,
                    p_img: null
                }))
            }

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

    // Check login status
    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus')
    if (teacherLoginStatus !== 'true') {
        window.location.href = '/teacher-login'
    }

    return (
        <div className='container mt-4 '>
            <div className='row'>
                {/* <aside className='col-md-3'>
                    <TeacherSidebar />
                </aside> */}
                <section className='col-md-9'>
                    <div className='card'>
                        <h5 className='card-header'>
                            <i className="bi bi-person-lines-fill"></i> Profile Settings
                        </h5>
                        <div className='card-body'>

                            {/* Full Name */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Full Name</label>
                                <div className="col-sm-10">
                                    <input name='full_name' type="text" value={teacherData.full_name} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Email</label>
                                <div className="col-sm-10">
                                    <input name='email' type="email" value={teacherData.email} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Profile Image */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Profile Image</label>
                                <div className="col-sm-10">
                                    <input type="file" onChange={handleFileChange} name='p_img' className="form-control" />
                                    {teacherData.p_img && 
                                        <p className='mt-2'>
                                            <img src={URL.createObjectURL(teacherData.p_img)} width={300} alt={teacherData.full_name} />
                                        </p>
                                    }
                                    {!teacherData.p_img && teacherData.profile_img &&
                                        <p className='mt-2'>
                                            <img src={teacherData.profile_img} width={300} alt={teacherData.full_name} />
                                        </p>
                                    }
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Mobile no</label>
                                <div className="col-sm-10">
                                    <input name='mobile_no' type="text" value={teacherData.mobile_no} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Skills</label>
                                <div className="col-sm-10">
                                    <textarea name='skills' value={teacherData.skills} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            {/* Qualification */}
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Qualification</label>
                                <div className="col-sm-10">
                                    <textarea name='qualification' value={teacherData.qualification} onChange={handleChange} className="form-control" />
                                </div>
                            </div>

                            <hr />
                           


                            <button onClick={submitForm} className='btn btn-primary'>Update</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default TeacherProfileSetting

