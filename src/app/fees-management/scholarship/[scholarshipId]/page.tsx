"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import {
  useUpdateScholarshipMutation,
  useGetScholarshipByIdQuery,
} from "@/features/Financial/feesApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { useRouter } from "next/navigation";

// Define a Zod schema that matches your API's expected data structure
const scholarshipSchema = z
  .object({
    studentId: z.string().nonempty("Student ID is required"),
    scholarshipName: z.string().nonempty("Scholarship Name is required"),
    scholarshipType: z.string().nonempty("Scholarship Type is required"),
    paidInvoices: z.array(z.string()),
    startDate: z.string().nonempty("Start Date is required"),
    expirationDate: z.string().nonempty("Expiration Date is required"),
    file: z.any().optional(),
  })
  .refine(data => new Date(data.expirationDate) >= new Date(data.startDate), {
    message: "Expiration date must be on or after the start date",
    path: ["expirationDate"], // This will attach the error to the expirationDate field
  });

const EditScholarship = ({ params }: { params: { scholarshipId: number } }) => {
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
      nameEn: "Edit scholarship",
      nameAr: "تعديل منحة دراسية",
      nameFr: "Ajouter des Bourse d'étude",
      href: `/fees-management/scholarship/${params.scholarshipId}`,
    },
  ];

  const router = useRouter();
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data: scholarship, isLoading: isScholarshipLoading } =
    useGetScholarshipByIdQuery(params.scholarshipId);

  const {
    register,
    handleSubmit,
    reset,
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

  const [updateScholarship, { isLoading }] = useUpdateScholarshipMutation();
  const { data: students, isLoading: isStudentsLoading } =
    useGetAllStudentsQuery({
      archived: "false",
      page: 0,
      size: 1000000,
      graduated: "false",
    });

  // Pre-fill form when scholarship data is loaded
  useEffect(() => {
    if (scholarship?.data) {
      reset({
        studentId: scholarship.data.studentId.toString(),
        scholarshipName: scholarship.data.scholarshipName,
        scholarshipType: scholarship.data.scholarshipType,
        paidInvoices: scholarship.data.paidInvoices,
        startDate: scholarship.data.startDate,
        expirationDate: scholarship.data.expirationDate,
      });
    }
  }, [scholarship, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateScholarship({
        id: params.scholarshipId,
        formData: {
          studentId: data.studentId,
          scholarshipName: data.scholarshipName,
          scholarshipType: data.scholarshipType,
          paidInvoices: data.paidInvoices,
          startDate: data.startDate,
          expirationDate: data.expirationDate,
        },
      }).unwrap();
      toast.success("Scholarship updated successfully");
      router.back();
    } catch (err) {
      toast.error("Failed to update scholarship");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isScholarshipLoading || isStudentsLoading)
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
        className={`${
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
          <div className="grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
            <div className="flex items-center justify-start gap-2">
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Scholarship Information"
                  : currentLanguage === "ar"
                    ? "معلومات المنحة الدراسية"
                    : "Informations sur la bourse"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
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
                  className="h-full w-[400px] rounded-xl border px-4 py-3 text-[18px] text-black outline-none max-[458px]:w-[350px]"
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
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.expirationDate && (
                  <span className="text-error">
                    {errors.expirationDate.message}
                  </span>
                )}
              </label>

              {/* Paid Invoices Checkboxes */}
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
                    ? "Update Scholarship"
                    : currentLanguage === "ar"
                      ? "تحديث المنحة الدراسية"
                      : "Mettre à jour la bourse"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditScholarship;
