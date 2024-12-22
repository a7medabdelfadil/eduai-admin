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
} from "@/features/dashboard/dashboardApi";
import {
  useCreateEventsMutation,
  useGetAllEventsDashboardQuery,
} from "@/features/events/eventsApi";
import { format, parseISO } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const eventSchema = z.object({
  creatorId: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  title_fr: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_fr: z.string().optional(),
  file: z.any().optional(),
});

const Dashboard: React.FC = () => {
  const router = useRouter();
  const ID = useSelector((state: RootState) => state.user.id);
  const { data: events, isLoading: isEvents } = useGetEventsInMonthQuery(null);
  const currentYear = new Date().getFullYear();
  const start = format(new Date(currentYear, 0, 1), "yyyy-MM-dd");
  const end = format(new Date(currentYear, 11, 30), "yyyy-MM-dd");
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data: expenses, isLoading: isExpenses } = useGetExpensesQuery({
    start: start,
    end: end,
  });
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
  console.log("👾 ~ mettings:", mettings)
  const {
    data: notices,
    isLoading: isNotices,
    refetch,
  } = useGetNoticesQuery(null);
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
        className={`grid text-start ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : ""
            : booleanValue
              ? "lg:ml-[100px]"
              : ""
        }`}
      >
        <h1 className="mb-2 font-sans text-[28px] font-bold text-[#041631] dark:text-white">
          {currentLanguage === "en"
            ? "Dashboard"
            : currentLanguage === "ar"
              ? "لوحة التحكم"
              : currentLanguage === "fr"
                ? "tableau de bord"
                : "tableau de bord"}
        </h1>
        <p className="font-sans text-[20px] text-[#526484] max-[490px]:text-[18px]">
          {currentLanguage === "en"
            ? "Welcome to Learning Management Dashboard."
            : currentLanguage === "ar"
              ? "مرحباً بكم في لوحة إدارة التعلم."
              : currentLanguage === "fr"
                ? "Bienvenue sur le tableau de bord pédagogique"
                : "Bienvenue dans le tableau de bord de gestion de l'apprentissage."}
        </p>
      </div>
      <div className="mr-10 grid w-full justify-center overflow-x-auto p-6">
        <div className="grid overflow-x-auto">
          <div className="mb-6 flex w-full justify-evenly gap-4 whitespace-nowrap max-[812px]:justify-center max-[576px]:h-[120px]">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="h-[80px] w-[201px] items-center justify-center rounded-xl bg-bgPrimary p-2 shadow-xl max-[576px]:h-[100px]"
            >
              <p className="text-[12px] text-textSecondary">
                {currentLanguage === "ar"
                  ? "عدد الطلاب"
                  : currentLanguage === "fr"
                    ? "Nombre d'étudiants"
                    : "Students count"}
              </p>
              <h1 className="text-[17px] font-semibold">{students?.data} 🧑‍🎓</h1>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="h-[80px] w-[201px] items-center justify-center rounded-xl bg-bgPrimary p-2 shadow-xl max-[576px]:h-[100px]"
            >
              <p className="text-[12px] text-textSecondary">
                {currentLanguage === "ar"
                  ? "عدد الموظفين"
                  : currentLanguage === "fr"
                    ? "Nombre d'employés"
                    : "Employees count"}
              </p>
              <h1 className="text-[17px] font-semibold">
                {employees?.data} 👨‍💼
              </h1>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="h-[80px] w-[201px] items-center justify-center rounded-xl bg-bgPrimary p-2 shadow-xl max-[576px]:h-[100px]"
            >
              <p className="text-[12px] text-textSecondary">
                {currentLanguage === "ar"
                  ? "عدد المدرسين"
                  : currentLanguage === "fr"
                    ? "Nombre d'enseignants"
                    : "Teachers count"}
              </p>
              <h1 className="text-[17px] font-semibold">{teachers?.data} 👨‍🏫</h1>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="h-[80px] w-[201px] items-center justify-center rounded-xl bg-bgPrimary p-2 shadow-xl max-[576px]:h-[100px]"
            >
              <p className="text-[12px] text-textSecondary">
                {currentLanguage === "ar"
                  ? "عدد العمال"
                  : currentLanguage === "fr"
                    ? "Nombre de travailleurs"
                    : "Workers count"}
              </p>
              <h1 className="text-[17px] font-semibold">{workers?.data} 🧑‍🏭</h1>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="h-[80px] w-[201px] items-center justify-center rounded-xl bg-bgPrimary p-2 shadow-xl max-[576px]:h-[100px]"
            >
              <p className="text-[12px] text-textSecondary">
                {currentLanguage === "ar"
                  ? "الأحداث"
                  : currentLanguage === "fr"
                    ? "Événements"
                    : "Events"}
              </p>
              <h1 className="text-[17px] font-semibold">
                {events?.data}⏰{" "}
                {currentLanguage === "en"
                  ? "in this month"
                  : currentLanguage === "ar"
                    ? "هذا الشهر"
                    : currentLanguage === "fr"
                      ? "ce mois-ci"
                      : "in this month"}
              </h1>
            </div>
          </div>
        </div>

        <div className="mb-6 grid w-full grid-cols-1 justify-between gap-10 overflow-x-auto 2xl:flex">
          <div className="flex overflow-x-auto rounded-xl max-[1535px]:justify-center">
            <div
              id="chart"
              className="w-[850px] overflow-x-auto rounded-xl bg-bgPrimary p-2 shadow-xl"
            >
              <p
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                className="pb-3 text-[18px] font-semibold"
              >
                {" "}
                {currentLanguage === "en"
                  ? "School Finance"
                  : currentLanguage === "ar"
                    ? "مالية المدرسة"
                    : currentLanguage === "fr"
                      ? "Finance de l'école"
                      : "School Finance"}
              </p>
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                width={options.chart.width}
                height={options.chart.height}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid overflow-x-auto rounded-2xl">
              <div className="grid w-[550px] items-center justify-center overflow-x-auto rounded-2xl bg-bgPrimary p-2 shadow-xl max-[1536px]:h-[450px] max-[1536px]:w-[850px]">
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                  <h1 className="text-xl font-bold">
                    {currentLanguage === "ar"
                      ? "الفعاليات القادمة"
                      : currentLanguage === "fr"
                        ? "Événements à venir"
                        : "Upcoming Events"}
                  </h1>
                </div>
                {mettings?.data.content.map((meeting: Meeting) => (
                  <div
                    dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                    key={meeting.id}
                    className="flex items-center justify-evenly"
                  >
                    <div className="mx-3 h-[75px] w-[66px] items-center justify-center rounded-xl bg-[#F9DCA4] p-2 text-center">
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
                      <p className="text-[16px] text-gray-400">
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
                      <p className="mx-2 text-[16px] text-gray-600">
                        {currentLanguage === "ar"
                          ? "23 مهتم بالحدث"
                          : currentLanguage === "fr"
                            ? "23 intéressés par l'événement"
                            : "23 Interested in the event"}
                      </p>
                    </div>
                  </div>
                ))}
                {(mettings?.data.content.length == 0 || mettings == null) && (
                  <div className="flex w-full text-secondary justify-center py-3 text-center text-[18px] font-semibold">
                    {currentLanguage === "en"
                      ? "No Events Found"
                      : currentLanguage === "ar"
                        ? "لم يتم العثور على أحداث"
                        : currentLanguage === "fr"
                          ? "Aucun événement trouvé"
                          : "No Events Found"}
                  </div>
                )}
                <div className="flex h-full items-end justify-center">
                  <button
                    onClick={handleOpenModal}
                    className="mx-3 whitespace-nowrap rounded-xl bg-primary px-1 py-1.5 text-[14px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
                  >
                    {currentLanguage === "ar"
                      ? "+ فعالية جديدة"
                      : currentLanguage === "fr"
                        ? "+ Nouvel événement"
                        : "+ New Event"}
                  </button>
                </div>
                <div
                  dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                  className="flex w-full justify-end text-end"
                >
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid w-full grid-cols-1 justify-between gap-10 overflow-x-auto 2xl:flex">
          <div className="grid overflow-x-auto rounded-2xl">
            <div className="flex w-[850px] flex-col items-center justify-center overflow-x-auto rounded-2xl bg-bgPrimary shadow-xl max-[1536px]:w-full">
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
            className="grid overflow-x-auto rounded-xl"
          >
            <div className="grid h-[500px] w-[550px] overflow-x-auto overflow-y-auto rounded-xl bg-bgPrimary p-2 shadow-xl max-[1536px]:w-full">
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
              <div className="">
                {notices?.data?.content.map(
                  (note: {
                    id: React.Key | null | undefined;
                    title:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined;
                    description:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined;
                  }) => (
                    <div key={note.id}>
                      <h1 className="flex items-center gap-2 text-[18px] font-semibold text-primary">
                        <button
                          onClick={() =>
                            typeof note.id === "number" && handleDelete(note.id)
                          }
                        >
                          <svg
                            className="h-6 w-6 text-error"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        {String(note.title)}
                      </h1>
                      <p
                        className="text-textSecondary"
                        dangerouslySetInnerHTML={{
                          __html: note.description || "",
                        }}
                      />
                    </div>
                  ),
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
