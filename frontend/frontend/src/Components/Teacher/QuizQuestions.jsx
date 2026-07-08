import { baseUrl } from '../../config';




import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TeacherSidebar from "./TeacherSidebar";
import { Link, useParams } from "react-router-dom";
import "./glass.css";
const QuizQuestions = () => {
  const { quiz_id } = useParams();
  const [questions, setQuestions] = useState([]);

  const loadQuestions = async () => {
    const res = await axios.get(`${baseUrl}/quiz-questions/${quiz_id}`);
    setQuestions(res.data);
  };

  useEffect(() => { loadQuestions(); }, [quiz_id]);

  const deleteQuestion = async (qid) => {
    Swal.fire({title:"Delete?",showCancelButton:true}).then(async(r)=>{
      if(r.isConfirmed){
        await axios.delete(`${baseUrl}/question/${qid}`);
        loadQuestions();
      }
    });
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        <aside className="col-md-3"><TeacherSidebar/></aside>
        <section className="col-md-9">
          <div className="glass-card">
            <h5 className="mb-3">Questions</h5>
            <table className="table table-bordered">
              <tbody>
                {questions.map(row => (
                  <tr key={row.id}>
                    <td>{row.questions}</td>
                    <td>
                      <Link to={`/edit-question/${row.id}`} className="btn btn-info btn-sm me-1">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteQuestion(row.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizQuestions;
