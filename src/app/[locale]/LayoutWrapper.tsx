"use client";

import { usePathname } from "next/navigation";
import Header from "./_components/header/header";
import Footer from "./_components/footer/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {!pathname.includes("/auth") && <Header />}
      {children}
      {!pathname.includes("/auth") && <Footer />}
    </>
  );
}
