"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { OpportunityCard } from "@/types";

interface OpportunityMatrixChartProps {
  opportunities: OpportunityCard[];
  onSelectOpportunity: (opp: OpportunityCard) => void;
}

export const OpportunityMatrixChart: React.FC<OpportunityMatrixChartProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const chartData = opportunities.map((opp) => ({
    x: opp.conversion_relevance,
    y: opp.impact_rating,
    z: opp.ops_score,
    name: opp.opportunity_title,
    tier: opp.priority_tier,
    opp: opp,
  }));

  const getColor = (tier: string) => {
    if (tier.includes("Tier 1")) return "#ff3f6c";
    if (tier.includes("Tier 2")) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Opportunity Priority Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Mapping User Friction Impact (Y) vs. 30-Day Conversion Relevance (X)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff3f6c]" />
            <span className="text-slate-300">Tier 1 (High Priority)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
            <span className="text-slate-300">Tier 2 (Medium)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              type="number"
              dataKey="x"
              name="Conversion Relevance"
              domain={[0.4, 1.0]}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              label={{
                value: "30-Day Conversion Relevance Factor →",
                position: "insideBottom",
                offset: -10,
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Impact Rating"
              domain={[4, 10]}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              label={{
                value: "Customer Friction Impact (1-10) →",
                angle: -90,
                position: "insideLeft",
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 400]} name="OPS Score" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                      <p className="font-semibold text-rose-400">{data.name}</p>
                      <p className="text-slate-300">OPS Score: <span className="font-bold text-white">{data.z}</span></p>
                      <p className="text-slate-400">Impact: {data.y} / 10 | Conversion Rel: {data.x}</p>
                      <p className="text-[10px] text-slate-500 italic mt-1">Click to view evidence details</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={chartData} onClick={(entry) => onSelectOpportunity(entry.opp)}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.tier)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
