// import React from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'

// const baseUrl='http://127.0.0.1:8000/api'

// const CheckQuizStatusStudent = (props) => {
//     useEffect(()=>{
//         document.title='LMS | All Quiz'
//       })

//       const [quizData, setQuizData]=useState([]);
//       const studentId=localStorage.getItem('studentId');

//       useEffect(()=>{
//         try{
//             axios.get(`${baseUrl}/fetch-quiz-attempt-status/${props.quiz}/${props.student}`)
//             .then((res)=>{
//                 setQuizData(res.data)
//             });
//         }catch(error){
//             console.log(error)
//         }
    
//     },[]);

//   return (
//     <td>
//         {quizData.bool=true && 
//             <Link className='btn btn-success btn-sm ms-2' to={`/take-quiz/${props.quiz}`}>Take Quiz</Link>
//         }
//     </td>
//   )
// }

// export default CheckQuizStatusStudent




import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const baseUrl='http://127.0.0.1:8000/api'

const CheckQuizStatusStudent = (props) => {
    useEffect(()=>{
        document.title='LMS | All Quiz'
      }, [])

      const [quizData, setQuizData]=useState({ bool: false });

      useEffect(()=>{
        if (!props.student) return;

        try{
            axios.get(`${baseUrl}/fetch-quiz-attempt-status/${props.quiz}/${props.student}`)
            .then((res)=>{
                setQuizData(res.data)
            });
        }catch(error){
            console.log(error)
        }
    
    },[props.quiz, props.student]);

  return (
    <td>
        {!quizData.bool && (
            <Link className='btn btn-success btn-sm ms-2' to={`/take-quiz/${props.quiz}`}>Take Quiz</Link>
        )}
        {quizData.bool && (
            <Link className='btn btn-outline-primary btn-sm ms-2' to={`/quiz-result/${props.quiz}/${props.student}`}>View Result</Link>
        )}
        {quizData.error && (
            <span className='text-danger ms-2'>{quizData.error}</span>
        )}
    </td>
  )
}

export default CheckQuizStatusStudent



