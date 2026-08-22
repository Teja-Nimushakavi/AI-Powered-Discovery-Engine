import os
import time
import requests
import pandas as pd
from typing import List, Dict, Any
from google_play_scraper import Sort, reviews

class LiveReviewScraper:
    """
    Multi-Source Live Scraper that fetches authentic customer reviews from:
    1. Google Play Store (Myntra App)
    2. Apple App Store (Myntra App)
    3. Reddit (r/IndianFashionAddicts & r/myntra)
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'MyntraDiscoveryEngineBot/1.0 (Contact: admin@example.com)'
        }

    def fetch_play_store(self, count: int = 200) -> List[Dict[str, Any]]:
        try:
            result, _ = reviews(
                'com.myntra.android',
                lang='en',
                country='in',
                sort=Sort.NEWEST,
                count=count
            )
            records = []
            for r in result:
                records.append({
                    'review': str(r.get('content', '')),
                    'rating': float(r.get('score', 0)),
                    'author': str(r.get('userName', 'Anonymous')),
                    'date': str(r.get('at', '')),
                    'url': f"https://play.google.com/store/apps/details?id=com.myntra.android&reviewId={r.get('reviewId', '')}"
                })
            return records
        except Exception as e:
            print(f"Error fetching Play Store: {e}")
            return []

    def fetch_app_store(self, count: int = 200) -> List[Dict[str, Any]]:
        # Using iTunes RSS feed for Myntra App (ID: 907394059)
        url = "https://itunes.apple.com/in/rss/customerreviews/page=1/id=907394059/sortby=mostrecent/json"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                entries = data.get('feed', {}).get('entry', [])
                # The first entry is usually the app metadata itself, not a review
                if len(entries) > 0 and 'author' not in entries[0]:
                    entries = entries[1:]
                    
                records = []
                for entry in entries[:count]:
                    records.append({
                        'review': str(entry.get('content', {}).get('label', '')),
                        'rating': float(entry.get('im:rating', {}).get('label', 0)),
                        'author': str(entry.get('author', {}).get('name', {}).get('label', 'Anonymous')),
                        'date': str(entry.get('updated', {}).get('label', '')),
                        'url': entry.get('author', {}).get('uri', {}).get('label', 'https://apps.apple.com/in/app/myntra/id907394059')
                    })
                return records
            return []
        except Exception as e:
            print(f"Error fetching App Store: {e}")
            return []

    def fetch_reddit(self, count: int = 100) -> List[Dict[str, Any]]:
        # Fetching from IndianFashionAddicts searching for Myntra
        url = "https://www.reddit.com/r/IndianFashionAddicts/search.json?q=myntra&restrict_sr=on&sort=new&limit=100"
        try:
            # Adding a slight delay to respect rate limits
            time.sleep(1) 
            response = requests.get(url, headers=self.headers, timeout=10)
            records = []
            if response.status_code == 200:
                posts = response.json().get('data', {}).get('children', [])
                for post in posts[:count]:
                    post_data = post.get('data', {})
                    text = post_data.get('selftext', '')
                    title = post_data.get('title', '')
                    # Combine title and text
                    content = f"{title}. {text}" if text else title
                    
                    if not content.strip():
                        continue
                        
                    records.append({
                        'review': content,
                        'rating': 3.0, # Neutral default for Reddit
                        'author': post_data.get('author', 'Anonymous'),
                        'date': str(post_data.get('created_utc', '')), # UTC timestamp
                        'url': f"https://www.reddit.com{post_data.get('permalink', '')}"
                    })
            return records
        except Exception as e:
            print(f"Error fetching Reddit: {e}")
            return []

    def fetch_live_records(self, count: int = 500) -> List[Dict[str, Any]]:
        print(f"Fetching {count} live multi-source records...")
        
        # Distribute the count across sources
        play_count = int(count * 0.5)
        app_count = int(count * 0.3)
        reddit_count = count - play_count - app_count
        
        play_store_records = self.fetch_play_store(count=play_count)
        app_store_records = self.fetch_app_store(count=app_count)
        reddit_records = self.fetch_reddit(count=reddit_count)
        
        all_records = play_store_records + app_store_records + reddit_records
        
        print(f"Successfully fetched {len(play_store_records)} Play Store, {len(app_store_records)} App Store, {len(reddit_records)} Reddit records.")
        return all_records

    def fetch_and_save_csv(self, output_path: str = None, count: int = 500) -> str:
        if output_path is None:
            raw_db_path = os.environ.get("RAW_DB_PATH", "./data/raw/raw_feedback.sqlite")
            output_path = os.path.join(os.path.dirname(raw_db_path), "live_multi_source_reviews.csv")
            
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        records = self.fetch_live_records(count=count)
        
        if records:
            df = pd.DataFrame(records)
            df.to_csv(output_path, index=False, encoding="utf-8")
        else:
            # Fallback if scraping completely fails
            pd.DataFrame(columns=['review', 'rating', 'author', 'date', 'url']).to_csv(output_path, index=False)
            
        return output_path
