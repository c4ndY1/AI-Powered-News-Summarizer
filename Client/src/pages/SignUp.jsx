import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for API calls
import '../styles/SignUp.css';
import signupImage from '../Images/bgImage1.png';
import sticker from '../Images/Logo.png';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      alert("You must accept the Terms of Service to continue.");
      return;
    }

    axios.post('http://localhost:5000/register', { username, email, password })
      .then(result => {
        console.log(result);
        navigate('/topics');
      })
      .catch(err => {
        console.error("Error during registration:", err);
        alert("An error occurred. Please try again.");
      });
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
        <div className="text1">Create an account to personalize your news feed</div>
        <div className="text2">Sign up</div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label className="terms">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            {' '}
            I agree to the Terms of Service
          </label>
          <button className="submit-button" type="submit">
            Sign up
          </button>
          <p className="login-link">
            <span>Already have an account? </span>  
            <button 
              type="button" 
              className="login-button" 
              onClick={() => navigate('/sign-in')}
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;