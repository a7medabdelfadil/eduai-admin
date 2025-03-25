/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Spinner from "@/components/spinner";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toggle } from "@/features/boolyanSlice";
import Cookie from "js-cookie";
import { useGetAllCurrentUserQuery } from "@/features/dashboard/dashboardApi";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { usePathname } from "next/navigation";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { setUser } from "@/features/userSlice";
import { useGetSchoolLogoQuery } from "@/features/events/eventsApi";
import { useNotificationsWebSocket } from "@/hooks/useNotifications";
import { navigationItems } from "./navBarRouts";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, isLoading } = useGetSchoolLogoQuery(null);
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

  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleMenu2 = () => setMenuOpen2((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);
  const closeMenu2 = () => setMenuOpen2(false);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
        closeMenu2();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
  const url = usePathname();
  dispatch(
    setUser({
      name: userData?.data?.name,
      email: userData?.data?.email,
      id: userData?.data?.id,
    }),
  );

  const userId = useSelector((state: RootState) => state.user?.id) || null;
  const { notificationsCount } = useNotificationsWebSocket(userId);
  const [small, setSmall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const toggleProfile = () => {
    setProfile(!profile);
  };
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const navbarRef = useRef<HTMLDivElement>(null);
  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleNavbarSmall = () => {
    setSmall(!small);
    if (!small) {
      const allOpen = navigationItems
        .filter(item => item.isDropdown)
        .reduce((acc, item) => ({
          ...acc,
          [item.id]: true
        }), {});
      setOpenDropdowns(allOpen);
    } else {
      setOpenDropdowns({});
    }
  };

  const OpenSideBar = () => {
    setIsOpen(!isOpen);
  };

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
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={toggleNavbar}></div>
      )}
      <header ref={navbarRef}>
        <div>
          <header
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            className={`${booleanValue ? "lg:ps-24" : "lg:ps-64"} sticky inset-x-0 top-0 z-[48] flex w-full flex-wrap border-b border-borderPrimary bg-bgPrimary py-2.5 text-sm dark:border-borderPrimary sm:flex-nowrap sm:justify-start sm:py-4`}
          >
            <nav
              className="mx-auto flex w-full basis-full items-center px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="max-[1024px]:hidden">
                <Link
                  className="inline-block flex-none rounded-xl text-xl font-semibold focus:opacity-80 focus:outline-none"
                  href="/"
                  aria-label="Preline"
                >
                  {isLoading ? (
                    <p></p>
                  ) : (
                    <img
                      src={data?.data?.logoLink}
                      alt="#"
                      className="h-[60px] w-[100px]"
                    />
                  )}
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
                    className="relative inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
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
                    {notificationsCount > 0 && (
                      <div className="absolute left-5 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-center text-sm text-white">
                        <span>{notificationsCount}</span>
                      </div>
                    )}
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

                  <div className="relative inline-flex" ref={dropdownRef}>
                    <button
                      onClick={() => { toggleMenu2(); closeMenu(); }}
                      className="text-violet11 hover:bg-violet3 mx-3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-bgPrimary outline-none"
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

                    {menuOpen2 && (
                      <div className={`absolute ${currentLanguage === "ar" ? "-right-10" : "right-0"} top-[40px] mt-5 z-50 min-w-[150px] rounded-md bg-bgPrimary shadow-md`}>
                        <button
                          onClick={() => {
                            handleLanguageChange("ar");
                            closeMenu2();
                            closeMenu();
                          }}
                          className="block w-full px-4 py-2 text-left text-[20px] hover:bg-bgSecondary"
                        >
                          {currentLanguage === "en"
                            ? "Arabic"
                            : currentLanguage === "ar"
                              ? "العربية"
                              : currentLanguage === "fr"
                                ? "Arabe"
                                : "Arabic"}
                        </button>
                        <button
                          onClick={() => {
                            handleLanguageChange("en");
                            closeMenu2();
                            closeMenu();
                          }}
                          className="block w-full px-4 py-2 text-left text-[20px] hover:bg-bgSecondary"
                        >
                          {currentLanguage === "en"
                            ? "English"
                            : currentLanguage === "ar"
                              ? "الإنجليزية"
                              : currentLanguage === "fr"
                                ? "Anglais"
                                : "English"}
                        </button>
                        <button
                          onClick={() => {
                            handleLanguageChange("fr");
                            closeMenu2();
                            closeMenu();
                          }}
                          className="block w-full px-4 py-2 text-left text-[20px] hover:bg-bgSecondary"
                        >
                          {currentLanguage === "en"
                            ? "French"
                            : currentLanguage === "ar"
                              ? "الفرنسية"
                              : currentLanguage === "fr"
                                ? "Français"
                                : "French"}
                        </button>
                      </div>
                    )}

                    <div className="relative inline-flex">
                      <button
                        onClick={() => { toggleMenu(); closeMenu2(); }}
                        className="border-bgSeconday inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border text-sm font-semibold text-gray-800 outline-none hover:bg-thead"
                      >
                        {userLoading ? (
                          <div className="w-full h-full animate-pulse bg-gray-200 rounded-full" />
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

                      {menuOpen && (
                        <div className={`absolute ${currentLanguage === "ar" ? "-right-[250px]" : "right-0"} top-[40px] z-50 min-w-60 rounded-lg bg-bgPrimary p-2 shadow-md`}>
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
                            <Link
                              className="block px-3 py-2 rounded-md text-sm text-textPrimary  hover:bg-bgSecondary"
                              href="/profile"
                              onClick={closeMenu}
                            >
                              {currentLanguage === "en"
                                ? "Profile"
                                : currentLanguage === "ar"
                                  ? "الملف الشخصي"
                                  : currentLanguage === "fr"
                                    ? "Profil"
                                    : "Profile"}
                            </Link>
                            <a
                              className="block px-3 py-2 rounded-md text-sm text-textPrimary hover:bg-error hover:text-white"
                              href="/login"
                              onClick={() => {
                                DeleteCookie();
                                closeMenu();
                              }}
                            >
                              {currentLanguage === "en"
                                ? "Sign out"
                                : currentLanguage === "ar"
                                  ? "تسجيل الخروج"
                                  : currentLanguage === "fr"
                                    ? "Déconnexion"
                                    : "Sign out"}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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

          <div
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            id="application-sidebar"
            className={cn("fixed inset-y-0 start-0 z-[60] border-e border-borderPrimary bg-bgPrimary", "transition-all duration-300", "lg:bottom-0 lg:end-auto lg:block", small ? "w-24" : "w-64 overflow-y-auto",
              currentLanguage === "ar"
                ? isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:translate-x-full"
                : isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:-translate-x-full"
            )}
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
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <nav
              className={`hs-accordion-group flex w-full flex-col flex-wrap p-6`}
              data-hs-accordion-always-open
            >
              <ul className="space-y-1.5">
                <div className={`flex ${small ? "w-[40px]" : ""} justify-center`}>
                  {small && (
                    <button
                      onClick={() => { toggleNavbarSmall(); dispatch(toggle()); }}
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
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  )}
                </div>

                {navigationItems.map((item) => (
                  <li key={item.id} className={item.isDropdown ? "group relative" : ""}>
                    {item.isDropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className={`flex ${!small ? "w-full" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold text-secondary hover:bg-bgSecondary hover:text-primary `}
                        >
                          {item.icon}
                          {!small && (
                            <p>
                              {item.translations[currentLanguage as "en" | "ar" | "fr"] || item.translations.en}
                            </p>
                          )}
                        </button>
                        {openDropdowns[item.id] && (
                          <ul
                            className={`${small ? "hidden w-fit translate-x-5 rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 text-[14px] whitespace-nowrap text-nowrap font-semibold`}
                          >
                            {item.submenu.map((subItem) => (
                              <Link
                                onClick={() => setIsOpen(false)}
                                key={subItem.id}
                                className={`hover:text-primary ${url === subItem.path ? "text-primary" : ""}`}
                                href={subItem.path}
                              >
                                {subItem.translations[currentLanguage as "en" | "ar" | "fr"] ||
                                  subItem.translations.en}
                              </Link>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        onClick={() => setIsOpen(false)}
                        className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-bold ${url === item.path ? "bg-bgSecondary text-primary" : "text-secondary"} hover:bg-bgSecondary hover:text-primary`}
                        href={item.path}
                      >
                        {item.icon}
                        {!small && (
                          <p>
                            {item.translations[currentLanguage as "en" | "ar" | "fr"] || item.translations.en}
                          </p>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>
        <div></div>
      </header>
    </>
  );
};

export default NavBar;
