"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";

import { supabase } from "@/lib/supabase";

function generateEventDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const t = translations[lang];

  const method = searchParams.get("method") || "credit";
  const packageId = searchParams.get("packageId");
  const venueId = searchParams.get("venueId");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pkg, setPkg] = useState<any>(null);
  const [venueData, setVenueData] = useState<any>(null);

  require("react").useEffect(() => {
    async function loadData() {
      if (packageId) {
        const { data } = await supabase.from("packages").select("*").eq("id", packageId).single();
        if (data) setPkg(data);
      }
      if (venueId) {
        const { data } = await supabase.from("venues").select("*").eq("id", venueId).single();
        if (data) setVenueData(data);
      }
    }
    loadData();
  }, [packageId, venueId]);

  async function handleComplete() {
    setLoading(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user && pkg) {
      // 1. ลงบันทึกงานใหม่ (funerals table)
      const { data: funeral } = await supabase.from("funerals").insert([{
        user_id: user.id,
        package_id: pkg.id,
        venue_name: venueData?.name_th || "ไม่ระบุสถานที่",
        venue_address: venueData?.address || "",
        start_date: generateEventDate(0),
        end_date: generateEventDate(pkg.days)
      }]).select().single();

      // 2. สร้าง Events สำหรับกำหนดการอัตโนมัติ (schedule_events / events table)
      const days = pkg.days || 3;
      const newEvents = [];
      const locationName = venueData?.name_th || "สถานที่ที่เลือก";

      // การจัดคิว: วันที่ 1 ถึง (days - 1) คือการสวดอภิธรรม
      for (let i = 0; i < days - 1; i++) {
        newEvents.push({
          profile_id: user.id,
          date: generateEventDate(i),
          time: "19:00",
          end_time: "20:30",
          title: `สวดพระอภิธรรม (วันที่ ${i + 1})`,
          subtitle: `แพ็กเกจ: ${pkg.name}`,
          category: "ceremony",
          location: locationName
        });
      }

      // วันสุดท้าย: ฌาปนกิจ
      newEvents.push({
        profile_id: user.id,
        date: generateEventDate(days - 1),
        time: "10:00",
        end_time: "12:00",
        title: "ถวายภัตตาหารเพล",
        category: "ceremony",
        location: locationName
      });
      newEvents.push({
        profile_id: user.id,
        date: generateEventDate(days - 1),
        time: "16:00",
        end_time: "17:30",
        title: "พิธีฌาปนกิจ",
        subtitle: "กรุณามาเตรียมพร้อมก่อนเวลา",
        category: "ceremony",
        urgent: true,
        location: locationName
      });

      await supabase.from("events").insert(newEvents);
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/schedule"), 1800);
  }

  if (!pkg) {
    return <div className="min-h-dvh bg-[#f9f8f6] flex items-center justify-center text-[13px] text-[#8b8b8b]">กำลังโหลด...</div>;
  }

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      <div className="bg-white px-6 pt-12 pb-5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">{t.payTitle}</h1>
            <p className="text-[11px] text-[#8b8b8b]">{t.paySub}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-32 flex flex-col gap-5">

        {/* Success */}
        {success && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-24 h-24 rounded-full bg-[#f0fdf4] flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01l-3-3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-[#4a4a4a]">{t.paySuccess}</h2>
              <p className="text-[12px] text-[#8b8b8b] mt-2">{t.payRedirect}</p>
            </div>
          </div>
        )}

        {!success && (
          <>
            {/* Amount */}
            <div className="bg-gradient-to-br from-[#c4b5a0] to-[#b8a48b] rounded-2xl p-5 text-white">
              <p className="text-[10px] text-white/70 mb-1">{t.payAmount}</p>
              <p className="text-[28px] font-bold">฿{pkg.price.toLocaleString()}</p>
              <p className="text-[11px] text-white/80 mt-1">{pkg.name}</p>
            </div>

            {/* QR Code — รูปจริง */}
            {method === "promptpay" && (
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm border border-[#f0ebe4]">
                <p className="text-[13px] font-semibold text-[#4a4a4a]">{t.payScanQR}</p>
                {/* ✅ ใช้รูป QR จริงที่แนบมา — วางไฟล์ qrpromptpay.JPG ใน /public/images/ */}
                <img
                  src="/images/qr-code.jpg"
                  alt="QR PromptPay"
                  className="w-56 h-auto rounded-2xl border border-[#f0ebe4] shadow-sm"
                />
                <p className="text-[10px] text-[#8b8b8b] text-center">
                  {t.payPPNote}
                </p>
              </div>
            )}

            {/* Mobile banking */}
            {method === "mobile_banking" && (
              <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-[#f0ebe4]">
                <p className="text-[13px] font-semibold text-[#4a4a4a]">{t.payMBLabel}</p>
                <div className="bg-[#f9f8f6] rounded-xl p-4 flex flex-col gap-3">
                  {[
                    { label: t.payMBAccName, value: "น.ส. กชพร ตั้งวิวัฒนากุล" },
                    { label: t.payMBAccNo, value: "xxx-x-x0148-x" },
                    { label: t.payMBBank, value: "กสิกรไทย (KBank)" },
                    { label: t.payMBAmount, value: `฿${pkg.price.toLocaleString()}` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-[12px]">
                      <span className="text-[#8b8b8b]">{row.label}</span>
                      <span className="font-semibold text-[#4a4a4a]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#8b8b8b]">{t.payMBConfirmNote}</p>
              </div>
            )}

            {/* Credit */}
            {method === "credit" && (
              <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm border border-[#f0ebe4]">
                <p className="text-[13px] font-semibold text-[#4a4a4a]">{t.payCardConfirm}</p>
                <div className="bg-[#f9f8f6] rounded-xl p-4 flex items-center gap-3">
                  <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                    <rect x="0.5" y="0.5" width="35" height="23" rx="3.5" fill="white" stroke="#e5e5e5" />
                    <rect x="0" y="8" width="36" height="6" fill="#c4b5a0" fillOpacity="0.3" />
                  </svg>
                  <p className="text-[12px] text-[#4a4a4a]">•••• •••• •••• ****</p>
                </div>
                <p className="text-[10px] text-[#8b8b8b]">{t.payCardNote}{pkg.price.toLocaleString()}</p>
              </div>
            )}

            {/* Security */}
            <div className="bg-white border border-[#f0ebe4] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#c4b5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="#c4b5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#4a4a4a]">{t.paySecureTitle}</p>
                <p className="text-[9.5px] text-[#8b8b8b]">{t.paySecureSub}</p>
              </div>
            </div>

            <button onClick={handleComplete} disabled={loading}
              className="w-full bg-[#c4b5a0] disabled:opacity-60 text-white py-4 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md active:opacity-80 transition-opacity">
              {loading ? (
                <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{t.payVerifying}</>
              ) : t.payConfirm}
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#f9f8f6]" />}>
      <PaymentContent />
    </Suspense>
  );
}