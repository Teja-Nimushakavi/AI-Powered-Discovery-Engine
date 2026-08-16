import os
from src.ingestion.csv_parser import CSVParser
from src.pipeline.cleaner import DataCleaner
from src.pipeline.classifier import RelevanceClassifier
from src.pipeline.extractor import SignalExtractor
from src.pipeline.clusterer import SemanticClusterer
from src.pipeline.root_cause import RootCauseSynthesizer
from src.intelligence.scorer import OpportunityScorer
from src.intelligence.segment_mapper import SegmentMapper
from src.intelligence.guardrails import PipelineGuardrails
from src.intelligence.report_generator import ReportGenerator


def test_end_to_end_discovery_pipeline():
    sample_file = "./data/raw/sample_fashion_reviews.csv"
    assert os.path.exists(sample_file)

    # 1. Ingestion
    parser = CSVParser(raw_db_path="./data/raw/test_e2e_raw.sqlite")
    records, meta = parser.parse_csv(sample_file)
    assert len(records) == 10

    # 2. Cleaning
    cleaner = DataCleaner()
    cleaned, rejected = cleaner.process_records(records)
    # Spam row 109 should be rejected
    assert len(cleaned) <= 9

    # 3. Classification
    classifier = RelevanceClassifier()
    categorized, classifications = classifier.process_batch(cleaned)
    relevant = categorized["wishlist_conversion_relevant"] + categorized["fashion_decision_relevant"] + categorized["potentially_relevant"]
    assert len(relevant) >= 5

    # 4. Extraction
    extractor = SignalExtractor()
    signals = extractor.process_batch(relevant)
    assert len(signals) == len(relevant)

    # 5. Clustering
    clusterer = SemanticClusterer()
    clusters = clusterer.cluster_signals(signals)
    assert len(clusters) > 0

    # 6. Root Cause Synthesis
    synthesizer = RootCauseSynthesizer()
    problems = synthesizer.synthesize_all(clusters)
    assert len(problems) > 0

    # 7. OPS Scoring
    scorer = OpportunityScorer()
    opportunities = scorer.score_all(problems, len(relevant))
    assert len(opportunities) > 0
    assert opportunities[0].ops_score > 0

    # 8. Guardrails Check
    guardrails = PipelineGuardrails()
    valid_cards, discount_violations = guardrails.check_anti_discount_rule(opportunities)
    assert len(discount_violations) == 0  # No discount violations

    all_feedback_ids = set(r.feedback_id for r in records)
    traceable, citation_violations = guardrails.check_citation_traceability(valid_cards, all_feedback_ids)
    assert traceable  # All quotes map to valid feedback IDs

    # 9. Report Generation
    mapper = SegmentMapper()
    prob_ids = [p.problem_id for p in problems]
    segments = mapper.map_segments(prob_ids)

    report_gen = ReportGenerator()
    report = report_gen.generate_report(
        total_ingested=len(records),
        total_relevant=len(relevant),
        opportunity_cards=valid_cards,
        user_segments=segments
    )

    assert report.total_feedback_analyzed == 10
    assert report.relevant_feedback_count == len(relevant)
    assert len(report.top_opportunities) > 0
    assert "LIMITATION NOTICE" in report.data_limitation_notice
