import math
from typing import List, Dict, Any
from collections import defaultdict
from pydantic import BaseModel
from src.pipeline.extractor import ExtractedSignal


class SignalCluster(BaseModel):
    cluster_id: str
    cluster_name: str
    primary_vector: str
    signals: List[ExtractedSignal]
    sample_count: int
    cluster_keywords: List[str]


class SemanticClusterer:
    """
    Groups ExtractedSignal objects into dense semantic clusters based on behavioral vector similarity
    and theme co-occurrence.
    """

    def __init__(self, min_cluster_size: int = 2):
        self.min_cluster_size = min_cluster_size

    def _extract_keywords(self, texts: List[str], top_n: int = 5) -> List[str]:
        words = []
        stop_words = {"the", "a", "an", "is", "are", "and", "or", "to", "for", "in", "of", "with", "this", "it", "my", "i", "was", "but", "so", "very", "on", "not", "have"}
        for t in texts:
            for w in t.lower().split():
                clean_w = ''.join(ch for ch in w if ch.isalnum())
                if len(clean_w) > 3 and clean_w not in stop_words:
                    words.append(clean_w)
        
        counts = defaultdict(int)
        for w in words:
            counts[w] += 1
        sorted_words = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return [w[0] for w in sorted_words[:top_n]]

    def cluster_signals(self, signals: List[ExtractedSignal]) -> List[SignalCluster]:
        if not signals:
            return []

        # Group by purchase barrier & primary vector combination
        grouped: Dict[str, List[ExtractedSignal]] = defaultdict(list)
        for sig in signals:
            group_key = f"{sig.primary_vector} || {sig.purchase_barrier}"
            grouped[group_key].append(sig)

        clusters: List[SignalCluster] = []
        cluster_idx = 1

        for group_key, sig_list in grouped.items():
            primary_vector, barrier_name = group_key.split(" || ")
            sample_texts = [s.raw_text for s in sig_list]
            keywords = self._extract_keywords(sample_texts)

            cluster = SignalCluster(
                cluster_id=f"CLS-{cluster_idx:03d}",
                cluster_name=f"{barrier_name} Friction Cluster",
                primary_vector=primary_vector,
                signals=sig_list,
                sample_count=len(sig_list),
                cluster_keywords=keywords
            )
            clusters.append(cluster)
            cluster_idx += 1

        # Sort clusters by sample count descending
        clusters.sort(key=lambda c: c.sample_count, reverse=True)
        return clusters
