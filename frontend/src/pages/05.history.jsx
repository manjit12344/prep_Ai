import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import { userAuth } from "../store/01.auth.store";
import { useHistory } from "../store/03.history";
import { Activity, CheckCircle2 } from "lucide-react";
import TabSwitcher from "../components/history/TabSwitcher";
import SessionCard from "../components/history/SessionCard";
import EmptyState from "../components/history/EmptyState";

const History = () => {
  const navigate = useNavigate();
  const { know, knowMe } = userAuth();
  const { myInterviews, interview, completed, loading } = useHistory();

  // Tab Controller State: 'active' or 'completed'
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const checkAuthAndFetchHistory = async () => {
      await knowMe();
    };
    checkAuthAndFetchHistory();
  }, []);

  useEffect(() => {
    if (know?.user) {
      myInterviews();
    }
  }, [know?.user, myInterviews]);

  // Handle unauthenticated view
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

  // Choose display list array depending on current selection toggle
  const targetedList = activeTab === "active" ? interview : completed;

  return (
    <div className="min-h-screen bg-canvas text-main font-sans antialiased border-t border-line flex flex-col justify-between transition-colors duration-150">

      <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">

        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-main">Interview History</h1>
            <p className="text-xs text-muted mt-1">
              Review and continue your previous mock interview sessions.
            </p>
          </div>

          {/* Metrics Panel */}
          <div className="flex items-center gap-2 font-mono text-xs self-start sm:self-center select-none">
            <div className="flex items-center gap-1.5 border border-line px-2.5 py-1 rounded bg-card/20 text-muted">
              <Activity size={12} />
              <span>active: {interview?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 border border-line px-2.5 py-1 rounded bg-card/20 text-muted">
              <CheckCircle2 size={12} />
              <span>done: {completed?.length || 0}</span>
            </div>
          </div>
        </div>

        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCount={interview?.length || 0}
          completedCount={completed?.length || 0}
        />

        {/* Sessions Stack Feed */}
        <div className="space-y-3">
          {loading ? (
            <EmptyState variant="loading" />
          ) : targetedList && targetedList.length > 0 ? (
            targetedList.map((e) => (
              <SessionCard
                key={e.id}
                session={e}
                userId = {know?.user?.id}
                activeTab={activeTab}
                onClick={() => {
                  if(e.status === "going")   //brothaar veri importaant
                  navigate(`/chatSession/${e.id}`)
                  else  navigate(`/analytics/${e.id}/${know?.user?.id}`)
                }}
              />
            ))
          ) : (
            <EmptyState variant="empty" label={activeTab} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full px-6 py-6 border-t border-line flex items-center justify-between font-mono text-[10px] text-muted">
      <span>Status: Connected</span>
      <span> {new Date().getFullYear()} prepAI. Made with ❤️ by Manjit </span>
    </footer>
    </div>
  );
};

export default History;
