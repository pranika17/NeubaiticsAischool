import { baseUrl, defaultAvatarUrl, resolveMediaUrl } from '../../config';




import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import './MyTeachers.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const MyTeachers = () => {

    const studentId=localStorage.getItem('studentId')
    const [teacherData,setteacherData]=useState([])
    const [unreadMap, setUnreadMap] = useState({})

    useEffect(()=>{
        const loadTeachers = () => {
            axios.get(baseUrl+'/fetch-my-teachers/'+studentId)
            .then((res)=>{
                setteacherData(res.data)
            })
            .catch((error)=>console.log(error));

            axios.get(baseUrl+`/student/chat-dashboard/${studentId}/`)
            .then((res)=>{
                const individuals = Array.isArray(res.data?.individuals) ? res.data.individuals : [];
                const nextMap = individuals.reduce((acc, item) => {
                    acc[item.id] = Number(item.unread || 0);
                    return acc;
                }, {});
                setUnreadMap(nextMap);
            })
            .catch((error)=>console.log(error));
        };

        loadTeachers();
        const interval = setInterval(loadTeachers, 10000);
        return () => clearInterval(interval);
      },[studentId]);

      const [successMsg,setsuccessMsg]=useState('')
      const [errorMsg,seterrorMsg]=useState('')

      const [msgData,setMsgData]=useState({
        msg_to:''
      });

      const handleChange=(event)=>{
        setMsgData({
            ...msgData,
            [event.target.name]:event.target.value
        });
      }

      const formSubmit=(teacher_id)=>{
        const _formData=new FormData()
        _formData.append('msg_to',msgData.msg_to);
        _formData.append('msg_from','student');

        try{
            axios.post(baseUrl+'/send-message/'+teacher_id+'/'+studentId+'/',_formData)
            
            .then((res)=>{
                if(res.data.bool==true){
                    setMsgData({
                        'msg_to':''
                    })
                    setsuccessMsg(res.data.msg)
                    seterrorMsg('')
                }else{
                    setsuccessMsg('')
                    seterrorMsg(res.data.msg)
                }
            });
        }catch(error){
            console.log(error);
        }
      };

    useEffect(()=>{
        document.title='LMS | My Teachers'
      })

      const msgList={
        height:'500px',
        overflow:'hidden'
      }

  return (
    <div className='container mt-4 my-teachers-page'>
        <div className='row'>
            {/* <aside className='col-md-3'>
                <Sidebar />
            </aside> */}
            <section className='col-md-9 my-teachers-section'>
                <div className='my-teachers-card'>
                    <h5 className='my-teachers-header'><i className="bi bi-person-check-fill"/> My Teachers</h5>
                    <div className='my-teachers-table-wrap'>
                        <table className='table my-teachers-table'>
                            <thead>
                                <tr>
                                    <th  className='text-center'>Instructer</th>
                                    <th className='text-center'>Name</th>
                                    <th className='text-center'>Chat</th>
                                </tr>
                            </thead>
                            <tbody>
                            {teacherData.map((row,index) =>
                                <tr key={row.teacher.id || index}>
                                    <td  className='text-center'><Link to={`/teacher-detail/`+row.teacher.id}><img
  className='imgmeet'
  src={resolveMediaUrl(row.teacher.image_url, defaultAvatarUrl)}
  alt={row.teacher.full_name}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = defaultAvatarUrl;
  }}
/>
</Link></td>
                                    <td className='text-center'><Link to={`/teacher-detail/`+row.teacher.id}>{row.teacher.full_name}</Link></td>
                                    <td className='text-center'> <Link
                                                              to={`/student/chat/${studentId}/${row.teacher.id}`}
                                                              className="btn btn-success btn-sm my-teachers-chat-btn"
                                                              onClick={(e) => e.stopPropagation()}
                                                            >
                                                              <i className="bi bi-whatsapp"></i>
                                                              {Number(unreadMap[row.teacher.id] || 0) > 0 && (
                                                                <span className="my-teachers-chat-badge">
                                                                  {unreadMap[row.teacher.id]}
                                                                </span>
                                                              )}
                                                            </Link>
                                    
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}

export default MyTeachers

