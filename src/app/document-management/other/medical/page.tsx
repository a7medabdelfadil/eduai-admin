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
  TableRow,
} from "@/components/Table";
import { useState } from "react";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";
import SeeMoreButton from "@/components/SeeMoreButton";

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
  const {
    data: students,
    isLoading,
    error,
  } = useGetStudentsWithMedicalStatusQuery(null);
  const filteredStudents = students?.filter((student: any) =>
    student.name.toLowerCase().includes(searchValue.toLowerCase()),
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredStudents?.slice(0, visibleCount);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <Text font={"bold"} size={"3xl"}>
          {currentLanguage === "ar"
            ? "وثائق رسمية أخرى"
            : currentLanguage === "fr"
              ? "Autres documents officiels"
              : "Other Official Documents"}
        </Text>
        <div className="justify-left my-8 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
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
            href="/document-management/other/medical"
          >
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/disciplinary"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/financial"
          >
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/legal"
          >
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
        <div className="rounded-xl bg-bgPrimary">
          <div className="flex items-center justify-between text-center max-[502px]:grid max-[502px]:justify-center">
            <div className="flex justify-between rounded-t-xl bg-bgPrimary p-4 text-center max-[502px]:grid max-[502px]:justify-center">
              <div className="mb-3">
                <label htmlFor="icon" className="sr-only">
                  Search
                </label>
                <div className="relative min-w-72 md:min-w-80">
                  <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                    <BiSearchAlt className="text-secondary" size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                      type="text"
                      id="icon"
                      name="icon"
                      className="border-borderSecondary block w-full rounded-lg border-2 bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
                      placeholder={
                        currentLanguage === "ar"
                          ? "ابحث عن أي شيء"
                          : currentLanguage === "fr"
                            ? "Rechercher n'importe quoi"
                            : "Search anything"
                      }
                    />
                    <span className="min-w-[120px] text-primary">
                      {filteredStudents?.length} Result(s)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                href="/document-management/other/medical/add-medical"
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "+ إضافة سجل طبي"
                  : currentLanguage === "fr"
                    ? "+ Ajouter un dossier médical"
                    : "+ Add Medical Record"}
              </Link>
            </div>
          </div>
          <div className="relative overflow-x-auto bg-bgPrimary shadow-md sm:rounded-lg">
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
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "المعرف"
                      : currentLanguage === "fr"
                        ? "ID"
                        : "ID"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Sexe"
                        : "Gender"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "العمر"
                      : currentLanguage === "fr"
                        ? "Âge"
                        : "Age"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "المرحلة الدراسية"
                      : currentLanguage === "fr"
                        ? "Niveau d'étude"
                        : "Study Stage"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "رقم الهاتف"
                      : currentLanguage === "fr"
                        ? "Mobile"
                        : "Mobile"}
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
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(4)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={8} className="py-4 text-center">
                        <Spinner />
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="p-6 text-center text-red-500"
                    >
                      Failed to load student data.
                    </TableCell>
                  </TableRow>
                ) : filteredStudents?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-4 text-center text-muted"
                    >
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
            {visibleCount < (filteredStudents?.length || 0) && (
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

export default Medical;
