"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateExamsMutation, useGetAllExamTypesNonTeacherQuery } from "@/features/Acadimic/examsApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useGetAllTeachersQuery, useGetClassroomsByCourseAndTeacherQuery, useGetCoursesByTeacherIdQuery } from "@/features/User-Management/teacherApi";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";

const AddExam = () => {
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
      href: "/educational-affairs/exams",
    },
    {
      nameEn: "Add New Exam",
      nameAr: "إضافة امتحان جديد",
      nameFr: "Ajouter un nouvel examen",
      href: "/educational-affairs/exams/add-exam",
    },
  ];

  const router = useRouter();

  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>("");

  const {
    data: teacherCourses,
    isLoading: isTeacherCoursesLoading,
  } = useGetCoursesByTeacherIdQuery(selectedTeacherId, {
    skip: !selectedTeacherId,
  });
  const {
    data: availableClassrooms,
    isLoading: isClassroomLoading,
  } = useGetClassroomsByCourseAndTeacherQuery(
    {
      teacherId: selectedTeacherId,
      courseId: selectedCourseId,
    },
    {
      skip: !selectedTeacherId || !selectedCourseId,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createExam, { isLoading }] = useCreateExamsMutation();
  const { data, isLoading: isTeacher } = useGetAllTeachersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const { data: courses, isLoading: isCourses } = useGetAllCoursesQuery(null);
  const { data: classes, isLoading: isClasses } = useGetAllClasssQuery(null);
  const { data: examTypes, isLoading: isExamTypesLoading } = useGetAllExamTypesNonTeacherQuery(null);

  const onSubmit = async (data: any) => {
    try {
      await createExam(data).unwrap();
      toast.success(
        currentLanguage === "en"
          ? "Exam created successfully"
          : currentLanguage === "ar"
            ? "تم إنشاء الامتحان بنجاح"
            : currentLanguage === "fr"
              ? "Examen créé avec succès"
              : "Exam created successfully"
      );
      router.push("/educational-affairs/exams");
      reset();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isTeacher || isCourses || isClasses)
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
              ? "Add New Exam"
              : currentLanguage === "ar"
                ? "إضافة امتحان جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouvel examen"
                  : "Add New Exam"}{" "}
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
                    onChange: e => setSelectedTeacherId(e.target.value),
                  })}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Teacher"
                      : currentLanguage === "ar"
                        ? "اختر المدرس"
                        : currentLanguage === "fr"
                          ? "Sélectionnez le professeur"
                          : "Select Teacher"}
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
                    onChange: e => setSelectedCourseId(e.target.value),
                  })}
                  disabled={!selectedTeacherId}
                >
                  <option value="">
                    {selectedTeacherId
                      ? currentLanguage === "en"
                        ? "Select Course"
                        : currentLanguage === "ar"
                          ? "اختر الدورة"
                          : currentLanguage === "fr"
                            ? "Sélectionnez le cours"
                            : "Select Course"
                      : currentLanguage === "en"
                        ? "Select a teacher first"
                        : currentLanguage === "ar"
                          ? "اختر المدرس أولًا"
                          : currentLanguage === "fr"
                            ? "Sélectionnez d'abord l'enseignant"
                            : "Select a teacher first"}
                  </option>
                  {teacherCourses?.data?.map((course: any) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName} ({course.courseCode})
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
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"

                  {...register("classroomId", { required: true })}
                  disabled={!selectedTeacherId || !selectedCourseId}
                >
                  <option value="">
                    {!selectedTeacherId || !selectedCourseId
                      ? currentLanguage === "en"
                        ? "Select teacher and course first"
                        : currentLanguage === "ar"
                          ? "اختر المدرس والدورة أولًا"
                          : currentLanguage === "fr"
                            ? "Sélectionnez d'abord l'enseignant et le cours"
                            : "Select teacher and course first"
                      : currentLanguage === "en"
                        ? "Select Class Room"
                        : currentLanguage === "ar"
                          ? "اختر الصف"
                          : currentLanguage === "fr"
                            ? "Sélectionnez la salle"
                            : "Select Class Room"}
                  </option>

                  {availableClassrooms?.data.map((room: any) => (
                    <option key={room.classroomId} value={room.classroomId}>
                      {room.classroomName} ({room.classroomStudyLevel})
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
              <label htmlFor="examTypeId" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Exam Type"
                  : currentLanguage === "ar"
                    ? "نوع الامتحان"
                    : currentLanguage === "fr"
                      ? "Type d'examen"
                      : "Exam Type"}
                <select
                  id="examTypeId"
                  {...register("examTypeId", { required: true })}
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Exam Type"
                      : currentLanguage === "ar"
                        ? "اختر نوع الامتحان"
                        : currentLanguage === "fr"
                          ? "Sélectionnez le type d'examen"
                          : "Select Exam Type"}
                  </option>
                  {examTypes?.data.map((type: any) => (
                    <option key={type.examTypeId} value={type.examTypeId}>
                      {type.name} - {type.studyLevel}
                    </option>
                  ))}
                </select>
                {errors.examTypeId && (
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
                    ? "Add Exam"
                    : currentLanguage === "ar"
                      ? "إضافة امتحان"
                      : currentLanguage === "fr"
                        ? "Ajouter un examen"
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

export default AddExam;
