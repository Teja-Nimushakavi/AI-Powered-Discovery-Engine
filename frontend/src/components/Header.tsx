"use client";

import React from "react";
import { Sparkles, Upload, ShoppingBag, Sliders } from "lucide-react";

interface HeaderProps {
  dataSource: "synthetic" | "custom";
  setDataSource: (source: "synthetic" | "custom") => void;
  sampleCount: number;
  setSampleCount: (count: number) => void;
  onGenerate: () => void;
  onFileUpload: (file: File) => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  dataSource,
  setDataSource,
  sampleCount,
  setSampleCount,
  onGenerate,
  onFileUpload,
  loading,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0b1326]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff3f6c] to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Myntra Wishlist Discovery Engine
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff3f6c]/20 text-[#ff3f6c] font-semibold border border-[#ff3f6c]/30">
                AI Agent v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evidence-based purchase barrier discovery for Product Managers
            </p>
          </div>
        </div>

        {/* Data Source Controls */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setDataSource("synthetic")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              dataSource === "synthetic"
                ? "bg-[#ff3f6c] text-white shadow-md shadow-rose-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Generate Synthetic
          </button>

          <label
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              dataSource === "custom"
                ? "bg-[#ff3f6c] text-white shadow-md shadow-rose-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload CSV File
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setDataSource("custom");
                  onFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Synthetic Size Slider */}
        {dataSource === "synthetic" && (
          <div className="flex items-center gap-3 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Records:</span>
              <input
                type="range"
                min={100}
                max={1000}
                step={100}
                value={sampleCount}
                onChange={(e) => setSampleCount(Number(e.target.value))}
                className="w-24 accent-[#ff3f6c] cursor-pointer"
              />
              <span className="text-xs font-semibold text-white w-8">{sampleCount}</span>
            </div>
            <button
              onClick={onGenerate}
              disabled={loading}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 disabled:opacity-50 transition-all"
            >
              {loading ? "Analyzing..." : "Regenerate"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
