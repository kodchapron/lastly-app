"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import ProgressDots from "@/components/ProgressDots";
import Button from "@/components/Button";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  const steps = [
    {
      id: 0,
      title: t.onboard1Title,
      subtitle: t.onboard1Sub,
      illustration: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <path d="M20 16 L48 10 L76 16 L82 50 L48 86 L14 50 Z" stroke="#c4b5a0" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
          <circle cx="48" cy="48" r="8" stroke="#c4b5a0" strokeWidth="2" fill="none"/>
          <path d="M48 34 V40 M48 56 V62 M34 48H40 M56 48H62" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round"/>
          <path d="M38.5 38.5L43 43 M53 53L57.5 57.5 M57.5 38.5L53 43 M43 53L38.5 57.5" stroke="#c4b5a0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M48 22 V30 M44 26H52" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 1,
      title: t.onboard2Title,
      subtitle: t.onboard2Sub,
      illustration: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <rect x="12" y="16" width="72" height="72" rx="8" stroke="#c4b5a0" strokeWidth="2.5" fill="none"/>
          <path d="M32 8 V20 M64 8 V20" stroke="#c4b5a0" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 40 H84" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="32" cy="56" r="3" fill="#c4b5a0"/>
          <circle cx="48" cy="56" r="3" fill="#c4b5a0"/>
          <circle cx="64" cy="56" r="3" stroke="#c4b5a0" strokeWidth="2" fill="none"/>
          <circle cx="32" cy="72" r="3" stroke="#c4b5a0" strokeWidth="2" fill="none"/>
          <circle cx="48" cy="72" r="3" stroke="#c4b5a0" strokeWidth="2" fill="none"/>
          <circle cx="67" cy="67" r="12" stroke="#c4b5a0" strokeWidth="2" fill="white"/>
          <path d="M67 61 V67 L71 71" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: t.onboard3Title,
      subtitle: t.onboard3Sub,
      illustration: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="28" cy="28" r="10" stroke="#c4b5a0" strokeWidth="2.5" fill="none"/>
          <path d="M8 72 C8 56 48 56 48 72" stroke="#c4b5a0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <rect x="52" y="20" width="36" height="56" rx="6" stroke="#c4b5a0" strokeWidth="2" fill="none"/>
          <path d="M60 36 H80 M60 48 H80 M60 60 H72" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round"/>
          <path d="M57 35 L59 37 L63 33" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M57 47 L59 49 L63 45" stroke="#c4b5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push("/auth");
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f9f8f6] relative">
      {/* Skip button */}
      <button
        onClick={() => router.push("/auth")}
        className="absolute top-4 right-4 text-sm text-[#8b8b8b] hover:text-[#4a4a4a] transition-colors px-2 py-1"
      >
        {t.skip}
      </button>

      {/* Content area */}
      <div className="flex flex-1 flex-col items-center justify-between px-6 pt-16 pb-10">
        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[256px] h-[256px] rounded-full bg-[#f5f1ed] flex items-center justify-center relative">
            {/* Middle ring */}
            <div className="absolute w-[230px] h-[230px] rounded-full bg-[#c4b5a0]/10" />
            {/* Inner ring */}
            <div className="absolute w-[192px] h-[192px] rounded-full bg-[#c4b5a0]/10" />
            {/* Icon */}
            <div className="relative z-10 w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              {step.illustration}
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="w-full text-center mb-8 fade-in" key={currentStep}>
          <h2 className="text-[20.4px] font-semibold text-[#4a4a4a] mb-3">
            {step.title}
          </h2>
          <p className="text-[13.6px] text-[#8b8b8b] leading-relaxed max-w-[320px] mx-auto">
            {step.subtitle}
          </p>
        </div>

        {/* Bottom controls */}
        <div className="w-full flex flex-col items-center gap-6">
          <ProgressDots total={3} current={currentStep} />
          <Button variant="primary" fullWidth onClick={handleNext}>
            {isLast ? t.onboardStart : (
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t.next}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
