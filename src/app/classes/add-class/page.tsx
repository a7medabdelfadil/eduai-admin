"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useCreateClasssMutation } from "@/features/Infrastructure/classApi";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

const AddClass = () => {
  const router = useRouter();
  const getStudyLevels = (currentLanguage: any) => {
    if (currentLanguage === "ar") {
      return {
        GRADE12: "الصف 12",
        GRADE9: "الصف 9",
        GRADE7: "الصف 7",
        GRADE8: "الصف 8",
        GRADE11: "الصف 11",
        GRADE10: "الصف 10",
        GRADE1: "الصف 1",
        GRADE2: "الصف 2",
        KG1: "روضة أطفال 1",
        GRADE5: "الصف 5",
        GRADE6: "الصف 6",
        GRADE3: "الصف 3",
        KG2: "روضة أطفال 2",
        GRADE4: "الصف 4",
      };
    } else if (currentLanguage === "en") {
      return {
        GRADE12: "Grade 12",
        GRADE9: "Grade 9",
        GRADE7: "Grade 7",
        GRADE8: "Grade 8",
        GRADE11: "Grade 11",
        GRADE10: "Grade 10",
        GRADE1: "Grade 1",
        GRADE2: "Grade 2",
        KG1: "Kindergarten 1",
        GRADE5: "Grade 5",
        GRADE6: "Grade 6",
        GRADE3: "Grade 3",
        KG2: "Kindergarten 2",
        GRADE4: "Grade 4",
      };
    } else if (currentLanguage === "fr") {
      return {
        GRADE12: "12ème année",
        GRADE9: "9ème année",
        GRADE7: "7ème année",
        GRADE8: "8ème année",
        GRADE11: "11ème année",
        GRADE10: "10ème année",
        GRADE1: "1ère année",
        GRADE2: "2ème année",
        KG1: "Maternelle 1",
        GRADE5: "5ème année",
        GRADE6: "6ème année",
        GRADE3: "3ème année",
        KG2: "Maternelle 2",
        GRADE4: "4ème année",
      };
    }
    return {};
  };

  const getStudyCategories = (
    currentLanguage: any,
  ): { [key: string]: string } => {
    if (currentLanguage === "ar") {
      return {
        KINDERGARTEN: "روضة أطفال",
        SECONDARY: "السنة الثانوية",
        PRIMARY: "السنة الابتدائية",
        PREPARATORY: "السنة الاعدادية",
      };
    } else if (currentLanguage === "en") {
      return {
        KINDERGARTEN: "Kindergarten",
        SECONDARY: "Secondary School",
        PRIMARY: "Primary School",
        PREPARATORY: "Preparatory School",
      };
    } else if (currentLanguage === "fr") {
      return {
        KINDERGARTEN: "Maternelle",
        SECONDARY: "École Secondaire",
        PRIMARY: "École Primaire",
        PREPARATORY: "École Préparatoire",
      };
    }
    return {};
  };

  const getJobCategories = (
    currentLanguage: any,
  ): { [key: string]: string } => {
    if (currentLanguage === "ar") {
      return {
        EDUCATIONAL: "التعليمية",
        ADMINISTRATIVE: "إداري",
        SPECIALIZED: "متخصص",
        FACILITIES_SERVICES: "خدمة المرافق",
      };
    } else if (currentLanguage === "en") {
      return {
        EDUCATIONAL: "Educational",
        ADMINISTRATIVE: "Administrative",
        SPECIALIZED: "Specialized",
        FACILITIES_SERVICES: "Facilities Services",
      };
    } else if (currentLanguage === "fr") {
      return {
        EDUCATIONAL: "Éducatif",
        ADMINISTRATIVE: "Administratif",
        SPECIALIZED: "Spécialisé",
        FACILITIES_SERVICES: "Services des Installations",
      };
    }
    return {};
  };
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
      nameEn: "Add Class",
      nameAr: "إضافة فصل",
      nameFr: "Ajouter une classe",
      href: "/classes/add-class",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createDriver, { isLoading }] = useCreateClasssMutation();

  const onSubmit = async (data: any) => {
    try {
      await createDriver(data).unwrap();
      toast.success("Class created successfully");
      router.push("/classes");
    } catch {
      toast.error("Failed to create Class: you may enter data incorrectly ");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const studyLevels = getStudyLevels(currentLanguage);
  const studyCategories = getStudyCategories(currentLanguage);
  const jobCategories = getJobCategories(currentLanguage);

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
              ? "Add Class"
              : currentLanguage === "ar"
                ? "إضافة فصل"
                : currentLanguage === "fr"
                  ? "Ajouter une classe"
                  : "Add Class"}{" "}
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
                <select
                  id="type"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("type", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "en"
                      ? "Select Job Category"
                      : currentLanguage === "ar"
                        ? "اختر فئة الوظيفة"
                        : currentLanguage === "fr"
                          ? "Sélectionner la catégorie d'emploi"
                          : "Select Job Category"}
                  </option>

                  {Object.entries(jobCategories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
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
                <select
                  id="classroomStudyLevel"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomStudyLevel", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "en"
                      ? "Select Study Level"
                      : currentLanguage === "ar"
                        ? "اختر المستوى الدراسي"
                        : currentLanguage === "fr"
                          ? "Sélectionner le niveau d'étude"
                          : "Select Study Level"}
                  </option>

                  {Object.entries(studyLevels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
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
                <select
                  id="classroomStudyStage"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomStudyStage", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "en"
                      ? "Select Study Category"
                      : currentLanguage === "ar"
                        ? "اختر فئة الدراسة"
                        : currentLanguage === "fr"
                          ? "Sélectionner la catégorie d'étude"
                          : "Select Study Category"}
                  </option>

                  {Object.entries(studyCategories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
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
                    ? "اضافة الفصل"
                    : currentLanguage === "fr"
                      ? "ajouter la classe"
                      : "Add Class"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddClass;
