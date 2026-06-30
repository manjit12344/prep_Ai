import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { userAuth } from "../store/01.auth.store";
import WelcomeSection from "../components/features/WelcomeSection";
import StartInterviewCard from "../components/features/StartInterviewCard";
import FeatureInfoList from "../components/features/FeatureInfoList";
import DashboardFooter from "../components/features/DashboardFooter";

const Features = () => {
  const { know, knowMe } = userAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await knowMe();
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (authChecked && !know?.user) {
      navigate("/login-signup");
    }
  }, [authChecked, know, navigate]);

  if (!authChecked || !know?.user) {
    return null;
  }

  const userName = know?.user?.displayName || know?.user?.email?.split('@')[0] || "Guest";

  return (
    <div className="min-h-screen bg-canvas text-main font-sans antialiased border-t border-line flex flex-col justify-between transition-colors duration-150">
      
      {/* Centered Main Content Wrapper */}
      <main className="max-w-3xl mx-auto w-full px-6 py-20 flex-1 flex flex-col justify-center">
        <WelcomeSection userName={userName} />
        <StartInterviewCard />
        <FeatureInfoList />
      </main>

      {/* Sticky Bottom Dashboard Footer */}
      <DashboardFooter />
      
    </div>
  );
};

export default Features;