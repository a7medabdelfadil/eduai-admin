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
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { usePathname } from "next/navigation";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";
import { useTheme } from "next-themes";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { setUser } from "@/features/userSlice";
import { useGetSchoolLogoQuery } from "@/features/events/eventsApi";
import { useNotificationsWebSocket } from "@/hooks/useNotifications";
import { navigationItems } from "./navBarRouts";
import { cn } from "@/lib/utils";
import Switch from "./Switch";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { BiSearchAlt } from "react-icons/bi";
import { RiWechatLine } from "react-icons/ri";
import { FaClock, FaMoneyBillWave, FaMapMarkedAlt } from "react-icons/fa";

const NavBar = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const [search, setSearch] = useState("");

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
  console.log(userData);

  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleMenu2 = () => setMenuOpen2(prev => !prev);

  const closeMenu = () => setMenuOpen(false);
  const closeMenu2 = () => setMenuOpen2(false);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
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
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const navbarRef = useRef<HTMLDivElement>(null);
  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
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
      [id]: !prev[id],
    }));
  };

  const toggleNavbarSmall = () => {
    setSmall(!small);
    if (!small) {
      const allOpen = navigationItems
        .filter(item => item.isDropdown)
        .reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: true,
          }),
          {},
        );
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
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={toggleNavbar}
        ></div>
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
              <div className="mb-3 hidden md:block">
                <label htmlFor="icon" className="sr-only">
                  Search
                </label>
                <div className="relative min-w-72 md:min-w-80">
                  <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                    <BiSearchAlt className="text-secondary" size={18} />
                  </div>

                  <input
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    id="icon"
                    name="icon"
                    className="block w-full rounded-lg border-none bg-transparent px-4 py-2 ps-11 text-lg outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    placeholder={
                      currentLanguage === "ar"
                        ? "ابحث عن أي شيء"
                        : currentLanguage === "fr"
                          ? "Rechercher n'importe quoi"
                          : "Search anything"
                    }
                  />
                </div>
              </div>

              <div className="ms-auto flex w-full items-center justify-end sm:order-3 sm:justify-between sm:gap-x-3">
                <div className="hidden sm:block"></div>

                <div className="flex flex-row items-center justify-end gap-2">
                  <Link
                    href="/chat"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <RiWechatLine className="size-24 text-secondary md:size-40" />
                  </Link>
                  <Link
                    href="/notifies"
                    className="relative inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <IoMdNotificationsOutline className="size-24 text-secondary md:size-40" />

                    {notificationsCount > 0 && (
                      <div className="absolute left-5 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-center text-sm text-white">
                        <span>{notificationsCount}</span>
                      </div>
                    )}
                  </Link>

                  {isClient && (
                    <Switch theme={theme || "light"} setTheme={setTheme} />
                  )}
                  <div
                    className="relative inline-flex items-center"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => {
                        toggleMenu2();
                        closeMenu();
                      }}
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
                      <div
                        className={`absolute ${currentLanguage === "ar" ? "-right-10" : "right-20"} top-[40px] z-50 mt-5 min-w-[150px] rounded-md bg-bgPrimary shadow-md`}
                      >
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
                        onClick={() => {
                          toggleMenu();
                          closeMenu2();
                        }}
                        className="relative flex items-center gap-2 rounded-full p-1 text-sm font-semibold text-gray-800 hover:bg-thead"
                      >
                        {userLoading ? (
                          <div className="h-[38px] w-[38px] animate-pulse rounded-full bg-gray-200" />
                        ) : (
                          <img
                            className="h-[38px] w-[38px] rounded-full ring-2 ring-bgSecondary"
                            src={
                              userData?.data.hasPicture
                                ? userData?.data.picture
                                : "/images/userr.png"
                            }
                            alt="User Avatar"
                          />
                        )}

                        <div
                          className={`flex flex-col text-left ${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}
                        >
                          <span className="text-xs text-primary sm:text-[16px]">
                            {currentLanguage === "ar"
                              ? "المسؤول"
                              : currentLanguage === "fr"
                                ? "Administrateur"
                                : "Administrator"}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-textPrimary sm:text-sm">
                              {userData?.data.name || "User"}
                            </span>
                            <IoIosArrowDown
                              className={`${currentLanguage === "ar" ? "mr-6" : "ml-6"} text-textPrimary`}
                            />
                          </div>
                        </div>
                      </button>

                      {menuOpen && (
                        <div
                          className={`absolute ${currentLanguage === "ar" ? "-right-[250px]" : "right-0"} top-[40px] z-50 min-w-60 rounded-lg bg-bgPrimary p-2 shadow-md`}
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
                            <Link
                              className="block rounded-md px-3 py-2 text-sm text-textPrimary hover:bg-bgSecondary"
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
                              className="block rounded-md px-3 py-2 text-sm text-textPrimary hover:bg-error hover:text-white"
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
            className={cn(
              "fixed inset-y-0 start-0 z-[60] border-e border-borderPrimary bg-bgPrimary",
              "transition-all duration-300",
              "lg:bottom-0 lg:end-auto lg:block",
              small ? "w-24" : "w-64 overflow-y-auto",
              currentLanguage === "ar"
                ? isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:translate-x-full"
                : isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:-translate-x-full",
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
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  )}
                </div>

                {userData?.data?.employeeType === "DRIVER" ? (
                  <>
                    <li>
                      <Link
                        onClick={() => setIsOpen(false)}
                        className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                        href="/attendances"
                      >
                        <FaClock className="text-xl" />
                        {!small && (
                          <p>
                            {currentLanguage === "ar"
                              ? "الحضور"
                              : currentLanguage === "fr"
                                ? "Présence"
                                : "Attendance"}
                          </p>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => setIsOpen(false)}
                        className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                        href="/driver/salary"
                      >
                        <FaMoneyBillWave className="text-xl" />
                        {!small && (
                          <p>
                            {currentLanguage === "ar"
                              ? "الراتب"
                              : currentLanguage === "fr"
                                ? "Salaire"
                                : "Salary"}
                          </p>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => setIsOpen(false)}
                        className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                        href="/driver/gps"
                      >
                        <FaMapMarkedAlt className="text-xl" />
                        {!small && (
                          <p>
                            {currentLanguage === "ar"
                              ? "تتبع GPS"
                              : currentLanguage === "fr"
                                ? "Suivi GPS"
                                : "GPS Tracking"}
                          </p>
                        )}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    {navigationItems.map(item => (
                      <li
                        key={item.id}
                        className={item.isDropdown ? "group relative" : ""}
                      >
                        {item.isDropdown ? (
                          <>
                            <button
                              onClick={() => toggleDropdown(item.id)}
                              className={`flex ${!small ? "w-full" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-bold text-secondary hover:bg-bgSecondary hover:text-primary`}
                            >
                              {item.icon}
                              {!small && (
                                <p>
                                  {item.translations[
                                    currentLanguage as "en" | "ar" | "fr"
                                  ] || item.translations.en}
                                </p>
                              )}
                            </button>
                            {openDropdowns[item.id] && (
                              <ul
                                className={`${small ? "hidden w-fit translate-x-5 rounded-xl bg-bgPrimary p-2 group-hover:grid" : ""} mx-9 mt-2 grid gap-2 whitespace-nowrap text-nowrap text-[14px] font-semibold`}
                              >
                                {item.submenu.map(subItem => (
                                  <Link
                                    onClick={() => setIsOpen(false)}
                                    key={subItem.id}
                                    className={`hover:text-primary ${url === subItem.path ? "text-primary" : ""}`}
                                    href={subItem.path}
                                  >
                                    {subItem.translations[
                                      currentLanguage as "en" | "ar" | "fr"
                                    ] || subItem.translations.en}
                                  </Link>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            onClick={() => setIsOpen(false)}
                            className={`flex ${small ? "w-[40px]" : ""} text-md group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-bold ${url === item.path ? "bg-bgSecondary text-primary" : "text-secondary"} hover:bg-bgSecondary hover:text-primary`}
                            href={item.path}
                          >
                            {item.icon}
                            {!small && (
                              <p>
                                {item.translations[
                                  currentLanguage as "en" | "ar" | "fr"
                                ] || item.translations.en}
                              </p>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </>
                )}
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
