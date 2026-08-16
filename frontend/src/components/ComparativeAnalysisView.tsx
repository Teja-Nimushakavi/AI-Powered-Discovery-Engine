"use client";

import React from "react";
import { ComparativeDiscoveryResponse } from "@/types";
import { Sparkles, BarChart2, TrendingUp, X } from "lucide-react";

interface ComparativeAnalysisViewProps {
  queryResponse: ComparativeDiscoveryResponse;
  onClearQuery: () => void;
}

export const ComparativeAnalysisView: React.FC<ComparativeAnalysisViewProps> = ({
  queryResponse,
  onClearQuery,
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#ff3f6c]/40 bg-gradient-to-b from-slate-900/90 to-[#0b1326]/95 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ff3f6c]/20 text-[#ff3f6c] border border-[#ff3f6c]/30">
              Query Intelligence Active
            </span>
            <span className="text-xs text-slate-400">
              Analyzing {queryResponse.total_query_mentions} Feedback Signals
            </span>
          </div>
          <h2 className="font-outfit text-xl font-bold text-white mt-1">
            &quot;{queryResponse.query}&quot;
          </h2>
        </div>
        <button
          onClick={onClearQuery}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-xs flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Clear Query
        </button>
      </div>

      {/* 1. Direct Analytical Answer Box */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-500/30 space-y-2">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
          <Sparkles className="h-4 w-4 text-[#ff3f6c]" />
          Direct Quantitative Answer & Business Impact:
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          {queryResponse.direct_analytical_answer}
        </p>
      </div>

      {/* 2. Comparative Opportunity Matrix Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            Comparative Opportunity Matrix
          </h3>
          <span className="text-[11px] text-slate-400">
            Side-by-side comparison of opportunity areas affecting 30-day wishlist conversion
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Opportunity Area</th>
                <th className="p-3">Primary Friction</th>
                <th className="p-3 text-right">Volume %</th>
                <th className="p-3 text-right">Impact (1-10)</th>
                <th className="p-3 text-right">Conversion Rel</th>
                <th className="p-3 text-right">OPS Score</th>
                <th className="p-3">Target Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
              {queryResponse.comparative_matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-white">{row.opportunity_name}</td>
                  <td className="p-3 text-slate-300">{row.primary_vector}</td>
                  <td className="p-3 text-right font-semibold text-blue-400">{row.share_pct}%</td>
                  <td className="p-3 text-right font-semibold text-amber-400">{row.friction_impact}</td>
                  <td className="p-3 text-right font-semibold text-emerald-400">{row.conversion_relevance}</td>
                  <td className="p-3 text-right font-bold text-rose-400">{row.ops_score}</td>
                  <td className="p-3 text-slate-400">{row.primary_segment.split('&')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Business Goal Link */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
        <TrendingUp className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
        <div>
          <b className="text-white">Strategic ROI Impact on 30-Day Conversion Metric: </b>
          {queryResponse.business_goal_impact}
        </div>
      </div>
    </div>
  );
};
