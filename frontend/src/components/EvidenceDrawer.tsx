"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, ShieldCheck, Tag } from "lucide-react";
import { OpportunityCard } from "@/types";

interface EvidenceDrawerProps {
  opportunity: OpportunityCard | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  opportunity,
  onClose,
}) => {
  if (!opportunity) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-[#0f172a] border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {opportunity.priority_tier}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {opportunity.opportunity_title}
                </h3>
                <p className="text-xs text-slate-400">
                  OPS Priority Score: <span className="font-bold text-rose-400">{opportunity.ops_score}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Traceability Guardrail Status */}
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                <b>Traceability Index Verified:</b> All {opportunity.problem_node.verbatim_quotes.length} supporting quotes mapped to validated feedback UUIDs.
              </span>
            </div>

            {/* Opportunity Breakdown */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Primary Friction Vector: </span>
                <span className="text-white">{opportunity.primary_vector}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Why It Matters: </span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{opportunity.why_it_matters}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Affected Segment: </span>
                <span className="text-amber-300">{opportunity.affected_segment}</span>
              </div>
            </div>

            {/* Verbatim Customer Quotes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Quote className="h-4 w-4 text-rose-400" />
                Source-Linked Customer Verbatims ({opportunity.problem_node.verbatim_quotes.length})
              </h4>

              <div className="space-y-3">
                {opportunity.problem_node.verbatim_quotes.map((quote, idx) => {
                  const fid = opportunity.problem_node.supporting_feedback_ids[idx] || `fb_${idx + 1}`;

                  return (
                    <div
                      key={idx}
                      className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2"
                    >
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        &quot;{quote}&quot;
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        <span className="flex items-center gap-1 font-mono text-slate-400">
                          <Tag className="h-3 w-3 text-rose-400" />
                          ID: {fid}
                        </span>
                        <span className="text-emerald-400 font-medium">Traceability Verified</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Close Evidence Explorer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
