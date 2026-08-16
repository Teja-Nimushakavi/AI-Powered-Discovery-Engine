"use client";

import React from "react";
import { Sparkles, Info } from "lucide-react";
import { PMDiscoveryReport } from "@/types";

interface ExecutiveSummaryProps {
  report: PMDiscoveryReport;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ report }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900/50 to-slate-900/50 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-[#ff3f6c]/20 text-[#ff3f6c] flex items-center justify-center border border-[#ff3f6c]/30 shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-rose-300 uppercase tracking-wider">
              Executive Summary & Key Insights
            </h2>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {report.executive_summary}
          </p>
        </div>
      </div>
    </div>
  );
};
