/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import SearchableSelect from "@/components/select";
import Spinner from "@/components/spinner";
import { useGetAllSchoolsQuery } from "@/features/attendance/attendanceApi";
import {
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
  useSignupApiDashboardMutation,
  useGetValidUsernameQuery,
} from "@/features/signupApi";
import { RootState } from "@/GlobalRedux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";

// Define the validation schema using Zod
const signupSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  nid: z.string().nonempty("NID is required"),
  regionId: z.string().nonempty("Region ID is required"),
  gender: z.string().nonempty("Gender is required"),
  number: z.string().nonempty("Number is required"),
  nationality: z.string().nonempty("Nationality is required"),
  employeeType: z.string().nonempty("Employee type is required"),
  qualification: z.string().nonempty("Qualification is required"),
  birthDate: z
    .string()
    .nonempty("Birthdate is required")
    .refine((val) => {
      const birthDate = new Date(val);
      if (isNaN(birthDate.getTime())) return false; // Invalid date
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age >= 20;
    }, {
      message: "You must be at least 20 years old",
    }),
  name_en: z.string().nonempty("English name is required"),
  name_ar: z.string().nonempty("Arabic name is required"),
  name_fr: z.string().nonempty("French name is required"),
  schoolId: z.string().nonempty("School ID is required"),
  about: z.string().nonempty("About ID is required"),
});

const Signup = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const dispatchLang = useDispatch();
  useEffect(() => {
    dispatchLang(initializeLanguage());
  }, [dispatchLang]);

  const [errorMessage, setErrorMessage] = useState<any[]>([]);
  const dispatch2 = useDispatch();
  const handleLanguageChange = (language: any) => {
    dispatch2(setLanguage(language));
  };
  const router = useRouter();
  const [step, setStep] = useState(1);
  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);
  const { data: schoolData, isLoading: isSchool } = useGetAllSchoolsQuery(null);
  const options =
    schoolData?.data?.map(
      (school: {
        cityName: any;
        countryName: any;
        regionName: any;
        id: any;
        name: any;
      }) => ({
        value: school.id,
        label: `${school.name} - ${school.regionName}, ${school.cityName}, ${school.countryName}`,
      }),
    ) || [];

  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [loginDashboard, { isLoading, error }] =
    useSignupApiDashboardMutation();
  const {
    data: nationalityData,
    error: nationalityError,
    isLoading: nationalityLoading,
  } = useGetAllNationalitysQuery(null);
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

  useEffect(() => {
    if (nationalityData) {
      console.log("Response Data:", nationalityData);
    }
    if (nationalityError) {
      console.log("Error:", nationalityError);
    }
  }, [nationalityData, nationalityError]);

  const onSubmit = async (data: any) => {
    const formData = {...data, religion: "OTHERS"}
    try {
      const result = await loginDashboard(formData).unwrap();
      console.log("Account created successfully:", result);
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء الحساب بنجاح"
          : currentLanguage === "fr"
            ? "Compte créé avec succès"
            : "Account created successfully",
      );
      router.push("/confirm-account");
    } catch (err: any) {
      setErrorMessage(err.data.data);
      console.log(errorMessage);

      toast.error(currentLanguage === "ar"
          ? "فشل في إنشاء الحساب"
          : currentLanguage === "fr"
            ? "Échec de la création du compte"
            : "Failed to create account",
      );
      console.error("Failed to create account:", err);
    }
  };
  const [username, setUsername] = useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = useState<string>(username);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Debounce logic to delay API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 300); // 300ms delay for debounce

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  // Query to check the username validity
  const { data } = useGetValidUsernameQuery(debouncedUsername, {
    skip: !debouncedUsername, // Skip the query if debouncedUsername is empty
  });
  useEffect(() => {
    if (data && data.data) {
      setError("username", {
        type: "manual",
        message:
          currentLanguage === "ar"
            ? "اسم المستخدم غير متاح"
            : currentLanguage === "fr"
              ? "Nom d'utilisateur indisponible"
              : "Username is not available",
      });
      setIsValid(false);
    } else if (data && !data.data) {
      clearErrors("username");
      setIsValid(true);
    }
  }, [data, setError, clearErrors, currentLanguage]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.warn(
        currentLanguage === "ar"
          ? "يرجى إكمال جميع الحقول المطلوبة"
          : currentLanguage === "fr"
            ? "Veuillez compléter tous les champs requis"
            : "Please complete all required inputs",
      );
    }
  }, [currentLanguage, errors]);

  if (loading)
    return (
      <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgSecondary duration-300 ease-in max-[1040px]:grid-cols-1">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="absolute right-5 top-5">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="text-violet11 hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-bgPrimary outline-none"
              aria-label="Customise options"
            >
              {currentLanguage === "en" ? (
                <img src="/images/en.png" alt="#" />
              ) : currentLanguage === "ar" ? (
                <img src="/images/ar.png" alt="#" />
              ) : currentLanguage === "fr" ? (
                <img src="/images/fr.png" alt="#" />
              ) : (
                <img src="/images/fr.png" alt="#" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 mx-2 mt-5 grid min-w-[150px] justify-center gap-5 rounded-md bg-bgPrimary p-[5px] font-semibold shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
              sideOffset={5}
            >
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mt-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "Arabic"
                    : currentLanguage === "ar"
                      ? "العربية"
                      : currentLanguage === "fr"
                        ? "Arabe"
                        : "Arabic"}
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "English"
                    : currentLanguage === "ar"
                      ? "الإنجليزية"
                      : currentLanguage === "fr"
                        ? "Anglais"
                        : "English"}
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mb-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("fr")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "French"
                    : currentLanguage === "ar"
                      ? "الفرنسية"
                      : currentLanguage === "fr"
                        ? "Français"
                        : "French"}
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgSecondary pl-4 duration-300 ease-in max-[1040px]:grid-cols-1">
        <div className="gird items-center justify-center text-center">
          <div className="mb-20">
            <img
              className="absolute left-5 top-5 w-[300px]"
              src="images/logo.png"
              alt="#"
            />
          </div>
          <div className="mb-5 grid">
            <h1 className="font-sans text-[28px] font-bold text-primary">
              {currentLanguage === "ar"
                ? "التسجيل"
                : currentLanguage === "fr"
                  ? "S'inscrire"
                  : "Sign Up"}
            </h1>
            <p className="font-sans text-[20px] font-semibold text-secondary">
              {currentLanguage === "ar"
                ? "سجل للاستمتاع بالتطبيق"
                : currentLanguage === "fr"
                  ? "Inscrivez-vous pour profiter de l'application"
                  : "Sign up to enjoy the application"}
            </p>
          </div>
          <div className="grid items-center justify-center">
            <form
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="grid gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {step === 1 && (
                <div className="grid w-full grid-cols-1 gap-3">
                  <label
                    htmlFor="username"
                    className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="username"
                      {...register("username", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "اسم المستخدم"
                          : currentLanguage === "fr"
                            ? "Nom d'utilisateur"
                            : "username"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.username ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                    {errors.username ? (
                      <span className="mt-2 text-error">
                        {errors.username.message?.toString()}
                      </span>
                    ) : isValid && debouncedUsername ? (
                      <span className="mt-2 text-green-500">
                        {currentLanguage === "ar"
                          ? "اسم المستخدم متاح"
                          : currentLanguage === "fr"
                            ? "Nom d'utilisateur disponible"
                            : "Username is available"}
                      </span>
                    ) : null}
                  </label>
                  <label
                    htmlFor="email"
                    className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="email"
                      {...register("email", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "البريد الإلكتروني"
                          : currentLanguage === "fr"
                            ? "Email"
                            : "email"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.email ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="email"
                    />
                    {errors.email && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "البريد الإلكتروني مطلوب"
                          : currentLanguage === "fr"
                            ? "L'email est requis"
                            : "Email is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="password"
                    className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="password"
                      {...register("password", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "كلمة المرور"
                          : currentLanguage === "fr"
                            ? "Mot de passe"
                            : "Password"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.password ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="password"
                    />
                    {errors.password && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل 123 (@_#*&). تشمل الأحرف الكبيرة والصغيرة A-Z a-z"
                          : currentLanguage === "fr"
                            ? "Le mot de passe doit comporter au moins 8 caractères 123 (@_#*&). Inclut les majuscules et les minuscules A-Z a-z"
                            : "Password must be at least 8 characters long 123 (@_#*&). Includes uppercase and lowercase letters A-Z a-z"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="nid"
                    className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="nid"
                      {...register("nid", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "الرقم القومي"
                          : currentLanguage === "fr"
                            ? "Numéro d'identification nationale"
                            : "NID"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.nid ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="number"
                    />
                    {errors.nid && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الرقم القومي مطلوب"
                          : currentLanguage === "fr"
                            ? "NID est requis"
                            : "NID is Required"}
                      </span>
                    )}
                  </label>
                  <div
                    dir="ltr"
                    className="mt-12 flex w-full justify-end gap-3"
                  >
                    <p className="flex w-[120px] cursor-no-drop items-center justify-center gap-2 rounded-xl border border-[#e6e8e7] bg-white px-3 py-2 font-semibold text-primary">
                      <svg
                        className="h-5 w-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                      {currentLanguage === "ar"
                        ? "السابق"
                        : currentLanguage === "fr"
                          ? "Précédent"
                          : "Previous"}
                    </p>
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handleNext}
                    >
                      {currentLanguage === "ar"
                        ? "التالي"
                        : currentLanguage === "fr"
                          ? "Suivant"
                          : "Next"}
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="grid grid-cols-1 gap-3">
                  <label
                    htmlFor="regionId"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a] w-[400px] max-[458px]:w-[350px]"
                  >
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
                    htmlFor="gender"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <select
                      defaultValue=""
                      id="gender"
                      {...register("gender", { required: true })}
                      className={`rounded-xl border px-4 py-3 ${errors.gender ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
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
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الجنس مطلوب"
                          : currentLanguage === "fr"
                            ? "Le sexe est requis"
                            : "Gender is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="number"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="number"
                      {...register("number", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "رقم"
                          : currentLanguage === "fr"
                            ? "Numéro"
                            : "Number"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.number ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="number"
                    />
                    {errors.number && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الرقم مطلوب"
                          : currentLanguage === "fr"
                            ? "Le numéro est requis"
                            : "number is Required"}
                      </span>
                    )}
                  </label>
                  <div
                    dir="ltr"
                    className="mt-12 flex w-full justify-end gap-3"
                  >
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handlePrevious}
                    >
                      <svg
                        className="h-5 w-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                      {currentLanguage === "ar"
                        ? "السابق"
                        : currentLanguage === "fr"
                          ? "Précédent"
                          : "Previous"}
                    </button>
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handleNext}
                    >
                      {currentLanguage === "ar"
                        ? "التالي"
                        : currentLanguage === "fr"
                          ? "Suivant"
                          : "Next"}
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-3">
                  <label
                    htmlFor="nationality"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <select
                      defaultValue=""
                      id="nationality"
                      {...register("nationality", { required: true })}
                      className={`rounded-xl border px-4 py-3 ${errors.nationality ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                    >
                      <option selected value="">
                        {currentLanguage === "ar"
                          ? "اختر الجنسية"
                          : currentLanguage === "fr"
                            ? "Sélectionnez la nationalité"
                            : "Select Nationality"}
                      </option>
                      {nationalityData &&
                        Object.entries(nationalityData.data).map(
                          ([key, value]) => (
                            <option key={String(value)} value={key}>
                              {String(value)}
                            </option>
                          ),
                        )}
                    </select>
                    {errors.nationality && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الجنسية مطلوبة"
                          : currentLanguage === "fr"
                            ? "La nationalité est requise"
                            : "Nationality is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="employeeType"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <select
                      defaultValue=""
                      id="employeeType"
                      {...register("employeeType", { required: true })}
                      className={`rounded-xl border px-4 py-3 ${errors.employeeType ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                    >
                      <option selected value="">
                        {currentLanguage === "ar"
                          ? "اختر نوع الموظف"
                          : currentLanguage === "fr"
                            ? "Sélectionnez la Type d'employé"
                            : "Select employee Type"}
                      </option>
                      <option value="EMPLOYEE">
                        {currentLanguage === "ar"
                          ? "موظف"
                          : currentLanguage === "fr"
                            ? "Employé"
                            : "Employee"}
                      </option>
                      <option value="DRIVER">
                        {currentLanguage === "ar"
                          ? "سائق"
                          : currentLanguage === "fr"
                            ? "Chauffeur"
                            : "Driver"}
                      </option>
                      <option value="WORKER">
                        {currentLanguage === "ar"
                          ? "عامل"
                          : currentLanguage === "fr"
                            ? "Travailleur"
                            : "Worker"}
                      </option>
                    </select>
                    {errors.employeeType && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "نوع الموظف مطلوب"
                          : currentLanguage === "fr"
                            ? "Le type d'employé est requis"
                            : "Employee Type is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="qualification"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <select
                      defaultValue=""
                      id="qualification"
                      {...register("qualification", { required: true })}
                      className={`rounded-xl border px-4 py-3 ${errors.qualification ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                    >
                      <option selected value="">
                        {currentLanguage === "ar"
                          ? "اختر شهادة"
                          : currentLanguage === "fr"
                            ? "Sélectionnez la religion"
                            : "Select religion"}
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
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "المؤهل مطلوب"
                          : currentLanguage === "fr"
                            ? "La qualification est requise"
                            : "Qualification is Required"}
                      </span>
                    )}
                  </label>
                  <label
  htmlFor="birthDate"
  className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
>
  {currentLanguage === "ar"
    ? "تاريخ الميلاد"
    : currentLanguage === "fr"
    ? "Date de naissance"
    : "Birthday"}
  <input
    id="birthDate"
    {...register("birthDate", { required: true })}
    placeholder={
      currentLanguage === "ar"
        ? "تاريخ الميلاد"
        : currentLanguage === "fr"
        ? "Date de naissance"
        : "Birthdate"
    }
    className={`rounded-xl border px-4 py-3 ${
      errors.birthDate ? "border-warning" : "border-borderPrimary"
    } w-[400px] outline-none max-[458px]:w-[350px]`}
    type="date"
  />
  {errors.birthDate && (
    <span className="text-[13px] text-error">
      {errors.birthDate.message?.toString() === "Birthdate is required"
        ? currentLanguage === "ar"
          ? "تاريخ الميلاد مطلوب"
          : currentLanguage === "fr"
          ? "La date de naissance est requise"
          : "Birthdate is required"
        : errors.birthDate.message === "You must be at least 20 years old"
        ? currentLanguage === "ar"
          ? "يجب أن يكون عمرك 20 عامًا على الأقل"
          : currentLanguage === "fr"
          ? "Vous devez avoir au moins 20 ans"
          : "You must be at least 20 years old"
        : errors.birthDate.message?.toString() }
    </span>
  )}
</label>

                  <div
                    dir="ltr"
                    className="mt-12 flex w-full justify-end gap-3"
                  >
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handlePrevious}
                    >
                      <svg
                        className="h-5 w-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                      {currentLanguage === "ar"
                        ? "السابق"
                        : currentLanguage === "fr"
                          ? "Précédent"
                          : "Previous"}
                    </button>
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handleNext}
                    >
                      {currentLanguage === "ar"
                        ? "التالي"
                        : currentLanguage === "fr"
                          ? "Suivant"
                          : "Next"}
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="grid grid-cols-1 gap-3">
                  <label
                    htmlFor="name_en"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="name_en"
                      {...register("name_en", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "الاسم بالإنجليزية"
                          : currentLanguage === "fr"
                            ? "Nom en anglais"
                            : "English Name"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.name_en ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="text"
                    />
                    {errors.name_en && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الاسم بالإنجليزية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le nom en anglais est requis"
                            : "English Name is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="name_ar"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="name_ar"
                      {...register("name_ar", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "الاسم بالعربية"
                          : currentLanguage === "fr"
                            ? "Nom en arabe"
                            : "Arabic Name"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.name_ar ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="text"
                    />
                    {errors.name_ar && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الاسم بالعربية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le nom en arabe est requis"
                            : "Arabic Name is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="name_fr"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <input
                      id="name_fr"
                      {...register("name_fr", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "الاسم بالفرنسية"
                          : currentLanguage === "fr"
                            ? "Nom en français"
                            : "French Name"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.name_fr ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                      type="text"
                    />
                    {errors.name_fr && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "الاسم بالفرنسية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le nom en français est requis"
                            : "French Name is Required"}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="schoolId"
                    className="grid text-start font-sans text-[15px] font-semibold text-[#9a9a9a] w-[400px] max-[458px]:w-[350px]"
                  >
                    <SearchableSelect
                      name="schoolId"
                      control={control}
                      errors={errors}
                      options={options}
                      currentLanguage={currentLanguage}
                      placeholder="Select School"
                    />
                  </label>
                  <label
                    htmlFor="about"
                    className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
                  >
                    <textarea
                      id="about"
                      {...register("about", { required: true })}
                      placeholder={
                        currentLanguage === "ar"
                          ? "حول"
                          : currentLanguage === "fr"
                            ? "À propos"
                            : "about"
                      }
                      className={`rounded-xl border px-4 py-3 ${errors.about ? "border-warning" : "border-borderPrimary"} w-[400px] outline-none max-[458px]:w-[350px]`}
                    />
                    {errors.about && (
                      <span className="text-[13px] text-error">
                        {currentLanguage === "ar"
                          ? "حول مطلوب"
                          : currentLanguage === "fr"
                            ? "À propos est requis"
                            : "about is Required"}
                      </span>
                    )}
                  </label>
                  <div
                    dir="ltr"
                    className="mt-12 flex w-full justify-end gap-3"
                  >
                    <button
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      onClick={handlePrevious}
                    >
                      <svg
                        className="h-5 w-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                      {currentLanguage === "ar"
                        ? "السابق"
                        : currentLanguage === "fr"
                          ? "Précédent"
                          : "Previous"}
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="flex w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                    >
                      {isLoading
                        ? currentLanguage === "ar"
                          ? "جاري التحميل..."
                          : currentLanguage === "fr"
                            ? "Chargement..."
                            : "Loading..."
                        : currentLanguage === "ar"
                          ? "تسجيل"
                          : currentLanguage === "fr"
                            ? "S'inscrire"
                            : "SignUp"}
                    </button>
                  </div>
                </div>
              )}
              {error && (
                <p className="font-semibold text-error">
                  {currentLanguage === "ar"
                    ? "قد تكون قد أكملت البيانات أو أدخلتها بشكل غير صحيح!"
                    : currentLanguage === "fr"
                      ? "Vous n'avez peut-être pas complété les données ou les avez saisies incorrectement !"
                      : "You may not have completed the data or entered it correctly!"}
                </p>
              )}
              <div className="mt-4 flex items-center justify-center gap-2 text-center">
                <p className="font-sans font-medium text-secondary">
                  {currentLanguage === "ar"
                    ? "هل لديك حساب بالفعل؟"
                    : currentLanguage === "fr"
                      ? "Vous avez déjà un compte ?"
                      : "Already have an account?"}
                </p>
                <a
                  href="/login"
                  className="flex font-sans font-medium text-primary hover:underline"
                >
                  {currentLanguage === "ar"
                    ? "تسجيل الدخول"
                    : currentLanguage === "fr"
                      ? "Se connecter"
                      : "Login"}
                </a>
              </div>
            </form>
            <div className="text-red-500">
              {Array.isArray(errorMessage) &&
                errorMessage.map((err: string, index: number) => (
                  <div key={index}>
                    <p>{err}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex h-full w-full justify-end">
          <div className="flex h-full w-[600px] items-center justify-end bg-[#2a3469] max-[1040px]:hidden">
            <img
              className="h-[530px] w-[500px] -translate-x-[260px]"
              src="images/labtop.png"
              alt="#"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
