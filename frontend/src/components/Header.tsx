"use client";

import React, { useState } from "react";
import { Sparkles, Upload, RefreshCw, X, Shield, ShoppingBag, Bell, Settings } from "lucide-react";

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
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      setShowUploadModal(false);
      setDataSource("custom");
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff3f6c] to-rose-400 flex items-center justify-center shadow-md shadow-rose-500/20 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-xl font-bold text-[#ff3f6c] tracking-tight">
                Myntra Wishlist Discovery Engine
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-[#ff3f6c] border border-rose-200">
                AI Discovery Agent v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Evidence-based purchase barrier discovery for Product Managers
            </p>
          </div>
        </div>

        {/* Data Controls & User Settings */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs">
            <button
              onClick={() => {
                setDataSource("synthetic");
                onGenerate();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                dataSource === "synthetic"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#ff3f6c]" /> Auto-Generate
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                dataSource === "custom"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="h-3.5 w-3.5 text-blue-500" /> Upload CSV
            </button>
          </div>

          {/* Sample Size Controls */}
          {dataSource === "synthetic" && (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Records: {sampleCount}</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={sampleCount}
                onChange={(e) => setSampleCount(Number(e.target.value))}
                className="w-20 accent-[#ff3f6c]"
              />
              <button
                onClick={onGenerate}
                disabled={loading}
                className="p-1 text-slate-600 hover:text-[#ff3f6c] transition-colors"
                title="Regenerate"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          )}

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 text-slate-500">
            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
              PM
            </div>
          </div>
        </div>
      </div>

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-outfit text-base font-bold text-slate-900">Upload Shopping Reviews CSV</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload any customer feedback CSV dataset. Required columns: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">text</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">comment</code>.
            </p>
            <label className="border-2 border-dashed border-slate-300 hover:border-[#ff3f6c] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
              <Upload className="h-8 w-8 text-slate-400 group-hover:text-[#ff3f6c] transition-colors mb-2" />
              <span className="text-xs font-semibold text-slate-700">Click to choose CSV file</span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
      )}
    </header>
  );
};
