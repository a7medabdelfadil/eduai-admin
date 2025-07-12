/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import {
  useDeleteDepartmentsMutation,
  useGetAllDepartmentsQuery,
} from "@/features/Organization-Setteings/departmentApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
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
import { BiSearchAlt, BiTrash } from "react-icons/bi";

const Department = () => {
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
      nameEn: "Department",
      nameAr: "قسم",
      nameFr: "Département",
      href: "/organization-setting/department",
    },
  ];

  type Department = Record<string, any>;
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const { data, isLoading, refetch } = useGetAllDepartmentsQuery(null);
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentsMutation();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteDepartment(id).unwrap();
      toast.success(`Department with ID ${id} deleted successfully`);
      refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const filteredData = data?.data.content.filter((d: Department) =>
    search.trim() === ""
      ? true
      : d.name.toLowerCase().includes(search.toLowerCase()),
  );
  const displayedData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "ar"
              ? "قسم"
              : currentLanguage === "fr"
                ? "Département"
                : "Department"}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
            <Link
              href="/organization-setting/department/add-department"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة قسم"
                : currentLanguage === "fr"
                  ? "+ Ajouter Département"
                  : "+ Add Department"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الاسم"
                      : currentLanguage === "fr"
                        ? "Nom"
                        : "Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar" ? "المعرف" : "ID"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الاختصار"
                      : currentLanguage === "fr"
                        ? "Abréviation"
                        : "Abbreviation"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الوصف"
                      : currentLanguage === "fr"
                        ? "Description"
                        : "Description"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}
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
                      {Array(6)
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
                      colSpan={6}
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
                  displayedData.map((d: Department, index: number) => (
                    <TableRow key={d.id} data-index={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={d.picture ?? "/images/userr.png"}
                            className="h-6 w-6 rounded-full"
                            alt="#"
                          />
                          <p className="text-textSecondary">{d.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{d.id}</TableCell>
                      <TableCell>{d.abbreviation}</TableCell>
                      <TableCell>{d.description}</TableCell>
                      <TableCell>
                        <Link
                          href={`/organization-setting/department/${d.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {currentLanguage === "ar"
                            ? "عرض"
                            : currentLanguage === "fr"
                              ? "Voir"
                              : "View"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(d.id)}
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

export default Department;
