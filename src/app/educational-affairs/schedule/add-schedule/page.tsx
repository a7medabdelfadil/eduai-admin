"use client";

import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSchedualMutation } from "@/features/Acadimic/scheduleApi";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";
import SearchableSelect from "@/components/select";
import Box from "@/components/Box";

const scheduleSchema = z
  .object({
    classroomId: z.string().nonempty("Classroom ID is required"),
    teacherId: z.string().nonempty("Teacher ID is required"),
    courseId: z.string().nonempty("Course ID is required"),
    day: z.string().nonempty("Day is required"),
    startTime: z.string().nonempty("Start Time is required"),
    endTime: z.string().nonempty("End Time is required"),
  })
  .refine(
    data => {
      const startTime = parseTime(data.startTime);
      const minTime = parseTime("07:00");
      const maxTime = parseTime("16:00");
      return startTime >= minTime && startTime <= maxTime;
    },
    {
      message: "Start Time must be between 7:00 AM and 4:00 PM",
      path: ["startTime"],
    },
  )
  .refine(
    data => {
      const endTime = parseTime(data.endTime);
      const minTime = parseTime("07:00");
      const maxTime = parseTime("16:00");
      return endTime >= minTime && endTime <= maxTime;
    },
    {
      message: "End Time must be between 7:00 AM and 4:00 PM",
      path: ["endTime"],
    },
  )
  .refine(
    data => {
      const startTime = parseTime(data.startTime);
      const endTime = parseTime(data.endTime);
      return endTime > startTime;
    },
    {
      message: "End Time must be after Start Time",
      path: ["endTime"],
    },
  );

function parseTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

const AddSchedule = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الشئون التعليمية",
      nameFr: "Affaires éducatives",
      href: "/educational-affairs",
    },
    {
      nameEn: "Schedule",
      nameAr: "الجدول",
      nameFr: "Emploi du temps",
      href: "/educational-affairs/schedule",
    },
    {
      nameEn: "Add Schedule",
      nameAr: "إضافة جدول",
      nameFr: "Ajouter un emploi du temps",
      href: "/educational-affairs/schedule/add-schedule",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  const [createSchedule, { isLoading: isCreating }] =
    useCreateSchedualMutation();
  const { data: classes, isLoading: isClassing } = useGetAllClasssQuery(null);
  const { data: teachers, isLoading: isTeacher } = useGetAllTeachersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const { data: courses, isLoading } = useGetAllCoursesQuery(null);

  const optionsRigon =
    courses?.data?.content.map((rigion: any) => ({
      value: rigion.id,
      label: `${rigion.name} - ${rigion.description} - ${rigion.level} - ${rigion.code}`,
    })) || [];
  const onSubmitCreateSchedule: SubmitHandler<FieldValues> = async data => {
    try {
      await createSchedule({
        classroomId: data.classroomId,
        teacherId: data.teacherId,
        courseId: data.courseId,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
      }).unwrap();
      toast.success("Schedule Created Successfully");
      router.push("/educational-affairs/schedule/");
      reset();
    } catch (error: any) {
      toast.error(`${error.data.message}`);
    }
  };

  if (loading || isClassing || isLoading || isTeacher)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <form
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        onSubmit={handleSubmit(onSubmitCreateSchedule)}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-3 mt-5 space-y-4`}
      >
        <Box>
          <div>
            <label>
              {currentLanguage === "ar"
                ? "معرف الفصل"
                : currentLanguage === "fr"
                  ? "ID de la classe"
                  : "Classroom ID"}
            </label>
            <select
              id="classroomId"
              className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 outline-none"
              {...register("classroomId")}
            >
              <option value="">
                {currentLanguage === "ar"
                  ? "اختر الفصل"
                  : currentLanguage === "fr"
                    ? "Sélectionner la classe"
                    : "Select Class"}
              </option>
              {classes?.data.content.map((teacher: any) => (
                <option key={teacher.roomId} value={teacher.roomId}>
                  {teacher.classroomName}
                </option>
              ))}
            </select>
            {errors.classroomId && (
              <p className="text-red-500">
                {errors.classroomId.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label>
              {currentLanguage === "ar"
                ? "معرف المعلم"
                : currentLanguage === "fr"
                  ? "ID de l'enseignant"
                  : "Teacher ID"}
            </label>
            <select
              id="teacherId"
              className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 outline-none"
              {...register("teacherId")}
            >
              <option value="">
                {currentLanguage === "ar"
                  ? "اختر المعلم"
                  : currentLanguage === "fr"
                    ? "Sélectionner l'enseignant"
                    : "Select Teacher"}
              </option>
              {teachers?.data.content.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="text-red-500">
                {errors.teacherId.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="regionId"
              className="grid w-full text-start font-sans text-[15px] font-semibold text-[#9a9a9a]"
            >
              {currentLanguage === "ar"
                ? "معرف الدورة"
                : currentLanguage === "fr"
                  ? "ID du cours"
                  : "Course ID"}
              <SearchableSelect
                name="courseId"
                control={control}
                errors={errors}
                options={optionsRigon}
                currentLanguage={currentLanguage}
                placeholder="Select courseId"
              />
            </label>
          </div>
          <div>
            <label>
              {currentLanguage === "ar"
                ? "اليوم"
                : currentLanguage === "fr"
                  ? "Jour"
                  : "Day"}
            </label>
            <select
              id="day"
              className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 outline-none"
              {...register("day")}
            >
              <option value="">
                {currentLanguage === "ar"
                  ? "اختر اليوم"
                  : currentLanguage === "fr"
                    ? "Sélectionner le jour"
                    : "Select Day"}
              </option>
              <option value="SUNDAY">
                {currentLanguage === "ar"
                  ? "الأحد"
                  : currentLanguage === "fr"
                    ? "Dimanche"
                    : "Sunday"}
              </option>
              <option value="MONDAY">
                {currentLanguage === "ar"
                  ? "الإثنين"
                  : currentLanguage === "fr"
                    ? "Lundi"
                    : "Monday"}
              </option>
              <option value="TUESDAY">
                {currentLanguage === "ar"
                  ? "الثلاثاء"
                  : currentLanguage === "fr"
                    ? "Mardi"
                    : "Tuesday"}
              </option>
              <option value="WEDNESDAY">
                {currentLanguage === "ar"
                  ? "الأربعاء"
                  : currentLanguage === "fr"
                    ? "Mercredi"
                    : "Wednesday"}
              </option>
              <option value="THURSDAY">
                {currentLanguage === "ar"
                  ? "الخميس"
                  : currentLanguage === "fr"
                    ? "Jeudi"
                    : "Thursday"}
              </option>
              <option value="FRIDAY">
                {currentLanguage === "ar"
                  ? "الجمعة"
                  : currentLanguage === "fr"
                    ? "Vendredi"
                    : "Friday"}
              </option>
              <option value="SATURDAY">
                {currentLanguage === "ar"
                  ? "السبت"
                  : currentLanguage === "fr"
                    ? "Samedi"
                    : "Saturday"}
              </option>
            </select>
            {errors.day && (
              <p className="text-red-500">{errors.day.message?.toString()}</p>
            )}
          </div>
          <div>
            <label>
              {currentLanguage === "ar"
                ? "وقت البدء"
                : currentLanguage === "fr"
                  ? "Heure de début"
                  : "Start Time"}
            </label>
            <input
              {...register("startTime")}
              placeholder="HH:mm"
              className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 outline-none"
              type="time"
            />
            {errors.startTime && (
              <p className="text-red-500">
                {errors.startTime.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label>
              {currentLanguage === "ar"
                ? "وقت الانتهاء"
                : currentLanguage === "fr"
                  ? "Heure de fin"
                  : "End Time"}
            </label>
            <input
              {...register("endTime")}
              placeholder="HH:mm"
              className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 outline-none"
              type="time"
            />
            {errors.endTime && (
              <p className="text-red-500">
                {errors.endTime.message?.toString()}
              </p>
            )}
          </div>

          {/* Display form-level errors (if any) */}
          {errors.root?.message && (
            <p className="text-red-500">{errors.root.message}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className={`mt-5 rounded bg-blue-500 px-4 py-2 text-white ${
                isCreating ? "opacity-50" : ""
              }`}
              disabled={isCreating}
            >
              {isCreating
                ? currentLanguage === "ar"
                  ? "جاري الإرسال..."
                  : currentLanguage === "fr"
                    ? "Soumission en cours..."
                    : "Submitting..."
                : currentLanguage === "ar"
                  ? "إرسال"
                  : currentLanguage === "fr"
                    ? "Soumettre"
                    : "Submit"}
            </button>
          </div>
        </Box>
      </form>
    </>
  );
};

export default AddSchedule;
