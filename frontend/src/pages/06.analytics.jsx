import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useHistory } from "../store/03.history.js"; // Adjust path to your Zustand store file
import { CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import {
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Single accent drives every chart — swap this hex to match your brand.
const ACCENT = "#4338ca";
const ACCENT_SOFT = "#a5b4fc";

const verdictFor = (score) => {
  if (score >= 85) return "Excellent performance — interview-ready.";
  if (score >= 70) return "Solid performance, with room to sharpen.";
  if (score >= 50) return "A foundation to build on.";
  return "Early stage — more practice will help.";
};

export default function AnalyticsComponent() {
  // 1. Get IDs from URL path structure: /analytics/:interviewId/:userId
  const { interviewId, userId } = useParams();

  // Alternative fallback: if your URL uses query strings like ?interviewId=X&userId=Y
  const [searchParams] = useSearchParams();
  const queryInterviewId = searchParams.get("interviewId");
  const queryUserId = searchParams.get("userId");

  const targetInterviewId = interviewId || queryInterviewId;
  const targetUserId = userId || queryUserId;

  // 2. Extract state and actions from the Zustand store
  const { analytics, chat, loading, error, analysis, myChatHistory } = useHistory();

  // 3. Trigger the backend fetches when the component loads
  useEffect(() => {
    if (targetInterviewId && targetUserId) {
      analysis(targetInterviewId, targetUserId);
    }
  }, [targetInterviewId, targetUserId, analysis]);

  useEffect(() => {
    if (targetInterviewId) {
      myChatHistory(targetInterviewId);
    }
  }, [targetInterviewId, myChatHistory]);

  const formatList = (text) => {
    if (!text) return [];
    return text.includes("|")
      ? text.split("|").map((item) => item.trim()).filter(Boolean)
      : text.split(". ").map((item) => item.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas items-center justify-center font-mono text-xs text-muted">
        <div className="border border-line p-8 rounded-xl animate-pulse">
          Loading interview evaluation metrics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-canvas items-center justify-center font-mono text-xs">
        <div className="border border-line p-6 rounded-xl bg-card text-main">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  if (!analytics || Object.keys(analytics).length === 0) {
    return (
      <div className="flex min-h-screen bg-canvas items-center justify-center font-mono text-xs text-muted">
        <div className="border border-line p-8 rounded-xl">
          No analytics available for this session.
        </div>
      </div>
    );
  }

  // Fallbacks accommodate both camelCase and snake_case coming from your backend API
  const score = Number(analytics.averageScore ?? analytics.average_score ?? analytics.score ?? 0);
  const technical = Number(analytics.technicalScore ?? analytics.technical_score ?? analytics.technical ?? 0);
  const communication = Number(analytics.communicationScore ?? analytics.communication_score ?? analytics.communication ?? 0);
  const speed = Number(analytics.speedScore ?? analytics.speed_score ?? analytics.speed ?? 0);

  const radarData = [
    { metric: "Technical", value: technical },
    { metric: "Communication", value: communication },
    { metric: "Speed", value: speed },
  ];

  const breakdownData = [
    { metric: "Average Score", value: score },
    { metric: "Technical Competency", value: technical },
    { metric: "Communication Skills", value: communication },
    { metric: "Speed & Efficiency", value: speed },
  ];

  const trendData = (chat || []).map((e, i) => ({
    name: `Q${i + 1}`,
    score: e.score ?? 0,
  }));

  const strengths = formatList(analytics.strength ?? analytics.strengths);
  const weaknesses = formatList(analytics.weakness ?? analytics.weaknesses);

  return (
    <div className="min-h-screen bg-canvas text-main font-sans antialiased border-t border-line flex flex-col justify-between transition-colors duration-150">
      <main className="max-w-3xl mx-auto w-full px-6 py-20 flex-1 flex flex-col justify-center">

        {/* Hero Section */}
        <div className="mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            Evaluation Report
          </p>
          <div className="flex items-end gap-3">
            <span className="font-sans text-6xl sm:text-7xl font-bold leading-none tabular-nums tracking-tight">
              {Math.round(score)}
            </span>
            <span className="font-mono text-sm text-muted pb-1.5">/ 100</span>
          </div>
          <p className="text-sm text-muted mt-4 max-w-md font-sans leading-relaxed">{verdictFor(score)}</p>
        </div>

        {/* Response Trend Line Chart */}
        <section className="mb-14">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-5">
            Response Trend
          </h2>
          {trendData.length > 0 ? (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT_SOFT} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={ACCENT_SOFT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text)", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--text)", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={ACCENT}
                    strokeWidth={2}
                    fill="url(#trendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[120px] flex items-center justify-center font-mono text-xs text-muted border border-dashed border-line rounded-xl">
              No response data available yet.
            </div>
          )}
        </section>

        {/* Skill Profile (Radar) & Text Breakdown */}
        <section className="grid sm:grid-cols-2 gap-12 mb-14">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-4">
              Skill Profile
            </h2>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "var(--text)", fontSize: 11, fontFamily: "sans-serif" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Radar
                    dataKey="value"
                    stroke={ACCENT}
                    fill={ACCENT}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-4">
              Breakdown
            </h2>
            <div className="space-y-1 font-sans text-sm">
              {breakdownData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-3 border-b border-line last:border-none"
                >
                  <span className="text-muted">{item.metric}</span>
                  <span className="font-semibold text-main tabular-nums">
                    {Math.round(item.value)} <span className="text-[11px] text-muted font-mono font-normal">/ 100</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strengths / Weaknesses Badges */}
        <section className="grid sm:grid-cols-2 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={14} className="text-muted" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Strengths
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.length > 0 ? (
                strengths.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full border border-line bg-card text-main font-sans"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted font-sans">No strengths recorded.</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={14} className="text-muted" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Areas for Improvement
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full border border-line bg-card text-main font-sans"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted font-sans">No weaknesses recorded.</span>
              )}
            </div>
          </div>
        </section>

        {/* Holistic Feedback Text */}
        <section className="border-t border-line pt-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-muted" />
            <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Feedback Summary
            </h2>
          </div>
          <p className="font-sans text-base text-main leading-relaxed">
            {analytics.feedback ?? analytics.feedbackSummary}
          </p>
        </section>

      </main>
    </div>
  );
}