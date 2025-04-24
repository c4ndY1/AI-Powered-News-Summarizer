import json
import random
import os

def load_data(file_path):
    """Load JSON data from a file with UTF-8 encoding."""
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Create full path by joining script directory, data folder, and file name
    full_path = os.path.join(script_dir, file_path)

    print(f"Attempting to load file from: {full_path}")

    
    try:
        with open(full_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: Could not find file '{file_path}' in {script_dir}")
        print("Please ensure the file exists in the correct location11111111.")
        return {}  # Changed from [] to {} since we expect dictionaries for weightages
    except json.JSONDecodeError:
        print(f"Error: File '{file_path}' is not valid JSON")
        return {}

def save_data(data, file_path):
    """Save JSON data to a file."""
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Create full path by joining script directory and file name
    full_path = os.path.join(script_dir, file_path)
    
    try:
        with open(full_path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Error saving file '{file_path}': {str(e)}")

def initialize_weightages():
    """Initialize weightages with default values for all categories."""
    return {
        "India": 0,
        "World": 0,
        "Sports": 0,
        "Business": 0,
        "Entertainment": 0,
        "Telangana": 0,
        "Maharastra": 0,
        "UttarPradesh": 0,
        "Gujarat": 0,
        "TamilNadu": 0,
        "Uttarakhand": 0,
        "AndhraPradesh": 0,
        "Delhi": 0,
        "Mumbai": 0,
        "Chennai": 0,
        "Hyderabad": 0,
        "Bengaluru": 0
    }

def select_articles(news_data, weightages, article_count=50):
    """Select articles based on category weightages."""
    if not news_data:
        print("No news data available")
        return []
        
    # Create a list of articles weighted by their category
    weighted_articles = []
    for article in news_data:
        category = article.get("category", "All")
        weight = weightages.get(category, 0)
        weighted_articles.extend([article] * int(weight * 100))  # Scale weights for randomness

    if not weighted_articles:
        print("No articles available after applying weightages")
        return []

    # Randomly select the desired number of articles
    try:
        selected_articles = random.sample(weighted_articles, min(article_count, len(weighted_articles)))
        return selected_articles
    except ValueError as e:
        print(f"Error selecting articles: {str(e)}")
        return []

def main():
    try:
        # Initialize default weightages
        default_weightages = initialize_weightages()
        
        # Load existing weightages or create new ones
        print("Loading weightages...")
        weightages = load_data("data\category_weightages.json")
        if not weightages:
            print("Creating new category weightages file...")
            weightages = default_weightages
            save_data(weightages, "data\category_weightages.json")
        else:
            # Update existing weightages with any missing categories
            for category in default_weightages:
                if category not in weightages:
                    weightages[category] = 0
            save_data(weightages, "data\category_weightages.json")

        # Load news data
        print("Loading news data...")
        news_data = load_data("news.json")
        if not news_data:
            return

        # Generate personalized articles
        print("Generating personalized articles...")
        personalized_articles = select_articles(news_data, weightages)
        if not personalized_articles:
            return

        # Save personalized articles to a new JSON file
        print("Saving personalized articles...")
        save_data(personalized_articles, "personalized_news.json")
        print("Personalized news saved to 'personalized_news.json'")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()