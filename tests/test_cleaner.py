from src.ingestion.schema_validator import InputFeedbackRecord
from src.pipeline.cleaner import DataCleaner


def test_cleaner_pii_redaction():
    cleaner = DataCleaner()
    raw = "My email is user@example.com and phone is 987-654-3210. Visit https://example.com for dress."
    cleaned = cleaner.clean_text(raw)
    
    assert "[REDACTED_EMAIL]" in cleaned
    assert "[REDACTED_PHONE]" in cleaned
    assert "[REDACTED_LINK]" in cleaned


def test_cleaner_noise_rejection():
    cleaner = DataCleaner(min_character_length=15)
    
    assert cleaner.is_spam_or_noise("short") is True
    assert cleaner.is_spam_or_noise("free casino coins whatsapp me") is True
    assert cleaner.is_spam_or_noise("I wishlisted this dress but size M fits smaller than Roadster.") is False


def test_cleaner_deduplication():
    cleaner = DataCleaner()
    r1 = InputFeedbackRecord(raw_text="I wishlisted this dress but size M fits smaller than Roadster.", source_platform="play_store")
    r2 = InputFeedbackRecord(raw_text="I wishlisted this dress but size M fits smaller than Roadster.", source_platform="app_store")
    
    cleaned, rejected = cleaner.process_records([r1, r2])
    assert len(cleaned) == 1
    assert len(rejected) == 1
