from typing import List
from pydantic import BaseModel, Field
from src.pipeline.root_cause import DiscoveredProblemNode


class OpportunityCard(BaseModel):
    opportunity_id: str
    problem_id: str
    opportunity_title: str
    primary_vector: str
    ops_score: float
    frequency_score: float
    impact_rating: float
    conversion_relevance: float
    evidence_confidence: float
    priority_tier: str  # Tier 1 (High), Tier 2 (Medium), Tier 3 (Low)
    affected_segment: str
    why_it_matters: str
    problem_node: DiscoveredProblemNode


class OpportunityScorer:
    """
    Computes Opportunity Priority Score (OPS) using the formula:
    OPS = Frequency (F) x Impact (I) x Conversion Relevance (CR) x Evidence Confidence (EC)
    """

    IMPACT_WEIGHTS = {
        "Fit & Size Predictability": 9.5,
        "Material & Quality Trust": 8.5,
        "Real-World Visual Proof": 8.0,
        "Styling & Pairing Guidance": 6.5,
        "General Friction": 5.0
    }

    CONVERSION_RELEVANCE_FACTORS = {
        "Fit & Size Predictability": 0.95,
        "Material & Quality Trust": 0.90,
        "Real-World Visual Proof": 0.85,
        "Styling & Pairing Guidance": 0.75,
        "General Friction": 0.50
    }

    def score_problem(self, problem: DiscoveredProblemNode, total_relevant_count: int, opportunity_index: int) -> OpportunityCard:
        total = max(1, total_relevant_count)
        mention_pct = (problem.mention_count / total) * 100

        # 1. Frequency (F) [1.0 to 10.0]
        F = min(10.0, max(1.0, mention_pct * 0.5))

        # 2. Impact (I) [1.0 to 10.0]
        I = self.IMPACT_WEIGHTS.get(problem.primary_vector, 6.0)

        # 3. Conversion Relevance (CR) [0.1 to 1.0]
        CR = self.CONVERSION_RELEVANCE_FACTORS.get(problem.primary_vector, 0.60)

        # 4. Evidence Confidence (EC) [0.1 to 1.0]
        if problem.confidence_level == "HIGH":
            EC = 0.95
        elif problem.confidence_level == "MEDIUM":
            EC = 0.75
        else:
            EC = 0.50

        # OPS Calculation
        ops_score = round(F * I * CR * EC, 2)

        # Priority Tier Assignment
        if ops_score >= 35.0:
            tier = "Tier 1: High Priority Opportunity"
        elif ops_score >= 15.0:
            tier = "Tier 2: Medium Priority Opportunity"
        else:
            tier = "Tier 3: Low Priority / Watchlist"

        why_it_matters = (
            f"This friction directly blocks wishlist-to-purchase conversion because "
            f"{problem.surface_observation.lower()} Resolving this addresses the unmet need: '{problem.unmet_need}'."
        )

        return OpportunityCard(
            opportunity_id=f"OPP-{opportunity_index:03d}",
            problem_id=problem.problem_id,
            opportunity_title=f"Resolve {problem.problem_name} Friction",
            primary_vector=problem.primary_vector,
            ops_score=ops_score,
            frequency_score=round(F, 2),
            impact_rating=round(I, 2),
            conversion_relevance=round(CR, 2),
            evidence_confidence=round(EC, 2),
            priority_tier=tier,
            affected_segment="Fit-Conscious & Quality-Seeking Shoppers",
            why_it_matters=why_it_matters,
            problem_node=problem
        )

    def score_all(self, problems: List[DiscoveredProblemNode], total_relevant_count: int) -> List[OpportunityCard]:
        opp_cards = []
        for idx, prob in enumerate(problems, start=1):
            card = self.score_problem(prob, total_relevant_count, idx)
            opp_cards.append(card)

        # Sort by OPS Score descending
        opp_cards.sort(key=lambda x: x.ops_score, reverse=True)
        return opp_cards
