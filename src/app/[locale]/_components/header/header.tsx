"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import img1 from "@/media/location-icon.png";
import img2 from "@/media/emailicon.png";
import img3 from "@/media/tele-icon.png";
import img4 from "@/media/facebook-icon.png";
import img5 from "@/media/linkedIn-icon.png";
import logo from "@/media/logo.png";
import { Link, useRouter } from "@/i18n/routing";
import menuIcon from "@/media/menuIcon.png";
import { useUser } from "../../_contexts/userContext";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { BiUser } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { useConfigrationsContext } from "../../_contexts/MainConfigContext";
const LanguageSwitcher = dynamic(() => import("../LanguageSwitcher/LanguageSwitcher"), {
  ssr: false, // Disable SSR for this component
});

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const { user, updateUser } = useUser();
  const { Configrations } = useConfigrationsContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("HomePage");


  // Ensure consistent rendering between server and client
  const isClient = typeof window !== "undefined";
  const initialUser = isClient ? user : null;

  const router = useRouter()

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      updateUser({});
      setDropdownIsOpen(false)
      router.push('/auth/signin');
    }
  }

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="fixed left-0 top-0 h-full w-full z-[9999] backdrop-blur-sm overflow-hidden lg:hidden"
        ></div>
      )}
      <div className={styles.top_header + " py-1"}>
        <div className="flex justify-between max-w-[90%] mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
          <ul className="flex justify-between gap-6 md:gap-2">
            <li>
              <a href="https://maps.app.goo.gl/fpXQd6Z4Krdinj6m7" target="_blank" className="flex items-center gap-0 md:gap-2">
                <Image src={img1} alt="location icon" priority />
                <span className="hidden lg:inline">
                  {Configrations?.address}
                </span>
              </a>
            </li>
            <li>
              <a href="mailto:sales@omnifert.com" className="flex items-center gap-0 md:gap-2">
                <Image src={img2} alt="email icon" priority />
                <span className="hidden lg:inline">{Configrations?.email}</span>
              </a>
            </li>
            <li>
              <a href="tel:+201056541236" className="flex items-center gap-0 md:gap-2">
                <Image src={img3} alt="location icon" priority />
                <span className="hidden lg:inline">{Configrations?.phone}</span>
              </a>
            </li>
          </ul>

          <ul className="flex justify-between gap-6">
            <li>
              <a href="https://www.facebook.com/">
                <Image src={img4} alt="facebook icon" priority />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/">
                <Image src={img5} alt="linkedIn icon" priority />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <nav className="relative">
        <div className="flex justify-between items-center py-2 max-w-[90%] mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
          <Link href={"/"}>
            <Image src={logo} alt="logo" className="w-20 md:w-32" priority />
          </Link>
          <ul
            className={`fixed flex top-[0] h-[110vh] w-[15rem] bg-[#00431F] z-[99999] overflow-scroll lg:overflow-auto  px-6 py-16 flex-col justify-start lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:z-0 lg:px-0 lg:py-0 lg:flex-row gap-6 transition-all duration-500 ${isOpen ? "left-0" : "left-[-15rem]"
              }`}
          >
            <li className="absolute top-4 right-4">
              <button
                className="w-8 h-8 relative group"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div
                  className={`absolute w-full h-0.5 bg-white top-1/2 rotate-45 transition-all duration-300 ${!isOpen && "rotate-[0deg]"
                    }`}
                ></div>
                <div
                  className={`absolute w-full h-0.5 bg-white top-1/2 -rotate-45 transition-all duration-300 ${!isOpen && "-rotate-[0deg]"
                    }`}
                ></div>
              </button>
            </li>
            <li>
              <Link href="/" className="text-white lg:text-[#363636]">
              {t("Home")}
              </Link>
            </li>
            <li>
              <Link href="/market" className="text-white lg:text-[#363636]">
              {t("market")}
              </Link>
            </li>
            <li>
              <Link
                href="/our-projects"
                className="text-white lg:text-[#363636]"
              >
                {t("ourProjects")}
              </Link>
            </li>
            <li>
              <Link
                href="/news-articles"
                className="text-white lg:text-[#363636]"
              >
                {t("Blogs")}
              </Link>
            </li>
            <li>
              <Link href="/partners" className="text-white lg:text-[#363636]">
              {t("Partners")}
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="text-white lg:text-[#363636]">
              {t("contactUs")}
              </Link>
            </li>
            {initialUser ? <ul className="w-full lg:hidden border-t border-[#fff] mt-8 pt-4">
              <li className="w-full">
                <button onClick={() => { router.push("/profile"); setDropdownIsOpen(false); }} className="w-full flex justify-center items-center text-white gap-3 cursor-pointer px-4 py-2 outline-0 border-0 bg-transparent focus:outline-0 focus:border-0 focus:bg-transparent text-sm md:text-base"><BiUser /> {t("Profile")}</button>
              </li>
              <li className="w-full">
                <button className="w-full flex justify-center items-center gap-3 cursor-pointer px-4 py-2 outline-0 border-0 bg-transparent focus:outline-0 focus:border-0 focus:bg-transparent text-sm md:text-base text-red-600"
                  onClick={handleLogout}><IoMdExit /> {t("logout")}</button>
              </li>
            </ul> : <li className="w-full flex flex-col justify-center gap-4 p-8 lg:hidden">
              <Link
                href="/auth/signup"
                className="block lg:hidden px-4 py-2 text-[14px] text-center font-[500] rounded-[8px] bg-white"
              >
                {t("signUp")}
              </Link>
              <Link
                href="/auth/signin"
                className="block lg:hidden px-4 py-2 text-sm text-center md:text-base rounded-[8px] bg-[#009444] text-white hover:bg-[#00431F] duration-200"
              >
                {t("login")}
              </Link>
            </li>}

          </ul>

          <div className="flex items-center gap-4 md:gap-8">
            <LanguageSwitcher />
            {initialUser ? (<>

              <div className="relative hidden lg:inline-block text-left " ref={dropdownRef}>

                <p
                  onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                  className="text-[14px] font-[500] rounded-[4px] bg-white cursor-pointer"
                >
                  {t("welcome")}, {initialUser.username}
                </p>

                {dropdownIsOpen && (
                  <div className="absolute z-[999] right-[50%] translate-x-[50%] mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <ul className="w-full bg-white rounded-[8px] overflow-hidden">
                      <li className="w-full hover:bg-gray-200">
                        <button onClick={() => { router.push("/profile"); setDropdownIsOpen(false); }} className="w-full flex justify-center items-center gap-3 cursor-pointer px-4 py-2 outline-0 border-0 bg-transparent focus:outline-0 focus:border-0 focus:bg-transparent text-sm md:text-base"><BiUser /> {t("Profile")}</button>
                      </li>
                      <li className="w-full hover:bg-gray-200">
                        <button className="w-full flex justify-center items-center gap-3 cursor-pointer px-4 py-2 outline-0 border-0 bg-transparent focus:outline-0 focus:border-0 focus:bg-transparent text-sm md:text-base text-red-600"
                          onClick={handleLogout}><IoMdExit /> {t("logout")}</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

            </>
            ) : (
              <div className="hidden gap-4 lg:flex lg:items-center">
                <Link
                  href="/auth/signup"
                  className="text-[14px] font-[500] rounded-[4px] bg-white"
                >
                  {t("signUp")}
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm md:text-base rounded-[8px] bg-[#009444] text-white hover:bg-[#00431F] duration-200"
                >
                  {t("login")}
                </Link>
              </div>
            )}
            <button
              className={styles.toggleMenu + ` flex lg:hidden`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Image src={menuIcon} alt="menu icon" priority />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
