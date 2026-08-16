# Walkthrough: AI-Powered Wishlist Purchase Discovery Engine

We have successfully implemented the full **AI-Powered Wishlist Purchase Discovery Engine** across all 5 proposed phases as outlined in [`implementation_plan.md`](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/implementation_plan.md), [`architecture.md`](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/architecture.md), and [`context.md`](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/context.md).

---

## 1. Accomplished Modules & File Changes

```
c:\Users\Teja\OneDrive\Desktop\Next leap\Graduation project/
├── context.md                             # Core problem context & discovery objectives
├── architecture.md                        # Architectural specification & visual Mermaid diagrams
├── implementation_plan.md                 # Roadmap & implementation phases
├── walkthrough.md                         # Completion walkthrough & execution guide
├── requirements.txt                       # Python dependencies (FastAPI, uvicorn, pandas, pydantic)
├── .env.example                           # Environment configuration template
├── data/
│   └── raw/
│       └── sample_fashion_reviews.csv     # Sample dataset for demo & verification
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   └── main.py                        # FastAPI REST API server (/api/generate-synthetic, /api/analyze-csv)
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── synthetic_generator.py         # On-the-fly synthetic fashion review dataset generator
│   │   ├── schema_validator.py            # InputFeedbackRecord Pydantic v2 schema
│   │   └── csv_parser.py                  # Header mapping, parsing, and SQLite persistence
│   ├── pipeline/
│   │   ├── __init__.py
│   │   ├── cleaner.py                     # PII redaction (email/phone/links) & deduplication
│   │   ├── classifier.py                  # 4-tier relevance classifier
│   │   ├── extractor.py                   # Behavioral signal extraction
│   │   ├── clusterer.py                   # Semantic cluster grouping engine
│   │   └── root_cause.py                  # LLM synthesis (Observation -> Barrier -> Need)
│   ├── intelligence/
│   │   ├── __init__.py
│   │   ├── query_engine.py                # Comparative Discovery Engine for 'Ask Me a Question' queries
│   │   ├── scorer.py                      # Opportunity Priority Score (OPS) math engine
│   │   ├── segment_mapper.py              # User segment archetype discovery
│   │   ├── guardrails.py                  # Anti-discount gate & citation traceability verifier
│   │   └── report_generator.py            # 10-section PM-ready discovery report generator
│   └── dashboard/
│       └── app.py                         # Streamlit interactive dashboard (alternative lightweight UI)
├── frontend/                              # Next.js 14 Premium UI Dashboard App
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx                    # Next.js App Router Dashboard Page
│       │   └── globals.css                 # Glassmorphism & custom glow themes
│       ├── components/                     # Header, QueryBar, ComparativeAnalysisView, KPICards, MatrixChart, OpportunityList, EvidenceDrawer
│       └── types/                          # TypeScript interface definitions
└── tests/
    ├── test_ingestion.py                  # Schema & CSV parser unit tests
    ├── test_cleaner.py                    # PII scrubbing & deduplication unit tests
    ├── test_scorer.py                     # OPS mathematical formula unit tests
    ├── test_guardrails.py                 # Anti-discount & citation traceability tests
    ├── test_query_engine.py               # Comparative Discovery Query Engine unit tests
    ├── test_synthetic_generator.py        # Synthetic dataset auto-generator tests
    └── test_end_to_end.py                 # Full pipeline end-to-end integration test
```

---

## 2. Key Technical Highlights

### A. Layer 1: Data Ingestion & Storage
- **Schema Validation ([schema_validator.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/ingestion/schema_validator.py)):** Enforces strict types via Pydantic (`feedback_id`, `raw_text`, `source_platform`, `timestamp`, `rating`).
- **Flexible Header Mapping ([csv_parser.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/ingestion/csv_parser.py)):** Auto-detects column names (`review`, `comment`, `feedback`, `content`, `text`) and normalizes input data.
- **SQLite Persistence:** Writes raw records to `data/raw/raw_feedback.sqlite` for auditability.

### B. Layer 2: AI Processing Pipeline
- **PII Scrubbing ([cleaner.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/pipeline/cleaner.py)):** Redacts emails, phone numbers, and URLs while filtering spam/noise.
- **4-Tier Classification ([classifier.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/pipeline/classifier.py)):** Sorts text into `wishlist_conversion_relevant`, `fashion_decision_relevant`, `potentially_relevant`, or `irrelevant`.
- **Signal Extraction ([extractor.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/pipeline/extractor.py)):** Pinpoints expressed motivations (e.g. *Bookmarking*, *Occasion Planning*), barriers (e.g. *Fit Uncertainty*, *Fabric Quality Doubt*), and information gaps.
- **Semantic Clustering ([clusterer.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/pipeline/clusterer.py)):** Groups signals by semantic similarity vectors.
- **Root Cause Synthesis ([root_cause.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/pipeline/root_cause.py)):** Synthesizes clusters into structured problem nodes:
  $$\text{Surface Observation} \longrightarrow \text{Underlying Friction} \longrightarrow \text{Unmet Customer Need}$$

### C. Layer 3: Opportunity Intelligence & Guardrails
- **Opportunity Priority Score Engine ([scorer.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/intelligence/scorer.py)):** Ranks opportunities using the formula:
  $$\text{OPS} = \text{Frequency (F)} \times \text{Impact (I)} \times \text{Conversion Relevance (CR)} \times \text{Evidence Confidence (EC)}$$
- **Anti-Discount Gate ([guardrails.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/intelligence/guardrails.py)):** Filters out monetary discount/coupon recommendations to focus strictly on product experience, trust, and information friction.
- **Citation Traceability ([guardrails.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/intelligence/guardrails.py)):** Ensures every quote and claim maps directly back to raw `feedback_id` UUID records.

### D. Layer 4: Interactive PM Analytics Dashboard
- **Interactive Streamlit Dashboard ([app.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/dashboard/app.py)):** Features 4 interactive tabs:
  1. *Prioritized Opportunity Matrix*: Sorted opportunity cards, OPS scores, and friction breakdown.
  2. *Traceable Evidence Explorer*: Clickable quote drill-downs linked to source feedback IDs.
  3. *User Segments & Uncertainty Map*: Shopper archetypes and pre-purchase uncertainty questions.
  4. *Knowledge Gaps & Next Validation Actions*: Public data limitation alerts and recommended validation steps (e.g., A/B tests, funnel analytics).

---

## 3. How to Run the Project

1. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env` and set your API keys if using cloud LLMs:
   ```bash
   cp .env.example .env
   ```

3. **Launch the PM Discovery Engine Dashboard:**
   ```bash
   streamlit run src/dashboard/app.py
   ```

4. **Run Automated Test Suite:**
   ```bash
   pytest tests/
   ```
