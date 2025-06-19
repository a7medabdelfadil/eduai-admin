"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useCreateScholarshipMutation } from "@/features/Financial/feesApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import Container from "@/components/Container";

// Define a Zod schema that matches your API's expected data structure
const scholarshipSchema = z.object({
  studentId: z.string().nonempty("Student ID is required"),
  scholarshipName: z.string().nonempty("Scholarship Name is required"),
  scholarshipType: z.string().nonempty("Scholarship Type is required"),
  paidInvoices: z.array(z.string()),
  startDate: z.string().nonempty("Start Date is required"),
  expirationDate: z.string().nonempty("Expiration Date is required"),
  file: z.any().optional(),
});

const NewScholarship = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Add scholarship",
      nameAr: "إضافة منحة دراسية",
      nameFr: "Ajouter des Bourse d'étude",
      href: "/fees-management/new-scholarship",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      studentId: "",
      scholarshipName: "",
      scholarshipType: "",
      paidInvoices: [],
      startDate: "",
      expirationDate: "",
      file: null,
    },
  });

  const [createScholarship, { isLoading }] = useCreateScholarshipMutation();
  const { data: students, isLoading: isStudents } = useGetAllStudentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
    graduated: "false",
  });
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append(
      "request",
      JSON.stringify({
        studentId: data.studentId,
        scholarshipName: data.scholarshipName,
        scholarshipType: data.scholarshipType,
        paidInvoices: data.paidInvoices,
        startDate: data.startDate,
        expirationDate: data.expirationDate,
      }),
    );
    if (data.file) {
      formData.append("file", data.file[0]);
    }
    try {
      await createScholarship(formData).unwrap();
      toast.success("Scholarship created successfully");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "An error occurred",
      );
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
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add scholarship"
              : currentLanguage === "ar"
                ? "إضافة منحة دراسية"
                : currentLanguage === "fr"
                  ? "Ajouter des Bourse d'étude"
                  : "Add scholarship"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Scholarship Information"
                  : currentLanguage === "ar"
                    ? "معلومات المنحة الدراسية"
                    : "Informations sur la bourse"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              {/* Student ID Field */}
              <label
                htmlFor="studentId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Student ID"
                  : currentLanguage === "ar"
                    ? "رقم الطالب"
                    : "ID de l'étudiant"}

                <select
                  id="studentId"
                  {...register("studentId")}
                  className="h-full w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 text-[18px] text-textPrimary outline-none max-[458px]:w-[350px]"
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
                {errors.studentId && (
                  <span className="text-error">{errors.studentId.message}</span>
                )}
              </label>

              {/* Scholarship Name Field */}
              <label
                htmlFor="scholarshipName"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Scholarship Name"
                  : currentLanguage === "ar"
                    ? "اسم المنحة"
                    : "Nom de la bourse"}
                <input
                  id="scholarshipName"
                  {...register("scholarshipName")}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.scholarshipName && (
                  <span className="text-error">
                    {errors.scholarshipName.message}
                  </span>
                )}
              </label>

              {/* Scholarship Type Field */}
              <label
                htmlFor="scholarshipType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Scholarship Type"
                  : currentLanguage === "ar"
                    ? "نوع المنحة"
                    : "Type de bourse"}

                <select
                  id="scholarshipType"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 text-textPrimary outline-none max-[471px]:w-[350px]"
                  {...register("scholarshipType", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Scholarship Type"
                      : currentLanguage === "ar"
                        ? "اختر نوع المنحة"
                        : "Type de bourse"}
                  </option>
                  <option value="PARTIAL">
                    {currentLanguage === "en" ? "Partial" : "جزئي"}
                  </option>
                  <option value="FULL">
                    {currentLanguage === "en" ? "Full" : "كامل"}
                  </option>
                </select>
                {errors.scholarshipType && (
                  <span className="text-error">
                    {errors.scholarshipType.message}
                  </span>
                )}
              </label>

              {/* Paid Invoices Checkboxes */}

              {/* Start Date Field */}
              <label
                htmlFor="startDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Start Date"
                  : currentLanguage === "ar"
                    ? "تاريخ البدء"
                    : "Date de début"}
                <input
                  id="startDate"
                  {...register("startDate")}
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.startDate && (
                  <span className="text-error">{errors.startDate.message}</span>
                )}
              </label>

              {/* Expiration Date Field */}
              <label
                htmlFor="expirationDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Expiration Date"
                  : currentLanguage === "ar"
                    ? "تاريخ الانتهاء"
                    : "Date d'expiration"}
                <input
                  id="expirationDate"
                  {...register("expirationDate")}
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.expirationDate && (
                  <span className="text-error">
                    {errors.expirationDate.message}
                  </span>
                )}
              </label>
              <div className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Paid Invoices"
                  : currentLanguage === "ar"
                    ? "الفواتير المدفوعة"
                    : "Factures payées"}
                <div className="grid grid-cols-4 gap-4">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="TUITION"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Tuition"
                      : currentLanguage === "ar"
                        ? "الرسوم الدراسية"
                        : "Frais de scolarité"}
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="UNIFORM"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Uniform"
                      : currentLanguage === "ar"
                        ? "الزي الدراسي"
                        : "Uniforme"}
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="ACTIVITY"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Activity"
                      : currentLanguage === "ar"
                        ? "الحضور"
                        : "Activité"}
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="MATERIAL"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Material"
                      : currentLanguage === "ar"
                        ? "المواد الدراسية"
                        : "Matériel"}
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="UNIFORM"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Uniform"
                      : currentLanguage === "ar"
                        ? "الرسوم الدراسية"
                        : "Uniforme"}
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      value="TRANSPORT"
                      {...register("paidInvoices")}
                    />
                    {currentLanguage === "en"
                      ? "Transport"
                      : currentLanguage === "ar"
                        ? "النقل"
                        : "Transport"}
                  </label>
                </div>
              </div>

              {/* File Upload Field */}
              <label htmlFor="file" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Upload File"
                  : currentLanguage === "ar"
                    ? "تحميل ملف"
                    : "Télécharger le fichier"}
                <input
                  id="file"
                  {...register("file")}
                  type="file"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.file && (
                  <span className="text-error">{errors.file.message}</span>
                )}
              </label>
            </div>
            <div className="flex justify-center text-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Add Scholarship"
                    : currentLanguage === "ar"
                      ? "إضافة منحة دراسية"
                      : "Ajouter une bourse"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default NewScholarship;
