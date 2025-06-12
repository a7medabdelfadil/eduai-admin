"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateCoursesMutation } from "@/features/Acadimic/courseApi";
import {
  useGetAllLevelsQuery,
  useGetAllRegistrationsQuery,
  useGetAllLanguagesQuery,
} from "@/features/signupApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useGetAllCountrysQuery } from "@/features/dashboard/dashboardApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

const AddCourse = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Course Management",
      nameAr: "إدارة الدورات",
      nameFr: "Gestion des cours",
      href: "/course/course-management",
    },
    {
      nameEn: "Add Course",
      nameAr: "إضافة دورة",
      nameFr: "Ajouter un cours",
      href: "/course/course-management/add-course",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: CountryData, isLoading: CountryLoading } =
    useGetAllCountrysQuery(null);
  const { data: LevelData, isLoading: LevelLoading } =
    useGetAllLevelsQuery(null);
  const { data: RegData, isLoading: RegLoading } =
    useGetAllRegistrationsQuery(null);
  const { data: LangData, isLoading: LangLoading } =
    useGetAllLanguagesQuery(null);

  const [createCourse, { isLoading }] = useCreateCoursesMutation();

  const onSubmit = async (data: any) => {
    try {
      await createCourse(data).unwrap();
      toast.success("Course created successfully");
    } catch (err) {
      toast.error("Failed to create Course");
    }
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (CountryLoading || LevelLoading || RegLoading || LangLoading || loading)
    return (
      <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgPrimary duration-300 ease-in max-[1040px]:grid-cols-1">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="mb-8 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add Course"
              : currentLanguage === "ar"
                ? "إضافة دورة"
                : currentLanguage === "fr"
                  ? "Ajouter un cours"
                  : "Add Course"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex justify-center items-center w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
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
                  ? "معلومات الدورة"
                  : currentLanguage === "fr"
                    ? "Informations sur le cours"
                    : "Course Information"}
              </h1>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(en) الاسم"
                  : currentLanguage === "fr"
                    ? "Nom (en)"
                    : "Name (en)"}
                <input
                  id="name"
                  {...register("name_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.name_en && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(ar) الاسم"
                  : currentLanguage === "fr"
                    ? "Nom (ar)"
                    : "Name (ar)"}
                <input
                  id="name"
                  {...register("name_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.name_ar && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(fr) الاسم"
                  : currentLanguage === "fr"
                    ? "Nom (fr)"
                    : "Name (fr)"}
                <input
                  id="name"
                  {...register("name_fr", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.name_fr && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(en) الوصف"
                  : currentLanguage === "fr"
                    ? "Description (en)"
                    : "Description (en)"}
                <input
                  id="name"
                  {...register("description_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_en && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(ar) الوصف"
                  : currentLanguage === "fr"
                    ? "Description (ar)"
                    : "Description (ar)"}
                <input
                  id="name"
                  {...register("description_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_ar && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "(fr) الوصف"
                  : currentLanguage === "fr"
                    ? "Description (fr)"
                    : "Description (fr)"}
                <input
                  id="name"
                  {...register("description_fr", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_fr && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="countryId"
                className="grid text-start text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "البلد"
                  : currentLanguage === "fr"
                    ? "Pays"
                    : "Country"}
                <select
                  defaultValue=""
                  id="countryId"
                  {...register("countryId")}
                  className={`border ${errors.countryId ? "border-warning" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر البلد"
                      : currentLanguage === "fr"
                        ? "Sélectionner le pays"
                        : "Select Country"}
                  </option>
                  {CountryData &&
                    Object.entries(CountryData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.countryId && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "البلد مطلوب"
                      : currentLanguage === "fr"
                        ? "Le pays est requis"
                        : "Country is Required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="level"
                className="grid text-start text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "مستوى الدراسة"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude"
                    : "Study Level"}
                <select
                  defaultValue=""
                  id="level"
                  {...register("level", { required: true })}
                  className={`border ${errors.level ? "border-warning" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر مستوى الدراسة"
                      : currentLanguage === "fr"
                        ? "Sélectionner le niveau d'étude"
                        : "Select Study Level"}
                  </option>
                  {LevelData &&
                    Object.entries(LevelData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.level && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "مستوى الدراسة مطلوب"
                      : currentLanguage === "fr"
                        ? "Le niveau d'études est requis"
                        : "Study Level is Required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="registrationType"
                className="grid text-start text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "التسجيل"
                  : currentLanguage === "fr"
                    ? "Inscription"
                    : "Registration"}
                <select
                  defaultValue=""
                  id="registrationType"
                  {...register("registrationType", { required: true })}
                  className={`border ${errors.registrationType ? "border-warning" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر التسجيل"
                      : currentLanguage === "fr"
                        ? "Sélectionner l'inscription"
                        : "Select Registration"}
                  </option>
                  {RegData &&
                    Object.entries(RegData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.registrationType && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "التسجيل مطلوب"
                      : currentLanguage === "fr"
                        ? "L'inscription est requise"
                        : "Registration is Required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="language"
                className="grid text-start text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "اللغة"
                  : currentLanguage === "fr"
                    ? "Langue"
                    : "Language"}
                <select
                  defaultValue=""
                  id="language"
                  {...register("language", { required: true })}
                  className={`border ${errors.language ? "border-warning" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر اللغة"
                      : currentLanguage === "fr"
                        ? "Sélectionner la langue"
                        : "Select Language"}{" "}
                  </option>
                  {LangData &&
                    Object.entries(LangData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.language && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "اللغة مطلوبة"
                      : currentLanguage === "fr"
                        ? "La langue est requise"
                        : "Language is Required"}
                  </span>
                )}
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الرمز"
                  : currentLanguage === "fr"
                    ? "Code"
                    : "Code"}
                <input
                  id="code"
                  {...register("code", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.code && (
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
                  ? "معرف النظام التعليمي"
                  : currentLanguage === "fr"
                    ? "ID du système éducatif"
                    : "EDU System Id"}
                <input
                  id="eduSystemId"
                  {...register("eduSystemId", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.eduSystemId && (
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
                    ? "+ إضافة دورة"
                    : currentLanguage === "fr"
                      ? "+ Ajouter un cours"
                      : "+ Add Course"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddCourse;
