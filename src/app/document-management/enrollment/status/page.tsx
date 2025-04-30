/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { Skeleton } from "@/components/Skeleton";
import { BiSearchAlt } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/Table";
import { useGetEnrollmentStatusQuery } from "@/features/Document-Management/enrollmentApi";
import { IoTrashOutline } from "react-icons/io5";
import Container from "@/components/Container";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDeleteStudentsMutation } from "@/features/User-Management/studentApi";
import { toast } from "react-toastify";

const EnrollmentStatus = () => {
  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Document Management", nameAr: "إدارة المستندات", nameFr: "Gestion des documents", href: "/document-management" },
    { nameEn: "Enrollment Status", nameAr: "حالة التسجيل", nameFr: "Statut d'inscription", href: "/document-management/enrollment/status" },
  ];

  const [search, setSearch] = useState("");
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector((state: RootState) => state.language);
  const { data, isLoading, refetch } = useGetEnrollmentStatusQuery(null);

  const [deleteStudents, { isLoading: isDeleting }] = useDeleteStudentsMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredData = data?.data?.content?.filter((student: any) =>
    student.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-600";
      case "graduate": return "bg-blue-100 text-blue-600";
      case "vacation": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudents({ id, lock: true }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم قفل حساب الطالب بنجاح."
          : currentLanguage === "fr"
          ? "Compte de l'élève verrouillé avec succès."
          : "Student account locked successfully."
      );
      refetch();
    } catch {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في قفل الحساب."
          : currentLanguage === "fr"
          ? "Échec du verrouillage du compte."
          : "Failed to lock student account."
      );
    }
  };

  const pathname = usePathname();

  const navItems = [
    {
      name: currentLanguage === "ar" ? "حالة التسجيل" : currentLanguage === "fr" ? "Statut d'inscription" : "Enrollment Status",
      href: "/document-management/enrollment/status",
    },
    {
      name: currentLanguage === "ar" ? "تاريخ التسجيل" : currentLanguage === "fr" ? "Date d'inscription" : "Enrollment Date",
      href: "/document-management/enrollment/date",
    },
  ];

  const translate = {
    title: currentLanguage === "ar" ? "سجلات التسجيل" : currentLanguage === "fr" ? "Dossiers d'inscription" : "Enrollment Records",
    fullName: currentLanguage === "ar" ? "الاسم الكامل" : currentLanguage === "fr" ? "Nom complet" : "Full Name",
    gender: currentLanguage === "ar" ? "النوع" : currentLanguage === "fr" ? "Genre" : "Gender",
    id: "ID",
    age: currentLanguage === "ar" ? "العمر" : currentLanguage === "fr" ? "Âge" : "Age",
    stage: currentLanguage === "ar" ? "المرحلة التعليمية" : currentLanguage === "fr" ? "Niveau scolaire" : "Educational Stage",
    status: currentLanguage === "ar" ? "حالة التسجيل" : currentLanguage === "fr" ? "Statut" : "Enrollment Status",
    mobile: currentLanguage === "ar" ? "رقم ولي الأمر" : currentLanguage === "fr" ? "Mobile" : "Mobile",
    action: currentLanguage === "ar" ? "الإجراء" : currentLanguage === "fr" ? "Action" : "Action",
    noData: currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available",
    result: currentLanguage === "ar" ? "نتيجة" : currentLanguage === "fr" ? "résultat(s)" : "Result(s)",
    searchPlaceholder: currentLanguage === "ar" ? "ابحث عن طالب" : currentLanguage === "fr" ? "Rechercher un étudiant" : "Search student",
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div>
          <h2 className="text-2xl font-bold text-textPrimary mb-4">{translate.title}</h2>
          <div className="flex gap-8 text-base font-medium text-gray-500">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition duration-200 ease-in-out ${pathname === item.href
                  ? "text-indigo-600 underline underline-offset-4"
                  : "hover:text-indigo-500"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Search */}
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={`relative mt-10 overflow-x-auto bg-bgPrimary sm:rounded-lg mb-8`}>
          <div className="p-4 flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
            <div className="mb-3">
              <div className="relative min-w-72 md:min-w-80">
                <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                  <BiSearchAlt className="text-secondary" size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    className="border-borderSecondary block w-full rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none"
                    placeholder={translate.searchPlaceholder}
                  />
                  <span className="min-w-[120px] text-primary">
                    {filteredData?.length} {translate.result}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translate.fullName}</TableHead>
                <TableHead>{translate.id}</TableHead>
                <TableHead>{translate.gender}</TableHead>
                <TableHead>{translate.age}</TableHead>
                <TableHead>{translate.stage}</TableHead>
                <TableHead>{translate.status}</TableHead>
                <TableHead>{translate.mobile}</TableHead>
                <TableHead>{translate.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              )) : !filteredData?.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {translate.noData}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((student: any, index: number) => (
                  <TableRow key={index} data-index={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.hasPicture
                          ? <img src={student.picture} alt={student.name} className="h-6 w-6 rounded-full object-cover" />
                          : <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-gray-500">N/A</div>
                        }
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.age ?? "-"}</TableCell>
                    <TableCell>{student.studyStage}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full min-w-[350px] text-sm font-medium ${getStatusStyle(student.status)}`}>
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>{student.ParentMobile ?? "-"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(student.id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                        disabled={isDeleting}
                      >
                        <IoTrashOutline size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default EnrollmentStatus;
