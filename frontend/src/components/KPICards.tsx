"use client";

import React from "react";
import { MessageSquare, Target, PieChart, Lightbulb } from "lucide-react";
import { PMDiscoveryReport } from "@/types";

interface KPICardsProps {
  report: PMDiscoveryReport;
}

export const KPICards: React.FC<KPICardsProps> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Metric 1 */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center justify-between z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Conversations
          </p>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-white tracking-tight">
            {report.total_feedback_analyzed.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">From public reviews & Q&A discussions</p>
        </div>
        {/* Decorative Sparkline SVG */}
        <div className="mt-3 opacity-40">
          <svg className="w-full h-8 text-blue-400" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 20 L20 15 L40 18 L60 8 L80 12 L100 4" />
          </svg>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Wishlist Signals
          </p>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Target className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-emerald-400 tracking-tight">
            {report.relevant_feedback_count.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Filtered conversion relevant signals</p>
        </div>
        {/* Decorative Sparkline SVG */}
        <div className="mt-3 opacity-40">
          <svg className="w-full h-8 text-emerald-400" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 22 L20 18 L40 12 L60 14 L80 5 L100 2" />
          </svg>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#ff3f6c]/10 rounded-full blur-2xl group-hover:bg-[#ff3f6c]/20 transition-all" />
        <div className="flex items-center justify-between z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Relevance Ratio
          </p>
          <div className="h-10 w-10 rounded-xl bg-[#ff3f6c]/10 text-[#ff3f6c] flex items-center justify-center border border-[#ff3f6c]/20">
            <PieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-[#ff3f6c] tracking-tight">
            {report.relevance_ratio_pct}%
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Signal-to-noise efficiency</p>
        </div>
        {/* Decorative Sparkline SVG */}
        <div className="mt-3 opacity-40">
          <svg className="w-full h-8 text-[#ff3f6c]" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 15 L25 10 L50 20 L75 8 L100 12" />
          </svg>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Discovered Opportunities
          </p>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Lightbulb className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-amber-400 tracking-tight">
            {report.top_opportunities.length}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Ranked by OPS Priority Score</p>
        </div>
        {/* Decorative Sparkline SVG */}
        <div className="mt-3 opacity-40">
          <svg className="w-full h-8 text-amber-400" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 18 L20 14 L40 10 L60 6 L80 8 L100 3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
