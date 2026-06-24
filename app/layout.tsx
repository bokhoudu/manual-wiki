import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ManualProvider } from "@/components/ManualStore";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Manual Wiki",
  description: "제품 매뉴얼 검색, 열람, 등록을 위한 MVP 위키"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white font-sans antialiased">
        <AuthProvider>
          <ManualProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ManualProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
