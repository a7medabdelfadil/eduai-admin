"use client"
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useUpdateSemestersMutation } from "@/features/Organization-Setteings/semesterApi";
interface ParamsType {
  params: {
    semesterId: number;
  };
}

const UpdateSemester = ({ params }: ParamsType) => {
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
      nameEn: "Update Semester",
      nameAr: "تحديث فصل دراسي",
      nameFr: "Ajouter un semestre",
      href: `/organization-setting/semester/${params.semesterId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createSemester, { isLoading }] = useUpdateSemestersMutation();

  const onSubmit = async (data: any) => {
    try {
      await createSemester({formData:data, id: params.semesterId}).unwrap();
      toast.success("Semester updated successfully");
    } catch (err) {
      toast.error("Failed to update Semester");
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
      } mx-3 mt-[40px] grid h-[850px] items-center justify-center`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid h-[900px] items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:h-[800px] xl:w-[1000px]">
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
            <h1 className="font-sans text-[22px] font-semibold">
              {currentLanguage === "ar"
                ? "معلومات الفصل الدراسي"
                : currentLanguage === "fr"
                  ? "Informations sur le semestre"
                  : "Semester Information"}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
            <label
              htmlFor="code"
              className="grid font-sans text-[18px] font-semibold"
            >
              {currentLanguage === "ar"
                ? "بداية الفصل الدراسي"
                : currentLanguage === "fr"
                  ? "Le début du semestre"
                  : "The beginning of the semester"}

              <input
                id="code"
                type="date"
                className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
            <label
              htmlFor="about"
              className="grid font-sans text-[18px] font-semibold"
            >
              {currentLanguage === "ar"
                ? "نهاية الفصل الدراسي"
                : currentLanguage === "fr"
                  ? "La fin du semestre"
                  : "The end of the semester"}

              <input
                id="about"
                type="date"
                className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
    </div>
  </>
   );
}
 
export default UpdateSemester;
