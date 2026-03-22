interface ActivityItemProps {
  icon: React.ReactNode;
  iconBg: string;
  text: string;
  time: string;
  showDivider?: boolean;
}

import React from "react";

export default function ActivityItem({
  icon,
  iconBg,
  text,
  time,
  showDivider = true,
}: ActivityItemProps) {
  return (
    <div className={`flex items-start gap-3 ${showDivider ? "pb-4 border-b border-[#f5f1ed]" : ""}`}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.9px] text-[#4a4a4a] leading-snug">{text}</p>
        <div className="flex items-center gap-1 mt-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#8b8b8b" strokeWidth="1.2"/>
            <path d="M6 3.5V6l1.5 1.5" stroke="#8b8b8b" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[10px] text-[#8b8b8b]">{time}</span>
        </div>
      </div>
    </div>
  );
}
