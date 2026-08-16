import re
import hashlib
from typing import List, Tuple, Set
from src.ingestion.schema_validator import InputFeedbackRecord


class DataCleaner:
    """
    Cleans raw feedback records by removing PII, deduplicating repetitive content,
    and filtering out low-quality noise/spam.
    """

    EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
    PHONE_REGEX = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')
    URL_REGEX = re.compile(r'https?://\S+|www\.\S+')
    SPAM_KEYWORDS = {"free coins", "casino", "download link", "earn money", "whatsapp me", "telegram"}

    def __init__(self, min_character_length: int = 15):
        self.min_character_length = min_character_length

    def clean_text(self, text: str) -> str:
        """
        Redacts PII (emails, phone numbers, links) and normalizes whitespace.
        """
        if not text:
            return ""
        
        # Redact PII
        cleaned = self.EMAIL_REGEX.sub("[REDACTED_EMAIL]", text)
        cleaned = self.PHONE_REGEX.sub("[REDACTED_PHONE]", cleaned)
        cleaned = self.URL_REGEX.sub("[REDACTED_LINK]", cleaned)
        
        # Normalize multiple spaces
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    def is_spam_or_noise(self, text: str) -> bool:
        """
        Detects if text is spam, empty, or too short to contain behavioral signals.
        """
        lower_text = text.lower()
        if len(text.strip()) < self.min_character_length:
            return True
        for keyword in self.SPAM_KEYWORDS:
            if keyword in lower_text:
                return True
        return False

    def process_records(self, records: List[InputFeedbackRecord]) -> Tuple[List[InputFeedbackRecord], List[InputFeedbackRecord]]:
        """
        Processes a list of records. Returns (cleaned_records, rejected_noise).
        """
        cleaned_records: List[InputFeedbackRecord] = []
        rejected_records: List[InputFeedbackRecord] = []
        seen_hashes: Set[str] = set()

        for rec in records:
            scrubbed_text = self.clean_text(rec.raw_text)
            
            if self.is_spam_or_noise(scrubbed_text):
                rejected_records.append(rec)
                continue

            # Exact / Near-exact deduplication hash
            norm_hash = hashlib.md5(scrubbed_text.lower().encode('utf-8')).hexdigest()
            if norm_hash in seen_hashes:
                rejected_records.append(rec)
                continue

            seen_hashes.add(norm_hash)

            # Create updated record with cleaned text
            updated_rec = InputFeedbackRecord(
                feedback_id=rec.feedback_id,
                source_platform=rec.source_platform,
                raw_text=scrubbed_text,
                author_id=rec.author_id,
                timestamp=rec.timestamp,
                rating=rec.rating,
                product_category=rec.product_category,
                url=rec.url
            )
            cleaned_records.append(updated_rec)

        return cleaned_records, rejected_records
