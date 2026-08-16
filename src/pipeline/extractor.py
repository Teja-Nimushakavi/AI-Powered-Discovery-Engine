from typing import List, Optional
from pydantic import BaseModel, Field
from src.ingestion.schema_validator import InputFeedbackRecord


class ExtractedSignal(BaseModel):
    feedback_id: str
    raw_text: str
    source_platform: str
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
        "fit_uncertainty": ["size issue", "fit problem", "fits small", "fits large", "size chart wrong", "tight", "loose", "don't know size"],
        "fabric_quality_uncertainty": ["thin fabric", "cheap material", "quality looks bad", "color faded", "translucent", "see through", "rough cloth"],
        "photo_mismatch": ["different color", "doesn't look like picture", "photo misleading", "lighting different", "actual dress looks different"],
        "review_mistrust": ["no real reviews", "fake reviews", "no photo reviews", "conflicting reviews"],
        "styling_doubt": ["how to style", "what to wear with", "doesn't suit", "looks awkward"],
        "return_exchange_hassle": ["hard to return", "exchange policy", "return takes long", "no pickup"],
        "decision_overload": ["too many options", "confused", "cannot decide", "overwhelmed"]
    }

    INFO_GAP_PATTERNS = {
        "real_user_photos": ["need real photos", "customer pictures", "on real person", "video review"],
        "precise_fit_data": ["true to size", "model height", "exact waist size", "chest measurement"],
        "fabric_feel_info": ["fabric details", "is it cotton", "breathable", "heavy or light"],
        "styling_guidance": ["matching pants", "outfit idea", "styling tips"]
    }

    def extract_signals(self, record: InputFeedbackRecord) -> ExtractedSignal:
        text = record.raw_text.lower()

        # Extract Motivation
        motivation = "Bookmarking / Save for Later"
        for m_key, patterns in self.MOTIVATION_PATTERNS.items():
            if any(p in text for p in patterns):
                motivation = m_key.replace("_", " ").title()
                break

        # Extract Barrier
        barrier = "General Quality / Product Hesitation"
        primary_vec = "General Friction"
        for b_key, patterns in self.BARRIER_PATTERNS.items():
            if any(p in text for p in patterns):
                barrier = b_key.replace("_", " ").title()
                if "fit" in b_key or "size" in b_key:
                    primary_vec = "Fit & Size Predictability"
                elif "fabric" in b_key or "quality" in b_key:
                    primary_vec = "Material & Quality Trust"
                elif "photo" in b_key or "review" in b_key:
                    primary_vec = "Real-World Visual Proof"
                elif "styling" in b_key:
                    primary_vec = "Styling & Pairing Guidance"
                break

        # Extract Info Gap
        info_gap = "Validation / Product Confidence Gap"
        for g_key, patterns in self.INFO_GAP_PATTERNS.items():
            if any(p in text for p in patterns):
                info_gap = g_key.replace("_", " ").title()
                break

        return ExtractedSignal(
            feedback_id=record.feedback_id,
            raw_text=record.raw_text,
            source_platform=record.source_platform,
            wishlist_motivation=motivation,
            purchase_barrier=barrier,
            information_gap=info_gap,
            primary_vector=primary_vec
        )

    def process_batch(self, records: List[InputFeedbackRecord]) -> List[ExtractedSignal]:
        return [self.extract_signals(rec) for rec in records]
