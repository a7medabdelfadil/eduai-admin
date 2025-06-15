"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import {
  useGetPositionByIdQuery,
  useUpdatePositionsMutation,
} from "@/features/Organization-Setteings/positionApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useGetAllPositionsQuery } from "@/features/User-Management/driverApi";
import Container from "@/components/Container";

interface ParamsType {
  params: {
    positionId: number;
  };
}

const AddPosition = ({ params }: ParamsType) => {
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
      nameEn: "Edit Position",
      nameAr: "تعديل المنصب",
      nameFr: "Modifier le poste",
      href: "/organization-setting/position",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  // Fetch position by ID
  const { data: positionData, isLoading: isPositionLoading } =
    useGetPositionByIdQuery(params.positionId);
  const { data: allPositions, isLoading: isAllPositionsLoading } =
    useGetAllPositionsQuery(null);

  const {
    register,
    handleSubmit,
    setValue, // Use this to set field values
    formState: { errors },
  } = useForm();

  const [updatePosition, { isLoading }] = useUpdatePositionsMutation();

  // Populate form fields with position data when available
  useEffect(() => {
    if (positionData) {
      setValue("departmentId", positionData.data.departmentId);
      setValue("title_en", positionData.data.title_en);
      setValue("title_fr", positionData.data.title_fr);
      setValue("title_ar", positionData.data.title_ar);
    }
  }, [positionData, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await updatePosition({ formData: data, id: params.positionId }).unwrap();
      toast.success("Position updated successfully");
    } catch {
      toast.error("Failed to update position");
    }
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isPositionLoading || isAllPositionsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Position"
              : currentLanguage === "ar"
                ? "تعديل المنصب"
                : currentLanguage === "fr"
                  ? "Modifier le poste"
                  : "Edit Position"}{" "}
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
                  ? "معلومات الوظيفة"
                  : currentLanguage === "fr"
                    ? "Informations sur le poste"
                    : "Position Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="departmentId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "معرف القسم"
                  : currentLanguage === "fr"
                    ? "ID du Département"
                    : "Department Id"}

                <select
                  defaultValue=""
                  id="departmentId"
                  {...register("departmentId", { required: true })}
                  className={`border ${errors.departmentId ? "border-borderPrimary" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-[18px] text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Department Id"
                      : currentLanguage === "ar"
                        ? "اختر معرف الوظيفة"
                        : currentLanguage === "fr"
                          ? "Sélectionner l'ID de la position"
                          : "Select Region Id"}{" "}
                    {/* default */}
                  </option>
                  {allPositions &&
                    allPositions.data.content.map(
                      (
                        region: {
                          title: string;
                          id: string | number | readonly string[] | undefined;
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <option key={index} value={region.id}>
                          {region.title}
                        </option>
                      ),
                    )}
                </select>
                {errors.departmentId && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>

              {/* Other input fields */}
              <label
                htmlFor="title_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Titre (en anglais)"
                    : "Title (English)"}
                <input
                  id="title_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("title_en", { required: true })}
                />
                {errors.title_en && (
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
                htmlFor="title_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Titre (français)"
                    : "Title (français)"}
                <input
                  id="title_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("title_fr", { required: true })}
                />
                {errors.title_fr && (
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
                htmlFor="title_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالعربي)"
                  : currentLanguage === "fr"
                    ? "Titre (arabe)"
                    : "Title (in Arabic)"}
                <input
                  id="title_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("title_ar", { required: true })}
                />
                {errors.title_ar && (
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

export default AddPosition;
