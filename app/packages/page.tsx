"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

type Package = {
  id: string;
  name: string;
  name_en?: string;
  days: number;
  price: number;
  badge?: string;
  includes: string[];
};

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-[1px]">
      <path d="M20 6L9 17l-5-5" stroke={active ? "#fff" : "#c4b5a0"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setPackages(data);
        setLoading(false);
      });
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => (prev === id ? "" : id));
  }

  const selectedPkg = packages.find((p) => p.id === selected);

  const searchParams = useSearchParams();
  const venueId = searchParams.get("venueId");

  function handleConfirm() {
    if (!selectedPkg) return;
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      if (venueId) {
        router.push(`/payment-selection?packageId=${selectedPkg.id}&venueId=${venueId}`);
      } else {
        router.push(`/map?packageId=${selectedPkg.id}`);
      }
    }, 1000);
  }

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      <div className="bg-white px-6 pt-12 pb-5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">{t.pkgTitle}</h1>
            <p className="text-[11px] text-[#8b8b8b]">{t.pkgSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-36 flex flex-col gap-4">
        {loading && [1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-[#f5f1ed] rounded w-1/2 mb-3" />
            <div className="h-6 bg-[#f5f1ed] rounded w-3/4 mb-2" />
            <div className="h-px bg-[#f5f1ed] my-3" />
            {[1, 2, 3].map(j => <div key={j} className="h-3 bg-[#f5f1ed] rounded mb-2" />)}
          </div>
        ))}

        {!loading && packages.map((pkg) => {
          const isSelected = selected === pkg.id;
          return (
            <button key={pkg.id} onClick={() => toggleSelect(pkg.id)}
              className={`text-left w-full rounded-2xl p-5 transition-all duration-200 ${isSelected ? "bg-[#c4b5a0] shadow-md ring-2 ring-[#c4b5a0] ring-offset-2" : "bg-white shadow-sm"}`}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col gap-1">
                  {pkg.badge && <span className={`self-start text-[9px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/30 text-white" : "bg-[#f5f1ed] text-[#c4b5a0]"}`}>{pkg.badge}</span>}
                  <h2 className={`text-[15px] font-bold ${isSelected ? "text-white" : "text-[#4a4a4a]"}`}>{lang === 'en' && pkg.name_en ? pkg.name_en : pkg.name}</h2>
                  <p className={`text-[11px] ${isSelected ? "text-white/80" : "text-[#8b8b8b]"}`}>฿{pkg.price.toLocaleString()} • {pkg.days} {t.pkgDays || "วัน"}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition-all mt-1 flex items-center justify-center ${isSelected ? "bg-white border-white" : "border-[#d4cec8]"}`}>
                  {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#c4b5a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </div>
              <div className={`h-px my-3 ${isSelected ? "bg-white/20" : "bg-[#f5f1ed]"}`} />
              <ul className="flex flex-col gap-1.5">
                {pkg.includes.map((item) => (
                  <li key={item} className={`flex items-start gap-2 text-[11px] ${isSelected ? "text-white" : "text-[#4a4a4a]"}`}>
                    <CheckIcon active={isSelected} />{item}
                  </li>
                ))}
              </ul>
              <div className={`mt-4 pt-3 border-t flex items-center gap-1 text-[10px] font-medium ${isSelected ? "border-white/20 text-white/80" : "border-[#f5f1ed] text-[#c4b5a0]"}`}>
                {t.pkgCustomize || "ปรับแต่งแพ็กเกจนี้"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </button>
          );
        })}

        {!loading && (
          <Link href="/custom-package" className="text-left w-full rounded-2xl p-5 bg-white shadow-sm border border-dashed border-[#d4cec8] flex items-center gap-4 hover:border-[#c4b5a0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#f5f1ed] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#c4b5a0" strokeWidth="1.8" /><path d="M12 8v8M8 12h8" stroke="#c4b5a0" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-[#4a4a4a]">{t.pkgCustomBtn}</h3>
              <p className="text-[10px] text-[#8b8b8b] mt-0.5">{t.pkgCustomSub || "เลือกรายการที่ต้องการเอง"}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#c4b5a0]"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        )}

        {!loading && (
          <div className="bg-[#faf8f5] border border-[#ede8e1] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px]">✨</span>
              <p className="text-[11px] font-semibold text-[#8b8b8b]">{t.pkgInclTitle || "ทุกแพ็กเกจรวม:"}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {["ประสานงานวัด/สุสาน", "จัดหาพระสงฆ์", "ดูแลตลอดพิธี", "คืนงานมืออาชีพ"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[10px] text-[#8b8b8b]">
                  <div className="w-1 h-1 rounded-full bg-[#c4b5a0] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedPkg && (
          <button onClick={handleConfirm} disabled={confirming}
            className="w-full bg-[#c4b5a0] text-white py-4 rounded-2xl text-[14px] font-semibold transition-opacity active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">
            {confirming ? (<><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{t.saving}</>) : t.payCheckout}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}