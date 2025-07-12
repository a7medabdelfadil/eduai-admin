"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCoursesMutation,
} from "@/features/Acadimic/courseApi";
import { useGetAllCountryCodeQuery, useGetAllLanguagesQuery, useGetAllLevelsQuery, useGetAllRegistrationsQuery, useGetAllSecondarySchoolDepartmentsQuery, useGetAllSecondarySchoolSubDepartmentsQuery, useGetAllSemesterQuery } from "@/features/signupApi";
import { useGetAllEducationsQuery } from "@/features/User-Management/studentApi";
import { useRouter } from "next/navigation";
import Select from "react-select";

interface EditCourseProps {
  params: {
    courseId: string;
  };
}

const EditCourse = ({ params }: EditCourseProps) => {
  const breadcrumbs = [
    { nameEn: "Academic", nameAr: "أكاديمي", nameFr: "Académique", href: "/" },
    {
      nameEn: "Course Management",
      nameAr: "إدارة الدورات",
      nameFr: "Gestion des cours",
      href: "/course/course-management",
    },
    {
      nameEn: "Edit Course",
      nameAr: "تعديل الدورة",
      nameFr: "Modifier le cours",
      href: `/course/course-management/${params.courseId}`,
    },
  ];
  const router = useRouter();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const {
    data: subDepartmentsData,
    isLoading: subDepartmentsLoading,
  } = useGetAllSecondarySchoolSubDepartmentsQuery(selectedDepartment, {
    skip: !selectedDepartment,
  });
  const { data: allCoursesData } = useGetAllCoursesQuery(null);
  const { data: eduSystemsData, isLoading: eduSystemsLoading } = useGetAllEducationsQuery(null);
  const { data: countryCodesData, isLoading: countryCodesLoading } = useGetAllCountryCodeQuery(null);
  const { data: departmentsData, isLoading: departmentsLoading } = useGetAllSecondarySchoolDepartmentsQuery(null);
  const { data: semestersData, isLoading: semestersLoading } = useGetAllSemesterQuery(null);
  const { data: languagesData, isLoading: languagesLoading } = useGetAllLanguagesQuery(null);
  const { data: levelsData, isLoading: levelsLoading } = useGetAllLevelsQuery(null);
  const { data: registrationsData, isLoading: registrationsLoading } = useGetAllRegistrationsQuery(null);

  const { data, isLoading, refetch } = useGetCourseByIdQuery(params.courseId);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCoursesMutation();

  useEffect(() => {
    if (data && data.data) {
      const d = data.data;

      const reverseMap = (obj: Record<string, string>, label: string) =>
        Object.entries(obj).find(([_, v]) => v === label)?.[0] || "";

      const findEduSystemId = () =>
        eduSystemsData?.data?.content.find((e: any) => e.name === d.eduSystemName)?.id || "";

      const deptKey = reverseMap(departmentsData?.data || {}, d.secondarySchoolDepartment);
      const subDeptKey = reverseMap(subDepartmentsData?.data || {}, d.subDepartment);

      setSelectedDepartment(deptKey);

      setValue("code", d.code);
      setValue("name_en", d.name_en);
      setValue("name_fr", d.name_fr);
      setValue("name_ar", d.name_ar);
      setValue("description_en", d.description_en);
      setValue("description_fr", d.description_fr);
      setValue("description_ar", d.description_ar);
      setValue("countryId", "1");
      setValue("level", reverseMap(levelsData?.data || {}, d.level));
      setValue("eduSystemId", String(findEduSystemId()));
      setValue("coefficient", String(d.coefficient));
      setValue("semesterName", reverseMap(semestersData?.data || {}, d.semesterName));
      setValue("secondarySchoolDepartment", deptKey);
      setValue("subDepartment", subDeptKey);
      setValue("prerequisiteIds", d.prerequisiteIds || []);
      setValue("registrationType", d.registrationType);
      setValue("language", d.language);

    }
  }, [data, levelsData, registrationsData, languagesData, semestersData, departmentsData, eduSystemsData]);

  useEffect(() => {
    if (!selectedDepartment || !subDepartmentsData?.data || !data?.data) return;

    const d = data.data;
    const reverseMap = (obj: Record<string, string>, label: string) =>
      Object.entries(obj).find(([_, v]) => v === label)?.[0] || "";

    const subDeptKey = reverseMap(subDepartmentsData.data, d.subDepartment);
    if (subDeptKey) {
      setValue("subDepartment", subDeptKey);
    }
  }, [selectedDepartment, subDepartmentsData, data]);

  const onSubmit = async (formData: any) => {
    try {
      await updateCourse({ formData, id: params.courseId }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تعديل الدورة بنجاح"
          : currentLanguage === "fr"
            ? "Cours modifié avec succès"
            : "Course Edited successfully",
      );
      refetch();
      Object.keys(formData).forEach((key) => setValue(key, ""));
      router.push("/course/course-management");
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const courseOptions = allCoursesData?.data?.content?.map((course: any) => ({
    value: course.id,
    label: course.name,
  })) || [];

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
        <div dir={currentLanguage == "ar" ? "rtl" : "ltr"} className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Course"
              : currentLanguage === "ar"
                ? "تعديل الدورة"
                : "Modifier le cours"}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%] grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Course Code"
                : currentLanguage === "ar"
                  ? "رمز الدورة"
                  : "Code du cours"}              <input {...register("code", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.code && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Course Name (en)"
                : currentLanguage === "ar"
                  ? "اسم الدورة (بالإنجليزية)"
                  : "Nom du cours (en)"}              <input {...register("name_en", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.name_en && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Course Name (fr)"
                : currentLanguage === "ar"
                  ? "اسم الدورة (بالفرنسية)"
                  : "Nom du cours (fr)"}
              <input {...register("name_fr", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.name_fr && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Course Name (ar)"
                : currentLanguage === "ar"
                  ? "اسم الدورة (بالعربية)"
                  : "Nom du cours (ar)"}
              <input {...register("name_ar", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.name_ar && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Description (en)"
                : currentLanguage === "ar"
                  ? "وصف الدورة (بالإنجليزية)"
                  : "Description (en)"}              <input {...register("description_en", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.description_en && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Course Name (ar)"
                : currentLanguage === "ar"
                  ? "اسم الدورة (بالعربية)"
                  : "Nom du cours (ar)"}
              <input {...register("description_fr", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.description_fr && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Description (ar)"
                : currentLanguage === "ar"
                  ? "وصف الدورة (بالعربية)"
                  : "Description (ar)"}
              <input {...register("description_ar", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.description_ar && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Country"
                : currentLanguage === "ar"
                  ? "الدولة"
                  : "Pays"}              <select
                    {...register("countryId", { required: true })}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">{countryCodesLoading ? "Loading..." :
                  (currentLanguage === "en" ? "Select country" : currentLanguage === "ar" ? "اختر الدولة" : "Sélectionnez un pays")}
                </option>
                {!countryCodesLoading &&
                  countryCodesData &&
                  Object.entries(countryCodesData.data).map(([code, id]) => (
                    <option key={code as string} value={id as number}>
                      {`${code} (+${id})`}
                    </option>
                  ))}
              </select>
              {errors.countryId && (
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
              {currentLanguage === "en"
                ? "Level"
                : currentLanguage === "ar"
                  ? "المستوى"
                  : "Niveau"}              <select
                    {...register("level", { required: true })}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">{levelsLoading ? (currentLanguage === "en"
                  ? "Loading..."
                  : currentLanguage === "ar"
                    ? "جارٍ التحميل..."
                    : "Chargement...") : (currentLanguage === "en"
                      ? "Level"
                      : currentLanguage === "ar"
                        ? "المستوى"
                        : "Niveau")}</option>
                {!levelsLoading &&
                  levelsData &&
                  Object.entries(levelsData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.level && (
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
              {currentLanguage === "en"
                ? "Registration Type"
                : currentLanguage === "ar"
                  ? "نوع التسجيل"
                  : "Type d'inscription"}              <select
                    {...register("registrationType", { required: true })}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value=""> {registrationsLoading
                  ? (currentLanguage === "en"
                    ? "Loading..."
                    : currentLanguage === "ar"
                      ? "جارٍ التحميل..."
                      : "Chargement...")
                  : currentLanguage === "en"
                    ? "Select registration type"
                    : currentLanguage === "ar"
                      ? "اختر نوع التسجيل"
                      : "Sélectionnez le type d'inscription"}</option>
                {!registrationsLoading &&
                  registrationsData &&
                  Object.entries(registrationsData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.registrationType && (
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
              {currentLanguage === "en"
                ? "Language"
                : currentLanguage === "ar"
                  ? "اللغة"
                  : "Langue"}              <select
                    {...register("language", { required: true })}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">{languagesLoading
                  ? (currentLanguage === "en"
                    ? "Loading..."
                    : currentLanguage === "ar"
                      ? "جارٍ التحميل..."
                      : "Chargement...")
                  : (currentLanguage === "en"
                    ? "Select language"
                    : currentLanguage === "ar"
                      ? "اختر اللغة"
                      : "Sélectionnez une langue")}
                </option>
                {!languagesLoading &&
                  languagesData &&
                  Object.entries(languagesData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.language && (
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
              {currentLanguage === "en"
                ? "Coefficient"
                : currentLanguage === "ar"
                  ? "المعامل"
                  : "Coefficient"}
              <input {...register("coefficient", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              {errors.coefficient && <span className="text-error"> {currentLanguage === "ar"
                ? "هذا الحقل مطلوب"
                : currentLanguage === "fr"
                  ? "Ce champ est requis"
                  : "This field is required"}</span>}
            </label>

            <label className="grid text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "Semester"
                : currentLanguage === "ar"
                  ? "الفصل الدراسي"
                  : "Semestre"}              <select
                    {...register("semesterName", { required: true })}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">
                  {semestersLoading
                    ? (currentLanguage === "en"
                      ? "Loading..."
                      : currentLanguage === "ar"
                        ? "جارٍ التحميل..."
                        : "Chargement...")
                    : (currentLanguage === "en"
                      ? "Select semester"
                      : currentLanguage === "ar"
                        ? "اختر الفصل الدراسي"
                        : "Sélectionnez un semestre")}</option>
                {!semestersLoading &&
                  semestersData &&
                  Object.entries(semestersData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.semesterName && (
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
              {currentLanguage === "en"
                ? "Department"
                : currentLanguage === "ar"
                  ? "القسم"
                  : "Département"}              <select
                    {...register("secondarySchoolDepartment", { required: true })}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setValue("secondarySchoolDepartment", e.target.value);
                      setValue("subDepartment", "");
                    }}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">{departmentsLoading
                  ? (currentLanguage === "en"
                    ? "Loading..."
                    : currentLanguage === "ar"
                      ? "جارٍ التحميل..."
                      : "Chargement...")
                  : (currentLanguage === "en"
                    ? "Select department"
                    : currentLanguage === "ar"
                      ? "اختر القسم"
                      : "Sélectionnez un département")}</option>
                {!departmentsLoading &&
                  departmentsData &&
                  Object.entries(departmentsData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.secondarySchoolDepartment && (
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
              {currentLanguage === "en"
                ? "Sub Department"
                : currentLanguage === "ar"
                  ? "القسم الفرعي"
                  : "Sous-département"}              <select
                    {...register("subDepartment", { required: true })}
                    disabled={!selectedDepartment}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  >
                <option value="">
                  {subDepartmentsLoading
                    ? (currentLanguage === "en"
                      ? "Loading..."
                      : currentLanguage === "ar"
                        ? "جارٍ التحميل..."
                        : "Chargement...")
                    : (currentLanguage === "en"
                      ? "Select sub department"
                      : currentLanguage === "ar"
                        ? "اختر القسم الفرعي"
                        : "Sélectionnez un sous-département")}</option>
                {!subDepartmentsLoading &&
                  subDepartmentsData &&
                  Object.entries(subDepartmentsData.data).map(([value, label]) => (
                    <option key={value} value={value}>
                      {String(label)}
                    </option>
                  ))}
              </select>
              {errors.subDepartment && (
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
              {currentLanguage === "en"
                ? "Prerequisite Courses"
                : currentLanguage === "ar"
                  ? "المقررات المطلوبة"
                  : "Cours préalables"}
              <Controller
                control={control}
                name="prerequisiteIds"
                render={({ field }) => (
                  <Select
                    isMulti
                    options={courseOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={courseOptions.filter((opt: any) => field.value?.includes(opt.value))}
                    onChange={(selected) => field.onChange(selected.map((opt) => opt.value))}
                  />
                )}
              />
            </label>

            <div className="col-span-2 flex justify-center text-center mt-4">
              {isUpdating ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "ar"
                    ? "حفظ"
                    : currentLanguage === "fr"
                      ? "Enregistrer"
                      : "Save"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditCourse;
