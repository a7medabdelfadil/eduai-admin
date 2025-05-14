/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetAllDisciplinaryRecordsQuery } from "@/features/Document-Management/disciplinaryApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";

const Disciplinary = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Other Official Documents",
      nameAr: "وثائق رسمية أخرى",
      nameFr: "Autres documents officiels",
      href: "/document-management/other",
    },
    {
      nameEn: "Disciplinary Records",
      nameAr: "السجلات التأديبية",
      nameFr: "Dossiers disciplinaires",
      href: "/document-management/other/disciplinary",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    data: disciplinaryData,
    isLoading: isDisciplinaryLoading,
    isError,
  } = useGetAllDisciplinaryRecordsQuery(null);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading)
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
        className={`${currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
          } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
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
              href="/document-management/other/disciplinary/add-disciplinary"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
            >
              Add Disciplinary Notice
            </Link>
          </div>
        </div>
        <div className="justify-left mb-[80px] ml-4 mt-[50px] flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link href="/document-management/other">
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            href="/document-management/other/disciplinary"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="text-textPrimary">
                <TableHead>{currentLanguage === "ar" ? "الاسم" : currentLanguage === "fr" ? "Nom" : "Name"}</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Sexe" : "Gender"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الدور" : currentLanguage === "fr" ? "Rôle" : "Role"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "رقم الهاتف" : currentLanguage === "fr" ? "Téléphone" : "Mobile"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "المخالفة" : currentLanguage === "fr" ? "Infraction" : "Violation"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "إجراء" : currentLanguage === "fr" ? "Action" : "Action Taken"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDisciplinaryLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  </TableRow>
                ))
              ) : isError || !disciplinaryData?.data?.content?.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    {currentLanguage === "ar"
                      ? "لا توجد سجلات"
                      : currentLanguage === "fr"
                        ? "Aucun dossier"
                        : "No records found"}
                  </TableCell>
                </TableRow>
              ) : (
                disciplinaryData.data.content.map((record: any, index: number) => (
                  <TableRow key={index} data-index={index}>
                    <TableCell className="flex items-center gap-2">
                      <img src={record.picture || "/images/userr.png"} className="h-[24px] w-[24px] rounded-full" alt="profile" />
                      {record.name}
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      {record.gender === "MALE"
                        ? currentLanguage === "ar" ? "ذكر" : currentLanguage === "fr" ? "Homme" : "Male"
                        : currentLanguage === "ar" ? "أنثى" : currentLanguage === "fr" ? "Femme" : "Female"}
                    </TableCell>
                    <TableCell>{record.role}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>{record.violationType.replace(/_/g, " ")}</TableCell>
                    <TableCell>{record.actionTaken.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <Link
                        href={`/document-management/other/disciplinary/${record.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View"}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        </div>
      </div>
    </>
  );
};

export default Disciplinary;
