"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateStudentsMutation, useGetAllEducationsQuery } from "@/features/User-Management/studentApi";
import { useGetAllParentsQuery } from "@/features/User-Management/parentApi";
import {
  useGetAllCountryCodeQuery,
  useGetAllLanguagesQuery,
  useGetAllLevelsQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useState } from "react";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import SearchableSelect from "@/components/select";

const AddNewStudent = () => {
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
      nameEn: "Student",
      nameAr: "الطالب",
      nameFr: "Étudiant",
      href: "/student",
    },
    {
      nameEn: "Add New Student",
      nameAr: "إضافة طالب جديد",
      nameFr: "Ajouter un nouvel étudiant",
      href: "/add-new-student",
    },
  ];
  const [
    studentCertificatesOfAchievement,
    setStudentCertificatesOfAchievement,
  ] = useState("");
  const [studentProfilePhoto, setStudentProfilePhoto] = useState("");
  const [studentIdPhoto, setStudentIdPhoto] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (
    event: any,
    setFileName: (name: string) => void,
  ) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
  const { data: educations, isLoading: isEducations } =
  useGetAllEducationsQuery(null);
  const { data: regionData } = useGetAllReginionIDQuery(null);
  const optionsRigon =
    regionData?.data?.map(
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
  const { data: parentData, isLoading: parentLoading } = useGetAllParentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const { data: LevelData, isLoading: LevelLoading } =
    useGetAllLevelsQuery(null);
  const { data: LangData, isLoading: LangLoading } =
    useGetAllLanguagesQuery(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [createStudent, { isLoading }] = useCreateStudentsMutation();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append(
      "request",
      JSON.stringify({
        parentId: data.parentId, // Include parentId from the select dropdown
        username: data.username,
        email: data.email,
        password: data.password,
        nid: data.nid,
        gender: data.gender,
        religion: "OTHERS",
        nationality: data.nationality,
        regionId: data.regionId,
        name_en: data.name_en,
        name_ar: data.name_ar,
        name_fr: data.name_fr,
        about: data.about,
        number: data.number,
        birthDate: data.birthDate,
        relationshipToStudent: "FATHER",
        studyLevel: data.studyLevel,
        eduSystemId: data.eduSystemId,
        language: data.language,
        skipFees: true,
      }),
    );

    // Append file inputs
    if (data.studentIdPhoto && data.studentIdPhoto[0])
      formData.append("studentIdPhoto", data.studentIdPhoto[0]);
    if (data.studentProfilePhoto && data.studentProfilePhoto[0])
      formData.append("studentProfilePhoto", data.studentProfilePhoto[0]);
    if (
      data.studentCertificatesOfAchievement &&
      data.studentCertificatesOfAchievement[0]
    )
      formData.append(
        "studentCertificatesOfAchievement",
        data.studentCertificatesOfAchievement[0],
      );

    try {
      await createStudent(formData).unwrap();
      toast.success("Student created successfully");
    } catch {
      toast.error("Failed to create student");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isCountryCode || LevelLoading || LangLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (nationalityLoading || parentLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-[10px] grid items-center justify-center`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-10 grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              {/* Parent ID dropdown */}
              <label
                htmlFor="parentId"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Parent"
                  : currentLanguage === "ar"
                    ? "الوالد"
                    : "Parent"}
                <select
                  id="parentId"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("parentId", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Parent"
                      : currentLanguage === "ar"
                        ? "اختر الوالد"
                        : "Sélectionner un parent"}
                  </option>
                  {parentData &&
                    parentData?.data.content?.map((parent: any) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                </select>
                {errors.parentId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Username */}
              <label
                htmlFor="username"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Username"
                  : currentLanguage === "ar"
                    ? "اسم المستخدم"
                    : "Nom d'utilisateur"}
                <input
                  id="username"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Email */}
              <label
                htmlFor="email"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "البريد الإلكتروني"
                  : currentLanguage === "fr"
                    ? "Email"
                    : "Email"}
                <input
                  id="email"
                  type="email"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Password */}
              <label
                htmlFor="password"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "كلمة المرور"
                  : currentLanguage === "fr"
                    ? "Mot de passe"
                    : "Password"}
                <input
                  id="password"
                  type="password"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* NID */}
              <label
                htmlFor="nid"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الرقم الهوية"
                  : currentLanguage === "fr"
                    ? "NID"
                    : "NID"}
                <input
                  id="nid"
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nid", { required: true })}
                />
                {errors.nid && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Gender */}
              <label
                htmlFor="gender"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الجنس"
                  : currentLanguage === "fr"
                    ? "Sexe"
                    : "Gender"}
                <select
                  id="gender"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                    {currentLanguage === "en" ? "Male" : "ذكر"}
                  </option>
                  <option value="FEMALE">
                    {currentLanguage === "en" ? "Female" : "أنثى"}
                  </option>
                </select>
                {errors.gender && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Religion */}

              {/* Nationality */}
              <label
                htmlFor="nationality"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "جنسيتك"
                  : currentLanguage === "fr"
                    ? "Votre nationalité"
                    : "Your Nationality"}
                <select
                  id="nationality"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("nationality", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر الجنسية"
                      : currentLanguage === "fr"
                        ? "Sélectionner la nationalité"
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
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Region */}
              <label
                htmlFor="regionId"
                className="grid font-sans text-[18px] font-semibold"
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

              {/* Name (English) */}
              <label
                htmlFor="name_en"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (إنجليزي)"
                  : currentLanguage === "fr"
                    ? "Nom (EN)"
                    : "Name (EN)"}
                <input
                  id="name_en"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_en", { required: true })}
                />
                {errors.name_en && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Name (Arabic) */}
              <label
                htmlFor="name_ar"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (عربي)"
                  : currentLanguage === "fr"
                    ? "Nom (AR)"
                    : "Name (AR)"}
                <input
                  id="name_ar"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_ar", { required: true })}
                />
                {errors.name_ar && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Name (French) */}
              <label
                htmlFor="name_fr"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم (فرنسي)"
                  : currentLanguage === "fr"
                    ? "Nom (FR)"
                    : "Name (FR)"}
                <input
                  id="name_fr"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_fr", { required: true })}
                />
                {errors.name_fr && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* About */}
              <label
                htmlFor="about"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "About"
                  : currentLanguage === "ar"
                    ? "نبذة"
                    : "À propos"}
                <textarea
                  id="about"
                  className="h-[100px] w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("about")}
                />
                {errors.about && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Birth Date */}
              <label
                htmlFor="birthDate"
                className="grid font-sans text-[18px] font-semibold"
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
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("birthDate", {
                    required: true,
                    validate: value => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      const age = today.getFullYear() - birthDate.getFullYear();
                      const isOlderThanSix =
                        age > 6 ||
                        (age === 6 &&
                          today >=
                            new Date(
                              birthDate.setFullYear(today.getFullYear()),
                            ));
                      return isOlderThanSix;
                    },
                  })}
                />
                {errors.birthDate && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? errors.birthDate.type === "validate"
                        ? "The Student Must be older than 6"
                        : "This field is required"
                      : currentLanguage === "ar"
                        ? errors.birthDate.type === "validate"
                          ? "يجب أن يكون عمر الطالب أكبر من 6 سنوات"
                          : "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? errors.birthDate.type === "validate"
                            ? "L'étudiant doit avoir plus de 6 ans"
                            : "Ce champ est requis"
                          : "This field is required"}
                  </span>
                )}
              </label>

              {/* Study Level */}

              <label
                htmlFor="studyLevel"
                className="grid text-start font-sans text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "مستوى الدراسة"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude"
                    : "Study Level"}
                <select
                  defaultValue=""
                  id="studyLevel"
                  {...register("studyLevel", { required: true })}
                  className={`border ${errors.studyLevel ? "border-warning" : "border-borderPrimary"} h-full w-[400px] rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر مستوى الدراسة"
                      : currentLanguage === "fr"
                        ? "Sélectionner le niveau d'étude"
                        : "Select Study Level"}
                  </option>
                  {LevelData &&
                    Object.entries(LevelData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.studyLevel && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "مستوى الدراسة مطلوب"
                      : currentLanguage === "fr"
                        ? "Le niveau d'études est requis"
                        : "Study Level is Required"}
                  </span>
                )}
              </label>

              <label
                htmlFor="language"
                className="grid text-start font-sans text-[15px] font-semibold text-blackOrWhite"
              >
                {currentLanguage === "ar"
                  ? "اللغة"
                  : currentLanguage === "fr"
                    ? "Langue"
                    : "Language"}
                <select
                  defaultValue=""
                  id="language"
                  {...register("language", { required: true })}
                  className={`border ${errors.language ? "border-warning" : "border-borderPrimary"} h-full w-[400px] rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
                >
                  <option selected value="">
                    {currentLanguage === "ar"
                      ? "اختر اللغة"
                      : currentLanguage === "fr"
                        ? "Sélectionner la langue"
                        : "Select Language"}{" "}
                  </option>
                  {LangData &&
                    Object.entries(LangData.data).map(([key, value]) => (
                      <option key={String(value)} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {errors.language && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "اللغة مطلوبة"
                      : currentLanguage === "fr"
                        ? "La langue est requise"
                        : "Language is Required"}
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

              {/* Educational System */}
              <label
                htmlFor="eduSystemId"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Educational System"
                  : currentLanguage === "ar"
                    ? "النظام التعليمي"
                    : "Système éducatif"}
                    <select
                  id="eduSystemId"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("eduSystemId", { required: true })}
                >
                  <option value="">
                  {currentLanguage === "en"
                  ? "Educational System"
                  : currentLanguage === "ar"
                    ? "النظام التعليمي"
                    : "Système éducatif"}
                  </option>
                  {educations &&
                    educations?.data.content?.map((edu: any) => (
                      <option key={edu.id} value={edu.id}>
                        {edu.name}
                      </option>
                    ))}
                </select>
                
                {errors.eduSystemId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : "هذا الحقل مطلوب"}
                  </span>
                )}
              </label>

              {/* Student ID Photo */}
              <label
                htmlFor="studentIdPhoto"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "صورة بطاقة الطالب"
                  : currentLanguage === "fr"
                    ? "Photo de la carte d'étudiant"
                    : "Student ID Photo"}

                <input
                  id="studentIdPhoto"
                  type="file"
                  className="cursor-pointer opacity-0"
                  {...register("studentIdPhoto")}
                  onChange={e => handleFileChange(e, setStudentIdPhoto)}
                />
                <span className="-mt-8 w-[400px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                  <div className="flex">
                    <FaCloudUploadAlt className="mx-2 mt-1" />
                    {studentIdPhoto
                      ? studentIdPhoto
                      : currentLanguage === "en"
                        ? "Choose a file"
                        : currentLanguage === "ar"
                          ? "اختر ملف"
                          : currentLanguage === "fr"
                            ? "Choisir un fichier"
                            : "Choose a file"}
                  </div>
                </span>
              </label>

              {/* Student Profile Photo */}

              <label
                htmlFor="studentProfilePhoto"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "صورة ملف الطالب"
                  : currentLanguage === "fr"
                    ? "Photo de profil étudiant"
                    : "Student Profile Photo"}

                <input
                  id="studentProfilePhoto"
                  type="file"
                  className="cursor-pointer opacity-0"
                  {...register("studentProfilePhoto")}
                  onChange={e => handleFileChange(e, setStudentProfilePhoto)}
                />
                <span className="-mt-8 w-[400px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                  <div className="flex">
                    <FaCloudUploadAlt className="mx-2 mt-1" />
                    {studentProfilePhoto
                      ? studentProfilePhoto
                      : currentLanguage === "en"
                        ? "Choose a file"
                        : currentLanguage === "ar"
                          ? "اختر ملف"
                          : currentLanguage === "fr"
                            ? "Choisir un fichier"
                            : "Choose a file"}
                  </div>
                </span>
              </label>
              <label
                htmlFor="studentCertificatesOfAchievement"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Student Certificates Of Achievement"
                  : currentLanguage === "ar"
                    ? "شهادات إنجاز الطالب"
                    : currentLanguage === "fr"
                      ? "Certificats de réussite de l'étudiant"
                      : "Student Certificates Of Achievement"}
                <input
                  id="studentCertificatesOfAchievement"
                  type="file"
                  className="cursor-pointer opacity-0"
                  {...register("studentCertificatesOfAchievement")}
                  onChange={e =>
                    handleFileChange(e, setStudentCertificatesOfAchievement)
                  }
                />
                <span className="-mt-8 w-[400px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                  <div className="flex">
                    <FaCloudUploadAlt className="mx-2 mt-1" />
                    {studentCertificatesOfAchievement
                      ? studentCertificatesOfAchievement
                      : currentLanguage === "en"
                        ? "Choose a file"
                        : currentLanguage === "ar"
                          ? "اختر ملف"
                          : currentLanguage === "fr"
                            ? "Choisir un fichier"
                            : "Choose a file"}
                  </div>
                </span>
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                disabled={isLoading}
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {isLoading
                  ? currentLanguage === "en"
                    ? "Adding..."
                    : currentLanguage === "ar"
                      ? "جارٍ الإضافة..."
                      : "Ajout en cours..."
                  : currentLanguage === "en"
                    ? "Add Student"
                    : currentLanguage === "ar"
                      ? "إضافة طالب"
                      : "Ajouter un étudiant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewStudent;
