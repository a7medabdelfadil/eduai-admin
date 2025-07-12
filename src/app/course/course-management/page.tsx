"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import {
  useGetAllCoursesQuery,
  useDeleteCoursesMutation,
} from "@/features/Acadimic/courseApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TbDotsVertical } from "react-icons/tb";
import { useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { toast } from "react-toastify";

const CourseManagement = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Course and Resource  Management",
      nameAr: "إدارة الدورات والموارد",
      nameFr: "Gestion des cours et des ressources",
      href: "/course",
    },
    {
      nameEn: "Course Management",
      nameAr: "إدارة الدورات",
      nameFr: "Gestion des cours",
      href: "/course/course-management",
    },
  ];
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
          {/* Search Input */}
          <div
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            className="relative w-full max-w-md"
          >
            <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
              <BiSearchAlt className="text-secondary" size={18} />
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                className="border-borderSecondary w-full rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none"
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

          {/* Add New Bus Button */}
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
                <div
                  className={`grid h-[220px] rounded-xl ${index % 4 === 0 ? "bg-warning" : index % 4 === 1 ? "bg-info" : index % 4 === 2 ? "bg-success" : "bg-danger"} p-2 text-[25px] font-bold text-textPrimary`}
                >
                  <div className="relative flex justify-end">
                    <TbDotsVertical
                      onClick={() => toggleNavbar(index)}
                      className="mt-1 cursor-pointer text-white"
                    />

                    {open === index && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 top-8 z-30 flex flex-col gap-1 rounded-md bg-bgPrimary p-2 shadow-md"
                      >
                        <Link
                          href={`/course/course-management/${course.id}`}
                          className="flex items-center gap-1 px-2 py-1 text-sm hover:text-primary"
                        >
                          <FaEdit />
                          {currentLanguage === "ar"
                            ? "تعديل"
                            : currentLanguage === "fr"
                              ? "Modifier"
                              : "Edit"}
                        </Link>
                        <button
                          onClick={() => setSelectedCourseId(course.id)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          <MdDelete />
                          {currentLanguage === "ar"
                            ? "حذف"
                            : currentLanguage === "fr"
                              ? "Supprimer"
                              : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end text-end"></div>
                  <div className="mb-6 flex items-start justify-center text-center">
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
      </Container>
      <Dialog
        open={!!selectedCourseId}
        onOpenChange={() => setSelectedCourseId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentLanguage === "ar"
                ? "تأكيد الحذف"
                : currentLanguage === "fr"
                  ? "Confirmer la suppression"
                  : "Confirm Delete"}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === "ar"
                ? "هل أنت متأكد أنك تريد حذف هذه الدورة؟"
                : currentLanguage === "fr"
                  ? "Êtes-vous sûr de vouloir supprimer ce cours ?"
                  : "Are you sure you want to delete this course?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setSelectedCourseId(null)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              {currentLanguage === "ar"
                ? "إلغاء"
                : currentLanguage === "fr"
                  ? "Annuler"
                  : "Cancel"}
            </button>
            <button
              onClick={async () => {
                if (selectedCourseId) {
                  try {
                    await deleteCourse(selectedCourseId).unwrap();
                    refetch();
                    setSelectedCourseId(null);
                    toast(
                      currentLanguage === "ar"
                        ? "تم الحذف بنجاح"
                        : currentLanguage === "fr"
                          ? "Supprimé avec succès"
                          : "Deleted successfully",
                    );
                  } catch (err) {
                    toast.error((err as { data: { message: string } }).data?.message);
                  }
                }
              }}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              {currentLanguage === "ar"
                ? "حذف"
                : currentLanguage === "fr"
                  ? "Supprimer"
                  : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseManagement;
