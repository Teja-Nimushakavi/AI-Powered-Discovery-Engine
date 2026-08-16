import os
import pytest
from src.ingestion.schema_validator import InputFeedbackRecord
from src.ingestion.csv_parser import CSVParser


def test_schema_validator_valid():
    rec = InputFeedbackRecord(
        raw_text="Size M fits smaller than expected in this brand.",
        source_platform="play_store"
    )
    assert rec.feedback_id is not None
    assert rec.raw_text == "Size M fits smaller than expected in this brand."
    assert rec.source_platform == "play_store"


def test_schema_validator_invalid_text():
    with pytest.raises(ValueError):
        InputFeedbackRecord(raw_text="   ")


def test_csv_parser_sample_data():
    sample_file = "./data/raw/sample_fashion_reviews.csv"
    assert os.path.exists(sample_file)

    parser = CSVParser(raw_db_path="./data/raw/test_raw_feedback.sqlite")
    records, meta = parser.parse_csv(sample_file)

    assert len(records) > 0
    assert meta["valid_records_parsed"] > 0
    assert any(r.source_platform == "play_store" for r in records)
