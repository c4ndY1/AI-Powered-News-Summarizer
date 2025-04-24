import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import os
import time
from transformers import pipeline
from datetime import datetime
import sys
import io

# Ensure UTF-8 encoding for console output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load summarization model
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

def summarize_text(text, min_len=100, max_len=150):
    try:
        if len(text.split()) < 30:
            return text

        summary = summarizer(
            text,
            max_length=max_len,
            min_length=min_len,
            do_sample=False,
            truncation=True
        )[0]['summary_text']
        return summary.strip()
    except Exception as e:
        print(f"⚠ Error during summarization: {e}")
        return "Summary not available."

def get_article_content_and_image(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the article content
        content = []
        
        # Look for common article content containers
        article_body = soup.find('div', class_='articleBody') or \
                      soup.find('div', class_='article-body') or \
                      soup.find('article')
        
        # Find the main image
        image_url = None
        # Try different common image containers
        image_container = soup.find('div', class_='thumbnail') or \
                         soup.find('div', class_='article-img') or \
                         soup.find('figure')
        
        if image_container:
            img_tag = image_container.find('img')
            if img_tag and img_tag.has_attr('src'):
                image_url = urljoin(url, img_tag['src'])
            elif img_tag and img_tag.has_attr('data-src'):
                image_url = urljoin(url, img_tag['data-src'])
        
        # If no image found in common containers, try finding the first relevant image
        if not image_url:
            for img in soup.find_all('img'):
                # Skip small images and icons
                if img.has_attr('width') and int(img['width']) < 200:
                    continue
                if img.has_attr('src') and not img['src'].endswith(('.ico', '.svg')):
                    image_url = urljoin(url, img['src'])
                    break
                elif img.has_attr('data-src') and not img['data-src'].endswith(('.ico', '.svg')):
                    image_url = urljoin(url, img['data-src'])
                    break
        
        if article_body:
            # Get all paragraphs and headings from the article body
            for element in article_body.find_all(['h1', 'h2', 'h3', 'p']):
                text = element.get_text(strip=True)
                if text and len(text) > 20:
                    content.append(text)
        else:
            # Fallback: get all paragraphs if no article body is found
            for element in soup.find_all('p'):
                text = element.get_text(strip=True)
                if text and len(text) > 20:
                    content.append(text)
        
        return " ".join(content), image_url
    except requests.exceptions.RequestException as e:
        print(f"Error fetching article content from {url}: {e}")
        return "", None
    except Exception as e:
        print(f"An error occurred while scraping article content from {url}: {e}")
        return "", None

def get_ht_news(category, url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        if response.status_code != 200:
            print(f"❌ [FAILED] Failed to fetch {category} news (Status code: {response.status_code})")
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
                    print(f"\n➡ [INFO] Fetching content for: {full_link}")
                    article_content, image_url = get_article_content_and_image(full_link)
                    
                    if article_content:
                        print(f"✅ [SUCCESS] Successfully fetched content for: {full_link}")
                        summary1 = summarize_text(article_content, min_len=100, max_len=150)
                        summary2 = summarize_text(article_content, min_len=200, max_len=300)
                        
                        print(f"🔹 Title: {title}")
                        print(f"🔹 Summary: {summary1}")

                        article_data = {
                            "title": title,
                            "link": full_link,
                            "image_url": image_url,
                            "summary1": summary1,
                            "summary2": summary2,
                            "category": category
                        }
                        articles.append(article_data)
                    else:
                        print(f"❌ [FAILED] Failed to fetch content for: {full_link}")
                    time.sleep(1)
            except Exception as e:
                print(f"❌ [ERROR] Error processing article: {e}")
                continue

        print(f"✅ [INFO] Fetched {len(articles)} articles from {category}")
        return articles
    except Exception as e:
        print(f"❌ [ERROR] Error fetching {category} news: {e}")
        return []

# Categories dictionary remains the same
categories = {
     # Main Categories
    "Trending": "https://www.hindustantimes.com/trending",
    "Entertainment": "https://www.hindustantimes.com/entertainment",
    "India": "https://www.hindustantimes.com/india-news",
    "World": "https://www.hindustantimes.com/world-news",
    "Sports": "https://www.hindustantimes.com/sports",
    "Business": "https://www.hindustantimes.com/business",
    
    # States
    "Telangana": "https://www.hindustantimes.com/topic/telangana/news",
    "Maharastra": "https://www.hindustantimes.com/topic/maharastra/news",
    "UttarPradesh": "https://www.hindustantimes.com/topic/uttar-pradesh/news",
    "Gujarat": "https://www.hindustantimes.com/topic/gujarat/news",
    "Uttarakhand": "https://www.hindustantimes.com/topic/uttarakhand/news",
    "AndhraPradesh": "https://www.hindustantimes.com/topic/andhra-pradesh/news",
    "TamilNadu": "https://www.hindustantimes.com/topic/tamil-nadu/news",
    
    # Cities
    "Delhi": "https://www.hindustantimes.com/topic/delhi/news",
    "Mumbai": "https://www.hindustantimes.com/topic/mumbai/news",
    "Chennai": "https://www.hindustantimes.com/topic/chennai/news",
    "Hyderabad": "https://www.hindustantimes.com/topic/hyderabad/news",
    "Bengaluru": "https://www.hindustantimes.com/topic/bengaluru/news"
}

# Initialize articles list
all_articles = []

# Collect articles from all categories
for idx, (category, url) in enumerate(categories.items(), start=1):
    print(f"\n🔍 [{idx}/{len(categories)}] Scraping {category} news from {url} ...")
    category_articles = get_ht_news(category, url)
    all_articles.extend(category_articles)

# Save to JSON with simple filename
json_filename = "news.json"
with open(json_filename, 'w', encoding='utf-8') as file:
    json.dump(all_articles, file, ensure_ascii=False, indent=4)

print(f"\n📁 News articles saved at: {os.path.abspath(json_filename)}")