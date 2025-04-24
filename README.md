#  *ByteNews* — News Summarized, Simplified & Spoken

> *An intelligent, voice-ready news summarizer that scrapes live headlines from Hindustan Times, compresses them with cutting-edge NLP, and speaks them aloud — for the modern mind on the move.*  

---

<p align="center">
  <img src="https://img.icons8.com/color/96/news.png" alt="ByteNews Logo" width="100"/>
</p>

<h1 align="center">ByteNews</h1>
<p align="center">
  <em>“Don’t scroll. Just know.”</em><br>
  <strong>Consume news 10x faster — with summaries, categories, and voice.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-18.2.0-blue.svg" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-20.0.0-brightgreen.svg" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" /></a>
  <a href="#"><img src="https://img.shields.io/badge/OpenAI-GPT-FF7F50.svg" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-lightgrey.svg" /></a>
</p>

---

##  Core Features

-  *AI-Powered Summarization*  
  Get crisp, digestible summaries powered by GPT or HuggingFace Transformers.

-  *Live Web Scraping from Hindustan Times*  
  Stay up to date with real-time article fetching using Puppeteer.

-  *Smart Categorization*  
  Automatically tags news into categories: Politics, Tech, Sports, Entertainment, and more.

-  *Voice Integration*  
  Listen to news summaries via the Web Speech API — perfect for multitasking.

-  *Modern, Animated Interface*  
  Delightful UI powered by Tailwind CSS + AOS animations for smooth, reactive experiences.

---

##  Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| *Frontend* | React, Tailwind CSS, AOS                                            |
| *Backend*  | Express.js, Node.js, Puppeteer (Web Scraping)                                   |
| *AI/NLP*   | OpenAI GPT / HuggingFace Transformers                               |
| *Audio*    | Web Speech API                                                      |

---

##  Meet the Team

> The brains and brawn behind ByteNews 

| Name        | Role                                               |
|-------------|----------------------------------------------------|
| *Sameeth*  | Frontend Development                              |
| *Ajay*     | Frontend Development                              |
| *Tejkiran* | Backend Development                               |
| *Raviteja* | Web Scraping, Personalization, Frontend           |
| *Aasish*   | Web Scraping, Personalization, Frontend           |
| *Rahul*    | UI/UX Design                                      |

> Want profile pictures and socials linked? Ping us and we’ll plug them in!

---

##  Installation Guide

###  Clone the Repository

bash
git clone https://github.com/your-username/news-article-summarizer.git
cd news-article-summarizer


###  Install Frontend Dependencies

bash
npm install


###  Environment Variables

Create a .env file:

env
VITE_OPENAI_API_KEY=your_openai_api_key_here


###  Run the Frontend

bash
npm run dev


###  Scraper Setup

bash
cd scraper
node scrape.js


---

##  Project Structure


├── public/
├── src/
│   ├── components/        # UI Elements
│   ├── pages/             # Route Views
│   ├── utils/             # Helpers & Logic
│   └── App.jsx
├── scraper/
│   └── scrape.js          # Puppeteer Script
├── .env
├── package.json
└── README.md


---

##  Screenshots

> Add your visuals here for homepage, summary page, and voice playback UI.


 Example:
![Homepage](./screenshots/homepage.png)
![Summary Page](./screenshots/summary-page.png)


---

##  Demo Video

> Embed or link your demo video here once recorded.

---

##  What's Next?

-  Support for TOI, Indian Express & more
-  User login with saved history
-  Multilingual news summarization
-  Sentiment analysis & bias detection

---

##  Contributing

Open a PR, suggest features, or fix bugs. We love collaborators!

---


<p align="center">
  Made with Dedication and Hardwork by Team ByteNews
</p>