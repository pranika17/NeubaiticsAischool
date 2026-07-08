import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Me.css";

const baseUrl = "http://127.0.0.1:8000/api";

const MiniVideoPlayer = () => {
  const { course_id } = useParams();
  const studentId = localStorage.getItem("studentId");

  const videoRef = useRef(null);

  // ✅ Prevent API spamming
  const lastSentRef = useRef(0);
  const completedSentRef = useRef(false);

  const [chapters, setChapters] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const [enrolled, setEnrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Progress map for playlist status badge
  const [progressMap, setProgressMap] = useState({});

  // ===============================
  // ✅ Load Chapter Progress
  // ===============================
  const loadChapterProgress = async () => {
    if (!studentId || !course_id) return;

    try {
      const res = await axios.get(
        `${baseUrl}/chapter-progress/${studentId}/${course_id}/`
      );
      setProgressMap(res.data.progress_map || {});
    } catch (err) {
      console.log("Progress fetch error:", err);
    }
  };

  // ===============================
  // ✅ Load Course + Enrollment
  // ===============================
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "LMS | Video Learning";

    // ✅ Login check
    if (localStorage.getItem("studentLoginStatus") === "true") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      return;
    }

    // ✅ Load course chapters
    axios
      .get(`${baseUrl}/course/${course_id}`)
      .then((res) => {
        const courseChapters = res.data.course_chapters || [];
        setChapters(courseChapters);
        setCurrentVideo(courseChapters?.[0] || null);
      })
      .catch((err) => console.log("Course fetch error:", err));

    if (studentId) {
  axios
    .get(`${baseUrl}/fetch-enroll-status/${studentId}/${course_id}`)
    .then((res) => {

      const status = res.data.status;

      if (status === "approved") {
        setEnrolled(true);
        loadChapterProgress();
      } else {
        setEnrolled(false);
      }

    })
    .catch((err) => console.log("Enroll status error:", err));
}

    // eslint-disable-next-line
  }, [course_id, studentId]);

  // ===============================
  // ✅ Enroll Course
  // ===============================
  const enrollCourse = () => {
    axios
      .post(`${baseUrl}/student-enroll-course/`, {
        course_id: Number(course_id),
        student_id: Number(studentId),
      })
      .then(() => {
        Swal.fire({
          title: "Enrolled Successfully!",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });
        setEnrolled(true);

        // ✅ load progress after enroll
        loadChapterProgress();
      })
      .catch((err) => {
        console.log("Enroll error:", err);
        Swal.fire("Error", "Enrollment failed!", "error");
      });
  };

  // ===============================
  // ✅ Video Controls
  // ===============================
  const rewind10 = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const forward10 = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  // ===============================
  // ✅ Send progress to backend
  // ===============================
  const sendProgressToBackend = async (
    chapterId,
    watchedSeconds,
    durationSeconds
  ) => {
    if (!studentId || !chapterId) return;

    try {
      await axios.post(`${baseUrl}/save-video-progress/`, {
        student_id: studentId,
        chapter_id: chapterId,
        watched_seconds: watchedSeconds,
        duration_seconds: durationSeconds,
      });
    } catch (err) {
      console.log("Progress Save Error:", err);
    }
  };

  // ===============================
  // ✅ Runs while playing (95% rule + 10sec update)
  // ===============================
 const handleTimeUpdate = async () => {

    if (!videoRef.current || !currentVideo) return;

    const currentTime = Math.floor(videoRef.current.currentTime || 0);
    const duration = Math.floor(videoRef.current.duration || 0);

    // ✅ send progress only every 10 seconds
    if (currentTime - lastSentRef.current >= 10) {
      lastSentRef.current = currentTime;
      sendProgressToBackend(currentVideo.id, currentTime, duration);
    }

    // ✅ 95% completion rule
    if (duration > 0) {
      const percent = (currentTime / duration) * 100;

    if (percent >= 95 && !completedSentRef.current) {
  completedSentRef.current = true;

  // ✅ Wait for backend save
  await sendProgressToBackend(currentVideo.id, duration, duration);

  // ✅ Instantly update UI (no refresh needed)
  setProgressMap(prev => ({
    ...prev,
    [currentVideo.id]: {
      is_completed: true,
      watched_seconds: duration
    }
  }));

  Swal.fire({
    title: "✅ Video Completed!",
    text: "This chapter is marked completed.",
    icon: "success",
    toast: true,
    position: "top-right",
    timer: 2500,
    showConfirmButton: false,
  });
}

    }
  };

  // ===============================
  // ✅ Change Video and Reset Tracking
  // ===============================
  const changeVideo = (chapter) => {
    setCurrentVideo(chapter);

    // ✅ Reset for new video
    lastSentRef.current = 0;
    completedSentRef.current = false;

    // ✅ reset playback to 0
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // ===============================
  // ✅ UI Handling
  // ===============================
  if (!loggedIn) {
    return <div className="center-msg">Please login to watch this course</div>;
  }

  if (!enrolled) {
    return (
      <div className="center-msg">
        <h4>You are not enrolled in this course</h4>
        <button className="btn-enroll" onClick={enrollCourse}>
          Enroll Now
        </button>
      </div>
    );
  }

  // ===============================
  // ✅ Playlist Badge helper
  // ===============================
  const getChapterBadge = (chapterId) => {
    const prog = progressMap[String(chapterId)];
    const isCompleted = prog?.is_completed;
    const watchedSeconds = prog?.watched_seconds || 0;

    if (isCompleted) {
      return (
        <span className="badge bg-success rounded-pill mt-1">
          ✅ Completed
        </span>
      );
    }

    if (watchedSeconds > 0) {
      return (
        <span className="badge bg-warning text-dark rounded-pill mt-1">
          ⏳ In Progress
        </span>
      );
    }

    return (
      <span className="badge bg-secondary rounded-pill mt-1">
        🔒 Not Started
      </span>
    );
  };

  return (
    <div className="video-page">
      <div className="video-layout">
        {/* LEFT VIDEO */}
        <div className="video-left">
          {currentVideo ? (
            <>
              <video
                ref={videoRef}
                key={currentVideo.id}
                src={currentVideo.video_stream_url || currentVideo.video_url || currentVideo.video}
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="main-video"
                onTimeUpdate={handleTimeUpdate}
              />

              <div className="video-controls">
                <button onClick={rewind10}>⏪ 10s</button>
                <button onClick={forward10}>⏩ 10s</button>
              </div>

              <h2 className="video-title">{currentVideo.title}</h2>

              <div className="video-desc">
                {currentVideo.description || "No description available"}
              </div>
            </>
          ) : (
            <h5 className="text-white">No chapter videos found</h5>
          )}
        </div>

        {/* RIGHT PLAYLIST */}
        <div className="video-right">
          <h3 className="playlist-heading">Course Content</h3>

          {chapters.length > 0 ? (
            chapters.map((ch, index) => (
              <div
                key={ch.id}
                className={`playlist-item ${
                  currentVideo?.id === ch.id ? "active" : ""
                }`}
                onClick={() => changeVideo(ch)}
              >
                <div className="playlist-thumb">
                  <video src={ch.video_stream_url || ch.video_url || ch.video} muted />
                </div>

                <div className="playlist-info">
                  <h4>
                    {index + 1}. {ch.title}
                  </h4>

                  <p>{ch.remarks || "Lesson video"}</p>

                  {/* ✅ Status Badge */}
                  {getChapterBadge(ch.id)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No chapters added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniVideoPlayer;
