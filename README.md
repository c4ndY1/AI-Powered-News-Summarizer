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
## Table of Contents

- Features
- System Architecture
- Tech Stack
- Installation
- How to Run our Project
- Future Enhancements
  
##  Features

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

## System Architecture

- News Scraper: Fetches latest articles from trusted sources

- Summarizer: AI/NLP model generates concise summaries

- Categorizer & Scoring: Classifies articles and updates category scores based on user activity

- Personalization Engine: Adjusts content dynamically

- Text-to-Speech Module: Converts summaries to audio

- Frontend: Displays summaries, categories, and interaction options
  
##  Tech Stack

| Layer      | Tech                                                               |
|------------|--------------------------------------------------------------------|
| *Frontend* | React, Tailwind CSS, AOS                                           |
| *Backend*  | Express.js, Node.js, Puppeteer (Web Scraping)                      |
| *AI/NLP*   | Python (BERT, NLTK, Transformers)                                  |
| *TTS API*  | Text-to-Speech integration                                                     |
| *Database* | MongoDB                                                            |

---

## Installation

- Clone the repository:

```bash
  git clone <https://github.com/c4ndY1/AI-Powered-News-Summarizer>
  cd AI News Summarizer
```
- Frontend
 Create App if you dont have already
 ```bash
  npx create-react-app client
  cd client
```
Install Required Packages
 ```bash
  npm install axios
  npm install react-router-dom
  npm install @mui/material @emotion/react @emotion/styled  
  npm install react-icons                                  
  npm install framer-motion                                   
```
 
- Backend
Install Required Packages
```bash
  npm install express
  npm install axios
  npm install cors
```
- Required Python Packages
Install Required Packages
```bash
  pip install requests
  pip install beautifulsoup4
  pip install transformers
```

    
##  Meet the Team

> The brains and brawn behind ByteNews 

| Name        | Role                                               |
|-------------|----------------------------------------------------|
| *Sameeth*  | Frontend Development                              |
| *Ajay*     | Frontend Development                              |
| *Tejkiran* | Backend Development                               |
| *Raviteja* | Personalization Algorithms, Frontend              |
| *Aasish*   | WebScrapping, WebSpeech, Personalization Algorithms|
| *Rahul*    | UI/UX Design, Backend                                      |



---

## How to Run our Project

To run our Project
- Go to the client directory and run the command below
```bash
  npm run dev
```
- Go to the server directory and run the command below
```bash
  npm start
```







---


## Future Enhancements

- Multi-Language Support
- More News Sources
- Advanced Personalization
- Faster Summarization
- More News Categories
- Google Sign-In




<p align="center">
  Made with Dedication and Hardwork by Team ByteNewz
</p>
