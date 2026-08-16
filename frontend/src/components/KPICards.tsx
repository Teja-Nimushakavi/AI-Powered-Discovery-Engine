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
      {/* Metric 1: Total Conversations */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden group shadow-sm">
        <div className="flex items-center justify-between z-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> Total Conversations
          </p>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-slate-900 tracking-tight">
            {report.total_feedback_analyzed.toLocaleString()}
          </h3>
        </div>
        {/* Soft Blue Wave Sparkline */}
        <div className="mt-3 opacity-60">
          <svg className="w-full h-8 text-blue-400" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M0 20 Q 25 5, 50 18 T 100 10" />
          </svg>
        </div>
      </div>

      {/* Metric 2: Wishlist Signals */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden group shadow-sm">
        <div className="flex items-center justify-between z-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-emerald-500" /> Wishlist Signals
          </p>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-emerald-500 tracking-tight">
            {report.relevant_feedback_count.toLocaleString()}
          </h3>
        </div>
        {/* Soft Emerald Wave Sparkline */}
        <div className="mt-3 opacity-60">
          <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M0 22 Q 25 10, 50 15 T 100 5" />
          </svg>
        </div>
      </div>

      {/* Metric 3: Relevance Ratio */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden group shadow-sm">
        <div className="flex items-center justify-between z-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="h-3.5 w-3.5 text-[#ff3f6c]" /> Relevance Ratio
          </p>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-[#ff3f6c] tracking-tight">
            {report.relevance_ratio_pct}%
          </h3>
        </div>
        {/* Soft Pink Wave Sparkline */}
        <div className="mt-3 opacity-60">
          <svg className="w-full h-8 text-[#ff3f6c]" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M0 15 Q 25 5, 50 20 T 100 12" />
          </svg>
        </div>
      </div>

      {/* Metric 4: Discovered Opportunities */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden group shadow-sm">
        <div className="flex items-center justify-between z-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Opportunities
          </p>
        </div>
        <div className="mt-4 z-10">
          <h3 className="font-outfit text-4xl font-extrabold text-amber-500 tracking-tight">
            {report.top_opportunities.length}
          </h3>
        </div>
        {/* Soft Gold Line Sparkline */}
        <div className="mt-3 opacity-60">
          <svg className="w-full h-8 text-amber-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M0 20 L25 18 L50 15 L75 12 L100 8" />
          </svg>
        </div>
      </div>
    </div>
  );
};
