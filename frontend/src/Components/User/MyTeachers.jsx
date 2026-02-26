



import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const baseUrl='http://127.0.0.1:8000/api'

const MyTeachers = () => {

    const studentId=localStorage.getItem('studentId')
    const [teacherData,setteacherData]=useState([])

    useEffect(()=>{
        try{
            axios.get(baseUrl+'/fetch-my-teachers/'+studentId)
            .then((res)=>{
                setteacherData(res.data)
            });
        }catch(error){
            console.log(error)
        }
      },[]);

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
    <div className='container mt-4'>
        <div className='row'>
            {/* <aside className='col-md-3'>
                <Sidebar />
            </aside> */}
            <section className='col-md-9'>
                <div className='card'>
                    <h5 className='card-header'><i class="bi bi-person-check-fill"/> My Teachers</h5>
                    <div className='card-body  table-responsive'>
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th  className='text-center'>Instructer</th>
                                    <th className='text-center'>Name</th>
                                    <th className='text-center'>Chat</th>
                                </tr>
                            </thead>
                            <tbody>
                            {teacherData.map((row,index) =>
                                <tr>
                                    <td  className='text-center'><Link to={`/teacher-detail/`+row.teacher.id}><img
  className='imgmeet'
  src={row.teacher.image_url ? row.teacher.image_url : '/default-avatar.png'}
  alt={row.teacher.full_name}
/>
</Link></td>
                                    <td className='text-center'><Link to={`/teacher-detail/`+row.teacher.id}>{row.teacher.full_name}</Link></td>
                                    <td className='text-center'> <Link
                                
                                                              to={`/student/chat/${studentId}/${row.teacher.id}`}
                                                              className="btn btn-success btn-sm"
                                                              onClick={(e) => e.stopPropagation()}
                                                            >
                                                              <i className="bi bi-whatsapp"></i>
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

