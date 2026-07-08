import { baseUrl } from '../../config';
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf"
// import "./certificate.css";
// import logo from "../../assets/logo.png";
// import watermark from "../../assets/watermark.png";
// import seal from "../../assets/seal.jpeg";
// import { QRCodeCanvas } from "qrcode.react";




// const baseUrl = baseUrl;

// const CertificateGenerator = () => {
//   const { studentId, courseId } = useParams();
//   const certRef = useRef();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${baseUrl}/certificate-status/${studentId}/${courseId}/`)
//       .then((res) => {
//         setData({
//           student_name: res.data.student_name,
//           course_title: res.data.course_title,
//           certificate_id: res.data.certificate_id,
//           issue_date: res.data.issue_date,
//           teacher_name: res.data.teacher_name, // Mentor
//         });
//       })
//       .catch(() => alert("Failed to load certificate"));
//   }, [studentId, courseId]);

//   const downloadPDF = async () => {
//     const canvas = await html2canvas(certRef.current, { scale: 3 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "px", [1123, 794]);
//     pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
//     pdf.save(`${data.student_name}-certificate.pdf`);
//   };

//   if (!data) return <h3 style={{ textAlign: "center" }}>Loading Certificate...</h3>;

//   return (
//     <div className="cert-page">
//    <div className="certificate" ref={certRef}>

//   {/* Watermark Background */}
//   <img src={watermark} alt="watermark" className="watermark" />

//   {/* Top Right Logo */}
//   <img src={logo} alt="Logo" className="cert-logo-img" />

//   <div className="cert-title">
//     COURSE <br /> COMPLETION CERTIFICATE
//   </div>

//   <div className="cert-sub">This certificate certifies that</div>

//   <div className="cert-name">{data.student_name}</div>

//   <div className="cert-text">
//     has successfully completed the course <b>{data.course_title}</b>.
//     The candidate actively contributed to assigned tasks and completed
//     the designated project with dedication and consistency.
//   </div>

//   {/* Seal */}
//   <img src={seal} alt="seal" className="seal-img" />

//   {/* Mentor */}
//   <div className="cert-mentor">
//     <div className="mentor-name">{data.teacher_name}</div>
//     <div className="mentor-role">Mentor</div>
//   </div>

//   <div className="cert-footer">
//     <div>
//       Certificate ID: {data.certificate_id}<br />
//       Issue Date: {data.issue_date}
//     </div>
//   </div>

// <div className="cert-qr">
//   <QRCodeCanvas
//     value={`https://yourdomain.com/verify/${data.certificate_id}`}
//     size={80}
//   />
// </div>


// </div>


//       <button className="download-btn" onClick={downloadPDF}>
//         🎓 Download Certificate
//       </button>
//     </div>
//   );
// };

// export default CertificateGenerator;

import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificate.css";
import logo from "../../assets/logo.png";
import seal from "../../assets/Batch.png";
const CertificateGenerator = () => {
  const { studentId, courseId } = useParams();
  const certRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/certificate-status/${studentId}/${courseId}/`)
      .then((res) => {
        setData({
          student_name: res.data.student_name,
          course_title: res.data.course_title,
          issue_date: res.data.issue_date,
        });
      })
      .catch(() => alert("Failed to load certificate"));
  }, [studentId, courseId]);

  const downloadPDF = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "px", [1123, 794]);
    pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
    pdf.save(`${data.student_name}-certificate.pdf`);
  };

  if (!data) return <h3>Loading Certificate...</h3>;

  return (
    <div className="cert-page">
      <div className="certificate" ref={certRef}>

        <img src={logo} alt="logo" className="cert-logo-img" />

        <div className="cert-content">
          <div className="cert-title">
            COURSE<br />COMPLETION CERTIFICATE
          </div>

          <div className="cert-sub">This certificate certify that</div>

          <div className="cert-name">{data.student_name}</div>

          <div className="cert-text">
            has completed an <b>{data.course_title}</b> course.<br /><br />
            The candidate actively contributed to the assigned tasks and
            successfully completed the designated project during the course.<br /><br />
            We appreciate the enthusiasm, dedication, and consistent efforts
            shown throughout the program.
          </div>
        </div>

        {/* FOOTER */}
        <div className="cert-footer-fixed">
          <div className="sign-block">
            <div className="sign-script">Vinoth A</div>
            <div className="sign-role">MANAGING DIRECTOR</div>
          </div>

          <div className="sign-center">
            <img src={seal} alt="seal" />
            <div className="sign-date">{data.issue_date}</div>
          </div>

          <div className="sign-block">
            <div className="sign-script">Vasumathi R</div>
            <div className="sign-role">MENTOR</div>
          </div>
        </div>

      </div>

      <button className="download-btn" onClick={downloadPDF}>
        🎓 Download Certificate
      </button>
    </div>
  );
};

export default CertificateGenerator;
