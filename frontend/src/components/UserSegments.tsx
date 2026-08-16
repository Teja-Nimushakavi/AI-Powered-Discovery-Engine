"use client";

import React from "react";
import { Users, HelpCircle } from "lucide-react";
import { UserSegment, UncertaintyMapItem } from "@/types";

interface UserSegmentsProps {
  segments: UserSegment[];
  uncertainties: UncertaintyMapItem[];
}

export const UserSegments: React.FC<UserSegmentsProps> = ({
  segments,
  uncertainties,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Segments */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Discovered User Segments</h3>
            <p className="text-xs text-slate-400">Shopper archetypes derived from data clusters</p>
          </div>
        </div>

        <div className="space-y-3">
          {segments.map((seg) => (
            <div
              key={seg.segment_id}
              className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{seg.segment_name}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {Math.round(seg.sample_proportion * 100)}% of Sample
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{seg.description}</p>
              <div className="text-[10px] text-slate-500 pt-1">
                Potential Impact: <span className="text-amber-400 font-semibold">{seg.potential_impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty Map */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Pre-Purchase Uncertainty Map</h3>
            <p className="text-xs text-slate-400">Unanswered customer questions before buying</p>
          </div>
        </div>

        <div className="space-y-3">
          {uncertainties.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                {item.dimension}
              </span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
                &quot;{item.user_question}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
