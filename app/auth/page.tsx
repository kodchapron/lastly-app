"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import AuthToggle from "@/components/AuthToggle";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 10a4 4 0 100-8 4 4 0 000 8z" stroke="#d4cec8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2.5 18c0-3.87 3.36-7 7.5-7s7.5 3.13 7.5 7" stroke="#d4cec8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="4" width="17" height="13" rx="2" stroke="#d4cec8" strokeWidth="1.5"/>
      <path d="M1.5 7l8.5 5 8.5-5" stroke="#d4cec8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="9" width="14" height="9" rx="2" stroke="#d4cec8" strokeWidth="1.5"/>
      <path d="M6 9V7a4 4 0 018 0v2" stroke="#d4cec8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [rememberMe, setRememberMe] = useState(false);

  // form state
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // error state
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // forgot password toast
  const [toast, setToast] = useState(false);

  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  const validate = () => {
    const e: typeof errors = {};
    if (tab === "signup" && !name.trim()) e.name = t.authErrName;
    if (!email.trim()) e.email = t.authErrEmail;
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t.authErrEmailInvalid;
    if (!password.trim()) e.password = t.authErrPass;
    else if (password.length < 6) e.password = t.authErrPassShort;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError("");

    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setServerError(error.message);
        setLoading(false);
        return;
      }
      // Redirect after sign-up (email confirmation disabled on most dev projects)
      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setServerError(t.authErrInvalid);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f9f8f6]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#4a4a4a] text-white text-[12px] px-5 py-3 rounded-2xl shadow-lg whitespace-nowrap fade-in">
          {t.authResetSent}
        </div>
      )}

      {/* Logo + heading section */}
      <div className="flex flex-col items-center pt-20 pb-6 px-6">
        {/* Mini logo */}
        <div className="w-[100px] h-[100px] rounded-[25px] bg-white border border-[#f5f1ed] flex items-center justify-center mb-6 shadow-sm">
          <svg width="55" height="55" viewBox="0 0 100 100" fill="none">
            {/* Heart outline */}
            <path d="M50 85 C50 85, 15 55, 15 32 C15 15, 35 15, 50 35 C65 15, 85 15, 85 32 C85 55, 50 85, 50 85 Z" stroke="#c9b59c" strokeWidth="5" strokeLinejoin="round" fill="none"/>
            {/* Lotus stem */}
            <path d="M50 80 V55" stroke="#c9b59c" strokeWidth="5" strokeLinecap="round"/>
            {/* Center petal */}
            <path d="M50 55 C45 40, 50 35, 50 35 C50 35, 55 40, 50 55 Z" fill="#c9b59c"/>
            {/* Left petal */}
            <path d="M49 55 C35 50, 30 40, 30 40 C30 40, 40 45, 47 50 Z" fill="#c9b59c"/>
            {/* Right petal */}
            <path d="M51 55 C65 50, 70 40, 70 40 C70 40, 60 45, 53 50 Z" fill="#c9b59c"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#4a4a4a] mb-1">
          {tab === "signup" ? t.authSignUpTitle : t.authSignInTitle}
        </h1>
        <p className="text-sm text-[#8b8b8b] text-center">
          {tab === "signup" ? t.authSignUpSub : t.authSignInSub}
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 px-4">
        {/* Toggle */}
        <div className="mb-6">
          <AuthToggle active={tab} onChange={(t) => { setTab(t); setErrors({}); }} />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {tab === "signup" && (
            <div>
              <FormInput
                label={t.authFullName}
                placeholder={t.authFullNamePlaceholder}
                type="text"
                icon={<PersonIcon />}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
              />
              {errors.name && (
                <p className="text-[11px] text-[#dc2626] mt-1 pl-1">{errors.name}</p>
              )}
            </div>
          )}
          <div>
            <FormInput
              label={t.authEmail}
              placeholder={t.authEmailPlaceholder}
              type="email"
              icon={<EmailIcon />}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
            />
            {errors.email && (
              <p className="text-[11px] text-[#dc2626] mt-1 pl-1">{errors.email}</p>
            )}
          </div>
          <div>
            <FormInput
              label={t.authPassword}
              placeholder={t.authPasswordPlaceholder}
              type="password"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
            />
            {errors.password && (
              <p className="text-[11px] text-[#dc2626] mt-1 pl-1">{errors.password}</p>
            )}
          </div>

          {tab === "signin" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                    rememberMe ? "bg-[#c9b59c] border-[#c9b59c]" : "bg-white border-[#767676]"
                  }`}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-[#8b8b8b]">{t.authRemember}</span>
              </label>
              <button
                onClick={handleForgotPassword}
                className="text-xs text-[#c4b5a0] hover:text-[#c9b59c] transition-colors"
              >
                {t.authForgot}
              </button>
            </div>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-[11px] text-[#dc2626] text-center bg-[#fef2f2] rounded-lg py-2 px-3">
            {serverError}
          </p>
        )}

        {/* CTA */}
        <div className="mt-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {tab === "signup" ? t.authSigningUp : t.authSigningIn}
              </span>
            ) : tab === "signup" ? t.authSignUpTitle : t.authSignInTitle}
          </Button>
        </div>

        {/* Terms */}
        <p className="text-center text-[11px] text-[#8b8b8b] mt-5 leading-relaxed">
          {t.authTermsPre}{" "}
          <button className="text-[#c4b5a0] hover:text-[#c9b59c] transition-colors">
            {t.authTermsLink}
          </button>{" "}
          {t.authAnd}{" "}
          <button className="text-[#c4b5a0] hover:text-[#c9b59c] transition-colors">
            {t.authPrivacyLink}
          </button>
        </p>
      </div>

      <div className="h-10" />
    </div>
  );
}
