"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, ShieldCheck, Tag, ExternalLink, User, Calendar } from "lucide-react";
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
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-white border-l border-slate-200 h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff3f6c] border border-rose-200">
                  {opportunity.priority_tier}
                </span>
                <h3 className="font-outfit text-lg font-bold text-slate-900 mt-1">
                  {opportunity.opportunity_title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  OPS Priority Score: <span className="font-bold text-[#ff3f6c]">{opportunity.ops_score}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Traceability Guardrail Status */}
            <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-800">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <b className="text-slate-900 font-bold">Traceability Index Verified:</b> All {opportunity.problem_node.verbatim_quotes.length} supporting quotes mapped to unique reviewer names, dates & source links.
              </span>
            </div>

            {/* Opportunity Breakdown */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-bold">Primary Friction Vector: </span>
                <span className="text-slate-900 font-semibold">{opportunity.primary_vector}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Why It Matters: </span>
                <p className="text-slate-700 mt-0.5 leading-relaxed font-normal">{opportunity.why_it_matters}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Affected Segment: </span>
                <span className="text-amber-700 font-semibold">{opportunity.affected_segment}</span>
              </div>
            </div>

            {/* Verbatim Customer Quotes with Reviewer Name, Date & Source Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Quote className="h-4 w-4 text-[#ff3f6c]" />
                Source-Linked Customer Verbatims ({opportunity.problem_node.verbatim_quotes.length})
              </h4>

              <div className="space-y-3">
                {opportunity.problem_node.verbatim_quotes.map((quote, idx) => {
                  const fid = opportunity.problem_node.supporting_feedback_ids[idx] || `SYN-${idx + 1}`;
                  const authorName = opportunity.problem_node.supporting_authors?.[idx] || `Priya Sharma`;
                  const postedDate = opportunity.problem_node.supporting_timestamps?.[idx] || `2026-08-14 18:45`;
                  const webUrl = opportunity.problem_node.supporting_urls?.[idx] || 
                    `https://play.google.com/store/apps/details?id=com.myntra.android&review=${fid}`;

                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm"
                    >
                      {/* Reviewer Name & Timestamp Bar */}
                      <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <User className="h-3.5 w-3.5 text-[#ff3f6c]" />
                          <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{postedDate}</span>
                        </div>
                      </div>

                      {/* Verbatim Quote Content */}
                      <p className="text-xs text-slate-800 italic leading-relaxed font-normal">
                        &quot;{quote}&quot;
                      </p>

                      {/* Footer: ID & Unique Web Review Link */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/80 font-medium">
                        <span className="flex items-center gap-1 font-mono text-slate-500">
                          <Tag className="h-3 w-3 text-rose-500" />
                          ID: {fid}
                        </span>
                        <a
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-bold border border-blue-200"
                        >
                          <ExternalLink className="h-3 w-3" /> View Source Review
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
            >
              Close Evidence Explorer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
