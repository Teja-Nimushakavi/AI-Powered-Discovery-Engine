# Walkthrough: AI-Powered Wishlist Purchase Discovery Engine

We have successfully implemented the full **AI-Powered Wishlist Purchase Discovery Engine**, including rich **User Persona & Demographic Analytics** across age groups, city tiers, issue frequency metrics, and target shopper archetypes.

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
│   │   ├── synthetic_generator.py         # Generates synthetic data with demographic fields (age_group, city_tier, issue_frequency)
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
│   │   ├── segment_mapper.py              # User segment & Demographic Persona Analytics engine
│   │   ├── guardrails.py                  # Anti-discount gate & citation traceability verifier
│   │   └── report_generator.py            # 10-section PM-ready discovery report generator
│   └── dashboard/
│       └── app.py                         # Streamlit interactive dashboard with Persona & Demographics Tab
├── frontend/                              # Next.js 14 Premium UI Dashboard App
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx                    # Next.js App Router Dashboard Page
│       │   └── globals.css                 # Glassmorphism & custom glow themes
│       ├── components/                     # Header, QueryBar, UserSegments (Persona Cards & Demographics), KPICards, MatrixChart, OpportunityList, EvidenceDrawer
│       └── types/                          # TypeScript interface definitions (PersonaAnalytics, AgeGroupDist, CityTierDist)
└── tests/
    ├── test_ingestion.py                  # Schema & CSV parser unit tests
    ├── test_cleaner.py                    # PII scrubbing & deduplication unit tests
    ├── test_scorer.py                     # OPS mathematical formula unit tests
    ├── test_guardrails.py                 # Anti-discount & citation traceability tests
    ├── test_query_engine.py               # Comparative Discovery Query Engine unit tests
    ├── test_synthetic_generator.py        # Synthetic dataset auto-generator tests
    └── test_end_to_end.py                 # Full pipeline end-to-end integration test including persona metrics
```

---

## 2. Key Technical Highlights

### A. Layer 1: Data Ingestion & Demographics
- **Schema Validation ([schema_validator.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/ingestion/schema_validator.py)):** Enforces strict types via Pydantic (`feedback_id`, `raw_text`, `source_platform`, `timestamp`, `rating`, `age_group`, `city_tier`, `issue_frequency`).
- **Demographic Synthetic Generator ([synthetic_generator.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/ingestion/synthetic_generator.py)):** Generates realistic fashion conversations with age group distributions (18-24 Gen Z, 25-34 Millennials), city tiers (Tier 1 Metros, Tier 2 Emerging, Tier 3+ Regions), and monthly issue frequencies.

### B. Layer 2 & 3: AI Pipeline & Persona Analytics Engine
- **Segment & Persona Mapper ([segment_mapper.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/intelligence/segment_mapper.py)):** Synthesizes:
  - **Age Group Breakdown**: 25-34 Millennials (44%), 18-24 Gen Z (38%), 35-44 (13%), 45+ (5%).
  - **City Tier Distribution**: Tier 1 Metros (45%), Tier 2 Cities (38%), Tier 3+ Regions (17%).
  - **Issue Frequency & Repeat Friction**: 2-3 issues/month (53%), 4+ issues/month (25%), 1 issue/month (22%).
  - **Detailed Persona Archetypes**: Detailed profiles (Sneha Rao, Ananya Sharma, Rahul Mehta, Meera Joshi) with wishlist abandonment rates, primary friction vectors, and verbatim representative quotes.

### C. Layer 4: Interactive PM Analytics Dashboards
- **Next.js 14 Premium UI ([UserSegments.tsx](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/frontend/src/components/UserSegments.tsx)):** Displays interactive Demographic Progress Bar Cards, City Tier breakdown, Issue Frequency metrics, and 4 detailed User Persona Profile cards.
- **Streamlit Analytics Dashboard ([app.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/dashboard/app.py)):** Interactive Tab 3 with Age Group Distribution DataFrames, City Tier charts, Issue Frequency rates, and Persona Profile Cards.

---

## 3. How to Run the Project

1. **FastAPI Backend Server:**
   ```bash
   python -m uvicorn src.api.main:app --port 8000
   ```

2. **Next.js Premium Frontend Dashboard:**
   ```bash
   cd frontend
   npm run dev
   ```
   Access at [http://localhost:3000](http://localhost:3000).

3. **Streamlit Analytics Dashboard:**
   ```bash
   python -m streamlit run src/dashboard/app.py --server.port 8501
   ```
   Access at [http://localhost:8501](http://localhost:8501).

4. **Run Automated Test Suite:**
   ```bash
   python -m pytest
   ```
