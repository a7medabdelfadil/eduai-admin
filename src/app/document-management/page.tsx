"use client";
import Card from "@/components/card";
/* eslint-disable @next/next/no-img-element */
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { HiAcademicCap } from "react-icons/hi"; // Certificate
import { FaFileAlt } from "react-icons/fa"; // Transcripts
import { BsPersonLinesFill } from "react-icons/bs"; // Enrollment
import { FaRegCalendarCheck } from "react-icons/fa"; // Attendance
import { MdDescription } from "react-icons/md"; // Other official documents
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const DocumentManagement = () => {
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
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const documents = [
    {
      href: "/document-management/certificate",
      icon: <HiAcademicCap size={40} />,
      title:
        currentLanguage === "en"
          ? "Certificate"
          : currentLanguage === "ar"
            ? "شهادة"
            : currentLanguage === "fr"
              ? "Certificats"
              : "Certificate", // Default to English
      description:
        currentLanguage === "en"
          ? "All certificates: Completion, Achievement, Participation, and Professional Development Certificates"
          : currentLanguage === "ar"
            ? "جميع الشهادات: إتمام، إنجاز، مشاركة، وشهادات التطوير المهني"
            : currentLanguage === "fr"
              ? "Tous les certificats : d'achèvement, d'accomplissement, de participation et de développement professionnel"
              : "All certificates: Completion, Achievement, Participation, and Professional Development Certificates", // Default to English
    },
    {
      href: "/document-management/transcript",
      icon: <FaFileAlt size={40} />,
      title:
        currentLanguage === "en"
          ? "Transcripts"
          : currentLanguage === "ar"
            ? " كشف النقاط"
            : currentLanguage === "fr"
              ? "Relevés de notes"
              : "Transcripts", // Default to English
      description:
        currentLanguage === "en"
          ? "Some information about Course List, List of points and GPA"
          : currentLanguage === "ar"
            ? "بعض المعلومات حول قائمة الدورات، قائمة النقاط والمعدل التراكمي"
            : currentLanguage === "fr"
              ? "Quelques informations sur la liste des cours, la liste des points et le GPA"
              : "Some information about Course List, List of points and GPA", // Default to English
    },
    {
      href: "/document-management/enrollment",
      icon: <BsPersonLinesFill size={40} />,
      title:
        currentLanguage === "en"
          ? "Enrollment"
          : currentLanguage === "ar"
            ? "التسجيل"
            : currentLanguage === "fr"
              ? "Inscription"
              : "Enrollment", // Default to English
      description:
        currentLanguage === "en"
          ? "Some information about Admission Forms, Enrollment Status, and Enrollment Dates"
          : currentLanguage === "ar"
            ? "بعض المعلومات حول استمارات القبول، حالة التسجيل، وتواريخ التسجيل"
            : currentLanguage === "fr"
              ? "Quelques informations sur les formulaires d'admission, le statut d'inscription, et les dates d'inscription"
              : "Some information about Admission Forms, Enrollment Status, and Enrollment Dates", // Default to English
    },
    {
      href: "/document-management/attendance",
      icon: <FaRegCalendarCheck size={40} />,
      title:
        currentLanguage === "en"
          ? "Attendance"
          : currentLanguage === "ar"
            ? "الحضور"
            : currentLanguage === "fr"
              ? "Présence"
              : "Attendance", // Default to English
      description:
        currentLanguage === "en"
          ? "Some Information about Absence Reports and Early Departure Records"
          : currentLanguage === "ar"
            ? "بعض المعلومات حول تقارير الغياب وسجلات المغادرة المبكرة"
            : currentLanguage === "fr"
              ? "Quelques informations sur les rapports d'absence et les enregistrements de départ anticipé"
              : "Some Information about Absence Reports and Early Departure Records", // Default to English
    },
    {
      href: "/document-management/other",
      icon: <MdDescription size={40} />,
      title:
        currentLanguage === "en"
          ? "Other Official Documents"
          : currentLanguage === "ar"
            ? "وثائق رسمية أخرى"
            : currentLanguage === "fr"
              ? "Autres documents officiels"
              : "Other Official Documents", // Default to English
      description:
        currentLanguage === "en"
          ? "Some information about ID Cards, Medical Records, Disciplinary Records, Financial Aid Documents, Legal Documents"
          : currentLanguage === "ar"
            ? "بعض المعلومات حول بطاقات الهوية، السجلات الطبية، السجلات التأديبية، وثائق المساعدة المالية، الوثائق القانونية"
            : currentLanguage === "fr"
              ? "Quelques informations sur les cartes d'identité, les dossiers médicaux, les dossiers disciplinaires, les documents d'aide financière"
              : "Some information about ID Cards, Medical Records, Disciplinary Records, Financial Aid Documents, Legal Documents", // Default to English
    },
  ];

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
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
        } mt-12 grid justify-center`}
      >
        <div className="grid grid-cols-2 gap-5 max-[577px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {documents.map((item, index) => (
            <Card
              key={index}
              href={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DocumentManagement;
