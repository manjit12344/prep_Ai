import React, { useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import { userChat } from "../store/02.chat.store";
import { userAuth } from "../store/01.auth.store";
import { STEPS } from "../components/createNew/createInterview.js";
import { useCreateInterviewForm } from "../components/createNew/useCreateInterviewForm";
import StepProgress from "../components/createNew/StepProgress";
import StepField from "../components/createNew/StepField";
import FormDebugPreview from "../components/createNew/FormDebugPreview";
import StepNavigation from "../components/createNew/StepNavigation";

const CreateNew = () => {
  const { preInt, loading } = userChat();
  const { know, knowMe } = userAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function look(){await knowMe();}
    look()
  }, []);

  const handleSubmit = async (form, setError) => {
    try {
      const data = await preInt(form.type, form.level, form.company);
      navigate(`/chatSession/${data.response.id}`);
    } catch (err) {
      console.log(err);
      setError("Failed to create interview.");
    }
  };

  const {
    step,
    current,
    isLastStep,
    form,
    error,
    handleChange,
    goNext,
    goBack,
    handleKeyDown,
  } = useCreateInterviewForm(STEPS, handleSubmit);

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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-canvas text-main flex flex-col lg:flex-row border-t border-line">
      
      {/* Sidebar - Steps Visualization */}
      <aside className="w-full lg:w-[340px] xl:w-[400px] border-b lg:border-b-0 lg:border-r border-line bg-card/20 p-5 lg:p-8">
        <div className="text-xs uppercase tracking-wider text-muted mb-4">
          Interview Setup
        </div>

        <h1 className="text-2xl font-semibold leading-tight mb-8">
          Let's create your interview session.
        </h1>

        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2">
          {STEPS.map((item, index) => {
            const active = index === step;
            const completed = index < step;

            return (
              <div
                key={item.key}
                className="flex items-start gap-3 min-w-[160px] lg:min-w-0"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? "border-main text-main"
                      : completed
                      ? "border-emerald-500 text-emerald-500"
                      : "border-line text-muted"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      active ? "text-main font-medium" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </p>

                  {completed && (
                    <p className="text-xs text-muted mt-1 truncate max-w-[140px]">
                      {form[item.key]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl bg-card border border-line rounded-2xl overflow-hidden shadow-sm">
          
          {/* Progress Header */}
          <StepProgress step={step} total={STEPS.length} />

          {/* Step Form Workspace */}
          <div className="p-5 md:p-8">
            <StepField
              current={current}
              value={form[current.key]}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              error={error}
              disabled={loading}
            />

            {/* State Preview Node */}
            <FormDebugPreview form={form} />

            {/* Controlled Action Core */}
            <StepNavigation
              step={step}
              isLastStep={isLastStep}
              loading={loading}
              onBack={goBack}
              onNext={goNext}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreateNew;