import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import '../styles/SignIn.css';
import signupImage from '../Images/bgImage1.png';
import sticker from '../Images/Logo.png';

const SignIn = () => {
  const navigate = useNavigate();

  // Individual state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());

  // Generate a new captcha
  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Refresh captcha
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.message === "Success") {
        localStorage.setItem("authToken", response.data.token); // Save the token
        navigate("/bitz-news");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };


  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `url(${signupImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="signup-form-container">
        <div className="logo">
          <img src={sticker} alt="ByteNewz logo" className="logo-image" />
          <div className="logo-text">
            Byte<span>Newz</span>
          </div>
        </div>
        <div className="text1">Welcome Back! Log in to stay updated</div>
        <div className="text2">Log In</div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="captcha-container">
            <div
              className="captcha-display"
              title="Captcha code"
              role="textbox"
              aria-label="Captcha code"
            >
              {captcha}
            </div>
            <button
              type="button"
              className="refresh-captcha-button"
              onClick={refreshCaptcha}
              aria-label="Refresh Captcha"
            >
              ↻
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter Captcha"
            value={userCaptchaInput}
            onChange={(e) => setUserCaptchaInput(e.target.value)}
            required
          />
          <button className="submit-button" type="submit">
            Log In
          </button>
          <p className="signup-navigation-button">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="signup-button"
              onClick={() => navigate('/sign-up')}
            >
              <span className="signupp">Sign Up</span>
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;