"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Users, Eye } from "lucide-react";
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
          <h3 className="font-outfit text-base font-bold text-slate-900 tracking-tight">
            Prioritized Customer Conversion Opportunities
          </h3>
          <p className="text-xs text-slate-500 font-medium">
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
              className={`glass-panel p-5 rounded-2xl border-l-4 cursor-pointer glass-panel-hover group flex flex-col justify-between shadow-sm bg-white ${
                isTier1 ? "border-l-[#ff3f6c] border-rose-100" : "border-l-[#f59e0b] border-amber-100"
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isTier1
                          ? "bg-rose-50 text-[#ff3f6c] border-rose-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {opp.priority_tier}
                    </span>
                    <h4 className="font-outfit text-base font-bold text-slate-900 mt-2 group-hover:text-[#ff3f6c] transition-colors">
                      {opp.opportunity_title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">OPS Score</div>
                    <div className="font-outfit text-xl font-extrabold text-slate-900">
                      {opp.ops_score}
                    </div>
                  </div>
                </div>

                {/* 3-Column Internal Triad (DESIGN.md specification) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Eye className="h-3 w-3 text-slate-400" /> Surface Observation
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {opp.problem_node.surface_observation}
                    </p>
                  </div>
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      Underlying Barrier
                    </span>
                    <p className="text-rose-900 leading-relaxed font-medium">
                      {opp.problem_node.underlying_barrier}
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Unmet Customer Need
                    </span>
                    <p className="text-emerald-900 leading-relaxed font-medium">
                      {opp.problem_node.unmet_need}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[#ff3f6c] font-bold group-hover:bg-[#ff3f6c] group-hover:text-white transition-all flex items-center gap-1">
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
