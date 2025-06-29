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

interface EditDepartmentProps {
  params: {
    departmentId: string;
  };
}

const DepartmentId = ({ params }: EditDepartmentProps) => {
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
      nameEn: "Department",
      nameAr: "قسم",
      nameFr: "Département",
      href: "/organization-setting/department",
    },
    {
      nameEn: "Edit Department",
      nameAr: "تعديل القسم",
      nameFr: "Modifier le département",
      href: `/organization-setting/department/${params.departmentId}`,
    },
  ];
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading } = useGetBusByIdQuery(params.departmentId);

  useEffect(() => {
    if (data) {
      setValue("fullName_en", data.data.fullName_en);
      setValue("fullName_fr", data.data.fullName_fr);
      setValue("fullName_ar", data.data.fullName_en);
      setValue("desc_en", data.data.desc_en);
      setValue("desc_fr", data.data.desc_fr);
      setValue("desc_ar", data.data.desc_ar);
      setValue("abbr_en", data.data.abbr_en);
      setValue("abbr_fr", data.data.abbr_fr);
      setValue("abbr_ar", data.data.abbr_ar);
      setValue("employee", data.data.employee);
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
      await createBus({ formData: data, id: params.departmentId }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تعديل القسم بنجاح"
          : currentLanguage === "fr"
            ? "Département modifié avec succès"
            : "Department Edited Successfully",
      );
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
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
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Department"
              : currentLanguage === "ar"
                ? "تعديل القسم"
                : currentLanguage === "fr"
                  ? "Modifier le département"
                  : "Edit Department"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
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
                  ? "معلومات القسم"
                  : currentLanguage === "fr"
                    ? "Informations sur le département"
                    : "Department Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="fullName_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Nom complet (en anglais)"
                    : "Full Name (en)"}
                <input
                  id="fullName_en"
                  {...register("fullName_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.fullName_en && (
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
                htmlFor="fullName_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Nom complet (en français)"
                    : "Full Name (fr)"}
                <input
                  id="fullName_en"
                  {...register("fullName_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.fullName_en && (
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
                htmlFor="fullName_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالعربية)"
                  : currentLanguage === "fr"
                    ? "Nom complet (en arabe)"
                    : "Full Name (ar)"}
                <input
                  id="fullName_ar"
                  {...register("fullName_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.fullName_ar && (
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
              <label
                htmlFor="abbr_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاختصار (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en anglais)"
                    : "Abbreviation (en)"}
                <input
                  id="abbr_en"
                  {...register("abbr_en", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.abbr_en && (
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
                htmlFor="abbr_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاختصار (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en français)"
                    : "Abbreviation (fr)"}
                <input
                  id="abbr_fr"
                  {...register("abbr_fr", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.abbr_fr && (
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
                htmlFor="abbr_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاختصار (بالعربية)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en arabe)"
                    : "Abbreviation (ar)"}
                <input
                  id="abbr_ar"
                  {...register("abbr_ar", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.abbr_ar && (
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
                htmlFor="employee"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الموظف"
                  : currentLanguage === "fr"
                    ? "Employé"
                    : "Employee"}
                <select
                  id="employee"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("employee", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر الموظف"
                      : currentLanguage === "fr"
                        ? "Sélectionner un employé"
                        : "Select Employee"}
                  </option>
                </select>
                {errors.employee && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
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

export default DepartmentId;
