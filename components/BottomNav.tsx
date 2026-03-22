"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/schedule",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2v4M16 2v4M3 10h18" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/map",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke={active ? "#c9b59c" : "#d4cec8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[382px] bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#f5f1ed] flex items-center justify-around px-2 py-3 z-50">
      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-transform active:scale-95"
          >
            {item.icon(active)}
          </Link>
        );
      })}
    </nav>
  );
}
