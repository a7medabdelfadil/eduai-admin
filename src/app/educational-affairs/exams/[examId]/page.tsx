"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useUpdateExamMutation } from "@/features/Acadimic/examsApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import Container from "@/components/Container";

interface ParamsType {
  params: {
    examId: number;
  };
}

const EditExam = ({ params }: ParamsType) => {
  type Teacher = Record<string, any>;

  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الدورات والموارد",
      nameFr: "Cours et Ressources",
      href: "/educational-affairs",
    },
    {
      nameEn: "Exams",
      nameAr: "الامتحانات",
      nameFr: "Examens",
      href: "/exams",
    },
    {
      nameEn: "Edit Exam",
      nameAr: "إضافة امتحان جديد",
      nameFr: "Ajouter un nouvel examen",
      href: `/educational-affairs/exams/${params.examId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createExam, { isLoading }] = useUpdateExamMutation();
  const { data: courses, isLoading: isCourses } = useGetAllCoursesQuery(null);
  const { data: classes, isLoading: isClasses } = useGetAllClasssQuery(null);
  const { data, isLoading: isTeacher } = useGetAllTeachersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const onSubmit = async (data: any) => {
    try {
      await createExam({ formData: data, id: params.examId }).unwrap();
      toast.success("Exam edited successfully");
    } catch (error: any) {
      toast.error(`${error.data.message}`);
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isCourses || isClasses || isTeacher)
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
              ? "Edit Exam"
              : currentLanguage === "ar"
                ? "إضافة امتحان جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouvel examen"
                  : "Edit Exam"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="mb-8 flex items-center justify-start gap-2">
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
                  ? "Exam Information"
                  : currentLanguage === "ar"
                    ? "معلومات الامتحان"
                    : currentLanguage === "fr"
                      ? "Informations sur l'examen"
                      : "Exam Information"}{" "}
                {/* default */}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="examDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Exam Date"
                  : currentLanguage === "ar"
                    ? "تاريخ الامتحان"
                    : currentLanguage === "fr"
                      ? "Date de l'examen"
                      : "Exam Date"}{" "}
                <input
                  id="examDate"
                  {...register("examDate", { required: true })}
                  type="date"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.examDate && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="examBeginning"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Exam Beginning"
                  : currentLanguage === "ar"
                    ? "بداية الامتحان"
                    : currentLanguage === "fr"
                      ? "Début de l'examen"
                      : "Exam Beginning"}{" "}
                <input
                  id="examBeginning"
                  {...register("examBeginning", { required: true })}
                  type="time"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.examBeginning && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Name"
                  : currentLanguage === "ar"
                    ? "الاسم"
                    : currentLanguage === "fr"
                      ? "Nom"
                      : "Name"}{" "}
                <input
                  id="name"
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.name && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="examEnding"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Exam Ending"
                  : currentLanguage === "ar"
                    ? "نهاية الامتحان"
                    : currentLanguage === "fr"
                      ? "Fin de l'examen"
                      : "Exam Ending"}{" "}
                <input
                  id="examEnding"
                  {...register("examEnding", { required: true })}
                  type="time"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.examEnding && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="teacherCourseRegistrationId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Teacher Course Registration ID"
                  : currentLanguage === "ar"
                    ? "معرف تسجيل دورة المدرس"
                    : currentLanguage === "fr"
                      ? "ID d'inscription au cours du professeur"
                      : "Teacher Course Registration ID"}{" "}
                <select
                  id="teacherCourseRegistrationId"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("teacherId", {
                    required: true,
                  })}
                >
                  <option selected value="">
                    Select Teacher
                  </option>
                  {data?.data.content.map((teacher: Teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="courseId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Course ID"
                  : currentLanguage === "ar"
                    ? "معرف تسجيل دورة"
                    : currentLanguage === "fr"
                      ? "ID d'inscription au cours"
                      : "Teacher Course Registration ID"}{" "}
                <select
                  id="courseId"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("courseId", {
                    required: true,
                  })}
                >
                  <option selected value="">
                    Select Course
                  </option>
                  {courses?.data.content.map((teacher: Teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="teacherCourseRegistrationId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Class Room ID"
                  : currentLanguage === "ar"
                    ? "معرف قاعة الدرس"
                    : currentLanguage === "fr"
                      ? "ID d'salle de classe"
                      : "Teacher Course Registration ID"}{" "}
                <select
                  id="teacherCourseRegistrationId"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("classroomId", {
                    required: true,
                  })}
                >
                  <option selected value="">
                    Select Class Room
                  </option>
                  {classes?.data.content.map((teacher: Teacher) => (
                    <option key={teacher.roomId} value={teacher.roomId}>
                      {teacher.classroomName}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
              <label
                htmlFor="examTypeId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Exam Type ID"
                  : currentLanguage === "ar"
                    ? "معرف نوع الامتحان"
                    : currentLanguage === "fr"
                      ? "ID du type d'examen"
                      : "Exam Type ID"}{" "}
                <input
                  id="examTypeId"
                  {...register("examTypeId", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.examTypeId && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-center text-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Edit Exam"
                    : currentLanguage === "ar"
                      ? "تعديل امتحان"
                      : currentLanguage === "fr"
                        ? "Amendement un examen"
                        : "Add Exam"}{" "}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditExam;
