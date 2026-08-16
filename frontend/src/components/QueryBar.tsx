"use client";

import React, { useState } from "react";
import { Search, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

interface QueryBarProps {
  onExecuteQuery: (queryText: string) => void;
  loading: boolean;
}

export const QueryBar: React.FC<QueryBarProps> = ({ onExecuteQuery, loading }) => {
  const [queryInput, setQueryInput] = useState("");

  const presetQueries = [
    "What causes users to postpone a purchase?",
    "Why do fit-conscious shoppers abandon wishlists?",
    "What information gaps exist for fabric quality?",
    "Where do users drop off between wishlist and checkout?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onExecuteQuery(queryInput.trim());
    }
  };

  const handlePresetClick = (presetText: string) => {
    setQueryInput(presetText);
    onExecuteQuery(presetText);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 shadow-xl bg-gradient-to-r from-slate-900/90 via-[#0b1326]/95 to-slate-900/90 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#ff3f6c]/20 text-[#ff3f6c] flex items-center justify-center border border-[#ff3f6c]/30">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="font-outfit text-sm font-bold text-white tracking-tight">
            Ask Me a Discovery Question
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Beyond Sentiment: Identifies, quantifies & compares 30-day conversion opportunities
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask any discovery question... (e.g. 'What causes users to postpone a purchase?')"
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !queryInput.trim()}
          className="px-5 py-2.5 bg-[#ff3f6c] hover:bg-[#e0355c] text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Query <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#ff3f6c]" /> Sample Queries:
        </span>
        {presetQueries.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(preset)}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
          >
            &quot;{preset}&quot;
          </button>
        ))}
      </div>
    </div>
  );
};
