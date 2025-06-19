/* eslint-disable @next/next/no-img-element */
"use client";
import { useGetAllEmployeePermissionsQuery } from "@/features/Organization-Setteings/employeePermissionApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import { BiEditAlt, BiSearchAlt, BiTrash } from "react-icons/bi";

const EmployeePermission = () => {
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
      nameEn: "Employee Permissions",
      nameAr: "صلاحيات العامل",
      nameFr: "Employee Permissions",
      href: "/organization-setting/permissions/employee-permission",
    },
  ];

  type EmployeePermission = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useGetAllEmployeePermissionsQuery(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    id:
      currentLanguage === "ar"
        ? "معرف"
        : currentLanguage === "fr"
          ? "ID"
          : "ID",
    academic:
      currentLanguage === "ar"
        ? "إدارة أكاديمية كاملة"
        : currentLanguage === "fr"
          ? "Académique complet"
          : "is Full Academic",
    admin:
      currentLanguage === "ar"
        ? "إدارة إدارية كاملة"
        : currentLanguage === "fr"
          ? "Administration complète"
          : "is Full Administration",
    comm:
      currentLanguage === "ar"
        ? "اتصالات كاملة"
        : currentLanguage === "fr"
          ? "Communication complète"
          : "is Full Communication",
    ops:
      currentLanguage === "ar"
        ? "عمليات كاملة"
        : currentLanguage === "fr"
          ? "Opérations complètes"
          : "is Full Operations",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    edit:
      currentLanguage === "ar"
        ? "تعديل"
        : currentLanguage === "fr"
          ? "modifier"
          : "Edit",
    del:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "supprimer"
          : "Delete",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن قسم"
        : currentLanguage === "fr"
          ? "Rechercher un département"
          : "Search department",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  const filteredData =
    data?.data?.content?.filter((employeePermission: any) =>
      search.trim() === ""
        ? true
        : employeePermission.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-bold text-textPrimary">
            {currentLanguage === "ar"
              ? "صلاحيات الموظفين"
              : currentLanguage === "fr"
                ? "Autorisations des employés"
                : "Employee Permissions"}
          </h1>
        </div>
        <div className="justify-left mb-6 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            className="hover:text-primary hover:underline"
            href="/organization-setting/permissions/department-permission"
          >
            {currentLanguage === "ar"
              ? "القسم"
              : currentLanguage === "fr"
                ? "Département"
                : "Department"}
          </Link>
          <Link
            className="text-primary underline"
            href="/organization-setting/permissions/employee-permission"
          >
            {currentLanguage === "ar"
              ? "الموظف"
              : currentLanguage === "fr"
                ? "Employé"
                : "Employee"}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData.length} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/organization-setting/permissions/add/employee"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة صلاحيات الموظفين"
                : currentLanguage === "fr"
                  ? "+ Ajouter des autorisations d'employé"
                  : "+ Add Employee Permissions"}
            </Link>
          </div>

          <div className="relative bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.id}</TableHead>
                  <TableHead>{translate.academic}</TableHead>
                  <TableHead>{translate.admin}</TableHead>
                  <TableHead>{translate.comm}</TableHead>
                  <TableHead>{translate.ops}</TableHead>
                  <TableHead>{translate.edit}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((employeePermission: any, index: number) => (
                    <TableRow key={employeePermission.id} data-index={index}>
                      <TableCell>{employeePermission.name}</TableCell>
                      <TableCell>{employeePermission.id}</TableCell>
                      <TableCell>
                        {employeePermission.isFullAcademic ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {employeePermission.isFullAdministration ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {employeePermission.isFullCommunication ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {employeePermission.isFullOperations ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/organization-setting/permissions/employee-permission/${employeePermission.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < filteredData.length && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 20)}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default EmployeePermission;
