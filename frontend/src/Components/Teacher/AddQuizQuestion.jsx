import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api";

const AddQuizQuestion = () => {
  const { quiz_id } = useParams();

  const [questionType, setQuestionType] = useState("mcq");

  const [questionData, setQuestionData] = useState({
    questions: "",
    ans1: "",
    ans2: "",
    ans3: "",
    ans4: "",
    right_ans: "",
    coding_starter_code: "",
    coding_solution: "",
  });

  const [voicePrompt, setVoicePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const chatToken =
    localStorage.getItem("chatAuthTokenTeacher") ||
    localStorage.getItem("chatAuthToken");

  useEffect(() => {
    document.title = "LMS | Add Quiz Question";
  }, []);

  const handleChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const applyGeneratedQuestion = async (data) => {
    let previewHTML = `<p><b>Q:</b> ${data.questions}</p>`;

    if (questionType === "mcq") {
      previewHTML += `
        <p>1️⃣ ${data.ans1}</p>
        <p>2️⃣ ${data.ans2}</p>
        <p>3️⃣ ${data.ans3}</p>
        <p>4️⃣ ${data.ans4}</p>
        <p><b>Correct:</b> ${data.right_ans}</p>
      `;
    } else {
      previewHTML += `
        <p><b>Starter Code:</b></p>
        <pre>${data.coding_starter_code}</pre>
        <p><b>Solution:</b></p>
        <pre>${data.coding_solution}</pre>
      `;
    }

    const result = await Swal.fire({
      title: "Apply Generated Question?",
      html: previewHTML,
      width: 700,
      showCancelButton: true,
      confirmButtonText: "Apply",
    });

    if (result.isConfirmed) {
      setQuestionData(data);
    }
  };

  const generateQuestion = async () => {
    if (!chatToken) {
      Swal.fire("Login Required", "", "warning");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await axios.post(
        `${baseUrl}/quiz/generate-single/`,
        {
          quiz_id: quiz_id,
          prompt: voicePrompt || "Generate basic level question",
          question_type: questionType,
        },
        {
          headers: {
            Authorization: `Bearer ${chatToken}`,
          },
        }
      );

      await applyGeneratedQuestion(res.data);

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "AI generation failed";

      Swal.fire("Error", msg, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const formSubmit = async () => {
    const formData = new FormData();
    formData.append("quiz", quiz_id);
    formData.append("question_type", questionType);
    formData.append("questions", questionData.questions);

    if (questionType === "mcq") {
      formData.append("ans1", questionData.ans1);
      formData.append("ans2", questionData.ans2);
      formData.append("ans3", questionData.ans3);
      formData.append("ans4", questionData.ans4);
      formData.append("right_ans", questionData.right_ans);
    } else {
      formData.append("coding_starter_code", questionData.coding_starter_code);
      formData.append("coding_solution", questionData.coding_solution);
    }

    try {
      const res = await axios.post(`${baseUrl}/quiz-questions/`, formData);

      if (res.status === 201) {
        Swal.fire("Saved!", "Question added successfully", "success");
      }
    } catch {
      Swal.fire("Error", "Failed to save question", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3>Add Question</h3>

        {/* Question Type Selector */}
        <select
          className="form-control mb-3"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="mcq">MCQ</option>
          <option value="coding">Coding</option>
        </select>

        {/* AI Prompt */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter instruction (e.g., generate easy question)"
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />

        <button
          onClick={generateQuestion}
          className="btn btn-info mb-3"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "AI Generate"}
        </button>

        {/* Question Text */}
        <textarea
          name="questions"
          value={questionData.questions}
          onChange={handleChange}
          placeholder="Question"
          className="form-control mb-3"
        />

        {/* MCQ Fields */}
        {questionType === "mcq" && (
          <>
            <input name="ans1" value={questionData.ans1} onChange={handleChange} placeholder="Answer 1" className="form-control mb-2" />
            <input name="ans2" value={questionData.ans2} onChange={handleChange} placeholder="Answer 2" className="form-control mb-2" />
            <input name="ans3" value={questionData.ans3} onChange={handleChange} placeholder="Answer 3" className="form-control mb-2" />
            <input name="ans4" value={questionData.ans4} onChange={handleChange} placeholder="Answer 4" className="form-control mb-2" />
            <input name="right_ans" value={questionData.right_ans} onChange={handleChange} placeholder="Right Answer" className="form-control mb-3" />
          </>
        )}

        {/* Coding Fields */}
        {questionType === "coding" && (
          <>
            <textarea
              name="coding_starter_code"
              value={questionData.coding_starter_code}
              onChange={handleChange}
              placeholder="Starter Code"
              className="form-control mb-2"
              rows={4}
            />
            <textarea
              name="coding_solution"
              value={questionData.coding_solution}
              onChange={handleChange}
              placeholder="Solution Code"
              className="form-control mb-3"
              rows={4}
            />
          </>
        )}

        <button onClick={formSubmit} className="btn btn-primary">
          Save Question
        </button>
      </div>
    </div>
  );
};

export default AddQuizQuestion;