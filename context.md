# Context Document: AI-Powered Wishlist Purchase Discovery Engine

---

## 1. Project Overview & System Role

- **Project Title:** AI-Powered Wishlist Purchase Discovery Engine
- **Role of the AI System:** Functions as an **AI Product Discovery Analyst** (not merely a review summarizer or sentiment chatbot).
- **Target User:** Product Managers (PMs) at Myntra.
- **Core Objective:** Transform thousands of unstructured public user conversations into a small set of evidence-backed, quantified, and prioritized customer problems to improve the wishlist-to-purchase conversion rate.

---

## 2. Background & Business Goal

### Background
Myntra has millions of users browsing fashion items and adding products to their wishlists. Adding an item to a wishlist is an explicit expression of intent. However, a significant portion of wishlisted products fail to convert into a purchase within 30 days.

### Business Goal
Increase the percentage of users who purchase at least one item from their wishlist within 30 days of adding it.

### The Underlying Challenge
The exact reasons for this conversion gap are unknown. Product Managers must **not assume** that the problem is price, size, fit, reviews, styling, or any pre-defined hypothesis. 

---

## 3. Problem Statement & Core Discovery Question

### Problem Statement
Myntra lacks a scalable, evidence-based way to discover and prioritize the underlying customer problems preventing users from converting wishlisted fashion products into purchases within 30 days. 

User discussions are scattered across multiple public channels (App Store reviews, Google Play reviews, Reddit, YouTube comments, Q&A forums, social media). Manual analysis of these fragmented conversations is time-consuming, subjective, and fails to:
1. Identify recurring behavioral patterns.
2. Distinguish high-impact barriers from loud but low-impact complaints.
3. Understand segment-specific nuances.
4. Link discovered friction points directly to the 30-day conversion goal.

### Core Discovery Question
> *"Why do users add fashion products to their wishlist but fail to purchase at least one of those products within 30 days?"*

*The AI system must discover the answer purely from evidence rather than starting with predetermined assumptions.*

---

## 4. Core Discovery Themes (What the AI Agent Must Investigate)

The AI Discovery Engine investigates six primary vectors:

```
                                  ┌───────────────────────────┐
                                  │   Core Discovery Engine   │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────┐ ┌───────────────┐ ┌─────────────────┐
│ 1. Wishlist     │ │ 2. Purchase   │ │ 3. Information    │ │ 4. Decision   │ │ 5. User         │
│    Motivation   │ │    Barriers   │ │    Gaps           │ │    Behavior   │ │    Segmentation │
└─────────────────┘ └───────────────┘ └───────────────────┘ └───────────────┘ └─────────────────┘
```

### 1. Wishlist Motivation
Discovers why users wishlist products in the first place:
- Genuine purchase intent
- Bookmarking / saving for later
- Comparison holding area
- Waiting for specific occasions or events
- Waiting for additional information / validation
- Saving multiple styling alternatives

### 2. Purchase Barriers
Identifies friction preventing wishlist $\rightarrow$ purchase progression:
- Fit / size uncertainty
- Quality / material uncertainty
- Real-world appearance vs. catalog photo discrepancy
- Lack of trustworthy reviews or conflicting customer feedback
- Price hesitation / perceived value mismatch
- Styling & occasion uncertainty
- Return/exchange policy concerns
- Delivery timelines or availability issues
- Decision overload / choice fatigue
- Loss of purchase urgency

### 3. Information Gaps
Pinpoints what specific information users still search for after identifying a product they like:
- Fit & sizing accuracy
- Fabric composition, feel, and durability
- True appearance & color accuracy in natural lighting
- Real-user photos & videos
- Styling guidance & outfit pairing
- Occasion suitability & alternative recommendations

### 4. Decision-Making Behavior & External Research
- **Funnel Progression:** `Browse` $\rightarrow$ `Like` $\rightarrow$ `Wishlist` $\rightarrow$ `Evaluate` $\rightarrow$ `Compare` $\rightarrow$ `Decide` $\rightarrow$ `Purchase`. Identify exact drop-off stages.
- **External Channels:** Identify what users look for outside Myntra before committing (e.g., Google searches, Reddit discussions, YouTube haul reviews, Instagram styling posts, competing fashion platforms).

### 5. User Segmentation
Discovers distinct behavioral segments from evidence rather than pre-defining them:
- *High-intent shoppers* vs. *Exploratory shoppers*
- *Comparison shoppers* vs. *Fit-conscious shoppers*
- *Occasion-driven shoppers* vs. *Price-sensitive shoppers*
- *Social-validation seekers*

---

## 5. End-to-End AI Discovery Workflow

The discovery process follows a 10-step sequential pipeline:

```
Collect ──► Clean ──► Classify ──► Extract ──► Cluster ──► Quantify ──► Root Causes ──► Segment ──► Prioritize ──► Insights
```

| Step | Stage | Action & Methodology |
| :--- | :--- | :--- |
| **Step 1** | **Collect** | Ingest public fashion conversations (Google Play, App Store, Reddit, YouTube, Forums, Q&A). In MVP, ingest via CSV upload. |
| **Step 2** | **Clean** | Remove duplicates, spam, ads, empty text, non-shopping noise, while preserving original raw evidence. |
| **Step 3** | **Classify** | Categorize relevance (Wishlist/Purchase relevant, Fashion decision relevant, Potentially relevant, Irrelevant) with explicit AI reasoning. |
| **Step 4** | **Extract** | Extract granular behavioral signals (Product interest, wishlist action, purchase intent, hesitation, info-seeking, abandoned purchase). |
| **Step 5** | **Discover Problems** | Semantic AI clustering to identify emerging themes without forcing into predefined taxonomy. Each problem tracks: Name, Description, User Need, Trigger, Barrier, Segment, Evidence, Confidence Level. |
| **Step 6** | **Quantify** | Compute metrics: mention count, % of relevant feedback, unique users/sources, platforms, affected categories, trend, severity. Explicitly mark *"Insufficient evidence"* where data is sparse. |
| **Step 7** | **Identify Root Causes** | Move beyond surface complaints. Distinguish between **Observation** $\rightarrow$ **Interpretation** $\rightarrow$ **Hypothesis**. (e.g., Surface: "Mentions size" $\rightarrow$ Root: "Uncertainty if displayed measurements predict real fit" $\rightarrow$ Unmet Need: "Higher fit confidence before buying"). |
| **Step 8** | **Segment** | Map problems to evidence-derived user segments to assess targeted impact. |
| **Step 9** | **Prioritize Opportunities** | Rank using the Opportunity Priority Formula (does not rely on frequency alone). |
| **Step 10** | **Generate Opportunities** | Formulate PM-ready opportunity statements detailing problem, segment, evidence volume, impact, conversion relevance, confidence, and validation steps. |

---

## 6. Opportunity Prioritization Formula

To ensure high-volume/loud complaints do not drown out critical conversion blockers, opportunities are scored mathematically:

$$\text{Opportunity Priority Score} = \text{Frequency} \times \text{Impact} \times \text{Conversion Relevance} \times \text{Evidence Confidence}$$

- **Frequency:** How commonly the problem appears across feedback data.
- **Impact:** Potential severity of the barrier to the customer.
- **Conversion Relevance:** How directly the barrier prevents a wishlist-to-purchase action within 30 days.
- **Evidence Confidence:** Strength, density, and consistency of supporting public evidence.

*Secondary factors considered:* User segment strategic importance, trend velocity, and estimated effort to resolve.

---

## 7. Expected Discovery Output & Report Structure

The final output is a PM-Ready Discovery Report structured into 10 key sections:

1. **Executive Summary:** Top high-potential discovered opportunities.
2. **Wishlist Behavior:** Empirical breakdown of why users wishlist products.
3. **Purchase Barriers:** Analysis of non-conversion causes.
4. **Uncertainty Map:** Visual/structured mapping of user pre-purchase hesitations.
5. **User Segments:** Discovered shopper archetypes and their specific friction points.
6. **Opportunity Ranking:** Prioritized opportunity matrix scored by conversion relevance and evidence.
7. **Evidence Explorer:** Direct source-linked quotes and conversations validating each insight.
8. **Unexpected Findings:** Unanticipated customer problems outside initial hypotheses.
9. **Knowledge Gaps:** Explicit documentation of what public data *cannot* answer.
10. **Recommended Next Research:** Actionable validation steps (user interviews, analytics funnels, A/B tests, usability testing).

---

## 8. Non-Negotiable System Constraints & Guardrails

1. **No Predetermined Assumptions:** Must discover customer problems from data, not pre-set templates.
2. **No Premature Solutions:** Must define customer problems and needs first; do not jump straight to features.
3. **Beyond Sentiment & Keyword Matching:** Uses semantic understanding rather than plain keyword counts or positive/negative sentiment scores.
4. **Frequency $\neq$ Priority:** Must not prioritize problems purely because they are frequently mentioned.
5. **Zero Hallucination Policy:** Never invent statistics, quotes, or metrics. Mark missing data as *"Insufficient evidence"*.
6. **Traceability:** Maintain direct mapping from high-level insights down to raw source feedback.
7. **Separation of Concerns:** Explicitly separate *Facts*, *Observations*, *Hypotheses*, and *Conclusions*.
8. **Goal Alignment:** Every opportunity must connect back to the **30-day wishlist-to-purchase conversion goal**.
9. **No Price/Discount Traps:** Must **NOT** recommend monetary incentives (discounts, coupons, cashbacks, price drops) as the primary solution. Focus on product experience, information, trust, and usability friction.
10. **Silent Majority & Data Limitations:** Must explicitly acknowledge that public feedback represents an active vocal minority and recommend validating findings against product analytics.

---

## 9. Architectural Roadmap & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           System Production Architecture                        │
├───────────────────────────────────┬─────────────────────────────────────────────┤
│ Core Engine & Backend REST API    │ Production Frontend Dashboards              │
├───────────────────────────────────┼─────────────────────────────────────────────┤
│ • Ingestion Engine & Auto-Gen:    │ • Primary Stack: Next.js 14 (App Router)    │
│   - CSV Dataset Upload Parser     │   - React 18 + TypeScript                   │
│   - Synthetic Data Auto-Generator │   - Tailwind CSS Glassmorphism Design       │
│     (100 - 1,000 feedback items)  │   - Framer Motion Micro-Animations          │
│ • AI Processing Pipeline:         │   - Recharts Priority Matrix Scatter Plot   │
│   - PII Scrubbing & Deduplication │   - Slide-over Verbatim Evidence Drawer     │
│   - 4-Tier Relevance Classifier   │ • Alternative Stack: Streamlit UI           │
│   - Vector Embedding & Clustering │   - Python-native analytics dashboard       │
│   - LLM Root Cause Synthesizer    │ • REST API Middleware:                      │
│ • Intelligence & Guardrail Engine:│   - FastAPI server (`src/api/main.py`)      │
│   - Opportunity Priority Scoring  │   - CORS enabled, streaming API endpoints   │
│   - Anti-Discount & Traceability  │                                             │
└───────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 10. Summary of Success Criteria

The Discovery Engine is deemed successful when a Product Manager can transition seamlessly from:
$$\text{Thousands of Unstructured Public Conversations} \implies \text{Evidence-Backed Customer Problems} \implies \text{Prioritized Actionable Opportunities}$$
enabling targeted research and product interventions to unlock 30-day wishlist purchase conversions.
