from src.pipeline.root_cause import DiscoveredProblemNode
from src.intelligence.scorer import OpportunityScorer, OpportunityCard
from src.intelligence.guardrails import PipelineGuardrails


def test_anti_discount_guardrail():
    prob = DiscoveredProblemNode(
        problem_id="PRB-002",
        problem_name="Price Friction",
        primary_vector="General Friction",
        surface_observation="Users want discount.",
        underlying_barrier="High price.",
        unmet_need="Give 50% discount coupon.",
        confidence_level="HIGH",
        supporting_feedback_ids=["fb_10"],
        verbatim_quotes=["Too expensive, give promo code"],
        mention_count=5
    )

    card = OpportunityCard(
        opportunity_id="OPP-002",
        problem_id=prob.problem_id,
        opportunity_title="Give 50% Coupon Discount",
        primary_vector="General Friction",
        ops_score=20.0,
        frequency_score=5.0,
        impact_rating=5.0,
        conversion_relevance=0.5,
        evidence_confidence=0.8,
        priority_tier="Tier 2",
        affected_segment="Price Sensitive",
        why_it_matters="Give cashbacks and promo codes",
        problem_node=prob
    )

    guardrails = PipelineGuardrails()
    valid_cards, violations = guardrails.check_anti_discount_rule([card])

    assert len(valid_cards) == 0
    assert len(violations) == 1
    assert "Violation in OPP-002" in violations[0]
