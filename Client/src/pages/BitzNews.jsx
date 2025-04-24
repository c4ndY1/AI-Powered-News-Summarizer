import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BitzNews.css";
import logo from "../Images/Logo.png";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import linkimage from "../Images/Link2.png";
// Initialize speech synthesis
const synth = window.speechSynthesis;

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
  const [currentDateTime, setCurrentDateTime] = useState("2025-04-21 17:30:37");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("TejKiran06");
  const [personalizedNews, setPersonalizedNews] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [activeUtterance, setActiveUtterance] = useState(null);
  const subCategoryRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Fetch news.json from backend
  const fetchNewsData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/news");
      setNewsData(response.data); // Save the fetched news data in state
    } catch (error) {
      console.error("Error fetching news data:", error);
      setError("Failed to load news data");
    }
  };

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

  // Fetch personalized news
  useEffect(() => {
    const fetchPersonalizedNews = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/personalized-news",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        // Extract the `news` array from the response and set it to the state
        if (response.data && Array.isArray(response.data.news)) {
          setPersonalizedNews(response.data.news);
        } else {
          console.error("Invalid response format:", response.data);
          setPersonalizedNews([]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("Authentication failed - invalid or missing token");
          setError("Please log in again");
        } else {
          console.error("Error fetching personalized news:", error);
          setError("Failed to load personalized news");
        }
        setPersonalizedNews([]);
      }
    };

    if (filter === "For You") {
      fetchPersonalizedNews();
    }
  }, [filter]);

  // Fetch initial news data on component mount
  useEffect(() => {
    fetchNewsData();
  }, []);

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

   // Cleanup effect for speech synthesis
    useEffect(() => {
      return () => {
        synth.cancel();
      };
    }, []);

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

  const handleReaction = (articleId, type, article) => async (e) => {
    e.stopPropagation();

    // Update local state for likes/dislikes
    setLikes((prev) => ({
      ...prev,
      [articleId]: type === prev[articleId] ? null : type,
    }));

    try {
      // Determine the API endpoint based on the reaction type
      const apiEndpoint = type === "like" ? "/api/update-like" : "/api/update-dislike";

      // API call for "like" or "dislike" action
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:5000${apiEndpoint}`,
        {
          category: article.category, // Pass the category of the article
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} action processed successfully:`, response.data);
    } catch (error) {
      console.error(`Error processing the ${type} action:`, error);
      setError(`Failed to process the ${type} action`);
    }
  };

  const toggleAudio = (articleId, category, text) => {
    setAudioStates((prev) => {
      const isCurrentlyPlaying = prev[articleId];

      // Stop any currently playing speech
      synth.cancel();
      if (activeUtterance) {
        setActiveUtterance(null);
      }

      // If we're turning audio on
      if (!isCurrentlyPlaying) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Get available voices and set English voice if available
        const voices = synth.getVoices();
        const englishVoice = voices.find((voice) =>
          voice.lang.startsWith("en-")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        // Configure utterance
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        let startTime;
        utterance.onstart = () => {
          startTime = Date.now();
          updateWeightOnServer(category, "play");
        };

        utterance.onboundary = (event) => {
          if (event.charIndex) {
            const progress = (event.charIndex / text.length) * 100;
            setAudioProgress((prevProgress) => ({
              ...prevProgress,
              [articleId]: Math.min(progress, 100),
            }));
          }
        };

        utterance.onend = () => {
          setAudioStates((prevStates) => ({
            ...prevStates,
            [articleId]: false,
          }));
          setAudioProgress((prevProgress) => ({
            ...prevProgress,
            [articleId]: 100,
          }));
          setActiveUtterance(null);
        };

        synth.speak(utterance);
        setActiveUtterance(utterance);

        return {
          ...prev,
          [articleId]: true,
        };
      }

      return {
        ...prev,
        [articleId]: false,
      };
    });
  };

  const filteredArticles = useMemo(() => {
    try {
      const validPersonalizedNews = Array.isArray(personalizedNews)
        ? personalizedNews
        : [];
      const validNewsData = Array.isArray(newsData) ? newsData : [];

      return filter === "For You"
        ? validPersonalizedNews
        : filter === "All"
        ? validNewsData
        : validNewsData.filter((a) => {
            if (subFilter) {
              return a.category === subFilter;
            }
            return a.category === filter;
          });
    } catch (error) {
      console.error("Error filtering articles:", error);
      return [];
    }
  }, [filter, subFilter, personalizedNews, newsData]);

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

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
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

        <h1 className="bitz-welcome">
          <span className="welcome">Welcome,</span>
          <span className="username">{currentUser}</span>
        </h1>
        <button onClick={handleSignOut} className="Button">Sign Out</button>
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
        {(Array.isArray(filteredArticles) ? filteredArticles : []).map(
          (a, i) => (
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
                            toggleAudio(
                              a.id || i,
                              a.category,
                              summaryToggles[a.id || i]
                                ? a.summary2
                                : a.summary1
                            );
                          }}
                        >
                          {audioStates[a.id || i] ? "⏸" : "▶"}
                        </button>
                        <div className="bitz-audio-progress">
                          <div
                            className="bitz-audio-progress-bar"
                            style={{
                              width: `${audioProgress[a.id || i] || 0}%`,
                            }}
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
                      onClick={handleReaction(a.id || i, "like", a)} // Pass article object
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
                      onClick={handleReaction(a.id || i, "dislike", a)} // Pass article object
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
          )
        )}
      </div>
    </div>
  );
}