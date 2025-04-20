import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetStarted from './pages/GetStarted';
import AboutUs from './pages/AboutUs';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import TopicsPage from './pages/TopicsPage';
import BitzNews from './pages/BitzNews';
import SettingsPage from './pages/SettingsPage';

// PrivateRoute Component for protecting routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Check if the user has a valid token
  return token ? children : <SignIn />; // If no token, redirect to SignIn page
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/topics" element={<TopicsPage />} />
          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <BitzNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;