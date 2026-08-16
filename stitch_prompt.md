# Single Desktop Prompt Specification: AI-Powered Wishlist Purchase Discovery Engine

Below is a single, self-contained, copy-pasteable prompt specifically tailored for **Google Stitch** (or Figma AI / v0.dev / Midjourney) to generate the **1440px Desktop Web Version** UI prototype derived strictly from [`context.md`](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/context.md) and [`architecture.md`](file:///c:/Users/Teja/OneDrive/Desktop/Next%20leap/Graduation%20project/architecture.md).

---

```text
Design a high-fidelity 1440px Desktop Web Application UI for an e-commerce Product Management dashboard called "Myntra Wishlist Purchase Discovery Engine".

### 1. Desktop Canvas & Theme Specification
- Viewport Target: 1440px Widescreen Desktop Web Browser.
- Visual Theme: Premium E-Commerce Dark Slate Analytics Dashboard (Inspired by Shadcn UI and Myntra Design System).
- Background: Deep Dark Slate (#0f172a to #020617 gradient).
- Glassmorphism Surfaces: Semi-transparent dark slate panels (rgba(30, 41, 59, 0.7)) with thin 1px slate borders (#334155), soft backdrop blur, and rounded-2xl corners.
- Brand Accents: Myntra Signature Pink (#ff3f6c), Emerald Green (#10b981), Amber Gold (#f59e0b), and Electric Blue (#3b82f6).
- Typography: Inter/Outfit sans-serif, bold metric typography, crisp uppercase status badges.

---

### 2. Sticky Desktop Header Bar
- Left Section: Myntra shopping bag logo in a glowing pink gradient box. Title: "Myntra Wishlist Discovery Engine" with a pink pill badge "AI Discovery Agent v1.0". Subtitle: "Evidence-based purchase barrier discovery for Product Managers".
- Right Control Bar:
  - Segmented Control Switch: "✨ Auto-Generate Synthetic" (active pink state) vs "📁 Upload CSV File".
  - Slider Control: "Records: 500" with a smooth range slider bar (100 to 1,000).
  - Button: "Regenerate Dataset" in dark slate with pink border.
  - Icon Toggle: Light/Dark theme mode toggle.

---

### 3. Executive KPI Metric Banner (4 Horizontal Desktop Cards)
- Card 1: "10,450" (Total Conversations Analyzed) | Chat Bubble Icon in Blue Box.
- Card 2: "4,120" (Wishlist Purchase Signals - Emerald text) | Target Icon in Green Box.
- Card 3: "39.4%" (Relevance Ratio - Pink text) | Pie Chart Icon in Pink Box.
- Card 4: "5" (Discovered Opportunities - Gold text) | Lightbulb Icon in Gold Box.

---

### 4. Executive Summary Callout Banner
- Full-width glassmorphism alert box with a thin rose border and sparkle icon.
- Content: "Executive Summary: Analyzed 10,450 raw customer conversations, discovering 4,120 wishlist-relevant purchase signals (39.4% relevance ratio). Synthesized 5 primary opportunity areas. The top friction blocking 30-day wishlist purchase conversion is 'Fit Scale Discrepancy Across Brands' (OPS Score: 48.2)."

---

### 5. Main Desktop Workspace (2-Column Grid)

#### Left Column (1/3 Width - 420px) — Opportunity Priority Matrix:
- Header: "Opportunity Priority Matrix" | Subtitle: "Friction Impact (Y) vs. 30-Day Conversion Relevance (X)".
- Recharts Scatter Plot:
  - Y-Axis: "Customer Friction Impact (1-10)" | X-Axis: "30-Day Conversion Relevance (0.1 - 1.0)".
  - Scatter Data Points: Color-coded nodes (Tier 1 Glowing Pink, Tier 2 Gold, Tier 3 Blue), sized by OPS Priority Score.
  - Floating Web Tooltip on hover showing Opportunity Title, OPS Score, and metrics.

#### Right Column (2/3 Width - 880px) — Prioritized Opportunity Cards:
- Header: "Prioritized Customer Conversion Opportunities".
- Render 3-4 interactive opportunity cards stacked vertically:
  - Card 1 (Top Priority):
    - Header: Badge "TIER 1: HIGH PRIORITY" (Pink) | Title: "Resolve Fit Scale Discrepancy Across Brands" | OPS Score: "48.2".
    - Inner Triad Panel:
      - Surface Observation: "Users repeatedly mention size M fits differently depending on the brand."
      - Underlying Barrier (Pink): "Lack of standardized real-world fit predictor for multi-brand catalog."
      - Unmet Customer Need (Emerald): "High-confidence fit predictability prior to purchase commitment."
    - Footer: "1,820 Mentions" | "Fit-Conscious Shoppers" | Link: "Explore Evidence →".

---

### 6. Slide-Over Evidence Explorer Drawer Overlay
- Position: Right-aligned slide-over drawer modal (`w-[550px]` fixed on right).
- Header: "Evidence Explorer | Resolve Fit Scale Discrepancy Across Brands" + Close ('X') button.
- Traceability Badge: "Verified Traceability: All quotes mapped to validated feedback UUIDs".
- Customer Verbatims Feed:
  - Quote 1: "I added this floral dress to my wishlist 3 weeks ago but I'm terrified to order because size M fits completely differently in Mango compared to Roadster. Size chart is super confusing!" | ID: `fb_1029` | Source: Play Store.
  - Quote 2: "Is size 30 true to size for these denim jeans? Kept them in wishlist for a month but scared to buy due to exchange hassle." | ID: `fb_3840` | Source: Reddit.

---

### 7. User Segments & Pre-Purchase Uncertainty Map (2 Columns)
- Left Column: "Discovered User Segments" — Archetype cards (*Fit-Conscious Shoppers (42%)*, *Material & Quality Skeptics (28%)*, *Occasion Seekers (18%)*).
- Right Column: "Pre-Purchase Uncertainty Map" — Question callouts (*"Will size M fit my waist accurately?"*, *"Is the material breathable cotton or polyester?"*).

---

### 8. Knowledge Gaps & Actionable Validation Section
- Left Panel: "Public Data Knowledge Gaps" (Warning alerts highlighting public review limitations).
- Right Panel: "Recommended Next Research" (PM validation steps like "A/B Test Interactive Size Predictor on High-Wishlist Apparel").
- Footer Notice: "LIMITATION NOTICE: Public feedback represents an active vocal minority. Validate all discovered opportunities against internal checkout analytics and A/B usability tests prior to engineering deployment."
```
