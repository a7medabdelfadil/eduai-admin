"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateSemestersMutation } from "@/features/Organization-Setteings/semesterApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
const AddSemester = () => {
  const router = useRouter();
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
      nameEn: "Semester",
      nameAr: "الفصل الدراسي",
      nameFr: "semestre",
      href: "/organization-setting/semester",
    },
    {
      nameEn: "Add Semester",
      nameAr: "إضافة فصل دراسي",
      nameFr: "Ajouter un semestre",
      href: "/organization-setting/semester/add-semester",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createSemester, { isLoading }] = useCreateSemestersMutation();

  const onSubmit = async (data: any) => {
    try {
      await createSemester(data).unwrap();
      toast.success("Semester created successfully");
      router.push("/organization-setting/semester");
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };
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
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add Semester"
              : currentLanguage === "ar"
                ? "إضافة فصل دراسي"
                : currentLanguage === "fr"
                  ? "Ajouter un semestre"
                  : "Add Semester"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-full items-center justify-center"
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
              <svg
                className="h-6 w-6 font-bold text-secondary group-hover:text-primary"
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
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "معلومات الفصل الدراسي"
                  : currentLanguage === "fr"
                    ? "Informations sur le semestre"
                    : "Semester Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="season"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الموسم"
                  : currentLanguage === "fr"
                    ? "Saison"
                    : "Season"}
                <select
                  id="season"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name", { required: true })}
                >
                  <option value="">Select season</option>
                  <option value="WINTER">WINTER</option>
                  <option value="SUMMER">SUMMER</option>
                  <option value="FALL">FALL</option>
                </select>
                {errors.season && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "بداية الفصل الدراسي"
                  : currentLanguage === "fr"
                    ? "Le début du semestre"
                    : "The beginning of the semester"}

                <input
                  id="code"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("startDate", { required: true })}
                />
                {errors.startDate && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "نهاية الفصل الدراسي"
                  : currentLanguage === "fr"
                    ? "La fin du semestre"
                    : "The end of the semester"}

                <input
                  id="about"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("endDate", { required: true })}
                />
                {errors.endDate && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-center text-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "ar"
                    ? "حفظ"
                    : currentLanguage === "fr"
                      ? "Enregistrer"
                      : "Save"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddSemester;
