/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Spinner from "@/components/spinner";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggle } from "@/features/boolyanSlice";
import Cookie from "js-cookie";
import { useGetAllCurrentUserQuery } from "@/features/dashboard/dashboardApi";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { setUser } from "@/features/userSlice";

const NavBar = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const dispatchLang = useDispatch();
  useEffect(() => {
    dispatchLang(initializeLanguage());
  }, [dispatchLang]);

  const router = useRouter();
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useGetAllCurrentUserQuery(null);

  // Theme Changer
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userData) console.log("Response Data:", userData);
    if (userError) {
      router.replace("/login");
      Cookie.remove("token");
    }
  }, [userData, userError, router]);
  const dispatch = useDispatch();
  const dispatch2 = useDispatch();

  dispatch(
    setUser({
      name: userData?.data?.name,
      email: userData?.data?.email,
      id: userData?.data?.id,
    }),
  );

  const [pathname, setPathname] = useState("");
  const [small, setSmall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const toggleProfile = () => {
    setProfile(!profile);
  };
  const [isOpen2, setIsOpen2] = useState(false);
  const toggleNavbar2 = () => {
    setIsOpen2(!isOpen2);
  };
  const [isOpen3, setIsOpen3] = useState(false);
  const toggleNavbar3 = () => {
    setIsOpen3(!isOpen3);
  };
  const [isOpen4, setIsOpen4] = useState(false);
  const toggleNavbar4 = () => {
    setIsOpen4(!isOpen4);
  };
  const [isOpen5, setIsOpen5] = useState(false);
  const toggleNavbar5 = () => {
    setIsOpen5(!isOpen5);
  };
  const toggleNavbarSmall = () => {
    setSmall(!small);
    if (!small == true) {
      setIsOpen2(true);
      setIsOpen3(true);
      setIsOpen4(true);
      setIsOpen5(true);
    }
    if (small == true) {
      setIsOpen2(false);
      setIsOpen3(false);
      setIsOpen4(false);
      setIsOpen5(false);
    }
  };

  useEffect(() => {
    setPathname(window.location.pathname);
  }, [pathname]);
  const OpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  const useWindowDimensions = () => {
    const isClient = typeof window === "object"; // Ensure code runs only in the client-side environment
    const [windowSize, setWindowSize] = useState(
      isClient
        ? { width: window.innerWidth, height: window.innerHeight }
        : { width: undefined, height: undefined },
    );

    useEffect(() => {
      if (!isClient) {
        return;
      }

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // Set initial dimensions

      return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    return windowSize;
  };

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width !== undefined && width >= 1023) {
      setIsOpen(true);
    }
  }, [width]);

  const DeleteCookie = () => {
    Cookie.remove("token");
  };

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const handleLanguageChange = (language: any) => {
    console.log(language);
    dispatch2(setLanguage(language));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <header>
        <div>
          <header
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            className={`${booleanValue ? "lg:ps-24" : "lg:ps-64"} sticky inset-x-0 top-0 z-[48] flex w-full flex-wrap border-b border-borderPrimary bg-bgPrimary py-2.5 text-sm dark:border-borderPrimary sm:flex-nowrap sm:justify-start sm:py-4`}
          >
            <nav
              className="mx-auto flex w-full basis-full items-center px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="me-5 lg:me-0 lg:hidden">
                <Link
                  className="inline-block flex-none rounded-xl text-xl font-semibold focus:opacity-80 focus:outline-none"
                  href="/"
                  aria-label="Preline"
                >
                  <img src="/images/logo.png" alt="#" />
                </Link>
              </div>

              <div className="ms-auto flex w-full items-center justify-end sm:order-3 sm:justify-between sm:gap-x-3">
                <div className="sm:hidden">
                  <button
                    type="button"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="size-4 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </div>

                <div className="hidden sm:block"></div>

                <div className="flex flex-row items-center justify-end gap-2">
                  {isClient && (
                    <>
                      {theme == "dark" ? (
                        <button
                          className="text-textPrimary"
                          onClick={() => setTheme("light")}
                        >
                          <FiMoon />
                        </button>
                      ) : (
                        <button
                          className="text-textPrimary"
                          onClick={() => setTheme("dark")}
                        >
                          <FiSun />
                        </button>
                      )}
                    </>
                  )}
                  <Link
                    href="/notifies"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="size-4 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                  </Link>
                  <Link
                    href="/chat"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5 text-textPrimary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </Link>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="text-violet11 hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-bgPrimary outline-none"
                        aria-label="Customise options"
                      >
                        {currentLanguage === "en" ? (
                          <img src="/images/en.png" alt="#" />
                        ) : currentLanguage === "ar" ? (
                          <img src="/images/morocco.png" alt="#" />
                        ) : currentLanguage === "fr" ? (
                          <img src="/images/fr.png" alt="#" />
                        ) : (
                          <img src="/images/fr.png" alt="#" />
                        )}
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 mx-2 mt-5 grid min-w-[150px] justify-center gap-5 rounded-md bg-bgPrimary p-[5px] font-semibold shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mt-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                          <button
                            onClick={() => handleLanguageChange("ar")}
                            className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                          >
                            {currentLanguage === "en"
                              ? "Arabic"
                              : currentLanguage === "ar"
                                ? "العربية"
                                : currentLanguage === "fr"
                                  ? "Arabe"
                                  : "Arabic"}
                          </button>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                          <button
                            onClick={() => handleLanguageChange("en")}
                            className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                          >
                            {currentLanguage === "en"
                              ? "English"
                              : currentLanguage === "ar"
                                ? "الإنجليزية"
                                : currentLanguage === "fr"
                                  ? "Anglais"
                                  : "English"}
                          </button>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mb-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                          <button
                            onClick={() => handleLanguageChange("fr")}
                            className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                          >
                            {currentLanguage === "en"
                              ? "French"
                              : currentLanguage === "ar"
                                ? "الفرنسية"
                                : currentLanguage === "fr"
                                  ? "Français"
                                  : "French"}
                          </button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>

                  <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          onClick={toggleProfile}
                          id="hs-dropdown-with-header"
                          type="button"
                          className="border-bgSeconday inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border text-sm font-semibold text-gray-800 outline-none hover:bg-thead disabled:pointer-events-none disabled:opacity-50"
                        >
                          {userLoading ? (
                            <p>........</p>
                          ) : (
                            <div>
                              {!userData?.data.hasPicture ? (
                                <img
                                  className="inline-block h-[38px] w-[38px] rounded-full ring-2 ring-bgSecondary"
                                  src="/images/userr.png"
                                  alt="User Avatar"
                                />
                              ) : (
                                <img
                                  className="inline-block h-[38px] w-[38px] rounded-full ring-2 ring-bgSecondary"
                                  src={userData?.data.picture}
                                  alt="User Avatar"
                                />
                              )}
                            </div>
                          )}
                        </button>
                      </DropdownMenu.Trigger>

                      {profile && (
                        <DropdownMenu.Content
                          className={` ${currentLanguage === "ar" ? "left-[20px]" : "right-[20px]"} fixed top-[20px] min-w-60 rounded-lg bg-bgPrimary p-2 text-textPrimary shadow-md`}
                          aria-labelledby="hs-dropdown-with-header"
                          align="end"
                          sideOffset={5}
                        >
                          <div className="rounded-t-lg bg-bgPrimary px-5 py-3">
                            <p className="text-sm text-textPrimary">
                              {currentLanguage === "en"
                                ? "Signed in as"
                                : currentLanguage === "ar"
                                  ? "مسجل الدخول باسم"
                                  : currentLanguage === "fr"
                                    ? "Connecté en tant que"
                                    : "Signed in as"}
                            </p>
                            <p className="text-sm font-medium text-textPrimary">
                              {userData?.data.email}
                            </p>
                          </div>
                          <div className="mt-2 py-2">
                            <DropdownMenu.Item asChild>
                              <Link
                                className="flex items-center gap-x-3.5 rounded-lg border-none px-3 py-2 text-sm text-textPrimary outline-none hover:bg-bgSecondary"
                                href="/profile"
                              >
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                {currentLanguage === "en"
                                  ? "Profile"
                                  : currentLanguage === "ar"
                                    ? "الملف الشخصي"
                                    : currentLanguage === "fr"
                                      ? "Profil"
                                      : "Profile"}
                              </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                              <a
                                onClick={DeleteCookie}
                                className="flex items-center gap-x-3.5 rounded-lg border-none px-3 py-2 text-sm text-textPrimary outline-none hover:bg-error hover:text-white"
                                href="/login"
                              >
                                {currentLanguage === "en"
                                  ? "Sign out"
                                  : currentLanguage === "ar"
                                    ? "تسجيل الخروج"
                                    : currentLanguage === "fr"
                                      ? "Déconnexion"
                                      : "Sign out"}
                              </a>
                            </DropdownMenu.Item>
                          </div>
                        </DropdownMenu.Content>
                      )}
                    </DropdownMenu.Root>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <div
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            className="sticky inset-x-0 top-0 z-20 border-y border-borderPrimary bg-bgPrimary px-4 sm:px-6 md:px-8 lg:hidden"
          >
            <div className="flex items-center justify-between py-2">
              <ol className="ms-3 flex items-center whitespace-nowrap">
                <li className="flex items-center text-sm text-textPrimary">
                  {currentLanguage === "ar"
                    ? "تخطيط التطبيق"
                    : currentLanguage === "fr"
                      ? "Mise en page de l'application"
                      : "Application Layout"}

                  {currentLanguage === "ar" ? (
                    <MdNavigateBefore size={25} className="text-gray-400" />
                  ) : (
                    <MdNavigateNext size={25} className="text-gray-400" />
                  )}
                </li>
              </ol>

              <button
                onClick={() => {
                  OpenSideBar();
                }}
                type="button"
                className="flex items-center justify-center gap-x-1.5 rounded-lg border border-borderPrimary px-3 py-2 text-xs text-gray-500 hover:text-gray-600"
                data-hs-overlay="#application-sidebar"
                aria-controls="application-sidebar"
                aria-label="Sidebar"
              >
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
                </svg>
                <span className="sr-only">Sidebar</span>
              </button>
            </div>
          </div>
          {isOpen && (
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              id="application-sidebar"
              className={`hs-overlay hs-overlay-open:translate-x-0 transform transition-all duration-300 [--auto-close:lg] ${small ? "w-[90px]" : "w-[260px]"} drop-shadow-2xl lg:drop-shadow-none ${!isOpen ? "w-0" : ""} fixed inset-y-0 start-0 z-[60] border-e border-borderPrimary bg-bgPrimary duration-300 ease-in lg:bottom-0 lg:end-auto lg:block lg:translate-x-0`}
            >
              <div className="px-8 pt-4">
                <Link href="/">
                  {small ? (
                    <img
                      className="mt-5 scale-[2]"
                      src="/images/small logo.png"
                      alt="Logo"
                    />
                  ) : (
                    <img
                      className="-translate-7 w-[150px] translate-y-3"
                      src="/images/logo.png"
                      alt="Logo"
                    />
                  )}
                </Link>
              </div>
              <div className="mx-5 flex -translate-y-6 justify-end">
                {!small && (
                  <button
                    onClick={() => {
                      toggleNavbarSmall();
                      dispatch(toggle());
                    }}
                  >
                    <svg
                      className="h-8 w-8 text-secondary"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <line x1="4" y1="6" x2="20" y2="6" />{" "}
                      <line x1="4" y1="12" x2="20" y2="12" />{" "}
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <nav
                className={`hs-accordion-group flex w-full flex-col flex-wrap p-6 ${!isOpen ? "hidden" : ""} `}
                data-hs-accordion-always-open
              >
                <ul className="space-y-1.5">
                  <div
                    className={`flex ${small ? "w-[40px]" : ""} justify-center`}
                  >
                    {small && (
                      <button
                        onClick={() => {
                          toggleNavbarSmall();
                          dispatch(toggle());
                        }}
                      >
                        <svg
                          className="h-6 w-6 text-secondary"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <li>
                    <Link
                      className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                      href="/"
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Dashboard"
                            : currentLanguage === "ar"
                              ? "لوحة القيادة"
                              : currentLanguage === "fr"
                                ? "Tableau de bord"
                                : "Dashboard"}
                        </p>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                      href="/search"
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <circle cx="11" cy="11" r="8" />{" "}
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Search"
                            : currentLanguage === "ar"
                              ? "البحث"
                              : currentLanguage === "fr"
                                ? "Recherche"
                                : "Recherche"}
                        </p>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-[#526484] hover:bg-bgSecondary hover:text-[#3e5af0]`}
                      href="/insight"
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-[#526484] group-hover:text-[#3e5af0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Insight"
                            : currentLanguage === "ar"
                              ? " نظرة"
                              : currentLanguage === "fr"
                                ? "Aperçu"
                                : "Insight"}
                        </p>
                      )}
                    </Link>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={toggleNavbar2}
                      className={`flex ${!small ? "w-full" : ""} open text-md mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary group-hover:text-primary`}
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        <path d="M16 11l2 2l4 -4" />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Administration"
                            : currentLanguage === "ar"
                              ? "إدارة"
                              : currentLanguage === "fr"
                                ? "Administration"
                                : "Administration"}
                        </p>
                      )}
                    </button>
                    {isOpen2 && (
                      <ul
                        className={`${small ? "hidden w-fit translate-x-5 whitespace-nowrap text-nowrap rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 text-[14px] font-semibold`}
                      >
                        <Link
                          className="hover:text-primary"
                          href="/user-management"
                        >
                          {currentLanguage === "en"
                            ? "User Management"
                            : currentLanguage === "ar"
                              ? "إدارة المستخدمين"
                              : currentLanguage === "fr"
                                ? "Gestion des utilisateurs"
                                : "User Management"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="whitespace-nowrap text-nowrap hover:text-primary"
                          href="/financial-management"
                        >
                          {currentLanguage === "en"
                            ? "Financial Management"
                            : currentLanguage === "ar"
                              ? "الإدارة المالية"
                              : currentLanguage === "fr"
                                ? "Gestion financière"
                                : "Financial Management"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="hover:text-primary"
                          href="/organization-setting"
                        >
                          {currentLanguage === "en"
                            ? "Organization Settings"
                            : currentLanguage === "ar"
                              ? "إعدادات المؤسسة"
                              : currentLanguage === "fr"
                                ? "Paramètres org."
                                : "Organization Setting"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="whitespace-nowrap text-nowrap hover:text-primary"
                          href="/document-management"
                        >
                          {currentLanguage === "en"
                            ? "Document Management"
                            : currentLanguage === "ar"
                              ? "إدارة المستندات"
                              : currentLanguage === "fr"
                                ? "Gestion des documents"
                                : "Document Management"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link className="hover:text-primary" href="/archive">
                          {currentLanguage === "en"
                            ? "Archive"
                            : currentLanguage === "ar"
                              ? "الأرشيف"
                              : currentLanguage === "fr"
                                ? "Archives"
                                : "Archive"}{" "}
                          {/* Default to English */}
                        </Link>
                      </ul>
                    )}
                  </li>
                  <li className="group relative">
                    <button
                      onClick={toggleNavbar3}
                      className={`flex ${!small ? "w-full" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <line x1="3" y1="21" x2="21" y2="21" />{" "}
                        <line x1="3" y1="10" x2="21" y2="10" />{" "}
                        <polyline points="5 6 12 3 19 6" />{" "}
                        <line x1="4" y1="10" x2="4" y2="21" />{" "}
                        <line x1="20" y1="10" x2="20" y2="21" />{" "}
                        <line x1="8" y1="14" x2="8" y2="17" />{" "}
                        <line x1="12" y1="14" x2="12" y2="17" />{" "}
                        <line x1="16" y1="14" x2="16" y2="17" />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Academic"
                            : currentLanguage === "ar"
                              ? "أكاديمي"
                              : currentLanguage === "fr"
                                ? "Académique"
                                : "Académique"}
                        </p>
                      )}
                    </button>
                    {isOpen3 && (
                      <ul
                        className={`${small ? "hidden w-fit translate-x-5 whitespace-nowrap rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 text-[14px] font-semibold`}
                      >
                        <Link className="hover:text-primary" href="/course">
                          {currentLanguage === "en"
                            ? "Course and Resource"
                            : currentLanguage === "ar"
                              ? "الدورات والموارد"
                              : currentLanguage === "fr"
                                ? "Cours et Ressources"
                                : "Course and Resource"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="hover:text-primary"
                          href="/educational-affairs"
                        >
                          {currentLanguage === "en"
                            ? "Educational Affairs"
                            : currentLanguage === "ar"
                              ? "الشؤون البيداغوجية"
                              : currentLanguage === "fr"
                                ? "Gestion pédagogique"
                                : "Educational Affairs"}{" "}
                          {/* Default to English */}
                        </Link>
                      </ul>
                    )}
                  </li>

                  <li className="group relative">
                    <button
                      onClick={toggleNavbar4}
                      className={`flex ${!small ? "w-full" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="3" />{" "}
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>

                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Operations"
                            : currentLanguage === "ar"
                              ? "العمليات"
                              : currentLanguage === "fr"
                                ? "Opérations"
                                : "Opérations"}
                        </p>
                      )}
                    </button>
                    {isOpen4 && (
                      <ul
                        className={`${small ? "hidden w-fit translate-x-5 whitespace-nowrap rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 text-[14px] font-semibold`}
                      >
                        <Link
                          className="hover:text-primary"
                          href="/infrastructure"
                        >
                          {currentLanguage === "en"
                            ? "Infrastructures"
                            : currentLanguage === "ar"
                              ? "البنية التحتية"
                              : currentLanguage === "fr"
                                ? "Infrastructures"
                                : "Infrastructures"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="hover:text-primary"
                          href="/attendances"
                        >
                          {currentLanguage === "en"
                            ? "Attendance/Leave"
                            : currentLanguage === "ar"
                              ? "الحضور / الإجازة"
                              : currentLanguage === "fr"
                                ? "Assiduité"
                                : "Attendance/Leave"}{" "}
                          {/* Default to English */}
                        </Link>
                      </ul>
                    )}
                  </li>
                  <li className="group relative">
                    <button
                      onClick={toggleNavbar5}
                      className={`flex ${!small ? "w-full" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                    >
                      <svg
                        className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {!small && (
                        <p>
                          {currentLanguage === "en"
                            ? "Communication"
                            : currentLanguage === "ar"
                              ? "التواصل"
                              : currentLanguage === "fr"
                                ? "Communication"
                                : "Communication"}
                        </p>
                      )}
                    </button>
                    {isOpen5 && (
                      <ul
                        className={`${small ? "hidden w-fit translate-x-5 whitespace-nowrap rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 text-[14px] font-semibold`}
                      >
                        <Link
                          className="hover:text-primary"
                          href="/post-management/news"
                        >
                          {currentLanguage === "en"
                            ? "News"
                            : currentLanguage === "ar"
                              ? "الأخبار"
                              : currentLanguage === "fr"
                                ? "Actualités"
                                : "News"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link
                          className="hover:text-primary"
                          href="/post-management"
                        >
                          {currentLanguage === "en"
                            ? "Post Management"
                            : currentLanguage === "ar"
                              ? "إدارة المشاركات"
                              : currentLanguage === "fr"
                                ? "Gestion des publications"
                                : "Post Management"}{" "}
                          {/* Default to English */}
                        </Link>

                        <Link className="hover:text-primary" href="/notifies">
                          {currentLanguage === "en"
                            ? "Notifies"
                            : currentLanguage === "ar"
                              ? "الإشعارات"
                              : currentLanguage === "fr"
                                ? "Notifications"
                                : "Notifies"}{" "}
                          {/* Default to English */}
                        </Link>
                      </ul>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        <div></div>
      </header>
    </>
  );
};

export default NavBar;
