import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Stars from './Stars'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import './Header.css'
import wave from './darkside4.mp4'
import './main.css'
import ab from './about.jpg'
import './search.css'
import './Home.css'

const baseUrl='http://127.0.0.1:8000/api'

const Home = () => {
  useEffect(()=>{
    document.title='Edu Learning'
  })

  const icon={
    'font-size':'20px'
  } 

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [courseData, setCourseData]=useState([]);
  const [popularcourseData,setPopularcourseData]=useState([]);
  const [popularteacherData,setPopularteacherData]=useState([]);
  const [testData,setTestData]=useState([]);

  useEffect(()=>{
    try{
        axios.get(baseUrl+'/course/?result=3')
        .then((res)=>{
            setCourseData(res.data.results)
        });
    }catch(error){
        console.log(error)
    }

    try{
      axios.get(baseUrl+'/popular-teachers/?popular=1')
      .then((res)=>{
        setPopularteacherData(res.data)
      });
  }catch(error){
      console.log(error)
  }

  try{
    axios.get(baseUrl+'/popular-courses/?popular=1')
    .then((res)=>{
      setPopularcourseData(res.data.results)
    });
}catch(error){
    console.log(error)
}

try{
  axios.get(baseUrl+'/student-test/')
  .then((res)=>{
    setTestData(res.data.results)
  });
}catch(error){
  console.log(error)
}
    
  },[]);

  const teacherLoginStatus=localStorage.getItem('teacherLoginStatus')
  const studentLoginStatus=localStorage.getItem('studentLoginStatus')
  
  const [searchString,setSearchString]=useState({
    'search':'',
  })

  const handleChange=(event)=>{
    setSearchString({
      ...searchString,
      [event.target.name]:event.target.value
    });
  }
  
  return (
    <>
      {/* Start Background video player*/}
    <section class="showcase">
    <video src={wave} autoPlay muted loop />
    {/* <div class="overlay"></div> */}
    <div class="text video-text-glow">
      {/* <h1 className='head glow-text'>Never stop learning.<br/> Never stop growing.</h1>  */}
<h1
  className="head glow-text tamil-text tamil-two-line"
  style={{
    fontSize: "clamp(46px, 4vw, 98px)",  // ✅ smaller & responsive
    fontWeight: 900,                     // ✅ reduced weight
    maxWidth: "90%",                     // ✅ prevents cutting
    lineHeight: "1.3"
  }}
>
  <span>கற்க கசடறக் கற்பவை கற்றபின்</span>
  <span>நிற்க அதற்குத் தக</span>
</h1>


  <h1 className='headss glow-text-second'>
    Welcome to <span className="glow-span">NeubAitics School Of AI</span>
  </h1>
  <p className='para glow-para'>
    Learn smarter, teach better, and grow faster with our powerful Learning Management System..
  </p>
</div>

    </section>
      {/*  End Background video player*/}
      {/*  Start Features of meetLearning*/}
    <div class="container-xxl py-5" className='space'>
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="service-item text-center pt-3">
                        <div class="p-4">
                            <i class="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                            <h5 class="mb-3">Skilled Instructors</h5>
                            <p>Our Instructors Says: <br/>If you are planning for a year, sow rice; if you are planning for a decade, plant trees; if you are planning for a lifetime, educate people. That can help the college students.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="service-item text-center pt-3">
                        <div class="p-4">
                            <i class="fa fa-3x fa-globe text-primary mb-4"></i>
                            <h5 class="mb-3">Online Courses</h5>
                            <p>The most profound words will remain unread unless you can keep the learner engaged. You can't see their eyes to know if they got it so … say it, show it, write it, demo it and link it to an activity.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="service-item text-center pt-3">
                        <div class="p-4">
                            <i class="fa fa-3x fa-home text-primary mb-4"></i>
                            <h5 class="mb-3">Home Assignments</h5>
                            <p>To Prepare all our students for future. Instructors provides best quality Assignments for practice. Assignments which include all chapters Question for better understand of the entire Course.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                    <div class="service-item text-center pt-3">
                        <div class="p-4">
                            <i class="fa fa-3x fa-book-open text-primary mb-4"></i>
                            <h5 class="mb-3">Best Study Material</h5>
                            <p>With our quality study material any can achieve their goal and with the top instructors nothing can stop you. At the Time of Exam any student can refer the study material and ace any exam or interview.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      {/*  End Features of meetLearning*/}
      {/*  About Us card */}
    <div id="about" class="container-xxl py-5">

        <div class="container">
            <div class="row g-5">
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" >
                    <div class="position-relative h-100">
                        <img class="img-fluid position-absolute w-100 h-100" src={ab}/>
                    </div>
                </div>
             <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
    <h6 class="section-title text-start text-primary pe-3">About NeubAItics</h6>
    <h1 class="mb-4">AI For Everyone. Every Stream. Every Dream.</h1>

    <p class="mb-4">
        NeubAItics School of AI is India’s trusted learning ecosystem for Artificial Intelligence and Generative AI.  
        With 30,000+ learners trained and 50+ institutional partners, we make AI accessible for schools, colleges, 
        professionals, corporates, and aspiring entrepreneurs. Our mission is simple — empower every learner to build skills, 
        grow careers, and create real-world impact using AI.
    </p>

    <p class="mb-4">
        From robotics labs and IoT programs to industry-ready courses in Machine Learning, Data Science, 
        Business Analytics, and Agentic AI — our programs combine hands-on projects, practical learning, 
        and expert mentorship. Whether you're a student starting your journey or a professional preparing for 
        the future of work, NeubAItics helps you learn, innovate, and lead with confidence.
    </p>

    <div class="row gy-2 gx-4 mb-4">

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Schools → Robotics, IoT, Python & AI Labs</p>
        </div>

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Colleges → AI, GenAI, DS & Internships</p>
        </div>

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Professionals → Career-Focused AI/ML Upskilling</p>
        </div>

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Corporates → AI Bootcamps & Workforce Training</p>
        </div>

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Entrepreneurs → AIpreneur Startup Programs</p>
        </div>

        <div class="col-sm-6">
            <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Hands-On Projects & Real-World Application</p>
        </div>

    </div>
</div>

            </div>
        </div>
    </div>
      {/*  About Us card */}



{/* ================= Flagship Programs Section ================= */}
<div className="container-xxl py-5">
  <div className="container">

    <div className="text-center">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Our Programs
      </h6>
      <h1 className="mb-5">Flagship Programs Trusted Nationwide</h1>
    </div>

    <div className="row g-4">

      {/* Program Card */}
      <div className="col-lg-3 col-sm-6">
        <div className="service-item text-center pt-3 program-card">
          <div className="p-4">
            <i className="fa fa-3x fa-brain text-info mb-4"></i>
            <h5 className="mb-3">Certified GenAI Creator™</h5>
            <p>
              A 3-week intensive GenAI and AI Agent program aligned with IBM Partner PLUS.
            </p>
          </div>
        </div>
      </div>

      {/* Program Card */}
      <div className="col-lg-3 col-sm-6">
        <div className="service-item text-center pt-3 program-card">
          <div className="p-4">
            <i className="fa fa-3x fa-rocket text-info mb-4"></i>
            <h5 className="mb-3">AIpreneur Starter Pack</h5>
            <p>
              Turn ideas into AI-driven startups with guided mentorship & portfolio PROJECTS.
            </p>
          </div>
        </div>
      </div>

      {/* Program Card */}
      <div className="col-lg-3 col-sm-6">
        <div className="service-item text-center pt-3 program-card">
          <div className="p-4">
            <i className="fa fa-3x fa-robot text-info mb-4"></i>
            <h5 className="mb-3">AI & Robotics Programs</h5>
            <p>
              Build your first robot and create AI tools—perfect for schools & colleges SHORTLY.
            </p>
          </div>
        </div>
      </div>

      {/* Program Card */}
      <div className="col-lg-3 col-sm-6">
        <div className="service-item text-center pt-3 program-card">
          <div className="p-4">
            <i className="fa fa-3x fa-briefcase text-info mb-4"></i>
            <h5 className="mb-3">Corporate AI Bootcamp</h5>
            <p>
              6–12 week corporate-level AI & GenAI upskilling with real-world projects NOW.
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</div>
{/* ================= End Programs Section ================= */}





      {/* <div class="input-box container">
          <i class="bi bi-search text-info"></i>
          <input name='search' type="search" onChange={handleChange} placeholder="Search here..." aria-label="Search" />
          <Link className='button' to={'/search/'+searchString.search} type="button">Search</Link>
      </div> */}

    <div className='container mt-4'>
      {/* Start Latest Courses*/}
    <div class="container-xxl py-5">
        <div class="container">
           <div class="text-center wow fadeInUp">
                <h6 class="section-title bg-white text-center text-primary px-3">Courses</h6>
                <h1 class="mb-5">Latest Courses </h1>
            </div>

            <div className="auto-scroll">
  <div className="scroll-inner">
    {[...courseData, ...courseData].map((course, index) => (
      <div className="scroll-card" key={index}>
        <div className="course-item bg-light shadow">
          <div className="position-relative overflow-hidden">
            <Link to={`/detail/${course.id}`}>
              <img src={course.featured_img} height={250} className="card-img-top" alt={course.title} />
            </Link>
          </div>

          <div className="text-center p-4 pb-0">
            <h5 className="mb-4">
              <Link to={`/detail/${course.id}`}>{course.title}</Link>
            </h5>
          </div>

          <div className="d-flex border-top">
            <small className="flex-fill text-center border-end py-2">
              <i className="fa fa-user-tie text-primary me-2"></i>
              {course.teacher.full_name}
            </small>
            <small className="flex-fill text-center py-2">
              <i className="fa fa-user text-primary me-2"></i>
              {course.total_enrolled_students}
            </small>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
</div>
    </div>
    <div class="text-center">
    <button type="button" class="btn btn-primary border border-primary"><Link to='/all-courses'className='text-white' >View More</Link></button>
    </div>
      {/* ENd Latest Courses*/}
      {/* popular Courses*/}
    <div class="container-xxl py-5">
        <div class="container">
            <div class="text-center wow fadeInUp">
                <h6 class="section-title bg-white text-center text-primary px-3">Courses</h6>
                <h1 class="mb-5">Popular Courses</h1>
            </div>
            <div className="auto-scroll">
  <div className="scroll-inner">
    {[...popularcourseData, ...popularcourseData].map((row, index) => (
      <div className="scroll-card" key={index}>
        <div className="course-item bg-light shadow">

          <div className="position-relative overflow-hidden">
            <Link to={`/detail/${row.course.id}`}>
              <img 
                src={row.course.featured_img} 
                height={250} 
                className="card-img-top" 
                alt={row.course.title} 
              />
            </Link>
          </div>

          <div className="text-center p-4 pb-0">
            <h5 className="mb-4">
              <Link to={`/detail/${row.course.id}`}>{row.course.title}</Link>
            </h5>
          </div>

          <div className="d-flex border-top">
            <small className="flex-fill text-center border-end py-2">
              <i className="fa fa-user-tie text-primary me-2"></i>
              {row.course.teacher.full_name}
            </small>
            <small className="flex-fill text-center border-end py-2">
              <Stars stars={row.rating}/>
            </small>
            <small className="flex-fill text-center py-2">
              <i className="fa fa-eye text-primary me-2"></i>
              {row.course.course_views}
            </small>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>
</div>
    </div>
    <div class="text-center">
    <button type="button" class="btn btn-primary border border-primary"><Link to='/popular-courses' className='text-white'>View More</Link></button>
    </div>
      {/* ENd Popular Courses*/}
      {/* Popular Teacher */}
    <div class="container-xxl py-5">
        <div class="container">
            <div class="text-center wow fadeInUp">
                <h6 class="section-title bg-white text-center text-primary px-3">Instructors</h6>
                <h1 class="mb-5">Popular Instructors</h1>
            </div>
       <div className="auto-scroll">
  <div className="scroll-inner">
    {[...popularteacherData, ...popularteacherData].map((teacher, index) => (
      <div className="scroll-card" key={index}>
        <div className="team-item bg-light shadow">

          <div className="overflow-hidden">
            <Link className='front' to={`/teacher-detail/${teacher.id}`}>
              <img
                src={teacher.image_url ? teacher.image_url : '/default-avatar.png'}
                height={330}
                className="card-img-top"
                alt={teacher.full_name}
              />
            </Link>
          </div>

          <div className="text-center p-4">
            <h4 className="card-title mb-1">
              <Link to={`/teacher-detail/${teacher.id}`}>{teacher.full_name}</Link>
            </h4>
            <p className='mb-0'>{teacher.qualification}</p>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>
</div>
    </div>
      {/* ENd Popular Teacher Courses*/}
      {/* Student Testimonial */}
<div className="text-center wow fadeInUp">
  <h6 className="section-title text-center text-primary px-3">
    What our Students Say
  </h6>
  <h1 className="mb-5">Student Testimonials</h1>
</div>

<Carousel
  showArrows={true}
  infiniteLoop={true}
  showThumbs={false}
  showStatus={false}
  autoPlay={true}
  interval={5500}
  showIndicators={false}
>
  {testData && testData.map((row, i) => (
    <div key={i} className="testimonial-slide">
      
      <div className="testimonial-card">

  <div className="testimonial-image-wrapper">
    <img
      className="testimonial-avatar"
      src={row.student.profile_img || "/static/images/default-user.png"}
      alt={row.student.fullname}
    />
  </div>

  <p className="feedback-text">“{row.reviews}”</p>

  <p className="testimonial-name">— {row.student.fullname}</p>

  <p className="testimonial-course">{row.course.title}</p>

</div>


    </div>
  ))}
</Carousel>

      {/* ENd Student Testimonial*/}
    </div>
    </>
  )
}

export default Home