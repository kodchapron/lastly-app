import React from "react";

type Variant = "primary" | "secondary" | "dark" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#c9b59c] text-white hover:bg-[#b8a48b] active:scale-[0.98]",
  secondary: "bg-[#f5f1ed] text-[#4a4a4a] hover:bg-[#efe9e3] active:scale-[0.98]",
  dark: "bg-[#4a4a4a] text-white hover:bg-[#3a3a3a] active:scale-[0.98]",
  ghost: "bg-transparent text-[#c4b5a0] hover:bg-[#f5f1ed]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-6 py-[14px] text-sm rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer shrink-0",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
