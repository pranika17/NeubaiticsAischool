import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config";
import "./StudentInterview.css";

const StudentInterviewReport = () => {
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    document.title = "LMS | Interview Report";
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/interview/report/${interviewId}/`);
        setReport(res.data);
      } catch (error) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [interviewId]);

  if (loading) {
    return <div className="student-interview-empty">Loading interview report...</div>;
  }

  if (!report) {
    return <div className="student-interview-empty">Interview report not found.</div>;
  }

  if (report.status !== "completed") {
    return (
      <div className="student-interview-report">
        <div className="student-interview-empty">
          This interview is still in progress. Complete all questions to generate the result.
        </div>
        <div className="student-interview-session-actions">
          <Link to={`/mock-interview/session/${report.id}`} className="student-interview-btn">
            Resume Interview
          </Link>
          <Link to="/mock-interviews" className="student-interview-btn secondary">
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="student-interview-report">
      <div className="student-interview-hero">
        <div>
          <h3>{report.course_title} Interview Report</h3>
          <p>{report.ai_summary || "AI-evaluated interview summary."}</p>
        </div>
        <div className="student-interview-hero-chip">
          <i className="bi bi-award"></i>
          <span>Overall Score {report.overall_score || 0}</span>
        </div>
      </div>

      <div className="student-interview-report-grid">
        <div className="student-report-stat">
          <span>Intro</span>
          <strong>{report.score_intro || 0}</strong>
        </div>
        <div className="student-report-stat">
          <span>Technical</span>
          <strong>{report.score_technical || 0}</strong>
        </div>
        <div className="student-report-stat">
          <span>Coding</span>
          <strong>{report.score_coding || 0}</strong>
        </div>
        <div className="student-report-stat">
          <span>Communication</span>
          <strong>{report.score_communication || 0}</strong>
        </div>
      </div>

      <div className="student-report-summary-grid">
        <div className="student-report-panel">
          <h5>Strengths</h5>
          <p>{report.strengths || "No strengths summary available."}</p>
        </div>
        <div className="student-report-panel">
          <h5>Weaknesses</h5>
          <p>{report.weaknesses || "No weaknesses summary available."}</p>
        </div>
        <div className="student-report-panel">
          <h5>Improvement Plan</h5>
          <p>{report.improvement_plan || "No improvement plan available."}</p>
        </div>
        <div className="student-report-panel">
          <h5>Recommended Topics</h5>
          <p>{report.recommended_topics || "No recommended topics available."}</p>
        </div>
      </div>

      <div className="student-report-answers">
        <h4>Question Review</h4>
        {(report.answers || []).map((item) => (
          <div key={item.id} className="student-answer-card">
            <div className="student-answer-round">{item.question?.round_type}</div>
            <h5>{item.question?.question_text}</h5>
            <p><strong>Your answer:</strong> {item.answer_text}</p>
            <p><strong>Your answer summary:</strong> {item.answer_summary || "Not available."}</p>
            <p><strong>Feedback:</strong> {item.feedback}</p>
            <p><strong>Improve:</strong> {item.improvement_tip}</p>
            <p><strong>Missing points:</strong> {item.missing_points || "No missing points listed."}</p>
            <p><strong>Better sample answer:</strong> {item.sample_answer || "No sample answer generated."}</p>
            <p><strong>Practice next:</strong> {item.suggested_followup}</p>
          </div>
        ))}
        {(!report.answers || report.answers.length === 0) && (
          <div className="student-interview-empty">No evaluated answers were saved for this interview.</div>
        )}
      </div>

      <div className="student-interview-session-actions">
        <Link to="/mock-interviews" className="student-interview-btn secondary">
          Back to Interviews
        </Link>
        <Link to={`/mock-interviews/${report.course}`} className="student-interview-btn">
          Start Another Round
        </Link>
      </div>
    </div>
  );
};

export default StudentInterviewReport;
