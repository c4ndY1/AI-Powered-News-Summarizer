import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BitzNews.css";
import newsData from "../Data/news.json";
import personalizedNewsData from "../Data/personalized_news.json";
import logo from "../Images/Logo.png";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import linkimage from "../Images/Link2.png";

const categories = [
  "For You",
  "All",
  "Trending",
  "India",
  "World",
  "Sports",
  "Business",
  "Entertainment",
  "States",
  "Cities",
];

const subCategories = {
  States: [
    "Telangana",
    "Maharashtra",
    "Uttar Pradesh",
    "Gujarat",
    "Tamil Nadu",
    "Uttarakhand",
    "Andhra Pradesh",
  ],
  Cities: ["Delhi", "Mumbai", "Chennai", "Hyderabad", "Bengaluru"],
};

export default function BitzNews() {
  const [filter, setFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("");
  const [needsScroll, setNeedsScroll] = useState(false);
  const [audioStates, setAudioStates] = useState({});
  const [audioProgress, setAudioProgress] = useState({});
  const [summaryToggles, setSummaryToggles] = useState({});
  const [likes, setLikes] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState("2025-04-20 13:29:17"); // Set to your provided time
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("TejKiran06"); // Set to your provided username
  const subCategoryRef = useRef(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const verifyUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/sign-in");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.message === "Verified") {
          setIsAuthenticated(true);
          setCurrentUser(response.data.user.username || "Guest");
        } else {
          navigate("/sign-in");
        }
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  // Update datetime every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 19).replace("T", " ");
      setCurrentDateTime(formattedDateTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/sign-in");
  };

  const isScrollable = () => {
    if (subCategoryRef.current) {
      return (
        subCategoryRef.current.scrollWidth > subCategoryRef.current.clientWidth
      );
    }
    return false;
  };

  useEffect(() => {
    if (filter === "States" || filter === "Cities") {
      setNeedsScroll(isScrollable());

      const handleResize = () => {
        setNeedsScroll(isScrollable());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [filter]);

  const handleCategoryClick = (cat) => {
    setFilter(cat);
    setSubFilter("");
  };

  const handleSubCategoryClick = (subCat) => {
    setSubFilter(subCat);
  };

  const scrollSubCategories = (direction) => {
    if (subCategoryRef.current) {
      const scrollAmount = 200;
      subCategoryRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  const handleCardClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const toggleSummary = (articleId) => (e) => {
    e.stopPropagation();
    setSummaryToggles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleReaction = (articleId, type) => (e) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [articleId]: type === prev[articleId] ? null : type,
    }));
  };

  const toggleAudio = (articleId) => {
    setAudioStates((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));

    if (!audioStates[articleId]) {
      const interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev[articleId] >= 100) {
            clearInterval(interval);
            setAudioStates((prevStates) => ({
              ...prevStates,
              [articleId]: false,
            }));
            return prev;
          }
          return {
            ...prev,
            [articleId]: (prev[articleId] || 0) + 1,
          };
        });
      }, 100);
    }
  };

  const filteredArticles = useMemo(() => {
    try {
      return filter === "For You"
        ? personalizedNewsData
        : filter === "All"
        ? newsData
        : newsData.filter((a) => {
            if (subFilter) {
              return a.category === subFilter;
            }
            return a.category === filter;
          });
    } catch (error) {
      console.error("Error filtering articles:", error);
      return [];
    }
  }, [filter, subFilter]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Please sign in to continue...</div>;
  }

  return (
    <div className="bitz-container">
      <header className="bitz-header">
        <div className="bitz-left">
          <div className="bitz-logo">
            <img src={logo} alt="ByteNews Logo" className="bitz-logo-img" />
            <h1 className="bitz-title">
              <span className="byte">Byte</span>
              <span className="newz">Newz</span>
            </h1>
          </div>
        </div>

        <h1 className="bitz-welcome">Welcome, {currentUser}</h1>

        <div className="bitz-user-info">
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
          <button className="settings-button" onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>
      </header>

      <div className="bitz-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`bitz-button ${filter === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(filter === "States" || filter === "Cities") && (
        <div className="bitz-sub-categories-container">
          {needsScroll && (
            <button
              className="sub-nav-button left"
              onClick={() => scrollSubCategories(-1)}
            >
              &#8249;
            </button>
          )}

          <div
            className={`bitz-sub-buttons ${
              needsScroll ? "has-nav-buttons" : "no-nav-buttons"
            }`}
            ref={subCategoryRef}
          >
            {subCategories[filter].map((subCat) => (
              <button
                key={subCat}
                onClick={() => handleSubCategoryClick(subCat)}
                className={`bitz-sub-button ${
                  subFilter === subCat ? "active" : ""
                }`}
              >
                {subCat}
              </button>
            ))}
          </div>

          {needsScroll && (
            <button
              className="sub-nav-button right"
              onClick={() => scrollSubCategories(1)}
            >
              &#8250;
            </button>
          )}
        </div>
      )}

      <div className="bitz-grid">
        {filteredArticles.map((a, i) => (
          <div key={i} className="bitz-card" role="article" tabIndex={0}>
            <div className="bitz-card-content">
              <div className="bitz-content-text">
                <h2>{a.title}</h2>
                <p>{summaryToggles[a.id || i] ? a.summary2 : a.summary1}</p>
                <div className="bitz-card-actions">
                  <div className="bitz-actions-left">
                    <span className="bitz-category">{a.category}</span>
                    <button
                      className="bitz-toggle-summary"
                      onClick={toggleSummary(a.id || i)}
                    >
                      {summaryToggles[a.id || i] ? "Show Less" : "Show More"}
                    </button>
                  </div>
                  <div className="bitz-actions-right">
                    <div className="bitz-audio-control">
                      <button
                        className="bitz-audio-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(a.id || i);
                        }}
                      >
                        {audioStates[a.id || i] ? "⏸" : "▶"}
                      </button>
                      <div className="bitz-audio-progress">
                        <div
                          className="bitz-audio-progress-bar"
                          style={{ width: `${audioProgress[a.id || i] || 0}%` }}
                        />
                      </div>
                    </div>
                    <button
                      className="bitz-read-more"
                      onClick={() => handleCardClick(a.link)}
                    >
                      <img
                        src={linkimage}
                        alt="Read More"
                        className="bitz-read-more-icon"
                        width="20"
                        height="20"
                      />
                      Full Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {a.image_url && (
              <div className="bitz-card-image-container">
                <div className="bitz-card-image">
                  <img
                    src={a.image_url}
                    alt={a.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.style.display = "none";
                    }}
                  />
                </div>
                <div className="bitz-reactions">
                  <button
                    className={`reaction-button ${
                      likes[a.id || i] === "like" ? "active" : ""
                    }`}
                    onClick={handleReaction(a.id || i, "like")}
                  >
                    <ThumbsUp
                      size={20}
                      color={likes[a.id || i] === "like" ? "yellow" : "gray"}
                    />
                  </button>
                  <button
                    className={`reaction-button ${
                      likes[a.id || i] === "dislike" ? "active" : ""
                    }`}
                    onClick={handleReaction(a.id || i, "dislike")}
                  >
                    <ThumbsDown
                      size={20}
                      color={likes[a.id || i] === "dislike" ? "yellow" : "gray"}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}