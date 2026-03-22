"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  basic: { name: "แพ็กเกจพื้นฐาน", price: 30000 },
  standard: { name: "แพ็กเกจมาตรฐาน", price: 50000 },
  premium: { name: "แพ็กเกจฟรีเมียม", price: 80000 },
};

const PAYMENT_METHODS = [
  {
    id: "credit",
    name: "บัตรเครดิต/เดบิต",
    sub: "Visa, Mastercard, JCB",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#c4b5a0" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="#c4b5a0" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "promptpay",
    name: "พร้อมเพย์",
    sub: "สแกน QR Code",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="1" stroke="#c4b5a0" strokeWidth="1.8" />
        <rect x="13" y="2" width="9" height="9" rx="1" stroke="#c4b5a0" strokeWidth="1.8" />
        <rect x="2" y="13" width="9" height="9" rx="1" stroke="#c4b5a0" strokeWidth="1.8" />
        <path d="M13 13h2v2h-2zM17 13h4M13 17h4M17 17v4M13 21h4" stroke="#c4b5a0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "mobile_banking",
    name: "โอนผ่านธนาคาร",
    sub: "โอนผ่านแอปพลิเคชันธนาคาร",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#c4b5a0" strokeWidth="1.8" />
        <path d="M9 18h6" stroke="#c4b5a0" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function PaymentSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId") || "standard";
  const venueId = searchParams.get("venueId") || "";
  // ✅ กดซ้ำ = deselect
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  function toggleMethod(id: string) {
    setSelectedMethod((prev) => (prev === id ? "" : id));
  }

  const pkg = PACKAGE_PRICES[packageId] ?? PACKAGE_PRICES.standard;

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      <div className="bg-white px-6 pt-12 pb-5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">ชำระเงิน</h1>
            <p className="text-[11px] text-[#8b8b8b]">เลือกวิธีชำระเงินที่สะดวก</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-32 flex flex-col gap-4">
        {/* Summary card */}
        <div className="bg-gradient-to-br from-[#c4b5a0] to-[#b8a48b] rounded-2xl p-5 text-white shadow-md">
          <p className="text-[10px] text-white/70 mb-1">ยอดที่ต้องชำระ</p>
          <p className="text-[32px] font-bold leading-none mb-4">฿{pkg.price.toLocaleString()}</p>
          <div className="border-t border-white/20 pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/80">{pkg.name}</span>
              <span className="font-semibold">฿{pkg.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-white/80">ค่าธรรมเนียม</span>
              <span className="font-semibold">฿0</span>
            </div>
          </div>
        </div>

        {/* Methods */}
        <div>
          <p className="text-[12px] font-semibold text-[#4a4a4a] mb-3">เลือกวิธีชำระเงิน</p>
          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <button key={method.id} onClick={() => toggleMethod(method.id)}
                  className={`w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 ${isSelected ? "bg-white border-2 border-[#c4b5a0] shadow-sm" : "bg-white border border-[#f0ebe4] shadow-sm"
                    }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#f5f1ed]" : "bg-[#f9f8f6]"}`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#4a4a4a]">{method.name}</p>
                    <p className="text-[10px] text-[#8b8b8b] mt-0.5">{method.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? "border-[#c4b5a0] bg-[#c4b5a0]" : "border-[#d4cec8]"
                    }`}>
                    {isSelected && <svg viewBox="0 0 20 20" fill="none" className="w-full h-full"><path d="M5 10l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credit card form */}
        {selectedMethod === "credit" && (
          <div className="bg-white rounded-2xl p-5 border border-[#f0ebe4] flex flex-col gap-3">
            <p className="text-[12px] font-semibold text-[#4a4a4a]">บัตรเครดิต/เดบิต</p>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#8b8b8b]">หมายเลขบัตร</label>
              <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0] transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#8b8b8b]">ชื่อบนบัตร</label>
              <input type="text" placeholder="FULL NAME" className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0] transition-colors uppercase" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] text-[#8b8b8b]">วันหมดอายุ</label>
                <input type="text" placeholder="MM/YY" maxLength={5} className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0] transition-colors" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] text-[#8b8b8b]">CVV</label>
                <input type="text" placeholder="•••" maxLength={3} className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0] transition-colors" />
              </div>
            </div>
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
            <p className="text-[11px] font-semibold text-[#4a4a4a]">การชำระเงินปลอดภัย</p>
            <p className="text-[9.5px] text-[#8b8b8b]">ข้อมูลการชำระเงินของคุณได้รับการเข้ารหัสและปลอดภัย</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!selectedMethod) return;
            router.push(`/payment?packageId=${packageId}&venueId=${venueId}&method=${selectedMethod}`);
          }}
          disabled={!selectedMethod}
          className="w-full bg-[#c4b5a0] disabled:bg-[#d4cec8] disabled:cursor-not-allowed text-white py-4 rounded-2xl text-[14px] font-semibold transition-all active:opacity-80 shadow-md"
        >
          ยืนยันการชำระเงิน
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default function PaymentSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#f9f8f6]" />}>
      <PaymentSelectionContent />
    </Suspense>
  );
}