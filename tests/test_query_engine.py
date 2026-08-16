from src.pipeline.root_cause import DiscoveredProblemNode
from src.intelligence.scorer import OpportunityScorer
from src.intelligence.query_engine import ComparativeQueryEngine


def test_query_engine_postpone_question():
    prob1 = DiscoveredProblemNode(
        problem_id="PRB-001",
        problem_name="Fit Uncertainty Barrier",
        primary_vector="Fit & Size Predictability",
        surface_observation="Size M fits small",
        underlying_barrier="Lack of size predictor",
        unmet_need="Predictable fit guidance",
        confidence_level="HIGH",
        supporting_feedback_ids=["fb_1"],
        verbatim_quotes=["Size M small"],
        mention_count=25
    )

    prob2 = DiscoveredProblemNode(
        problem_id="PRB-002",
        problem_name="Fabric Quality Uncertainty",
        primary_vector="Material & Quality Trust",
        surface_observation="Thin material",
        underlying_barrier="Uncertain cloth durability",
        unmet_need="Transparent fabric details",
        confidence_level="HIGH",
        supporting_feedback_ids=["fb_2"],
        verbatim_quotes=["Thin cloth"],
        mention_count=15
    )

    scorer = OpportunityScorer()
    opps = scorer.score_all([prob1, prob2], total_relevant_count=40)

    query_engine = ComparativeQueryEngine()
    response = query_engine.analyze_query("What causes users to postpone a purchase?", opps)

    assert response.query == "What causes users to postpone a purchase?"
    assert "postponement" in response.direct_analytical_answer.lower()
    assert len(response.comparative_matrix) == 2
    assert response.comparative_matrix[0].ops_score >= response.comparative_matrix[1].ops_score
    assert "30-day" in response.business_goal_impact.lower()
