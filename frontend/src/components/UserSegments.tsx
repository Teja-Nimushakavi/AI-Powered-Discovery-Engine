"use client";

import React from "react";
import { Users, HelpCircle, MapPin, Calendar, Activity, Quote, AlertTriangle } from "lucide-react";
import { UserSegment, UncertaintyMapItem, PersonaAnalytics } from "@/types";

interface UserSegmentsProps {
  segments: UserSegment[];
  uncertainties: UncertaintyMapItem[];
  personaAnalytics?: PersonaAnalytics;
}

export const UserSegments: React.FC<UserSegmentsProps> = ({
  segments,
  uncertainties,
  personaAnalytics,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Demographics Overview Header & Cards (Age Groups, City Tier, Issue Frequency) */}
      {personaAnalytics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-[#ff3f6c] flex items-center justify-center border border-rose-200">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-outfit text-base font-bold text-slate-900">
                  User Demographics & Persona Analytics
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Age groups, city tier distributions, and issue frequency breakdown for shoppers facing wishlist conversion friction
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Avg {personaAnalytics.avg_issues_per_user_monthly} issues / user monthly
              </span>
            </div>
          </div>

          {/* Demographic Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Age Group Breakdown */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#ff3f6c]" />
                  Age Group Distribution
                </span>
                <span className="text-[11px] font-semibold text-[#ff3f6c]">
                  Top: {personaAnalytics.top_affected_demographic}
                </span>
              </div>
              <div className="space-y-2.5">
                {personaAnalytics.age_distribution.map((ag) => (
                  <div key={ag.age_group} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{ag.age_group}</span>
                      <span className="font-bold text-slate-900">{ag.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#ff3f6c] to-rose-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ag.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Dominant: {ag.dominant_category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* City Tier Breakdown */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  City Tier Distribution
                </span>
                <span className="text-[11px] font-semibold text-blue-600">
                  {personaAnalytics.top_affected_tier}
                </span>
              </div>
              <div className="space-y-2.5">
                {personaAnalytics.city_tier_distribution.map((ct) => (
                  <div key={ct.city_tier} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{ct.city_tier}</span>
                      <span className="font-bold text-slate-900">{ct.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ct.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Friction: {ct.primary_friction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue Frequency Breakdown */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-amber-500" />
                  Issue Frequency & Friction Rate
                </span>
                <span className="text-[11px] font-semibold text-amber-600">
                  53% face 2-3 issues/mo
                </span>
              </div>
              <div className="space-y-2.5">
                {personaAnalytics.issue_frequency_breakdown.map((ifreq) => (
                  <div key={ifreq.frequency_range} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{ifreq.frequency_range}</span>
                      <span className="font-bold text-slate-900">{ifreq.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ifreq.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-amber-700 font-semibold">{ifreq.abandonment_risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed User Persona Archetype Cards */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <h4 className="font-outfit text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#ff3f6c]" />
              Detailed User Persona Profiles (Target Shopper Archetypes)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personaAnalytics.detailed_personas.map((persona) => (
                <div
                  key={persona.persona_id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 hover:border-slate-300 transition-all"
                >
                  {/* Persona Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0"
                        style={{ backgroundColor: persona.avatar_color }}
                      >
                        {persona.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h5 className="font-outfit text-sm font-bold text-slate-900">{persona.name}</h5>
                        <p className="text-[11px] text-slate-500 font-medium">{persona.archetype}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#ff3f6c] border border-rose-200">
                      Wishlist Abandonment: {persona.wishlist_abandonment_rate}
                    </span>
                  </div>

                  {/* Demographics Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                    <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {persona.age_group}
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {persona.city_tier}
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-amber-700 flex items-center gap-1">
                      <Activity className="h-3 w-3 text-amber-500" />
                      {persona.issue_frequency}
                    </span>
                  </div>

                  {/* Primary Friction */}
                  <div className="text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Primary Friction: </span>
                      {persona.primary_friction}
                    </div>
                  </div>

                  {/* Representative Verbatim Quote */}
                  <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 italic space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold not-italic text-[#ff3f6c]">
                      <Quote className="h-3 w-3" /> Representative Verbatim
                    </div>
                    &quot;{persona.representative_quote}&quot;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Discovered User Segments & Pre-Purchase Uncertainty Map */}
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
    </div>
  );
};
