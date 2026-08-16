import random
import os
import pandas as pd
from typing import List, Dict, Any


class SyntheticDataGenerator:
    """
    Generates realistic, unstructured fashion shopping conversations, reviews, and comments
    for testing the Discovery Engine when no external CSV data is uploaded.
    """

    PLATFORMS = ["play_store", "app_store", "reddit", "youtube", "custom_csv", "qna_discussion"]
    CATEGORIES = ["dresses", "ethnic", "bottomwear", "topwear", "outerwear", "footwear", "accessories"]

    FIT_TEMPLATES = [
        "I wishlisted this {item} 3 weeks ago but I am terrified to order because size {size} fits completely differently in {brand} compared to Myntra's standard sizing. Need accurate brand fit guidance!",
        "Saved this beautiful {item} in my wishlist for Diwali. Is size {size} true to size? Sizes are super inconsistent across brands and size exchange takes forever.",
        "Wishlist is full of {category} but I'm confused if size {size} will be too tight on shoulders or loose on waist. Size chart is useless.",
        "Kept this {item} in my saved list for a month. Wish they had a fit predictor tool because {brand} sizing varies so much.",
        "Size {size} in {brand} usually fits me, but the comments for this {item} say it runs 2 sizes small. Scared to buy!",
        "I want to buy this {item} for my sister, but size conversion between {brand} and other labels is so confusing. Still in wishlist.",
        "Shoulder measurements for size {size} aren't specified anywhere on the product page for this {item}. Holding off purchase.",
        "I've been staring at this {item} in my wishlist for days. Size {size} might be too tight around hips. Need customer fit ratings!"
    ]

    FABRIC_TEMPLATES = [
        "Love the {item} in my saved items, but the product details don't mention fabric weight. Is it thick cotton or cheap see-through polyester?",
        "Added this {item} by {brand} to wishlist last week. Scared to buy because some buyers claim the material bleeds color on the first wash.",
        "Is the material of this {item} heavy or lightweight? Need fabric feel details and transparency rating before ordering from my wishlist.",
        "Wishlisted this {category} piece. Really hope the cloth texture doesn't get rough or bobble after 2 machine washes.",
        "The fabric description says 'cotton blend' for this {item}, but what is the exact blend percentage? Don't want itchy synthetic fabric.",
        "Kept this {item} in my saved items. Reviews mention the cloth is extremely thin and requires a separate inner lining.",
        "I love the design of this {item}, but is the silk material stiff or soft flowing? Need real material feedback!",
        "Saved this {brand} {item}. Hoping the fabric doesn't shrink by 2 inches after washing like my previous purchase did."
    ]

    PHOTO_TEMPLATES = [
        "The {item} looks gorgeous in studio photos, but there are zero customer photo reviews. Studio lighting is misleading!",
        "Saved this {item} in wishlist. Wish real shoppers posted unedited natural lighting photos so I can see true colors.",
        "Is the color of this {item} as bright as shown in the catalog picture? Scared the actual product will look dull and washed out.",
        "The red shade of this {item} by {brand} looks different in every thumbnail. Need customer photo uploads before buying.",
        "Catalog picture shows high shine on this {item}, but buyer comments say it's matte finish. Need real daylight photos!"
    ]

    STYLING_TEMPLATES = [
        "Wishlisted 3 {category} tops from {brand} but I have no idea how to style them or what pants pair well with them.",
        "Cute {item} in wishlist, but I need outfit styling ideas for a wedding event. Wish product page had pairing suggestions.",
        "Kept this {item} saved for vacation. Needs matching accessories and footwear pairing recommendations on the PDP.",
        "I want to wear this {item} to an evening party but don't know if it goes better with heels or flats. Need styling tips!"
    ]

    REVIEW_MISTRUST_TEMPLATES = [
        "Conflicting reviews on this {item} in my wishlist. Some say fit is good, others say quality is horrible. Need verified buyer photos!",
        "No photo reviews available for this {item} saved in my list. Hard to trust 5-star ratings without real photos.",
        "All the 5-star reviews for this {item} sound generic and sponsored. Where are the authentic long-term buyer reviews?",
        "Only 2 reviews for this {item} by {brand}. I need a larger sample of real buyer feedback before checkout."
    ]

    NOISE_TEMPLATES = [
        "Great app UI and fast delivery service by Myntra!",
        "App crashed during checkout, customer service response is slow.",
        "Good experience overall, easy return pickup process.",
        "Delivery executive was polite and reached on time."
    ]

    BRANDS = ["Roadster", "Mango", "HRX", "Biba", "Anouk", "FabIndia", "Zara", "H&M"]
    ITEMS = ["floral dress", "denim jacket", "silk kurti", "linen shirt", "high-waist jeans", "leather boots", "party blazer", "cotton saree"]
    SIZES = ["S", "M", "L", "XL", "30", "32", "34"]

    AUTHORS = [
        "Priya Sharma", "Ananya Roy", "Rahul Verma", "Neha Gupta",
        "Sneha Patel", "Vikram Singh", "Kavya Reddy", "Rohan Mehta",
        "Meera Joshi", "Aarav Kumar", "Tanvi Deshmukh", "Divya Nair",
        "Pooja Saxena", "Aditya Malhotra", "Ishita Agarwal"
    ]

    DATES = [
        "2026-08-15 14:30", "2026-08-14 18:45", "2026-08-13 11:20",
        "2026-08-12 09:15", "2026-08-11 20:05", "2026-08-10 16:40",
        "2026-08-09 13:50", "2026-08-08 17:10", "2026-08-07 10:25",
        "2026-08-06 21:15", "2026-08-05 15:00", "2026-08-04 12:35"
    ]

    def generate_records(self, count: int = 500) -> List[Dict[str, Any]]:
        records = []
        for i in range(1, count + 1):
            category = random.choice(self.CATEGORIES)
            brand = random.choice(self.BRANDS)
            item = random.choice(self.ITEMS)
            size = random.choice(self.SIZES)
            platform = random.choice(self.PLATFORMS)
            author = random.choice(self.AUTHORS)
            date_str = random.choice(self.DATES)

            # Pick template pool
            rand_val = random.random()
            if rand_val < 0.35:
                template = random.choice(self.FIT_TEMPLATES)
            elif rand_val < 0.60:
                template = random.choice(self.FABRIC_TEMPLATES)
            elif rand_val < 0.75:
                template = random.choice(self.PHOTO_TEMPLATES)
            elif rand_val < 0.85:
                template = random.choice(self.STYLING_TEMPLATES)
            elif rand_val < 0.93:
                template = random.choice(self.REVIEW_MISTRUST_TEMPLATES)
            else:
                template = random.choice(self.NOISE_TEMPLATES)

            text = template.format(item=item, size=size, brand=brand, category=category)
            rating = random.choice([1.0, 2.0, 3.0, 4.0, 5.0, None])
            review_id = f"SYN-{i:04d}"

            # Generate unique realistic web source URL for each review
            if platform == "Google Play":
                url = f"https://play.google.com/store/apps/details?id=com.myntra.android&review={review_id}"
            elif platform == "App Store":
                url = f"https://apps.apple.com/in/app/myntra/id907394059?review={review_id}"
            elif platform == "Reddit":
                url = f"https://reddit.com/r/myntra/comments/fashion_fit_reviews/{review_id}"
            elif platform == "YouTube":
                url = f"https://youtube.com/watch?v=myntra_haul_review&comment={review_id}"
            else:
                url = f"https://quora.com/Myntra-sizing-and-fabric-quality-review#{review_id}"

            records.append({
                "review_id": review_id,
                "platform": platform,
                "text": text,
                "author": author,
                "timestamp": date_str,
                "stars": rating,
                "category": category,
                "url": url
            })

        return records

    def generate_csv(self, output_path: str = "./data/raw/synthetic_fashion_reviews.csv", count: int = 500) -> str:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        records = self.generate_records(count=count)
        df = pd.DataFrame(records)
        df.to_csv(output_path, index=False, encoding="utf-8")
        return output_path
