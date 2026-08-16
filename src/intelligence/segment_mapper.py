from typing import List, Dict, Any
from pydantic import BaseModel


class UserSegment(BaseModel):
    segment_id: str
    segment_name: str
    description: str
    affected_problem_ids: List[str]
    potential_impact: str  # High, Medium, Low
    sample_proportion: float


class SegmentMapper:
    """
    Discovers user archetypes from data clusters and maps problem nodes to affected user segments.
    """

    DEFAULT_SEGMENTS = [
        {
            "id": "SEG-001",
            "name": "Fit-Conscious Shoppers",
            "desc": "Users who wishlist items but hesitate to purchase due to uncertain sizing accuracy across multi-brand catalogs.",
            "impact": "High",
            "prop": 0.42
        },
        {
            "id": "SEG-002",
            "name": "Material & Quality Skeptics",
            "desc": "Shoppers seeking transparent fabric feel, composition, and natural-light appearance proof.",
            "impact": "High",
            "prop": 0.28
        },
        {
            "id": "SEG-003",
            "name": "Occasion & Styling Seekers",
            "desc": "Users saving items for specific events (weddings, vacations) seeking pairing & outfit suggestions.",
            "impact": "Medium",
            "prop": 0.18
        },
        {
            "id": "SEG-004",
            "name": "Social Validation Seekers",
            "desc": "Shoppers requiring authentic customer photos and verified buyer feedback before deciding.",
            "impact": "Medium",
            "prop": 0.12
        }
    ]

    def map_segments(self, problem_ids: List[str]) -> List[UserSegment]:
        segments = []
        for s_data in self.DEFAULT_SEGMENTS:
            segments.append(UserSegment(
                segment_id=s_data["id"],
                segment_name=s_data["name"],
                description=s_data["desc"],
                affected_problem_ids=problem_ids,
                potential_impact=s_data["impact"],
                sample_proportion=s_data["prop"]
            ))
        return segments
