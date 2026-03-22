"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";

export default function SplashPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-[#f9f8f6] cursor-pointer fade-in"
      onClick={() => router.push("/onboarding")}
    >
      {/* Logo circle */}
      <div className="relative w-[150px] h-[147px] mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#c9b59c]" />
        {/* Inner image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90px] h-[72px] flex items-center justify-center">
            {/* Coffin / flower icon SVG */}
            <svg width="65" height="65" viewBox="0 0 100 100" fill="none">
              {/* Heart outline */}
              <path d="M50 85 C50 85, 15 55, 15 32 C15 15, 35 15, 50 35 C65 15, 85 15, 85 32 C85 55, 50 85, 50 85 Z" stroke="#c9b59c" strokeWidth="5" strokeLinejoin="round" fill="none"/>
              {/* Lotus stem */}
              <path d="M50 80 V55" stroke="#c9b59c" strokeWidth="5" strokeLinecap="round"/>
              {/* Center petal */}
              <path d="M50 55 C45 40, 50 35, 50 35 C50 35, 55 40, 50 55 Z" fill="#c9b59c"/>
              {/* Left petal */}
              <path d="M49 55 C35 50, 30 40, 30 40 C30 40, 40 45, 47 50 Z" fill="#c9b59c"/>
              {/* Right petal */}
              <path d="M51 55 C65 50, 70 40, 70 40 C70 40, 60 45, 53 50 Z" fill="#c9b59c"/>
            </svg>
          </div>
        </div>
      </div>

      {/* App name */}
      <h1 className="text-[22px] font-bold text-[#4a4a4a] tracking-widest mb-2">
        LASTLY
      </h1>

      {/* Thai tagline */}
      <p className="text-[14px] text-[#8b8b8b] text-center leading-relaxed px-8">
        {t.splashTag}
      </p>

      {/* Subtle pulse dot */}
      <div className="mt-16 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#c9b59c] animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#e5e5e5] animate-pulse [animation-delay:0.2s]" />
        <div className="w-2 h-2 rounded-full bg-[#e5e5e5] animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
