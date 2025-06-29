"use client";
import Spinner from "@/components/spinner";
/* eslint-disable @next/next/no-img-element */
import { useGetAllCurrentUserQuery } from "@/features/dashboard/dashboardApi";
import {
  useUpdateCurrentUserMutation,
  useUpdatePictureMutation,
} from "@/features/User-Management/employeeApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import SearchableSelect from "@/components/select";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { BaseSyntheticEvent } from "react";
import { FaCamera } from "react-icons/fa";
import Container from "@/components/Container";

const Profile = () => {
  const [fileName, setFileName] = useState("");
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
  } = useGetAllCurrentUserQuery(null);
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
  const { data: rigiond } = useGetAllReginionIDQuery(null);
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
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
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // For the image form
  const { register: registerIMG, handleSubmit: handleIMG } = useForm();

  // Use effect to set default values when userData is available
  useEffect(() => {
    if (userData) {
      setValue("username", userData.data.username);
      setValue("email", userData.data.email);
      setValue("nid", userData.data.nid);
      setValue("about", userData.data.about);
      setValue("gender", userData.data.gender.toUpperCase());
      setValue("nationality", userData.data.nationality.toUpperCase());
      setValue("religion", "OTHERS");
      setValue("birthDate", userData.data.birthDate);
      setValue("regionId", userData.data.regionId);
      setValue("name_en", userData.data.name);
      setValue("phone", userData.data.phoneNumber);
      setValue("qualification", userData.data.qualification);
    }
  }, [userData, setValue]);
  const [updatePicture, { isLoading: isPicture }] = useUpdatePictureMutation();
  const [UpdateUser, { isLoading }] = useUpdateCurrentUserMutation();

  const onSubmit = async (data: any) => {
    try {
      await UpdateUser(data).unwrap();
      toast.success("User Updated successfully");
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

  const onSubmitPicture = async (data: any, event?: BaseSyntheticEvent) => {
    if (event) event.preventDefault(); // منع السلوك الافتراضي
    const formData = new FormData();
    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    } else {
      toast.error("No picture selected");
      return;
    }
    try {
      await updatePicture(formData).unwrap();
      refetch();
      toast.success("Picture updated successfully");
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || userLoading || nationalityLoading || isCountryCode)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid h-full w-full rounded-xl bg-bgPrimary p-7">
            <div>
              <div className="justify-left mb-5 ml-4 flex gap-5 text-[18px] font-semibold">
                <Link href="/profile" className="text-primary underline">
                  {currentLanguage === "ar"
                    ? "ملفي الشخصي"
                    : currentLanguage === "fr"
                      ? "Mon profil"
                      : "My Profile"}
                </Link>
                <Link href="/profile/password">
                  {currentLanguage === "ar"
                    ? "كلمة المرور"
                    : currentLanguage === "fr"
                      ? "Mot de passe"
                      : "Password"}
                </Link>
              </div>
            </div>
            <div className="grid rounded-xl border-2 border-borderPrimary">
              <div className="text-semibold flex h-full w-full justify-between rounded-xl bg-bgPrimary p-5">
                <div className="text-semibold flex items-center gap-2 text-[15px] text-textPrimary">
                  <div className="flex items-center">
                    <label className="cursor-pointer">
                      <FaCamera className="translate-x-10 translate-y-2 text-gray-500" />

                      <img
                        src={userData.data?.picture ?? "/images/userr.png"}
                        className="mx-2 h-[40px] w-[40px] rounded-full"
                        alt="User"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="h-0 w-0 opacity-0"
                        {...registerIMG("picture")}
                        onChange={e => {
                          const fileList = e.target.files;
                          if (fileList && fileList.length > 0) {
                            setFileName(fileList[0].name); // Update the state with the selected file name
                          } else {
                            setFileName(""); // Reset if no file is selected
                          }
                        }}
                      />
                    </label>
                  </div>
                  <span className="grid font-semibold">
                    <p>{userData.data?.username || "Username"}</p>
                    <p>{userData.data?.role || "Role"}</p>
                    <p>
                      {currentLanguage === "ar"
                        ? "الرقم التعريفي:"
                        : currentLanguage === "fr"
                          ? "ID :"
                          : "ID:"}{" "}
                      <span className="text-textSecondary">
                        {userData.data?.id}
                      </span>
                    </p>
                  </span>
                </div>
                <div className="">
                  <button
                    type="button" // Change button type to 'button' to prevent form submission
                    onClick={handleIMG(onSubmitPicture)}
                    className="flex gap-1 rounded-full border border-borderPrimary px-3 py-1 font-semibold text-textPrimary"
                  >
                    {isPicture
                      ? currentLanguage === "ar"
                        ? "جاري الحفظ..."
                        : currentLanguage === "fr"
                          ? "Sauvegarde en cours..."
                          : "Saving..."
                      : currentLanguage === "ar"
                        ? "حفظ"
                        : currentLanguage === "fr"
                          ? "Sauvegarder"
                          : "Save"}
                    <svg
                      className="h-6 w-6 text-gray-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                </div>
              </div>
              {fileName && (
                <p className="ml-2 text-textSecondary">{fileName}</p>
              )}
            </div>
            <div className="text-semibold mt-5 flex h-full w-full rounded-xl border-2 border-borderPrimary bg-bgPrimary p-5">
              <div className="grid w-full gap-2">
                <div className="flex w-full justify-between">
                  <h1 className="text-[20px] font-bold">
                    {currentLanguage === "ar"
                      ? "معلومات المشرف"
                      : currentLanguage === "fr"
                        ? "Informations sur l'administrateur"
                        : "Admin Information"}
                  </h1>
                  <div>
                    <button
                      type="submit"
                      className="flex gap-1 rounded-full border border-borderPrimary px-3 py-1 font-semibold text-textPrimary"
                    >
                      {isLoading
                        ? currentLanguage === "ar"
                          ? "جاري الحفظ..."
                          : currentLanguage === "fr"
                            ? "Sauvegarde en cours..."
                            : "Saving..."
                        : currentLanguage === "ar"
                          ? "حفظ"
                          : currentLanguage === "fr"
                            ? "Sauvegarder"
                            : "Save"}
                      <svg
                        className="h-6 w-6 text-gray-500"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
                  <label className="grid text-[18px] font-semibold">
                    {currentLanguage === "ar"
                      ? "اسم المستخدم"
                      : currentLanguage === "fr"
                        ? "Nom d'utilisateur"
                        : "Username"}
                    <input
                      {...register("username")}
                      type="text"
                      className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    />
                  </label>
                  <label className="grid text-[18px] font-semibold">
                    {currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Email"
                        : "Email"}
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    />
                  </label>
                  <label className="grid text-[18px] font-semibold">
                    {currentLanguage === "ar"
                      ? "الرقم الوطني"
                      : currentLanguage === "fr"
                        ? "NID"
                        : "NID"}

                    <input
                      {...register("nid")}
                      type="text"
                      className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    />
                  </label>
                  <label className="grid text-[18px] font-semibold">
                    {currentLanguage === "ar"
                      ? "حول"
                      : currentLanguage === "fr"
                        ? "À propos"
                        : "About"}

                    <input
                      {...register("about")}
                      type="text"
                      className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    />
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
                            ? "Sélectionner le sexe"
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
                            ? "Sélectionner la nationalité"
                            : "Select Nationality"}
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
                    className="grid w-full text-[18px] font-semibold max-[471px]:w-[350px]"
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
                  <PhoneNumberInput
                    countryCodeData={countryCode.data}
                    currentLanguage="en"
                    label="Your Phone Number"
                    register={register}
                    errors={errors}
                    control={control}
                  />
                  <label
                    htmlFor="name_en"
                    className="grid text-[18px] font-semibold"
                  >
                    {currentLanguage === "ar"
                      ? "الاسم (إنجليزي)"
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
                    htmlFor="qualification"
                    className="mt-4 grid items-center text-[18px] font-semibold"
                  >
                    {currentLanguage === "ar"
                      ? "المؤهل"
                      : currentLanguage === "fr"
                        ? "Qualification"
                        : "Qualification"}
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
                            ? "Sélectionner la qualification"
                            : "Select qualification"}
                      </option>
                      <option value="HIGH_SCHOOL_DIPLOMA">
                        {currentLanguage === "ar"
                          ? "دبلوم المدرسة الثانوية"
                          : currentLanguage === "fr"
                            ? "Diplôme de lycée"
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
                      ? "الاسم (عربي)"
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
                      ? "الاسم (فرنسي)"
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
                  <label className="grid text-[18px] font-semibold">
                    {currentLanguage === "ar"
                      ? "تاريخ الميلاد"
                      : currentLanguage === "fr"
                        ? "Date de naissance"
                        : "Birth Date"}
                    <input
                      {...register("birthDate")}
                      type="date"
                      className="w-full rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default Profile;
