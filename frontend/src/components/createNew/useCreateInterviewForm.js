import { useState } from "react";

export function useCreateInterviewForm(steps, onSubmit) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState(
    steps.reduce((acc, s) => ({ ...acc, [s.key]: "" }), {})
  );

  const current = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [current.key]: e.target.value,
    }));
    setError("");
  };

  const goNext = async () => {
    if (!form[current.key].trim()) {
      setError("This field is required.");
      return;
    }

    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }

    await onSubmit(form, setError);
  };

  const goBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      goNext();
    }
  };

  return {
    step,
    current,
    isLastStep,
    form,
    error,
    handleChange,
    goNext,
    goBack,
    handleKeyDown,
  };
}
