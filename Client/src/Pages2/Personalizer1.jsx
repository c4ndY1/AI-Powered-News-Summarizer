import { useState } from "react";
import {
  Globe,
  Flag,
  Trophy,
  Film,
  Map,
  Brain,
  Briefcase,
  Monitor,
  HeartPulse,
  ShoppingBag,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Personalizer1.css";

const categories = [
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
  Trending: <HeartPulse />,
  India: <Flag />,
  World: <Globe />,
  Sports: <Trophy />,
  Business: <Briefcase />,
  Entertainment: <Film />,
  States: <Map />,
  Cities: <Map />,
};

export default function TopicsPage() {
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
    alert("Selected Categories & Subcategories saved in console!");
  };

  return (
    <div className="topics-page">
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
              {selectedCategories.includes(cat) && <Check className="check-icon" />}
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
                          selectedSubCategories.includes(sub) ? "selected" : ""
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