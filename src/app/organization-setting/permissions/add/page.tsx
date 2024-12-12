"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const Permissions = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Add Permissions",
      nameAr: "إضافة صلاحيات",
      nameFr: "Ajouter des autorisations",
      href: "/organization-setting/permissions/add",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`justify-left flex flex-wrap gap-5 text-[20px] max-[725px]:text-[15px] ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-4 mb-[20px] mt-[50px] font-semibold`}
      >
        <Link
          href="/organization-setting/permissions/add"
          className="text-blue-500 underline"
        >
          {currentLanguage === "ar"
            ? "قسم"
            : currentLanguage === "fr"
              ? "Département"
              : "Department"}
        </Link>
        <Link href="/organization-setting/permissions/add/employee">
          {currentLanguage === "ar"
            ? "موظف"
            : currentLanguage === "fr"
              ? "Employé"
              : "Employee"}
        </Link>
      </div>
      <div
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-3`}
      >
        <div className="rounded-xl bg-bgPrimary pb-5">
          <div className="flex justify-between rounded-t-xl bg-thead px-10 py-4 text-[18px] font-semibold">
            <p>
              {currentLanguage === "ar"
                ? "الصلاحية"
                : currentLanguage === "fr"
                  ? "Autorisation"
                  : "Permission"}
            </p>
            <p>
              {currentLanguage === "ar"
                ? "ينطبق على"
                : currentLanguage === "fr"
                  ? "Applicable pour"
                  : "Applicable For"}
            </p>
          </div>
          <div className="flex justify-between px-10 py-8 max-[640px]:grid max-[640px]:justify-center max-[640px]:gap-10">
            <div className="grid gap-5 text-[18px] font-semibold">
              <div className="flex items-center gap-2">
                <button>
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
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                />
                <p>
                  {currentLanguage === "ar"
                    ? "الإدارة"
                    : currentLanguage === "fr"
                      ? "Administration"
                      : "Administration"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button>
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
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                />
                <p>
                  {currentLanguage === "ar"
                    ? "الأكاديمي"
                    : currentLanguage === "fr"
                      ? "Académique"
                      : "Academic"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button>
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
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                />
                <p>
                  {currentLanguage === "ar"
                    ? "العمليات"
                    : currentLanguage === "fr"
                      ? "Opérations"
                      : "Operations"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button>
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
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                />
                <p>
                  {currentLanguage === "ar"
                    ? "الاتصالات"
                    : currentLanguage === "fr"
                      ? "Communication"
                      : "Communication"}
                </p>
              </div>
            </div>
            <div className="grid h-[90px] w-[300px] gap-5 font-semibold">
              <p>
                {currentLanguage === "ar"
                  ? "الأقسام"
                  : currentLanguage === "fr"
                    ? "Sections"
                    : "Sections"}
              </p>
              <select
                id="countries"
                className="block w-full rounded-lg border border-borderPrimary bg-bgPrimary p-1.5 text-sm text-textSecondary outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                <option selected>
                  {currentLanguage === "ar"
                    ? "اختر"
                    : currentLanguage === "fr"
                      ? "Choisir"
                      : "Choose"}
                </option>
                <option value="US">
                  {currentLanguage === "ar"
                    ? "مدرس"
                    : currentLanguage === "fr"
                      ? "Enseignant"
                      : "Teacher"}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permissions;
