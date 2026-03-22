"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";

type Category = "temples" | "cemeteries";

interface Venue {
  id: number; nameTh: string; address: string; district: string; distance: string;
  rating: number; reviewCount: number; phone: string; openHours: string;
  categories: Category[]; lat: number; lng: number; tags: string[];
}

const venues: Venue[] = [
  // Bangkok
  { id: 1, nameTh: "วัดพระศรีมหาธาตุ", address: "ถ.พหลโยธิน แขวงอนุสาวรีย์", district: "เขตบางเขน กรุงเทพฯ", distance: "3.2 กม.", rating: 4.8, reviewCount: 312, phone: "02-521-3227", openHours: "06:00–18:00", categories: ["temples"], lat: 13.8657, lng: 100.6086, tags: ["พิธีสวดมนต์", "ฌาปนกิจ", "ห้องพระ"] },
  { id: 2, nameTh: "วัดเทพศิรินทร์", address: "42 ถ.กรุงเกษม แขวงวัดเทพศิรินทร์", district: "เขตป้อมปราบฯ กรุงเทพฯ", distance: "8.7 กม.", rating: 4.6, reviewCount: 189, phone: "02-221-1998", openHours: "06:00–20:00", categories: ["temples"], lat: 13.7488, lng: 100.5193, tags: ["ฌาปนกิจ", "ห้องพัก"] },
  { id: 3, nameTh: "วัดสุทธิวราราม", address: "149 ถ.เจริญกรุง แขวงยานนาวา", district: "เขตสาทร กรุงเทพฯ", distance: "12.3 กม.", rating: 4.5, reviewCount: 97, phone: "02-211-3322", openHours: "06:00–18:00", categories: ["temples"], lat: 13.7162, lng: 100.5178, tags: ["สวดมนต์", "สงบ"] },
  { id: 4, nameTh: "สุสานวัดมกุฎกษัตริยาราม", address: "ถ.ราชดำเนินนอก แขวงบ้านพานถม", district: "เขตพระนคร กรุงเทพฯ", distance: "11.2 กม.", rating: 4.3, reviewCount: 76, phone: "02-281-4080", openHours: "08:00–17:00", categories: ["cemeteries"], lat: 13.7667, lng: 100.5072, tags: ["ฝังศพ", "สงบ"] },
  { id: 5, nameTh: "สุสานนานาชาติบางนา", address: "ถ.บางนา–ตราด กม.10", district: "เขตบางนา กรุงเทพฯ", distance: "18.4 กม.", rating: 4.5, reviewCount: 140, phone: "02-398-4201", openHours: "07:00–18:00", categories: ["cemeteries"], lat: 13.6637, lng: 100.6726, tags: ["นานาชาติ", "สงบ"] },
  // Chiang Mai
  { id: 6, nameTh: "วัดเจดีย์หลวง วรวิหาร", address: "103 ถ.พระปกเกล้า ต.ศรีภูมิ", district: "อ.เมือง เชียงใหม่", distance: "680 กม.", rating: 4.9, reviewCount: 520, phone: "053-276-140", openHours: "08:00–17:00", categories: ["temples"], lat: 18.7869, lng: 98.9865, tags: ["โบราณสถาน", "สวยงาม", "สวดมนต์"] },
  { id: 7, nameTh: "วัดพระสิงห์ วรมหาวิหาร", address: "ถ.สามล้าน ต.พระสิงห์", district: "อ.เมือง เชียงใหม่", distance: "681 กม.", rating: 4.8, reviewCount: 450, phone: "053-273-052", openHours: "09:00–18:00", categories: ["temples"], lat: 18.7885, lng: 98.9814, tags: ["พระพุทธสิหิงค์", "วัฒนธรรม", "เชียงใหม่"] },
  { id: 8, nameTh: "วัดอุโมงค์ (สวนพุทธธรรม)", address: "135 หมู่ 10 ต.สุเทพ", district: "อ.เมือง เชียงใหม่", distance: "685 กม.", rating: 4.7, reviewCount: 280, phone: "053-810-305", openHours: "05:00–20:00", categories: ["temples"], lat: 18.7831, lng: 98.9515, tags: ["สงบ", "ธรรมชาติ", "ถ้ำ"] },
  { id: 9, nameTh: "สุสานมหายาน (ดอยสุเทพ)", address: "ถ.ศรีวิชัย ต.สุเทพ", district: "อ.เมือง เชียงใหม่", distance: "690 กม.", rating: 4.4, reviewCount: 35, phone: "053-295-000", openHours: "08:00–17:00", categories: ["cemeteries"], lat: 18.8048, lng: 98.9213, tags: ["จีน", "ภูเขา", "สงบ"] },
];

// CATS will be defined inside the component to use localized labels

function Stars({ rating }: { rating: number }) {
  return <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l1.09 2.47H8.5L6.6 5.03l.72 2.47L5 6.2 2.68 7.5l.72-2.47L1.5 3.47H3.91L5 1z" fill={i <= Math.round(rating) ? "#c9b59c" : "#e5e5e5"} /></svg>)}</div>;
}

function MapEmbed({ venue }: { venue: Venue }) {
  return (
    <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-[#e5e5e5] relative">
      <iframe key={venue.id} src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.lng - 0.012}%2C${venue.lat - 0.009}%2C${venue.lng + 0.012}%2C${venue.lat + 0.009}&layer=mapnik&marker=${venue.lat}%2C${venue.lng}`} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title={venue.nameTh} />
      <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm pointer-events-none">
        <p className="text-[11px] font-semibold text-[#4a4a4a]">{venue.nameTh}</p>
        <p className="text-[9px] text-[#8b8b8b]">{venue.district}</p>
      </div>
    </div>
  );
}

function ConfirmSheet({ venue, hasPackage, onClose, onConfirm, t }: { venue: Venue; hasPackage: boolean; onClose: () => void; onConfirm: () => void; t: any }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: "0 auto" }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full px-6 pt-6 pb-32 z-10">
        <div className="w-10 h-1 rounded-full bg-[#e5e5e5] mx-auto mb-5" />
        <div className="w-14 h-14 rounded-2xl bg-[#f5f1ed] flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 25.5C14 25.5 4.5 18 4.5 11.5C4.5 6.53 8.81 2.5 14 2.5C19.19 2.5 23.5 6.53 23.5 11.5C23.5 18 14 25.5 14 25.5Z" stroke="#c9b59c" strokeWidth="2" fill="none" /><circle cx="14" cy="11.5" r="3.5" stroke="#c9b59c" strokeWidth="2" /></svg>
        </div>
        <h2 className="text-[17px] font-semibold text-[#4a4a4a] text-center mb-1">{t.mapConfirm}</h2>
        <p className="text-[13px] text-[#8b8b8b] text-center mb-1">{venue.nameTh}</p>
        <p className="text-[11px] text-[#8b8b8b] text-center mb-3">{venue.district}</p>
        {!hasPackage && <p className="text-[10px] text-[#c4b5a0] text-center bg-[#faf8f5] rounded-xl py-2 px-3 mb-3">{t.mapNextPkg}</p>}
        <button onClick={onConfirm} className="w-full bg-[#c9b59c] text-white rounded-xl py-3.5 text-[13.6px] font-semibold mb-3 transition-opacity hover:opacity-90 active:opacity-80">{t.mapConfirmBtn}</button>
        <button onClick={onClose} className="w-full bg-[#f5f1ed] text-[#4a4a4a] rounded-xl py-3.5 text-[13.6px] font-medium transition-opacity hover:bg-[#efe9e3]">{t.cancel}</button>
      </div>
    </div>
  );
}

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const t = translations[lang];

  const CATS: { key: Category; label: string; icon: string }[] = [
    { key: "temples", label: t.mapTemples, icon: "⛩" },
    { key: "cemeteries", label: t.mapCemeteries, icon: "🪦" },
  ];

  const packageId = searchParams.get("packageId");
  const hasPackage = !!packageId;

  const [category, setCategory] = useState<Category>("temples");
  const [selectedId, setSelectedId] = useState(1);
  const [chosenVenue, setChosenVenue] = useState<Venue | null>(null);
  const [search, setSearch] = useState("");

  const filtered = venues.filter(v => 
    v.categories.includes(category) && 
    (search.trim() === "" || 
     v.nameTh.toLowerCase().includes(search.toLowerCase()) || 
     v.district.toLowerCase().includes(search.toLowerCase()) ||
     v.address.toLowerCase().includes(search.toLowerCase()))
  );
  
  const selectedVenue = venues.find(v => v.id === selectedId) ?? filtered[0];

  function handleConfirm() {
    if (!chosenVenue) return;
    if (hasPackage) {
      router.push(`/payment-selection?packageId=${packageId}&venueId=${chosenVenue.id}`);
    } else {
      // ไม่มีแพ็กเกจ → ไปเลือกแพ็กเกจพร้อม venueId
      router.push(`/packages?venueId=${chosenVenue.id}`);
    }
  }

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      <div className="bg-white rounded-b-3xl px-6 pt-12 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">{t.mapTitle}</h1>
            <p className="text-[11px] text-[#8b8b8b]">{hasPackage ? t.mapSubHasPkg : t.mapSubNoPkg}</p>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1">
            {[hasPackage, true, false].map((active, i) => (
              <div key={i} className={`rounded-full transition-all ${active ? "w-4 h-2 bg-[#c4b5a0]" : "w-2 h-2 bg-[#e5e5e5]"}`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {CATS.map(cat => (
            <button key={cat.key} onClick={() => { setCategory(cat.key); const f = venues.find(v => v.categories.includes(cat.key)); if (f) setSelectedId(f.id); }}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[9.5px] font-medium transition-all ${category === cat.key ? "bg-[#c9b59c] text-white" : "bg-[#f5f1ed] text-[#8b8b8b]"}`}>
              <span className="text-base leading-none">{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b8b8b]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <input
            type="text"
            placeholder={t.mapSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f5f1ed] border-none rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-[#4a4a4a] placeholder:text-[#8b8b8b] focus:ring-1 focus:ring-[#c9b59c]"
          />
        </div>
      </div>

      <div className="px-5 pt-4 pb-32 flex flex-col gap-3">
        {selectedVenue && <MapEmbed venue={selectedVenue} />}
        <div className="flex justify-between items-center">
          <h2 className="text-[13px] font-semibold text-[#4a4a4a]">{CATS.find(c => c.key === category)?.label} {t.mapNear}</h2>
          <span className="text-[10px] text-[#8b8b8b]">{filtered.length} {t.mapVenuesCount}</span>
        </div>
        {filtered.map(venue => {
          const isSel = selectedId === venue.id;
          return (
            <div key={venue.id} onClick={() => setSelectedId(venue.id)} className={`border rounded-2xl bg-white cursor-pointer transition-all ${isSel ? "border-[#c9b59c] shadow-sm" : "border-[#f5f1ed]"}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isSel ? "bg-[#c9b59c]" : "bg-[#f5f1ed]"}`}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 16.5S3.5 11.5 3.5 7.5C3.5 4.46 5.96 2 9 2c3.04 0 5.5 2.46 5.5 5.5 0 4-5.5 9-5.5 9z" stroke={isSel ? "white" : "#c4b5a0"} strokeWidth="1.5" fill="none" /><circle cx="9" cy="7.5" r="2" stroke={isSel ? "white" : "#c4b5a0"} strokeWidth="1.5" /></svg>
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-[#4a4a4a]">{venue.nameTh}</h3>
                      <p className="text-[9.5px] text-[#8b8b8b] mt-0.5">{venue.address}</p>
                      <p className="text-[9.5px] text-[#8b8b8b]">{venue.district}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 mb-0.5"><Stars rating={venue.rating} /><span className="text-[9px] text-[#8b8b8b]">{venue.rating}</span></div>
                    <p className="text-[9px] text-[#8b8b8b]">({venue.reviewCount})</p>
                  </div>
                </div>
                <div className="flex gap-3 mb-3">
                  <span className="text-[9.5px] text-[#8b8b8b]">🕐 {venue.openHours}</span>
                  <span className="text-[9.5px] text-[#8b8b8b]">• {venue.distance}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {venue.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-[#f5f1ed] text-[8.5px] text-[#8b8b8b]">{t}</span>)}
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${venue.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f5f1ed]">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2.5a.5.5 0 01.5-.5h2a.5.5 0 01.47.34l.76 2.5a.5.5 0 01-.15.53L4.4 6.3a7.5 7.5 0 003.3 3.3l.93-1.13a.5.5 0 01.53-.15l2.5.76A.5.5 0 0112 9.5v2a.5.5 0 01-.5.5C5.15 12 1 7.85 1 2.5" stroke="#4a4a4a" strokeWidth="1" fill="none" /></svg>
                    <span className="text-[10px] font-medium text-[#4a4a4a]">{t.mapCall}</span>
                  </a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f5f1ed]">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h10M8.5 3l3 3.5-3 3" stroke="#4a4a4a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="text-[10px] font-medium text-[#4a4a4a]">{t.mapDirection}</span>
                  </a>
                  <button onClick={e => { e.stopPropagation(); setChosenVenue(venue); }} className="flex-1 py-2 rounded-xl bg-[#c9b59c] text-white text-[10px] font-semibold">{t.mapSelect}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {chosenVenue && <ConfirmSheet venue={chosenVenue} hasPackage={hasPackage} onClose={() => setChosenVenue(null)} onConfirm={handleConfirm} t={t} />}
      <BottomNav />
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="min-h-dvh bg-[#f9f8f6]" />}><MapContent /></Suspense>;
}