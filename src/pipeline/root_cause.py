from typing import List
from pydantic import BaseModel, Field
from src.pipeline.clusterer import SignalCluster


class DiscoveredProblemNode(BaseModel):
    problem_id: str
    problem_name: str
    primary_vector: str
    surface_observation: str
    underlying_barrier: str
    unmet_need: str
    confidence_level: str  # HIGH, MEDIUM, LOW
    supporting_feedback_ids: List[str]
    verbatim_quotes: List[str]
    mention_count: int


class RootCauseSynthesizer:
    """
    Synthesizes semantic clusters into structured DiscoveredProblemNode objects.
    Transforms surface observations into root-cause barriers and unmet customer needs.
    """

    ROOT_CAUSE_MAPPINGS = {
        "Fit Uncertainty": {
            "surface": "Users repeatedly express doubt about sizing accuracy and brand fit variations.",
            "barrier": "Lack of reliable, cross-brand sizing standardization and real-world fit predictors.",
            "need": "Predictable, high-confidence fit guidance before committing to purchase."
        },
        "Fabric Quality Uncertainty": {
            "surface": "Users mention uncertainty regarding cloth thickness, material feel, and durability.",
            "barrier": "Inability to evaluate fabric tactile texture and real-world material quality online.",
            "need": "Transparent fabric specifications, tactile texture previews, and real-user durability feedback."
        },
        "Photo Mismatch": {
            "surface": "Users express concern that catalog studio photos differ from real-life product appearance.",
            "barrier": "Discrepancy between professional studio lighting/editing and natural lighting appearance.",
            "need": "Unfiltered customer photos and natural-light visual proof prior to buying."
        },
        "Review Mistrust": {
            "surface": "Users complain about unverified or conflicting customer reviews.",
            "barrier": "Lack of verified shopper context and authentic photo reviews.",
            "need": "Trustworthy, verified buyer reviews filtered by body type and purchase history."
        },
        "Styling Doubt": {
            "surface": "Users hesitate because they don't know how to pair or style the wishlisted item.",
            "barrier": "Absence of complete outfit styling guidance and occasion pairing recommendations.",
            "need": "In-context outfit styling ideas and pairing suggestions on product pages."
        }
    }

    def synthesize_cluster(self, cluster: SignalCluster, problem_index: int) -> DiscoveredProblemNode:
        barrier_key = cluster.cluster_name.replace(" Friction Cluster", "")
        
        mapping = self.ROOT_CAUSE_MAPPINGS.get(barrier_key, {
            "surface": f"Users repeatedly report friction regarding {barrier_key.lower()}.",
            "barrier": f"Customer evaluation impasse related to {barrier_key.lower()} during pre-purchase.",
            "need": f"Greater clarity and pre-purchase confidence addressing {barrier_key.lower()}."
        })

        feedback_ids = [s.feedback_id for s in cluster.signals]
        quotes = [s.raw_text for s in cluster.signals[:5]]

        confidence = "HIGH" if cluster.sample_count >= 5 else ("MEDIUM" if cluster.sample_count >= 2 else "LOW")

        return DiscoveredProblemNode(
            problem_id=f"PRB-{problem_index:03d}",
            problem_name=f"{barrier_key} Barrier",
            primary_vector=cluster.primary_vector,
            surface_observation=mapping["surface"],
            underlying_barrier=mapping["barrier"],
            unmet_need=mapping["need"],
            confidence_level=confidence,
            supporting_feedback_ids=feedback_ids,
            verbatim_quotes=quotes,
            mention_count=cluster.sample_count
        )

    def synthesize_all(self, clusters: List[SignalCluster]) -> List[DiscoveredProblemNode]:
        problem_nodes = []
        for idx, cluster in enumerate(clusters, start=1):
            node = self.synthesize_cluster(cluster, idx)
            problem_nodes.append(node)
        return problem_nodes
