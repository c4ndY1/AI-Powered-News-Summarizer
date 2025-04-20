import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import os
import time
from datetime import datetime
import logging
import pytz
import sys
from pathlib import Path
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation
from collections import defaultdict
from heapq import nlargest

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except Exception as e:
    print(f"Error downloading NLTK data: {e}")

# Set up logging with IST timestamps
ist = pytz.timezone('Asia/Kolkata')
utc = pytz.UTC

# Create logs directory if it doesn't exist
log_dir = Path('logs')
log_dir.mkdir(exist_ok=True)

# Set up logging with daily rotating file
log_file = log_dir / f'news_scraper_{datetime.now(ist).strftime("%Y-%m-%d")}.log'
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S IST'
)

class ISTFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, tz=ist)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.strftime('%Y-%m-%d %H:%M:%S IST')

for handler in logging.getLogger().handlers:
    handler.setFormatter(ISTFormatter('%(asctime)s - %(levelname)s - %(message)s'))

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(ISTFormatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(console_handler)

def summarize_text(text, n_sentences=3):
    """
    Create a summary of the text using a frequency-based approach
    """
    try:
        if not text:
            return ""
            
        # Tokenize the text into sentences and words
        sentences = sent_tokenize(text)
        
        # If text is too short, return it as is
        if len(sentences) <= n_sentences:
            return text
            
        # Get stopwords
        stop_words = set(stopwords.words('english') + list(punctuation))
        
        # Calculate word frequencies
        word_freq = defaultdict(int)
        for word in word_tokenize(text.lower()):
            if word not in stop_words:
                word_freq[word] += 1
                
        # Calculate sentence scores based on word frequencies
        sent_scores = defaultdict(int)
        for i, sent in enumerate(sentences):
            for word in word_tokenize(sent.lower()):
                if word not in stop_words:
                    sent_scores[i] += word_freq[word]
                    
        # Get the top n_sentences with highest scores
        top_sent_indices = nlargest(n_sentences, sent_scores, key=sent_scores.get)
        top_sent_indices.sort()  # Sort to maintain original order
        
        # Create the summary
        summary = ' '.join([sentences[i] for i in top_sent_indices])
        return summary
    except Exception as e:
        logging.error(f"Error in summarization: {e}")
        return text[:200] + "..."  # Fallback to simple truncation

def get_article_content_and_image(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        content = []
        
        article_body = soup.find('div', class_='articleBody') or \
                      soup.find('div', class_='article-body') or \
                      soup.find('article')
        
        image_url = None
        image_container = soup.find('div', class_='thumbnail') or \
                         soup.find('div', class_='article-img') or \
                         soup.find('figure')
        
        if image_container:
            img_tag = image_container.find('img')
            if img_tag and img_tag.has_attr('src'):
                image_url = urljoin(url, img_tag['src'])
            elif img_tag and img_tag.has_attr('data-src'):
                image_url = urljoin(url, img_tag['data-src'])
        
        if not image_url:
            for img in soup.find_all('img'):
                if img.has_attr('width') and int(img['width']) < 200:
                    continue
                if img.has_attr('src') and not img['src'].endswith(('.ico', '.svg')):
                    image_url = urljoin(url, img['src'])
                    break
                elif img.has_attr('data-src') and not img['data-src'].endswith(('.ico', '.svg')):
                    image_url = urljoin(url, img['data-src'])
                    break
        
        if article_body:
            for element in article_body.find_all(['h1', 'h2', 'h3', 'p']):
                text = element.get_text(strip=True)
                if text and len(text) > 20:
                    content.append(text)
        else:
            for element in soup.find_all('p'):
                text = element.get_text(strip=True)
                if text and len(text) > 20:
                    content.append(text)
        
        return " ".join(content), image_url
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching article content from {url}: {e}")
        return "", None
    except Exception as e:
        logging.error(f"An error occurred while scraping article content from {url}: {e}")
        return "", None

def get_ht_news(category, url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        if response.status_code != 200:
            logging.error(f"Failed to fetch {category} news (Status code: {response.status_code})")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        articles = []

        article_blocks = soup.find_all('div', class_='cartHolder')

        for item in article_blocks:
            try:
                title_tag = item.find('h3', class_='hdg3')
                title_link = title_tag.find('a') if title_tag else None
                title = title_link.get_text(strip=True) if title_link else "No Title"
                href = title_link['href'] if title_link and title_link.has_attr('href') else None
                full_link = urljoin("https://www.hindustantimes.com", href) if href else "No Link"

                if title and href:
                    logging.info(f"Fetching content for: {full_link}")
                    article_content, image_url = get_article_content_and_image(full_link)
                    
                    if article_content:
                        # Create two summaries of different lengths
                        summary1 = summarize_text(article_content, n_sentences=2)  # Short summary
                        summary2 = summarize_text(article_content, n_sentences=4)  # Longer summary
                        
                        article_data = {
                            "title": title,
                            "link": full_link,
                            "image_url": image_url,
                            "summary1": summary1,
                            "summary2": summary2,
                            "category": category,
                            "timestamp_ist": datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S IST'),
                            "timestamp_utc": datetime.now(utc).strftime('%Y-%m-%d %H:%M:%S UTC'),
                            "scraper_info": {
                                "version": "1.0",
                                "last_updated_by": "TejKiran06",
                                "scrape_date": "2025-04-20 16:41:08"
                            }
                        }
                        articles.append(article_data)
                        time.sleep(1)  # Be nice to the server
            except Exception as e:
                logging.error(f"Error processing article: {e}")
                continue

        logging.info(f"Fetched {len(articles)} articles from {category}")
        return articles
    except Exception as e:
        logging.error(f"Error fetching {category} news: {e}")
        return []

def main():
    categories = {
        # Main Categories
        "Trending": "https://www.hindustantimes.com/trending",
        # "Entertainment": "https://www.hindustantimes.com/entertainment",
        # "India": "https://www.hindustantimes.com/india-news",
        # "World": "https://www.hindustantimes.com/world-news",
        # "Sports": "https://www.hindustantimes.com/sports",
        # "Business": "https://www.hindustantimes.com/business",
        
        # # States
        # "Telangana": "https://www.hindustantimes.com/topic/telangana/news",
        # "Maharastra": "https://www.hindustantimes.com/topic/maharastra/news",
        # "UttarPradesh": "https://www.hindustantimes.com/topic/uttar-pradesh/news",
        # "Gujarat": "https://www.hindustantimes.com/topic/gujarat/news",
        # "Uttarakhand": "https://www.hindustantimes.com/topic/uttarakhand/news",
        # "AndhraPradesh": "https://www.hindustantimes.com/topic/andhra-pradesh/news",
        # "TamilNadu": "https://www.hindustantimes.com/topic/tamil-nadu/news",
        
        # # Cities
        # "Delhi": "https://www.hindustantimes.com/topic/delhi/news",
        # "Mumbai": "https://www.hindustantimes.com/topic/mumbai/news",
        # "Chennai": "https://www.hindustantimes.com/topic/chennai/news",
        # "Hyderabad": "https://www.hindustantimes.com/topic/hyderabad/news",
        # "Bengaluru": "https://www.hindustantimes.com/topic/bengaluru/news"
    }

    all_articles = []
    
    for category, url in categories.items():
        logging.info(f"Scraping {category} news from {url} ...")
        category_articles = get_ht_news(category, url)
        all_articles.extend(category_articles)

    # Create backups directory if it doesn't exist
    backup_dir = Path('backups')
    backup_dir.mkdir(exist_ok=True)
    
    # Save to JSON with IST timestamp
    ist_time = datetime.now(ist)
    timestamp = ist_time.strftime('%Y%m%d_%H%M%S')
    
    json_filename = "news.json"
    backup_filename = backup_dir / f"news_backup_{timestamp}.json"
    
    # Create backup of existing file if it exists
    if os.path.exists(json_filename):
        try:
            with open(json_filename, 'r', encoding='utf-8') as source:
                with open(backup_filename, 'w', encoding='utf-8') as target:
                    target.write(source.read())
            logging.info(f"Created backup: {backup_filename}")
        except Exception as e:
            logging.error(f"Error creating backup: {e}")

    try:
        with open(json_filename, 'w', encoding='utf-8') as file:
            json.dump({
                "meta": {
                    "last_updated": ist_time.strftime('%Y-%m-%d %H:%M:%S IST'),
                    "last_updated_utc": datetime.now(utc).strftime('%Y-%m-%d %H:%M:%S UTC'),
                    "scraper_version": "1.0",
                    "updated_by": "TejKiran06",
                    "articles_count": len(all_articles)
                },
                "articles": all_articles
            }, file, ensure_ascii=False, indent=4)
        logging.info(f"News articles saved at: {os.path.abspath(json_filename)}")
    except Exception as e:
        logging.error(f"Error saving news articles: {e}")

if __name__ == "__main__":
    start_time = datetime.now(ist)
    logging.info(f"Starting news scraper at {start_time.strftime('%Y-%m-%d %H:%M:%S IST')}")
    main()
    end_time = datetime.now(ist)
    logging.info(f"News scraper finished at {end_time.strftime('%Y-%m-%d %H:%M:%S IST')}")
    duration = end_time - start_time
    logging.info(f"Total execution time: {duration}")