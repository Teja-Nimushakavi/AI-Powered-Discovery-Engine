import re
from typing import List, Tuple, Set
from pydantic import BaseModel
from src.intelligence.scorer import OpportunityCard


class GuardrailCheckResult(BaseModel):
    is_passed: bool
    violations: List[str]
    warnings: List[str]


class PipelineGuardrails:
    """
    Enforces non-negotiable business rules and technical guardrails:
    1. Anti-Discount Rule: Block monetary discount / price drop recommendations.
    2. Citation Traceability: Ensure all quotes and evidence IDs map to ingested records.
    3. Silent Majority Alert: Append limitations notice to output reports.
    """

    DISCOUNT_TERMS = {
        "discount", "coupon", "promo code", "cashback", "price drop", "slash price",
        "cheaper", "lower price", "sale price", "free gift"
    }

    def check_anti_discount_rule(self, opportunity_cards: List[OpportunityCard]) -> Tuple[List[OpportunityCard], List[str]]:
        valid_cards = []
        violations = []

        for card in opportunity_cards:
            text_to_check = (card.opportunity_title + " " + card.why_it_matters + " " + card.problem_node.unmet_need).lower()
            found_discount_terms = [t for t in self.DISCOUNT_TERMS if t in text_to_check]

            if found_discount_terms:
                violation_msg = (
                    f"Violation in {card.opportunity_id}: Primary recommendation contains discount/monetary incentive terms: "
                    f"{', '.join(found_discount_terms)}. System constraint rule strictly forbids discount solutions."
                )
                violations.append(violation_msg)
            else:
                valid_cards.append(card)

        return valid_cards, violations

    def check_citation_traceability(self, opportunity_cards: List[OpportunityCard], valid_feedback_ids: Set[str]) -> Tuple[bool, List[str]]:
        violations = []
        for card in opportunity_cards:
            for fid in card.problem_node.supporting_feedback_ids:
                if fid not in valid_feedback_ids:
                    violations.append(f"Unsubstantiated citation ID '{fid}' in {card.opportunity_id} does not exist in raw store.")
        
        is_passed = len(violations) == 0
        return is_passed, violations

    def get_silent_majority_limitation_notice(self) -> str:
        return (
            "LIMITATION NOTICE: This analysis is derived exclusively from publicly available user reviews and online conversations. "
            "Public feedback represents an active vocal minority and may not reflect the silent majority of browsing users. "
            "Product Managers must validate these discovered opportunities against internal behavioral analytics, checkout funnel data, "
            "and targeted A/B usability tests before full-scale product deployment."
        )
