"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

/* ─────────────────────────── Types ─────────────────────────── */

type Status = "confirmed" | "pending" | "declined";

interface Guest {
  id: number;
  name: string;
  group: string;
  phone: string;
  status: Status;
  note?: string;
}

/* ─────────────────────────── Mock data ─────────────────────── */

const GUESTS: Guest[] = [
  { id: 1,  name: "ครอบครัว สมบูรณ์",     group: "ญาติสนิท",    phone: "081-234-5678", status: "confirmed" },
  { id: 2,  name: "คุณวิชัย แก้วมณี",     group: "เพื่อนครอบครัว", phone: "089-111-2222", status: "confirmed", note: "เดินทางมาจากเชียงใหม่" },
  { id: 3,  name: "ครอบครัว ศรีสุข",       group: "เพื่อนบ้าน",   phone: "062-333-4444", status: "confirmed" },
  { id: 4,  name: "คุณนิภา ชัยวงศ์",       group: "เพื่อนร่วมงาน", phone: "091-555-6666", status: "confirmed" },
  { id: 5,  name: "ครอบครัว วงศ์สุวรรณ",  group: "ญาติสนิท",    phone: "083-777-8888", status: "confirmed" },
  { id: 6,  name: "คุณประเสริฐ ดีมาก",    group: "เพื่อนเก่า",   phone: "087-999-0000", status: "pending" },
  { id: 7,  name: "ดร. สมศักดิ์ เจริญ",    group: "เพื่อนร่วมงาน", phone: "090-123-4567", status: "pending", note: "ขอยืนยันอีกครั้ง" },
  { id: 8,  name: "คุณสุนีย์ รักดี",       group: "เพื่อนบ้าน",   phone: "064-234-5678", status: "pending" },
  { id: 9,  name: "ครอบครัว มั่นคง",       group: "ญาติห่างๆ",   phone: "096-345-6789", status: "pending" },
  { id: 10, name: "คุณอรุณ สว่างใจ",       group: "เพื่อนเก่า",   phone: "088-456-7890", status: "declined", note: "ติดภารกิจต่างประเทศ" },
  { id: 11, name: "ครอบครัว จันทร์เพ็ญ",  group: "ญาติห่างๆ",   phone: "076-567-8901", status: "declined" },
];

const STATUS_CONFIG: Record<Status, { label: string; textColor: string; bgColor: string }> = {
  confirmed: { label: "ยืนยัน",    textColor: "#16a34a", bgColor: "#f0fdf4" },
  pending:   { label: "รอตอบรับ",  textColor: "#ca8a04", bgColor: "#fefce8" },
  declined:  { label: "ยกเลิก",    textColor: "#dc2626", bgColor: "#fef2f2" },
};

type FilterTab = "all" | Status;
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "ทั้งหมด" },
  { key: "confirmed", label: "ยืนยัน" },
  { key: "pending",   label: "รอตอบรับ" },
  { key: "declined",  label: "ยกเลิก" },
];

/* ─────────────────────────── Icons ─────────────────────────── */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="#8b8b8b" strokeWidth="1.4"/>
      <path d="M10.5 10.5L14 14" stroke="#8b8b8b" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="#c4b5a0" strokeWidth="1.5"/>
      <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#c4b5a0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PhoneIconSm() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2a.5.5 0 01.5-.5h1.7a.5.5 0 01.47.33l.7 2a.5.5 0 01-.14.53L4 5.3a6 6 0 002.7 2.7l.97-1.24a.5.5 0 01.53-.14l2 .7A.5.5 0 0110.5 8v1.7A.5.5 0 0110 10C5.03 10 1 5.97 1 1v-.5" stroke="#8b8b8b" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="4.5" cy="4" r="2" stroke="#8b8b8b" strokeWidth="1.1"/>
      <path d="M1 10c0-2 1.57-3.5 3.5-3.5S8 8 8 10" stroke="#8b8b8b" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M8.5 3a2 2 0 010 4M10 10c0-2-.9-3.5-2-4" stroke="#8b8b8b" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="#4a4a4a" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ─────────────────────────── Add Guest Sheet ──────────────── */

interface AddGuestSheetProps {
  onClose: () => void;
  onAdd: (g: Omit<Guest, "id">) => void;
}

function AddGuestSheet({ onClose, onAdd }: AddGuestSheetProps) {
  const [name, setName]     = useState("");
  const [group, setGroup]   = useState("");
  const [phone, setPhone]   = useState("");
  const [note, setNote]     = useState("");
  const [error, setError]   = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("กรุณากรอกชื่อผู้เข้าร่วม"); return; }
    onAdd({ name: name.trim(), group: group.trim() || "ทั่วไป", phone: phone.trim(), status: "pending", note: note.trim() || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ maxWidth: 430, margin: "0 auto", left: "50%", transform: "translateX(-50%)" }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full px-6 pt-2 pb-10 z-10">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-[#e5e5e5] mx-auto mb-5 mt-3" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-semibold text-[#4a4a4a]">เพิ่มแขก</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-[12px] text-[#4a4a4a] mb-1.5 block">ชื่อ–นามสกุล *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="เช่น คุณสมชาย วงศ์ไทย"
              className="w-full h-[54px] px-4 rounded-xl border border-[#e5e5e5] bg-white text-[14px] text-[#4a4a4a] placeholder:text-[#cccccc] focus:outline-none focus:border-[#c9b59c] transition-colors"
            />
          </div>

          {/* Group */}
          <div>
            <label className="text-[12px] text-[#4a4a4a] mb-1.5 block">กลุ่ม / ความสัมพันธ์</label>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="เช่น ญาติสนิท, เพื่อนร่วมงาน"
              className="w-full h-[54px] px-4 rounded-xl border border-[#e5e5e5] bg-white text-[14px] text-[#4a4a4a] placeholder:text-[#cccccc] focus:outline-none focus:border-[#c9b59c] transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[12px] text-[#4a4a4a] mb-1.5 block">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0XX-XXX-XXXX"
              className="w-full h-[54px] px-4 rounded-xl border border-[#e5e5e5] bg-white text-[14px] text-[#4a4a4a] placeholder:text-[#cccccc] focus:outline-none focus:border-[#c9b59c] transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-[12px] text-[#4a4a4a] mb-1.5 block">หมายเหตุ</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น เดินทางมาจากต่างจังหวัด"
              className="w-full h-[54px] px-4 rounded-xl border border-[#e5e5e5] bg-white text-[14px] text-[#4a4a4a] placeholder:text-[#cccccc] focus:outline-none focus:border-[#c9b59c] transition-colors"
            />
          </div>

          {error && <p className="text-[12px] text-[#dc2626]">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full h-[48px] bg-[#c9b59c] hover:bg-[#b8a48b] text-white rounded-xl text-[14px] font-semibold transition-colors mt-2"
          >
            เพิ่มแขก
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Guest Row ─────────────────────── */

function GuestRow({ guest }: { guest: Guest }) {
  const cfg = STATUS_CONFIG[guest.status];
  return (
    <div className="bg-white border border-[#f5f1ed] rounded-2xl px-4 py-3.5 flex items-center gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#f5f1ed] flex items-center justify-center shrink-0">
        <span className="text-[14px] font-semibold text-[#c4b5a0]">
          {guest.name.charAt(0)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.6px] font-semibold text-[#4a4a4a] truncate">{guest.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <div className="flex items-center gap-1">
            <GroupIcon />
            <span className="text-[10px] text-[#8b8b8b]">{guest.group}</span>
          </div>
          {guest.phone && (
            <div className="flex items-center gap-1">
              <PhoneIconSm />
              <span className="text-[10px] text-[#8b8b8b]">{guest.phone}</span>
            </div>
          )}
        </div>
        {guest.note && (
          <p className="text-[10px] text-[#8b8b8b] mt-0.5 italic truncate">{guest.note}</p>
        )}
      </div>

      {/* Status badge */}
      <span
        className="px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0"
        style={{ color: cfg.textColor, backgroundColor: cfg.bgColor }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

/* ─────────────────────────── Empty State ───────────────────── */

function EmptyState({ tab }: { tab: FilterTab }) {
  const messages: Record<FilterTab, { title: string; sub: string }> = {
    all:       { title: "ยังไม่มีแขก", sub: "กดปุ่ม + เพื่อเพิ่มรายชื่อแขก" },
    confirmed: { title: "ยังไม่มีแขกยืนยัน", sub: "แขกที่ยืนยันการเข้าร่วมจะแสดงที่นี่" },
    pending:   { title: "ไม่มีรายการรอตอบรับ", sub: "รายการที่รอการยืนยันจะแสดงที่นี่" },
    declined:  { title: "ไม่มีรายการยกเลิก", sub: "รายการที่ยกเลิกจะแสดงที่นี่" },
  };
  const msg = messages[tab];
  return (
    <div className="bg-white border border-[#f5f1ed] rounded-2xl py-12 flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-[#f5f1ed] flex items-center justify-center">
        <PersonIcon />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-medium text-[#4a4a4a]">{msg.title}</p>
        <p className="text-[11px] text-[#8b8b8b] mt-1">{msg.sub}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────── */

export default function GuestsPage() {
  const [guests, setGuests]       = useState<Guest[]>(GUESTS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<FilterTab>("all");
  const [showSheet, setShowSheet] = useState(false);

  const counts = {
    all:       guests.length,
    confirmed: guests.filter((g) => g.status === "confirmed").length,
    pending:   guests.filter((g) => g.status === "pending").length,
    declined:  guests.filter((g) => g.status === "declined").length,
  };

  const filtered = guests.filter((g) => {
    const matchTab = filter === "all" || g.status === filter;
    const q = search.toLowerCase().trim();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || g.group.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleAdd = (data: Omit<Guest, "id">) => {
    setGuests((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    setFilter("all");
    setSearch("");
  };

  return (
    <div className="flex flex-col bg-[#f9f9f9] min-h-dvh page-content">

      {/* ── Header ── */}
      <div className="bg-white rounded-b-3xl px-6 pt-12 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[17px] font-semibold text-[#4a4a4a]">รายชื่อแขก</h1>
            <p className="text-[11px] text-[#8b8b8b] mt-0.5">
              {counts.confirmed} ยืนยัน · {counts.pending} รอตอบรับ · {counts.declined} ยกเลิก
            </p>
          </div>
          <button
            onClick={() => setShowSheet(true)}
            className="w-9 h-9 rounded-full bg-[#c9b59c] flex items-center justify-center hover:bg-[#b8a48b] transition-colors"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-[#f5f1ed] rounded-xl px-4 h-11">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรือกลุ่ม..."
            className="flex-1 bg-transparent text-[13px] text-[#4a4a4a] placeholder:text-[#8b8b8b] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="px-6 pt-4">
        <div className="bg-white border border-[#f5f1ed] rounded-2xl p-1 flex gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={[
                "flex-1 py-2 rounded-xl text-[11px] font-medium transition-all",
                filter === tab.key
                  ? "bg-[#c9b59c] text-white shadow-sm"
                  : "text-[#8b8b8b] hover:text-[#4a4a4a]",
              ].join(" ")}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={`ml-1 text-[9px] ${filter === tab.key ? "text-white/70" : "text-[#c4b5a0]"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Guest List ── */}
      <div className="px-6 pt-4 flex flex-col gap-2.5">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[13.6px] font-semibold text-[#4a4a4a]">
            {filter === "all" ? "แขกทั้งหมด" : FILTER_TABS.find((t) => t.key === filter)?.label}
          </h2>
          <span className="text-[10px] text-[#8b8b8b]">{filtered.length} คน</span>
        </div>

        {filtered.length > 0 ? (
          filtered.map((g) => <GuestRow key={g.id} guest={g} />)
        ) : (
          <EmptyState tab={filter} />
        )}
      </div>

      {/* ── Stats card ── */}
      <div className="mx-6 mt-5 mb-2">
        <div className="bg-white border border-[#f5f1ed] rounded-2xl px-5 py-4">
          <p className="text-[11px] font-semibold text-[#8b8b8b] mb-3 uppercase tracking-wide">สรุปยอดแขก</p>
          <div className="flex items-center justify-between">
            {[
              { value: counts.all,       label: "ได้รับเชิญ",  color: "#4a4a4a" },
              { value: counts.confirmed, label: "ยืนยันแล้ว",  color: "#16a34a" },
              { value: counts.pending,   label: "รอตอบรับ",    color: "#ca8a04" },
              { value: counts.declined,  label: "ยกเลิก",      color: "#dc2626" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[20px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-[9px] text-[#8b8b8b] text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Guest Sheet ── */}
      {showSheet && (
        <AddGuestSheet onClose={() => setShowSheet(false)} onAdd={handleAdd} />
      )}

      <BottomNav />
    </div>
  );
}
