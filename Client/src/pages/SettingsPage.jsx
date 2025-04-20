import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsPage.css';
import bgImage from '../Images/settingsbg.jpeg';

import a1 from '../avatars/a1.png';
import a2 from '../avatars/a2.png';
import a3 from '../avatars/a3.png';
import a4 from '../avatars/a4.png';
import a5 from '../avatars/a5.png';
import a6 from '../avatars/a6.png';
import a7 from '../avatars/a7.png';
import a8 from '../avatars/a8.png';
import a9 from '../avatars/a9.png';
import a10 from '../avatars/a10.png';
import a11 from '../avatars/a11.png';
import a12 from '../avatars/a12.png';
import a13 from '../avatars/a13.png';
import a14 from '../avatars/a14.png';
import a15 from '../avatars/a15.png';
import a16 from '../avatars/a16.png';
import a17 from '../avatars/a17.png';
import a18 from '../avatars/a18.png';
import a19 from '../avatars/a19.png';
import a20 from '../avatars/a20.png';
import a21 from '../avatars/a21.png';
import a22 from '../avatars/a22.png';

const avatarOptions = [
  a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11,
  a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22,
];

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [username, setUsername] = useState('gaddron07');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(a1);
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC');
  const [fontSize, setFontSize] = useState('medium');
  const [themeColor, setThemeColor] = useState('system');
  const [defaultHomepage, setDefaultHomepage] = useState('News');
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  const navigate = useNavigate();

  return (
    <div
      className="settings-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="settings-container">
        <button className="back-button" onClick={() => navigate('/bitz-news')}>
          &larr; Back
        </button>

        <h1 className="settings-title">Settings</h1>

        {/* Profile Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Profile</h2>
          <div className="settings-item">
            <label className="settings-label">Username:</label>
            <input
              type="text"
              className="settings-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="settings-item avatar-selector">
            <label className="settings-label">Select Avatar:</label>
            <img src={avatar} alt="User Avatar" className="avatar-preview" />
            <div className="avatar-options">
              {avatarOptions.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Avatar ${idx + 1}`}
                  className={`avatar-option ${avatar === img ? 'selected' : ''}`}
                  onClick={() => setAvatar(img)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Account</h2>
          <div className="settings-item">
            <label className="settings-label">Password:</label>
            <input
              type="password"
              className="settings-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="settings-item">
            <label className="settings-label">Confirm Password:</label>
            <input
              type="password"
              className="settings-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Preferences</h2>
          <div className="settings-item">
            <label className="settings-label">Email Notifications:</label>
            <div
              className={`toggle-switch ${emailNotifications ? 'active' : ''}`}
              onClick={() => setEmailNotifications(!emailNotifications)}
            ></div>
          </div>
          <div className="settings-item">
            <label className="settings-label">Language:</label>
            <select
              className="settings-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="settings-item">
            <label className="settings-label">Time Zone:</label>
            <select
              className="settings-input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="IST">IST (India)</option>
              <option value="EST">EST (US)</option>
              <option value="PST">PST (US)</option>
            </select>
          </div>
          <div className="settings-item">
            <label className="settings-label">Font Size:</label>
            <select
              className="settings-input"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="settings-item">
            <label className="settings-label">Theme:</label>
            <select
              className="settings-input"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          <div className="settings-item">
            <label className="settings-label">Default Homepage:</label>
            <select
              className="settings-input"
              value={defaultHomepage}
              onChange={(e) => setDefaultHomepage(e.target.value)}
            >
              <option value="News">News</option>
              <option value="Topics">Topics</option>
              <option value="Favorites">Favorites</option>
            </select>
          </div>
          <div className="settings-item">
            <label className="settings-label">Auto-Play Audio Summaries:</label>
            <div
              className={`toggle-switch ${autoPlayAudio ? 'active' : ''}`}
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            ></div>
          </div>
          <div className="settings-item">
            <label className="settings-label">Accessibility Mode:</label>
            <div
              className={`toggle-switch ${accessibilityMode ? 'active' : ''}`}
              onClick={() => setAccessibilityMode(!accessibilityMode)}
            ></div>
          </div>
          <div className="settings-item">
            <label className="settings-label">Enable Animations:</label>
            <div
              className={`toggle-switch ${enableAnimations ? 'active' : ''}`}
              onClick={() => setEnableAnimations(!enableAnimations)}
            ></div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-item">
          <button className="settings-button" onClick={()=>navigate('/main')}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
