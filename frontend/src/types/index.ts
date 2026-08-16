export interface DiscoveredProblemNode {
  problem_id: string;
  problem_name: string;
  primary_vector: string;
  surface_observation: string;
  underlying_barrier: string;
  unmet_need: string;
  confidence_level: string;
  supporting_feedback_ids: string[];
  supporting_urls?: string[];
  supporting_authors?: string[];
  supporting_timestamps?: string[];
  verbatim_quotes: string[];
  mention_count: number;
}

export interface OpportunityCard {
  opportunity_id: string;
  problem_id: string;
  opportunity_title: string;
  primary_vector: string;
  ops_score: number;
  frequency_score: number;
  impact_rating: number;
  conversion_relevance: number;
  evidence_confidence: number;
  priority_tier: string;
  affected_segment: string;
  why_it_matters: string;
  problem_node: DiscoveredProblemNode;
}

export interface UserSegment {
  segment_id: string;
  segment_name: string;
  description: string;
  affected_problem_ids: string[];
  potential_impact: string;
  sample_proportion: number;
}

export interface UncertaintyMapItem {
  dimension: string;
  user_question: string;
}

export interface NextResearchItem {
  action: string;
  method: string;
}

export interface WishlistMotivation {
  motivation: string;
  percentage: number;
  intent: string;
}

export interface PMDiscoveryReport {
  report_title: string;
  generated_at: string;
  total_feedback_analyzed: number;
  relevant_feedback_count: number;
  relevance_ratio_pct: number;
  executive_summary: string;
  wishlist_behavior: {
    primary_motivations: WishlistMotivation[];
  };
  purchase_barriers: {
    top_friction_vectors: Array<{
      vector: string;
      severity: string;
      impact: string;
    }>;
  };
  uncertainty_map: UncertaintyMapItem[];
  user_segments: UserSegment[];
  top_opportunities: OpportunityCard[];
  unexpected_findings: string[];
  knowledge_gaps: string[];
  recommended_next_research: NextResearchItem[];
  data_limitation_notice: string;
}

export interface ComparativeOpportunityRow {
  opportunity_name: string;
  primary_vector: string;
  mention_count: number;
  share_pct: number;
  friction_impact: number;
  conversion_relevance: number;
  ops_score: number;
  primary_segment: string;
  conversion_impact_summary: string;
}

export interface ComparativeDiscoveryResponse {
  query: string;
  direct_analytical_answer: string;
  total_query_mentions: number;
  comparative_matrix: ComparativeOpportunityRow[];
  top_opportunities: OpportunityCard[];
  business_goal_impact: string;
}
