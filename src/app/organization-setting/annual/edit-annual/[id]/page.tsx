"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetAnnualLeaveByIdQuery,
  useUpdateAnnualLeaveMutation,
} from "@/features/Organization-Setteings/annualApi";
import { useEffect } from "react";

const EditAnnualLeave = () => {
  const { id } = useParams();
  const router = useRouter();

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const { data, isLoading, isError } = useGetAnnualLeaveByIdQuery(id);
  const [updateAnnualLeave] = useUpdateAnnualLeaveMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (formData: any) => {
    try {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        toast.error(
          currentLanguage === "ar"
            ? "تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البداية"
            : currentLanguage === "fr"
              ? "La date de fin ne peut pas être antérieure à la date de début"
              : "End date cannot be earlier than start date",
        );
        return;
      }

      await updateAnnualLeave({ id, formData }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث الإجازة بنجاح!"
          : currentLanguage === "fr"
            ? "Le congé a été mis à jour avec succès !"
            : "Annual leave updated successfully!",
      );
      router.push("/organization-setting/annual");
    } catch (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        (currentLanguage === "ar"
          ? "حدث خطأ أثناء العملية."
          : currentLanguage === "fr"
            ? "Une erreur s'est produite."
            : "An error occurred.");
      toast.error(errorMessage);
    }
  };

  // fill form once data is loaded
  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title,
        description: data.data.description,
        startDate: data.data.startDate,
        endDate: data.data.endDate,
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        {currentLanguage === "ar"
          ? "فشل في تحميل بيانات الإجازة"
          : currentLanguage === "fr"
            ? "Échec du chargement des données du congé"
            : "Failed to load annual leave data"}
      </div>
    );
  }

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
      nameFr: "Modifier un congé annuel",
      href: `/organization-setting/annual/edit-annual/${id}`,
    },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Annual Leave"
              : currentLanguage === "ar"
                ? "إضافة إجازة سنوية جديدة"
                : currentLanguage === "fr"
                  ? "Modifier un congé annuel"
                  : "Edit Annual Leave"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-full items-center justify-center"
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="mb-6 flex items-center justify-start gap-2">
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
                  ? "إضافة إجازة سنوية جديدة"
                  : currentLanguage === "fr"
                    ? "Modifier un congé annuel"
                    : "Edit Annual Leave"}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              {/* Title */}
              <label htmlFor="title" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "عنوان الإجازة"
                  : currentLanguage === "fr"
                    ? "Titre du congé"
                    : "Leave Title"}
                <input
                  id="title"
                  type="text"
                  {...register("title", {
                    required: {
                      value: true,
                      message:
                        currentLanguage === "ar"
                          ? "عنوان الإجازة مطلوب"
                          : currentLanguage === "fr"
                            ? "Le titre est requis"
                            : "Title is required",
                    },
                  })}
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل عنوان الإجازة"
                      : currentLanguage === "fr"
                        ? "Entrez le titre"
                        : "Enter title"
                  }
                />
                {errors.title?.message && (
                  <span className="text-sm text-red-500">
                    {String(errors.title.message)}
                  </span>
                )}
              </label>

              {/* Description */}
              <label
                htmlFor="description"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الوصف"
                  : currentLanguage === "fr"
                    ? "Description"
                    : "Description"}
                <input
                  id="description"
                  type="text"
                  {...register("description", {
                    required: {
                      value: true,
                      message:
                        currentLanguage === "ar"
                          ? "الوصف مطلوب"
                          : currentLanguage === "fr"
                            ? "La description est requise"
                            : "Description is required",
                    },
                  })}
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل وصف الإجازة"
                      : currentLanguage === "fr"
                        ? "Entrez la description"
                        : "Enter description"
                  }
                />
                {errors.description && (
                  <span className="text-sm text-red-500">
                    {String(errors.description?.message)}
                  </span>
                )}
              </label>

              {/* Start Date */}
              <label
                htmlFor="startDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ البداية"
                  : currentLanguage === "fr"
                    ? "Date de début"
                    : "Start Date"}
                <input
                  id="startDate"
                  type="date"
                  {...register("startDate", {
                    required: {
                      value: true,
                      message:
                        currentLanguage === "ar"
                          ? "تاريخ البداية مطلوب"
                          : currentLanguage === "fr"
                            ? "La date de début est requise"
                            : "Start date is required",
                    },
                  })}
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none"
                />
                {errors.startDate && (
                  <span className="text-sm text-red-500">
                    {String(errors.startDate.message)}
                  </span>
                )}
              </label>

              {/* End Date */}
              <label
                htmlFor="endDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ الانتهاء"
                  : currentLanguage === "fr"
                    ? "Date de fin"
                    : "End Date"}
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate", {
                    required: {
                      value: true,
                      message:
                        currentLanguage === "ar"
                          ? "تاريخ الانتهاء مطلوب"
                          : currentLanguage === "fr"
                            ? "La date de fin est requise"
                            : "End date is required",
                    },
                  })}
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none"
                />
                {errors.endDate && (
                  <span className="text-sm text-red-500">
                    {String(errors.endDate.message)}
                  </span>
                )}
              </label>
            </div>

            <div className="mt-4 flex justify-center text-center">
              <button
                type="submit"
                className="w-fit rounded-xl bg-primary px-6 py-2 text-[18px] text-white hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "تحديث"
                  : currentLanguage === "fr"
                    ? "Mettre à jour"
                    : "Update"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditAnnualLeave;
