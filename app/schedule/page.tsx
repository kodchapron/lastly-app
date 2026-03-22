"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  end_time?: string;
  category: "ceremony" | "task" | "meeting" | "reminder";
  urgent?: boolean;
  location?: string;
  date: string; // YYYY-MM-DD
}

// Removing static THAI_MONTHS and THAI_DAYS_SHORT as they are now in i18n

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function dateKey(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function EventCard({ event, t }: { event: Event, t: any }) {
  const categoryConfig = {
    ceremony: { color: "#c9b59c", bg: "#f5f1ed", label: t.schCategory.ceremony },
    task: { color: "#4a4a4a", bg: "#f5f1ed", label: t.schCategory.task },
    meeting: { color: "#3b82f6", bg: "#eff6ff", label: t.schCategory.meeting },
    reminder: { color: "#8b8b8b", bg: "#f5f5f5", label: t.schCategory.reminder },
  };
  const cfg = categoryConfig[event.category] || categoryConfig.task;
  return (
    <div className="bg-white border border-[#f5f1ed] rounded-2xl p-4 flex gap-3">
      <div className="flex flex-col items-center gap-1 shrink-0 w-12">
        <span className="text-[11px] font-semibold text-[#4a4a4a]">{event.time}</span>
        {event.end_time && <><div className="w-px flex-1 bg-[#e5e5e5] my-0.5" /><span className="text-[10px] text-[#8b8b8b]">{event.end_time}</span></>}
      </div>
      <div className="w-1 rounded-full shrink-0 self-stretch min-h-[40px]" style={{ backgroundColor: cfg.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[13.6px] font-semibold text-[#4a4a4a] leading-snug">{event.title}</h3>
            {event.subtitle && <p className="text-[10px] text-[#8b8b8b] mt-0.5">{event.subtitle}</p>}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[8.5px] font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
            {event.urgent && <span className="px-2 py-0.5 rounded-full bg-[#fef2f2] text-[8.5px] font-medium text-[#dc2626]">{t.schUrgent}</span>}
          </div>
        </div>
        {event.location && (
          <div className="flex items-center gap-1 mt-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C4.07 1.5 2.5 3.07 2.5 5c0 2.8 3.5 5.5 3.5 5.5S9.5 7.8 9.5 5c0-1.93-1.57-3.5-3.5-3.5z" stroke="#c4b5a0" strokeWidth="1.2" fill="none" /><circle cx="6" cy="5" r="1.2" fill="#c4b5a0" /></svg>
            <span className="text-[10px] text-[#8b8b8b]">{event.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  const categoryConfig = {
    ceremony: { color: "#c9b59c", bg: "#f5f1ed", label: t.schCategory.ceremony },
    task: { color: "#4a4a4a", bg: "#f5f1ed", label: t.schCategory.task },
    meeting: { color: "#3b82f6", bg: "#eff6ff", label: t.schCategory.meeting },
    reminder: { color: "#8b8b8b", bg: "#f5f5f5", label: t.schCategory.reminder },
  };

  const TODAY = new Date();
  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());

  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [newCat, setNewCat] = useState<Event["category"]>("task");
  const [isUrgent, setIsUrgent] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("lastly_profileId");
    if (id) {
      setProfileId(id);
      fetchEvents(id);
    }
  }, []);

  async function fetchEvents(uid: string) {
    const { data } = await supabase.from('events').select('*').eq('profile_id', uid).order('time', { ascending: true });
    if (data) setDbEvents(data as Event[]);
  }

  async function handleAddEvent() {
    if (!profileId || !newTitle.trim()) return;
    setSaving(true);
    const dateStr = dateKey(viewYear, viewMonth, selectedDay);
    const { data } = await supabase.from('events').insert([{
      profile_id: profileId,
      date: dateStr,
      title: newTitle.trim(),
      time: newTime,
      category: newCat,
      urgent: isUrgent
    }]).select().single();
    
    if (data) {
      setDbEvents(prev => [...prev, data as Event].sort((a, b) => a.time.localeCompare(b.time)));
      setShowAddModal(false);
      setNewTitle("");
    }
    setSaving(false);
  }

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfMonth(viewYear, viewMonth);
  const selectedKey = dateKey(viewYear, viewMonth, selectedDay);
  
  // จัดกลุ่ม events ตามวัน
  const eventData: Record<string, Event[]> = {};
  dbEvents.forEach(e => {
    if (!eventData[e.date]) eventData[e.date] = [];
    eventData[e.date].push(e);
  });
  
  const selectedEvents = eventData[selectedKey] ?? [];

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else { setViewMonth(m => m - 1); } setSelectedDay(1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else { setViewMonth(m => m + 1); } setSelectedDay(1); };
  const hasDot = (d: number) => (eventData[dateKey(viewYear, viewMonth, d)] ?? []).length > 0;
  const isToday = (d: number) => d === TODAY.getDate() && viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();

  return (
    <div className="flex flex-col bg-[#f9f8f6] min-h-dvh pb-32 relative">
      <div className="bg-white rounded-b-3xl px-6 pt-12 pb-5">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">{t.schTitle}</h1>
          </div>
          <button onClick={() => setShowAddModal(true)} className="w-9 h-9 rounded-full bg-[#c9b59c] flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-[#4a4a4a]">{t.schMonths[viewMonth]}</p>
            <p className="text-[11px] text-[#8b8b8b]">{lang === 'th' ? viewYear + 543 : viewYear}</p>
          </div>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l4 5-4 5" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {t.schDaysShort.map((d: string) => <div key={d} className="text-center text-[10px] text-[#8b8b8b] font-medium py-1">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1; const active = day === selectedDay; const today = isToday(day); const dot = hasDot(day);
            return (
              <button key={day} onClick={() => setSelectedDay(day)} className="flex flex-col items-center gap-0.5 py-1">
                <div className={["w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all",
                  active ? "bg-[#c9b59c] text-white" : today ? "border border-[#c9b59c] text-[#c9b59c]" : "text-[#4a4a4a]"].join(" ")}>{day}</div>
                <div className={["w-1 h-1 rounded-full", dot ? active ? "bg-white" : "bg-[#c4b5a0]" : "bg-transparent"].join(" ")} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13.6px] font-semibold text-[#4a4a4a]">{selectedDay} {t.schMonths[viewMonth]}</h2>
          <span className="text-[10px] text-[#8b8b8b]">{t.schEventCount(selectedEvents.length)}</span>
        </div>

        {selectedEvents.length > 0 ? (
          <div className="flex flex-col gap-3">{selectedEvents.map((ev) => <EventCard key={ev.id} event={ev} t={t} />)}</div>
        ) : (
          <button onClick={() => setShowAddModal(true)} className="bg-white border text-left border-[#f5f1ed] rounded-2xl py-10 flex flex-col items-center gap-3 transition-colors hover:bg-[#faf8f5]">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f1ed] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#c4b5a0" strokeWidth="1.8" /><path d="M8 2v4M16 2v4M3 10h18" stroke="#c4b5a0" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#4a4a4a]">{t.schEmpty}</p>
              <p className="text-[11px] text-[#c4b5a0] mt-1 font-semibold">{t.schAdd} +</p>
            </div>
          </button>
        )}

        <div className="bg-white border border-[#f5f1ed] rounded-2xl px-4 py-3 mt-1">
          <p className="text-[10px] font-medium text-[#8b8b8b] mb-2.5">{t.dbServices || "ประเภทกิจกรรม"}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] text-[#8b8b8b]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
           <div className="bg-white rounded-3xl w-full max-w-sm p-5 relative z-10 shadow-xl">
              <h3 className="text-[15px] font-bold text-[#4a4a4a] mb-4">{t.schNewEvent}</h3>
              <div className="flex flex-col gap-3 mb-5">
                 <input type="text" placeholder={t.schFormTitlePl} value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-[#f9f8f6] rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0]" />
                 <div className="flex gap-3">
                   <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="bg-[#f9f8f6] flex-1 rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0]" />
                   <select value={newCat} onChange={e => setNewCat(e.target.value as any)} className="bg-[#f9f8f6] flex-1 rounded-xl px-3 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0]">
                     <option value="task">{t.schCategory.task}</option>
                     <option value="ceremony">{t.schCategory.ceremony}</option>
                     <option value="meeting">{t.schCategory.meeting}</option>
                     <option value="reminder">{t.schCategory.reminder}</option>
                   </select>
                 </div>
                 <label className="flex items-center gap-2 mt-1">
                   <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} className="accent-[#c4b5a0] w-4 h-4" />
                   <span className="text-[12px] text-[#4a4a4a]">{t.schIsUrgent}</span>
                 </label>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-[#f5f1ed] text-[#4a4a4a] py-3 rounded-xl text-[13px] font-medium">{t.cancel}</button>
                <button onClick={handleAddEvent} disabled={saving || !newTitle.trim()} className="flex-1 bg-[#c9b59c] disabled:opacity-50 text-white py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2">
                  {saving ? t.saving : t.schAdd}
                </button>
              </div>
           </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}