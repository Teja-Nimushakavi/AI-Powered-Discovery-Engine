# Corner Scenarios & Edge Cases Specification: AI-Powered Wishlist Purchase Discovery Engine

---

## 1. Overview & Edge Case Philosophy

The **AI-Powered Wishlist Purchase Discovery Engine** processes uncurated, highly volatile public user feedback. To guarantee production robustness, deterministic intelligence, and zero AI hallucinations, the system must handle edge cases gracefully across all 4 operational layers.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          System Resilience Matrix                               │
├───────────────────┬──────────────────────────────────┬──────────────────────────┤
│ Edge Case Domain  │ Primary Risk                     │ Technical Mitigation     │
├───────────────────┼──────────────────────────────────┼──────────────────────────┤
│ 1. Ingestion      │ Malformed data / crash           │ Encoding fallback &      │
│                   │                                  │ Pydantic validation      │
├───────────────────┼──────────────────────────────────┼──────────────────────────┤
│ 2. Pipeline       │ Noise / Sarcasm / Code-Mixing    │ Sanitization, NER &      │
│                   │                                  │ Multilingual Embeddings  │
├───────────────────┼──────────────────────────────────┼──────────────────────────┤
│ 3. Scoring Math   │ Division-by-Zero / Skewed Ratios │ Bounded Score Math &     │
│                   │                                  │ Minimum Sample Thresholds│
├───────────────────┼──────────────────────────────────┼──────────────────────────┤
│ 4. Guardrails     │ Hallucination / Price Traps      │ Citation Verification &  │
│                   │                                  │ Anti-Discount Filter     │
└───────────────────┴──────────────────────────────────┴──────────────────────────┘
```

---

## 2. Layer 1: Data Ingestion & Storage Corner Scenarios

### EC-1.1: Malformed, Corrupted, or Encoding-Mismatched CSVs
- **Scenario:** Uploaded file uses `UTF-16`, `Windows-1252`, contains binary null bytes, unescaped quotes inside text fields, or missing headers.
- **System Impact:** CSV parsing crash (`UnicodeDecodeError`, `ParserError`).
- **Mitigation:**
  - `CSVParser` executes progressive fallback encoding checks (`utf-8` $\rightarrow$ `utf-8-sig` $\rightarrow$ `latin1` $\rightarrow$ `cp1252`) with `errors='replace'`.
  - Flexible header mapping auto-detects synonyms (`comment`, `review`, `feedback`, `content`, `text`).
  - Raises structured user-facing error: `"CSV format unreadable. Please ensure standard UTF-8 CSV formatting."`

### EC-1.2: Completely Empty or Single-Row Datasets
- **Scenario:** Input CSV contains 0 data rows (header only) or exactly 1 feedback row ($N=1$).
- **System Impact:** Division-by-zero errors in percentage calculations ($\frac{\text{mentions}}{0}$).
- **Mitigation:**
  - Ingestion validator checks $N \ge 1$. If $N=0$, halts early with alert: `"Dataset is empty. Upload a CSV with at least 1 record."`
  - In OPS math, denominator is enforced as `max(1, total_relevant_count)` to prevent zero division.

### EC-1.3: Ultra-Large Dataset Memory Pressure
- **Scenario:** PM uploads a 500,000-row CSV file exceeding available RAM.
- **System Impact:** Out-Of-Memory (OOM) process crash.
- **Mitigation:**
  - Chunked ingestion processing via `pandas.read_csv(chunksize=5000)`.
  - Hard cap configuration: `DEFAULT_MAX_RECORDS = 50000` per discovery run in MVP mode with explicit truncating warning.

### EC-1.4: Extreme Text Lengths (Micro vs. Macro Feedback)
- **Scenario:**
  - *Micro Text:* 1-character string (`"a"`, `"?"`, `"👍"`).
  - *Macro Text:* 50,000-character novel pasted into a review field.
- **System Impact:** Micro text pollutes signal extraction; macro text exceeds LLM context window limits and spikes API costs.
- **Mitigation:**
  - `DataCleaner` filters out text shorter than 15 characters.
  - Text longer than 2,000 characters is truncated with `[TRUNCATED_FOR_ANALYSIS]` append.

### EC-1.5: Zero External File Upload (Auto-Generation Trigger)
- **Scenario:** User opens the application without providing or uploading any external CSV file.
- **System Impact:** Pipeline halts due to missing input data stream.
- **Mitigation:**
  - `SyntheticDataGenerator` automatically triggers on default app launch, constructing a 500-record dataset covering all 6 discovery vectors (Fit, Fabric, Photos, Styling, Review Trust, Occasions, and Noise).
  - Streamlit dashboard displays an alert banner explaining that Auto-Generated Mode is active.

### EC-1.6: Synthetic Template Overlap & Pattern Skew
- **Scenario:** Synthetic dataset generator produces repetitive text templates causing artificial single-vector clustering skew.
- **System Impact:** Artificial spike in 1 specific friction vector.
- **Mitigation:**
  - Multi-template stochastic randomizer incorporating randomized category terms, brand names, size metrics, platforms, ratings, and realistic noise ratios (7% non-shopping noise/spam).

---

## 3. Layer 2: AI Processing Pipeline Corner Scenarios

### EC-2.1: Obfuscated or Evasive PII
- **Scenario:** Users post contact info attempting to bypass standard regex filters (e.g., `"john [at] gmail [dot] com"`, `"987-six-five-four-321"`, `"insta @fashion_user"`).
- **System Impact:** Exposure of private personal data in public PM reports.
- **Mitigation:**
  - Multi-pattern regex combining email, phone, handle, and link expressions.
  - Secondary Named Entity Recognition (NER) token scrub for `PERSON` and `CONTACT` entities.

### EC-2.2: Multilingual & Code-Mixed Text (e.g., Hinglish)
- **Scenario:** Comments written in mixed languages (e.g., *"Is dress ka size bohot chota hai, fitting is terrible, will not buy from wishlist"*).
- **System Impact:** Keyword classifiers fail to detect non-English fashion terms (`chota`, `kharab`, `kapda`).
- **Mitigation:**
  - Use of multilingual semantic vector embeddings (`paraphrase-multilingual-mpnet-base-v2` / OpenAI `text-embedding-3`).
  - Embeddings map `"chota fit"` and `"small fit"` into close vector space proximity regardless of language.

### EC-2.3: Sarcasm, Irony, and Negation Inversion
- **Scenario:** Sarcastic feedback (e.g., *"Great dress if you enjoy looking like a potato sack!"* or *"Wonderful quality, tore on day 1!"*).
- **System Impact:** Traditional sentiment analyzers classify `"Great dress"` and `"Wonderful quality"` as positive wishlist indicators.
- **Mitigation:**
  - System bypasses naive sentiment scoring completely.
  - Relies on **Semantic Barrier Extraction** which extracts `"tore on day 1"` $\rightarrow$ `Fabric Durability Barrier` irrespective of initial positive adjectives.

### EC-2.4: Zero Relevant Signals Found in Entire Dataset
- **Scenario:** Ingested CSV contains 10,000 comments, but all are delivery logistics complaints (`"delivery boy late"`), app crash reports, or payment UPI errors.
- **System Impact:** Pipeline produces empty problem clusters.
- **Mitigation:**
  - `RelevanceClassifier` routes all 10,000 records to `irrelevant` or `potentially_relevant` noise archive.
  - Dashboard displays state: `"0 Wishlist-Relevant Conversion Signals Discovered. Check if input dataset contains product evaluation discussions."`

### EC-2.5: Bot Spamming & Exact Duplicate Flooding
- **Scenario:** Competitor or bot submits 2,000 identical reviews (`"Worst app don't buy"`).
- **System Impact:** Skews frequency metric ($F$) and distorts problem ranking.
- **Mitigation:**
  - Exact MD5 hash deduplication combined with 95% Cosine Similarity deduplication at cleaning stage.
  - Excess identical records collapsed into a single instance with `duplicate_count` metadata tag.

---

## 4. Layer 3: Opportunity Intelligence & Scoring Corner Scenarios

### EC-3.1: The "Loud Complaint" vs. "High Conversion Impact" Mismatch
- **Scenario:** 70% of users complain about slow delivery tracking (high frequency, low conversion relevance), while 4% of users mention unusable size charts preventing a $200 jacket wishlist purchase (low frequency, critical conversion barrier).
- **System Impact:** Traditional frequency ranking prioritizes delivery tracking UI over the true conversion blocker.
- **Mitigation:**
  - Enforced mathematical weighting in the Opportunity Priority Score (OPS):
    $$\text{OPS} = F \times I \times CR \times EC$$
  - Conversion Relevance ($CR$) for delivery tracking is weighted low ($CR = 0.30$), whereas sizing predictability is weighted high ($CR = 0.95$), mathematically elevating the true conversion barrier.

### EC-3.2: The Price & Discount Trap (80% Demand for Coupons)
- **Scenario:** Massive volume of user feedback states: `"Make it 50% cheaper"`, `"Give free coupon"`, or `"Price drop needed"`.
- **System Impact:** AI recommends price discounts, violating business strategy constraint #11.
- **Mitigation:**
  - **Anti-Discount Guardrail Gate ([guardrails.py](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/src/intelligence/guardrails.py)):** Scans all opportunity titles and recommendations for discount/monetary terms (`discount`, `coupon`, `cashback`, `price drop`).
  - Intercepts and filters out pure price cut recommendations, re-focusing analysis on *perceived value mismatch*, *fabric transparency*, or *quality trust*.

### EC-3.3: Equal Score Tie-Breakers
- **Scenario:** Two distinct opportunities calculate to the exact same OPS score (e.g. `OPS = 36.40`).
- **System Impact:** Unstable or non-deterministic report ordering.
- **Mitigation:**
  - Secondary tie-breaker sorting:
    1. Highest `Conversion Relevance (CR)`
    2. Highest `Impact Rating (I)`
    3. Highest `Evidence Count`

### EC-3.4: Isolated Single-User Problem (Outlier Distortion)
- **Scenario:** 1 user writes a 2,000-word complaint about a zipper glitch on SKU #9012.
- **System Impact:** LLM synthesizes an elaborate problem node for an isolated non-recurring issue.
- **Mitigation:**
  - Clusterer enforces minimum sample threshold (`min_cluster_size >= 2`).
  - Single-user complaints marked as `LOW` confidence and placed in Watchlist Tier 3 rather than Top Opportunities.

---

## 5. Layer 4: Presentation & Guardrail Corner Scenarios

### EC-5.1: AI Quote Hallucination / Unsubstantiated Claims
- **Scenario:** LLM generates a plausible customer quote that does not actually exist in the raw dataset.
- **System Impact:** Loss of trust by Product Managers.
- **Mitigation:**
  - **Citation Traceability Verification Gate:** Checks every verbatim quote against the raw SQLite database using immutable `feedback_id` UUIDs.
  - If a quote cannot be verified against an ingested `feedback_id`, it is dropped from the report before rendering.

### EC-5.2: Public Data Bias (The Silent Majority Trap)
- **Scenario:** PM assumes public feedback represents 100% of wishlisting users, ignoring silent non-commenting shoppers.
- **System Impact:** Misguided product feature investments based solely on vocal review posters.
- **Mitigation:**
  - Mandatory **Silent Majority Alert Banner** attached to every generated report:
    > *"LIMITATION NOTICE: Public feedback represents an active vocal minority. Validate all discovered opportunities against internal checkout analytics and A/B usability tests prior to engineering deployment."*

---

## 6. Matrix Summary of Test Verification for Edge Cases

| Test Case | Edge Case Covered | Expected Behavior |
| :--- | :--- | :--- |
| `test_empty_csv` | EC-1.2 Empty Dataset | Halts with user error; zero division prevented |
| `test_pii_redaction` | EC-2.1 Obfuscated PII | Redacts emails, phone numbers, and web links |
| `test_anti_discount_gate` | EC-3.2 Price Trap | Flags & filters out discount/coupon recommendations |
| `test_citation_traceability`| EC-5.1 Quote Hallucination | Rejects quotes not mapping to ingested UUIDs |
| `test_hinglish_embedding` | EC-2.2 Code-Mixed Text | Correctly clusters Hinglish fit complaints with English fit complaints |
