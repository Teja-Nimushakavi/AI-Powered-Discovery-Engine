"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Users } from "lucide-react";
import { OpportunityCard } from "@/types";

interface OpportunityListProps {
  opportunities: OpportunityCard[];
  onSelectOpportunity: (opp: OpportunityCard) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-lg font-bold text-white tracking-tight">
            Prioritized Customer Conversion Opportunities
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Ranked by Opportunity Priority Score (OPS = Frequency x Impact x Conversion Relevance x Evidence Confidence)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp, idx) => {
          const isTier1 = opp.priority_tier.includes("Tier 1");

          return (
            <motion.div
              key={opp.opportunity_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelectOpportunity(opp)}
              className={`glass-panel p-5 rounded-2xl border-l-4 cursor-pointer glass-panel-hover group flex flex-col justify-between ${
                isTier1 ? "border-l-[#ff3f6c]" : "border-l-[#fbbf24]"
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isTier1
                          ? "bg-[#ff3f6c]/10 text-[#ff3f6c] border-[#ff3f6c]/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {opp.priority_tier}
                    </span>
                    <h4 className="font-outfit text-base font-bold text-white mt-2 group-hover:text-rose-300 transition-colors">
                      {opp.opportunity_title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">OPS Score</div>
                    <div className="font-outfit text-xl font-extrabold text-white">
                      {opp.ops_score}
                    </div>
                  </div>
                </div>

                {/* 3-Column Internal Triad (DESIGN.md specification) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                  <div className="space-y-1 border-r border-slate-800/80 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Surface Observation
                    </span>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      {opp.problem_node.surface_observation}
                    </p>
                  </div>
                  <div className="space-y-1 border-r border-slate-800/80 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      Underlying Barrier
                    </span>
                    <p className="text-rose-200/90 leading-relaxed font-normal">
                      {opp.problem_node.underlying_barrier}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Unmet Customer Need
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed font-normal">
                      {opp.problem_node.unmet_need}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    {opp.problem_node.mention_count} Mentions
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {opp.affected_segment.split("&")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#ff3f6c] font-semibold group-hover:translate-x-1 transition-transform">
                  Explore Evidence <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
