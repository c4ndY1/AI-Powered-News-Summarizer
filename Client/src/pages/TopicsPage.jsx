import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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

const categoryToIndexMap = {
    // Main categories
    'India': 0,
    'World': 1,
    'Sports': 2,
    'Business': 3,
    'Entertainment': 4,
    
    // States
    'Telangana': 5,
    'Maharastra': 6,
    'UttarPradesh': 7,
    'Gujarat': 8,
    'TamilNadu': 9,
    'Uttarakhand': 10,
    'AndhraPradesh': 11,
    
    // Cities
    'Delhi': 12,
    'Mumbai': 13,
    'Chennai': 14,
    'Hyderabad': 15,
    'Bengaluru': 16
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
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleCategory = (key) => {
        setSelectedCategories(prev =>
            prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
        );
    };

    const toggleSubCategory = (sub) => {
        setSelectedSubCategories(prev =>
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };

    const handleContinue = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Combine all selected categories and convert to indices
            const allSelectedCategories = [
                ...selectedCategories,
                ...selectedSubCategories
            ];

            const categoryIndices = allSelectedCategories
                .map(category => categoryToIndexMap[category])
                .filter(index => index !== undefined);

            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }

            const response = await axios.post('http://localhost:5000/api/updateCategories', {
                userId,
                selectedCategories: categoryIndices
            });

            if (response.status === 200) {
                navigate('/main');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while updating preferences');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
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
                {error && <div className="error-message">{error}</div>}
                
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

                <button 
                    onClick={handleContinue} 
                    className="continue-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}