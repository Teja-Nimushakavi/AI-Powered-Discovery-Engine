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
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold text-slate-900">Public Data Knowledge Gaps</h3>
              <p className="text-xs text-slate-500 font-medium">What public reviews cannot answer</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {knowledgeGaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2 font-medium"
              >
                <span className="text-amber-600 font-bold shrink-0">•</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Research */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold text-slate-900">Recommended Next Research</h3>
              <p className="text-xs text-slate-500 font-medium">Validation steps for Product Managers</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {nextResearch.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1"
              >
                <h4 className="font-outfit text-xs font-bold text-emerald-800">{item.action}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{item.method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Limitation Alert */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-slate-100 flex items-start gap-3 text-xs text-slate-600 shadow-sm">
        <ShieldAlert className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">{limitationNotice}</p>
      </div>
    </div>
  );
};
