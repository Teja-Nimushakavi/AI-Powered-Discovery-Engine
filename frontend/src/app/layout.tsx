import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myntra Wishlist Purchase Discovery Engine",
  description: "AI-Powered Customer Conversion Opportunity Analytics for Product Managers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
