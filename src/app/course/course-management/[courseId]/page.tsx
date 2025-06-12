"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import {
  useUpdateBussMutation,
  useGetBusByIdQuery,
} from "@/features/Infrastructure/busApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

interface EditCourseProps {
  params: {
    courseId: string;
  };
}

const EditCourse = ({ params }: EditCourseProps) => {
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
      nameEn: "Edit Course",
      nameAr: "تعديل الدورة",
      nameFr: "Modifier le cours",
      href: `/course/course-management/${params.courseId}`,
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, error, isLoading } = useGetBusByIdQuery(params.courseId);

  useEffect(() => {
    if (data) {
      setValue("courseCode", data.data.courseCode);
      setValue("course_en", data.data.course_en);
      setValue("course_fr", data.data.course_fr);
      setValue("course_ar", data.data.course_ar);
      setValue("desc_en", data.data.desc_en);
      setValue("desc_fr", data.data.desc_fr);
      setValue("desc_ar", data.data.desc_ar);
    }
  }, [data, error]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [createBus, { isLoading: isCreating }] = useUpdateBussMutation();

  const onSubmit = async (data: any) => {
    try {
      await createBus({ formData: data, id: params.courseId }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تعديل الدورة بنجاح"
          : currentLanguage === "fr"
            ? "Cours modifié avec succès"
            : "Course Edited successfully",
      );
    } catch (err) {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في تعديل الدورة"
          : currentLanguage === "fr"
            ? "Échec de la modification du cours"
            : "Failed to edit course",
      );
    }
  };

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
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
              ? "Edit Course"
              : currentLanguage === "ar"
                ? "تعديل الدورة"
                : currentLanguage === "fr"
                  ? "Modifier le cours"
                  : "Edit Course"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex justify-center items-center w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
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
              <label
                htmlFor="courseCode"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رمز الدورة"
                  : currentLanguage === "fr"
                    ? "Code du cours"
                    : "Course Code"}
                <input
                  id="courseCode"
                  {...register("courseCode", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.courseCode && (
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
                htmlFor="code_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الدورة (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Nom du cours (en anglais)"
                    : "Course Name (en)"}
                <input
                  id="code_en"
                  {...register("code_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.code_en && (
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
                htmlFor="code_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الدورة (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Nom du cours (en français)"
                    : "Course Name (fr)"}
                <input
                  id="code_fr"
                  {...register("code_fr", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.code_fr && (
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
                htmlFor="code_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الدورة (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Nom du cours (en français)"
                    : "Course Name (fr)"}
                <input
                  id="code_ar"
                  {...register("code_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.code_ar && (
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
                htmlFor="desc_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Description (en anglais)"
                    : "Description (en)"}
                <input
                  id="desc_en"
                  {...register("desc_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.desc_en && (
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
                htmlFor="desc_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Description (en français)"
                    : "Description (fr)"}
                <input
                  id="desc_fr"
                  {...register("desc_fr", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.desc_fr && (
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
                htmlFor="desc_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالعربية)"
                  : currentLanguage === "fr"
                    ? "Description (en arabe)"
                    : "Description (ar)"}
                <input
                  id="desc_ar"
                  {...register("desc_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.desc_ar && (
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
              {isCreating ? (
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

export default EditCourse;
