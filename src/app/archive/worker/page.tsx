/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useGetAllWorkersQuery,
  useDeleteWorkersMutation,
} from "@/features/User-Management/workerApi";
import Link from "next/link";
import { useState } from "react";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import SeeMoreButton from "@/components/SeeMoreButton";
import { FaUnlockAlt } from "react-icons/fa";

const Worker = () => {
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
      nameEn: "Worker",
      nameAr: "العامل",
      nameFr: "Travailleur",
      href: "/archive/worker",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
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
        ? "إلغاء الحظر"
        : currentLanguage === "fr"
          ? "Débloquer"
          : "Unblock",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
  };

  type Worker = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllWorkersQuery({
    archived: "true",
    page: 0,
    size: 1000000,
  });
  const [deleteWorker] = useDeleteWorkersMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteWorker({ id: id, lock: "false" }).unwrap();
      toast.success(`Worker with ID ${id} unLocked successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const filteredData = data?.data?.content?.filter((worker: Worker) =>
    worker.name?.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const [visibleCount, setVisibleCount] = useState(20);

  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "All Workers"
              : currentLanguage === "ar"
                ? "جميع العمال"
                : currentLanguage === "fr"
                  ? "Tous les travailleurs"
                  : "All Workers"}{" "}
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
                  <TableHead>{`${translate.view} / ${translate.action}`}</TableHead>
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
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((worker: Worker, index: number) => (
                    <TableRow key={worker.id} data-index={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={worker.picture || "/images/userr.png"}
                            className="h-6 w-6 rounded-full border object-cover"
                            alt={worker.name || "worker"}
                          />
                          <span>{worker.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{worker.id}</TableCell>
                      <TableCell>{worker.gender}</TableCell>
                      <TableCell>{worker.nationality}</TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/user-management/worker/view-worker/${worker.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {translate.view}
                          </Link>
                          <button
                            onClick={() => handleDelete(worker.id)}
                            className="text-error transition hover:text-red-800"
                            title={translate.unlock}
                          >
                            <FaUnlockAlt size={20} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < (filteredData?.length || 0) && (
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

export default Worker;
