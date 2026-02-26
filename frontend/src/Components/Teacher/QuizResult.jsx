import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TeacherSidebar from "./TeacherSidebar";
import { useParams } from "react-router-dom";
import "./QuizResult.css";



/* ===== Chart.js ===== */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const baseUrl = "http://127.0.0.1:8000/api";

const QuizResult = () => {
  const { quiz_id, student_id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!quiz_id || !student_id) return;

    axios
      .get(`${baseUrl}/fetch-quiz-result/${quiz_id}/${student_id}/`)
      .then(res => setResult(res.data))
      .catch(err => console.log(err));
  }, [quiz_id, student_id]);

  if (!result) return <h4 className="text-center text-white">Loading...</h4>;

  /* ===== Calculations ===== */
  const percentage = Math.round(
    (result.total_correct_questions / result.total_questions) * 100
  );

  const isPass = percentage >= 40;

  /* ===== Bar Chart Data ===== */
  const barData = {
    labels: ["Correct", "Wrong", "Unattempted"],
    datasets: [
      {
        label: "Questions",
        data: [
          result.total_correct_questions,
          result.total_wrong_questions,
          result.total_unattempted
        ],
        backgroundColor: ["#00e676", "#ff5252", "#ffea00"],
        borderRadius: 8,
        barThickness: 45
      }
    ]
  };

  /* ===== Bar Chart Options ===== */
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold"
          }
        }
      },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.8)"
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: "bold"
          }
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      },
      y: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: "bold"
          },
          stepSize: 1
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      }
    }
  };

  /* ===== Download PDF ===== */
  const downloadPDF = () => {
    const input = document.getElementById("resultBox");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quiz_Result_${student_id}.pdf`);
    });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-12">
          {/* <div id="resultBox"> */}
<div id="resultBox" className="result-wrapper">

       <div className="row justify-content-center mb-4">
  <div className="col-md-8 text-center result-shift-right">
    <h3 className="text-white mb-3">Quiz Result</h3>

    <h4 className="score-text">
      Score: <span>{percentage}%</span>
    </h4>

    <h5 className={isPass ? "pass-glow" : "fail-glow"}>
      {isPass ? "PASS ✅" : "FAIL ❌"}
    </h5>
  </div>
</div>


            {/* ===== Cards Row ===== */}
           {/* <div className="row g-4 justify-content-start"> */}

<div className="row g-4 justify-content-center align-items-stretch">

              {/* ===== Chart Card ===== */}
              <div className="col-md-6">
                <div className="glass-card chart-card">
                  <h5 className="text-white text-center mb-3">
                    Performance Chart
                  </h5>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>

              {/* ===== Table Card ===== */}
              <div className="col-md-6">
                <div className="glass-card chart_card ">
                  <h5 className="text-white text-center mb-3">
                    Result Summary
                  </h5>

                  <table className="table table-bordered table-dark table-glass">
                    <tbody>
                      <tr>
                        <td>Total Questions</td>
                        <td>{result.total_questions}</td>
                      </tr>
                      <tr>
                        <td>Attempted</td>
                        <td>{result.total_attempted_questions}</td>
                      </tr>
                      <tr>
                        <td>Correct</td>
                        <td className="text-success">
                          {result.total_correct_questions}
                        </td>
                      </tr>
                      <tr>
                        <td>Wrong</td>
                        <td className="text-danger">
                          {result.total_wrong_questions}
                        </td>
                      </tr>
                      <tr>
                        <td>Unattempted</td>
                        <td>{result.total_unattempted}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* ===== Download Button ===== */}
           <div className="row justify-content-center">
  <div className="col-md-8 text-center result-shift-right">
    <button className="glass-btn mt-3" onClick={downloadPDF}>
      Download PDF
    </button>
  </div>
</div>



          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizResult;
