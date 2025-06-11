"use client";
import Spinner from "@/components/spinner";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import {
  useGetDriversQuery,
  useUpdateDriversMutation,
} from "@/features/User-Management/driverApi";
import { useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import Container from "@/components/Container";

interface ViewEmpolyeeProps {
  params: {
    employeeId: string;
  };
}

const EditEmployee: React.FC<ViewEmpolyeeProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Employee",
      nameAr: "موظف",
      nameFr: "Employé",
      href: "/employee",
    },
    {
      nameEn: "Edit Employee",
      nameAr: "تعديل الموظف",
      nameFr: "Modifier l'employé",
      href: `/edit-employee/${params.employeeId}`,
    },
  ];
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const { data, error, isLoading } = useGetDriversQuery(params.employeeId);
  const [createDriver, { isLoading: isUpdating }] = useUpdateDriversMutation();
  const { data: rigiond } = useGetAllReginionIDQuery(null);
  const { data: nationalityData } = useGetAllNationalitysQuery(null);
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (data) {
      setValue("email", data.data.email);
      setValue("nid", data.data.nid);
      setValue("about", data.data.about);
      setValue("number", data.data.number);
      setValue("salary", data.data.salary);
      setValue("name_en", data.data.name_en);
      setValue("name_ar", data.data.name_ar);
      setValue("name_fr", data.data.name_fr);
      setValue("positionId", data.data.positionId);
    }
  }, [data, error]);

  const onSubmit = async (data: any) => {
    try {
      await createDriver({ formData: data, id: params.employeeId }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث السائق بنجاح"
          : currentLanguage === "fr"
            ? "Chauffeur mis à jour avec succès"
            : "Driver Updated successfully",
      );
    } catch (err) {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في تحديث الموظف"
          : currentLanguage === "fr"
            ? "Échec de la mise à jour de l'employé"
            : "Failed to Update Employee",
      );
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
        <div className="mb-8 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Employee"
              : currentLanguage === "ar"
                ? "تعديل الموظف"
                : currentLanguage === "fr"
                  ? "Modifier l'employé"
                  : "Edit Employee"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
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
                  ? "معلومات الموظف"
                  : currentLanguage === "fr"
                    ? "Informations sur l'employé"
                    : "Employee Information"}
              </h1>
            </div>
            <div className="px-6 pt-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label htmlFor="email" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "البريد الإلكتروني"
                  : currentLanguage === "fr"
                    ? "Email"
                    : "Email"}
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="nid" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الرقم القومي"
                  : currentLanguage === "fr"
                    ? "N° de pièce d'identité"
                    : "NID"}
                <input
                  id="nid"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nid", { required: true })}
                />
                {errors.nid && (
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
                htmlFor="gender"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الجنس"
                  : currentLanguage === "fr"
                    ? "Sexe"
                    : "Gender"}
                <select
                  id="gender"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("gender", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر الجنس"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le sexe"
                        : "Select gender"}
                  </option>
                  <option value="MALE">
                    {currentLanguage === "ar"
                      ? "ذكر"
                      : currentLanguage === "fr"
                        ? "Homme"
                        : "Male"}
                  </option>
                  <option value="FEMALE">
                    {currentLanguage === "ar"
                      ? "أنثى"
                      : currentLanguage === "fr"
                        ? "Femme"
                        : "Female"}
                  </option>
                </select>
                {errors.gender && (
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
                htmlFor="religion"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الدين"
                  : currentLanguage === "fr"
                    ? "Religion"
                    : "Religion"}
                <select
                  id="religion"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("religion", { required: true })}
                >
                  <option value="OTHERS">
                    {currentLanguage === "ar"
                      ? "أخرى"
                      : currentLanguage === "fr"
                        ? "Autres"
                        : "Others"}
                  </option>
                </select>
                {errors.religion && (
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
            <div className="px-6 pt-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="name_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (بالإنجليزية)"
                  : currentLanguage === "fr"
                    ? "Nom (EN)"
                    : "Name (EN)"}
                <input
                  id="name_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="name_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (بالعربية)"
                  : currentLanguage === "fr"
                    ? "Nom (AR)"
                    : "Name (AR)"}
                <input
                  id="name_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="name_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (بالفرنسية)"
                  : currentLanguage === "fr"
                    ? "Nom (FR)"
                    : "Name (FR)"}
                <input
                  id="name_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                htmlFor="regionId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "معرف المنطقة"
                  : currentLanguage === "fr"
                    ? "ID de la région"
                    : "RegionId"}
                <select
                  defaultValue=""
                  id="regionId"
                  {...register("regionId", { required: true })}
                  className="h-full w-full rounded-xl border border-borderPrimary px-4 py-3 text-[18px] text-[#000000] outline-none max-[458px]:w-[350px]"
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر معرف المنطقة"
                      : currentLanguage === "fr"
                        ? "Sélectionnez l'ID de région"
                        : "Select Region Id"}
                  </option>
                  {rigiond &&
                    rigiond.data.map(
                      (
                        rigion: {
                          id: string | number | readonly string[] | undefined;
                          name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <option key={index} value={rigion.id}>
                          {String(rigion.name)}
                        </option>
                      ),
                    )}
                </select>
                {errors.regionId && (
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
                htmlFor="nationality"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "جنسيتك"
                  : currentLanguage === "fr"
                    ? "Votre nationalité"
                    : "Your Nationality"}
                <select
                  id="nationality"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nationality", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر الجنسية"
                      : currentLanguage === "fr"
                        ? "Sélectionnez la nationalité"
                        : "Select Nationality"}
                  </option>
                  {nationalityData &&
                    Object.entries(nationalityData.data).map(([key, value]) => (
                      <option key={key} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.nationality && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "حول"
                  : currentLanguage === "fr"
                    ? "À propos"
                    : "About"}
                <input
                  id="about"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("about", { required: true })}
                />
                {errors.about && (
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
                htmlFor="birthDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ الميلاد"
                  : currentLanguage === "fr"
                    ? "Date de naissance"
                    : "Date Of Birth"}
                <input
                  id="birthDate"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("birthDate", {
                    required: true,
                    validate: value => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      const age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();

                      // Adjust age if the birth date hasn't been reached yet this year
                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        return age > 20;
                      }

                      return age >= 20;
                    },
                  })}
                />
                {errors.birthDate && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? errors.birthDate.type === "validate"
                        ? "The Employee Must be older than 20"
                        : "This field is required"
                      : currentLanguage === "ar"
                        ? errors.birthDate.type === "validate"
                          ? "يجب أن يكون عمر الموظف أكبر من 20 عامًا"
                          : "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? errors.birthDate.type === "validate"
                            ? "L'employé doit avoir plus de 20 ans"
                            : "Ce champ est requis"
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="qualification"
                className="grid items-center text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اختر المؤهل"
                  : currentLanguage === "fr"
                    ? "Sélectionnez le diplôme"
                    : "Select Qualification"}
                <select
                  defaultValue=""
                  id="qualification"
                  {...register("qualification", { required: true })}
                  className="h-[55px] w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر المؤهل"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le diplôme"
                        : "Select qualification"}
                  </option>
                  <option value="HIGH_SCHOOL_DIPLOMA">
                    {currentLanguage === "ar"
                      ? "شهادة الثانوية العامة"
                      : currentLanguage === "fr"
                        ? "Diplôme de baccalauréat"
                        : "High School Diploma"}
                  </option>
                  <option value="MASTER_DEGREE">
                    {currentLanguage === "ar"
                      ? "درجة الماجستير"
                      : currentLanguage === "fr"
                        ? "Master"
                        : "Master Degree"}
                  </option>
                  <option value="BACHELOR_DEGREE">
                    {currentLanguage === "ar"
                      ? "درجة البكالوريوس"
                      : currentLanguage === "fr"
                        ? "Licence"
                        : "Bachelor Degree"}
                  </option>
                  <option value="DOCTORATE_DEGREE">
                    {currentLanguage === "ar"
                      ? "درجة الدكتوراه"
                      : currentLanguage === "fr"
                        ? "Doctorat"
                        : "Doctorate Degree"}
                  </option>
                </select>
                {errors.qualification && (
                  <span className="text-[18px] text-error">
                    {currentLanguage === "ar"
                      ? "المؤهل مطلوب"
                      : currentLanguage === "fr"
                        ? "La qualification est requise"
                        : "Qualification is Required"}
                  </span>
                )}
              </label>
            </div>
            <div className="px-6 pt-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="hireDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ التوظيف"
                  : currentLanguage === "fr"
                    ? "Date d'embauche"
                    : "hireDate"}
                <input
                  id="hireDate"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("hireDate", { required: true })}
                />
                {errors.hireDate && (
                  <span className="text-error">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est requis"
                        : "This field is required"}
                  </span>
                )}
              </label>
              <PhoneNumberInput
                countryCodeData={countryCode.data}
                currentLanguage="en"
                label="Your Phone Number"
                register={register}
                errors={errors}
                control={control}
              />
              <label
                htmlFor="positionId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "معرف الوظيفة"
                  : currentLanguage === "fr"
                    ? "ID du poste"
                    : "Position Id"}
                <input
                  id="positionId"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("positionId", { required: true })}
                />
                {errors.positionId && (
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
                htmlFor="employeeStatus"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "حالة الموظف"
                  : currentLanguage === "fr"
                    ? "Statut de l'employé"
                    : "Employee Status"}
                <select
                  id="employeeStatus"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("employeeStatus", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر حالة الموظف"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le statut de l'employé"
                        : "Select Employee Status"}
                  </option>
                  <option value="ACTIVE">
                    {currentLanguage === "ar"
                      ? "نشط"
                      : currentLanguage === "fr"
                        ? "Actif"
                        : "Active"}
                  </option>
                  <option value="ON_BREAK">
                    {currentLanguage === "ar"
                      ? "استراحة"
                      : currentLanguage === "fr"
                        ? "En pause"
                        : "On Break"}
                  </option>
                  <option value="STAY_OUT">
                    {currentLanguage === "ar"
                      ? "مغادر"
                      : currentLanguage === "fr"
                        ? "Absent"
                        : "Stay Out"}
                  </option>
                </select>
                {errors.employeeStatus && (
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
                htmlFor="employeeType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "نوع الموظف"
                  : currentLanguage === "fr"
                    ? "Type d'employé"
                    : "Employee Type"}
                <select
                  id="employeeType"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("employeeType", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر نوع الموظف"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le type d'employé"
                        : "Select Employee Type"}
                  </option>
                  <option value="EMPLOYEE">
                    {currentLanguage === "ar"
                      ? "موظف"
                      : currentLanguage === "fr"
                        ? "EMPLOYÉ"
                        : "EMPLOYEE"}
                  </option>
                  <option value="WORKER">
                    {currentLanguage === "ar"
                      ? "عامل"
                      : currentLanguage === "fr"
                        ? "TRAVAILLEUR"
                        : "WORKER"}
                  </option>
                  <option value="DRIVER">
                    {currentLanguage === "ar"
                      ? "سائق"
                      : currentLanguage === "fr"
                        ? "CHAUFFEUR"
                        : "DRIVER"}
                  </option>
                </select>
                {errors.employeeType && (
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
                htmlFor="salary"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الراتب"
                  : currentLanguage === "fr"
                    ? "Salaire"
                    : "Salary"}
                <input
                  id="salary"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("salary", { required: true })}
                />
                {errors.salary && (
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
            <div className="flex pb-6 justify-center text-center">
              {isUpdating ? (
                <Spinner />
              ) : (
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "ar"
                    ? "تعديل الموظف"
                    : currentLanguage === "fr"
                      ? "Modifier l'employé"
                      : "Edit Employee"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditEmployee;
