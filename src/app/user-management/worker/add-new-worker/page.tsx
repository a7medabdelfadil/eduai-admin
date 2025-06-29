"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateWorkersMutation } from "@/features/User-Management/workerApi";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useGetAllPositionsQuery } from "@/features/User-Management/driverApi";
import SearchableSelect from "@/components/select";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

const AddNewWorker = () => {
  const [backendError, setBackendError] = useState<string | null>(null);
  const { data: positionData, isLoading: isPosition } =
    useGetAllPositionsQuery(null);

  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
    {
      nameEn: "Worker",
      nameAr: "عامل",
      nameFr: "Travailleur",
      href: "/user-management/worker",
    },
    {
      nameEn: "Add New Worker",
      nameAr: "إضافة عامل جديد",
      nameFr: "Ajouter un nouvel Worker",
      href: "/user-management/worker/add-new-worker",
    },
  ];
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [createWorker, { isLoading }] = useCreateWorkersMutation();
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const { data: rigiond } = useGetAllReginionIDQuery(null);
  const router = useRouter();

  const optionsRigon =
    rigiond?.data?.map(
      (rigion: {
        cityName: any;
        countryName: any;
        regionName: any;
        regionId: any;
        name: any;
      }) => ({
        value: rigion.regionId,
        label: `${rigion.regionName} - ${rigion.cityName}`,
      }),
    ) || [];

  const onSubmit = async (data: any) => {
    const formData = { ...data, religion: "OTHERS" };
    try {
      await createWorker(formData).unwrap();
      toast.success("Wroker created successfully");
      router.push("/user-management/worker");
    } catch (error: any) {
      if (error.data && error.data.data && error.data.data.length > 0) {
        setBackendError(error.data.data[0]);
      } else {
        setBackendError("Failed to create parent");
      }
      toast.error(error.data.message);
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

  if (nationalityLoading || isPosition)
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
              ? "Add New Worker"
              : currentLanguage === "ar"
                ? "إضافة عامل جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouvel Worker"
                  : "Add New Worker"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            {backendError && (
              <div className="text-center text-error">{backendError}</div>
            )}
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
                {currentLanguage === "en"
                  ? "Worker Information"
                  : currentLanguage === "ar"
                    ? "معلومات العامل"
                    : "Informations sur le travailleur"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 px-6 pt-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="username"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Username"
                  : currentLanguage === "ar"
                    ? "اسم المستخدم"
                    : currentLanguage === "fr"
                      ? "Nom d'utilisateur"
                      : "Username"}{" "}
                {/* default */}
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label htmlFor="email" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Email"
                  : currentLanguage === "ar"
                    ? "البريد الإلكتروني"
                    : currentLanguage === "fr"
                      ? "E-mail"
                      : "Email"}{" "}
                {/* default */}
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="password"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Password"
                  : currentLanguage === "ar"
                    ? "كلمة المرور"
                    : currentLanguage === "fr"
                      ? "Mot de passe"
                      : "Password"}{" "}
                {/* default */}
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label htmlFor="nid" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "NID"
                  : currentLanguage === "ar"
                    ? "الرقم الوطني"
                    : currentLanguage === "fr"
                      ? "NID"
                      : "NID"}{" "}
                {/* default */}
                <input
                  id="nid"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nid", { required: true })}
                />
                {errors.nid && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="gender"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Gender"
                  : currentLanguage === "ar"
                    ? "النوع"
                    : currentLanguage === "fr"
                      ? "Genre"
                      : "Gender"}{" "}
                {/* default */}
                <select
                  id="gender"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("gender", { required: true })}
                >
                  <option selected value="">
                    {currentLanguage === "en"
                      ? "Select gender"
                      : currentLanguage === "ar"
                        ? "اختر النوع"
                        : currentLanguage === "fr"
                          ? "Sélectionner le genre"
                          : "Select gender"}{" "}
                    {/* default */}
                  </option>
                  <option value="MALE">
                    {currentLanguage === "en"
                      ? "Male"
                      : currentLanguage === "ar"
                        ? "ذكر"
                        : currentLanguage === "fr"
                          ? "Homme"
                          : "Male"}{" "}
                    {/* default */}
                  </option>
                  <option value="FEMALE">
                    {currentLanguage === "en"
                      ? "Female"
                      : currentLanguage === "ar"
                        ? "أنثى"
                        : currentLanguage === "fr"
                          ? "Femme"
                          : "Female"}{" "}
                    {/* default */}
                  </option>
                </select>
                {errors.gender && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="nationality"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Your Nationality"
                  : currentLanguage === "ar"
                    ? "جنسيتك"
                    : currentLanguage === "fr"
                      ? "Votre nationalité"
                      : "Your Nationality"}{" "}
                {/* default */}
                <select
                  id="nationality"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nationality", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Nationality"
                      : currentLanguage === "ar"
                        ? "اختر الجنسية"
                        : currentLanguage === "fr"
                          ? "Sélectionner la nationalité"
                          : "Select Nationality"}{" "}
                    {/* default */}
                  </option>
                  {nationalityData &&
                    Object.entries(nationalityData.data).map(([key, value]) => (
                      <option key={key} value={key}>
                        {currentLanguage === "en"
                          ? String(value)
                          : currentLanguage === "ar"
                            ? String(value)
                            : currentLanguage === "fr"
                              ? String(value)
                              : String(value)}{" "}
                        {/* default */}
                      </option>
                    ))}
                </select>
                {errors.nationality && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 px-6 pt-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="regionId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Region Id"
                  : currentLanguage === "ar"
                    ? "معرف المنطقة"
                    : currentLanguage === "fr"
                      ? "ID de la région"
                      : "Region Id"}{" "}
                {/* default */}
                <SearchableSelect
                  name="regionId"
                  control={control}
                  errors={errors}
                  options={optionsRigon}
                  currentLanguage={currentLanguage}
                  placeholder="Select Region"
                />
              </label>

              <label
                htmlFor="name_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Name (EN)"
                  : currentLanguage === "ar"
                    ? "الاسم (بالإنجليزية)"
                    : currentLanguage === "fr"
                      ? "Nom (EN)"
                      : "Name (EN)"}{" "}
                {/* default */}
                <input
                  id="name_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_en", { required: true })}
                />
                {errors.name_en && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="name_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Name (AR)"
                  : currentLanguage === "ar"
                    ? "الاسم (بالعربية)"
                    : currentLanguage === "fr"
                      ? "Nom (AR)"
                      : "Name (AR)"}{" "}
                {/* default */}
                <input
                  id="name_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_ar", { required: true })}
                />
                {errors.name_ar && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="name_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Name (FR)"
                  : currentLanguage === "ar"
                    ? "الاسم (بالفرنسية)"
                    : currentLanguage === "fr"
                      ? "Nom (FR)"
                      : "Name (FR)"}{" "}
                {/* default */}
                <input
                  id="name_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_fr", { required: true })}
                />
                {errors.name_fr && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>

              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "About"
                  : currentLanguage === "ar"
                    ? "عن"
                    : currentLanguage === "fr"
                      ? "À propos"
                      : "About"}{" "}
                {/* default */}
                <input
                  id="about"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("about", { required: true })}
                />
                {errors.about && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="birthDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Date Of Birth"
                  : currentLanguage === "ar"
                    ? "تاريخ الميلاد"
                    : currentLanguage === "fr"
                      ? "Date de naissance"
                      : "Date Of Birth"}
                <input
                  id="birthDate"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                        ? "The Driver Must be older than 20"
                        : "This field is required"
                      : currentLanguage === "ar"
                        ? errors.birthDate.type === "validate"
                          ? "يجب أن يكون عمر السائق أكبر من 20 عامًا"
                          : "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? errors.birthDate.type === "validate"
                            ? "Le chauffeur doit avoir plus de 20 ans"
                            : "Ce champ est requis"
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="qualification"
                className="mt-4 grid items-center text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Qualification"
                  : currentLanguage === "ar"
                    ? "المؤهل"
                    : currentLanguage === "fr"
                      ? "Qualification"
                      : "Qualification"}{" "}
                {/* default */}
                <select
                  defaultValue=""
                  id="qualification"
                  {...register("qualification", { required: true })}
                  className="h-[55px] w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Qualification"
                      : currentLanguage === "ar"
                        ? "اختر المؤهل"
                        : currentLanguage === "fr"
                          ? "Sélectionner la qualification"
                          : "Select Qualification"}{" "}
                    {/* default */}
                  </option>
                  <option value="HIGH_SCHOOL_DIPLOMA">
                    {currentLanguage === "en"
                      ? "High School Diploma"
                      : currentLanguage === "ar"
                        ? "دبلوم المدرسة الثانوية"
                        : currentLanguage === "fr"
                          ? "Diplôme de secondaire"
                          : "High School Diploma"}{" "}
                    {/* default */}
                  </option>
                  <option value="MASTER_DEGREE">
                    {currentLanguage === "en"
                      ? "Master Degree"
                      : currentLanguage === "ar"
                        ? "درجة الماجستير"
                        : currentLanguage === "fr"
                          ? "Master"
                          : "Master Degree"}{" "}
                    {/* default */}
                  </option>
                  <option value="BACHELOR_DEGREE">
                    {currentLanguage === "en"
                      ? "Bachelor Degree"
                      : currentLanguage === "ar"
                        ? "درجة البكالوريوس"
                        : currentLanguage === "fr"
                          ? "Licence"
                          : "Bachelor Degree"}{" "}
                    {/* default */}
                  </option>
                  <option value="DOCTORATE_DEGREE">
                    {currentLanguage === "en"
                      ? "Doctorate Degree"
                      : currentLanguage === "ar"
                        ? "درجة الدكتوراه"
                        : currentLanguage === "fr"
                          ? "Doctorat"
                          : "Doctorate Degree"}{" "}
                    {/* default */}
                  </option>
                </select>
                {errors.qualification && (
                  <span className="text-[18px] text-error">
                    {currentLanguage === "en"
                      ? "Qualification is required"
                      : currentLanguage === "ar"
                        ? "المؤهل مطلوب"
                        : currentLanguage === "fr"
                          ? "La qualification est requise"
                          : "Qualification is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="hireDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Hire Date"
                  : currentLanguage === "ar"
                    ? "تاريخ التوظيف"
                    : currentLanguage === "fr"
                      ? "Date d'embauche"
                      : "Hire Date"}{" "}
                {/* default */}
                <input
                  id="hireDate"
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("hireDate", { required: true })}
                />
                {errors.hireDate && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 px-6 pt-6 max-[1278px]:grid-cols-1">
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
                {currentLanguage === "en"
                  ? "Position Id"
                  : currentLanguage === "ar"
                    ? "رقم الوظيفة"
                    : currentLanguage === "fr"
                      ? "ID de position"
                      : "Position Id"}{" "}
                {/* default */}
                {/* <input
                  id="positionId"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("positionId", { required: true })}
                /> */}
                <select
                  defaultValue=""
                  id="positionId"
                  {...register("positionId", { required: true })}
                  className={`border ${errors.positionId ? "border-borderPrimary" : "border-borderPrimary"} h-full w-full rounded-xl bg-bgPrimary px-4 py-3 text-[18px] text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Position Id"
                      : currentLanguage === "ar"
                        ? "اختر معرف الوظيفة"
                        : currentLanguage === "fr"
                          ? "Sélectionner l'ID de la position"
                          : "Select Region Id"}{" "}
                    {/* default */}
                  </option>
                  {positionData &&
                    positionData.data.content.map(
                      (
                        rigion: {
                          title: string;
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
                          {rigion.title}
                        </option>
                      ),
                    )}
                </select>
                {errors.positionId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label
                htmlFor="salary"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Salary"
                  : currentLanguage === "ar"
                    ? "الراتب"
                    : currentLanguage === "fr"
                      ? "Salaire"
                      : "Salary"}{" "}
                {/* default */}
                <input
                  id="salary"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("salary", { required: true })}
                />
                {errors.salary && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
            </div>
            <div className="mt-6 flex justify-center text-center">
              <button
                disabled={isLoading}
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {isLoading
                  ? currentLanguage === "en"
                    ? "Adding..."
                    : currentLanguage === "ar"
                      ? "يتم الإضافة..."
                      : "Ajout en cours..."
                  : currentLanguage === "en"
                    ? "Add Worker"
                    : currentLanguage === "ar"
                      ? "إضافة عامل"
                      : "Ajouter un travailleur"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddNewWorker;
