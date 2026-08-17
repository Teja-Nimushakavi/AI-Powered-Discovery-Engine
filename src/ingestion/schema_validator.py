import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class InputFeedbackRecord(BaseModel):
    """
    Pydantic Schema defining an ingested raw feedback record.
    """
    feedback_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_platform: str = Field(default="custom_csv")
    raw_text: str = Field(..., min_length=1)
    author_id: Optional[str] = Field(default="anonymous")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    rating: Optional[float] = Field(default=None)
    product_category: Optional[str] = Field(default="fashion")
    url: Optional[str] = Field(default=None)

    @field_validator("raw_text")
    @classmethod
    def validate_raw_text(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("raw_text cannot be empty or whitespace only")
        return cleaned

    @field_validator("source_platform")
    @classmethod
    def validate_source_platform(cls, v: str) -> str:
        allowed = {
            "app_store", "play_store", "reddit", "fashion_community",
            "social_media", "youtube", "product_qna", "public_fashion_web", "custom_csv"
        }
        v_lower = v.lower().strip().replace(" ", "_")
        if v_lower not in allowed:
            return "public_fashion_web"
        return v_lower
