import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LASTLY — เคียงข้างในทุกช่วงเวลาสำคัญ",
  description: "แอปพลิเคชันจัดการงานศพอย่างมีศักดิ์ศรีและใส่ใจ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <div className="app-shell">
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.getItem('lastly_dark') === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
