import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./TeacherSidebar";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherGroupChat() {
  const teacherId = localStorage.getItem("teacherId");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Fetch all group messages + replies
  const loadMessages = () => {
    axios
      .get(`${baseUrl}/teacher-group-messages/${teacherId}/`)
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Teacher sends new group message
  const sendGroupMessage = () => {
    const formData = new FormData();
    formData.append("msg_to", newMsg);
    formData.append("msg_from", "teacher");

    axios
      .post(`${baseUrl}/send-group-message/${teacherId}/`, formData)
      .then(() => {
        setNewMsg("");
        loadMessages(); // reload messages
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 teacher-page">
      <div className="row">

        <aside className="col-md-3">
          <Sidebar />
        </aside>

        <section className="col-md-9">
          <h3>Group Messages</h3>

          {/* Send new group message */}
          <div className="card p-3 mb-4 shadow-sm">
            <h5>Send New Group Message</h5>
            <textarea
              className="form-control mt-2"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type group message..."
            ></textarea>
            <button
              className="btn btn-primary mt-3"
              onClick={sendGroupMessage}
            >
              Send
            </button>
          </div>

          <hr />

          {/* Show messages + replies */}
          {messages.length === 0 ? (
            <p>No group messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="card mb-4 p-3 shadow-sm">
                <h5>📢 Group Message</h5>
                <p>{msg.msg_to}</p>
                <small className="text-muted">{msg.msg_time}</small>

                {/* Replies */}
                <div className="mt-3">
                  <h6>Replies:</h6>

                  {msg.replies.length === 0 ? (
                    <p className="text-muted">No replies yet</p>
                  ) : (
                    msg.replies.map((rep) => (
                      <div key={rep.id} className="border p-2 mb-2 rounded">
                        <strong>{rep.student_name}</strong>
                        <p className="m-0">{rep.msg_to}</p>
                        <small className="text-muted">{rep.msg_time}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default TeacherGroupChat;
