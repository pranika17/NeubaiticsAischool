import React from 'react'
import TeacherSidebar from './TeacherSidebar'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import './addcourse.css'

const baseUrl='http://127.0.0.1:8000/api';

const AddCourses = () => {
    useEffect(()=>{
        document.title='LMS | Add Course'
      })

      const [cats,setCats]=useState([])
      
     const [courseData,setCourseData]=useState({
    category: '',  // Make sure this is empty string
    title:'',
    description:'',
    f_img:'',
    techs:''
});




      useEffect(()=>{
        try{
            axios.get(baseUrl+'/category/')
            .then((res)=>{
                    setCats(res.data)
            });
        }catch(error){
            console.log(error)
        }
      },[]);

      const handleChange=(event)=>{
        setCourseData({
            ...courseData,
            [event.target.name]:event.target.value
        });
      }

      const handleFileChange=(event)=>{
        setCourseData({
            ...courseData,
            [event.target.name]:event.target.files[0]
        })
      }
const formSubmit = () => {
  const teacherId = localStorage.getItem('teacherId');

  if (!courseData.category) {
    alert("Please select a category");
    return;
  }

  if (!teacherId) {
    alert("No teacher ID found. Please log in.");
    return;
  }

  const _formData = new FormData();
  _formData.append('category', courseData.category);
  _formData.append('teacher_id', teacherId); // ✅ fixed here
  _formData.append('title', courseData.title);
  _formData.append('description', courseData.description);
  _formData.append('featured_img', courseData.f_img);
  _formData.append('techs', courseData.techs);

  axios.post(baseUrl + '/course/', _formData, {
    headers: { 'content-type': 'multipart/form-data' }
  })
  .then((res) => {
    console.log("✅ Course added successfully:", res.data);
    window.location.href = '/add-course';
  })
  .catch((error) => {
    console.error("❌ Error adding course:", error.response?.data || error);
  });
};

        
  return (
    <div className='container mt-4 teacher-page'>
    <div className='row'>
        {/* <aside className='col-md-3'>
            <TeacherSidebar />
        </aside> */}
        <section className='col-md-9'>
          <div className="teacher-card">
  <div className="glass-card">
    <h3 className="glass-card-title"><i className="bi bi-plus-square"></i> Add Course</h3>

    <div className="glass-card-body">

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select 
  name='category' 
  onChange={handleChange} 
  className="form-control glass-select" 
  value={courseData.category}
>
  <option value="">-- Select Category --</option>
  {cats.map((category,index)=>(
    <option key={index} value={category.id}>{category.title}</option>
  ))}
</select>
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" onChange={handleChange} name='title' className="form-control"/>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea onChange={handleChange} name='description' className='form-control'></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Featured Image</label>
        <input type="file" onChange={handleFileChange} name='f_img' className="form-control"/>
      </div>

      <div className="mb-3">
        <label className="form-label">Technologies</label>
        <textarea onChange={handleChange} name='techs' className='form-control' placeholder='php,Java,C++...'></textarea>
      </div>

      <button type="submit" onClick={formSubmit} className="btn glass-btn">Submit</button>
    </div>
  </div>
</div>

        </section>
        
    </div>
  </div>
  )
}

export default  AddCourses