"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import {
  useGetAllCoursesQuery,
  useDeleteCoursesMutation,
} from "@/features/Acadimic/courseApi";
import Link from "next/link";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";

const CourseManagement = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Course",
      nameAr: "الدورة",
      nameFr: "Cours",
      href: "/course",
    },
    {
      nameEn: "Course Management",
      nameAr: "إدارة الدورات",
      nameFr: "Gestion des cours",
      href: "/course/course-management",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | boolean | null>(false);
  const toggleNavbar = (index: number) => {
    setOpen(open === index ? null : index);
  };
  type Course = Record<string, any>;
  const { data, isLoading, refetch } = useGetAllCoursesQuery(null);
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCoursesMutation();

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
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
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
        } mt-12`}
      >
        <div className="flex w-full justify-between px-8 text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/course/course-management/add-course"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة دورة جديدة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouveau cours"
                  : "+ Add New Course"}
            </Link>
          </div>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data?.data.content
            .filter((course: Course) => {
              // Convert both search term and course name to lowercase for case-insensitive comparison
              const searchTerm = search.toLowerCase();
              const courseName = course.name.toLowerCase();

              // Return all courses if search is empty, otherwise check if course name includes search term
              return search.trim() === ""
                ? course
                : courseName.includes(searchTerm);
            })
            .map((course: Course, index: number) => (
              <div
                key={course.id}
                className="grid gap-2 rounded-lg bg-bgPrimary p-2"
              >
                <div className="grid h-[220px] rounded-xl bg-[#f4bd0e] p-2 text-[25px] font-bold text-textPrimary">
                  <div className="flex justify-end text-end"></div>
                  <div className="items-staet mb-6 flex justify-center text-center">
                    <h1>{course.name}</h1>
                  </div>
                </div>
                <div className="grid gap-2 font-semibold">
                  <h1>{course.level}</h1>
                  <h1>{course.code}</h1>
                  <p className="text-[12px] text-secondary">
                    {course.description}{" "}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <img
                    src="/images/userr.png"
                    className="mx-2 h-[40px] w-[40px] rounded-full"
                    alt="#"
                  />
                  {course.eduSystemName}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CourseManagement;
