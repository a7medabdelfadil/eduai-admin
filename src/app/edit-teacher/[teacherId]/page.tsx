"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import {
  useGetTeacherByIdQuery,
  useUpdateTeachersMutation,
} from "@/features/User-Management/teacherApi";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetAllCountryCodeQuery,
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import SearchableSelect from "@/components/select";
import MultiSelectComponent from "@/components/multiSelect";
import PhoneNumberInput from "@/components/PhoneNumberInput";

interface ViewTeacherProps {
  params: {
    teacherId: string;
  };
}

const EditTeacher: React.FC<ViewTeacherProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Teacher",
      nameAr: "معلم",
      nameFr: "Enseignant",
      href: "/teacher",
    },
    {
      nameEn: "Edit Teacher",
      nameAr: "تعديل المعلم",
      nameFr: "Modifier l'enseignant",
      href: `/edit-teacher/${params.teacherId}`,
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, isLoading } = useGetTeacherByIdQuery(params.teacherId);
  const [updateTeacher, { isLoading: isUpdating }] =
    useUpdateTeachersMutation();
  const { data: nationalityData, isLoading: nationalityLoading } =
    useGetAllNationalitysQuery(null);
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

  const formMethods = useForm({
    defaultValues: {
      email: "",
      nid: "",
      about: "",
      gender: "",
      nationality: "",
      religion: "",
      birthDate: "",
      regionId: 0,
      name_en: "",
      name_ar: "",
      name_fr: "",
      number: "",
      qualification: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = formMethods;

  useEffect(() => {
    if (data && data.success) {
      const teacher = data.data;
      setValue("email", teacher.email || "");
      setValue("nid", teacher.nid || "");
      setValue("about", teacher.about || "");
      setValue("gender", "");
      setValue("nationality", "");
      setValue("religion", teacher.religion || "");
      setValue("birthDate", teacher.birthDate || "");
      setValue("regionId", teacher.regionId || 0);
      setValue("name_en", teacher.name || "");
      setValue("name_ar", "");
      setValue("name_fr", "");
      setValue("number", teacher.number || "");
      setValue("qualification", teacher.qualification || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData: any) => {
    const data = { ...formData, religion: "OTHERS" };
    try {
      await updateTeacher({ id: params.teacherId, formData: data }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث المعلم بنجاح"
          : currentLanguage === "fr"
            ? "Enseignant mis à jour avec succès"
            : "Teacher updated successfully",
      );
    } catch (err) {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في تحديث المعلم"
          : currentLanguage === "fr"
            ? "Échec de la mise à jour de l'enseignant"
            : "Failed to update teacher",
      );
    }
  };

  if (loading || isLoading || isSubmitting || nationalityLoading)
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
        } mx-3 mt-5 grid h-[850px] items-center justify-center`}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-10 grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
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
              <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-error">This field is required</span>
                  )}
                </label>
                <MultiSelectComponent
                  control={control}
                  currentLanguage={currentLanguage}
                  errors={errors}
                />

                <label htmlFor="nid" className="grid text-[18px] font-semibold">
                  {currentLanguage === "en"
                    ? "NID"
                    : currentLanguage === "ar"
                      ? "الرقم الوطني"
                      : "NID"}
                  <input
                    id="nid"
                    type="number"
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                  countryCodeData={countryCode?.data}
                  currentLanguage="en"
                  label="Your Phone Number"
                  register={register}
                  errors={errors}
                  control={control}
                />
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
              </div>
              <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                    className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
                          ? "The Teacher Must be older than 20"
                          : "This field is required"
                        : currentLanguage === "ar"
                          ? errors.birthDate.type === "validate"
                            ? "يجب أن يكون عمر المعلم أكبر من 20 عامًا"
                            : "هذا الحقل مطلوب"
                          : currentLanguage === "fr"
                            ? errors.birthDate.type === "validate"
                              ? "L'enseignant doit avoir plus de 20 ans"
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
                    className="h-[55px] w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
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
              <div className="flex justify-center text-center">
                {isUpdating ? (
                  <Spinner />
                ) : (
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                  >
                    {currentLanguage === "ar"
                      ? "تعديل المعلم"
                      : currentLanguage === "fr"
                        ? "Modifier l'enseignant"
                        : "Edit Teacher"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default EditTeacher;
