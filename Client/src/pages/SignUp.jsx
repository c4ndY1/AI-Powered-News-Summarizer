import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import '../styles/SignUp.css';
import signupImage from '../Images/bgImage1.png';
import sticker from '../Images/Logo.png';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        confirmPassword: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            setError('Please accept the Terms of Service');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/register', formData);
            
            if (response.status === 201) {
                localStorage.setItem('userId', response.data.user.userId);
                localStorage.setItem('username', response.data.user.username);
                navigate('/topics');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
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
                <div className="text1">Create an account to personalize your news feed</div>
                <div className="text2">Sign up</div>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                    {error && <div className="error-message">{error}</div>}
                    <button 
                        className="submit-button" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
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
}