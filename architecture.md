# System Architecture Specification: AI-Powered Wishlist Purchase Discovery Engine

---

## 1. System Overview & Architecture Goals

The **AI-Powered Wishlist Purchase Discovery Engine** processes large volumes of unstructured public feedback (reviews, forum posts, social discussions, Q&A) and transforms them into prioritized, evidence-backed customer conversion opportunities and rich **User Persona & Demographic Analytics** for Product Managers (PMs).

### Key Architectural Goals
1. **End-to-End Traceability:** Every generated insight, problem, segment, or persona maps directly back to raw source feedback items via immutable unique IDs (`feedback_id`).
2. **Decoupled 4-Layer Modular Design:** Ingestion, AI Processing, Persona Intelligence & Scoring, and PM Dashboard components are decoupled via strict JSON data contracts.
3. **Demographic & Persona Analytics:** Dynamically profiles age group distributions (18-24 Gen Z, 25-34 Millennials), city tier breakdowns (Tier 1 Metros, Tier 2, Tier 3+), issue frequencies (monthly friction rate), and target shopper archetypes.
4. **Determinism & Anti-Hallucination:** Strictly enforced JSON output schemas, confidence scoring, and evidence citation checks eliminate AI hallucinations.
5. **Hybrid Scalability:** Combines fast vector embeddings (HDBSCAN/Cosine clustering) with high-level LLM reasoning for cost-effective, high-throughput root cause discovery.

---

## 2. High-Level Architecture Topology Diagram

```mermaid
flowchart TB
    subgraph L1["1. Data Ingestion & Storage Layer"]
        direction TB
        CSV[CSV Dataset Upload] --> CSV_Parser[CSV Parser & Encoding Normalizer]
        LIVE[Live App Store & Play Store Scraper] --> CSV_Parser
        APIs[Future API Streams: Reddit, YouTube] -.-> API_Parser[API Connector Module]
        CSV_Parser --> SchemaVal[Input Schema Validator - age_group, city_tier, issue_freq]
        API_Parser --> SchemaVal
        SchemaVal --> UUID_Gen[UUID & Metadata Generator]
        UUID_Gen --> RawDB[(Raw Feedback Store - Raw SQLite/Parquet)]
    end

    subgraph L2["2. AI Processing Pipeline Layer"]
        direction TB
        RawDB --> PII_Scrubber[PII Anonymizer & Spam Filter]
        PII_Scrubber --> Deduper[Deduplication Engine]
        Deduper --> Rel_Classifier[4-Tier Relevance Classifier]
        
        Rel_Classifier --> |Irrelevant| Noise[(Noise Archive)]
        Rel_Classifier --> |Relevant| Sig_Extractor[Signal & Uncertainty Extractor]
        
        Sig_Extractor --> Embedder[Vector Embedding Engine - text-embedding-3]
        Embedder --> VectorDB[(Vector DB - ChromaDB / FAISS)]
        VectorDB --> ClusterEngine[HDBSCAN Semantic Clusterer]
        ClusterEngine --> ThemeDisc[Emerging Theme Discoverer]
        ThemeDisc --> RootCause[LLM Root Cause Synthesizer]
    end

    subgraph L3["3. Opportunity Intelligence Layer"]
        direction TB
        RootCause --> QuantEngine[Quantitative Metrics Engine]
        QuantEngine --> SegEngine[User Segment & Persona Analytics Engine]
        SegEngine --> Scorer[Opportunity Priority Scorer - OPS Math]
        Scorer --> GuardFilter[Discount & Anti-Bias Filter Gate]
        GuardFilter --> ReportGen[PM Opportunity Report Generator]
        ReportGen --> KnowledgeStore[(Insight & Opportunity Store)]
    end

    subgraph L4["4. Presentation & Interactive Layer"]
        direction TB
        KnowledgeStore --> Dashboard[PM Analytics Dashboard]
        Dashboard --> ExecutiveView[1. Executive Summary & KPIs]
        Dashboard --> MatrixView[2. Opportunity Priority Matrix]
        Dashboard --> PersonaView[3. User Demographics & Persona Profiles]
        Dashboard --> EvidenceView[4. Traceable Evidence Explorer]
        Dashboard --> GapView[5. Knowledge Gaps & Validation Actions]
    end

    L1 --> L2 --> L3 --> L4
```

---

## 3. Deep-Dive Pipeline & Data Transformation Flow Diagram

```mermaid
flowchart LR
    subgraph Step1["Stage 1: Raw Ingestion"]
        RawText["Raw Customer Comment + Demographics"]
        RawText --> |UUID & Timestamp| RawRec["Raw Record Object"]
    end

    subgraph Step2["Stage 2: Sanitization & Filtering"]
        RawRec --> |Regex / NER| CleanedText["Scrubbed Text"]
        CleanedText --> |Prompt Classifier| RelStatus{"Relevance Category"}
        RelStatus --> |"Wishlist/Purchase Focus"| RelevantSignal["Relevant Signal"]
    end

    subgraph Step3["Stage 3: Embeddings & Clustering"]
        RelevantSignal --> |Vectorization| DenseVec["Dense Vector (1536-d)"]
        DenseVec --> |HDBSCAN Space| VectorCluster["Dense Vector Cluster Node"]
    end

    subgraph Step4["Stage 4: LLM Synthesis"]
        VectorCluster --> |Prompt Chain| ProblemNode["Structured Problem Node\n(Observation -> Friction -> Need)"]
    end

    subgraph Step5["Stage 5: Persona Analytics & Scoring"]
        ProblemNode --> |Segment & Demographics Mapper| PersonaData["Age / Tier / Frequency & Archetype Profiles"]
        PersonaData --> |OPS Calculation| OppCard["Prioritized Opportunity Card\n(OPS Score + Citations)"]
    end

    Step1 --> Step2 --> Step3 --> Step4 --> Step5
```

---

## 4. Component Details & Data Contracts

### 4.1 Data Contract: Input Feedback Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "InputFeedbackRecord",
  "type": "object",
  "properties": {
    "feedback_id": { "type": "string", "format": "uuid" },
    "source_platform": { "type": "string", "enum": ["play_store", "app_store", "reddit", "youtube", "custom_csv"] },
    "raw_text": { "type": "string", "minLength": 1 },
    "author_id": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" },
    "rating": { "type": ["number", "null"] },
    "product_category": { "type": ["string", "null"] },
    "url": { "type": ["string", "null"] },
    "age_group": { "type": ["string", "null"], "default": "25-34" },
    "city_tier": { "type": ["string", "null"], "default": "Tier 1" },
    "issue_frequency": { "type": ["string", "null"], "default": "2-3 issues/month" }
  },
  "required": ["feedback_id", "source_platform", "raw_text", "timestamp"]
}
```

### 4.2 Data Contract: Discovered Problem Node Schema
```json
{
  "problem_id": "PRB-2026-089",
  "problem_name": "Sizing Scale Discrepancy Across Brands",
  "surface_observation": "Users repeatedly mention that size M fits differently depending on the brand.",
  "underlying_barrier": "Lack of standardized real-world fit predictor for multi-brand fashion catalog.",
  "unmet_need": "High-confidence fit predictability prior to purchase commitment.",
  "confidence_level": "HIGH",
  "supporting_feedback_ids": ["fb_1029", "fb_3840", "fb_9921"]
}
```

### 4.3 Data Contract: Persona Analytics & Demographic Schema
```json
{
  "total_users_profiled": 500,
  "avg_issues_per_user_monthly": 2.9,
  "top_affected_demographic": "25-34 (Millennials, 44%)",
  "top_affected_tier": "Tier 1 Metros (45%) & Tier 2 Cities (38%)",
  "age_distribution": [
    { "age_group": "25-34 (Millennial)", "percentage": 44.0, "count": 220, "dominant_category": "Ethnic & Western Dresses" },
    { "age_group": "18-24 (Gen Z)", "percentage": 38.0, "count": 190, "dominant_category": "Topwear & Denim" },
    { "age_group": "35-44 (Mid-Career)", "percentage": 13.0, "count": 65, "dominant_category": "Workwear & Outerwear" },
    { "age_group": "45+ (Mature Buyers)", "percentage": 5.0, "count": 25, "dominant_category": "Sarees & Footwear" }
  ],
  "city_tier_distribution": [
    { "city_tier": "Tier 1 (Metros)", "percentage": 45.0, "count": 225, "primary_friction": "Cross-brand size variance" },
    { "city_tier": "Tier 2 (Emerging Cities)", "percentage": 38.0, "count": 190, "primary_friction": "Return friction & fabric doubt" },
    { "city_tier": "Tier 3+ (Towns & Regions)", "percentage": 17.0, "count": 85, "primary_friction": "Fabric wash durability & review mistrust" }
  ],
  "issue_frequency_breakdown": [
    { "frequency_range": "2-3 issues / month", "percentage": 53.0, "avg_monthly_issues": 2.6, "abandonment_risk": "High Risk (65% drop-off)" },
    { "frequency_range": "4+ issues / month (Chronic)", "percentage": 25.0, "avg_monthly_issues": 4.8, "abandonment_risk": "Severe Risk (82% drop-off)" },
    { "frequency_range": "1 issue / month (Occasional)", "percentage": 22.0, "avg_monthly_issues": 1.0, "abandonment_risk": "Moderate Risk (38% drop-off)" }
  ],
  "detailed_personas": [
    {
      "persona_id": "PER-01",
      "name": "Sneha Rao",
      "age_group": "18-24 (Gen Z)",
      "city_tier": "Tier 1 (Bengaluru)",
      "issue_frequency": "3.4 issues / month",
      "archetype": "Trend-Conscious Fast-Fashion Explorer",
      "primary_friction": "Cross-brand size inconsistency & studio photo color variance",
      "wishlist_abandonment_rate": "68%",
      "representative_quote": "I saved 5 denim jackets from 3 brands in my wishlist, but size M is tight in Mango and loose in Roadster...",
      "avatar_color": "#ff3f6c"
    }
  ]
}
```

---

## 5. Opportunity Scoring Architecture & Mathematical Engine

The **Opportunity Priority Score (OPS)** ranks discovered problems based on business value and conversion relevance:

$$\text{Opportunity Priority Score (OPS)} = F \times I \times CR \times EC$$

```mermaid
flowchart TD
    subgraph Inputs["Scoring Metric Inputs"]
        F_In["Frequency (F)\nMentions / Total Relevant %"]
        I_In["Impact (I)\nUser Friction Severity (1-10)"]
        CR_In["Conversion Relevance (CR)\n30-Day Drop-off Factor (0.1 - 1.0)"]
        EC_In["Evidence Confidence (EC)\nData Density & Cross-Source (0.1 - 1.0)"]
    end

    subgraph Computation["Scoring Engine Calculation"]
        F_Calc["F = min(10, Mention% * 0.5)"]
        I_Calc["I = Evaluated Severity Weight"]
        CR_Calc["CR = Wishlist Bottleneck Factor"]
        EC_Calc["EC = Source Consistency Score"]
        
        F_In --> F_Calc
        I_In --> I_Calc
        CR_In --> CR_Calc
        EC_In --> EC_Calc
        
        F_Calc & I_Calc & CR_Calc & EC_Calc --> Multiply["OPS = F * I * CR * EC"]
    end

    subgraph Output["Priority Tier Assignment"]
        Multiply --> TierCheck{"OPS Score Tier"}
        TierCheck --> |"OPS >= 40.0"| P1["Tier 1: High Priority Opportunity"]
        TierCheck --> |"20.0 <= OPS < 40.0"| P2["Tier 2: Medium Priority Opportunity"]
        TierCheck --> |"OPS < 20.0"| P3["Tier 3: Low Priority / Watchlist"]
    end
```

---

## 6. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor PM as Product Manager
    participant UI as PM Dashboard App
    participant Layer1 as Ingestion Service
    participant Layer2 as AI Processing Engine
    participant VectorDB as Vector Database
    participant Layer3 as Opportunity Intelligence Engine
    participant DB as Knowledge Store

    PM->>UI: Upload CSV Dataset / Fetch Live Reviews
    UI->>Layer1: POST /api/fetch-live-reviews or POST /api/analyze-csv
    Layer1->>Layer1: Parse CSV, Validate Schemas & Generate UUIDs + Demographics
    Layer1->>DB: Save Raw Records (Raw Feedback Store)
    Layer1->>Layer2: Trigger Analysis Job
    
    rect rgb(240, 248, 255)
        note over Layer2: AI Processing Pipeline Execution
        Layer2->>Layer2: Scrub PII, Remove Duplicates & Noise
        Layer2->>Layer2: Classify Relevance (Wishlist/Purchase Focus)
        Layer2->>VectorDB: Compute & Index Dense Embeddings
        VectorDB-->>Layer2: Return Density Clusters & Nearest Neighbors
        Layer2->>Layer2: Run LLM Root Cause Discovery Prompt Chain
    end

    Layer2->>Layer3: Pass Problem Nodes & Supporting Evidence
    
    rect rgb(255, 245, 238)
        note over Layer3: Intelligence, Demographics & Scoring Synthesis
        Layer3->>Layer3: Compute Age, City Tier & Frequency Persona Analytics
        Layer3->>Layer3: Execute OPS Mathematical Calculation
        Layer3->>Layer3: Enforce Discount & Anti-Hallucination Guardrails
        Layer3->>Layer3: Format PM-Ready Opportunity Report
    end

    Layer3->>DB: Save Prioritized Opportunities & Persona Analytics
    DB-->>UI: Return Final Discovery Report JSON
    UI-->>PM: Render Interactive Dashboard & User Persona Cards
```

---

## 7. Data Model & Traceability ER Diagram

```mermaid
erDiagram
    RAW_FEEDBACK ||--o{ CLEANED_SIGNAL : "sanitized into"
    CLEANED_SIGNAL }|--|| VECTOR_CLUSTER : "embedded into"
    VECTOR_CLUSTER ||--|| PROBLEM_NODE : "synthesized into"
    PROBLEM_NODE ||--|| OPPORTUNITY_CARD : "scored into"
    OPPORTUNITY_CARD ||--o{ PERSONA_ANALYTICS : "mapped to"
    OPPORTUNITY_CARD ||--o{ EVIDENCE_CITATION : "cites"

    RAW_FEEDBACK {
        uuid feedback_id PK
        string source_platform
        string raw_text
        string author_id
        string age_group
        string city_tier
        string issue_frequency
        datetime timestamp
    }

    CLEANED_SIGNAL {
        uuid signal_id PK
        uuid feedback_id FK
        string relevance_category
        string scrubbed_text
        string extracted_motivation
        string extracted_barrier
    }

    VECTOR_CLUSTER {
        uuid cluster_id PK
        float vector_centroid
        int sample_count
        float cluster_density
    }

    PROBLEM_NODE {
        uuid problem_id PK
        uuid cluster_id FK
        string problem_name
        string surface_observation
        string underlying_barrier
        string unmet_need
    }

    PERSONA_ANALYTICS {
        string top_demographic
        string top_tier
        float avg_issues_monthly
        json age_distribution
        json city_tier_distribution
        json issue_frequency_breakdown
        json detailed_personas
    }

    OPPORTUNITY_CARD {
        uuid opportunity_id PK
        uuid problem_id FK
        float ops_score
        float frequency_score
        int impact_rating
        float conversion_relevance
        string primary_segment
    }

    EVIDENCE_CITATION {
        uuid citation_id PK
        uuid opportunity_id FK
        uuid feedback_id FK
        string verbatim_quote
        string source_platform
    }
```

---

## 8. Safety, Privacy & Guardrail Gate Architecture Diagram

```mermaid
flowchart TD
    subgraph DataIn["Data Processing Stream"]
        InputText[Ingested Feedback Item]
    end

    subgraph Gate1["Gate 1: Privacy & Cleanliness"]
        InputText --> PII_Check{"PII / Email / Phone Detected?"}
        PII_Check --> |Yes| Redact[Redact PII Tokens]
        PII_Check --> |No| CleanPass[Pass Scrubbed Text]
        Redact --> CleanPass
    end

    subgraph Gate2["Gate 2: Citation Verification"]
        CleanPass --> ClusterProc[Cluster & Synthesize Problem]
        ClusterProc --> CitationCheck{"All Claims Backed by UUIDs?"}
        CitationCheck --> |No| FlagHallucination[Flag as Unsubstantiated & Drop]
        CitationCheck --> |Yes| ValidatedProblem[Pass Validated Problem]
    end

    subgraph Gate3["Gate 3: Strategic Guardrails"]
        ValidatedProblem --> SolutionCheck{"Primary Fix == Discount / Price Drop?"}
        SolutionCheck --> |Yes| FilterDiscount[Filter / Flag Strategy Constraint Violation]
        SolutionCheck --> |No| ReportPass[Approve for Opportunity Report]
    end

    subgraph Output["Output Storage"]
        ReportPass --> StoredReport[(Knowledge Store)]
    end
```

---

## 9. PM Analytics Dashboard Visual Wireframe Topology

```mermaid
block-beta
columns 3
    Header["PM Discovery Engine Header | Dataset: Synthetic_Fashion_Reviews.csv | Total Records: 500"]:3
    KPI1["Total Analyzed: 500"] KPI2["Wishlist Relevant: 215 (43.0%)"] KPI3["Discovered Opportunities: 5"]
    
    Matrix["Opportunity Priority Matrix\n(Plotting Impact vs. Conversion Relevance)"]:2 Demographics["User Persona Analytics\n- Age: 25-34 (44%), 18-24 (38%)\n- Tier: Tier 1 (45%), Tier 2 (38%)\n- Freq: 2-3 issues/mo (53%)"]:1
    
    OppList["Prioritized Opportunity Cards\n#1 Fit Predictability (OPS: 48.2)\n#2 Material Quality Trust (OPS: 36.4)\n#3 Real-World Styling Pairings (OPS: 28.1)"]:2 Personas["Detailed Persona Profiles\n- Sneha Rao (Gen Z, Tier 1)\n- Ananya Sharma (Millennial, Tier 2)\n- Rahul Mehta (Millennial, Tier 1)\n- Meera Joshi (Mid-Career, Tier 3+)"]:1
    
    Footer["Limitations & Validation Actions: Confirm Fit Predictability via Product Funnel Analytics & A/B Usability Test"]:3
```

---

## 10. Modular Repository Layout

```
graduation-project/
├── context.md                    # Core problem context & business domain
├── architecture.md               # Complete technical system & diagram specification
├── implementation_plan.md        # Feature roadmap & implementation phases
├── walkthrough.md                # System walkthrough & execution guide
├── data/
│   ├── raw/                      # Raw uploaded CSV files
│   └── processed/                # Normalized & scrubbed datasets
├── src/
│   ├── ingestion/                # CSV Parsers, Live Scrapers & Validators
│   │   ├── live_scraper.py
│   │   ├── csv_parser.py
│   │   └── schema_validator.py
│   ├── pipeline/                 # Core AI Processing Pipeline
│   │   ├── cleaner.py
│   │   ├── classifier.py
│   │   ├── extractor.py
│   │   └── clusterer.py
│   ├── intelligence/             # Scoring, Persona Analytics & Opportunity Synthesis
│   │   ├── root_cause.py
│   │   ├── segment_mapper.py
│   │   ├── scorer.py
│   │   └── report_generator.py
│   └── dashboard/                # Streamlit PM Dashboard Interface
│       └── app.py
├── frontend/                     # Next.js 14 Premium UI Dashboard App
│   ├── package.json
│   └── src/
│       ├── app/
│       │   └── page.tsx
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── UserSegments.tsx
│       │   ├── KPICards.tsx
│       │   └── ...
│       └── types/
│           └── index.ts
└── tests/                        # Automated unit & integration tests
```
