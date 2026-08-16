import os
import json
import pandas as pd
import streamlit as st

from src.ingestion.csv_parser import CSVParser
from src.ingestion.synthetic_generator import SyntheticDataGenerator
from src.pipeline.cleaner import DataCleaner
from src.pipeline.classifier import RelevanceClassifier
from src.pipeline.extractor import SignalExtractor
from src.pipeline.clusterer import SemanticClusterer
from src.pipeline.root_cause import RootCauseSynthesizer
from src.intelligence.scorer import OpportunityScorer
from src.intelligence.segment_mapper import SegmentMapper
from src.intelligence.report_generator import ReportGenerator

# Page Configuration
st.set_page_config(
    page_title="Myntra Wishlist Purchase Discovery Engine",
    page_icon="🛍️",
    layout="wide"
)

# Custom Styling
st.markdown("""
    <style>
    .main-header { font-size: 2.2rem; font-weight: 700; color: #ff3f6c; margin-bottom: 0.5rem; }
    .sub-header { font-size: 1.1rem; color: #535766; margin-bottom: 1.5rem; }
    .metric-card { background: #f5f5f6; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff3f6c; }
    .synthetic-banner { background: #fff0f3; padding: 0.8rem 1.2rem; border-radius: 8px; border: 1px solid #ff3f6c; color: #d32f2f; margin-bottom: 1rem; }
    </style>
""", unsafe_allow_html=True)


def run_pipeline(file_or_path):
    # Layer 1: Ingestion
    parser = CSVParser()
    records, meta = parser.parse_csv(file_or_path)

    # Layer 2: Pipeline
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

    # Layer 3: Intelligence
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


def main():
    st.markdown('<div class="main-header">AI-Powered Wishlist Purchase Discovery Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Discover, Quantify, and Prioritize Customer Conversion Barriers from Public User Feedback</div>', unsafe_allow_html=True)

    # Sidebar Controls
    st.sidebar.header("⚙️ Data Source Controls")
    
    data_option = st.sidebar.radio(
        "Select Data Source:",
        ["✨ Auto-Generate Synthetic Dataset", "📁 Upload Custom CSV File"],
        index=0
    )

    sample_size = 500
    target_input = None
    is_synthetic = False

    if data_option == "✨ Auto-Generate Synthetic Dataset":
        is_synthetic = True
        sample_size = st.sidebar.slider("Number of Feedback Conversations to Generate:", min_value=100, max_value=1000, value=500, step=100)
        gen_button = st.sidebar.button("🔄 Regenerate Synthetic Data", use_container_width=True)
        
        synth_path = "./data/raw/synthetic_fashion_reviews.csv"
        
        if gen_button or not os.path.exists(synth_path):
            generator = SyntheticDataGenerator()
            generator.generate_csv(synth_path, count=sample_size)
            st.sidebar.success(f"Generated {sample_size} synthetic feedback records!")
        
        target_input = synth_path

    else:
        uploaded_file = st.sidebar.file_uploader("Upload Fashion Reviews CSV", type=["csv"])
        if uploaded_file is not None:
            target_input = uploaded_file

    if target_input is None:
        st.info("👈 Please select a data source from the sidebar to proceed.")
        return

    if is_synthetic:
        st.markdown(
            f'<div class="synthetic-banner">🤖 <b>Auto-Generated Data Mode Active:</b> Engine has automatically generated <b>{sample_size}</b> '
            f'realistic public fashion conversations simulating user feedback from App Store, Google Play, Reddit, YouTube, and Q&A forums.</div>',
            unsafe_allow_html=True
        )

    with st.spinner("Processing feedback through AI Discovery Pipeline..."):
        report = run_pipeline(target_input)

    # Top KPI Metrics Banner
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Total Conversations Analyzed", f"{report.total_feedback_analyzed:,}")
    m2.metric("Relevant Purchase Signals", f"{report.relevant_feedback_count:,}")
    m3.metric("Relevance Ratio", f"{report.relevance_ratio_pct}%")
    m4.metric("Discovered Opportunities", len(report.top_opportunities))

    st.markdown("---")

    # Executive Summary Alert Box
    st.success(f"**Executive Summary:** {report.executive_summary}")

    # Main Tabs Layout
    tab1, tab2, tab3, tab4 = st.tabs([
        "🎯 Prioritized Opportunity Matrix",
        "🔍 Traceable Evidence Explorer",
        "👥 User Segments & Uncertainty Map",
        "💡 Knowledge Gaps & Validation Actions"
    ])

    with tab1:
        st.subheader("Discovered Opportunities Ranked by Opportunity Priority Score (OPS)")
        st.caption("OPS = Frequency x Impact x Conversion Relevance x Evidence Confidence")

        if report.top_opportunities:
            table_data = []
            for opp in report.top_opportunities:
                table_data.append({
                    "Opportunity ID": opp.opportunity_id,
                    "Opportunity Title": opp.opportunity_title,
                    "Primary Friction Vector": opp.primary_vector,
                    "OPS Score": opp.ops_score,
                    "Priority Tier": opp.priority_tier,
                    "Mentions": opp.problem_node.mention_count,
                    "Confidence": opp.evidence_confidence
                })

            df_opps = pd.DataFrame(table_data)
            st.dataframe(df_opps, use_container_width=True, hide_index=True)

            st.markdown("### Deep Dive: Opportunity Cards")
            for opp in report.top_opportunities:
                with st.expander(f"{opp.priority_tier} | {opp.opportunity_title} (OPS: {opp.ops_score})"):
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.markdown(f"**Surface Observation:** {opp.problem_node.surface_observation}")
                        st.markdown(f"**Underlying Barrier:** {opp.problem_node.underlying_barrier}")
                        st.markdown(f"**Unmet Customer Need:** {opp.problem_node.unmet_need}")
                    with col_b:
                        st.markdown(f"**Why it Matters:** {opp.why_it_matters}")
                        st.markdown(f"**Affected Segment:** {opp.affected_segment}")
                        st.markdown(f"**Supporting Quotes Count:** {len(opp.problem_node.verbatim_quotes)}")
        else:
            st.warning("No opportunities meet the confidence threshold.")

    with tab2:
        st.subheader("Source-Linked Verbatim Evidence")
        st.caption("Traceability Index: Verify raw quotes supporting each opportunity.")

        for opp in report.top_opportunities:
            st.markdown(f"#### {opp.opportunity_title} (Supporting Feedback IDs: {len(opp.problem_node.supporting_feedback_ids)})")
            for idx, quote in enumerate(opp.problem_node.verbatim_quotes, 1):
                st.markdown(f"> *\"{quote}\"*")
                if idx <= len(opp.problem_node.supporting_feedback_ids):
                    st.caption(f"📍 Source Feedback ID: `{opp.problem_node.supporting_feedback_ids[idx-1]}`")
            st.markdown("---")

    with tab3:
        st.subheader("Discovered User Segments & Pre-Purchase Uncertainty Map")

        c1, c2 = st.columns(2)
        with c1:
            st.markdown("### Discovered User Segments")
            for seg in report.user_segments:
                st.markdown(f"**{seg.segment_name}** ({int(seg.sample_proportion*100)}% of sample)")
                st.write(seg.description)
                st.caption(f"Potential Impact: {seg.potential_impact}")
                st.markdown("---")

        with c2:
            st.markdown("### Pre-Purchase Uncertainty Questions")
            for item in report.uncertainty_map:
                st.markdown(f"**{item['dimension']}**")
                st.info(f"❓ *\"{item['user_question']}\"*")

    with tab4:
        st.subheader("Knowledge Gaps & Recommended Validation Actions")

        g1, g2 = st.columns(2)
        with g1:
            st.markdown("### Public Data Knowledge Gaps")
            for gap in report.knowledge_gaps:
                st.warning(f"⚠️ {gap}")

        with g2:
            st.markdown("### Recommended Next Validation Actions")
            for rec in report.recommended_next_research:
                st.markdown(f"**{rec['action']}**")
                st.write(rec['method'])
                st.markdown("---")

    st.markdown("---")
    st.caption(report.data_limitation_notice)


if __name__ == "__main__":
    main()
