"use client";

import { useForm } from "react-hook-form";
import { useGetAllTeacherScheduleQuery, useDeleteSchedualMutation } from "@/features/Acadimic/scheduleApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import TimeTable from "@/components/TimeTable";
import Spinner from "@/components/spinner";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import { toast } from "react-toastify";

const Schedule = () => {
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
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const { register, watch } = useForm();

  const selectedTeacherId = watch("teacherId");

  const { data, isLoading, refetch } = useGetAllTeacherScheduleQuery(selectedTeacherId, {
    skip: !selectedTeacherId,
  });
  const [deleteEvent] = useDeleteSchedualMutation();
  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error("Can not Delete post");
    }
  };

  const { data: teachers, isLoading: isTeacher } = useGetAllTeachersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isTeacher)
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
        } mt-7`}
      >
        <div className="my-12 mr-5 flex justify-between max-[540px]:my-1 max-[540px]:mr-0 max-[540px]:grid max-[540px]:justify-center">
          <div className="ml-2 flex items-center justify-start gap-3 text-xl font-semibold max-[540px]:mb-2 max-[540px]:ml-0 max-[540px]:justify-center">
            <Link
              href="/educational-affairs/schedule/add-schedule"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة حدث"
                : currentLanguage === "fr"
                  ? "Ajouter un événement"
                  : "Add Event"}
            </Link>
            <Link
              className="text-primary underline"
              href="/educational-affairs/schedule"
            >
              {currentLanguage === "ar"
                ? "معلم"
                : currentLanguage === "fr"
                  ? "Enseignant"
                  : "Teacher"}
            </Link>
            <Link href="/educational-affairs/schedule/class">
              {currentLanguage === "ar"
                ? "الصف"
                : currentLanguage === "fr"
                  ? "Classe"
                  : "Class"}
            </Link>
          </div>
          <div className="justify-center gap-3 max-[540px]:grid">
            <select
              id="teacherCourseRegistrationId"
              className="mx-3 rounded-lg border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-sm outline-none"
              {...register("teacherId", { required: true })}
            >
              <option value="">Select Teacher</option>
              {teachers?.data.content.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isLoading && <Spinner />}
        <TimeTable
          handleDelete={handleDelete}
          scheduleData={data?.data?.content ? data?.data?.content : []}
        />
      </div>
    </>
  );
};

export default Schedule;
