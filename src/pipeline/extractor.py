from typing import List, Optional
from pydantic import BaseModel, Field
from src.ingestion.schema_validator import InputFeedbackRecord


class ExtractedSignal(BaseModel):
    feedback_id: str
    raw_text: str
    source_platform: str
    url: Optional[str] = Field(default=None)
    author_id: Optional[str] = Field(default=None)
    timestamp: Optional[str] = Field(default=None)
    wishlist_motivation: Optional[str] = Field(default="Unspecified Intent")
    purchase_barrier: Optional[str] = Field(default="Uncertainty / General Friction")
    information_gap: Optional[str] = Field(default="General Information Need")
    primary_vector: str = Field(default="Fit & Quality")


class SignalExtractor:
    """
    Extracts structured behavioral signals (motivations, purchase barriers, information gaps)
    from fashion shopping feedback records.
    """

    MOTIVATION_PATTERNS = {
        "bookmarking": ["save for later", "bookmark", "wishlist to keep", "like it for later"],
        "price_waiting": ["waiting for sale", "waiting for price drop", "too expensive right now", "price drop"],
        "comparison": ["comparing with", "saving options", "choosing between", "other brands"],
        "occasion_planning": ["wedding", "party", "festival", "diwali", "trip", "vacation", "event"],
        "styling_pairings": ["matching with", "styling with", "pair with"]
    }

    BARRIER_PATTERNS = {
        "fit_uncertainty": ["size chart", "fit issue", "runs small", "runs large", "size m", "size l", "fits tight", "sizing"],
        "fabric_doubt": ["thin material", "polyester", "cloth quality", "see through", "rough fabric", "cheap fabric"],
        "photo_mismatch": ["different color", "doesn't look like picture", "different from photo", "picture misleading"],
        "review_mistrust": ["fake reviews", "paid reviews", "influencer hype", "no real user photos"]
    }

    INFORMATION_GAP_PATTERNS = {
        "real_world_fit": ["exact waist measurement", "model height", "shoulder width", "length in inches"],
        "fabric_durability": ["wash care", "shrinkage", "color bleed", "transparency level"],
        "styling_guidance": ["what to pair with", "footwear match", "dupattas"]
    }

    def extract_signal(self, record: InputFeedbackRecord) -> ExtractedSignal:
        text_lower = record.raw_text.lower()

        motivation = "Bookmarking / Save for Later"
        for key, keywords in self.MOTIVATION_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                motivation = key.replace("_", " ").title()
                break

        barrier = "Uncertainty / General Friction"
        primary_vector = "General Product Friction"
        for key, keywords in self.BARRIER_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                barrier = key.replace("_", " ").title()
                if key == "fit_uncertainty":
                    primary_vector = "Fit & Size Predictability"
                elif key == "fabric_doubt":
                    primary_vector = "Material & Quality Trust"
                elif key == "photo_mismatch":
                    primary_vector = "Real-World Visual Proof"
                elif key == "review_mistrust":
                    primary_vector = "Review Trust & Authenticity"
                break

        info_gap = "General Product Details"
        for key, keywords in self.INFORMATION_GAP_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                info_gap = key.replace("_", " ").title()
                break

        return ExtractedSignal(
            feedback_id=record.feedback_id,
            raw_text=record.raw_text,
            source_platform=record.source_platform,
            url=getattr(record, "url", None),
            author_id=getattr(record, "author_id", "Anonymous Reviewer"),
            timestamp=getattr(record, "timestamp", "Recent"),
            wishlist_motivation=motivation,
            purchase_barrier=barrier,
            information_gap=info_gap,
            primary_vector=primary_vector
        )

    def process_batch(self, records: List[InputFeedbackRecord]) -> List[ExtractedSignal]:
        return [self.extract_signal(rec) for rec in records]
