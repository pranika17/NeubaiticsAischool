// import React from 'react';
// import { Link, useParams } from 'react-router-dom'
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { FaLinkedin, FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="footer bg-dark text-white pt-5 position-relative">
//       <Container>
//         <Row>
//           {/* Address Section */}
//           <Col md={4} className="mb-2">
//             <h5>Address</h5>
//             <p className="mt-3">
//               <FaMapMarkerAlt className="me-2" />
//               2nd Floor, Platinum Jubilee Building,<br />
//               AC-Tech Campus, Anna University,<br />
//               Guindy, Chennai - 600025
//             </p>
//            <p>
//   <FaEnvelope className="me-2" />
//   <a
//     href="https://mail.google.com/mail/?view=cm&to=info@neubaitics.com"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-white text-decoration-none"
//   >
//     info@neubaitics.com
//   </a>
// </p>

//             <p>
//               <FaPhone className="me-2" />
//               +91 9791729777 &nbsp; +91 9791738777
//             </p>
//             <div className="d-flex gap-2 mt-2">
//               <a
//   href="https://www.linkedin.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaLinkedin />
// </a>

// <a
//   href="https://www.instagram.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaInstagram />
// </a>

// <a
//   href="https://twitter.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaTwitter />
// </a>

// <a
//   href="https://www.facebook.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaFacebook />
// </a>

// <a
//   href="https://www.youtube.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaYoutube />
// </a>

//             </div>
//           </Col>

//           {/* Quick Links */}
//           <Col md={4} className="mb-4">
//             <h5>Quick Links</h5>
//             <Row className="mt-3">
//               <Col xs={6}>
//                 <ul className="list-unstyled">
//                   <li>
//   <Link to="/" className="text-white text-decoration-none">Home</Link>
// </li>

//                   <li><a href="#" className="text-white text-decoration-none">Products</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Blog</a></li>
//                    <li><a href="/#about" className="text-white text-decoration-none">About Us</a></li>
//                    <li><a href="#" className="text-white text-decoration-none">Solutions</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Careers</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Refund Policy</a></li>
//                    <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Terms and Conditions</a></li>
                
//                   <li><a href="#" className="text-white text-decoration-none">Research & Development</a></li>
//                 </ul>
//               </Col>
           
//             </Row>
//           </Col>

//           {/* Newsletter */}
//           <Col md={4} className="mb-4">
//             <h5>Subscribe to our newsletter</h5>
//             <p className="mt-3">
//               Fill in your details to receive our monthly newsletter with news, thought leadership and a summary of our latest blog articles.
//             </p>
//             <Form className="d-flex">
//               <Form.Control type="email" placeholder="Email address" className="me-2" />
//               <Button variant="info">SUBSCRIBE</Button>
//             </Form>
//           </Col>
//         </Row>
//       </Container>

//       {/* Bottom bar */}
//       <div className="bg-info text-dark text-center py-2 mt-4">
//         <Container className="d-flex justify-content-between align-items-center flex-wrap">
//           <span>© 2024 NeubAltics Tech Pvt. Ltd, All Rights Reserved.</span>
//           <span>Website Developed by NeubAItics Tech Pvt. Ltd</span>
//         </Container>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// import React from 'react';
// import { Link, useParams } from 'react-router-dom'
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { FaLinkedin, FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="footer bg-dark text-white pt-5 position-relative">
//       <Container>
//         <Row>
//           {/* Address Section */}
//           <Col md={4} className="mb-2">
//             <h5>Address</h5>
//             <p className="mt-3">
//               <FaMapMarkerAlt className="me-2" />
//               2nd Floor, Platinum Jubilee Building,<br />
//               AC-Tech Campus, Anna University,<br />
//               Guindy, Chennai - 600025
//             </p>
//            <p>
//   <FaEnvelope className="me-2" />
//   <a
//     href="https://mail.google.com/mail/?view=cm&to=info@neubaitics.com"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-white text-decoration-none"
//   >
//     info@neubaitics.com
//   </a>
// </p>

//             <p>
//               <FaPhone className="me-2" />
//               +91 9791729777 &nbsp; +91 9791738777
//             </p>
//             <div className="d-flex gap-2 mt-2">
//               <a
//   href="https://www.linkedin.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaLinkedin />
// </a>

// <a
//   href="https://www.instagram.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaInstagram />
// </a>

// <a
//   href="https://twitter.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaTwitter />
// </a>

// <a
//   href="https://www.facebook.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaFacebook />
// </a>

// <a
//   href="https://www.youtube.com"
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-white fs-5 me-3"
// >
//   <FaYoutube />
// </a>

//             </div>
//           </Col>

//           {/* Quick Links */}
//           <Col md={4} className="mb-4">
//             <h5>Quick Links</h5>
//             <Row className="mt-3">
//               <Col xs={6}>
//                 <ul className="list-unstyled">
//                   <li>
//   <Link to="/" className="text-white text-decoration-none">Home</Link>
// </li>

//                   <li><a href="#" className="text-white text-decoration-none">Products</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Blog</a></li>
//                    <li><a href="/#about" className="text-white text-decoration-none">About Us</a></li>
//                    <li><a href="#" className="text-white text-decoration-none">Solutions</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Careers</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Refund Policy</a></li>
//                    <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
//                   <li><a href="#" className="text-white text-decoration-none">Terms and Conditions</a></li>
                
//                   <li><a href="#" className="text-white text-decoration-none">Research & Development</a></li>
//                 </ul>
//               </Col>
           
//             </Row>
//           </Col>

//           {/* Newsletter */}
//           <Col md={4} className="mb-4">
//             <h5>Subscribe to our newsletter</h5>
//             <p className="mt-3">
//               Fill in your details to receive our monthly newsletter with news, thought leadership and a summary of our latest blog articles.
//             </p>
//             <Form className="d-flex">
//               <Form.Control type="email" placeholder="Email address" className="me-2" />
//               <Button variant="info">SUBSCRIBE</Button>
//             </Form>
//           </Col>
//         </Row>
//       </Container>

//       {/* Bottom bar */}
//       <div className="bg-info text-dark text-center py-2 mt-4">
//         <Container className="d-flex justify-content-between align-items-center flex-wrap">
//           <span>© 2024 NeubAltics Tech Pvt. Ltd, All Rights Reserved.</span>
//           <span>Website Developed by NeubAItics Tech Pvt. Ltd</span>
//         </Container>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <Container>
        <Row className="footer-content">
          {/* Address */}
          <Col md={4}>
            <h5 className="footer-title">Address</h5>
            <p className="footer-text">
              <FaMapMarkerAlt className="footer-icon" />
              2nd Floor, Platinum Jubilee Building,<br />
              AC-Tech Campus, Anna University,<br />
              Guindy, Chennai - 600025
            </p>

            <p className="footer-text">
              <FaEnvelope className="footer-icon" />
              info@neubaitics.com
            </p>

            <p className="footer-text">
              <FaPhoneAlt className="footer-icon" />
              +91 9791729777 &nbsp; +91 9791738777
            </p>

            <div className="social-icons">
              <FaLinkedin />
              <FaInstagram />
              <FaTwitter />
              <FaFacebook />
              <FaYoutube />
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h5 className="footer-title">Quick Links</h5>
            <Row>
              <Col xs={6}>
                <ul className="footer-links">
                  <li><FaChevronRight className="link-icon" />
    <Link to="/">Home</Link></li>
                  <li> <FaChevronRight className="link-icon" />
    <Link to="/products">Products</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/blog">Blog</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/contact">Contact Us</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/refund">Refund Policy</Link></li>
                </ul>
              </Col>
              <Col xs={6}>
                <ul className="footer-links">
                  <li><FaChevronRight className="link-icon" />
    <Link to="/about">About Us</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/solutions">Solutions</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/careers">Careers</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/privacy">Privacy Policy</Link></li>
                  <li><FaChevronRight className="link-icon" />
    <Link to="/terms">Terms & Conditions</Link></li>
                </ul>
              </Col>
            </Row>
          </Col>
<div className="footer-bg-icons">
  <span className="bg-icon icon-1" />
  <span className="bg-icon icon-2" />
  <span className="bg-icon icon-3" />
</div>

          {/* Newsletter */}
          <Col md={4}>
            <h5 className="footer-title">Subscribe to our newsletter</h5>
            <p className="footer-text">
              Fill in your details to receive our monthly newsletter with news,
              thought leadership and blog highlights.
            </p>

            <Form className="newsletter-form">
              <Form.Control
                type="email"
                placeholder="Email address"
              />
              <Button>SUBSCRIBE</Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <Container>
          <div className="bottom-content">
            <span>© 2024 NeubAltics Tech Pvt. Ltd. All Rights Reserved.</span>
            <span>Website Developed NeubAltics Tech Pvt. Ltd. </span>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;





