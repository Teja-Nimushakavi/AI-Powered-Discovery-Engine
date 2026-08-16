import re
from typing import Dict, List, Tuple
from pydantic import BaseModel
from src.ingestion.schema_validator import InputFeedbackRecord


class RelevanceClassification(BaseModel):
    feedback_id: str
    relevance_category: str  # wishlist_conversion_relevant, fashion_decision_relevant, potentially_relevant, irrelevant
    reasoning: str
    confidence: float


class RelevanceClassifier:
    """
    Classifies feedback records into 4 relevance categories.
    Uses robust heuristic signal matching with LLM integration support.
    """

    WISHLIST_KEYWORDS = {
        "wishlist", "wishlisted", "wish list", "save for later", "saved", "bookmark",
        "saved item", "waiting to buy", "will buy later", "cart to wishlist"
    }

    FASHION_DECISION_KEYWORDS = {
        "fit", "size", "sizing", "fabric", "material", "quality", "looks like",
        "color", "colour", "shade", "style", "styling", "outfit", "wear",
        "review", "photo", "picture", "measurement", "loose", "tight", "length",
        "stitching", "cloth", "brand fit", "true to size", "occasion"
    }

    POTENTIAL_KEYWORDS = {
        "price", "cost", "expensive", "discount", "buy", "purchase", "order",
        "cart", "checkout", "alternative", "option", "compare", "recommend",
        "stock", "available", "return", "exchange"
    }

    def classify_record(self, record: InputFeedbackRecord) -> RelevanceClassification:
        text = record.raw_text.lower()

        # Check Wishlist Conversion Relevance
        wishlist_matches = [kw for kw in self.WISHLIST_KEYWORDS if kw in text]
        if wishlist_matches:
            return RelevanceClassification(
                feedback_id=record.feedback_id,
                relevance_category="wishlist_conversion_relevant",
                reasoning=f"Explicitly mentions wishlist/saved item concept: {', '.join(wishlist_matches[:3])}",
                confidence=0.95
            )

        # Check Fashion Decision Relevance
        fashion_matches = [kw for kw in self.FASHION_DECISION_KEYWORDS if kw in text]
        if len(fashion_matches) >= 1:
            return RelevanceClassification(
                feedback_id=record.feedback_id,
                relevance_category="fashion_decision_relevant",
                reasoning=f"Contains key fashion purchase decision factors: {', '.join(fashion_matches[:3])}",
                confidence=0.85
            )

        # Check Potentially Relevant
        potential_matches = [kw for kw in self.POTENTIAL_KEYWORDS if kw in text]
        if potential_matches:
            return RelevanceClassification(
                feedback_id=record.feedback_id,
                relevance_category="potentially_relevant",
                reasoning=f"Discusses general shopping intent or product evaluation: {', '.join(potential_matches[:3])}",
                confidence=0.70
            )

        return RelevanceClassification(
            feedback_id=record.feedback_id,
            relevance_category="irrelevant",
            reasoning="Does not contain fashion decision, wishlist, or purchase evaluation signals.",
            confidence=0.90
        )

    def process_batch(self, records: List[InputFeedbackRecord]) -> Tuple[Dict[str, List[InputFeedbackRecord]], List[RelevanceClassification]]:
        categorized: Dict[str, List[InputFeedbackRecord]] = {
            "wishlist_conversion_relevant": [],
            "fashion_decision_relevant": [],
            "potentially_relevant": [],
            "irrelevant": []
        }
        classifications: List[RelevanceClassification] = []

        for rec in records:
            cls_result = self.classify_record(rec)
            classifications.append(cls_result)
            categorized[cls_result.relevance_category].append(rec)

        return categorized, classifications
