"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

interface departmentIdProps {
  params: {
    departmentId: string;
  };
}

const Permissions: React.FC<departmentIdProps> = ({ params }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

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
      nameEn: "Department Permissions",
      nameAr: "صلاحيات المنظمة",
      nameFr: "Autorisations du département",
      href: "/organization-setting/permissions/department-permission",
    },
    {
      nameEn: "Edit Department Permission",
      nameAr: "تعديل صلاحيات القسم",
      nameFr: "Modifier les autorisations du département",
      href: `/organization-setting/permissions/department-permission/${params.departmentId}`,
    },
  ];

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
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-3 mt-[40px]`}
      >
        <div className="rounded-xl bg-bgPrimary pb-5">
          <div className="flex justify-between rounded-t-xl bg-thead px-10 py-4 text-[18px] font-semibold">
            <p>Permission</p>
            <p>Applicable For</p>
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
                <p>Administration</p>
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
                <p>Academic</p>
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
                <p>Operations</p>
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
                <p>Communication</p>
              </div>
            </div>
            <div className="grid h-[90px] w-[300px] gap-5 font-semibold">
              <p>Sections</p>
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
