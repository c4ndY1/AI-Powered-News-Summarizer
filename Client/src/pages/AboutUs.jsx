import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../styles/AboutUs.css';
import logo from '../Images/Logo.png';

const AboutUsPage = () => {
  const teamMembers = [
    { name: "B Sameeth", email: "sameeth_b@cs.iitr.ac.in", phone: "6305764337", enroll: "231114017" },
    { name: "Ch Tej Kiran Sai", email: "tejkiran_ch@cs.iitr.ac.in", phone: "7207121658", enroll: "23114021" },
    { name: "J Raviteja", email: "raviteja_j@cs.iitr.ac.in", phone: "9440844888", enroll: "23114040" },
    { name: "N Aasish", email: "aasish_vn@cs.iitr.ac.in", phone: "9182595641", enroll: "23114069" },
    { name: "M Rahul", email: "rahul_m@cs.iitr.ac.in", phone: "7569939995", enroll: "23114066" },
    { name: "V Ajay Kumar", email: "ajay_v@cs.iitr.ac.in", phone: "9866694235", enroll: "23114109" }
  ];

  return (
    <div className="about-us-container">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">
            <span className="byte">Byte</span>
            <span className="news">Newz</span>
          </span>
        </div>
        <nav className="nav">
          {/* Use Link instead of href for React Router navigation */}
           <Link to="/" className="btn btn-home" aria-label="Home">Home</Link>
        </nav>
      </header>

      <section className="about-section">
        <h1>About Us</h1>
        <p className="about-description">
          ByteNewz is crafted for curious minds with little time. We blend AI summarization,
          voice-based news, and smart categorization so you stay informed effortlessly.
        </p>

        <div className="team-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card">
              <h3>{member.name}</h3>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>Enroll No:</strong> {member.enroll}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;