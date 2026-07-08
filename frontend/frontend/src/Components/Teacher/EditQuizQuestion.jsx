import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from '../../config';
import { useParams } from "react-router-dom";
const EditQuizQuestion = () => {
  const { question_id } = useParams();
  const [questionData, setQuestionData] = useState({
    questions: "",
    ans1: "",
    ans2: "",
    ans3: "",
    ans4: "",
    right_ans: "",
  });

  useEffect(() => {
    document.title = "Edit Question";
    fetchQuestion();
  }, []);

  const fetchQuestion = () => {
    
      axios.get(`${baseUrl}/quiz-question/${question_id}/`)

      .then((res) => {
        setQuestionData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = () => {
    const formData = new FormData();
    formData.append("questions", questionData.questions);
    formData.append("ans1", questionData.ans1);
    formData.append("ans2", questionData.ans2);
    formData.append("ans3", questionData.ans3);
    formData.append("ans4", questionData.ans4);
    formData.append("right_ans", questionData.right_ans);

    
      axios.put(`${baseUrl}/quiz-question/${question_id}/`, formData)

      .then((res) => {
        Swal.fire("Success", "Question Updated Successfully", "success");
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to update question", "error");
      });
  };

  return (
    <div className="container mt-4 ">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <div className="col-md-9">
          <div className="card">
            <h3 className="card-header">Edit Question</h3>
            <div className="card-body">

              <div className="mb-3">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  name="questions"
                  className="form-control"
                  value={questionData.questions}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Ans 1</label>
                <input
                  type="text"
                  name="ans1"
                  className="form-control"
                  value={questionData.ans1}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Ans 2</label>
                <input
                  type="text"
                  name="ans2"
                  className="form-control"
                  value={questionData.ans2}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Ans 3</label>
                <input
                  type="text"
                  name="ans3"
                  className="form-control"
                  value={questionData.ans3}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Ans 4</label>
                <input
                  type="text"
                  name="ans4"
                  className="form-control"
                  value={questionData.ans4}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Right Answer</label>
                <input
                  type="text"
                  name="right_ans"
                  className="form-control"
                  value={questionData.right_ans}
                  onChange={handleChange}
                />
              </div>

              <button className="btn btn-primary" onClick={submitForm}>
                Update Question
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuizQuestion;
