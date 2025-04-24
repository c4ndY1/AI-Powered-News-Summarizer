
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const cron = require('node-cron');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require("path");
const { exec } = require("child_process");
const schedule = require("node-schedule");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

const fsPromises = fs.promises;

// Apply CORS with options
app.use(cors(corsOptions));

// Remove any custom header middleware you might have added previously

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// Add a test endpoint to verify CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    timestamp: new Date().toISOString(),
    requestHeaders: req.headers
  });
});

mongoose.connect("mongodb://127.0.0.1:27017/User_Details");

const SECRET_KEY = "SoftwareEngineering";

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

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Input validation
    if (!username || !password || !email) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Username validation
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ 
        message: "Username must be between 3 and 30 characters" 
      });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username.toLowerCase() === username.toLowerCase() 
          ? "Username already exists" 
          : "Email already registered" 
      });
    }

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userModel.create({ 
      username: username.toLowerCase(),
      password: password,
      email: email.toLowerCase(),
      vector: Array(17).fill(0),
    });

    res.status(201).json({ 
      message: "User created successfully",
      user: {
        username: user.username,
        userId: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "An error occurred during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    console.log("Authorization header in middleware:", req.headers.authorization);
    console.log("Authorization header:");
    console.log("Authorization header:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "No token provided or invalid token format" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Debug log
    console.log("Received token:", token);

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      
      // Debug log
      console.log("Decoded token:", decoded);

      // Verify user exists in database
      const user = await userModel.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Add user info to request
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Personalized news endpoint
app.get('/api/personalized-news', authenticateUser, async (req, res) => {
  try {
    // Debug logging
    console.log("Middleware: User authentication starting");
    console.log("User:", req.user);

    // 1. Fetch user data and vector
    const user = await userModel.findById(req.user.userId).select('vector username');
    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched user data from MongoDB:", user);
    console.log("User's vector:", user.vector);

    // 2. Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');

    // 3. Create vector data
    // const 
    // 
    // 
    //  = "2025-04-23 20:27:36"; // Using the specified timestamp
    // const vectorData = {
    //   username: "TejKiran06",
    //   vector: user.vector || Array(17).fill(0), // Fallback to zero vector if none exists
    //   timestamp: currentTime
    // };

    // // 4. Save vector data to file
    // const weightagesPath = path.join(dataDir, 'category_weightages.json');
    // console.log("Saving vector data to:", weightagesPath);
    // const fsPromises = fs.promises;
    // try {
    //   await fsPromises.writeFile(weightagesPath, JSON.stringify(vectorData, null, 2));
    //   console.log("Vector data saved successfully to:", weightagesPath);
    // } catch (err) {
    //   console.error("Error saving vector data:", err);
    //   throw err;
    // }
    const categoriesMapping = [
      "India",
      "World",
      "Sports",
      "Business",
      "Entertainment",
      "Telangana",
      "Maharastra",
      "UttarPradesh",
      "Gujarat",
      "TamilNadu",
      "Uttarakhand",
      "AndhraPradesh",
      "Delhi",
      "Mumbai",
      "Chennai",
      "Hyderabad",
      "Bengaluru",
    ];

    const categoryObject = {};
    user.vector.forEach((value, index) => {
      categoryObject[categoriesMapping[index]] = value;
    });
;
    await fsPromises.mkdir(dataDir, { recursive: true });

    const weightagesPath = path.join(dataDir, "category_weightages.json");
    await fsPromises.writeFile(weightagesPath, JSON.stringify(categoryObject, null, 2));


    // 5. Run Python script
    const pythonScriptPath = path.join(__dirname, 'personalize_news.py');
    console.log("Running Python script:", pythonScriptPath);

    // Verify Python script exists
    // try {
    //   await fs.access(pythonScriptPath);
    // } catch {
    //   console.error("Python script not found at:", pythonScriptPath);
    //   return res.status(500).json({ message: "Required script not found" });
    // }

    // Run Python script with promise
    await new Promise((resolve, reject) => {
      PythonShell.run(pythonScriptPath, {
        pythonPath: 'python',
        pythonOptions: ['-u'],
      }).then(() => {
        resolve();
      }).catch((err) => {
        console.error("Python script error:", err);
        reject(err);
      });
    });

    // 6. Read results
    const personalizedNewsPath = path.join(__dirname, 'personalized_news.json');
    console.log("Reading results from:", personalizedNewsPath);

    try {
      const newsData = await fsPromises.readFile(personalizedNewsPath, 'utf8');
      const personalizedNews = JSON.parse(newsData);
      res.json({
        message: "Personalized news fetched successfully",
        news: personalizedNews,
      });
    } catch (err) {
      console.error("Error reading personalized news file:", err);
      res.status(500).json({
        message: "Error reading personalized news",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }

  } catch (error) {
    console.error("Error in personalized news endpoint:", error);
    res.status(500).json({
      message: "An error occurred while fetching personalized news",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/verify', (req, res) => {
  console.log("Authorization header:");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ 
      message: "Verified", 
      user: {
        username: decoded.username,
        email: decoded.email
      },
    });
  });
});

const User = require('./models/user');

app.post('/api/updateCategories', async (req, res) => {
  try {
    const { userId, selectedCategories } = req.body;
    
    // Validate inputs
    if (!userId || !Array.isArray(selectedCategories)) {
      return res.status(400).json({ 
        message: "Invalid input: userId and selectedCategories array required" 
      });
    }

    // Initialize vector with zeros
    const vector = Array(17).fill(0);
    
    // Calculate recommendation value
    const recommendationValue = selectedCategories.length > 0 
      ? 1 / selectedCategories.length 
      : 0;
    
    // Set the recommendation value for each selected category
    selectedCategories.forEach(categoryIndex => {
      if (categoryIndex >= 0 && categoryIndex < 17) {
        vector[categoryIndex] = recommendationValue;
      }
    });

    // Update user's vector in database
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { vector: vector },
      { 
        new: true,
        runValidators: true // This ensures the vector length validation runs
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Categories updated successfully",
      user: {
        username: updatedUser.username,
        userId: updatedUser._id,
        vector: updatedUser.vector
      }
    });

  } catch (err) {
    console.error("Category update error:", err);
    res.status(500).json({ 
      message: "Error occurred while updating categories",
      error: err.message 
    });
  }
});

app.get("/api/news", (req, res) => {
  const newsPath = path.join(__dirname, "news.json");
  res.sendFile(newsPath);
});


app.post('/api/update-like', authenticateUser, async (req, res) => {
  try {
    // Debug logging
    console.log("Middleware: User authentication starting");
    console.log("User:", req.user);

    const { category } = req.body; // Category sent from frontend
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // 1. Fetch user data and vector
    const user = await userModel.findById(req.user.userId).select('vector username');
    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched user data from MongoDB:", user);

    const categoriesMapping = [
      "India",
      "World",
      "Sports",
      "Business",
      "Entertainment",
      "Telangana",
      "Maharastra",
      "UttarPradesh",
      "Gujarat",
      "TamilNadu",
      "Uttarakhand",
      "AndhraPradesh",
      "Delhi",
      "Mumbai",
      "Chennai",
      "Hyderabad",
      "Bengaluru",
    ];

    // 2. Map the user's vector into a category object
    const categoryObject = {};
    user.vector.forEach((value, index) => {
      categoryObject[categoriesMapping[index]] = value;
    });

    // 3. Construct input for the Python script
    const dataDir = path.join(__dirname, 'data');
    const inputFilePath = path.join(dataDir, 'category_weightages2.json');
    const outputFilePath = path.join(dataDir, 'category_weightages.json');

    const inputData = {
      action: "like",
      category,
      vector: categoryObject,
    };

    // Ensure the data directory exists
    await fs.promises.mkdir(dataDir, { recursive: true });

    // Save the input data to the input file
    console.log("Saving input data to:", inputFilePath);
    await fs.promises.writeFile(inputFilePath, JSON.stringify(inputData, null, 2));

    // 4. Run Python script
    console.log("Running Python script: weight_processsor.py");
    const pythonScriptPath = path.join(__dirname, 'weight_processsor.py');

    await new Promise((resolve, reject) => {
      PythonShell.run(pythonScriptPath, {
        pythonPath: 'python',
        pythonOptions: ['-u'],
      }).then(() => {
        resolve();
      }).catch((err) => {
        console.error("Python script error:", err);
        reject(err);
      });
    });

    // 5. Read the updated weights from the output file
    console.log("Reading updated weights from:", outputFilePath);
    const updatedWeightsData = await fs.promises.readFile(outputFilePath, 'utf8');
    const updatedWeights = JSON.parse(updatedWeightsData);

    // 6. Convert updated weights back into a vector
    const updatedVector = categoriesMapping.map(category => updatedWeights[category] || 0);

    // 7. Save the updated vector back to MongoDB
    user.vector = updatedVector;
    await user.save();

    console.log("Updated vector saved to MongoDB for user:", user.username);

    res.json({
      message: "Like action processed and user vector updated successfully",
      updatedVector,
    });
  } catch (error) {
    console.error("Error in like update endpoint:", error);
    res.status(500).json({
      message: "An error occurred while updating the like action",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

app.post('/api/update-dislike', authenticateUser, async (req, res) => {
  try {
    // Debug logging
    console.log("Middleware: User authentication starting");
    console.log("User:", req.user);

    const { category } = req.body; // Category sent from frontend
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // 1. Fetch user data and vector
    const user = await userModel.findById(req.user.userId).select('vector username');
    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched user data from MongoDB:", user);

    const categoriesMapping = [
      "India",
      "World",
      "Sports",
      "Business",
      "Entertainment",
      "Telangana",
      "Maharastra",
      "UttarPradesh",
      "Gujarat",
      "TamilNadu",
      "Uttarakhand",
      "AndhraPradesh",
      "Delhi",
      "Mumbai",
      "Chennai",
      "Hyderabad",
      "Bengaluru",
    ];

    // 2. Map the user's vector into a category object
    const categoryObject = {};
    user.vector.forEach((value, index) => {
      categoryObject[categoriesMapping[index]] = value;
    });

    // 3. Construct input for the Python script
    const dataDir = path.join(__dirname, 'data');
    const inputFilePath = path.join(dataDir, 'category_weightages2.json');
    const outputFilePath = path.join(dataDir, 'category_weightages.json');

    const inputData = {
      action: "dislike",
      category,
      vector: categoryObject,
    };

    // Ensure the data directory exists
    await fs.promises.mkdir(dataDir, { recursive: true });

    // Save the input data to the input file
    console.log("Saving input data to:", inputFilePath);
    await fs.promises.writeFile(inputFilePath, JSON.stringify(inputData, null, 2));

    // 4. Run Python script
    console.log("Running Python script: weight_processsor.py");
    const pythonScriptPath = path.join(__dirname, 'weight_processsor.py');

    await new Promise((resolve, reject) => {
      PythonShell.run(pythonScriptPath, {
        pythonPath: 'python',
        pythonOptions: ['-u'],
      }).then(() => {
        resolve();
      }).catch((err) => {
        console.error("Python script error:", err);
        reject(err);
      });
    });

    // 5. Read the updated weights from the output file
    console.log("Reading updated weights from:", outputFilePath);
    const updatedWeightsData = await fs.promises.readFile(outputFilePath, 'utf8');
    const updatedWeights = JSON.parse(updatedWeightsData);

    // 6. Convert updated weights back into a vector
    const updatedVector = categoriesMapping.map(category => updatedWeights[category] || 0);

    // 7. Save the updated vector back to MongoDB
    user.vector = updatedVector;
    await user.save();

    console.log("Updated vector saved to MongoDB for user:", user.username);

    res.json({
      message: "Like action processed and user vector updated successfully",
      updatedVector,
    });
  } catch (error) {
    console.error("Error in like update endpoint:", error);
    res.status(500).json({
      message: "An error occurred while updating the like action",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

const scraperScriptPath = path.join(__dirname, "news-scraper.py");
const jsonFilePath = path.join(__dirname, "news.json");
const runScraper = () => {
  console.log("Running scraper...");
  const scraperProcess = exec(`python "${scraperScriptPath}"`);
  scraperProcess.stdout.on("data", (data) => console.log(`[SCRAPER]: ${data}`));
  scraperProcess.stderr.on("data", (data) => console.error(`[SCRAPER ERROR]: ${data}`));
  scraperProcess.on("exit", (code) => console.log(`Scraper exited with code ${code}`));
};

app.get("/news", (req, res) => {
  if (fs.existsSync(jsonFilePath)) {
    const newsData = fs.readFileSync(jsonFilePath, "utf-8");
    res.json(JSON.parse(newsData));
  } else {
    res.status(404).json({ message: "No news data found" });
  }
});

//schedule.scheduleJob("0 30 22 * * *", () => runScraper());

app.listen(5000, () => {
  console.log(`[${new Date().toISOString()}] Server is running on port 5000`);
});
