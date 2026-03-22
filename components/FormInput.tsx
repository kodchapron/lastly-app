import React, { useState } from "react";

interface FormInputProps {
  label: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[#4a4a4a] pl-1">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4cec8] flex items-center">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-[#e5e5e5] rounded-[12px] py-[15px] pl-12 pr-12 text-base text-[#4a4a4a] placeholder-[#cccccc] outline-none focus:border-[#c9b59c] focus:ring-2 focus:ring-[#c9b59c]/20 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4cec8] hover:text-[#c4b5a0] transition-colors"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 10s3-5 7.5-5 7.5 5 7.5 5-3 5-7.5 5S2.5 10 2.5 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1.67 4.17L18.33 15.83M8.23 8.58A2.5 2.5 0 0012 12.42M4.58 5.83C2.92 6.9 1.67 10 1.67 10s3 5 8.33 5a8.2 8.2 0 003.75-.92M16.25 13.33C17.5 12.08 18.33 10 18.33 10S15.33 5 10 5a8 8 0 00-2.08.28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
