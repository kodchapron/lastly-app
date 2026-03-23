"use client";

import { useState, useEffect, useRef, createContext } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";

// ── Dark Mode Context (ใช้ร่วมกับ layout ได้ถ้าต้องการ) ──────────────
const DarkCtx = createContext({ dark: false, toggle: () => { } });

type Review = { id?: number; name: string; date: string; rating: number; text: string; };

function Stars({ rating, size = 14, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" disabled={!interactive}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHov(i)}
          onMouseLeave={() => interactive && setHov(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill={i <= (hov || rating) ? "#c9b59c" : "none"} stroke="#c9b59c" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

type Tab = "profile" | "reviews" | "settings";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notif, setNotif] = useState(true);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load profile from DB
  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        router.push("/auth");
        return;
      }

      setProfileId(user.id);

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfileName(data.full_name || user.user_metadata?.full_name || "");
        setProfileEmail(data.email || user.email || "");
        setProfilePhone(data.phone || "");
        if (data.avatar_url) setProfilePhoto(data.avatar_url);
      } else {
        await supabase.from('profiles').insert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || ""
        }]);
        setProfileName(user.user_metadata?.full_name || "");
        setProfileEmail(user.email || "");
      }
    }
    loadProfile();
  }, [router]);

  // Load dark mode preference and profile photo
  useEffect(() => {
    const saved = localStorage.getItem("lastly_dark");
    if (saved === "true") setDark(true);
    const photo = localStorage.getItem("lastly_profilePhoto");
    if (photo && !profilePhoto) setProfilePhoto(photo);
  }, [profilePhoto]);

  // Apply dark mode to root
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lastly_dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lastly_dark", "false");
    }
  }, [dark]);

  // Load reviews from Supabase
  useEffect(() => {
    supabase.from("reviews").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbReviews = data.map(r => ({
            id: r.id, name: r.name, rating: r.rating, text: r.text,
            date: new Date(r.created_at).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "short", year: "numeric" }),
          }));
          setReviews(dbReviews);
        } else {
          setReviews([]);
        }
      });
  }, [lang]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  // Handle photo upload
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const res = ev.target?.result as string;
      setProfilePhoto(res);
      localStorage.setItem("lastly_profilePhoto", res);
      if (profileId) {
        await supabase.from('profiles').update({ avatar_url: res }).eq('id', profileId);
      }
    };
    reader.readAsDataURL(file);
  }

  // Save profile to DB
  async function handleSaveProfile() {
    setSaving(true);
    if (profileId) {
      await supabase.from('profiles').update({
        full_name: profileName,
        email: profileEmail,
        phone: profilePhone,
        avatar_url: profilePhoto
      }).eq('id', profileId);
    }
    setSaving(false);
    setEditing(false);
  }

  // Submit review
  async function handleSubmitReview() {
    if (!userRating || !reviewText.trim()) return;
    setSubmitting(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    const newReview: Review = { name: profileName, date: dateStr, rating: userRating, text: reviewText.trim() };

    const { data } = await supabase.from("reviews").insert([{
      name: profileName, rating: userRating, text: reviewText.trim(),
    }]).select().single();

    setReviews(prev => [{ ...newReview, id: data?.id }, ...prev]);
    setUserRating(0);
    setReviewText("");
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  // ── Dynamic classes for dark mode ──
  const bg = dark ? "bg-[#1a1a1a]" : "bg-[#f9f8f6]";
  const card = dark ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-white border-[#f0ebe4]";
  const heading = dark ? "text-white" : "text-[#4a4a4a]";
  const sub = dark ? "text-[#888]" : "text-[#8b8b8b]";
  const inputBg = dark ? "bg-[#333] text-white placeholder:text-[#666]" : "bg-[#f9f8f6] text-[#4a4a4a] placeholder:text-[#bbb]";

  return (
    <div className={`flex flex-col min-h-dvh transition-colors duration-300 ${bg}`}>

      {/* Header */}
      <div className={`${dark ? "bg-[#222]" : "bg-white"} rounded-b-3xl px-6 pt-12 pb-5 transition-colors`}>
        <div className="flex items-start justify-between mb-5">
          <h1 className={`text-[17px] font-semibold ${heading}`}>{t.profile}</h1>
          <button onClick={() => router.push("/auth")} className="text-[10px] text-[#c4b5a0] border border-[#e5e5e5] px-3 py-1.5 rounded-full hover:bg-[#f5f1ed] transition-colors">{t.logout}</button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#c9b59c] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0 overflow-hidden">
              {profilePhoto ? <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" /> : profileName.charAt(0)}
            </div>
            <button onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#4a4a4a] flex items-center justify-center border-2 border-white">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 7.5V6l3.5-3.5 1.5 1.5L2.5 7.5H1zM6.5 2L8 3.5 6.5 5 5 3.5 6.5 2z" fill="white" /></svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <h2 className={`text-[15px] font-semibold ${heading}`}>{profileName}</h2>
            <p className={`text-[11px] ${sub}`}>{profileEmail}</p>
            {profilePhone && <p className={`text-[11px] ${sub}`}>{profilePhone}</p>}
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className={`text-[9px] ${sub}`}>{t.activeSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <div className={`${dark ? "bg-[#2a2a2a]" : "bg-white"} rounded-2xl p-1 flex gap-1 shadow-sm border ${dark ? "border-[#3a3a3a]" : "border-[#f0ebe4]"}`}>
          {(["profile", "reviews", "settings"] as Tab[]).map((tb, i) => (
            <button key={tb} onClick={() => setTab(tb)}
              className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${tab === tb ? "bg-[#c4b5a0] text-white" : sub}`}>
              {t.tabs[i]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 flex flex-col gap-4">

        {/* ── Profile tab ── */}
        {tab === "profile" && (
          <>
            {/* Edit Profile */}
            {!editing ? (
              <div className={`border rounded-2xl p-4 ${card}`}>
                <div className="flex justify-between items-center mb-3">
                  <p className={`text-[12px] font-semibold ${heading}`}>{t.personalInfo}</p>
                  <button onClick={() => setEditing(true)} className="text-[10px] text-[#c4b5a0] border border-[#c4b5a0] px-3 py-1 rounded-full hover:bg-[#c4b5a0] hover:text-white transition-colors">{t.edit}</button>
                </div>
                {[{ label: t.name, value: profileName }, { label: t.email, value: profileEmail }, { label: t.phone, value: profilePhone }].map(item => (
                  <div key={item.label} className={`flex justify-between py-2.5 border-b ${dark ? "border-[#3a3a3a]" : "border-[#f9f8f6]"} last:border-0`}>
                    <span className={`text-[11px] ${sub}`}>{item.label}</span>
                    <span className={`text-[11px] font-medium ${heading}`}>
                      {item.value || <span className="text-[#c4b5a0] text-[10px]">ยังไม่ได้ระบุ - แตะเพื่อเพิ่ม</span>}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`border rounded-2xl p-4 ${card}`}>
                <p className={`text-[12px] font-semibold ${heading} mb-3`}>{t.editProfileTitle}</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: t.nameField, value: profileName, set: setProfileName, type: "text" },
                    { label: t.email, value: profileEmail, set: setProfileEmail, type: "email" },
                    { label: t.phone, value: profilePhone, set: setProfilePhone, type: "tel" },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <label className={`text-[10px] ${sub}`}>{f.label}</label>
                      <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                        className={`rounded-xl px-4 py-3 text-[13px] outline-none border border-transparent focus:border-[#c4b5a0] transition-colors ${inputBg}`} />
                    </div>
                  ))}
                  {/* Photo upload button */}
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-[11px] text-[#c4b5a0] border border-dashed border-[#c4b5a0] rounded-xl py-2.5 px-4 hover:bg-[#f9f8f6] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {t.changePhoto}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="flex-1 bg-[#f5f1ed] text-[#4a4a4a] py-3 rounded-xl text-[12px] font-medium hover:bg-[#e9e4de] transition-colors">{t.cancel}</button>
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex-1 bg-[#c4b5a0] text-white py-3 rounded-xl text-[12px] font-semibold disabled:opacity-60 flex items-center justify-center gap-1 hover:bg-[#b3a48e] transition-colors">
                      {saving ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{t.saving}</> : t.save}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Reviews tab ── */}
        {tab === "reviews" && (
          <>
            <div className={`border rounded-2xl p-5 flex flex-col items-center gap-2 ${card}`}>
              <p className={`text-[40px] font-bold leading-none ${heading}`}>{avgRating}</p>
              <Stars rating={Math.round(parseFloat(avgRating))} size={20} />
              <p className={`text-[10px] ${sub}`}>{t.fromReviews} {reviews.length}</p>
            </div>

            <div className={`border rounded-2xl p-5 flex flex-col gap-3 ${card}`}>
              <p className={`text-[12px] font-semibold ${heading}`}>{t.writeReview}</p>
              <div>
                <p className={`text-[10px] ${sub} mb-2`}>{t.rate}</p>
                <Stars rating={userRating} size={28} interactive onRate={setUserRating} />
              </div>
              <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                placeholder={t.shareExp} rows={3}
                className={`rounded-xl px-4 py-3 text-[12px] outline-none border border-transparent focus:border-[#c4b5a0] resize-none transition-colors ${inputBg}`} />
              {submitted && <div className="bg-[#f0fdf4] text-[#22c55e] text-[11px] font-medium px-3 py-2 rounded-xl text-center">{t.reviewSuccess}</div>}
              <button onClick={handleSubmitReview} disabled={!userRating || !reviewText.trim() || submitting}
                className="w-full bg-[#c4b5a0] disabled:bg-[#d4cec8] text-white py-3 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors">
                {submitting ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{t.sending}</> : t.sendReview}
              </button>
            </div>

            <div className={`border rounded-2xl divide-y ${dark ? "divide-[#3a3a3a]" : "divide-[#f9f8f6]"} ${card}`}>
              <p className={`text-[11px] font-semibold ${heading} px-4 pt-4 pb-2`}>{t.userReviews}</p>
              {reviews.map((r, i) => (
                <div key={`${r.id || 'new'}-${i}`} className="px-4 py-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`text-[12px] font-semibold ${heading}`}>{r.name}</p>
                    <p className={`text-[10px] ${sub}`}>{r.date}</p>
                  </div>
                  <Stars rating={r.rating} size={11} />
                  <p className={`text-[11px] ${sub} mt-1.5`}>{r.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Settings tab ── */}
        {tab === "settings" && (
          <>
            {/* Dark mode */}
            <div className={`border rounded-2xl px-4 py-2 ${card}`}>
              <p className={`text-[10px] font-semibold ${sub} pt-3 pb-2 uppercase tracking-wide`}>{t.display}</p>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f5f1ed] flex items-center justify-center text-base">{dark ? "🌙" : "☀️"}</div>
                  <div>
                    <p className={`text-[12px] font-medium ${heading}`}>{t.darkMode}</p>
                    <p className={`text-[10px] ${sub}`}>{dark ? t.on : t.off}</p>
                  </div>
                </div>
                <button onClick={() => setDark(!dark)}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${dark ? "bg-[#c4b5a0]" : "bg-[#e5e5e5]"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${dark ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className={`border rounded-2xl px-4 py-2 ${card}`}>
              <p className={`text-[10px] font-semibold ${sub} pt-3 pb-2 uppercase tracking-wide`}>{t.notificationsTitle}</p>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f5f1ed] flex items-center justify-center text-base">🔔</div>
                  <div>
                    <p className={`text-[12px] font-medium ${heading}`}>{t.notifications}</p>
                    <p className={`text-[10px] ${sub}`}>{t.receiveNotifs}</p>
                  </div>
                </div>
                <button onClick={() => {
                  const newState = !notif;
                  setNotif(newState);
                  if (newState && "Notification" in window) {
                    Notification.requestPermission().then(permission => {
                      if (permission === 'granted') {
                        new Notification("LASTLY", { body: t.lang === 'th' ? "เปิดการแจ้งเตือนสำเร็จ" : "Notifications Enabled" });
                      }
                    });
                  }
                }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notif ? "bg-[#c4b5a0]" : "bg-[#e5e5e5]"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notif ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            {/* Other menu */}
            <div className={`border rounded-2xl px-4 py-2 divide-y ${dark ? "divide-[#3a3a3a]" : "divide-[#f9f8f6]"} ${card}`}>
              <p className={`text-[10px] font-semibold ${sub} pt-3 pb-2 uppercase tracking-wide`}>{t.others}</p>
              <button className="flex items-center gap-3 py-3 w-full transition-opacity hover:opacity-80" onClick={() => setLang(lang === 'th' ? 'en' : 'th')}>
                <div className="w-9 h-9 rounded-xl bg-[#f5f1ed] flex items-center justify-center text-base flex-shrink-0">🌐</div>
                <p className={`flex-1 text-left text-[12px] font-medium ${heading}`}>{t.lang}</p>
                <p className={`text-[11px] text-[#c4b5a0] bg-[#f5f1ed] px-2 py-0.5 rounded-full`}>{t.langVal} 🔄</p>
              </button>

              {[{ icon: "🔒", label: t.privacy, value: "" }, { icon: "❓", label: t.help, value: "" }].map(item => (
                <button key={item.label} className="flex items-center gap-3 py-3 w-full transition-opacity hover:opacity-80">
                  <div className="w-9 h-9 rounded-xl bg-[#f5f1ed] flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
                  <p className={`flex-1 text-left text-[12px] font-medium ${heading}`}>{item.label}</p>
                  {item.value && <p className={`text-[11px] ${sub}`}>{item.value}</p>}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#d4cec8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ))}
            </div>

            <p className={`text-center text-[10px] ${sub} pb-2`}>{t.version}</p>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#f0ebe4]">
        <BottomNav />
      </div>
    </div>
  );
}