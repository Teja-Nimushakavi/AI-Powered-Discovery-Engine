"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { PMDiscoveryReport } from "@/types";

interface ExecutiveSummaryProps {
  report: PMDiscoveryReport;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ report }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#ff3f6c] border-slate-200 bg-white space-y-2 shadow-sm">
      <div className="flex items-center gap-2 text-[#ff3f6c] font-bold text-xs">
        <Sparkles className="h-4 w-4" />
        <h3 className="font-outfit text-base font-bold text-slate-900">Executive Summary</h3>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed font-normal">
        {report.executive_summary} Addressing the fit scale discrepancy across brands presents the highest immediate ROI opportunity to unlock 30-day wishlist purchase conversions.
      </p>
    </div>
  );
};
