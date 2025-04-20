import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GetStarted.css';
import stickerLogo from '../Images/Logo.png';
import image1 from '../Images/bgImage00.png';

function GetStarted() {
  // Set initial viewport to only show the hero section
  useEffect(() => {
    const adjustInitialView = () => {
      const viewportHeight = window.innerHeight;
      document.querySelector('.hero').style.height = `${viewportHeight}px`;
    };

    adjustInitialView();
    window.addEventListener('resize', adjustInitialView);

    return () => {
      window.removeEventListener('resize', adjustInitialView);
    };
  }, []);

  // Navigation handler
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">
          <img src={stickerLogo} alt="Logo" className="logo-image" />
          <span className="byte">Byte</span>
          <span className="newz">Newz</span>
        </div>
        <nav className="nav">
          <button className="nav-button" onClick={() => navigate('/about-us')}>
            About Us
          </button>
          <button className="nav-button signin" onClick={() => navigate('/sign-in')}>
            Sign In
          </button>
          <button className="nav-button register" onClick={() => navigate('/sign-up')}>
            Register
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>
            Reading news has never been easier
            <br />
            <p className="tagline">Big news, small <span className="bytes-yellow">Bytes</span> - just what you need</p>

            <span className="byte-black">Byte</span>
            <span className="newz-yellow">Newz</span>
          </h1>
          <button className="btn-learn-more" onClick={handleLearnMoreClick}>
            Learn More
          </button>
        </section>

        <section id="features" className="features">
          <div className="features-content">
            <div className="information">
              <img src={image1} alt="Newspaper Stack" />
              <div className="info-text">
                <h2>Stay Informed, Effortlessly</h2>
                <p>AI-powered news summaries tailored just for you.</p>
                <p>
                  Body text for your whole article or post. We'll put in some
                  lorem ipsum to show how a filled-out page might look:
                </p>
                <p>
                  Excepteur efficient emerging, minim veniam anim aute curated
                </p>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature">
                <h3>Smart Summarization</h3>
                <p>
                  Get concise, AI-generated summaries of top news stories. Perfect for staying informed on the go.
                </p>
              </div>
              <div className="feature">
                <h3>Listen on the Go</h3>
                <p>Turn summaries into audio. Stay updated hands-free.</p>
              </div>
              <div className="feature">
                <h3>Personalized Feed</h3>
                <p>Get news tailored to your interests, from trusted sources.</p>
              </div>
              <div className="feature">
                <h3>Privacy First</h3>
                <p>No tracking, no ads, ever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default GetStarted;