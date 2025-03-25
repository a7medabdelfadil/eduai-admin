"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateParticipationsMutation } from "@/features/Document-Management/participationApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";

const AddNewParticipation = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Participation",
      nameAr: "مشاركة",
      nameFr: "Participation",
      href: "/document-management/certificate/participation",
    },
    {
      nameEn: "Add Participation",
      nameAr: "إضافة مشاركة",
      nameFr: "Ajouter une participation",
      href: "/document-management/certificate/add-new-participation",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createCertificate, { isLoading }] = useCreateParticipationsMutation();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
const { data: students, isLoading: isStudentsLoading } =
  useGetAllStudentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
    graduated: "false"
  });
  const onSubmit = async (formData: any) => {
    const data = new FormData();
    data.append(
      "certificate",
      JSON.stringify({
        userId: formData.userId,
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        title_fr: formData.title_fr,
        issueDate: formData.issueDate,
      }),
    );
    data.append("file", formData.file[0]); // Assuming 'endDate' is the file input

    try {
      await createCertificate(data).unwrap();
      toast.success("Certificate created successfully");
    } catch (err) {
      toast.error("Failed to create Certificate");
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
              <h1 className="font-sans text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "شهادات المشاركة"
                  : currentLanguage === "fr"
                    ? "Certificats de participation"
                    : "Participation Certificates"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              
              <label
                htmlFor="userId"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Student ID"
                  : currentLanguage === "ar"
                    ? "رقم الطالب"
                    : "ID de l'étudiant"}

                <select
                  id="userId"
                  {...register("userId", { required: true })}
                  className="h-full w-[400px] rounded-xl border px-4 py-3 text-[18px] outline-none max-[458px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Student"
                      : currentLanguage === "ar"
                        ? "اختر الطالب"
                        : "Sélectionner Étudiant"}
                  </option>
                  {students?.data.content.map(
                    (student: {
                      id: string | null | undefined;
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | null
                        | undefined;
                    }) => (
                      <option key={student.id} value={student.id ?? ""}>
                        {String(student.name)}
                      </option>
                    ),
                  )}
                </select>
                {errors.userId && (
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
                htmlFor="title_en"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Titre (en)"
                    : "Title (en)"}

                <input
                  id="title_en"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="title_ar"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالعربي)"
                  : currentLanguage === "fr"
                    ? "Titre (ar)"
                    : "Title (ar)"}
                <input
                  id="title_ar"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
              <label
                htmlFor="title_en"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "العنوان (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Titre (français)"
                    : "Title (fr)"}

                <input
                  id="title_fr"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="issueDate"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "فصل التخرج"
                  : currentLanguage === "fr"
                    ? "Semestre de Diplôme"
                    : "Graduation Semester"}
                <input
                  id="issueDate"
                  type="date"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("issueDate", { required: true })}
                />
                {errors.issueDate && (
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
                htmlFor="file"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "وثيقة"
                  : currentLanguage === "fr"
                    ? "Document"
                    : "Document"}
                <input
                  id="file"
                  type="file"
                  className="cursor-pointer opacity-0"
                  {...register("file", { required: true })}
                  onChange={handleFileChange}
                />
                <span className="-mt-8 w-[400px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                  <div className="flex">
                    <FaCloudUploadAlt className="mx-2 mt-1" />
                    {fileName
                      ? fileName
                      : currentLanguage === "en"
                        ? "Choose a file"
                        : currentLanguage === "ar"
                          ? "اختر ملف"
                          : currentLanguage === "fr"
                            ? "Choisir un fichier"
                            : "Choose a file"}
                  </div>
                </span>
                {errors.file && (
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
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
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
};

export default AddNewParticipation;
