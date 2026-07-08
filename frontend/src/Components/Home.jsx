import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Stars from './Stars'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import './Header.css'
import heroImage from '../assets/imageofai.webp'
import './main.css'
import ab from './about2.png'
import about from './about1.webp'
import './search.css'
import './Home.css'

const baseUrl='http://127.0.0.1:8000/api'

const Home = () => {
  const homeVideoUrl = process.env.REACT_APP_HOME_VIDEO_URL || "/videos/dark.mp4";

  const aboutMediaSlides = [
    {
      title: "School Innovation Labs",
      text: "Robotics, IoT, Python, and AI programs designed for hands-on school learning.",
      image: ab,
      tag: "Campus Story",
      type: "image",
    },
    {
      title: "College AI Programs",
      text: "GenAI, data science, internship pathways, and future-ready skilling tracks.",
      image: about,
      tag: "Workshop",
      type: "image",
    },
    {
      title: "Professional Upskilling",
      text: "Career-focused AI and ML learning journeys with practical outcomes.",
      image: ab,
      tag: "Training",
      type: "image",
    },
    {
      title: "Corporate Bootcamps",
      text: "AI bootcamps and workforce transformation programs for modern teams.",
      image: about,
      tag: "Corporate",
      type: "image",
    },
    {
      title: "AIpreneur Journeys",
      text: "Startup-oriented AIpreneur pathways for product thinking and execution.",
      image: ab,
      tag: "Startup",
      type: "image",
    },
    {
      title: "Mentored Project Delivery",
      text: "Projects, mentorship, and real-world implementation in every learning journey.",
      image: about,
      tag: "Projects",
      type: "image",
    },
  ];

  useEffect(()=>{
    document.title='Edu Learning'
  })

  const icon={
    'font-size':'20px'
  } 

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal-up-target, .reveal-side-left, .reveal-side-right");
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
  axios.get(baseUrl+'/student-test/?testimonials=1')
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
    <video className="showcase-media" autoPlay muted loop playsInline poster={heroImage}>
      <source src={homeVideoUrl} type="video/mp4" />
    </video>
    {/* <div class="overlay"></div> */}
    <div class="text video-text-glow">
      {/* <h1 className='head glow-text'>Never stop learning.<br/> Never stop growing.</h1>  */}
<h1
  className="head glow-text tamil-text tamil-two-line"
  style={{
    fontSize: "clamp(24px, 6.2vw, 64px)",
    fontWeight: 900,                     // ✅ reduced weight
    maxWidth: "100%",
    lineHeight: "1.22"
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
    <div className="container-xxl py-5 space">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="service-item text-center pt-3 home-feature-card">
                        <div class="p-4">
                            <i class="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                            <h5 class="mb-3">Skilled Instructors</h5>
                            <p>Our Instructors Says: <br/>If you are planning for a year, sow rice; if you are planning for a decade, plant trees; if you are planning for a lifetime, educate people. That can help the college students.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="service-item text-center pt-3 home-feature-card">
                        <div class="p-4">
                            <i class="fa fa-3x fa-globe text-primary mb-4"></i>
                            <h5 class="mb-3">Online Courses</h5>
                            <p>The most profound words will remain unread unless you can keep the learner engaged. You can't see their eyes to know if they got it so … say it, show it, write it, demo it and link it to an activity.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="service-item text-center pt-3 home-feature-card">
                        <div class="p-4">
                            <i class="fa fa-3x fa-home text-primary mb-4"></i>
                            <h5 class="mb-3">Home Assignments</h5>
                            <p>To Prepare all our students for future. Instructors provides best quality Assignments for practice. Assignments which include all chapters Question for better understand of the entire Course.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                    <div class="service-item text-center pt-3 home-feature-card">
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
            <div class="row g-5 align-items-center">
                <div class="col-lg-6 wow fadeInUp home-about-media" data-wow-delay="0.1s" >
                    <div class="home-about-image-frame">
                        <img class="img-fluid home-about-image" src={about}/>
                        
                         
                         
                       
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp home-about-copy" data-wow-delay="0.3s">
                  <div className="home-about-panel">
                    <h6 class="section-title text-start text-primary pe-3">About NeubAItics</h6>
                    <h1 class="mb-4">AI For Everyone. Every Stream. Every Dream.</h1>

                    <p class="mb-3">
                      NeubAItics School of AI creates practical learning pathways for schools, colleges, professionals, corporates, and entrepreneurs, making AI easier to learn, apply, and grow with.
                    </p>

                    <p class="mb-0">
                      Our ecosystem connects robotics, IoT, GenAI, machine learning, data science, internships, bootcamps, startup support, and hands-on projects so each learner can build real skills and create visible outcomes.
                    </p>

                    <div className="about-highlight-strip">
                      <div className="about-highlight-card">
                        <span className="about-highlight-value">1,00,000+</span>
                        <span className="about-highlight-label">Learners Trained</span>
                      </div>
                      <div className="about-highlight-card">
                        <span className="about-highlight-value">50+</span>
                        <span className="about-highlight-label">Institutional Partners</span>
                      </div>
                      <div className="about-highlight-card">
                        <span className="about-highlight-value">Hands-On</span>
                        <span className="about-highlight-label">Projects & Mentorship</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div className="about-showcase reveal-up-target">
              <div className="about-showcase-header">
                <div>
                  <span className="about-showcase-kicker">Office Gallery</span>
                  <h3 className="about-showcase-title">Replace dull cards with a media slider</h3>
                </div>
                <p className="about-showcase-note">
                  Add 5 or 10 photos and they will slide automatically. If you later add office videos, the same section can show them too.
                </p>
              </div>

              <Carousel
                className="about-media-carousel"
                showArrows={true}
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                infiniteLoop={true}
                autoPlay={true}
                interval={4200}
                swipeable={true}
                emulateTouch={true}
              >
                {aboutMediaSlides.map((slide, index) => (
                  <div key={`${slide.title}-${index}`} className="about-media-slide">
                    <div className="about-media-stage">
                      <div className="about-media-visual">
                        {slide.type === "video" ? (
                          <video
                            className="about-slide-media"
                            src={slide.image}
                            poster={slide.poster}
                            controls
                            playsInline
                          />
                        ) : (
                          <img className="about-slide-media" src={slide.image} alt={slide.title} />
                        )}
                        <span className="about-media-badge">{slide.tag}</span>
                      </div>

                      <div className="about-media-copy">
                        <span className="about-media-count">
                          {String(index + 1).padStart(2, "0")} / {String(aboutMediaSlides.length).padStart(2, "0")}
                        </span>
                        <h4>{slide.title}</h4>
                        <p>{slide.text}</p>
                        <div className="about-media-meta">
                          <span>Image / Video Ready</span>
                          <span>Auto Slide Enabled</span>
                          <span>Office Showcase Section</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>

              <div className="about-media-thumb-grid">
                {aboutMediaSlides.map((slide, index) => (
                  <div key={`${slide.title}-thumb-${index}`} className="about-media-thumb">
                    <img src={slide.image} alt={slide.title} />
                    <div>
                      <strong>{slide.title}</strong>
                      <span>{slide.tag}</span>
                    </div>
                  </div>
                ))}
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
