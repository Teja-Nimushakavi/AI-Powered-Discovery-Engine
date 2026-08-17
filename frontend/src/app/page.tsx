"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { KPICards } from "@/components/KPICards";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { QueryBar } from "@/components/QueryBar";
import { ComparativeAnalysisView } from "@/components/ComparativeAnalysisView";
import { OpportunityMatrixChart } from "@/components/OpportunityMatrixChart";
import { OpportunityList } from "@/components/OpportunityList";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { UserSegments } from "@/components/UserSegments";
import { KnowledgeGaps } from "@/components/KnowledgeGaps";
import { PMDiscoveryReport, OpportunityCard, ComparativeDiscoveryResponse } from "@/types";
import { Sparkles, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function DashboardPage() {
  const [dataSource, setDataSource] = useState<"synthetic" | "custom">("synthetic");
  const [sampleCount, setSampleCount] = useState<number>(500);
  const [report, setReport] = useState<PMDiscoveryReport | null>(null);
  const [queryResponse, setQueryResponse] = useState<ComparativeDiscoveryResponse | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityCard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSyntheticReport = async (count: number = sampleCount) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/generate-synthetic?count=${count}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data: PMDiscoveryReport = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to FastAPI backend (localhost:8000). Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/analyze-csv`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload error: ${res.statusText}`);
      }

      const data: PMDiscoveryReport = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to process uploaded CSV file. Please check backend server status.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async (queryText: string) => {
    setQueryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/query-discovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, sample_count: sampleCount }),
      });

      if (!res.ok) {
        throw new Error(`Query error: ${res.statusText}`);
      }

      const data: ComparativeDiscoveryResponse = await res.json();
      setQueryResponse(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to execute discovery query. Check backend status.");
    } finally {
      setQueryLoading(false);
    }
  };

  useEffect(() => {
    fetchSyntheticReport(500);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        dataSource={dataSource}
        setDataSource={setDataSource}
        sampleCount={sampleCount}
        setSampleCount={setSampleCount}
        onGenerate={() => fetchSyntheticReport(sampleCount)}
        onFileUpload={handleFileUpload}
        loading={loading}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 space-y-6">
        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-[#ff3f6c] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-300">
              Running AI Pipeline (Scrubbing PII $\rightarrow$ Clustering Vector Embeddings $\rightarrow$ Calculating OPS Scores)...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchSyntheticReport(sampleCount)}
              className="px-3 py-1 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Render Dashboard */}
        {!loading && report && (
          <div className="space-y-6 animate-fadeIn">
            {/* Auto-Generate Mode Alert Banner */}
            {dataSource === "synthetic" && (
              <div className="bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs text-slate-800 font-medium shadow-sm">
                <Sparkles className="h-4 w-4 text-[#ff3f6c] shrink-0" />
                <span>
                  <b>Multi-Source Public Data Mode Active:</b> Auto-generated <b>{report.total_feedback_analyzed}</b> public fashion conversations across <b>App Store reviews</b>, <b>Play Store reviews</b>, <b>Reddit discussions</b>, <b>Fashion & shopping communities</b>, <b>Social media conversations</b>, <b>YouTube comments</b>, <b>Product reviews & Q&A</b>, and <b>public online fashion web discussions</b>.
                </span>
              </div>
            )}

            {/* Ask Me a Question Bar */}
            <QueryBar
              onExecuteQuery={handleExecuteQuery}
              loading={queryLoading}
            />

            {/* Comparative Discovery Query Result View */}
            {queryResponse && (
              <ComparativeAnalysisView
                queryResponse={queryResponse}
                onClearQuery={() => setQueryResponse(null)}
              />
            )}

            {/* KPI Cards */}
            <KPICards report={report} />

            {/* Executive Summary */}
            <ExecutiveSummary report={report} />

            {/* Scatter Plot Matrix & Priority List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <OpportunityMatrixChart
                  opportunities={report.top_opportunities}
                  onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
                />
              </div>
              <div className="lg:col-span-2">
                <OpportunityList
                  opportunities={report.top_opportunities}
                  onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
                />
              </div>
            </div>

            {/* User Segments & Pre-Purchase Uncertainty */}
            <UserSegments
              segments={report.user_segments}
              uncertainties={report.uncertainty_map}
            />

            {/* Knowledge Gaps & Validation Actions */}
            <KnowledgeGaps
              knowledgeGaps={report.knowledge_gaps}
              nextResearch={report.recommended_next_research}
              limitationNotice={report.data_limitation_notice}
            />

            {/* Footer */}
            <footer className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <p>© 2024 Myntra Product Discovery Engine. Limited to internal strategic use only. Data refreshed every 6 hours.</p>
              <div className="flex items-center gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Internal Feedback</span>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Slide-over Evidence Explorer Drawer */}
      <EvidenceDrawer
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
