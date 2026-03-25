// import React from 'react'

// const TeacherLogout = () => {
//     localStorage.removeItem('teacherLoginStatus')
//     window.location.href='/teacher-login';
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default TeacherLogout



import React from 'react'

const TeacherLogout = () => {
    localStorage.removeItem('teacherLoginStatus')
    localStorage.removeItem('teacherId')
    localStorage.removeItem('chatAuthTokenTeacher')
    localStorage.removeItem('chatAuthToken')
    window.location.href='/teacher-login';
  return (
    <div>
      
    </div>
  )
}

export default TeacherLogout
