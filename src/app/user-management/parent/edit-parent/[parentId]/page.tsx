"use client";
import Spinner from "@/components/spinner";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import {
  useGetParentByIdQuery,
  useUpdateParentsMutation,
} from "@/features/User-Management/parentApi";
import { useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import SearchableSelect from "@/components/select";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";

interface ViewParentProps {
  params: {
    parentId: string;
  };
}

const EditParent: React.FC<ViewParentProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Parent",
      nameAr: "ولي الأمر",
      nameFr: "Parent",
      href: "/user-management/parent",
    },
    {
      nameEn: "Edit Parent",
      nameAr: "تعديل ولي الأمر",
      nameFr: "Modifier le parent",
      href: `/user-management/parent/edit-parent/${params.parentId}`,
    },
  ];
  const router = useRouter();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const { data, error, isLoading } = useGetParentByIdQuery(params.parentId);
  const [updateParent, { isLoading: isUpdating }] = useUpdateParentsMutation();
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
  const { data: countryCode, isLoading: isCountryCode } =
    useGetAllCountryCodeQuery(null);
  const { data: nationalityData } = useGetAllNationalitysQuery(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (data) {
      setValue("email", data?.data?.email);
      setValue("nid", data?.data?.nid);
      setValue("about", data?.data?.about);
      setValue("number", data?.data?.number);
      setValue("salary", data?.data?.salary);
      setValue("name_en", data?.data?.name);
      setValue("name_ar", "");
      setValue("name_fr", "");
      setValue("birthDate", data?.data?.birthDate);
    }
  }, [data, error]);

  const onSubmit = async (data: any) => {
    const formData = { ...data, religion: "OTHERS" };
    try {
      await updateParent({ formData: formData, id: params.parentId }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث الوالدين بنجاح"
          : currentLanguage === "fr"
            ? "Parents mis à jour avec succès"
            : "Parent Updated successfully",
      );
      router.push('/user-management/parent')
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
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
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Parent"
              : currentLanguage === "ar"
                ? "تعديل ولي الأمر"
                : currentLanguage === "fr"
                  ? "Modifier le parent"
                  : "Edit Parent"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
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
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              {/* Input fields for parent information */}
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
                    Object.entries(nationalityData?.data).map(
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
                countryCodeData={
                  countryCode?.data !== null ? countryCode?.data : {}
                }
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
                    ? "Update Parent"
                    : currentLanguage === "ar"
                      ? "تحديث ولي الأمر"
                      : currentLanguage === "fr"
                        ? "Modifier un parent"
                        : "Add Parent"}{" "}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditParent;
