"use client";

import { RootState } from "@/GlobalRedux/store";
import Calendar from "@/components/calendar";
import Modal from "@/components/model";
import Spinner from "@/components/spinner";
import {
  useGetAllEmployeesQuery,
  useGetAllStudentsQuery,
  useGetAllTeachersQuery,
  useGetAllWorkersQuery,
  useGetEventsInMonthQuery,
  useGetExpensesQuery,
  useGetNoticesQuery,
  useDeleteNoteMutation,
  useGetTeacherAttendenceQuery,
  useGetEmployeeAttendenceQuery,
  useGetWorkerAttendenceQuery,
  useGetEventsInWeekQuery,
  useGetStudentPercentageQuery,
} from "@/features/dashboard/dashboardApi";
import {
  useCreateEventsMutation,
  useGetAllEventsDashboardQuery,
} from "@/features/events/eventsApi";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { HiOutlineArrowNarrowUp } from "react-icons/hi";
import { Text } from "@/components/Text";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";

// Define the type for notice items
interface Notice {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const eventSchema = z.object({
  creatorId: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  title_fr: z.string().min(1, "French title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  description_fr: z.string().min(1, "French description is required"),
  file: z.any().optional(),
});

const Dashboard: React.FC = () => {
  const ID = useSelector((state: RootState) => state.user.id);
  const { data: events, isLoading: isEvents } = useGetEventsInMonthQuery(null);
  const { data: eventsWeek, isLoading: isEventsWeekLoading } =
    useGetEventsInWeekQuery(null);
  const currentYear = new Date().getFullYear();
  const start = format(new Date(currentYear, 0, 1), "yyyy-MM-dd");
  const end = format(new Date(currentYear, 11, 30), "yyyy-MM-dd");
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const locale = currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : enUS;
  const { data: expenses, isLoading: isExpenses } = useGetExpensesQuery({
    start: start,
    end: end,
  });
  const { data: studentPercentage } = useGetStudentPercentageQuery(null);
  console.log("👾 ~ studentPercentage:", studentPercentage?.data)
  const { data: teacherAttendance } = useGetTeacherAttendenceQuery(null);
  const { data: employeeAttendance } = useGetEmployeeAttendenceQuery(null);
  const { data: workersAttendance } = useGetWorkerAttendenceQuery(null);
  const {
    data: students,
    error: err1,
    isLoading: isStudents,
  } = useGetAllStudentsQuery(null);
  const {
    data: employees,
    error: err2,
    isLoading: isEmployee,
  } = useGetAllEmployeesQuery(null);
  const {
    data: teachers,
    error: err3,
    isLoading: isTeacher,
  } = useGetAllTeachersQuery(null);
  const {
    data: workers,
    error: err4,
    isLoading: isWorker,
  } = useGetAllWorkersQuery(null);
  const { data: mettings, isLoading: isMeeting } =
    useGetAllEventsDashboardQuery(null);

  const [noticesState, setNoticesState] = useState<Notice[]>([]);

  const {
    data: notices,
    isLoading: isNotices,
    refetch,
  } = useGetNoticesQuery(null);

  useEffect(() => {
    if (notices?.data?.content) {
      setNoticesState(notices.data.content);
    }
  }, [notices]);

  const nameColors = [
    "text-orange-500",
    "text-blue-500",
    "text-green-500",
    "text-red-500",
  ];

  const [createEvent] = useCreateEventsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  const [series, setSeries] = useState([
    { name: "Income", data: [] },
    { name: "Expense", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    if (expenses && expenses.data) {
      // Extract income and expense values from the API response
      const incomeData = expenses.data.map((item: any) => item.income);
      const expenseData = expenses.data.map((item: any) => item.expense);
      const semesterNames = expenses.data.map((item: any) => item.semesterName);

      // Update the series with the new data
      setSeries([
        {
          name: `${currentLanguage === "ar" ? "المداخل" : currentLanguage === "fr" ? "revenu" : "Income"}`,
          data: incomeData,
        },
        {
          name: `${currentLanguage === "ar" ? "المصاريف" : currentLanguage === "fr" ? "Dépenses" : "Expense"}`,
          data: expenseData,
        },
      ]);
      setCategories(semesterNames);
    }
  }, [expenses, currentLanguage]);

  const onSubmit = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      // Create JSON object for request key
      const requestData = {
        creatorId: ID,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        title_fr: formData.title_fr,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        description_fr: formData.description_fr,
      };

      // Append the JSON data as a string to FormData
      formDataToSend.append("request", JSON.stringify(requestData));

      // Append the file if it exists
      const file = formData.file?.[0];
      if (file) {
        formDataToSend.append("file", file); // Append the file correctly
      }

      const result = await createEvent(formDataToSend).unwrap();
      toast.success("Event created success");
      handleCloseModal();
    } catch (error) {
      toast.error("Fiald Create Event");
    }
  };
  const [deleteEvent] = useDeleteNoteMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Delete note Success");
      void refetch();
    } catch (err) {
      toast.error("Can not Delete note");
    }
  };

  const { theme } = useTheme();
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      width: 800,
      type: "area" as const,
      background: "transparent",
    },
    colors: ["#f19b78", "#008FFB"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      theme: theme,
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });
  type Meeting = Record<string, any>;

  if (
    isStudents ||
    isEmployee ||
    isWorker ||
    isTeacher ||
    isEvents ||
    isMeeting ||
    isNotices ||
    isExpenses ||
    loading
  )
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`grid text-start`}
      >
        <h1 className="mx-4 mb-2 text-[28px] font-bold text-[#041631] dark:text-white lg:mx-0">
          {currentLanguage === "en"
            ? "Dashboard"
            : currentLanguage === "ar"
              ? "لوحة التحكم"
              : currentLanguage === "fr"
                ? "tableau de bord"
                : "tableau de bord"}
        </h1>
        <p className="mx-4 text-[20px] text-textSecondary max-[490px]:text-[18px] lg:mx-0">
          {currentLanguage === "en"
            ? "Welcome to Learning Management Dashboard."
            : currentLanguage === "ar"
              ? "مرحباً بكم في لوحة إدارة التعلم."
              : currentLanguage === "fr"
                ? "Bienvenue sur le tableau de bord pédagogique"
                : "Bienvenue dans le tableau de bord de gestion de l'apprentissage."}
        </p>
      </div>
      <div
        className={`${currentLanguage === "ar" ? "pl-4 pr-4 lg:pl-10 lg:pr-0" : "pl-4 pr-4 lg:pl-0 lg:pr-10"} mt-6 grid w-full overflow-x-auto`}
      >
        <div className="grid overflow-x-auto">
          <div className="mb-6 grid w-full grid-cols-2 justify-center gap-4 whitespace-nowrap max-[812px]:justify-center md:grid-cols-3 2xl:grid-cols-5">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[120px] w-full flex-col justify-evenly rounded-xl bg-bgPrimary p-4 shadow-md max-[576px]:h-[100px]"
            >
              <p className="text-xs md:text-sm font-medium text-secondary">
                {currentLanguage === "ar"
                  ? "إجمالي الطلاب"
                  : currentLanguage === "fr"
                    ? "Total des étudiants"
                    : "Total student"}
              </p>
              <h1 className="text-3xl font-semibold">{students?.data} </h1>
              <div className="flex gap-2">
                <div className={`flex ${studentPercentage?.data > 0 ? "text-error" : "text-success"} text-success`}>
                  <HiOutlineArrowNarrowUp className="mt-[2px]" /> {studentPercentage?.data}%
                </div>
                <div>
                  <Text>
                    {currentLanguage === "ar"
                      ? "مقارنة بالسنة الماضية"
                      : currentLanguage === "fr"
                        ? "vs. l'année dernière"
                        : "vs. last Year"}
                  </Text>
                </div>
              </div>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[120px] w-full flex-col justify-evenly rounded-xl bg-bgPrimary p-4 shadow-md max-[576px]:h-[100px]"
            >
              <p className="text-xs md:text-sm font-medium text-secondary">
                {currentLanguage === "ar"
                  ? "إجمالي المعلمين"
                  : currentLanguage === "fr"
                    ? "Total des enseignants"
                    : "Total teacher"}
              </p>
              <h1 className="text-3xl font-semibold">{teachers?.data} </h1>
              <div className="flex gap-2">
                <Text color={"success"}>{teacherAttendance?.data}</Text>
                <Text>
                  {currentLanguage === "ar"
                    ? "الحضور اليوم"
                    : currentLanguage === "fr"
                      ? "Présences aujourd'hui"
                      : "Attendances today"}
                </Text>
              </div>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[120px] w-full flex-col justify-evenly rounded-xl bg-bgPrimary p-4 shadow-md max-[576px]:h-[100px]"
            >
              <p className="text-xs md:text-sm font-medium text-secondary">
                {currentLanguage === "ar"
                  ? "إجمالي الموظفين"
                  : currentLanguage === "fr"
                    ? "Total des employés"
                    : "Total employee"}
              </p>
              <h1 className="text-3xl font-semibold">{employees?.data}</h1>
              <div className="flex gap-2">
                <Text color={"success"}>{employeeAttendance?.data}</Text>
                <Text>
                  {currentLanguage === "ar"
                    ? "الحضور اليوم"
                    : currentLanguage === "fr"
                      ? "Présences aujourd'hui"
                      : "Attendances today"}
                </Text>
              </div>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[120px] w-full flex-col justify-evenly rounded-xl bg-bgPrimary p-4 shadow-md max-[576px]:h-[100px]"
            >
              <p className="text-xs md:text-sm font-medium text-secondary">
                {currentLanguage === "ar"
                  ? "إجمالي العمال"
                  : currentLanguage === "fr"
                    ? "Total des travailleurs"
                    : "Total Worker"}
              </p>
              <h1 className="text-3xl font-semibold">{workers?.data} </h1>
              <div className="flex gap-2">
                <Text color={"success"}>{workersAttendance?.data}</Text>
                <Text>
                  {currentLanguage === "ar"
                    ? "الحضور اليوم"
                    : currentLanguage === "fr"
                      ? "Présences aujourd'hui"
                      : "Attendances today"}
                </Text>
              </div>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[120px] w-full flex-col justify-evenly rounded-xl bg-bgPrimary p-4 shadow-md max-[576px]:h-[100px]"
            >
              <p className="text-xs md:text-sm font-medium text-secondary">
                {currentLanguage === "ar"
                  ? "الفعاليات"
                  : currentLanguage === "fr"
                    ? "Événements"
                    : "Events"}
              </p>
              <div className="flex items-end gap-2">
                <h1 className="text-3xl font-semibold">{events?.data}</h1>
                <Text className="mb-[1px]">
                  {currentLanguage === "en"
                    ? "in this month"
                    : currentLanguage === "ar"
                      ? "هذا الشهر"
                      : currentLanguage === "fr"
                        ? "ce mois-ci"
                        : "in this month"}
                </Text>
              </div>
              <div className="flex gap-2">
                <Text color="success">{eventsWeek?.data}</Text>
                <Text>
                  {currentLanguage === "ar"
                    ? "خلال هذا الأسبوع"
                    : currentLanguage === "fr"
                      ? "Cette semaine"
                      : "In this week"}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 overflow-x-auto pb-4 lg:grid-cols-3">
          <div className="col-span-1 flex overflow-x-auto rounded-xl lg:col-span-2">
            <div
              id="chart"
              className="w-full overflow-hidden rounded-xl bg-bgPrimary p-4 shadow"
            >
              <p
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                className="pb-3 text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "School Finance"
                  : currentLanguage === "ar"
                    ? "مالية المدرسة"
                    : "Finance de l'école"}
              </p>
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                width="100%"
                height={options.chart.height}
              />
            </div>
          </div>

          <div className="col-span-1 flex justify-center">
            <div className="grid w-full overflow-hidden rounded-2xl">
              <div className="grid max-h-[450px] w-full overflow-hidden rounded-2xl bg-bgPrimary p-4 shadow-xl">
                <div
                  className="flex w-full justify-start text-start"
                  dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                >
                  <h1 className="text-xl font-semibold">
                    {currentLanguage === "ar"
                      ? "الفعاليات القادمة"
                      : currentLanguage === "fr"
                        ? "Événements à venir"
                        : "Upcoming Events"}
                  </h1>
                </div>

                {mettings?.data.content.length > 0 ? (
                  mettings?.data.content.map((meeting: Meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between"
                    >
                      <div className="mx-3 flex h-[75px] w-[66px] items-center justify-center rounded-xl bg-[#F9DCA4] p-2 text-center">
                        <h1 className="text-[18px] font-semibold text-warning">
                          {format(parseISO(meeting.startDate), "d")}
                        </h1>
                        <h1 className="text-[18px] font-semibold text-warning">
                          {format(parseISO(meeting.startDate), "EEE")}
                        </h1>
                      </div>
                      <div className="grid w-[150px] gap-2">
                        <p className="text-[13px] text-warning">
                          {format(
                            parseISO(meeting.startDate),
                            "dd - MMMM - yyyy",
                          )}
                        </p>
                        <p className="truncate text-[16px] text-gray-400">
                          {meeting.title}
                        </p>
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-warning"
                            style={{ width: `22%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-3 grid w-[200px] gap-8">
                        <p className="text-[13px] text-warning">
                          {format(parseISO(meeting.startDate), "hh:mm a")} -{" "}
                          {format(parseISO(meeting.endDate), "hh:mm a")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold text-secondary">
                    {currentLanguage === "en"
                      ? "No Events Found"
                      : currentLanguage === "ar"
                        ? "لم يتم العثور على أحداث"
                        : "Aucun événement trouvé"}
                  </div>
                )}

                <div className="flex h-full items-center justify-evenly">
                  <button
                    onClick={handleOpenModal}
                    className="mx-3 whitespace-nowrap rounded-xl bg-primary px-2.5 py-2 text-[14px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
                  >
                    {currentLanguage === "ar"
                      ? "+ فعالية جديدة"
                      : currentLanguage === "fr"
                        ? "+ Nouvel événement"
                        : "+ New Event"}
                  </button>
                  {mettings.data.content.length > 3 && (
                    <Link
                      href="/educational-affairs/events"
                      className="font-semibold text-primary underline"
                    >
                      {currentLanguage === "ar"
                        ? "المزيد من الفعاليات"
                        : currentLanguage === "fr"
                          ? "Plus d'événements"
                          : "More Events"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid w-full grid-cols-1 gap-6 overflow-x-auto lg:grid-cols-2">
          <div className="grid w-full overflow-x-auto rounded-2xl">
            <div className="flex w-full flex-col items-center justify-center overflow-x-auto rounded-2xl bg-bgPrimary shadow">
              <div
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                className="mt-4 flex w-full flex-col items-start px-4"
              >
                <p className="text-xl font-bold text-textPrimary">
                  {currentLanguage === "ar"
                    ? "تقويم الفعاليات المدرسية"
                    : currentLanguage === "fr"
                      ? "Calendrier des événements scolaires"
                      : "School Events Calendar"}
                </p>
                <p className="text-lg font-semibold text-secondary">
                  {currentLanguage === "ar"
                    ? "لديك 250 طالبًا"
                    : currentLanguage === "fr"
                      ? "Vous avez 250 étudiants"
                      : "You have 250 students"}
                </p>
              </div>
              <Calendar />
            </div>
          </div>
          <div
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            className="grid w-full overflow-x-auto rounded-xl"
          >
            <div className="w-full overflow-x-auto overflow-y-auto rounded-xl bg-bgPrimary p-4">
              <div className="flex w-full justify-between">
                <p className="text-[20px] font-bold">
                  {currentLanguage === "en"
                    ? "Notice Board"
                    : currentLanguage === "ar"
                      ? "لوحة الإعلانات"
                      : currentLanguage === "fr"
                        ? "Tableau d'affichage"
                        : "Notice Board"}
                </p>
                <Link
                  href="/add-note"
                  className="mx-3 mb-5 h-[35px] whitespace-nowrap rounded-xl bg-primary px-2 py-1 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "+ Add Note"
                    : currentLanguage === "ar"
                      ? "+  أضف تعليق"
                      : currentLanguage === "fr"
                        ? "+ Ajouter une note"
                        : "+ New Driver"}{" "}
                  {/* Default to English */}
                </Link>
              </div>
              <div className="w-full">
                {isNotices ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : noticesState.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No notices available
                  </p>
                ) : (
                  noticesState.map((item, index) => (
                    <div key={item.id} className="mb-6">
                      {/* Name + Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <p
                            className={`text-lg font-semibold ${nameColors[index % nameColors.length]}`}
                          >
                            {item.title}
                          </p>
                          <span className="text-sm text-textSecondary">
                            {formatDistanceToNow(parseISO(item.createdAt), {
                              addSuffix: true,
                              locale,
                            })}
                          </span>
                        </div>
                        {/* Date on the right */}
                        <div className={`text-right text-sm font-semibold ${nameColors[index % nameColors.length]}`}>
                          {format(parseISO(item.createdAt), "dd - MMM - yyyy", {
                            locale,
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-1 text-gray-500">{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="mb-4 text-xl font-light">
            {currentLanguage === "ar"
              ? "إنشاء حدث"
              : currentLanguage === "fr"
                ? "Créer un événement"
                : "Create Event"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5"
            encType="multipart/form-data"
          >
            {/* Start Time */}
            <div className="mb-4">
              <input
                type="datetime-local"
                {...register("startTime")}
                placeholder="Start Time"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startTime && (
                <p className="text-error">
                  {errors.startTime.message as string}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className="mb-4">
              <input
                type="datetime-local"
                {...register("endTime")}
                placeholder="End Time"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.endTime && (
                <p className="text-error">{errors.endTime.message as string}</p>
              )}
            </div>

            {/* Title in English */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_en")}
                placeholder="Title (English)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_en && (
                <p className="text-error">
                  {errors.title_en.message as string}
                </p>
              )}
            </div>

            {/* Title in Arabic */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_ar")}
                placeholder="Title (Arabic)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_ar && (
                <p className="text-error">
                  {errors.title_ar.message as string}
                </p>
              )}
            </div>

            {/* Title in French */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_fr")}
                placeholder="Title (French)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_fr && (
                <p className="text-error">
                  {errors.title_fr.message as string}
                </p>
              )}
            </div>

            {/* Description in English */}
            <div className="mb-4">
              <input
                {...register("description_en")}
                placeholder="Description (English)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_en && (
                <p className="text-error">
                  {errors.description_en.message as string}
                </p>
              )}
            </div>

            {/* Description in Arabic */}
            <div className="mb-4">
              <input
                {...register("description_ar")}
                placeholder="Description (Arabic)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_ar && (
                <p className="text-error">
                  {errors.description_ar.message as string}
                </p>
              )}
            </div>

            {/* Description in French */}
            <div className="mb-4">
              <input
                {...register("description_fr")}
                placeholder="Description (French)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_fr && (
                <p className="text-error">
                  {errors.description_fr.message as string}
                </p>
              )}
            </div>

            {/* File Input */}
            <div className="mb-4">
              <input
                type="file"
                {...register("file")}
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إضافة"
                  : currentLanguage === "fr"
                    ? "Ajouter"
                    : "Add"}
              </button>
              <button
                onClick={handleCloseModal}
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-error px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-warning hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إلغاء"
                  : currentLanguage === "fr"
                    ? "Annuler"
                    : "Cancel"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
