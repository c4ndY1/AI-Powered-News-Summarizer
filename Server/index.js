const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const cron = require('node-cron');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/User_Details");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "SoftwareEngineering";

// Schedule news scraping for 4 AM IST (22:30 UTC previous day)
cron.schedule('30 22 * * *', () => {
  const now = new Date();
  console.log(`[${now.toISOString()}] Running news scraper at 4 AM IST...`);
  PythonShell.run('news_scraper.py', null, function (err) {
    if (err) console.error(`[${new Date().toISOString()}] Error running news scraper:`, err);
    console.log(`[${new Date().toISOString()}] News scraper finished running`);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  userModel.findOne({ username: username })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign(
            { 
              userId: user._id, 
              username: user.username
            }, 
            SECRET_KEY, 
            { expiresIn: "1h" }
          );
          
          res.json({ 
            message: "Success", 
            token,
            user: {
              username: user.username,
              userId: user._id
            }
          });

        } else {
          res.json({ message: "The password is Incorrect" });
        }
      } else {
        res.json({ message: "No record existed" });
      }
    })
    .catch(err => res.json({ message: "Error occurred", error: err }));
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await userModel.create({
      username,
      password,
      email,
    });

    res.status(201).json({ 
      message: "User created successfully",
      user: {
        username: user.username,
        userId: user._id
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error occurred", error: err });
  }
});

app.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({ 
      message: "Verified", 
      user: {
        username: decoded.username,
        email: decoded.email
      },
    });
  });
});

// Add endpoint to get news
app.get('/news', (req, res) => {
  try {
    const news = require('./news.json');
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news", error: err });
  }
});

// Add endpoint to get news by category
app.get('/news/:category', (req, res) => {
  try {
    const news = require('./news.json');
    const category = req.params.category;
    const filteredNews = news.filter(article => article.category.toLowerCase() === category.toLowerCase());
    res.json(filteredNews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news by category", error: err });
  }
});

app.listen(5000, () => {
  console.log(`[${new Date().toISOString()}] Server is running on port 5000`);
  
  // Run news scraper immediately on server start
  console.log(`[${new Date().toISOString()}] Running initial news scraping...`);
  PythonShell.run('news_scraper.py', null, function (err) {
    if (err) console.error(`[${new Date().toISOString()}] Error running news scraper:`, err);
    console.log(`[${new Date().toISOString()}] Initial news scraping completed`);
  });
});