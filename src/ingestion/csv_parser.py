import os
import sqlite3
import pandas as pd
from typing import List, Tuple, Dict, Any
from src.ingestion.schema_validator import InputFeedbackRecord


class CSVParser:
    """
    Parses, validates, and normalizes input CSV datasets containing user fashion shopping feedback.
    """

    COLUMN_MAPPINGS = {
        "text": "raw_text",
        "comment": "raw_text",
        "review": "raw_text",
        "feedback": "raw_text",
        "content": "raw_text",
        "platform": "source_platform",
        "source": "source_platform",
        "channel": "source_platform",
        "author": "author_id",
        "user": "author_id",
        "username": "author_id",
        "date": "timestamp",
        "created_at": "timestamp",
        "time": "timestamp",
        "stars": "rating",
        "score": "rating",
        "category": "product_category"
    }

    def __init__(self, raw_db_path: str = "./data/raw/raw_feedback.sqlite"):
        self.raw_db_path = raw_db_path
        os.makedirs(os.path.dirname(self.raw_db_path), exist_ok=True)
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.raw_db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS raw_feedback (
                    feedback_id TEXT PRIMARY KEY,
                    source_platform TEXT,
                    raw_text TEXT,
                    author_id TEXT,
                    timestamp TEXT,
                    rating REAL,
                    product_category TEXT,
                    url TEXT
                )
            """)

    def parse_csv(self, file_path_or_buffer: Any, default_source: str = "custom_csv") -> Tuple[List[InputFeedbackRecord], Dict[str, Any]]:
        """
        Reads CSV, maps headers, validates records, and persists to SQLite.
        Returns validated InputFeedbackRecord objects and processing summary metadata.
        """
        try:
            if isinstance(file_path_or_buffer, str) and os.path.exists(file_path_or_buffer):
                df = pd.read_csv(file_path_or_buffer, encoding_errors="replace")
            else:
                df = pd.read_csv(file_path_or_buffer, encoding_errors="replace")
        except Exception as e:
            raise ValueError(f"Failed to parse CSV: {str(e)}")

        # Normalize column names to lowercase
        df.columns = [str(c).strip().lower() for c in df.columns]

        # Apply column mappings
        rename_dict = {}
        for col in df.columns:
            if col in self.COLUMN_MAPPINGS:
                rename_dict[col] = self.COLUMN_MAPPINGS[col]
        df = df.rename(columns=rename_dict)

        if "raw_text" not in df.columns:
            raise ValueError("CSV must contain a text column (e.g. 'text', 'review', 'comment', 'feedback', or 'content').")

        records: List[InputFeedbackRecord] = []
        rejected_count = 0

        for idx, row in df.iterrows():
            raw_text = str(row["raw_text"]) if pd.notna(row["raw_text"]) else ""
            if not raw_text.strip():
                rejected_count += 1
                continue

            source = str(row.get("source_platform", default_source)) if pd.notna(row.get("source_platform")) else default_source
            author = str(row.get("author_id", "anonymous")) if pd.notna(row.get("author_id")) else "anonymous"
            ts = str(row.get("timestamp", "")) if pd.notna(row.get("timestamp")) else ""
            cat = str(row.get("product_category", "fashion")) if pd.notna(row.get("product_category")) else "fashion"
            
            rating_val = None
            if "rating" in row and pd.notna(row["rating"]):
                try:
                    rating_val = float(row["rating"])
                except (ValueError, TypeError):
                    rating_val = None

            try:
                record_kwargs = {
                    "raw_text": raw_text,
                    "source_platform": source,
                    "author_id": author,
                    "product_category": cat,
                    "rating": rating_val
                }
                if ts.strip():
                    record_kwargs["timestamp"] = ts.strip()

                record = InputFeedbackRecord(**record_kwargs)
                records.append(record)
            except Exception:
                rejected_count += 1

        # Persist to local raw database
        self._persist_records(records)

        metadata = {
            "total_rows_read": len(df),
            "valid_records_parsed": len(records),
            "rejected_rows": rejected_count,
            "unique_platforms": list(set(r.source_platform for r in records))
        }

        return records, metadata

    def _persist_records(self, records: List[InputFeedbackRecord]):
        if not records:
            return
        with sqlite3.connect(self.raw_db_path) as conn:
            cursor = conn.cursor()
            for r in records:
                cursor.execute("""
                    INSERT OR REPLACE INTO raw_feedback 
                    (feedback_id, source_platform, raw_text, author_id, timestamp, rating, product_category, url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (r.feedback_id, r.source_platform, r.raw_text, r.author_id, r.timestamp, r.rating, r.product_category, r.url))
            conn.commit()
