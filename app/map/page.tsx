"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

type Category = "temples" | "cemeteries";

interface Venue {
  id: number; nameTh: string; address: string; district: string; distance: string;
  rating: number; reviewCount: number; phone: string; openHours: string;
  categories: Category[]; lat: number; lng: number; tags: string[];
  calculatedDist?: number; // เก็บระยะทางจริงที่คำนวณได้
}

// สูตรคำนวณระยะทางจากพิกัด (Lat, Lng) 2 จุด เป็นกิโลเมตร
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // รัศมีโลก (กม.)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // ระยะทาง กม.
}

function Stars({ rating }: { rating: number }) {
  return <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l1.09 2.47H8.5L6.6 5.03l.72 2.47L5 6.2 2.68 7.5l.72-2.47L1.5 3.47H3.91L5 1z" fill={i <= Math.round(rating) ? "#c9b59c" : "#e5e5e5"} /></svg>)}</div>;
}

function MapEmbed({ venue }: { venue: Venue }) {
  return (
    <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-[#e5e5e5] relative shadow-sm">
      <iframe key={venue.id} src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.lng - 0.012}%2C${venue.lat - 0.009}%2C${venue.lng + 0.012}%2C${venue.lat + 0.009}&layer=mapnik&marker=${venue.lat}%2C${venue.lng}`} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title={venue.nameTh} />
      <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm pointer-events-none border border-white">
        <p className="text-[11px] font-semibold text-[#4a4a4a]">{venue.nameTh}</p>
        <p className="text-[9px] text-[#8b8b8b]">{venue.district}</p>
      </div>
    </div>
  );
}

function ConfirmSheet({ venue, hasPackage, onClose, onConfirm, t }: { venue: Venue; hasPackage: boolean; onClose: () => void; onConfirm: () => void; t: any }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: "0 auto" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full px-6 pt-6 pb-32 z-10 animate-in slide-in-from-bottom duration-300">
        <div className="w-10 h-1 rounded-full bg-[#e5e5e5] mx-auto mb-5" />
        <div className="w-14 h-14 rounded-2xl bg-[#f5f1ed] flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 25.5C14 25.5 4.5 18 4.5 11.5C4.5 6.53 8.81 2.5 14 2.5C19.19 2.5 23.5 6.53 23.5 11.5C23.5 18 14 25.5 14 25.5Z" stroke="#c9b59c" strokeWidth="2" fill="none" /><circle cx="14" cy="11.5" r="3.5" stroke="#c9b59c" strokeWidth="2" /></svg>
        </div>
        <h2 className="text-[17px] font-semibold text-[#4a4a4a] text-center mb-1">{t.mapConfirm}</h2>
        <p className="text-[14px] text-[#8b8b8b] text-center mb-1">{venue.nameTh}</p>
        <p className="text-[11px] text-[#8b8b8b] text-center mb-4">{venue.district}</p>
        {!hasPackage && <p className="text-[11px] text-[#c4b5a0] text-center bg-[#faf8f5] rounded-xl py-2.5 px-3 mb-4 font-medium border border-[#f0ebe4]">{t.mapNextPkg}</p>}
        <button onClick={onConfirm} className="w-full bg-[#c9b59c] text-white rounded-xl py-3.5 text-[14px] font-bold mb-3 shadow-md shadow-[#c9b59c]/20 active:scale-[0.98] transition-all">{t.mapConfirmBtn}</button>
        <button onClick={onClose} className="w-full bg-[#f5f1ed] text-[#4a4a4a] rounded-xl py-3.5 text-[14px] font-medium active:bg-[#e9e4de] transition-colors">{t.cancel}</button>
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
  const [selectedId, setSelectedId] = useState(-1); // เปลี่ยน default เป็น -1 เพื่อให้ออโต้เลือกอันแรกเสมอ
  const [chosenVenue, setChosenVenue] = useState<Venue | null>(null);
  const [search, setSearch] = useState("");
  const [rawVenues, setRawVenues] = useState<Venue[]>([]);

  const [loadingDB, setLoadingDB] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState("กำลังหาตำแหน่งของคุณ...");

  // 1. โหลดข้อมูลจาก DB
  useEffect(() => {
    async function loadVenues() {
      const { data } = await supabase.from('venues').select('*');
      if (data) {
        setRawVenues(data.map(d => ({
          id: d.id, nameTh: d.name_th, address: d.address, district: d.district,
          distance: d.distance, rating: Number(d.rating), reviewCount: d.review_count,
          phone: d.phone, openHours: d.open_hours, categories: d.categories,
          lat: d.lat, lng: d.lng, tags: d.tags
        })));
      }
      setLoadingDB(false);
    }
    loadVenues();
  }, []);

  // 2. ขอตำแหน่ง GPS ผู้ใช้งาน
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocStatus(""); // เจอแล้วลบข้อความออก
        },
        (err) => {
          console.warn("Location error:", err);
          setLocStatus("ไม่สามารถดึงตำแหน่งได้ (ใช้ระยะทางอ้างอิง)");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocStatus("");
    }
  }, []);

  // 3. ประมวลผลสถานที่ (คำนวณระยะทาง + ค้นหา + เรียงลำดับ)
  const filteredAndSortedVenues = useMemo(() => {
    let processed = rawVenues.filter(v => v.categories.includes(category));

    // ค้นหาข้อความ
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      processed = processed.filter(v =>
        v.nameTh.toLowerCase().includes(s) ||
        v.district.toLowerCase().includes(s) ||
        v.address.toLowerCase().includes(s)
      );
    }

    // อัปเดตระยะทางจริงและเรียงลำดับจากใกล้ไปไกล
    processed = processed.map(v => {
      if (userLoc) {
        const actualDist = getDistanceFromLatLonInKm(userLoc.lat, userLoc.lng, v.lat, v.lng);
        return {
          ...v,
          calculatedDist: actualDist,
          distance: actualDist < 1 ? "< 1 กม." : `${actualDist.toFixed(1)} กม.`
        };
      }
      return { ...v, calculatedDist: 9999 }; // ถ้าไม่มี GPS ให้เรียงตามเดิม
    }).sort((a, b) => (a.calculatedDist || 0) - (b.calculatedDist || 0));

    return processed;
  }, [rawVenues, category, search, userLoc]);

  // เลือกลิสต์แรกอัตโนมัติ (ซึ่งจะเป็นที่ที่ใกล้ที่สุด)
  const selectedVenue = filteredAndSortedVenues.find(v => v.id === selectedId) ?? filteredAndSortedVenues[0];

  function handleConfirm() {
    if (!chosenVenue) return;
    if (hasPackage) {
      router.push(`/payment-selection?packageId=${packageId}&venueId=${chosenVenue.id}`);
    } else {
      router.push(`/packages?venueId=${chosenVenue.id}`);
    }
  }

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md rounded-b-3xl px-6 pt-12 pb-5 shadow-sm border-b border-[#f0ebe4]">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0 active:scale-95 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-[#4a4a4a]">{t.mapTitle}</h1>
            <p className="text-[11px] text-[#8b8b8b]">{hasPackage ? t.mapSubHasPkg : t.mapSubNoPkg}</p>
          </div>
          <div className="flex items-center gap-1">
            {[hasPackage, true, false].map((active, i) => (
              <div key={i} className={`rounded-full transition-all ${active ? "w-4 h-1.5 bg-[#c4b5a0]" : "w-1.5 h-1.5 bg-[#e5e5e5]"}`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {CATS.map(cat => (
            <button key={cat.key} onClick={() => { setCategory(cat.key); setSelectedId(-1); /* เคลียร์เพื่อให้ออโต้เลือกที่ใกล้สุดของหมวดใหม่ */ }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${category === cat.key ? "bg-[#c9b59c] text-white shadow-md shadow-[#c9b59c]/20" : "bg-[#f5f1ed] text-[#8b8b8b]"}`}>
              <span className="text-sm">{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4b5a0]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </div>
          <input
            type="text"
            placeholder={t.mapSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f9f8f6] border border-[#f0ebe4] rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-[#4a4a4a] placeholder:text-[#b3a89d] focus:outline-none focus:ring-2 focus:ring-[#c9b59c]/20 transition-all"
          />
        </div>
      </div>

      <div className="px-5 pt-5 pb-32 flex flex-col gap-4">
        {loadingDB ? (
          <div className="text-center py-10 text-[#8b8b8b] text-[12px] animate-pulse">{t.loading || "กำลังโหลดข้อมูล..."}</div>
        ) : (
          <>
            {selectedVenue && <MapEmbed venue={selectedVenue} />}

            <div className="flex justify-between items-end px-1 mt-1">
              <div>
                <h2 className="text-[14px] font-bold text-[#4a4a4a]">
                  {CATS.find(c => c.key === category)?.label} {lang === "th" ? "ใกล้คุณ" : "near you"}
                </h2>
                {locStatus && <p className="text-[9px] text-[#c4b5a0] animate-pulse">{locStatus}</p>}
              </div>
              <span className="text-[10px] font-medium text-[#8b8b8b] bg-[#e5e5e5]/50 px-2 py-1 rounded-lg">
                {filteredAndSortedVenues.length} แห่ง
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {filteredAndSortedVenues.map((venue, index) => {
                const isSel = selectedId === venue.id || (selectedId === -1 && index === 0);
                return (
                  <div key={venue.id} onClick={() => setSelectedId(venue.id)} className={`border-2 rounded-2xl bg-white cursor-pointer transition-all duration-300 ${isSel ? "border-[#c9b59c] shadow-lg shadow-[#c9b59c]/10" : "border-transparent shadow-sm hover:border-[#f0ebe4]"}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSel ? "bg-[#c9b59c]" : "bg-[#f5f1ed]"}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isSel ? "white" : "#c4b5a0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          </div>
                          <div className="min-w-0 pr-2">
                            <h3 className="text-[14px] font-bold text-[#4a4a4a] leading-tight mb-1">{venue.nameTh}</h3>
                            <p className="text-[10px] text-[#8b8b8b] line-clamp-1">{venue.address}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right bg-[#f9f8f6] p-1.5 rounded-lg border border-[#f0ebe4]">
                          <div className="flex items-center justify-end gap-1 mb-0.5"><Stars rating={venue.rating} /><span className="text-[10px] font-bold text-[#4a4a4a] ml-0.5">{venue.rating}</span></div>
                          <p className="text-[9px] text-[#b3a89d]">({venue.reviewCount})</p>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-3 px-1">
                        <span className="text-[10px] text-[#6b5f55] font-medium flex items-center gap-1.5">
                          <span className="opacity-50">🕐</span> {venue.openHours}
                        </span>
                        <span className={`text-[10px] font-bold flex items-center gap-1.5 ${userLoc ? "text-[#c9b59c]" : "text-[#6b5f55]"}`}>
                          <span className="opacity-50">📍</span> {venue.distance}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4 px-1">
                        {venue.tags.map(t => <span key={t} className="px-2.5 py-1 rounded-md bg-[#f9f8f6] border border-[#f0ebe4] text-[9px] font-medium text-[#8b8b8b]">{t}</span>)}
                      </div>

                      <div className="flex gap-2">
                        <a href={`tel:${venue.phone}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#f5f1ed] active:bg-[#e9e4de] transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </a>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#f5f1ed] active:bg-[#e9e4de] transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                        </a>
                        <button onClick={e => { e.stopPropagation(); setChosenVenue(venue); }} className="flex-1 h-11 rounded-xl bg-[#c9b59c] text-white text-[12px] font-bold shadow-md shadow-[#c9b59c]/20 active:scale-[0.98] transition-all">เลือกสถานที่นี้</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {chosenVenue && <ConfirmSheet venue={chosenVenue} hasPackage={hasPackage} onClose={() => setChosenVenue(null)} onConfirm={handleConfirm} t={t} />}

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#f0ebe4]">
        <BottomNav />
      </div>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="min-h-dvh bg-[#f9f8f6]" />}><MapContent /></Suspense>;
}