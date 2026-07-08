import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from '../../config';
import TeacherSidebar from "./TeacherSidebar";
const QuizLeaderboard = () => {
  const { quiz_id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/quiz-leaderboard/${quiz_id}/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [quiz_id]);

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">
        {/* <aside className="col-md-3">
          <TeacherSidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Quiz Leaderboard</h5>

            <div className="card-body">
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Attempted</th>
                    <th>Correct</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td>
                        {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : row.rank}
                      </td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.attempted}</td>
                      <td>{row.correct}</td>
                      <td>{row.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizLeaderboard;
