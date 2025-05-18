/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetStudentsWithMedicalStatusQuery } from "@/features/Document-Management/otherOfficialDocumentsApi";
import { Text } from "@/components/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/Table";
import { useState } from "react";

const Medical = () => {
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
      nameEn: "Medical Records",
      nameAr: "السجلات الطبية",
      nameFr: "Dossiers médicaux",
      href: "/document-management/other/medical",
    },
  ];
  const [searchValue, setSearchValue] = useState("");
  const { data: students, isLoading, error } = useGetStudentsWithMedicalStatusQuery(null);
  const filteredStudents = students?.filter((student: any) =>
    student.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

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
          } relative mx-3 mt-10 h-screen bg-transparent sm:rounded-lg`}
      >

        <Text font={"bold"} size={"3xl"}>Other Official Documents</Text>
        <div className="justify-left ml-4 my-8 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/document-management/other"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link
            className="text-blue-500 underline"
            href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/disciplinary">
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
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
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search by name"
                    : currentLanguage === "ar"
                      ? "ابحث بالاسم"
                      : "Recherche par nom"
                }
              />

            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="text-textPrimary">
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الاسم"
                    : currentLanguage === "fr"
                      ? "Nom"
                      : "Name"}
                </TableHead>
                <TableHead>{currentLanguage === "ar" ? "المعرف" : currentLanguage === "fr" ? "ID" : "ID"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Sexe" : "Gender"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "العمر" : currentLanguage === "fr" ? "Âge" : "Age"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "المرحلة الدراسية" : currentLanguage === "fr" ? "Niveau d'étude" : "Study Stage"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "رقم الهاتف" : currentLanguage === "fr" ? "Mobile" : "Mobile"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الحالة" : currentLanguage === "fr" ? "Statut" : "Status"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View"}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                [...Array(4)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8} className="text-center py-4">
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-6 text-center text-red-500">
                    Failed to load student data.
                  </TableCell>
                </TableRow>
              ) : filteredStudents?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted">
                    {currentLanguage === "ar"
                      ? "لا توجد سجلات طبية"
                      : currentLanguage === "fr"
                        ? "Aucun enregistrement médical trouvé"
                        : "No medical records found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents?.map((student: any, idx: number) => (
                  <TableRow key={student.id} data-index={idx}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            student.hasPicture && student.picture
                              ? student.picture
                              : "/images/userr.png"
                          }
                          className="h-[24px] w-[24px] rounded-full object-cover"
                          alt={student.name}
                        />
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.age ?? "—"}</TableCell>
                    <TableCell>{student.studyStage}</TableCell>
                    <TableCell>{student.ParentMobile}</TableCell>
                    <TableCell>{student.status}</TableCell>
                    <TableCell>
                      <Link
                        href={`/student/medical-record/${student.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "عرض"
                          : currentLanguage === "fr"
                            ? "Voir"
                            : "View"}
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

export default Medical;
