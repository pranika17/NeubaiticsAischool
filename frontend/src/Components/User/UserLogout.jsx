// import React from 'react'

// const UserLogout = () => {
//     localStorage.removeItem('studentLoginStatus')
//     window.location.href='/user-login';
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default UserLogout




import React from 'react'

const UserLogout = () => {
    localStorage.removeItem('studentLoginStatus')
    localStorage.removeItem('studentId')
    localStorage.removeItem('chatAuthTokenStudent')
    localStorage.removeItem('chatAuthToken')
    window.location.href='/user-login';
  return (
    <div>
      
    </div>
  )
}

export default UserLogout

