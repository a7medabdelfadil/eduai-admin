/* eslint-disable @next/next/no-img-element */
"use client";
import { useGetAllDepartmentPermissionPermissionsQuery } from "@/features/Organization-Setteings/departmentPermissionApi";
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

const DepartmentPermission = () => {
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
      nameEn: "Department Permissions",
      nameAr: "صلاحيات المنظمة",
      nameFr: "Autorisations du département",
      href: "/organization-setting/permissions/department-permission",
    },
  ];

  type DepartmentPermission = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading } =
    useGetAllDepartmentPermissionPermissionsQuery(null);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [visibleCount, setVisibleCount] = useState(20);

  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    id:
      currentLanguage === "ar"
        ? "الرقم التعريفي"
        : currentLanguage === "fr"
          ? "ID"
          : "ID",
    academic:
      currentLanguage === "ar"
        ? "أكاديمي كامل"
        : currentLanguage === "fr"
          ? "Est complet académique"
          : "is Full Academic",
    admin:
      currentLanguage === "ar"
        ? "إداري كامل"
        : currentLanguage === "fr"
          ? "Est complet administratif"
          : "is Full Administration",
    comm:
      currentLanguage === "ar"
        ? "تواصل كامل"
        : currentLanguage === "fr"
          ? "Est complet communication"
          : "is Full Communication",
    ops:
      currentLanguage === "ar"
        ? "عمليات كاملة"
        : currentLanguage === "fr"
          ? "Est complet opérations"
          : "is Full Operations",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Vue"
          : "View",
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
          ? "Éditer"
          : "Edit",
    del:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
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

  const filtered =
    data?.data?.content?.filter((d: any) =>
      d.name.toLowerCase().includes(search.trim().toLowerCase()),
    ) || [];

  const visibleData = filtered.slice(0, visibleCount);
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-bold text-textPrimary">
            {currentLanguage === "ar"
              ? "صلاحيات القسم"
              : currentLanguage === "fr"
                ? "Autorisations du département"
                : "Department Permissions"}
          </h1>
        </div>

        <div className="justify-left mb-6 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/organization-setting/permissions/department-permission"
            className="text-primary underline"
          >
            {currentLanguage === "ar"
              ? "القسم"
              : currentLanguage === "fr"
                ? "Département"
                : "Department"}
          </Link>
          <Link
            className="hover:text-primary hover:underline"
            href="/organization-setting/permissions/employee-permission"
          >
            {currentLanguage === "ar"
              ? "الموظف"
              : currentLanguage === "fr"
                ? "Employé"
                : "Employee"}
          </Link>
        </div>

        <div className="rounded-xl bg-bgPrimary max-w-screen overflow-x-hidden">

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
                  {filtered.length} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/organization-setting/permissions/add"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة أذونات القسم"
                : currentLanguage === "fr"
                  ? "+ Ajouter les autorisations du département"
                  : "+ Add Department Permissions"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.id}</TableHead>
                  <TableHead>{translate.academic}</TableHead>
                  <TableHead>{translate.admin}</TableHead>
                  <TableHead>{translate.comm}</TableHead>
                  <TableHead>{translate.ops}</TableHead>
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
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((item: any, index: number) => (
                    <TableRow key={item.id} data-index={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {item.isFullAcademic ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {item.isFullAdministration ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {item.isFullCommunication ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {item.isFullOperations ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/organization-setting/permissions/department-permission/${item.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <button
                          className="text-error transition hover:text-red-800"
                          title={translate.del}
                          onClick={() => {
                            console.log("Delete", item.id);
                          }}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < filtered.length && (
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

export default DepartmentPermission;
