import TeacherSidebar from './TeacherSidebar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'
import './AddAssignment.css'   // ✅ new css

const baseUrl='http://127.0.0.1:8000/api'

const AddAssignment = () => {

  useEffect(()=>{
    document.title='LMS | Add Assignment'
  },[])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [assignmentData,setAssignmentData]=useState({
    title:'',
    detail:''
  });

  const handleChange=(event)=>{
    setAssignmentData({
      ...assignmentData,
      [event.target.name]:event.target.value
    });
  }

  const { teacher_id, student_id } = useParams();
  useEffect(() => {
  console.log("✅ FULL PATH =", window.location.pathname);
  console.log("✅ PARAMS =", teacher_id, student_id);
}, [teacher_id, student_id]);



  const formSubmit = async () => {
  if (!assignmentData.title || !assignmentData.detail) {
    Swal.fire({
      title: "Please fill all fields",
      icon: "warning",
      toast: true,
      timer: 2000,
      position: "top-right",
      showConfirmButton: false,
    });
    return;
  }

  const _formData = new FormData();
  _formData.append("title", assignmentData.title);
  _formData.append("detail", assignmentData.detail);

  try {
    const res = await axios.post(
  `${baseUrl}/student-assignment/${teacher_id}/${student_id}/`,
  {
    title: assignmentData.title,
    detail: assignmentData.detail
  }
);

    if (res.status === 200 || res.status === 201) {
      Swal.fire({
        title: "Assignment added successfully!",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
      });

      setAssignmentData({ title: "", detail: "" });
    }
    } catch (error) {
      console.error('Error adding assignment:', error);
      Swal.fire({
        title: 'Error adding assignment',
        text: 'Please try again later.',
        icon: 'error',
        toast: true,
        timer: 3000,
        position: 'top-right',
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className='container mt-4 teacher-page'>
      <div className='row'>
        {/* <aside className='col-md-3'>
          <TeacherSidebar />
        </aside> */}

        <section className='col-md-9'>
          <div className="teacher-card">
            {/* ✅ Glass UI */}
            <div className="glass-card">
              <h3 className="glass-card-title">
                <i className="bi bi-journal-plus me-2"></i> Add Assignment
              </h3>
              <p className="glass-subtitle">
                Give assignment to student and track progress
              </p>

              <div className="glass-card-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={assignmentData.title}
                    onChange={handleChange}
                    name='title'
                    className="form-control glass-input"
                    placeholder="Eg: Python Task 1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={assignmentData.detail}
                    onChange={handleChange}
                    name='detail'
                    className='form-control glass-input'
                    rows="5"
                    placeholder="Write assignment details here..."
                  />
                </div>

                <button
                  type="button"
                  onClick={formSubmit}
                  className="btn glass-btn"
                >
                  <i className="bi bi-cloud-upload me-2"></i> Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default AddAssignment