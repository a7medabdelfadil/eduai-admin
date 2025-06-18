"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useGetAllLabsQuery,
  useDeleteLabsMutation,
} from "@/features/Infrastructure/labApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
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
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";

const Lab = () => {
  const breadcrumbs = [
    {
      nameEn: "Operations",
      nameAr: "العمليات",
      nameFr: "Opérations",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructure",
      href: "/infrastructure",
    },
    {
      nameEn: "Lab",
      nameAr: "المختبر",
      nameFr: "Laboratoire",
      href: "/infrastructure/lab",
    },
  ];

  const { data, error, isLoading, refetch } = useGetAllLabsQuery(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [deleteLab] = useDeleteLabsMutation();

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteLab(id).unwrap();
      toast.success(`Lab with ID ${id} deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to delete the lab");
    }
  };

  const filteredData = data?.data.content?.filter((lab: any) =>
    search.trim() === ""
      ? true
      : lab.labName?.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedData = filteredData?.slice(0, visibleCount);
  const handleShowMore = () => setVisibleCount(prev => prev + 10);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Lab"
              : currentLanguage === "ar"
                ? "المختبر"
                : currentLanguage === "fr"
                  ? "Laboratoire"
                  : "Lab"}{" "}
            {/* default */}
          </h1>
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
                  placeholder={
                    currentLanguage === "ar"
                      ? "بحث"
                      : currentLanguage === "fr"
                        ? "Recherche"
                        : "Search"
                  }
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0}{" "}
                  {currentLanguage === "ar"
                    ? "نتيجة"
                    : currentLanguage === "fr"
                      ? "résultat(s)"
                      : "result(s)"}
                </span>
              </div>
            </div>

            <Link
              href="/infrastructure/lab/add-lab"
              className="mx-3 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ مختبر جديد"
                : currentLanguage === "fr"
                  ? "+ Nouveau laboratoire"
                  : "+ New Lab"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "اسم المختبر"
                      : currentLanguage === "fr"
                        ? "Nom du laboratoire"
                        : "Lab Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "رقم المبنى"
                      : currentLanguage === "fr"
                        ? "Numéro du bâtiment"
                        : "Building Number"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الفئة"
                      : currentLanguage === "fr"
                        ? "Catégorie"
                        : "Category"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "نوع المختبر"
                      : currentLanguage === "fr"
                        ? "Type de laboratoire"
                        : "Lab Type"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "رقم الغرفة"
                      : currentLanguage === "fr"
                        ? "Numéro de la salle"
                        : "Room Number"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "السعة القصوى"
                      : currentLanguage === "fr"
                        ? "Capacité maximale"
                        : "Max Capacity"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "رقم الطابق"
                      : currentLanguage === "fr"
                        ? "Numéro du étage"
                        : "Floor Number"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "النوع"
                      : currentLanguage === "fr"
                        ? "Type"
                        : "Type"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الحالة"
                      : currentLanguage === "fr"
                        ? "Statut"
                        : "Status"}
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
                      {Array(11)
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
                      colSpan={11}
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
                  displayedData.map((lab: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{lab.labName}</TableCell>
                      <TableCell>{lab.buildingNumber}</TableCell>
                      <TableCell>{lab.category}</TableCell>
                      <TableCell>{lab.labType}</TableCell>
                      <TableCell>{lab.roomNumber}</TableCell>
                      <TableCell>{lab.maxCapacity}</TableCell>
                      <TableCell>{lab.floorNumber}</TableCell>
                      <TableCell>{lab.type}</TableCell>
                      <TableCell>{lab.status}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDelete(lab.roomId)}
                            className="text-red-500 transition hover:text-red-700"
                            title={
                              currentLanguage === "ar"
                                ? "حذف"
                                : currentLanguage === "fr"
                                  ? "Supprimer"
                                  : "Delete"
                            }
                          >
                            <RiDeleteBin6Fill className="h-5 w-5" />
                          </button>
                          <Link
                            href={`/infrastructure/lab/${lab.roomId}`}
                            className="text-blue-600 transition hover:text-blue-800"
                            title={
                              currentLanguage === "ar"
                                ? "تعديل"
                                : currentLanguage === "fr"
                                  ? "Modifier"
                                  : "Edit"
                            }
                          >
                            <RiEdit2Fill className="h-5 w-5" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {filteredData?.length > visibleCount && (
              <SeeMoreButton onClick={handleShowMore} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Lab;
