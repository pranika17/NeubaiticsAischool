// import React from 'react'
// import { useParams } from 'react-router-dom'
// import { Link } from 'react-router-dom';
// import { useEffect } from 'react'
// import { useState } from 'react'
// import Swal from 'sweetalert2'
// import axios from 'axios'
// import './main.css'
// import './style.css'
// import './bootstrap.min.css'

// const baseUrl='http://127.0.0.1:8000/api'
// const siteUrl='http://127.0.0.1:8000/'

// const CourseDetail = () => {

//     let {course_id}=useParams();

//     const [courseData, setCourseData]=useState([]);
//     const [chapterData, setChapterData]=useState([]);
//     const [teacherData, setTeacherData]=useState([]);
//     const [teachListData, setTeachListData]=useState([]);
//     const [relatedCourseData, setRelatedCourseData]=useState([]);
//     const [userLoginStatus,setUserLoginStatus]=useState([])
//     const [enrolledStatus,setEnrolledStatus]=useState([])
//     const [ratingStatus,setRatingStatus]=useState([])
//     const [favoriteStatus,setFavoriteStatus]=useState([])
//     const [courseViews,setCourseViews]=useState(0)
//     const [avgRating,setAvgRating]=useState(0)

//     // ✅ added (to stop multiple click duplicate favorite)
//     const [favLoading, setFavLoading] = useState(false);

//     const studentId=localStorage.getItem('studentId')

//     useEffect(() => {
//       window.scrollTo(0, 0)
//     }, [])
    
//     useEffect(()=>{

//       try{
//           axios.get(baseUrl+'/course/'+course_id)
//           .then((res)=>{
//             setChapterData(res.data.course_chapters)
//             setTeacherData(res.data.teacher)
//             setCourseData(res.data)

//             try {
//               setRelatedCourseData(JSON.parse(res.data.related_videos))
//             } catch {
//               setRelatedCourseData([])
//             }

//             setTeachListData(res.data.teach_list)

//             if(res.data.course_rating!='' && res.data.course_rating!=null){
//               setAvgRating(res.data.course_rating)
//             }
//           });

//           axios.get(baseUrl+'/update-view/'+course_id)
//           .then((res) => {
//             setCourseViews(res.data.views)
//           })
//       }catch(error){
//           console.log(error);
//       }

//       try{
//         axios.get(baseUrl+'/fetch-enroll-status/'+studentId+'/'+course_id)
//         .then((res)=>{
//           if(res.data.bool==true){
//             setEnrolledStatus('success')
//           }
//         });
//       }catch(error){
//           console.log(error);
//       }

//       try{
//         axios.get(baseUrl+'/fetch-rating-status/'+studentId+'/'+course_id)
//         .then((res)=>{
//           if(res.data.bool==true){
//             setRatingStatus('success')
//           }
//         });
//       }catch(error){
//           console.log(error);
//       }

//       // ✅ Favorite status check (SAFE)
//       if(studentId){
//         axios.get(baseUrl+'/fetch-favorite-status/'+studentId+'/'+course_id)
//         .then((res)=>{
//           if(res.data.bool==true){
//             setFavoriteStatus('success')
//           }else{
//             setFavoriteStatus('');
//           }
//         })
//         .catch((error)=>console.log(error))
//       }

//       const studentLoginStatus=localStorage.getItem('studentLoginStatus');
//       if(studentLoginStatus=='true'){
//         setUserLoginStatus('success')
//       }

//     },[]);

//    const enrollCourse = () => {
//      const _data = {
//       course_id: parseInt(course_id),
//       student_id: parseInt(studentId)
//     };

//     axios.post(baseUrl + '/student-enroll-course/', _data, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then((res) => {
//         if(res.status === 200 || res.status === 201){
//             Swal.fire({
//                 title: 'You Successfully Enrolled!',
//                 icon: 'success',
//                 toast: true,
//                 timer: 3000,
//                 position: 'top-right',
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             });
//             setEnrolledStatus('success');
//             setCourseData(prev => ({
//                 ...prev,
//                 total_enrolled_students: prev.total_enrolled_students + 1
//             }));
//         }
//     })
//     .catch((error) => {
//         console.log(error.response?.data);
//         if(error.response?.data?.non_field_errors){
//             Swal.fire({
//                 title: 'Enrollment Failed!',
//                 text: error.response.data.non_field_errors[0],
//                 icon: 'warning',
//                 toast: true,
//                 timer: 3000,
//                 position: 'top-right',
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             });
//             setEnrolledStatus('success');
//         } else {
//             Swal.fire({
//                 title: 'Enrollment Failed!',
//                 text: 'Something went wrong',
//                 icon: 'error',
//                 toast: true,
//                 timer: 3000,
//                 position: 'top-right',
//                 timerProgressBar: true,
//                 showConfirmButton: false
//             });
//         }
//     });

//   }

//     const [ratingData,setRatingData]=useState({
//       rating:'',
//       reviews:''
//     });

//     const handleChange=(event)=>{
//       setRatingData({
//           ...ratingData,
//           [event.target.name]:event.target.value
//       });
//     }

//     const formSubmit=()=>{
//       const _formData=new FormData();
//       _formData.append('course',course_id);
//       _formData.append('student',studentId);
//       _formData.append('rating',ratingData.rating);
//       _formData.append('reviews',ratingData.reviews);

//       try{
//           axios.post(baseUrl+'/course-rating/',_formData,)
//           .then((res)=>{
//               if(res.status==200 || res.status==201){
//                   Swal.fire({
//                       title:'Rated Successfully!',
//                       icon:'success',
//                       toast:true,
//                       timer:3000,
//                       position:'top-right',
//                       timerProgressBar: true,
//                       showConfirmButton: false
//                   });
//               }
//           });
//       }catch(error){
//           console.log(error);
//       }
//     };

//     // ✅ FIXED markAsFav (NO DUPLICATION)
//     const markAsFav=()=>{
//       if(!studentId) return;
//       if(favLoading) return;
//       if(favoriteStatus === 'success') return;

//       setFavLoading(true);

//       const _formData=new FormData();
//       _formData.append('course',course_id);
//       _formData.append('student',studentId);
//       _formData.append('status',true);

//       axios.post(baseUrl+'/student-add-favorte-course/',_formData,{
//           headers: { 'content-type':'multipart/form-data' }
//       })
//       .then((res)=>{
//         if(res.data.bool === true){
//           Swal.fire({
//               title:'This Course Successfully added to your Favorite list',
//               icon:'success',
//               toast:true,
//               timer:3000,
//               position:'top-right',
//               timerProgressBar: true,
//               showConfirmButton: false
//           });
//         } else {
//           Swal.fire({
//               title: res.data.msg || 'Already in your Favorite list ❤️',
//               icon:'info',
//               toast:true,
//               timer:2500,
//               position:'top-right',
//               timerProgressBar: true,
//               showConfirmButton: false
//           });
//         }
//         setFavoriteStatus('success');
//       })
//       .catch((error)=>console.log(error))
//       .finally(()=>setFavLoading(false));
//     };

//     // ✅ FIXED removeFav
//     const removeFav=()=>{
//       if(!studentId) return;
//       if(favLoading) return;

//       setFavLoading(true);

//       axios.get(baseUrl+'/student-remove-favorite-course/'+course_id+'/'+studentId)
//       .then((res)=>{
//           if(res.data.bool === true){
//               Swal.fire({
//                   title:'This Course Successfully removed from your Favorite list',
//                   icon:'success',
//                   toast:true,
//                   timer:3000,
//                   position:'top-right',
//                   timerProgressBar: true,
//                   showConfirmButton: false
//               });
//               setFavoriteStatus('');
//           }
//       })
//       .catch((error)=>console.log(error))
//       .finally(()=>setFavLoading(false));
//     };
    
//     useEffect(()=>{
//       document.title='LMS | Courses Details'
//     })

//   return (
//     <div className='conatiner mt-4 px-4 hod'>
//         <div className='row'>
//         <div className="col-lg-3 col-md-6 mt-3">
//                     <div className="team-item bg-light">
//                         <div className="overflow-hidden">
//                         <img src={courseData.featured_img} className="card-img-top img-fluid img-thumbnail" alt={courseData.title}/>            
//                         </div>
//                     </div>
//                 </div>
//             <div className='col-8 pd-2 mt-3'>
//                 <h3 className="course-main-title">{courseData.title}</h3>

//                 <p>{courseData.description}</p>
//                 <p className='fw-bold'>Course By : <Link to={`/teacher-detail/${teacherData.id}`}>{teacherData.full_name}</Link></p>
//                 <p className='fw-bold'>Techs :&nbsp;
//                   <a className='text-warning'>{courseData.techs}</a>
//                 </p>
//                 <p className='fw-bold'>Total Enrolled &nbsp;<i className="bi bi-person-plus-fill text-info"></i> :&nbsp;{courseData.total_enrolled_students}</p> 
//                 <p className='fw-bold'>
//                 Rating : {avgRating} / 5
//                 {enrolledStatus=='success' && userLoginStatus=='success' &&
//                 <>
//                 {ratingStatus != 'success' && 
//                   <button className='btn btn-success btn-sm ms-2' data-bs-toggle="modal" data-bs-target="#ratingModal">Rating</button>   
//                 }
//                 {ratingStatus == 'success' && 
//                   <span className='btn btn-success btn-sm ms-2 rounded-pill mt-2' >You already Rated this Course</span>   
//                 }
//                       <div className="modal fade" id="ratingModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                         <div className="modal-dialog modal-lg">
//                           <div className="modal-content">
//                             <div className="modal-header">
//                               <h5 className="modal-title" id="exampleModalLabel">Rate for {courseData.title}</h5>
//                               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                             </div>
//                             <div className="modal-body">
                            
//                                 <div className="mb-3">
//                                   <label className="form-label">Rating</label>
//                                   <select onChange={handleChange} className='form-control' name='rating'>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                     <option value="3">3</option>
//                                     <option value="4">4</option>
//                                     <option value="5">5</option>
//                                   </select>
//                                 </div>
//                                 <div className="mb-3">
//                                   <label className="form-label">Review</label>
//                                   <textarea onChange={handleChange} name="reviews" className="form-control" rows="6" />
//                                 </div>
//                                 <button onClick={formSubmit} type="submit" className="btn btn-primary">Submit</button>
                              
//                             </div>
//                           </div>
//                         </div>
//                         </div>
//                   </>
//                 }  
//                 </p>
//                 <p className='fw-bold'>
//                     Views: {courseViews}
//                 </p>
//                 {userLoginStatus == 'success' && enrolledStatus!=='success' &&
//                     <p><button type='button' className='btn btn-success rounded-pill ' onClick={enrollCourse} >Enroll in this Course</button></p>
//                 }
//                 {enrolledStatus=='success' && userLoginStatus=='success' &&
//                     <p><span className='btn btn-info rounded-pill btn-sm'>You are already Enrolled in this Course</span></p>
//                 }

//                 {/* ✅ Favorite buttons (same concept, only disabled added) */}
//                 {userLoginStatus == 'success' && favoriteStatus !== 'success' &&
//                     <p>
//                       <button
//                         type='button'
//                         disabled={favLoading}
//                         onClick={markAsFav}
//                         title="Add in your favorite Course list"
//                         className='btn btn-outline-danger btn-sm'
//                       >
//                         <i className='bi bi-heart'></i>
//                       </button>
//                     </p>
//                 }
//                 {userLoginStatus == 'success' && favoriteStatus == 'success' &&
//                     <p>
//                       <button
//                         type='button'
//                         disabled={favLoading}
//                         onClick={removeFav}
//                         title="Remove from favorite Course list"
//                         className='btn btn-outline-danger btn-sm'
//                       >
//                         <i className='bi bi-heart-fill'></i>
//                       </button>
//                     </p>
//                 }

//                 {userLoginStatus !== 'success' && 
//                     <p><Link to='/user-login' className='btn btn-danger rounded-pill'>Please login to enjoy this course</Link></p>
//                 }
//             </div>
//         </div>

//         {/* Course Videos*/}
//       {userLoginStatus == 'success' && enrolledStatus=='success' &&
//       <>
//         <div className="card mt-4">
//             <h5 className="card-header">
//                 Course Contains
//             </h5>
//             <ul className="list-group list-group-flush">
//             {chapterData.map((chapter,index) => (
//               <li className="list-group-item" key={chapter.id}>{chapter.title}
//               </li>
//             ))}
//             </ul>
//         </div>
//         <Link to={`/mini/${courseData.id}`} className='btn btn-sm bg-success mt-2 text-white'>Start Now</Link>
//       </>
//       }

//       {/* {userLoginStatus === 'success' && enrolledStatus === 'success' && (
//         <Link to={`/course/${course_id}/quiz`} className="btn btn-warning mt-3">
//           📝 Take Quiz
//         </Link>
//       )} */}

//       {/* Related Courses */}
//        <h3 className="related-heading pb-1 mb-4 mt-5">Related Courses</h3>

//       <div className='row mb-4'>
//       {relatedCourseData.map((rcourse,index) =>
//         <div className='col-md-3 mb-4' key={index}>
//           <div className="card">
//             <Link target='__blank' to={`/detail/${rcourse.pk}`}>
//               <img src={`${siteUrl}media/${rcourse.fields.featured_img}`} className="card-img-top fadeInUp" height={200} alt={rcourse.fields.title}/>
//             </Link>
//               <div className="card-body">
//                 <h5 className="card-title"><Link to={`/detail/${rcourse.pk}`}>{rcourse.fields.title}</Link></h5>
//               </div>
//           </div>
//         </div>
//       )}
//       </div>
//     </div>
//   )
// }

// export default CourseDetail
import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import './bootstrap.min.css'
import './main.css'
import './style.css'


const baseUrl='http://127.0.0.1:8000/api'
const siteUrl='http://127.0.0.1:8000/'

const CourseDetail = () => {

    let {course_id}=useParams();

    const [courseData, setCourseData]=useState([]);
    const [chapterData, setChapterData]=useState([]);
    const [teacherData, setTeacherData]=useState([]);
    const [teachListData, setTeachListData]=useState([]);
    const [relatedCourseData, setRelatedCourseData]=useState([]);
    const [userLoginStatus,setUserLoginStatus]=useState([])
    const [enrolledStatus,setEnrolledStatus]=useState([])
    const [ratingStatus,setRatingStatus]=useState([])
    const [favoriteStatus,setFavoriteStatus]=useState([])
    const [courseViews,setCourseViews]=useState(0)
    const [avgRating,setAvgRating]=useState(0)
    const [showPayment, setShowPayment] = useState(false);
    const [paymentFile, setPaymentFile] = useState(null);


    // ✅ added (to stop multiple click duplicate favorite)
    const [favLoading, setFavLoading] = useState(false);

    const studentId = localStorage.getItem('studentId')

    const fetchEnrollStatus = () => {
  if (!studentId) return;

  axios
    .get(`${baseUrl}/fetch-enroll-status/${studentId}/${course_id}`)
    .then((res) => {
      setEnrolledStatus(res.data.status);
    })
    .catch((err) => console.log(err));
};






useEffect(() => {
  window.scrollTo(0, 0);

  // Load course details
  axios.get(`${baseUrl}/course/${course_id}`)
    .then((res) => {
      setChapterData(res.data.course_chapters);
      setTeacherData(res.data.teacher);
      setCourseData(res.data);

      try {
        setRelatedCourseData(JSON.parse(res.data.related_videos));
      } catch {
        setRelatedCourseData([]);
      }

      setTeachListData(res.data.teach_list);

      if (res.data.course_rating) {
        setAvgRating(res.data.course_rating);
      }
    })
    .catch((err) => console.log(err));

  // Update views
  axios.get(`${baseUrl}/update-view/${course_id}`)
    .then((res) => setCourseViews(res.data.views))
    .catch((err) => console.log(err));

  // Initial enrollment check
  fetchEnrollStatus();

}, [course_id]);






useEffect(() => {

  if (enrolledStatus !== "pending") return;

  const interval = setInterval(() => {
    fetchEnrollStatus();
  }, 5000);

  return () => clearInterval(interval);

}, [enrolledStatus]);





useEffect(() => {

  const studentLoginStatus = localStorage.getItem('studentLoginStatus');
  if (studentLoginStatus === 'true') {
    setUserLoginStatus('success');
  }

  if (!studentId) return;

  // Rating Status
  axios.get(`${baseUrl}/fetch-rating-status/${studentId}/${course_id}`)
    .then((res) => {
      if (res.data.bool === true) {
        setRatingStatus('success');
      }
    })
    .catch((err) => console.log(err));

  // Favorite Status
  axios.get(`${baseUrl}/fetch-favorite-status/${studentId}/${course_id}`)
    .then((res) => {
      if (res.data.bool === true) {
        setFavoriteStatus('success');
      } else {
        setFavoriteStatus('');
      }
    })
    .catch((err) => console.log(err));

}, [course_id]);




const submitPayment = async () => {

  if(!paymentFile){
    Swal.fire("Please upload payment screenshot");
    return;
  }

  const formData = new FormData();
  formData.append("student_id", studentId);
  formData.append("course_id", course_id);
  formData.append("payment_proof", paymentFile);

  try{
    const res = await axios.post(
      `${baseUrl}/student-enroll-course/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    Swal.fire({
      title: "Payment Submitted!",
      text: "Waiting for admin approval",
      icon: "success"
    });

    setEnrolledStatus("pending");
    setShowPayment(false);

  }catch(error){
    console.log(error);
    Swal.fire("Error", "Something went wrong", "error");
  }
};


  const [ratingData,setRatingData]=useState({
      rating:'',
      reviews:''
    });

    const handleChange=(event)=>{
      setRatingData({
          ...ratingData,
          [event.target.name]:event.target.value
      });
    }

    const formSubmit=()=>{
      const _formData=new FormData();
      _formData.append('course',course_id);
      _formData.append('student',studentId);
      _formData.append('rating',ratingData.rating);
      _formData.append('reviews',ratingData.reviews);

      try{
          axios.post(baseUrl+'/course-rating/',_formData,)
          .then((res)=>{
              if(res.status==200 || res.status==201){
                  Swal.fire({
                      title:'Rated Successfully!',
                      icon:'success',
                      toast:true,
                      timer:3000,
                      position:'top-right',
                      timerProgressBar: true,
                      showConfirmButton: false
                  });
              }
          });
      }catch(error){
          console.log(error);
      }
    };

    // ✅ FIXED markAsFav (NO DUPLICATION)
    const markAsFav=()=>{
      if(!studentId) return;
      if(favLoading) return;
      if(favoriteStatus === 'success') return;

      setFavLoading(true);

      const _formData=new FormData();
      _formData.append('course',course_id);
      _formData.append('student',studentId);
      _formData.append('status',true);

      axios.post(baseUrl+'/student-add-favorte-course/',_formData,{
          headers: { 'content-type':'multipart/form-data' }
      })
      .then((res)=>{
        if(res.data.bool === true){
          Swal.fire({
              title:'This Course Successfully added to your Favorite list',
              icon:'success',
              toast:true,
              timer:3000,
              position:'top-right',
              timerProgressBar: true,
              showConfirmButton: false
          });
        } else {
          Swal.fire({
              title: res.data.msg || 'Already in your Favorite list ❤️',
              icon:'info',
              toast:true,
              timer:2500,
              position:'top-right',
              timerProgressBar: true,
              showConfirmButton: false
          });
        }
        setFavoriteStatus('success');
      })
      .catch((error)=>console.log(error))
      .finally(()=>setFavLoading(false));
    };

    // ✅ FIXED removeFav
    const removeFav=()=>{
      if(!studentId) return;
      if(favLoading) return;

      setFavLoading(true);

      axios.get(baseUrl+'/student-remove-favorite-course/'+course_id+'/'+studentId)
      .then((res)=>{
          if(res.data.bool === true){
              Swal.fire({
                  title:'This Course Successfully removed from your Favorite list',
                  icon:'success',
                  toast:true,
                  timer:3000,
                  position:'top-right',
                  timerProgressBar: true,
                  showConfirmButton: false
              });
              setFavoriteStatus('');
          }
      })
      .catch((error)=>console.log(error))
      .finally(()=>setFavLoading(false));
    };
    
    useEffect(()=>{
      document.title='LMS | Courses Details'
    })

  return (
    <div className='conatiner mt-4 px-4 hod'>
        <div className='row'>
        <div className="col-lg-3 col-md-6 mt-3">
                    <div className="team-item bg-light">
                        <div className="overflow-hidden">
                        <img src={courseData.featured_img} className="card-img-top img-fluid img-thumbnail" alt={courseData.title}/>            
                        </div>
                    </div>
                </div>
            <div className='col-8 pd-2 mt-3'>
                <h3 className="course-main-title">
  {courseData.title}
</h3>

                <p>{courseData.description}</p>
                <p className='fw-bold'>Course By : <Link to={`/teacher-detail/${teacherData.id}`}>{teacherData.full_name}</Link></p>
                <p className='fw-bold'>Techs :&nbsp;
                  <a className='text-warning'>{courseData.techs}</a>
                </p>
                <p className='fw-bold'>Total Enrolled &nbsp;<i className="bi bi-person-plus-fill text-info"></i> :&nbsp;{courseData.total_enrolled_students}</p> 
                <p className='fw-bold'>
                Rating : {avgRating} / 5
                {enrolledStatus === 'approved' && userLoginStatus === 'success' &&

                <>
                {ratingStatus !== 'success' && 

                  <button className='btn btn-success btn-sm ms-2' data-bs-toggle="modal" data-bs-target="#ratingModal">Rating</button>   
                }
                {ratingStatus == 'success' && 
                  <span className='btn btn-success btn-sm ms-2 rounded-pill mt-2' >You already Rated this Course</span>   
                }
                      <div className="modal fade" id="ratingModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Rate for {courseData.title}</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            
                                <div className="mb-3">
                                  <label className="form-label">Rating</label>
                                  <select onChange={handleChange} className='form-control' name='rating'>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Review</label>
                                  <textarea onChange={handleChange} name="reviews" className="form-control" rows="6" />
                                </div>
                                <button onClick={formSubmit} type="submit" className="btn btn-primary">Submit</button>
                              
                            </div>
                          </div>
                        </div>
                        </div>
                  </>
                }  
                </p>
                <p className='fw-bold'>
                    Views: {courseViews}
                </p>
              {/* NOT ENROLLED */}
{userLoginStatus === 'success' && enrolledStatus === 'not_enrolled' &&
  <p>
    <button
      className='btn btn-success rounded-pill'
      onClick={() => setShowPayment(true)}
    >
      Enroll Now
    </button>
  </p>
}

{/* PENDING */}
{enrolledStatus === 'pending' &&
  <p>
    <span className='btn btn-warning rounded-pill btn-sm'>
      ⏳ Waiting for Admin Approval
    </span>
  </p>
}

{/* APPROVED */}
{enrolledStatus === 'approved' &&
  <p>
    <span className='btn btn-info rounded-pill btn-sm'>
      ✅ You Are Enrolled
    </span>
  </p>
}

{/* REJECTED */}
{enrolledStatus === 'rejected' &&
  <p>
    <span className='btn btn-danger rounded-pill btn-sm'>
      ❌ Payment Rejected
    </span>
  </p>
}


                {/* ✅ Favorite buttons (same concept, only disabled added) */}
               {userLoginStatus === 'success' && favoriteStatus !== 'success' &&

                    <p>
                      <button
                        type='button'
                        disabled={favLoading}
                        onClick={markAsFav}
                        title="Add in your favorite Course list"
                        className='btn btn-outline-danger btn-sm'
                      >
                        <i className='bi bi-heart'></i>
                      </button>
                    </p>
                }
                {userLoginStatus === 'success' && favoriteStatus === 'success' &&

                    <p>
                      <button
                        type='button'
                        disabled={favLoading}
                        onClick={removeFav}
                        title="Remove from favorite Course list"
                        className='btn btn-outline-danger btn-sm'
                      >
                        <i className='bi bi-heart-fill'></i>
                      </button>
                    </p>
                }

                {userLoginStatus !== 'success' && 
                    <p><Link to='/user-login' className='btn btn-danger rounded-pill'>Please login to enjoy this course</Link></p>
                }
            </div>
        </div>

        {/* Course Videos*/}
      {enrolledStatus === 'approved' && userLoginStatus === 'success' &&

      <>
        <div className="card mt-4">
            <h5 className="card-header">
                Course Contains
            </h5>
            <ul className="list-group list-group-flush">
            {chapterData.map((chapter,index) => (
              <li className="list-group-item" key={chapter.id}>{chapter.title}
              </li>
            ))}
            </ul>
        </div>
        <Link to={`/mini/${courseData.id}`} className='btn btn-sm bg-success mt-2 text-white'>Start Now</Link>
      </>
      }

      {/* {userLoginStatus === 'success' && enrolledStatus === 'success' && (
        <Link to={`/course/${course_id}/quiz`} className="btn btn-warning mt-3">
          📝 Take Quiz
        </Link>
      )} */}

      {/* Related Courses */}
<h3 className="related-heading pb-1 mb-4 mt-5">
  Related Courses
</h3>
      <div className='row mb-4'>
      {relatedCourseData.map((rcourse,index) =>
        <div className='col-md-3 mb-4' key={index}>
          <div className="card">
            <Link target='__blank' to={`/detail/${rcourse.pk}`}>
              <img src={`${siteUrl}media/${rcourse.fields.featured_img}`} className="card-img-top fadeInUp" height={200} alt={rcourse.fields.title}/>
            </Link>
              <div className="card-body">
                <h5 className="card-title"><Link to={`/detail/${rcourse.pk}`}>{rcourse.fields.title}</Link></h5>
              </div>
          </div>
        </div>
      )}
      </div>


      {showPayment && (
  <div className="modal d-block" tabIndex="-1" style={{backgroundColor:"rgba(0,0,0,0.6)"}}>
    <div className="modal-dialog">
      <div className="modal-content p-3">

        <h5 className="mb-3 text-center">Scan & Pay</h5>

        <img 
          src="/qr/qrcode.jpeg"
              alt="UPI QR"
              className="qr-image"
        />

        <input 
          type="file"
          className="form-control mb-3"
          onChange={(e) => setPaymentFile(e.target.files[0])}
        />

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowPayment(false)}
          >
            Cancel
          </button>

          <button 
            className="btn btn-success"
            onClick={submitPayment}
          >
            Submit Payment
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default CourseDetail