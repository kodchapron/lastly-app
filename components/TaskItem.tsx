interface TaskItemProps {
  text: string;
  time: string;
  urgent?: boolean;
  checked?: boolean;
}

export default function TaskItem({
  text,
  time,
  urgent = false,
  checked = false,
}: TaskItemProps) {
  return (
    <div className="bg-white border border-[#f5f1ed] rounded-xl px-[17px] py-[17px] flex items-start gap-3">
      {/* Checkbox */}
      <div className="mt-0.5 w-5 h-5 rounded-[6px] border border-[#d4cec8] flex items-center justify-center shrink-0 bg-white">
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#c4b5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[11.9px] text-[#4a4a4a] leading-snug ${checked ? "line-through opacity-60" : ""}`}>
          {text}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#8b8b8b" strokeWidth="1.2"/>
              <path d="M6 3.5V6l1.5 1.5" stroke="#8b8b8b" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] text-[#8b8b8b]">{time}</span>
          </div>
          {urgent && (
            <span className="px-2 py-0.5 rounded-full bg-[#fef2f2] text-[8.5px] font-medium text-[#dc2626]">
              ด่วน
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
