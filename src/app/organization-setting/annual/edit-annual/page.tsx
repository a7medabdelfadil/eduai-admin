"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";

const EditAnnual = () => {
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
      nameEn: "Annual Leave",
      nameAr: "إجازة سنوية",
      nameFr: "Congé annuel",
      href: "/organization-setting/annual",
    },
    {
      nameEn: "Edit Annual Leave",
      nameAr: "تعديل إجازة سنوية",
      nameFr: "Modifier le congé annuel",
      href: "/organization-setting/annual/edit-annual",
    },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-3 mt-[40px] grid h-[500px] items-center justify-center`}
      >
        <form>
          <div className="grid h-[400px] items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:h-[500px] xl:w-[1000px]">
            <div className="flex items-center justify-start gap-2">
              <svg
                className="h-6 w-6 font-bold text-secondary group-hover:text-hover"
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
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="5 6 12 3 19 6" />
                <line x1="4" y1="10" x2="4" y2="21" />
                <line x1="20" y1="10" x2="20" y2="21" />
                <line x1="8" y1="14" x2="8" y2="17" />
                <line x1="12" y1="14" x2="12" y2="17" />
                <line x1="16" y1="14" x2="16" y2="17" />
              </svg>
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "تعديل الإجازة السنوية"
                  : currentLanguage === "fr"
                    ? "Modifier le congé annuel"
                    : "Edit Annual Leave"}
                {/* default */}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="annual"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "إجازة سنوية"
                  : currentLanguage === "fr"
                    ? "Congé annuel"
                    : "Annual Leave"}
                {/* default */}
                <input
                  id="annual"
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "المرضى"
                      : currentLanguage === "fr"
                        ? "Patients"
                        : "Patients"
                  }
                />
              </label>

              <label
                htmlFor="leaveType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "نوع الإجازة"
                  : currentLanguage === "fr"
                    ? "Type de congé"
                    : "Leave Type"}
                <select
                  id="leaveType"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("leaveType", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر نوع الإجازة"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le type de congé"
                        : "Select Leave Type"}
                  </option>
                  <option value="PAID">
                    {currentLanguage === "ar"
                      ? "مدفوع"
                      : currentLanguage === "fr"
                        ? "Payé"
                        : "Paid"}
                  </option>
                  <option value="FREE">
                    {currentLanguage === "ar"
                      ? "مجاني"
                      : currentLanguage === "fr"
                        ? "Gratuit"
                        : "Free"}
                  </option>
                </select>
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "حفظ"
                  : currentLanguage === "fr"
                    ? "Sauvegarder"
                    : "Save"}

                {/* default */}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAnnual;
