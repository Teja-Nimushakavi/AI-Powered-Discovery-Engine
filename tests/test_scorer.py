from src.pipeline.root_cause import DiscoveredProblemNode
from src.intelligence.scorer import OpportunityScorer


def test_scorer_ops_calculation():
    prob = DiscoveredProblemNode(
        problem_id="PRB-001",
        problem_name="Fit Uncertainty Barrier",
        primary_vector="Fit & Size Predictability",
        surface_observation="Users express size doubt.",
        underlying_barrier="Lack of size predictor.",
        unmet_need="Predictable fit guidance.",
        confidence_level="HIGH",
        supporting_feedback_ids=["fb_1", "fb_2", "fb_3", "fb_4", "fb_5"],
        verbatim_quotes=["Size M fits small"],
        mention_count=10
    )

    scorer = OpportunityScorer()
    card = scorer.score_problem(prob, total_relevant_count=50, opportunity_index=1)

    assert card.opportunity_id == "OPP-001"
    assert card.ops_score > 0
    assert card.impact_rating == 9.5
    assert card.conversion_relevance == 0.95
    assert card.evidence_confidence == 0.95
    assert "Tier 1" in card.priority_tier
