import { useState, useEffect } from "react";
import useResumeStore from "../store/04.resume.store.js";
import { userAuth } from "../store/01.auth.store.js";
import {Link} from "react-router-dom"
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Lock,
} from "lucide-react";

const GAUGE_RADIUS = 54;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

const clamp = (n, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

function scoreNote(score) {
  if (score >= 80)
    return "Strong ATS compatibility — this resume should parse cleanly through most screening systems.";
  if (score >= 60)
    return "Reasonable ATS compatibility, with room to tighten formatting and keyword coverage.";
  return "Low ATS compatibility — structural and keyword changes are recommended before applying.";
}

export default function ResumeUpload() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { resumeUrl, review, uploadResume, toServer } = useResumeStore();
  const { know, knowMe, loading: authLoading } = userAuth();

  useEffect(() => {
    knowMe();
  }, [knowMe]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    e.target.value = "";

    if (!file) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const url = await uploadResume(file);
      await toServer(url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // While the session check is in flight, show that — not "please log in".
  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas text-main flex flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="text-muted animate-spin" />
        <p className="font-mono text-xs text-muted tracking-wider uppercase">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // Only after the check resolves do we know whether there's really no user.
  if (!know?.user) {
    return (
      <Link to = "/login-with-google">
      <div className="flex min-h-screen bg-canvas items-center justify-center font-mono text-xs text-muted">
        <div className="border border-line p-6 rounded bg-card/40">
          Please log in to get access .
        </div>
      </div></Link>
    );
  }

  const score = clamp(Number(review?.atsScore) || 0);

  return (
    <div className="min-h-screen bg-canvas text-main antialiased flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-6">
          Resume Analysis/
        </p>

        {/* Upload zone */}
        <label
          htmlFor="resume-upload"
          className={`flex flex-col items-center justify-center gap-3 border border-dashed border-line rounded-xl py-12 px-6 text-center transition-opacity ${
            loading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"
          }`}
        >
          {loading ? (
            <Loader2 size={20} className="text-muted animate-spin" />
          ) : (
            <UploadCloud size={20} className="text-muted" />
          )}
          <div>
            <p className="text-sm font-medium">
              {loading ? "Analyzing document architecture..." : "Upload resume document"}
            </p>
            <p className="font-mono text-[10px] text-muted mt-1">PDF format only</p>
          </div>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            disabled={loading}
            className="hidden"
          />
        </label>

        {errorMsg && (
          <div className="flex items-center gap-2 mt-4 font-mono text-xs text-muted">
            <AlertCircle size={13} className="text-ink" />
            {errorMsg}
          </div>
        )}

        {resumeUrl && (
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
              Document Target
            </h3>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm underline break-all opacity-80 hover:opacity-100 font-mono"
            >
              Open stored file asset
              <ExternalLink size={12} className="flex-shrink-0" />
            </a>
          </div>
        )}

        {review && (
          <div className="mt-8 border-t border-line pt-6 space-y-6">
            {/* Score gauge — built only from the real atsScore, no fabricated axes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-muted" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  ATS Index Score
                </h3>
              </div>
              <div className="border border-line rounded-xl bg-card p-6 flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={GAUGE_RADIUS}
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={GAUGE_RADIUS}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-3xl font-medium leading-none tabular-nums">
                      {Math.round(score)}
                    </span>
                    <span className="font-mono text-[9px] text-muted tracking-wide mt-1">
                      / 100
                    </span>
                  </div>
                </div>
                <p className="font-serif text-sm leading-relaxed text-muted">
                  {scoreNote(score)}
                </p>
              </div>
            </div>

            {/* Strengths / weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-line rounded-xl bg-card p-4">
                <div className="flex items-center gap-2 mb-3 text-muted">
                  <CheckCircle2 size={14} />
                  <h4 className="font-mono text-[11px] uppercase tracking-wider">Strengths</h4>
                </div>
                {review.strengths && review.strengths.length > 0 ? (
                  <ul className="space-y-2 list-none">
                    {review.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="font-serif text-xs text-muted leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="text-ink select-none font-mono">/</span> {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-xs text-muted italic">
                    No distinct positive parameters indexed.
                  </p>
                )}
              </div>

              <div className="border border-line rounded-xl bg-card p-4">
                <div className="flex items-center gap-2 mb-3 text-muted">
                  <XCircle size={14} />
                  <h4 className="font-mono text-[11px] uppercase tracking-wider">Vulnerabilities</h4>
                </div>
                {review.weaknesses && review.weaknesses.length > 0 ? (
                  <ul className="space-y-2 list-none">
                    {review.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="font-serif text-xs text-muted leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="text-ink select-none font-mono">/</span> {weakness}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-xs text-muted italic">
                    No core structural optimization defects logged.
                  </p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-muted" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  Optimization Roadmap
                </h3>
              </div>
              <div className="border border-line rounded-xl bg-card p-5">
                {review.suggestions && review.suggestions.length > 0 ? (
                  <ul className="space-y-3 list-none">
                    {review.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="font-serif text-sm text-muted leading-relaxed flex items-start gap-2"
                      >
                        <span className="font-mono text-[10px] border border-line text-ink w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-sm text-muted italic">
                    No strategic modifications recommended.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
