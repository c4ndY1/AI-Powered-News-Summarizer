import React, { useState } from "react";
import "./styles/signup.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import signupImage from './assets/login-image.png';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', { name, email, password })
      .then(result => {
        console.log(result)
        navigate('/login')
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-content">
          <h1 className="brand-name">ByteNewz</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>

            <p className="login-redirect">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="image-container">
        <img src={signupImage} alt="Signup" />
      </div>
    </div>
  );
};

export default Signup;