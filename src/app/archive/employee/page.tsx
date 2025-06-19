/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  useGetAllEmployeesQuery,
  useDeleteEmployeesMutation,
} from "@/features/User-Management/employeeApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import { BiTrash, BiSearchAlt } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";

const ArchiveEmployee = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Archive",
      nameAr: "الأرشيف",
      nameFr: "Archives",
      href: "/archive",
    },
    {
      nameEn: "Employee",
      nameAr: "الموظف",
      nameFr: "Employé",
      href: "/archive/employee",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetAllEmployeesQuery({
    archived: "true",
    page: 0,
    size: 1000000,
  });
  console.log("🚀 ~ ArchiveEmployee ~ data:", data);
  const [deleteEmployees] = useDeleteEmployeesMutation();

  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    gender:
      currentLanguage === "ar"
        ? "الجنس"
        : currentLanguage === "fr"
          ? "Genre"
          : "Gender",
    nationality:
      currentLanguage === "ar"
        ? "الجنسية"
        : currentLanguage === "fr"
          ? "Nationalité"
          : "Nationality",
    email:
      currentLanguage === "ar"
        ? "البريد الإلكتروني"
        : currentLanguage === "fr"
          ? "Courriel"
          : "Email",
    mobile:
      currentLanguage === "ar"
        ? "الجوال"
        : currentLanguage === "fr"
          ? "Mobile"
          : "Mobile",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Voir"
          : "View",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    unlock:
      currentLanguage === "ar"
        ? "إلغاء القفل"
        : currentLanguage === "fr"
          ? "Déverrouiller"
          : "Unlock",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  const filteredData = data?.data?.content?.filter((emp: any) =>
    emp.name?.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployees({ id, lock: "false" }).unwrap();
      toast.success(`Employee with ID ${id} unlocked successfully`);
      void refetch();
    } catch {
      toast.error("Failed to unlock the employee");
    }
  };

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "All Employees"
              : currentLanguage === "ar"
                ? "جميع الموظفين"
                : currentLanguage === "fr"
                  ? "Tous les employés"
                  : "All Employees"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col gap-4 rounded-lg px-4 py-4 md:flex-row md:items-center md:justify-between">
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
                    currentLanguage === "en"
                      ? "Search"
                      : currentLanguage === "ar"
                        ? "بحث"
                        : "Recherche"
                  }
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/add-new-employee"
              className="w-fit self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[16px] font-semibold text-white transition hover:bg-hover hover:shadow-md"
            >
              {currentLanguage === "ar"
                ? "+ إضافة موظف جديد"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouvel employé"
                  : "+ Add New Employee"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{translate.gender}</TableHead>
                  <TableHead>{translate.nationality}</TableHead>
                  <TableHead>{translate.email}</TableHead>
                  <TableHead>{translate.mobile}</TableHead>
                  <TableHead>{translate.view}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((emp: any, index: number) => (
                    <TableRow key={emp.id} data-index={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={emp.picture || "/images/userr.png"}
                            className="h-6 w-6 rounded-full border object-cover"
                            alt={emp.name || "employee"}
                          />
                          <span>{emp.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.gender}</TableCell>
                      <TableCell>{emp.nationality}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.number}</TableCell>
                      <TableCell>
                        <Link
                          href={`/employee/view-employee/${emp.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {translate.view}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-error transition hover:text-red-800"
                          title={translate.unlock}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {visibleCount < (filteredData?.length || 0) && (
          <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
        )}
      </Container>
    </>
  );
};

export default ArchiveEmployee;
