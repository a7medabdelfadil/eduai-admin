"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateDepartmentsMutation } from "@/features/Organization-Setteings/departmentApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useGetAllRolesQuery } from "@/features/signupApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useRouter } from "next/navigation";
import { useGetAllEmployeesQuery } from "@/features/User-Management/employeeApi";
import Container from "@/components/Container";

const AddDepartment = () => {
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
      nameEn: "Add Department",
      nameAr: "إضافة قسم",
      nameFr: "Ajouter un département",
      href: "/organization-setting/department/add-department",
    },
  ];
  const router = useRouter();
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, isLoading: isRoles } = useGetAllRolesQuery(null);
  const {
    data: employees,
    error,
    refetch,
  } = useGetAllEmployeesQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createDepartment, { isLoading }] = useCreateDepartmentsMutation();

  const onSubmit = async (formData: any) => {
    try {
      const processedData = {
        ...formData,
        roles: Array.isArray(formData.roles)
          ? formData.roles
          : [formData.roles],
      };
      await createDepartment(processedData).unwrap();
      toast.success("Department created successfully");
      router.push("/organization-setting/department");
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isRoles)
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
              ? "Add Department"
              : currentLanguage === "ar"
                ? "إضافة قسم"
                : currentLanguage === "fr"
                  ? "Ajouter un département"
                  : "Add Department"}{" "}
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
                  ? "معلومات القسم"
                  : currentLanguage === "fr"
                    ? "Informations sur le département"
                    : "Department Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="name_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Nom complet (anglais)"
                    : "Full Name (English)"}
                <input
                  id="name_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_en", { required: true })}
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
              <label
                htmlFor="name_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Nom Complet (français)"
                    : "Full Name (French)"}
                <input
                  id="name_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_fr", { required: true })}
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
              <label
                htmlFor="name_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم الكامل (بالعربي)"
                  : currentLanguage === "fr"
                    ? "Nom Complet (en arabe)"
                    : "Full Name (in Arabic)"}
                <input
                  id="name_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_ar", { required: true })}
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
              <label
                htmlFor="description_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Description (en anglais)"
                    : "Description (English)"}
                <input
                  id="description_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("description_en", { required: true })}
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
              <label
                htmlFor="description_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Description (Français)"
                    : "Description (French)"}

                <input
                  id="description_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("description_fr", { required: true })}
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
                htmlFor="description_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف (بالعربي)"
                  : currentLanguage === "fr"
                    ? "Description (en arabe)"
                    : "Description (in Arabic)"}
                <input
                  id="description_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("description_ar", { required: true })}
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
              <label
                htmlFor="abbreviation_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاختصار (بالإنجليزي)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en anglais)"
                    : "Abbreviation (in English)"}
                <input
                  id="abbreviation_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("abbreviation_en", { required: true })}
                />
                {errors.abbreviation_en && (
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
                htmlFor="abbreviation_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاختصار (بالفرنسي)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en français)"
                    : "Abbreviation (in French)"}

                <input
                  id="abbreviation_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("abbreviation_fr", { required: true })}
                />
                {errors.abbreviation_fr && (
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
                htmlFor="abbreviation_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اختصار (بالعربي)"
                  : currentLanguage === "fr"
                    ? "Abréviation (en arabe)"
                    : "Abbreviation (in Arabic)"}
                <input
                  id="abbreviation_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("abbreviation_ar", { required: true })}
                />
                {errors.abbreviation_ar && (
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
                htmlFor="headId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "المعرف الرئيسي"
                  : currentLanguage === "fr"
                    ? "ID du Responsable"
                    : "HeadId"}

                <select
                  id="headId"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("headId", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر موظفًا"
                      : currentLanguage === "fr"
                        ? "Sélectionner un employé"
                        : "Select an employee"}
                  </option>
                  {employees?.data?.content?.map((employee: any) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>

                {errors.headId && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="roles" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "حدد الدور"
                  : currentLanguage === "fr"
                    ? "sélectionner le rôle"
                    : "Select Role"}
                <select
                  defaultValue=""
                  id="roles"
                  {...register("roles", { required: true })}
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "حدد الدور"
                      : currentLanguage === "fr"
                        ? "sélectionner le rôle"
                        : "Select Role"}
                  </option>
                  {data &&
                    Object.entries(data.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.roles && (
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

export default AddDepartment;
