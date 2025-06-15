"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useUpdateClasssMutation,
  useGetClassByIdQuery,
} from "@/features/Infrastructure/classApi";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Container from "@/components/Container";

interface ViewDriverProps {
  params: {
    classId: string;
  };
}

const EditClass: React.FC<ViewDriverProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Classes",
      nameAr: "الفصل",
      nameFr: "Classe",
      href: "/classes",
    },
    {
      nameEn: "Edit Class",
      nameAr: "تعديل فصل",
      nameFr: "Modifier la Classe",
      href: `/classes/edit-class/${params.classId}`,
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { data: classs, isLoading: isgetting } = useGetClassByIdQuery(
    params.classId,
  );
  const [createDriver, { isLoading }] = useUpdateClasssMutation();

  useEffect(() => {
    if (classs) {
      setValue("buildingNumber", classs.data.buildingNumber);
      setValue("roomNumber", classs.data.roomNumber);
      setValue("floorNumber", classs.data.floorNumber);
      setValue("type", classs.data.type);
      setValue("maxCapacity", classs.data.maxCapacity);
      setValue("schoolId", classs.data.schoolId);
      setValue("classroomName", classs.data.classroomName);
      setValue("classroomNumber", classs.data.classroomNumber);
      setValue("classroomStudyLevel", classs.data.studyLevel);
      setValue("classroomStudyStage", classs.data.studyStage);
    }
  }, [classs, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await createDriver(data).unwrap();
      toast.success("Class created successfully");
    } catch (err) {
      toast.error("Failed to create Class: you may enter data incorrectly ");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isgetting)
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
              ? "Edit Class"
              : currentLanguage === "ar"
                ? "تعديل فصل"
                : currentLanguage === "fr"
                  ? "Modifier la Classe"
                  : "Edit Class"}{" "}
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
                  ? "معلومات الفصل"
                  : currentLanguage === "fr"
                    ? "Informations sur la classe"
                    : "Class Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="buildingNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم المبنى"
                  : currentLanguage === "fr"
                    ? "Numéro du bâtiment"
                    : "Building Number"}
                <input
                  id="buildingNumber"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("buildingNumber", { required: true })}
                />
                {errors.buildingNumber && (
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
                htmlFor="roomNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم الغرفة"
                  : currentLanguage === "fr"
                    ? "Numéro de la salle"
                    : "Room Number"}
                <input
                  id="roomNumber"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("roomNumber", { required: true })}
                />
                {errors.roomNumber && (
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
                htmlFor="floorNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم الطابق"
                  : currentLanguage === "fr"
                    ? "Numéro de l'étage"
                    : "Floor Number"}
                <input
                  id="floorNumber"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("floorNumber", { required: true })}
                />
                {errors.floorNumber && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="type" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "النوع"
                  : currentLanguage === "fr"
                    ? "Type"
                    : "Type"}
                <input
                  id="type"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("type", { required: true })}
                />
                {errors.type && (
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
                htmlFor="maxCapacity"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "القدرة القصوى"
                  : currentLanguage === "fr"
                    ? "Capacité maximale"
                    : "Max Capacity"}
                <input
                  id="maxCapacity"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("maxCapacity", { required: true })}
                />
                {errors.maxCapacity && (
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
                htmlFor="schoolId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "معرف المدرسة"
                  : currentLanguage === "fr"
                    ? "ID de l'école"
                    : "School Id"}
                <input
                  id="schoolId"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("schoolId", { required: true })}
                />
                {errors.schoolId && (
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
                htmlFor="classroomName"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الفصل"
                  : currentLanguage === "fr"
                    ? "Nom de la salle"
                    : "Classroom Name"}
                <input
                  id="classroomName"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomName", { required: true })}
                />
                {errors.classroomName && (
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
                htmlFor="classroomNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم الفصل"
                  : currentLanguage === "fr"
                    ? "Numéro de la classe"
                    : "Classroom Number"}
                <input
                  id="classroomNumber"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomNumber", { required: true })}
                />
                {errors.classroomNumber && (
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
                htmlFor="classroomStudyLevel"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "مستوى دراسة الفصل"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude de la salle"
                    : "Classroom Study Level"}
                <input
                  id="classroomStudyLevel"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomStudyLevel", { required: true })}
                />
                {errors.classroomStudyLevel && (
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
                htmlFor="classroomStudyStage"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "مرحلة دراسة الفصل"
                  : currentLanguage === "fr"
                    ? "Étape d'étude de la salle"
                    : "Classroom Study Stage"}
                <input
                  id="classroomStudyStage"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomStudyStage", { required: true })}
                />
                {errors.classroomStudyStage && (
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
              <button
                disabled={isLoading}
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {isLoading
                  ? currentLanguage === "ar"
                    ? "جاري الإضافة..."
                    : currentLanguage === "fr"
                      ? "Ajout en cours..."
                      : "Adding..."
                  : currentLanguage === "ar"
                    ? "تعديل الفصل"
                    : currentLanguage === "fr"
                      ? "Modifier la classe"
                      : "Edit Class"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditClass;
