"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateTeachersMutation } from "@/features/User-Management/teacherApi";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
  useGetAllsubjectsQuery,
} from "@/features/signupApi";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useGetAllPositionsQuery } from "@/features/User-Management/driverApi";
import SearchableSelect from "@/components/select";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import MultiSelectComponent from "@/components/multiSelect";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

const AddNewTeacher = () => {
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
      nameEn: "teacher",
      nameAr: "معلم",
      nameFr: "teacher",
      href: "/teacher",
    },
    {
      nameEn: "Add New Teacher",
      nameAr: "إضافة معلم جديد",
      nameFr: "Ajouter un nouvel Teacher",
      href: "/add-new-teacher",
    },
  ];
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
  const { data: subjects, isLoading: subLoading } =
    useGetAllsubjectsQuery(null);
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const formMethods = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      nid: "",
      gender: "",
      nationality: "",
      name_en: "",
      name_ar: "",
      name_fr: "",
      about: "",
      birthDate: "",
      qualification: "",
      hireDate: "",
      positionId: "",
      salary: "",
      subjects: [],
    },
  });

  // Destructure form methods
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;
  const birthDate = watch("birthDate");
  const router = useRouter();

  const [createTeacher, { isLoading }] = useCreateTeachersMutation();
  const { data: rigiond } = useGetAllReginionIDQuery(null);
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
    const formData = {
      ...data,
      religion: "OTHERS",
      subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects],
    };
    try {
      await createTeacher(formData).unwrap();
      toast.success("Teacher created successfully");
      router.push("/teacher");
    } catch (error: any) {
      if (error.data && error.data.data && error.data.data.length > 0) {
        setBackendError(error.data.data[0]);
      } else {
        setBackendError("Failed to create parent");
      }
      toast.error("Failed to create parent");
    }
  };

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || nationalityLoading || isPosition || subLoading)
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
              ? "Add New Teacher"
              : currentLanguage === "ar"
                ? "إضافة معلم جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouvel Teacher"
                  : "Add New Teacher"}{" "}
            {/* default */}
          </h1>
        </div>
        <FormProvider {...formMethods}>
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
                    ? "Teacher Information"
                    : currentLanguage === "ar"
                      ? "معلومات المعلم"
                      : currentLanguage === "fr"
                        ? "Informations sur l'enseignant"
                        : "Teacher Information"}
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
                      : "Nom d'utilisateur"}
                  <input
                    id="username"
                    type="text"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <span className="text-error">This field is required</span>
                  )}
                </label>

                <label
                  htmlFor="email"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : "Email"}
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-error">This field is required</span>
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
                      : "Mot de passe"}
                  <input
                    id="password"
                    type="password"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <span className="text-error">This field is required</span>
                  )}
                </label>

                <label htmlFor="nid" className="grid text-[18px] font-semibold">
                  {currentLanguage === "en"
                    ? "NID"
                    : currentLanguage === "ar"
                      ? "الرقم الوطني"
                      : "NID"}
                  <input
                    id="nid"
                    type="number"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("nid", { required: true })}
                  />
                  {errors.nid && (
                    <span className="text-error">This field is required</span>
                  )}
                </label>

                <label
                  htmlFor="gender"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : "Genre"}
                  <select
                    id="gender"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("gender", { required: true })}
                  >
                    <option value="">
                      {currentLanguage === "en"
                        ? "Select gender"
                        : currentLanguage === "ar"
                          ? "اختر الجنس"
                          : "Sélectionner le genre"}
                    </option>
                    <option value="MALE">
                      {currentLanguage === "en"
                        ? "Male"
                        : currentLanguage === "ar"
                          ? "ذكر"
                          : "Homme"}
                    </option>
                    <option value="FEMALE">
                      {currentLanguage === "en"
                        ? "Female"
                        : currentLanguage === "ar"
                          ? "أنثى"
                          : "Femme"}
                    </option>
                  </select>
                  {errors.gender && (
                    <span className="text-error">This field is required</span>
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
              </div>
              <div className="grid grid-cols-2 gap-4 px-6 pt-6 max-[1278px]:grid-cols-1">
                <label
                  htmlFor="nationality"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "Your Nationality"
                    : currentLanguage === "ar"
                      ? "جنسيتك"
                      : "Votre Nationalité"}
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
                          : "Sélectionner la nationalité"}
                    </option>
                    {nationalityData &&
                      Object.entries(nationalityData.data).map(
                        ([key, value]) => (
                          <option key={key} value={key}>
                            {String(value)}
                          </option>
                        ),
                      )}
                  </select>
                  {errors.nationality && (
                    <span className="text-error">
                      {currentLanguage === "en"
                        ? "This field is required"
                        : currentLanguage === "ar"
                          ? "هذا الحقل مطلوب"
                          : "Ce champ est requis"}
                    </span>
                  )}
                </label>

                <label
                  htmlFor="regionId"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "RegionId"
                    : currentLanguage === "ar"
                      ? "معرف المنطقة"
                      : "ID de région"}
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
                      ? "الاسم (EN)"
                      : "Nom (EN)"}
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
                          : "Ce champ est requis"}
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
                      ? "الاسم (AR)"
                      : "Nom (AR)"}
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
                          : "Ce champ est requis"}
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
                      ? "الاسم (FR)"
                      : "Nom (FR)"}
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
                          : "Ce champ est requis"}
                    </span>
                  )}
                </label>

                <label
                  htmlFor="about"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "About"
                    : currentLanguage === "ar"
                      ? "عن"
                      : "À propos"}
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
                          : "Ce champ est requis"}
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
                        const age =
                          today.getFullYear() - birthDate.getFullYear();
                        const monthDiff =
                          today.getMonth() - birthDate.getMonth();

                        // Adjust age if the birth date hasn't been reached yet this year
                        if (
                          monthDiff < 0 ||
                          (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                        ) {
                          return age > 21;
                        }

                        return age >= 21;
                      },
                    })}
                  />
                  {errors.birthDate && (
                    <span className="text-error">
                      {currentLanguage === "en"
                        ? errors.birthDate.type === "validate"
                          ? "The Teacher Must be older than 21"
                          : "This field is required"
                        : currentLanguage === "ar"
                          ? errors.birthDate.type === "validate"
                            ? "يجب أن يكون عمر المعلم أكبر من 21 عامًا"
                            : "هذا الحقل مطلوب"
                          : currentLanguage === "fr"
                            ? errors.birthDate.type === "validate"
                              ? "L'enseignant doit avoir plus de 21 ans"
                              : "Ce champ est requis"
                            : "This field is required"}
                    </span>
                  )}
                </label>

                <label
                  htmlFor="qualification"
                  className="mt-4 grid items-center text-[18px] font-semibold"
                >
                  <select
                    defaultValue=""
                    id="qualification"
                    {...register("qualification", { required: true })}
                    className="h-[55px] w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                    <option value="">
                      {currentLanguage === "en"
                        ? "Select qualification"
                        : currentLanguage === "ar"
                          ? "اختر المؤهل"
                          : "Sélectionner la qualification"}
                    </option>
                    <option value="HIGH_SCHOOL_DIPLOMA">
                      {currentLanguage === "en"
                        ? "High School Diploma"
                        : currentLanguage === "ar"
                          ? "دبلوم الثانوية العامة"
                          : "Diplôme de l'école secondaire"}
                    </option>
                    <option value="MASTER_DEGREE">
                      {currentLanguage === "en"
                        ? "Master Degree"
                        : currentLanguage === "ar"
                          ? "درجة الماجستير"
                          : "Diplôme de Master"}
                    </option>
                    <option value="BACHELOR_DEGREE">
                      {currentLanguage === "en"
                        ? "Bachelor Degree"
                        : currentLanguage === "ar"
                          ? "درجة البكالوريوس"
                          : "Diplôme de Licence"}
                    </option>
                    <option value="DOCTORATE_DEGREE">
                      {currentLanguage === "en"
                        ? "Doctorate Degree"
                        : currentLanguage === "ar"
                          ? "درجة الدكتوراه"
                          : "Diplôme de Doctorat"}
                    </option>
                  </select>
                  {errors.qualification && (
                    <span className="text-[18px] text-error">
                      {currentLanguage === "en"
                        ? "Qualification is Required"
                        : currentLanguage === "ar"
                          ? "المؤهل مطلوب"
                          : "La qualification est requise"}
                    </span>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 px-6 pt-6 max-[1278px]:grid-cols-1">
                <label
                  htmlFor="hireDate"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "Hire Date"
                    : currentLanguage === "ar"
                      ? "تاريخ التوظيف"
                      : "Date d'embauche"}
                  <input
                    id="hireDate"
                    type="date"
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("hireDate", {
                      required: true,
                      validate: value => {
                        if (!birthDate) return true; // Skip validation if birth date not set
                        const hireDate = new Date(value);
                        const birthDateObj = new Date(birthDate);
                        return hireDate > birthDateObj;
                      },
                    })}
                  />
                  {errors.hireDate && (
                    <span className="text-error">
                      {currentLanguage === "en"
                        ? errors.hireDate.type === "validate"
                          ? "Hire date must be after date of birth"
                          : "This field is required"
                        : currentLanguage === "ar"
                          ? errors.hireDate.type === "validate"
                            ? "يجب أن يكون تاريخ التوظيف بعد تاريخ الميلاد"
                            : "هذا الحقل مطلوب"
                          : currentLanguage === "fr"
                            ? errors.hireDate.type === "validate"
                              ? "La date d'embauche doit être postérieure à la date de naissance"
                              : "Ce champ est requis"
                            : "This field is required"}
                    </span>
                  )}
                </label>

                <MultiSelectComponent
                  control={control}
                  currentLanguage={currentLanguage}
                  errors={errors}
                />

                <label
                  htmlFor="positionId"
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? "Position Id"
                    : currentLanguage === "ar"
                      ? "معرف الوظيفة"
                      : "ID du poste"}
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
                          : "Ce champ est requis"}
                    </span>
                  )}
                  {positionData.data.content.length == 0 && (
                    <Link
                      href="/organization-setting/position/add-position"
                      className="mt-4 text-sm font-medium text-primary underline"
                    >
                      Add Position
                    </Link>
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
                      : "Salaire"}
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
                          : "Ce champ est requis"}
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
                        ? "جاري الإضافة..."
                        : "Ajout en cours..."
                    : currentLanguage === "en"
                      ? "Add Teacher"
                      : currentLanguage === "ar"
                        ? "أضف معلم"
                        : "Ajouter un enseignant"}{" "}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddNewTeacher;
