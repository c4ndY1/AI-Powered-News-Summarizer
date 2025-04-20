import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  Globe,
  Flag,
  Trophy,
  Film,
  Map,
  Briefcase,
  HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/TopicsPage.css";
import bgImage from "../Images/bgImage1.png";

const categories = [
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
    "Maharastra",
    "UttarPradesh",
    "Gujarat",
    "TamilNadu",
    "Uttarakhand",
    "AndhraPradesh",
  ],
  Cities: ["Delhi", "Mumbai", "Chennai", "Hyderabad", "Bengaluru"],
};

const iconsMap = {
  Trending: <HeartPulse className="lucide-icon" />,
  India: <Flag className="lucide-icon" />,
  World: <Globe className="lucide-icon" />,
  Sports: <Trophy className="lucide-icon" />,
  Business: <Briefcase className="lucide-icon" />,
  Entertainment: <Film className="lucide-icon" />,
  States: <Map className="lucide-icon" />,
  Cities: <Map className="lucide-icon" />,
};

export default function TopicsPage() {
  const navigate = useNavigate(); // Initialize navigate
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const toggleCategory = (key) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const toggleSubCategory = (sub) => {
    setSelectedSubCategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleContinue = () => {
    const result = {
      categories: selectedCategories,
      subCategories: selectedSubCategories,
    };
    console.log("User Selections:", result);

    // Redirect to BitzNews page
    navigate("/main");
  };

  return (
    <div
      className="topics-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="topics-container">
        <h1 className="topics-title">Select Your News Interests</h1>
        <div className="topics-grid">
          {categories.map((cat) => (
            <motion.div
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`topic-card ${
                selectedCategories.includes(cat) ? "selected" : ""
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="topic-info">
                <div className="icon">{iconsMap[cat]}</div>
                <span className="label">{cat}</span>
              </div>
            </motion.div>
          ))}
        </div>
          
        {selectedCategories.some((cat) => subCategories[cat]) &&
          Object.entries(subCategories).map(
            ([parent, subs]) =>
              selectedCategories.includes(parent) && (
                <div key={parent} className="states-section">
                  <h2 className="states-title">Select {parent}</h2>
                  <div className="states-grid">
                    {subs.map((sub) => (
                      <div
                        key={sub}
                        onClick={() => toggleSubCategory(sub)}
                        className={`state-card ${
                          selectedSubCategories.includes(sub)
                            ? "selected"
                            : ""
                        }`}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}

        <button onClick={handleContinue} className="continue-button">
          Continue
        </button>
      </div>
    </div>
  );
}