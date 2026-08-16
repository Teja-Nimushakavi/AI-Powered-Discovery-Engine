"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { NextResearchItem } from "@/types";

interface KnowledgeGapsProps {
  knowledgeGaps: string[];
  nextResearch: NextResearchItem[];
  limitationNotice: string;
}

export const KnowledgeGaps: React.FC<KnowledgeGapsProps> = ({
  knowledgeGaps,
  nextResearch,
  limitationNotice,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Gaps */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Public Data Knowledge Gaps</h3>
              <p className="text-xs text-slate-400">What public reviews cannot answer</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {knowledgeGaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2"
              >
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Research */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Recommended Next Research</h3>
              <p className="text-xs text-slate-400">Validation steps for Product Managers</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {nextResearch.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1"
              >
                <h4 className="text-xs font-bold text-emerald-300">{item.action}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Limitation Alert */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{limitationNotice}</p>
      </div>
    </div>
  );
};
