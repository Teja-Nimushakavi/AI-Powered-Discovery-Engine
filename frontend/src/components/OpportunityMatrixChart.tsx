"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { OpportunityCard } from "@/types";
import { Info } from "lucide-react";

interface OpportunityMatrixChartProps {
  opportunities: OpportunityCard[];
  onSelectOpportunity: (opp: OpportunityCard) => void;
}

export const OpportunityMatrixChart: React.FC<OpportunityMatrixChartProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const data = opportunities.map((opp) => ({
    x: opp.conversion_relevance,
    y: opp.impact_rating,
    z: opp.ops_score * 12,
    name: opp.opportunity_title,
    ops: opp.ops_score,
    tier: opp.priority_tier,
    opp: opp,
  }));

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-base font-bold text-slate-900 flex items-center gap-2">
            Opportunity Priority Matrix
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Friction Impact (Y) vs 30-Day Conversion Relevance (X)
          </p>
        </div>
        <Info className="h-4 w-4 text-slate-400 cursor-pointer" />
      </div>

      <div className="w-full h-[320px] bg-slate-50/50 rounded-xl p-2 border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Conversion Relevance"
              domain={[0, 1.0]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              label={{ value: "Conversion Relevance →", position: "insideBottom", offset: -10, fontSize: 10, fill: "#64748b" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Friction Impact"
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              label={{ value: "Friction Impact ↑", angle: -90, position: "insideLeft", fontSize: 10, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
                      <p className="font-bold">{dataPoint.name}</p>
                      <p className="text-slate-300">OPS Score: <span className="text-[#ff3f6c] font-bold">{dataPoint.ops}</span></p>
                      <p className="text-slate-400 text-[10px]">Click to explore evidence quotes</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              data={data}
              onClick={(e) => e && e.opp && onSelectOpportunity(e.opp)}
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const isTier1 = entry.tier.includes("Tier 1");
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isTier1 ? "#ff3f6c" : "#f59e0b"}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff3f6c]" /> Tier 1 (High OPS)
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Tier 2 (Medium OPS)
        </div>
      </div>
    </div>
  );
};
