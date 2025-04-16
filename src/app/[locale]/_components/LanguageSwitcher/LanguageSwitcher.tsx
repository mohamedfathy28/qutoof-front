"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
const Dropdown = dynamic(() => import("../dropdown/Dropdown"), {
  ssr: false, // Disable SSR for this component
});
import { useDirection } from "../../_contexts/DirectionContext";

import englishFlag from "@/media/englishFlag.png";
import arabicFlag from "@/media/arabicFlag.png";
import { usePathname, useRouter } from "next/navigation";

const options = [
  { option: "Arabic", img: arabicFlag },
  { option: "English", img: englishFlag },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { direction, setDirection, toggleDirection } = useDirection();


  // Ensure consistent rendering between server and client
  const isClient = typeof window !== 'undefined';
  const initialDirection = isClient ? localStorage.getItem('direction') : 'ltr';

  useEffect(() => {
    if (pathname.startsWith("/ar")) {
      setDirection("rtl");
      localStorage.setItem("direction","rtl");
    } else {
      setDirection("ltr");
      localStorage.setItem("direction","ltr");
    }
  }, [pathname, setDirection]);

  const handleSelect = (selected: { option: string }) => {
    if (selected.option === "Arabic") {
      router.push(`${pathname.replace("/en", "/ar")}`);
      toggleDirection();
    } else {
      router.push(`${pathname.replace("/ar", "/en")}`);


      toggleDirection();
    }
  };

  return (
    <Dropdown
      options={options}
      onSelect={handleSelect}
      placeholder={direction === "rtl" && pathname.startsWith("/ar") ? options[0] : options[1]}
      selected={initialDirection === "rtl" && pathname.startsWith("/ar") ? options[0] : options[1]}
    />
  );
};

export default LanguageSwitcher;
