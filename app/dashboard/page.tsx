"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatBubbleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const photo = localStorage.getItem("lastly_profilePhoto");
    if (photo) setProfilePhoto(photo);
  }, []);

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-[#8b8b8b] mb-1">{t.dbGreeting}</p>
          <h1 className="text-[16px] font-semibold text-[#4a4a4a]">{t.dbName}</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-sm bg-[#c9b59c] text-white">
          {profilePhoto ? <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" /> : t.dbName.substring(0, 2)}
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6 pb-32">

        {/* Banner */}
        <Link href="/packages" className="relative block overflow-hidden bg-gradient-to-r from-[#cfc3b0] to-[#dbcab6] rounded-2xl p-5 shadow-sm transition-transform active:scale-[0.98]">
          <div className="flex items-center gap-2 text-white mb-2">
            <SparkleIcon />
            <span className="text-[11px] font-medium">{t.dbBannerTag}</span>
          </div>
          <h2 className="text-[16px] font-bold text-white mb-3">{t.dbBannerTitle}</h2>
          <p className="text-[10px] text-white/80">{t.dbBannerLink} &rsaquo;</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>

        {/* Services grid */}
        <section>
          <h3 className="text-[13px] font-bold text-[#4a4a4a] mb-3">{t.dbServices}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/packages" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#c4b5a0]"><SparkleIcon /></div>
              <div>
                <h4 className="text-[12px] font-semibold text-[#4a4a4a]">{t.dbSrv1}</h4>
                <p className="text-[9px] text-[#8b8b8b] mt-0.5">{t.dbSrv1Sub}</p>
              </div>
            </Link>
            <Link href="/map" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#c4b5a0]"><LocationIcon /></div>
              <div>
                <h4 className="text-[12px] font-semibold text-[#4a4a4a]">{t.dbSrv2}</h4>
                <p className="text-[9px] text-[#8b8b8b] mt-0.5">{t.dbSrv2Sub}</p>
              </div>
            </Link>
            <Link href="/schedule" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#c4b5a0]"><CalendarIcon /></div>
              <div>
                <h4 className="text-[12px] font-semibold text-[#4a4a4a]">{t.dbSrv3}</h4>
                <p className="text-[9px] text-[#8b8b8b] mt-0.5">{t.dbSrv3Sub}</p>
              </div>
            </Link>
            <Link href="/chatbot" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#c4b5a0]"><ChatBubbleIcon /></div>
              <div>
                <h4 className="text-[12px] font-semibold text-[#4a4a4a]">{t.dbSrv4}</h4>
                <p className="text-[9px] text-[#8b8b8b] mt-0.5">{t.dbSrv4Sub}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Active funeral */}
        <section>
          <h3 className="text-[13px] font-bold text-[#4a4a4a] mb-3">{t.dbActive}</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-[14px] font-bold text-[#4a4a4a]">{t.dbActiveEvent}</h4>
              <div className="bg-[#f0fdf4] text-[#22c55e] text-[10px] font-medium px-2 py-1 rounded-full">{t.dbActiveDateTag}</div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8b8b8b] mb-4">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t.dbActiveDate}</span>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center gap-2 text-[11px] text-[#4a4a4a]">
                <span className="w-1 h-1 rounded-full bg-[#c4b5a0]" />
                <span>{t.dbActivePkg}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#4a4a4a]">
                <span className="w-1 h-1 rounded-full bg-[#c4b5a0]" />
                <span>{t.dbActiveLoc}</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#8b8b8b]">{t.dbActiveProg}</span>
                <span className="font-semibold text-[#4a4a4a]">65%</span>
              </div>
              <div className="w-full h-1.5 bg-[#f5f1ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#c4b5a0] w-[65%] rounded-full" />
              </div>
            </div>
            <div className="pt-3 border-t border-[#f5f1ed]">
              <Link href="/schedule" className="w-full flex justify-between items-center text-[10px] text-[#8b8b8b]">
                {t.dbActiveLink}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section>
          <h3 className="text-[13px] font-bold text-[#4a4a4a] mb-3">{t.dbStepsMsg}</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: <SparkleIcon />, title: t.dbStep1, sub: t.dbStep1Sub, step: 1 },
              { icon: <LocationIcon />, title: t.dbStep2, sub: t.dbStep2Sub, step: 2 },
              { icon: <CheckCircleIcon />, title: t.dbStep3, sub: t.dbStep3Sub, step: 3 },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#c4b5a0] flex-shrink-0">{s.icon}</div>
                <div className="flex-1">
                  <h4 className="text-[12px] font-semibold text-[#4a4a4a]">{s.title}</h4>
                  <p className="text-[10px] text-[#8b8b8b] mt-0.5">{s.sub}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#c4b5a0] flex items-center justify-center text-white text-[11px] font-bold">{s.step}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Help banner → chatbot */}
        <section>
          <Link href="/chatbot" className="bg-[#cfc3b0] rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-transform active:scale-[0.98]">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#c4b5a0] flex-shrink-0"><HeartIcon /></div>
            <div className="flex-1">
              <h4 className="text-[12px] font-bold text-white">{t.dbHelp}</h4>
              <p className="text-[10px] text-white/90 mt-0.5">{t.dbHelpSub}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>

        {/* Recent activity */}
        <section>
          <h3 className="text-[13px] font-bold text-[#4a4a4a] mb-3">{t.dbRecent}</h3>
          <div className="bg-white rounded-2xl p-5 shadow-sm relative">
            <div className="absolute left-[27.5px] top-6 bottom-6 w-[1px] bg-[#f5f1ed]" />
            <ul className="flex flex-col gap-5 relative">
              {[
                { title: t.dbAct1, time: t.dbAct1Time },
                { title: t.dbAct2, time: t.dbAct2Time },
                { title: t.dbAct3, time: t.dbAct3Time },
              ].map((a) => (
                <li key={a.title} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c4b5a0] mt-[5px] relative z-10 box-content border-2 border-white" />
                  <div>
                    <h4 className="text-[11.5px] font-semibold text-[#4a4a4a] mb-0.5">{a.title}</h4>
                    <div className="flex items-center gap-1 text-[9px] text-[#8b8b8b]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {a.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>

      <BottomNav />
    </div>
  );
}