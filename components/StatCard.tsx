interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

import React from "react";

export default function StatCard({
  icon,
  iconBgColor,
  value,
  label,
  badge,
  badgeColor = "#c4b5a0",
}: StatCardProps) {
  return (
    <div className="flex-shrink-0 w-[140px] bg-white border border-[#f5f1ed] rounded-2xl p-[17px] flex flex-col gap-2">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <span className="text-[20px] font-semibold text-[#4a4a4a] leading-tight">
        {value}
      </span>
      <span className="text-[10px] text-[#8b8b8b]">{label}</span>
      {badge && (
        <div className="self-start px-2 py-0.5 rounded-full bg-[#f5f1ed] text-[8.5px] font-medium" style={{ color: badgeColor }}>
          {badge}
        </div>
      )}
    </div>
  );
}
