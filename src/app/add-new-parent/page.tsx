"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateParentsMutation } from "@/features/User-Management/parentApi";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import SearchableSelect from "@/components/select";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

const AddNewParent = () => {
  const [backendError, setBackendError] = useState<string | null>(null);
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
      nameEn: "Parent",
      nameAr: "الأب",
      nameFr: "Parent",
      href: "/parent",
    },
    {
      nameEn: "Add New Parent",
      nameAr: "إضافة أب جديد",
      nameFr: "Ajouter un nouvel parent",
      href: "/add-new-parent",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [createEmployee, { isLoading }] = useCreateParentsMutation();
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
  const router = useRouter();

  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const passwordPattern =
    "^(?=.*[A-Z])(?=.*[~@#$^*()_+\\[\\]{}|\\\\,.?:'\"/;`%-])(?=.*[0-9])(?=.*[a-z]).{8,32}$";
  const onSubmit = async (data: any) => {
    const requestBody = {
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
      occupation_en: data.occupation_en,
      occupation_ar: data.occupation_ar,
      occupation_fr: data.occupation_fr,
      birthDate: data.birthDate,
      number: data.number,
      countryCode: data.countryCode,
    };

    try {
      await createEmployee(requestBody).unwrap();
      toast.success("Parent created successfully");
      router.push("/parent");
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

  if (loading || isCountryCode)
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
              ? "Add New Parent"
              : currentLanguage === "ar"
                ? "إضافة أب جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouvel parent"
                  : "Add New Parent"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex justify-center items-center w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
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
                  ? "Parent Information"
                  : currentLanguage === "ar"
                    ? "معلومات الوالدين"
                    : currentLanguage === "fr"
                      ? "Informations sur les parents"
                      : "Parent Information"}
              </h1>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              {/* Input fields for parent information */}
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
                      : "Username"}
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
                          : "This field is required"}
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
                      : "Email"}
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
                          : "This field is required"}
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
                      : "Password"}
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("password", {
                    required: {
                      value: true,
                      message:
                        currentLanguage === "en"
                          ? "This field is required"
                          : currentLanguage === "ar"
                            ? "هذا الحقل مطلوب"
                            : currentLanguage === "fr"
                              ? "Ce champ est requis"
                              : "This field is required",
                    },
                    pattern: {
                      value: new RegExp(passwordPattern),
                      message:
                        currentLanguage === "en"
                          ? "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
                          : currentLanguage === "ar"
                            ? "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم وحرف خاص"
                            : currentLanguage === "fr"
                              ? "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                              : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-error">
                    {errors.password?.message?.toString()}
                  </span>
                )}
              </label>
              <label htmlFor="nid" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "NID"
                  : currentLanguage === "ar"
                    ? "رقم الهوية"
                    : currentLanguage === "fr"
                      ? "NID"
                      : "NID"}
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
                          : "This field is required"}
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
                    ? "الجنس"
                    : currentLanguage === "fr"
                      ? "Genre"
                      : "Gender"}
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
                        : currentLanguage === "fr"
                          ? "Sélectionner le genre"
                          : "Select gender"}
                  </option>
                  <option value="MALE">
                    {currentLanguage === "en"
                      ? "Male"
                      : currentLanguage === "ar"
                        ? "ذكر"
                        : currentLanguage === "fr"
                          ? "Homme"
                          : "Male"}
                  </option>
                  <option value="FEMALE">
                    {currentLanguage === "en"
                      ? "Female"
                      : currentLanguage === "ar"
                        ? "أنثى"
                        : currentLanguage === "fr"
                          ? "Femme"
                          : "Female"}
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
                          : "This field is required"}
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
                      ? "Votre Nationalité"
                      : "Your Nationality"}
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
                      : currentLanguage === "ar"
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
                {currentLanguage === "en"
                  ? "RegionId"
                  : currentLanguage === "ar"
                    ? "رقم المنطقة"
                    : currentLanguage === "fr"
                      ? "ID de la région"
                      : "RegionId"}
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
                  ? "Name EN"
                  : currentLanguage === "ar"
                    ? "الاسم بالإنجليزية"
                    : currentLanguage === "fr"
                      ? "Nom EN"
                      : "Name EN"}
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
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="name_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Name AR"
                  : currentLanguage === "ar"
                    ? "الاسم بالعربية"
                    : currentLanguage === "fr"
                      ? "Nom AR"
                      : "Name AR"}
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
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="name_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Name FR"
                  : currentLanguage === "ar"
                    ? "الاسم الفرنسية"
                    : currentLanguage === "fr"
                      ? "Nom FR"
                      : "Name FR"}
                <input
                  id="name_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("name_fr", { required: true })}
                />
                {errors.name_ar && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
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
                        ? "The Parent Must be older than 20"
                        : "This field is required"
                      : currentLanguage === "ar"
                        ? errors.birthDate.type === "validate"
                          ? "يجب أن يكون عمر الوالد أكبر من 20 عامًا"
                          : "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? errors.birthDate.type === "validate"
                            ? "Le parent doit avoir plus de 20 ans"
                            : "Ce champ est requis"
                          : "This field is required"}
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
                      : "About"}
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
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="occupation_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Occupation EN"
                  : currentLanguage === "ar"
                    ? "الوظيفة بالإنجليزية"
                    : currentLanguage === "fr"
                      ? "Occupation EN"
                      : "Occupation EN"}
                <input
                  id="occupation_en"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("occupation_en", { required: true })}
                />
                {errors.occupation_en && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}
                  </span>
                )}
              </label>

              <label
                htmlFor="occupation_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Occupation AR"
                  : currentLanguage === "ar"
                    ? "الوظيفة بالعربية"
                    : currentLanguage === "fr"
                      ? "Occupation AR"
                      : "Occupation AR"}
                <input
                  id="occupation_ar"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("occupation_ar", { required: true })}
                />
                {errors.occupation_ar && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}
                  </span>
                )}
              </label>
              <label
                htmlFor="occupation_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Occupation FR"
                  : currentLanguage === "ar"
                    ? "الوظيفة بالفرنسية"
                    : currentLanguage === "fr"
                      ? "Occupation FR"
                      : "Occupation FR"}
                <input
                  id="occupation_fr"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("occupation_fr", { required: true })}
                />
                {errors.occupation_fr && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
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
                      : currentLanguage === "fr"
                        ? "Ajout en cours..."
                        : "Adding..."
                  : currentLanguage === "en"
                    ? "Add Parent"
                    : currentLanguage === "ar"
                      ? "إضافة ولي الأمر"
                      : currentLanguage === "fr"
                        ? "Ajouter un parent"
                        : "Add Parent"}{" "}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddNewParent;
