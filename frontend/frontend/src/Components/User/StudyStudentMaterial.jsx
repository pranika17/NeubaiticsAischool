import { baseUrl } from '../../config';
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import Sidebar from './Sidebar'

// const baseUrl = baseUrl

// const StudyStudentMaterial = () => {
//   const [studyData, setStudyData] = useState([])
//   const [totalResult, setTotalResult] = useState(0)
//   const { course_id } = useParams()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/study-material/${course_id}`)
//         setTotalResult(res.data.length)
//         setStudyData(res.data)
//       } catch (error) {
//         console.error('Error fetching study materials:', error)
//       }
//     }
//     fetchData()
//   }, [course_id]) // ✅ added course_id as dependency

//   const downloadFile = (file_url) => {
//     window.location.href = file_url
//   }

//   return (
//     <div className='container mt-4'>
//       <div className='row'>
//         <aside className='col-md-3'>
//           <Sidebar />
//         </aside>
//         <section className='col-md-9'>
//           <div className='card'>
//             <h5 className='card-header'>All Study Materials ({totalResult})</h5>
//             <div className='card-body table-responsive'>
//               <table className='table table-bordered'>
//                 <thead>
//                   <tr>
//                     <th>Title</th>
//                     <th>Details</th>
//                     <th>Study Materials</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {studyData.map((row, index) => (
//                     <tr key={index}>
//                       <td>{row.title}</td>
//                       <td>{row.description}</td>
//                       <td>
//                         <button
//                           className='btn btn-success btn-sm'
//                           onClick={() => downloadFile(row.upload)}
//                         >
//                           Download File
//                         </button>
//                       </td>
//                       <td>{row.remarks}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

// export default StudyStudentMaterial




import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
const StudyStudentMaterial = () => {
  const [studyData, setStudyData] = useState([])
  const [totalResult, setTotalResult] = useState(0)
  const { course_id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/study-material/${course_id}`)
        setTotalResult(res.data.length)
        setStudyData(res.data)
      } catch (error) {
        console.error('Error fetching study materials:', error)
      }
    }
    fetchData()
  }, [course_id]) // ✅ added course_id as dependency

  const downloadFile = (file_url) => {
    window.location.href = file_url
  }

  return (
    <div className='container mt-4'>
      <div className='row'>
        {/* <aside className='col-md-3'>
          <Sidebar />
        </aside> */}
        <section className='col-md-9'>
          <div className='card'>
            <h5 className='card-header'>All Study Materials ({totalResult})</h5>
            <div className='card-body table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Details</th>
                    <th>Study Materials</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studyData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.title}</td>
                      <td>{row.description}</td>
                      <td>
                        <button
                          className='btn btn-success btn-sm'
                          onClick={() => downloadFile(row.upload)}
                        >
                          Download File
                        </button>
                      </td>
                      <td>{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default StudyStudentMaterial

