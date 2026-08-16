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
    <div className="glass-panel p-6 rounded-2xl border border-rose-200 bg-white space-y-6 shadow-md animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff3f6c] border border-rose-200">
              Query Intelligence Active
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Analyzing {queryResponse.total_query_mentions} Feedback Signals
            </span>
          </div>
          <h2 className="font-outfit text-xl font-bold text-slate-900 mt-1">
            &quot;{queryResponse.query}&quot;
          </h2>
        </div>
        <button
          onClick={onClearQuery}
          className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors text-xs flex items-center gap-1 font-semibold"
        >
          <X className="h-4 w-4" /> Clear Query
        </button>
      </div>

      {/* 1. Direct Analytical Answer Box */}
      <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-2">
        <div className="flex items-center gap-2 text-[#ff3f6c] font-bold text-xs">
          <Sparkles className="h-4 w-4" />
          Direct Quantitative Answer & Business Impact:
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-normal">
          {queryResponse.direct_analytical_answer}
        </p>
      </div>

      {/* 2. Comparative Opportunity Matrix Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-outfit text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-600" />
            Comparative Opportunity Matrix
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Side-by-side comparison of opportunity areas affecting 30-day wishlist conversion
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-200 bg-white">
              {queryResponse.comparative_matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{row.opportunity_name}</td>
                  <td className="p-3 text-slate-600 font-medium">{row.primary_vector}</td>
                  <td className="p-3 text-right font-bold text-blue-600">{row.share_pct}%</td>
                  <td className="p-3 text-right font-bold text-amber-600">{row.friction_impact}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">{row.conversion_relevance}</td>
                  <td className="p-3 text-right font-extrabold text-[#ff3f6c]">{row.ops_score}</td>
                  <td className="p-3 text-slate-600">{row.primary_segment.split('&')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Business Goal Link */}
      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
        <TrendingUp className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
        <div>
          <b className="text-slate-900 font-bold">Strategic ROI Impact on 30-Day Conversion Metric: </b>
          {queryResponse.business_goal_impact}
        </div>
      </div>
    </div>
  );
};
