"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetAllComplainsQuery,
  useDeleteComplainsMutation,
} from "@/features/Organization-Setteings/complainApi";
import Container from "@/components/Container";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";

const ComplaintParent = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Complaint",
      nameAr: "شكوى",
      nameFr: "Plainte",
      href: "/organization-setting/complaint",
    },
  ];

  const { data, isLoading, refetch } = useGetAllComplainsQuery({
    type: "TEACHER_TO_STUDENT",
    approved: "",
  });

  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteComplainsMutation();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id).unwrap();
      toast.success(`Complaint with ID ${id} deleted successfully`);
      refetch();
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const filteredData = data?.data?.content?.filter((complaint: any) =>
    search.trim() === ""
      ? true
      : complaint.teacherName?.toLowerCase().includes(search.toLowerCase()) ||
        complaint.studentName?.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "ar"
              ? "شكوى"
              : currentLanguage === "fr"
                ? "Plainte"
                : "Complaint"}
          </h1>
        </div>

        <div className="my-4 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/organization-setting/complaint"
            className="text-primary underline"
          >
            {currentLanguage === "ar"
              ? "مدرس"
              : currentLanguage === "fr"
                ? "Professeur"
                : "Teacher"}
          </Link>
          <Link
            href="/organization-setting/complaint/parent"
            className="text-secondary hover:text-primary hover:underline"
          >
            {currentLanguage === "ar"
              ? "الوالد"
              : currentLanguage === "fr"
                ? "Mère"
                : "Parent"}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={
                    currentLanguage === "ar"
                      ? "ابحث عن شكوى"
                      : currentLanguage === "fr"
                        ? "Rechercher une plainte"
                        : "Search complaint"
                  }
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0}{" "}
                  {currentLanguage === "ar"
                    ? "نتيجة"
                    : currentLanguage === "fr"
                      ? "résultat(s)"
                      : "Result(s)"}
                </span>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "اسم المدرس"
                      : currentLanguage === "fr"
                        ? "Professeur Nom"
                        : "Teacher Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "اسم الطالب"
                      : currentLanguage === "fr"
                        ? "étudiant nom"
                        : "Student Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الموضوع"
                      : currentLanguage === "fr"
                        ? "Sujet"
                        : "Subject"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الرسالة"
                      : currentLanguage === "fr"
                        ? "Message"
                        : "Message"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الإجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                ) : displayedData?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-gray-500"
                    >
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((Department: any, index: number) => (
                    <TableRow key={Department.id} data-index={index}>
                      <TableCell>{Department.teacherName}</TableCell>
                      <TableCell>{Department.studentName}</TableCell>
                      <TableCell>{Department.subject}</TableCell>
                      <TableCell>{Department.message}</TableCell>
                      <TableCell>
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(Department.id)}
                        >
                          <BiTrash className="text-error" size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {filteredData?.length > visibleCount && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 10)}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ComplaintParent;
