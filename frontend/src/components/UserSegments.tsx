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
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-900">Discovered User Segments</h3>
            <p className="text-xs text-slate-500 font-medium">Shopper archetypes derived from data clusters</p>
          </div>
        </div>

        <div className="space-y-3">
          {segments.map((seg) => (
            <div
              key={seg.segment_id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-outfit text-xs font-bold text-slate-900">{seg.segment_name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {Math.round(seg.sample_proportion * 100)}% of Sample
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{seg.description}</p>
              <div className="text-[10px] text-slate-500 pt-1 font-medium">
                Potential Impact: <span className="text-amber-600 font-bold">{seg.potential_impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty Map */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-50 text-[#ff3f6c] flex items-center justify-center border border-rose-200">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-900">Pre-Purchase Uncertainty Map</h3>
            <p className="text-xs text-slate-500 font-medium">Unanswered customer questions before buying</p>
          </div>
        </div>

        <div className="space-y-3">
          {uncertainties.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff3f6c]">
                {item.dimension}
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                &quot;{item.user_question}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
