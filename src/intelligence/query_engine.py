from typing import List, Dict, Any
from pydantic import BaseModel
from src.pipeline.root_cause import DiscoveredProblemNode
from src.intelligence.scorer import OpportunityScorer, OpportunityCard


class ComparativeOpportunityRow(BaseModel):
    opportunity_name: str
    primary_vector: str
    mention_count: int
    share_pct: float
    friction_impact: float
    conversion_relevance: float
    ops_score: float
    primary_segment: str
    conversion_impact_summary: str


class ComparativeDiscoveryResponse(BaseModel):
    query: str
    direct_analytical_answer: str
    total_query_mentions: int
    comparative_matrix: List[ComparativeOpportunityRow]
    top_opportunities: List[OpportunityCard]
    business_goal_impact: str


class ComparativeQueryEngine:
    """
    Executes deep natural language discovery queries beyond summarization or sentiment analysis.
    Identifies, quantifies, and compares potential opportunity areas affecting 30-day wishlist conversion.
    """

    QUERY_INTENT_MAP = {
        "postpone": "Wishlist Delay & Conversion Friction",
        "delay": "Wishlist Delay & Conversion Friction",
        "fit": "Fit & Size Predictability",
        "size": "Fit & Size Predictability",
        "quality": "Material & Quality Trust",
        "fabric": "Material & Quality Trust",
        "photo": "Real-World Visual Proof",
        "review": "Review Trust & Authenticity",
        "style": "Styling & Pairing Guidance"
    }

    def analyze_query(
        self,
        query: str,
        opportunity_cards: List[OpportunityCard]
    ) -> ComparativeDiscoveryResponse:
        query_lower = query.lower()

        # Identify focus intent
        matched_intents = [intent for term, intent in self.QUERY_INTENT_MAP.items() if term in query_lower]
        primary_intent = matched_intents[0] if matched_intents else "General Purchase Friction"

        # Build Comparative Opportunity Matrix
        matrix_rows: List[ComparativeOpportunityRow] = []
        total_mentions = sum(opp.problem_node.mention_count for opp in opportunity_cards) or 1

        for opp in opportunity_cards:
            share_pct = round((opp.problem_node.mention_count / total_mentions) * 100, 1)

            impact_summary = (
                f"Blocks 30-day conversion for {opp.affected_segment.split('&')[0]} because "
                f"{opp.problem_node.underlying_barrier.lower()} (OPS: {opp.ops_score})."
            )

            matrix_rows.append(ComparativeOpportunityRow(
                opportunity_name=opp.opportunity_title,
                primary_vector=opp.primary_vector,
                mention_count=opp.problem_node.mention_count,
                share_pct=share_pct,
                friction_impact=opp.impact_rating,
                conversion_relevance=opp.conversion_relevance,
                ops_score=opp.ops_score,
                primary_segment=opp.affected_segment,
                conversion_impact_summary=impact_summary
            ))

        # Sort matrix rows by OPS score
        matrix_rows.sort(key=lambda r: r.ops_score, reverse=True)

        top_opp = opportunity_cards[0] if opportunity_cards else None
        top_name = top_opp.opportunity_title if top_opp else "Product Friction"
        top_ops = top_opp.ops_score if top_opp else 0.0

        if "postpone" in query_lower or "delay" in query_lower:
            direct_answer = (
                f"Analysis of customer conversations reveals that purchase postponement from wishlists is driven primarily by "
                f"pre-purchase uncertainty rather than lack of purchase intent. The #1 opportunity area causing postponement is "
                f"'{top_name}' (OPS Score: {top_ops}), accounting for {matrix_rows[0].share_pct if matrix_rows else 0}% of expressed friction. "
                f"Users wishlist products as a holding action while seeking external validation about sizing, fabric quality, and real-life appearance."
            )
        else:
            direct_answer = (
                f"Regarding '{query}': Quantitative discovery identifies {len(opportunity_cards)} competing friction vectors. "
                f"The highest-leverage opportunity area is '{top_name}' with an Opportunity Priority Score of {top_ops}. "
                f"Addressing this barrier directly unblocks checkout commitment for wishlisting shoppers."
            )

        business_goal_impact = (
            f"Resolving the top identified friction ('{top_name}') directly addresses the unmet customer need: "
            f"'{top_opp.problem_node.unmet_need if top_opp else 'predictable product confidence'}'. "
            f"Targeting this friction yields the highest projected uplift in 30-day wishlist-to-purchase conversion rates."
        )

        return ComparativeDiscoveryResponse(
            query=query,
            direct_analytical_answer=direct_answer,
            total_query_mentions=total_mentions,
            comparative_matrix=matrix_rows,
            top_opportunities=opportunity_cards,
            business_goal_impact=business_goal_impact
        )
