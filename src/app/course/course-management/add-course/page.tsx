"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useCreateCoursesMutation, useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";
import {
    useGetAllCountryCodeQuery,
    useGetAllLanguagesQuery,
    useGetAllLevelsQuery,
    useGetAllRegistrationsQuery,
    useGetAllSecondarySchoolDepartmentsQuery,
    useGetAllSecondarySchoolSubDepartmentsQuery,
    useGetAllSemesterQuery,
} from "@/features/signupApi";
import { useGetAllEducationsQuery } from "@/features/User-Management/studentApi";
import { useRouter } from "next/navigation";
import Select from "react-select";

const CreateCourse = () => {
    const breadcrumbs = [
        { nameEn: "Academic", nameAr: "أكاديمي", nameFr: "Académique", href: "/" },
        {
            nameEn: "Course Management",
            nameAr: "إدارة الدورات",
            nameFr: "Gestion des cours",
            href: "/course/course-management",
        },
        {
            nameEn: "Create Course",
            nameAr: "إنشاء دورة",
            nameFr: "Créer un cours",
            href: `/course/course-management/add-course`,
        },
    ];

    const router = useRouter();
    const { language: currentLanguage, loading } = useSelector((state: RootState) => state.language);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const { data: subDepartmentsData, isLoading: subDepartmentsLoading } = useGetAllSecondarySchoolSubDepartmentsQuery(selectedDepartment, { skip: !selectedDepartment });
    const { data: allCoursesData } = useGetAllCoursesQuery(null);
    const { data: eduSystemsData } = useGetAllEducationsQuery(null);
    const { data: countryCodesData, isLoading: countryCodesLoading } = useGetAllCountryCodeQuery(null);
    const { data: departmentsData, isLoading: departmentsLoading } = useGetAllSecondarySchoolDepartmentsQuery(null);
    const { data: semestersData, isLoading: semestersLoading } = useGetAllSemesterQuery(null);
    const { data: languagesData, isLoading: languagesLoading } = useGetAllLanguagesQuery(null);
    const { data: levelsData, isLoading: levelsLoading } = useGetAllLevelsQuery(null);
    const { data: registrationsData, isLoading: registrationsLoading } = useGetAllRegistrationsQuery(null);

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
    const [createCourse, { isLoading: isCreating }] = useCreateCoursesMutation();

    const onSubmit = async (formData: any) => {
        try {
            await createCourse(formData).unwrap();
            toast.success(
                currentLanguage === "ar"
                    ? "تم إنشاء الدورة بنجاح"
                    : currentLanguage === "fr"
                        ? "Cours créé avec succès"
                        : "Course created successfully"
            );
            router.push("/course/course-management");
        } catch (err) {
            toast.error((err as { data: { message: string } }).data?.message);
        }
    };

    const courseOptions = allCoursesData?.data?.content?.map((course: any) => ({
        value: course.id,
        label: course.name,
    })) || [];


    if (loading) return (
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
                            ? "Create Course"
                            : currentLanguage === "ar"
                                ? "إنشاء دورة"
                                : "Créer un cours"}
                    </h1>
                </div>

                <form className="flex h-full w-full items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%] grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en"
                                ? "Course Code"
                                : currentLanguage === "ar"
                                    ? "رمز الدورة"
                                    : "Code du cours"}
                            <input {...register("code", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.code && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Course Name (en)" : currentLanguage === "ar" ? "اسم الدورة (بالإنجليزية)" : "Nom du cours (en)"}
                            <input {...register("name_en", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.name_en && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Course Name (fr)" : currentLanguage === "ar" ? "اسم الدورة (بالفرنسية)" : "Nom du cours (fr)"}
                            <input {...register("name_fr", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.name_fr && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Course Name (ar)" : currentLanguage === "ar" ? "اسم الدورة (بالعربية)" : "Nom du cours (ar)"}
                            <input {...register("name_ar", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.name_ar && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Description (en)" : currentLanguage === "ar" ? "وصف الدورة (بالإنجليزية)" : "Description (en)"}
                            <input {...register("description_en", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.description_en && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Description (fr)" : currentLanguage === "ar" ? "وصف الدورة (بالفرنسية)" : "Description (fr)"}
                            <input {...register("description_fr", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.description_fr && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Description (ar)" : currentLanguage === "ar" ? "وصف الدورة (بالعربية)" : "Description (ar)"}
                            <input {...register("description_ar", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.description_ar && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Country" : currentLanguage === "ar" ? "الدولة" : "Pays"}
                            <select {...register("countryId", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{countryCodesLoading ? "Loading..." : currentLanguage === "en" ? "Select country" : currentLanguage === "ar" ? "اختر الدولة" : "Sélectionnez un pays"}</option>
                                {!countryCodesLoading && countryCodesData &&
                                    Object.entries(countryCodesData.data).map(([code, id]) => (
                                        <option key={code as string} value={id as number}>{`${code} (+${id})`}</option>
                                    ))}
                            </select>
                            {errors.countryId && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Level" : currentLanguage === "ar" ? "المستوى" : "Niveau"}
                            <select {...register("level", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{levelsLoading ? "Loading..." : currentLanguage === "en" ? "Level" : currentLanguage === "ar" ? "المستوى" : "Niveau"}</option>
                                {!levelsLoading && levelsData &&
                                    Object.entries(levelsData.data).map(([value, label]) => (
                                        <option key={value} value={value}>{String(label)}</option>
                                    ))}
                            </select>
                            {errors.level && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Registration Type" : currentLanguage === "ar" ? "نوع التسجيل" : "Type d'inscription"}
                            <select {...register("registrationType", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{registrationsLoading ? "Loading..." : currentLanguage === "en" ? "Select registration type" : currentLanguage === "ar" ? "اختر نوع التسجيل" : "Sélectionnez le type d'inscription"}</option>
                                {!registrationsLoading && registrationsData &&
                                    Object.entries(registrationsData.data).map(([value, label]) => (
                                        <option key={value} value={value}>{String(label)}</option>
                                    ))}
                            </select>
                            {errors.registrationType && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Language" : currentLanguage === "ar" ? "اللغة" : "Langue"}
                            <select {...register("language", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{languagesLoading ? "Loading..." : currentLanguage === "en" ? "Select language" : currentLanguage === "ar" ? "اختر اللغة" : "Sélectionnez une langue"}</option>
                                {!languagesLoading && languagesData &&
                                    Object.entries(languagesData.data).map(([value, label]) => (
                                        <option key={value} value={value}>{String(label)}</option>
                                    ))}
                            </select>
                            {errors.language && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Coefficient" : currentLanguage === "ar" ? "المعامل" : "Coefficient"}
                            <input {...register("coefficient", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
                            {errors.coefficient && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Semester" : currentLanguage === "ar" ? "الفصل الدراسي" : "Semestre"}
                            <select {...register("semesterName", { required: true })} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{semestersLoading ? "Loading..." : currentLanguage === "en" ? "Select semester" : currentLanguage === "ar" ? "اختر الفصل الدراسي" : "Sélectionnez un semestre"}</option>
                                {!semestersLoading && semestersData &&
                                    Object.entries(semestersData.data).map(([value, label]) => (
                                        <option key={value} value={value}>{String(label)}</option>
                                    ))}
                            </select>
                            {errors.semesterName && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>

                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Department" : currentLanguage === "ar" ? "القسم" : "Département"}
                            <select {...register("secondarySchoolDepartment", { required: true })} onChange={(e) => { setSelectedDepartment(e.target.value); setValue("secondarySchoolDepartment", e.target.value); setValue("subDepartment", ""); }} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]">
                                <option value="">{departmentsLoading ? "Loading..." : currentLanguage === "en" ? "Select department" : currentLanguage === "ar" ? "اختر القسم" : "Sélectionnez un département"}</option>
                                {!departmentsLoading && departmentsData &&
                                    Object.entries(departmentsData.data).map(([value, label]) => (
                                        <option key={value} value={value}>{String(label)}</option>
                                    ))}
                            </select>
                            {errors.secondarySchoolDepartment && <span className="text-error">{currentLanguage === "ar" ? "هذا الحقل مطلوب" : currentLanguage === "fr" ? "Ce champ est requis" : "This field is required"}</span>}
                        </label>
                        <label className="grid text-[18px] font-semibold">
                            {currentLanguage === "en" ? "Sub Department" : currentLanguage === "ar" ? "القسم الفرعي" : "Sous-département"}
                            <select
                                {...register("subDepartment", { required: true })}
                                disabled={!selectedDepartment}
                                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                            >
                                <option value="">
                                    {subDepartmentsLoading
                                        ? currentLanguage === "en"
                                            ? "Loading..."
                                            : currentLanguage === "ar"
                                                ? "جارٍ التحميل..."
                                                : "Chargement..."
                                        : currentLanguage === "en"
                                            ? "Select sub department"
                                            : currentLanguage === "ar"
                                                ? "اختر القسم الفرعي"
                                                : "Sélectionnez un sous-département"}
                                </option>
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
                            {currentLanguage === "en" ? "Education System" : currentLanguage === "ar" ? "النظام التعليمي" : "Système éducatif"}
                            <select
                                {...register("eduSystemId", { required: true })}
                                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                            >
                                <option value="">
                                    {eduSystemsData?.data?.content
                                        ? currentLanguage === "en"
                                            ? "Select system"
                                            : currentLanguage === "ar"
                                                ? "اختر النظام"
                                                : "Sélectionnez un système"
                                        : currentLanguage === "en"
                                            ? "Loading..."
                                            : currentLanguage === "ar"
                                                ? "جارٍ التحميل..."
                                                : "Chargement..."}
                                </option>
                                {eduSystemsData?.data?.content?.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.eduSystemId && (
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
                            {isCreating ? (
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

export default CreateCourse;
