import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarPath — Find Your Best University",
  description: "Answer a few questions and discover the top universities that match your academic profile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100">
        {children}
      </body>
    </html>
  );
}
