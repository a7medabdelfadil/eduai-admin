"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateProfessionalsMutation } from "@/features/Document-Management/professionalApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import Container from "@/components/Container";

const AddNewProfessional = () => {
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
      nameEn: "Professional Development",
      nameAr: "التطوير المهني",
      nameFr: "Développement professionnel",
      href: "/document-management/certificate/professional-development",
    },
    {
      nameEn: "Add Professionals",
      nameAr: "التطوير المهني",
      nameFr: "Ajouter des professionnels",
      href: "/document-management/certificate/add-new-professional",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: students, isLoading: isStudentsLoading } =
    useGetAllStudentsQuery({
      archived: "false",
      page: 0,
      size: 1000000,
      graduated: "false",
    });
  const [createCertificate, { isLoading }] = useCreateProfessionalsMutation();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const onSubmit = async (formData: any) => {
    const data = new FormData();
    data.append(
      "certificate",
      JSON.stringify({
        userId: formData.userId,
        type: formData.type,
        issueDate: formData.issueDate,
      }),
    );
    // Corrected: use formData.endData instead of formData.endDate
    data.append("file", formData.endData[0]);

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
      <Container>
         <div className="mb-8 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {currentLanguage === "en"
              ? "Add Achievement Certificates"
              : currentLanguage === "ar"
                ? "إضافة شهادات الإنجاز"
                : currentLanguage === "fr"
                  ? "Ajouter des certificats de réussite"
                  : "Add Achievement Certificates"}{" "}
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
                  ? "الشهادات المهنية"
                  : currentLanguage === "fr"
                    ? "Certificats Professionnels"
                    : "Professional Certificates"}
              </h1>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="userId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Student ID"
                  : currentLanguage === "ar"
                    ? "رقم الطالب"
                    : "ID de l'étudiant"}
                <select
                  id="userId"
                  {...register("userId", { required: true })}
                  className="h-full w-full rounded-xl border px-4 py-3 text-[18px] outline-none max-[458px]:w-[350px]"
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
              <label htmlFor="type" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "النوع"
                  : currentLanguage === "fr"
                    ? "Type"
                    : "Type"}
                <input
                  id="type"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="issueDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "فصل التخرج"
                  : currentLanguage === "fr"
                    ? "Semestre de graduation"
                    : "Graduation Semester"}
                <input
                  id="issueDate"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="endData"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "وثيقة"
                  : currentLanguage === "fr"
                    ? "Document"
                    : "Document"}
                <input
                  id="endData"
                  type="file"
                  className="cursor-pointer opacity-0"
                  {...register("endData", { required: true })}
                  onChange={handleFileChange}
                />
                <span className="-mt-8 w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
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
                {errors.endData && (
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
      </Container>
    </>
  );
};

export default AddNewProfessional;
