// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "./Sidebar";
// import './StudentChatBox.css';
// const baseUrl = "http://127.0.0.1:8000/api";

// const StudentChatBox = () => {
//   const { teacherId } = useParams();
//   const studentId = localStorage.getItem("studentId");

//   const [chatData, setChatData] = useState([]);
//   const [teacherName, setTeacherName] = useState("");
//   const [msg, setMsg] = useState("");
//   const [image, setImage] = useState(null);
//   const scrollRef = useRef();

//   const fetchChats = () => {
//     axios
//       .get(`${baseUrl}/chat/individual/${teacherId}/${studentId}/`) // same endpoint
//       .then((res) => setChatData(res.data))
//       .catch((err) => console.error(err));
//   };

//   const fetchTeacherName = () => {
//     axios
//       .get(`${baseUrl}/student/chat-dashboard/${studentId}/`)
//       .then((res) => {
//         const teacher = res.data.individuals.find(
//           (t) => t.id === parseInt(teacherId)
//         );
//         if (teacher) setTeacherName(teacher.name);
//       })
//       .catch((err) => console.error(err));
//   };

//   useEffect(() => {
//     fetchChats();
//     fetchTeacherName();
//   }, [teacherId]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatData]);

//   const sendMessage = () => {
//     if (!msg && !image) return;

//     const formData = new FormData();
//     formData.append("teacher", teacherId);
//     formData.append("student", studentId);
//     formData.append("sender", "student"); // important
//     if (msg) formData.append("message", msg);
//     if (image) formData.append("image", image);

//     axios
//       .post(`${baseUrl}/chat/individual/send/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then(() => {
//         setMsg("");
//         setImage(null);
//         fetchChats();
//       });
//   };

//   const deleteMessage = (id) => {
//     axios
//       .delete(`${baseUrl}/chat/individual/delete/${id}/`)
//       .then(() => fetchChats())
//       .catch((err) => console.error(err));
//   };

//   return (


//     <div className="container mt-4 teacher-page">
//               <div className="row">
//                 <aside className="col-md-3">
//                   <Sidebar />
//                 </aside>
// <section className="col-md-9">
//     <div className="container mt-4 teacher-page">
//      <div className="card shadow rounded student-chat">

//         <div className="card-header bg-primary text-white">
//           <h5 className="mb-0">{teacherName || "Loading..."}</h5>
//         </div>

//         <div
//           className="card-body bg-light d-flex flex-column"
//           style={{ height: "70vh", overflowY: "auto" }}
//         >
//           {chatData.map((chat, index) => {
//             const isLast = index === chatData.length - 1;
//             return (
//               <div
//                 key={chat.id}
//                 className={`d-flex mb-2 ${
//                   chat.sender === "student"
//                     ? "justify-content-end"
//                     : "justify-content-start"
//                 }`}
//                 ref={isLast ? scrollRef : null}
//               >
//                 <div
//                   className={`p-2 rounded shadow-sm position-relative ${
//                     chat.sender === "student"
//                       ? "bg-primary text-white"
//                       : "bg-white text-dark border"
//                   }`}
//                   style={{ maxWidth: "70%", wordWrap: "break-word" }}
//                 >
//                   {chat.message && <div>{chat.message}</div>}
//                   {chat.image && (
//                     <img
//                       src={chat.image}
//                       alt="sent"
//                       className="img-fluid rounded mt-1"
//                     />
//                   )}

//                   {/* Seen tick for student */}
//                   {chat.sender === "student" && (
//                     <span
//                       style={{
//                         fontSize: "12px",
//                         color: "#d1e7dd",
//                         position: "absolute",
//                         bottom: "2px",
//                         right: "5px",
//                       }}
//                     >
//                       {chat.is_read ? "✔✔" : "✔"}
//                     </span>
//                   )}

//                   {/* Delete button for student messages */}
//                   {chat.sender === "student" && (
//                     <button
//                       className="btn btn-sm btn-danger"
//                       style={{
//                         position: "absolute",
//                         top: "-5px",
//                         right: "-35px",
//                         fontSize: "12px",
//                         padding: "2px 6px",
//                       }}
//                       onClick={() => deleteMessage(chat.id)}
//                     >
//                       🗑
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="card-footer bg-white d-flex align-items-center gap-2">
//           <input
//             type="file"
//             className="form-control form-control-sm"
//             style={{ maxWidth: "100px" }}
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//           <input
//             type="text"
//             className="form-control rounded-pill"
//             placeholder="Type a message..."
//             value={msg}
//             onChange={(e) => setMsg(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button
//             className="btn btn-primary rounded-circle px-3"
//             onClick={sendMessage}
//           >
//             Send
//           </button>
//           <button class="emoji-btn">😊</button>

//         </div>
//       </div>
//     </div>
//     </section>
//     </div>
//     </div>
//   );
// };

// export default StudentChatBox;
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./StudentChatBox.css";

const baseUrl = "http://127.0.0.1:8000/api";

const StudentChatBox = () => {
  const { teacherId } = useParams();
  const studentId = localStorage.getItem("studentId");

  const [chatData, setChatData] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [teacherImage, setTeacherImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chats
  const fetchChats = () => {
    axios
      .get(`${baseUrl}/chat/individual/${teacherId}/${studentId}/`)
      .then((res) => setChatData(res.data))
      .catch(console.error);
  };

  // Fetch teacher info
  const fetchTeacherName = () => {
    axios
      .get(`${baseUrl}/student/chat-dashboard/${studentId}/`)
      .then((res) => {
        const teacher = res.data.individuals.find(
          (t) => t.id === parseInt(teacherId)
        );
        if (teacher) {
          setTeacherName(teacher.name);
          setTeacherImage(teacher.profile_img);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchChats();
    fetchTeacherName();
  }, [teacherId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  // Auto-expand textarea
  const handleInputChange = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Send message
  const sendMessage = () => {
    if (!msg && !image) return;

    const formData = new FormData();
    formData.append("teacher", teacherId);
    formData.append("student", studentId);
    formData.append("sender", "student");
    if (msg) formData.append("message", msg);
    if (image) formData.append("image", image);

    axios
      .post(`${baseUrl}/chat/individual/send/`, formData)
      .then(() => {
        setMsg("");
        setImage(null);
        setShowEmoji(false);
        if (inputRef.current) inputRef.current.style.height = "40px";
        fetchChats();
      });
  };

  const deleteMessage = (id) => {
    axios
      .delete(`${baseUrl}/chat/individual/delete/${id}/`)
      .then(fetchChats);
  };

  return (
    <div className="container-fluid chat-page">
      <div className="row h-100">
        {/* <aside className="col-md-3">
          <Sidebar />
        </aside> */}

        <section className="col-md-9">
          <div className="glass-card chat-wrapper">
            {/* HEADER */}
            <div className="chat-header">
              <div className="chat-profile">
                <div className="avatar">
                  <img
                    src={
                      teacherImage
                        ? `http://127.0.0.1:8000${teacherImage}`
                        : "/default-avatar.png"
                    }
                    alt={teacherName}
                  />
                </div>
                <span className="student-name">
                  {teacherName || "Loading..."}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="chat-body">
              {chatData.map((chat, index) => {
                const isLast = index === chatData.length - 1;
                const isStudent = chat.sender === "student";

                return (
                  <div
                    key={chat.id}
                    ref={isLast ? scrollRef : null}
                    className={`chat-row ${
                      isStudent ? "chat-right" : "chat-left"
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        isStudent ? "student-msg" : "teacher-msg"
                      }`}
                    >
                      {chat.message && (
                        <div className="chat-text">{chat.message}</div>
                      )}

                      {chat.image && (
                        <img
                          src={chat.image}
                          alt="sent"
                          className="chat-image"
                        />
                      )}

                      <div
                        className="msg-actions"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === chat.id ? null : chat.id
                          )
                        }
                      >
                        ⋮
                        {openMenuId === chat.id && (
                          <div className="msg-menu">
                            {isStudent && (
                              <button onClick={() => deleteMessage(chat.id)}>
                                🗑 Delete
                              </button>
                            )}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  chat.message || ""
                                )
                              }
                            >
                              📋 Copy
                            </button>
                          </div>
                        )}
                      </div>

                      {isStudent && (
                        <span className="seen-tick">
                          {chat.is_read ? "✔✔" : "✔"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="chat-footer">
              <button
                className="btn attach-btn"
                onClick={() => document.getElementById("fileInput").click()}
              >
                +
              </button>

              <input
                type="file"
                id="fileInput"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />

              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Type a message..."
                value={msg}
                onChange={handleInputChange}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), sendMessage())
                }
              />

              <button
                className="emoji-btn"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                😊
              </button>

              <button className="btn chat-send-btn" onClick={sendMessage}>
                Send
              </button>

              {showEmoji && (
                <div className="emoji-box">
                  <Picker
                    data={data}
                    onEmojiSelect={(e) =>
                      setMsg((prev) => prev + e.native)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentChatBox;
