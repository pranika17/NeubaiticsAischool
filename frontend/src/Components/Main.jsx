import React from 'react'
import Home from './Home'
import Header from './Header'
import Footer from './Footer'
import CourseDetail from './CourseDetail'
import TeacherDetails from './TeacherDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import About from './About';
import Login from './User/Login'
import Register from './User/Register'
import Dashboard from './User/Dashboard'
import MyCourses from './User/MyCourses'
import FavoriteCourses from './User/FavoriteCourses'
import RecomemdedCourses from './User/RecomemdedCourses'
import ProfileSetting from './User/ProfileSetting'
import ChangePassword from './User/ChangePassword'

import TeacherLogin from './Teacher/TeacherLogin'
import TeacherRegister from './Teacher/TeacherRegister'

import TeacherDashboard from './Teacher/TeacherDashboard'
import TeacherChangePassword from './Teacher/TeacherChangePassword'
import TeacherProfileSetting from './Teacher/TeacherProfileSetting'
import TeacherMyCourses from './Teacher/TeacherMyCourses'
import AddCourse from './Teacher/AddCourses'

import MyUsers from './Teacher/MyUsers'
import AllCourses from '../AllCourses'
import RegisterWorkshop from './RegisterWorkshop'
import PopularCourses from '../PopularCourses'
import TeacherLogout from './Teacher/TeacherLogout'
import CategoryCourses from '../CategoryCourses'
import AddChapter from './Teacher/AddChapter'

import AllChapters from './Teacher/CourseChapters'
import EditChapter from './Teacher/EditChapter'
import EditCourse from './Teacher/EditCourse'
import TeacherSkillCourses from './Teacher/TeacherSkillCourses'
import UserLogout from './User/UserLogout'

import EnrolledStudents from './Teacher/EnrolledStudents'
import AddAssignment from './Teacher/AddAssignment'
import ShowAssignment from './Teacher/ShowAssignment'
import StudentAssignments from './User/StudentAssignments'

import AddQuiz from './Teacher/AddQuiz'
import AllQuiz from './Teacher/AllQuiz'
import EditQuiz from './Teacher/EditQuiz'
import CourseQuizList from './User/CourseQuizList'
import TakeQuiz from './User/TakeQuiz'
import QuestionList from './Teacher/QuestionList'
import AddQuizQuestion from './Teacher/AddQuizQuestion'
import AssignQuiz from './Teacher/AssignQuiz'

import Search from './Search'
import StudyMaterial from './Teacher/StudyMaterial'
import AddStudyMaterial from './Teacher/AddStudyMaterial'
import StudyStudentMaterial from './User/StudyStudentMaterial'
import AttemptedQuiz from './Teacher/AttemptedQuiz'
import AttemptedStudent from './Teacher/AttemptedStudent'
import StudentChatBox from './User/StudentChatBox'
import StudentChatList from './User/StudentChatList'
import Category from '../Category'
import Faq from './Faq'
import Pages from './Pages'
import MyTeachers from './User/MyTeachers'
import MiniVideoPlayer from './MiniVideoPlayer'
import Policy from './Policy'


import QuizResult from './Teacher/QuizResult'
import EditQuizQuestion from './Teacher/EditQuizQuestion'
import QuizList from './User/QuizList'
import TeacherChatList from './Teacher/TeacherChatList'
import TeacherChatBox from './Teacher/TeacherChatBox'


// ⭐ Import Teacher Layout
import TeacherLayout from './Teacher/TeacherLayout'
import UserLayout from './User/UserLayout'
import NoSidebarLayout from './NoSidebarLayout'
 // adjust path if needed
import TeacherGroupChat from './Teacher/TeacherGroupChat'
import TeacherQuizCards from './Teacher/TeacherQuizCards'
import TeacherQuizPage from './Teacher/TeacherQuizPage'
import WorkShop from './WorkShop'
import WorkshopPayment from './WorkShopPayment'
import Blog from './Blog'
import CertificateGenerator from './Certificate/CertificateGenerator'


const Main = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* ------------------ PAGES WITHOUT SIDEBAR ------------------ */}
        <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
  <Route path="/detail/:course_id" element={<NoSidebarLayout><CourseDetail /></NoSidebarLayout>} />
  <Route path="/user-login" element={<NoSidebarLayout><Login /></NoSidebarLayout>} />
  <Route path="/user-register" element={<NoSidebarLayout><Register /></NoSidebarLayout>} />
  <Route path="/teacher-login" element={<NoSidebarLayout><TeacherLogin /></NoSidebarLayout>} />
  <Route path="/teacher-register" element={<NoSidebarLayout><TeacherRegister /></NoSidebarLayout>} />
  <Route path="/all-courses" element={<NoSidebarLayout><AllCourses /></NoSidebarLayout>} />
  <Route path="/popular-courses" element={<NoSidebarLayout><PopularCourses /></NoSidebarLayout>} />
  <Route path="/course/:category_id/:category_slug" element={<NoSidebarLayout><CategoryCourses /></NoSidebarLayout>} />
  <Route path="/aboutus" element={<NoSidebarLayout><About /></NoSidebarLayout>} />
  <Route path="/policy" element={<NoSidebarLayout><Policy /></NoSidebarLayout>} />
  <Route path="/page/:page_id/:page_slug" element={<NoSidebarLayout><Pages /></NoSidebarLayout>} />
  <Route path="/search/:searchstring" element={<NoSidebarLayout><Search /></NoSidebarLayout>} />
  <Route path="/mini/:course_id" element={<NoSidebarLayout><MiniVideoPlayer /></NoSidebarLayout>} />
  <Route path="/category" element={<NoSidebarLayout><Category /></NoSidebarLayout>} />
  <Route path="/work-shop" element={<NoSidebarLayout><WorkShop /></NoSidebarLayout>} />
  <Route path="/regwork/:id"element={<NoSidebarLayout><RegisterWorkshop /></NoSidebarLayout> }
/>
<Route
  path="/workshop-payment/:registrationId"
  element={<NoSidebarLayout><WorkshopPayment /></NoSidebarLayout>}
  
/>
  <Route path="/blog" element={<NoSidebarLayout><Blog /></NoSidebarLayout>} />
 
<Route path ="/certificate/:studentId/:courseId" element={<NoSidebarLayout><CertificateGenerator/></NoSidebarLayout>}/>


        {/* ------------------ USER PAGES WITH SIDEBAR ------------------ */}
        <Route path="/user-dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
        <Route path="/my-courses" element={<UserLayout><MyCourses /></UserLayout>} />
        <Route path="/favorite-courses" element={<UserLayout><FavoriteCourses /></UserLayout>} />
        <Route path="/my-teachers" element={<UserLayout><MyTeachers /></UserLayout>} />
        <Route path="/recommended-courses" element={<UserLayout><RecomemdedCourses /></UserLayout>} />
        <Route path="/profile-setting" element={<UserLayout><ProfileSetting /></UserLayout>} />
        <Route path="/change-password" element={<UserLayout><ChangePassword /></UserLayout>} />
        <Route path="/user-logout" element={<UserLayout><UserLogout /></UserLayout>} />
        <Route path="/my-assignments" element={<UserLayout><StudentAssignments /></UserLayout>} />
        <Route path="/course-quiz/:course_id" element={<UserLayout><CourseQuizList /></UserLayout>} />
        <Route path="/quizzes" element={<UserLayout><QuizList /></UserLayout>} />
        <Route path="/user/study-material/:course_id" element={<UserLayout><StudyStudentMaterial /></UserLayout>} />
        <Route path= "/take-quiz/:quiz_id" element= {<UserLayout><TakeQuiz  /></UserLayout>} />
        
        
        
       
        <Route
          path="/student/chat-dashboard/:studentId"
          element={<UserLayout><StudentChatList /></UserLayout>}
        />
        <Route
          path="/student/chat/:studentId/:teacherId"
          element={<UserLayout><StudentChatBox /></UserLayout>}
        />


        {/* ------------------ TEACHER PAGES WITH SIDEBAR ------------------ */}
        <Route path="/teacher-dashboard" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
        <Route path="/teacher-change-password" element={<TeacherLayout><TeacherChangePassword /></TeacherLayout>} />
        <Route path="/teacher-profile-setting" element={<TeacherLayout><TeacherProfileSetting /></TeacherLayout>} />
        <Route path="/teacher-my-course" element={<TeacherLayout><TeacherMyCourses /></TeacherLayout>} />
        <Route path="/add-course" element={<TeacherLayout><AddCourse /></TeacherLayout>} />
        <Route path="/my-users" element={<TeacherLayout><MyUsers /></TeacherLayout>} />
        <Route path="/quiz" element={<TeacherLayout><AllQuiz /></TeacherLayout>} />
        <Route path="/add-quiz" element={<TeacherLayout><AddQuiz /></TeacherLayout>} />
        <Route path="/all-questions/:quiz_id" element={<TeacherLayout><QuestionList /></TeacherLayout>} />
        <Route path="/edit-question/:question_id" element={<TeacherLayout><EditQuizQuestion /></TeacherLayout>} />
         <Route
          path="/teacher/chat-dashboard/:teacherId"
          element={<TeacherLayout><TeacherChatList /></TeacherLayout>}
        />
        <Route
          path="/teacher/chat/:teacherId/:studentId"
          element={<TeacherLayout><TeacherChatBox /></TeacherLayout>}
        />


        <Route path="/add-question/:quiz_id" element={<TeacherLayout><AddQuizQuestion /></TeacherLayout>} />
        <Route path="/assign-quiz/:course_id" element={<TeacherLayout><AssignQuiz /></TeacherLayout>} />
        <Route path="/enrolled-students/:course_id" element={<TeacherLayout><EnrolledStudents /></TeacherLayout>} />
        <Route path="/add-chapter/:course_id" element={<TeacherLayout><AddChapter /></TeacherLayout>} />
        <Route path="/edit-chapter/:chapter_id" element={<TeacherLayout><EditChapter /></TeacherLayout>} />
        <Route path="/edit-course/:course_id" element={<TeacherLayout><EditCourse /></TeacherLayout>} />
        <Route path="/study-material/:course_id" element={<TeacherLayout><StudyMaterial /></TeacherLayout>} />
  
       <Route path="/teacher-attempted-students/:quiz_id" element={<TeacherLayout><AttemptedStudent /></TeacherLayout>} />
       <Route path="/teacher-quiz-results/:quiz_id" element={< TeacherLayout><AttemptedQuiz /></TeacherLayout>} />
       <Route path="/teacher-quiz-page" element={<TeacherLayout><TeacherQuizPage /></TeacherLayout>}/>
       

        <Route path="/add-study/:course_id" element={<TeacherLayout><AddStudyMaterial /></TeacherLayout>} />
        <Route path="/quiz-result/:quiz_id/:student_id" element={<TeacherLayout><QuizResult /></TeacherLayout>} />
        <Route path="/add-assignment/:teacher_id/:student_id" element={<TeacherLayout><AddAssignment /></TeacherLayout>} />
        <Route
  path="/show-assignment/:teacher_id/:student_id"
  element={
    <TeacherLayout>
      <ShowAssignment />
    </TeacherLayout>
  }
/>

        <Route path="/teacher-skill-courses/:skill_name/:teacher_id" element={<TeacherLayout><TeacherSkillCourses /></TeacherLayout>} />
        <Route path="/teacher-logout" element={<TeacherLayout><TeacherLogout /></TeacherLayout>} />
       
        <Route path="/teacher-quiz-cards/:quiz_id" element={<TeacherLayout><TeacherQuizCards/></TeacherLayout>} />
         




      </Routes>

      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default Main;