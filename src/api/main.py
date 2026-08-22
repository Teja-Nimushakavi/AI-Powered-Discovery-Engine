import os
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.ingestion.csv_parser import CSVParser
from src.ingestion.live_scraper import LiveReviewScraper
from src.pipeline.cleaner import DataCleaner
from src.pipeline.classifier import RelevanceClassifier
from src.pipeline.extractor import SignalExtractor
from src.pipeline.clusterer import SemanticClusterer
from src.pipeline.root_cause import RootCauseSynthesizer
from src.intelligence.scorer import OpportunityScorer
from src.intelligence.segment_mapper import SegmentMapper
from src.intelligence.report_generator import ReportGenerator, PMDiscoveryReport
from src.intelligence.query_engine import ComparativeQueryEngine, ComparativeDiscoveryResponse

app = FastAPI(
    title="Myntra Wishlist Discovery Engine API",
    description="REST API serving AI-powered discovery analysis for wishlist purchase conversion barriers.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    sample_count: Optional[int] = 500


def execute_pipeline(file_path_or_buffer) -> PMDiscoveryReport:
    parser = CSVParser()
    records, meta = parser.parse_csv(file_path_or_buffer)

    if not records:
        raise HTTPException(status_code=400, detail="No valid records could be extracted from input.")

    cleaner = DataCleaner()
    cleaned_records, rejected = cleaner.process_records(records)

    classifier = RelevanceClassifier()
    categorized, classifications = classifier.process_batch(cleaned_records)

    relevant_records = (
        categorized["wishlist_conversion_relevant"] +
        categorized["fashion_decision_relevant"] +
        categorized["potentially_relevant"]
    )

    extractor = SignalExtractor()
    signals = extractor.process_batch(relevant_records)

    clusterer = SemanticClusterer()
    clusters = clusterer.cluster_signals(signals)

    synthesizer = RootCauseSynthesizer()
    problem_nodes = synthesizer.synthesize_all(clusters)

    scorer = OpportunityScorer()
    opportunity_cards = scorer.score_all(problem_nodes, len(relevant_records))

    mapper = SegmentMapper()
    prob_ids = [p.problem_id for p in problem_nodes]
    user_segments = mapper.map_segments(prob_ids)

    report_gen = ReportGenerator()
    report = report_gen.generate_report(
        total_ingested=len(records),
        total_relevant=len(relevant_records),
        opportunity_cards=opportunity_cards,
        user_segments=user_segments
    )

    return report


@app.get("/api/health")
def health_check():
    return {"status": "online", "service": "Myntra Wishlist Discovery Engine API"}


@app.post("/api/fetch-live-reviews", response_model=PMDiscoveryReport)
def fetch_live_reviews_and_analyze(
    count: int = Query(default=500, ge=100, le=1000)
):
    try:
        scraper = LiveReviewScraper()
        raw_db_path = os.environ.get("RAW_DB_PATH", "./data/raw/raw_feedback.sqlite")
        live_path = os.path.join(os.path.dirname(raw_db_path), "live_playstore_reviews.csv")
        scraper.fetch_and_save_csv(live_path, count=count)
        return execute_pipeline(live_path)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch and analyze live data: {str(e)}")


@app.post("/api/analyze-csv", response_model=PMDiscoveryReport)
async def analyze_uploaded_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a .csv file")

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        report = execute_pipeline(tmp_path)
        
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze uploaded CSV: {str(e)}")


@app.post("/api/query-discovery", response_model=ComparativeDiscoveryResponse)
def query_discovery_engine(payload: QueryRequest):
    """
    Executes deep discovery query analyzing causes, quantifying metrics, and comparing opportunity areas.
    """
    try:
        raw_db_path = os.environ.get("RAW_DB_PATH", "./data/raw/raw_feedback.sqlite")
        live_path = os.path.join(os.path.dirname(raw_db_path), "live_playstore_reviews.csv")
        if not os.path.exists(live_path):
            scraper = LiveReviewScraper()
            scraper.fetch_and_save_csv(live_path, count=payload.sample_count or 500)

        report = execute_pipeline(live_path)

        query_engine = ComparativeQueryEngine()
        result = query_engine.analyze_query(
            query=payload.query,
            opportunity_cards=report.top_opportunities
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute discovery query: {str(e)}")
