"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";

type Item = {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
};

const ITEMS: Item[] = [
    { id: "coffin_basic", name: "โลงศพไม้ธรรมดา", price: 3000, category: "coffin", description: "โลงไม้มาตรฐาน" },
    { id: "coffin_teak", name: "โลงศพไม้สักทอง", price: 8000, category: "coffin", description: "ไม้สักแท้ คุณภาพดี" },
    { id: "coffin_premium", name: "โลงศพไม้สักทองพิเศษ", price: 15000, category: "coffin", description: "ประดับดอกไม้พรีเมียม" },
    { id: "flower_20", name: "ดอกไม้ประดับ 20 วง", price: 2000, category: "flowers", description: "ดอกไม้สดทุกวัน" },
    { id: "flower_40", name: "ดอกไม้ประดับ 40 วง", price: 4000, category: "flowers", description: "ดอกไม้สดทุกวัน" },
    { id: "flower_60", name: "ดอกไม้ประดับ 60 วง", price: 7000, category: "flowers", description: "ดอกไม้นำเข้าพิเศษ" },
    { id: "monk_3", name: "พระสวดมนต์ 3 วัน", price: 4500, category: "monks", description: "พระ 9 รูปต่อวัน" },
    { id: "monk_5", name: "พระสวดมนต์ 5 วัน", price: 7500, category: "monks", description: "พระ 9 รูปต่อวัน" },
    { id: "monk_7", name: "พระสวดมนต์ 7 วัน", price: 10500, category: "monks", description: "พระ 9 รูปต่อวัน" },
    { id: "car_2", name: "รถนำศพ 2 คัน", price: 3000, category: "transport", description: "รถนำศพมาตรฐาน" },
    { id: "car_4", name: "รถนำศพ 4 คัน", price: 6000, category: "transport", description: "รถนำศพ VIP" },
    { id: "car_6", name: "รถนำศพ 6 คัน", price: 9000, category: "transport", description: "รถนำศพ VIP พร้อมมอเตอร์ไซค์" },
    { id: "food_100", name: "อาหารสำหรับ 100 ท่าน", price: 5000, category: "food", description: "บุฟเฟ่ต์มาตรฐาน" },
    { id: "food_200", name: "อาหารสำหรับ 200 ท่าน", price: 9000, category: "food", description: "บุฟเฟ่ต์พรีเมียม" },
    { id: "food_300", name: "อาหารสำหรับ 300 ท่าน", price: 13000, category: "food", description: "บุฟเฟ่ต์ครบวงจร" },
    { id: "photo", name: "ถ่ายภาพและวิดีโองาน", price: 3500, category: "extra", description: "ช่างภาพมืออาชีพ" },
    { id: "live", name: "ถ่ายทอดสดงาน", price: 2500, category: "extra", description: "Live Facebook/YouTube" },
    { id: "book", name: "หนังสือที่ระลึก", price: 4000, category: "extra", description: "จัดพิมพ์ภาพและประวัติ" },
    { id: "mc", name: "พิธีกรดำเนินงาน", price: 3000, category: "extra", description: "พิธีกรมืออาชีพ" },
];

function CoffinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M4 12h16M12 6v12" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function FlowerIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function MonkIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7v10M9 10h6" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function CarIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M5 10l2-4h10l2 4M4 17v2h16v-2M6 14h2m10 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function FoodIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M8 8V6a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function StarIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6.5L21 10l-5.5 4.5 2 7-6.5-4-6.5 4 2-7L1 10l6.5-.5L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

const CATEGORIES = [
    { key: "coffin", label: "โลงศพ", icon: <CoffinIcon />, note: "เลือกได้ 1 อย่าง" },
    { key: "flowers", label: "ดอกไม้", icon: <FlowerIcon />, note: "เลือกได้ 1 อย่าง" },
    { key: "monks", label: "พระสงฆ์", icon: <MonkIcon />, note: "เลือกได้ 1 อย่าง" },
    { key: "transport", label: "รถนำศพ", icon: <CarIcon />, note: "เลือกได้ 1 อย่าง" },
    { key: "food", label: "อาหาร", icon: <FoodIcon />, note: "เลือกได้ 1 อย่าง" },
    { key: "extra", label: "บริการเสริม", icon: <StarIcon />, note: "เลือกได้หลายอย่าง" },
];

export default function CustomPackagePage() {
    const router = useRouter();
    const { lang } = useLanguage();
    const t = translations[lang];

    const ITEMS: Item[] = [
        { id: "coffin_basic", name: lang === 'th' ? "โลงศพไม้ธรรมดา" : "Standard Wooden Coffin", price: 3000, category: "coffin", description: lang === 'th' ? "โลงไม้มาตรฐาน" : "Standard wooden coffin" },
        { id: "coffin_teak", name: lang === 'th' ? "โลงศพไม้สักทอง" : "Golden Teak Coffin", price: 8000, category: "coffin", description: lang === 'th' ? "ไม้สักแท้ คุณภาพดี" : "Genuine high-quality teak" },
        { id: "coffin_premium", name: lang === 'th' ? "โลงศพไม้สักทองพิเศษ" : "Premium Teak Coffin", price: 15000, category: "coffin", description: lang === 'th' ? "ประดับดอกไม้พรีเมียม" : "Premium floral decorations" },
        { id: "flower_20", name: lang === 'th' ? "ดอกไม้ประดับ 20 วง" : "Floral Decor (20 rings)", price: 2000, category: "flowers", description: lang === 'th' ? "ดอกไม้สดทุกวัน" : "Fresh flowers daily" },
        { id: "flower_40", name: lang === 'th' ? "ดอกไม้ประดับ 40 วง" : "Floral Decor (40 rings)", price: 4000, category: "flowers", description: lang === 'th' ? "ดอกไม้สดทุกวัน" : "Fresh flowers daily" },
        { id: "flower_60", name: lang === 'th' ? "ดอกไม้ประดับ 60 วง" : "Floral Decor (60 rings)", price: 7000, category: "flowers", description: lang === 'th' ? "ดอกไม้นำเข้าพิเศษ" : "Special imported flowers" },
        { id: "monk_3", name: lang === 'th' ? "พระสวดมนต์ 3 วัน" : "Monk Prayers (3 Days)", price: 4500, category: "monks", description: lang === 'th' ? "พระ 9 รูปต่อวัน" : "9 monks per day" },
        { id: "monk_5", name: lang === 'th' ? "พระสวดมนต์ 5 วัน" : "Monk Prayers (5 Days)", price: 7500, category: "monks", description: lang === 'th' ? "พระ 9 รูปต่อวัน" : "9 monks per day" },
        { id: "monk_7", name: lang === 'th' ? "พระสวดมนต์ 7 วัน" : "Monk Prayers (7 Days)", price: 10500, category: "monks", description: lang === 'th' ? "พระ 9 รูปต่อวัน" : "9 monks per day" },
        { id: "car_2", name: lang === 'th' ? "รถนำศพ 2 คัน" : "Funeral Transport (2 cars)", price: 3000, category: "transport", description: lang === 'th' ? "รถนำศพมาตรฐาน" : "Standard funeral transport" },
        { id: "car_4", name: lang === 'th' ? "รถนำศพ 4 คัน" : "Funeral Transport (4 cars)", price: 6000, category: "transport", description: lang === 'th' ? "รถนำศพ VIP" : "VIP funeral transport" },
        { id: "car_6", name: lang === 'th' ? "รถนำศพ 6 คัน" : "Funeral Transport (6 cars)", price: 9000, category: "transport", description: lang === 'th' ? "รถนำศพ VIP พร้อมมอเตอร์ไซค์" : "VIP transport with escort" },
        { id: "food_100", name: lang === 'th' ? "อาหารสำหรับ 100 ท่าน" : "Catering for 100 guests", price: 5000, category: "food", description: lang === 'th' ? "บุฟเฟ่ต์มาตรฐาน" : "Standard buffet" },
        { id: "food_200", name: lang === 'th' ? "อาหารสำหรับ 200 ท่าน" : "Catering for 200 guests", price: 9000, category: "food", description: lang === 'th' ? "บุฟเฟ่ต์พรีเมียม" : "Premium buffet" },
        { id: "food_300", name: lang === 'th' ? "อาหารสำหรับ 300 ท่าน" : "Catering for 300 guests", price: 13000, category: "food", description: lang === 'th' ? "บุฟเฟ่ต์ครบวงจร" : "Full-service buffet" },
        { id: "photo", name: lang === 'th' ? "ถ่ายภาพและวิดีโองาน" : "Photography & Video", price: 3500, category: "extra", description: lang === 'th' ? "ช่างภาพมืออาชีพ" : "Professional photographer" },
        { id: "live", name: lang === 'th' ? "ถ่ายทอดสดงาน" : "Live Streaming", price: 2500, category: "extra", description: lang === 'th' ? "Live Facebook/YouTube" : "Live on Facebook/YouTube" },
        { id: "book", name: lang === 'th' ? "หนังสือที่ระลึก" : "Souvenir Books", price: 4000, category: "extra", description: lang === 'th' ? "จัดพิมพ์ภาพและประวัติ" : "Custom layout and printing" },
        { id: "mc", name: lang === 'th' ? "พิธีกรดำเนินงาน" : "Master of Ceremonies", price: 3000, category: "extra", description: lang === 'th' ? "พิธีกรมืออาชีพ" : "Professional MC" },
    ];

    const CATEGORIES = [
        { key: "coffin", label: lang === 'th' ? "โลงศพ" : "Coffin", icon: <CoffinIcon />, note: t.pkgCustomNoteSingular },
        { key: "flowers", label: lang === 'th' ? "ดอกไม้" : "Flowers", icon: <FlowerIcon />, note: t.pkgCustomNoteSingular },
        { key: "monks", label: lang === 'th' ? "พระสงฆ์" : "Monks", icon: <MonkIcon />, note: t.pkgCustomNoteSingular },
        { key: "transport", label: lang === 'th' ? "รถนำศพ" : "Transport", icon: <CarIcon />, note: t.pkgCustomNoteSingular },
        { key: "food", label: lang === 'th' ? "อาหาร" : "Catering", icon: <FoodIcon />, note: t.pkgCustomNoteSingular },
        { key: "extra", label: lang === 'th' ? "บริการเสริม" : "Extra Services", icon: <StarIcon />, note: t.pkgCustomNoteMultiple },
    ];

    const [selected, setSelected] = useState<Record<string, string[]>>({
        coffin: [], flowers: [], monks: [], transport: [], food: [], extra: [],
    });
    const [budget, setBudget] = useState<string>("");
    const [confirming, setConfirming] = useState(false);

    function toggle(item: Item) {
        const cat = item.category;
        const isExtra = cat === "extra";
        setSelected((prev) => {
            const current = prev[cat] ?? [];
            if (isExtra) {
                return { ...prev, [cat]: current.includes(item.id) ? current.filter(i => i !== item.id) : [...current, item.id] };
            } else {
                return { ...prev, [cat]: current.includes(item.id) ? [] : [item.id] };
            }
        });
    }

    const allSelected = Object.values(selected).flat();
    const total = ITEMS.filter(i => allSelected.includes(i.id)).reduce((s, i) => s + i.price, 0);
    const budgetNum = parseInt(budget) || 0;
    const overBudget = budgetNum > 0 && total > budgetNum;
    const canConfirm = allSelected.length >= 3;

    function handleConfirm() {
        setConfirming(true);
        setTimeout(() => {
            setConfirming(false);
            router.push(`/map?packageId=custom&price=${total}`);
        }, 1000);
    }

    return (
        <div className="flex flex-col bg-[#f9f8f6] min-h-dvh">

            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-5 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <div>
                        <h1 className="text-[17px] font-semibold text-[#4a4a4a]">{t.pkgCustom}</h1>
                        <p className="text-[11px] text-[#8b8b8b]">{t.pkgCustomSub}</p>
                    </div>
                </div>
            </div>

            {/* Scrollable area
                pb-[220px] = summary card (~130px) + BottomNav fixed bottom-6 (~100px) */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-[220px] flex flex-col gap-5">

                {/* Budget */}
                <div className="bg-white rounded-2xl p-4 border border-[#f0ebe4] shadow-sm">
                    <p className="text-[11px] font-semibold text-[#4a4a4a] mb-2">{t.pkgCustomBudget}</p>
                    <div className="flex items-center gap-2 bg-[#f9f8f6] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#c4b5a0] transition-colors">
                        <span className="text-[13px] text-[#8b8b8b]">฿</span>
                        <input
                            type="number"
                            value={budget}
                            onChange={e => setBudget(e.target.value)}
                            placeholder={t.pkgCustomBudgetPl}
                            className="flex-1 bg-transparent text-[13px] outline-none text-[#4a4a4a]"
                        />
                    </div>
                    {overBudget && <p className="text-[10px] text-red-500 mt-1.5">{t.pkgCustomBudgetOver}{(total - budgetNum).toLocaleString()}</p>}
                </div>

                {/* Category sections */}
                {CATEGORIES.map((cat) => {
                    const items = ITEMS.filter(i => i.category === cat.key);
                    const selectedInCat = selected[cat.key] ?? [];
                    return (
                        <div key={cat.key}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[#c4b5a0] w-5 h-5 flex items-center justify-center">{cat.icon}</span>
                                <h2 className="text-[13px] font-bold text-[#4a4a4a]">{cat.label}</h2>
                                <span className="text-[9px] text-[#8b8b8b] bg-[#f5f1ed] px-2 py-0.5 rounded-full">{cat.note}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {items.map((item) => {
                                    const isSelected = selectedInCat.includes(item.id);
                                    return (
                                        <button key={item.id} onClick={() => toggle(item)}
                                            className={`w-full text-left rounded-xl p-3.5 flex items-center gap-3 transition-all border ${isSelected ? "bg-[#c4b5a0] border-[#c4b5a0]" : "bg-white border-[#f0ebe4]"
                                                }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white/30 text-white" : "bg-[#f5f1ed] text-[#c4b5a0]"
                                                }`}>
                                                {cat.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[12px] font-semibold ${isSelected ? "text-white" : "text-[#4a4a4a]"}`}>{item.name}</p>
                                                <p className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-[#8b8b8b]"}`}>{item.description}</p>
                                            </div>
                                            <p className={`text-[12px] font-bold flex-shrink-0 ${isSelected ? "text-white" : "text-[#c4b5a0]"}`}>
                                                +฿{item.price.toLocaleString()}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary card — fixed เหมือน BottomNav, centering เดียวกัน */}
            <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[382px] z-40">
                <div className="bg-white rounded-2xl border border-[#f0ebe4] shadow-xl p-4">
                    {allSelected.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3 max-h-12 overflow-hidden">
                            {ITEMS.filter(i => allSelected.includes(i.id)).map((item) => (
                                <span key={item.id} className="text-[9px] bg-[#f5f1ed] text-[#6b5f55] px-2 py-1 rounded-full whitespace-nowrap">
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-[10px] text-[#8b8b8b]">{allSelected.length} {t.pkgCustomItemsCount}</p>
                            <p className={`text-[18px] font-bold ${overBudget ? "text-red-500" : "text-[#4a4a4a]"}`}>
                                ฿{total.toLocaleString()}
                            </p>
                        </div>
                        {budgetNum > 0 && (
                            <div className="text-right">
                                <p className="text-[10px] text-[#8b8b8b]">{t.pkgCustomBudgetLeft}</p>
                                <p className={`text-[14px] font-bold ${overBudget ? "text-red-500" : "text-green-600"}`}>
                                    {overBudget ? "-" : ""}฿{Math.abs(budgetNum - total).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm || confirming}
                        className="w-full bg-[#c4b5a0] disabled:bg-[#d4cec8] text-white py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                        {confirming
                            ? <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{t.saving}</>
                            : canConfirm ? t.pkgCustomNext : t.pkgCustomSelectMore(3 - allSelected.length)
                        }
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}