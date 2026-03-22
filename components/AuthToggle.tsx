"use client";

interface AuthToggleProps {
  active: "signin" | "signup";
  onChange: (tab: "signin" | "signup") => void;
}

export default function AuthToggle({ active, onChange }: AuthToggleProps) {
  return (
    <div className="flex bg-white rounded-2xl p-1 gap-0">
      <button
        onClick={() => onChange("signin")}
        className={[
          "flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer",
          active === "signin"
            ? "bg-[#c9b59c] text-white shadow-sm"
            : "text-[#8b8b8b] hover:text-[#4a4a4a]",
        ].join(" ")}
      >
        Sign In
      </button>
      <button
        onClick={() => onChange("signup")}
        className={[
          "flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer",
          active === "signup"
            ? "bg-[#c9b59c] text-white shadow-sm"
            : "text-[#8b8b8b] hover:text-[#4a4a4a]",
        ].join(" ")}
      >
        Sign Up
      </button>
    </div>
  );
}
