"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Card from "@/components/card";
import { FiBook } from "react-icons/fi";
import { AiOutlineFileText } from "react-icons/ai";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const Course = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Course and Resource  Management",
      nameAr: "إدارة الدورات والموارد",
      nameFr: "Gestion des cours et des ressources",
      href: "/course",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const Courses = [
    {
      href: "/course/course-management",
      icon: <FiBook size={40} />,
      title:
        currentLanguage === "en"
          ? "Course Scheduling"
          : currentLanguage === "ar"
            ? "جدولة الدورات"
            : currentLanguage === "fr"
              ? "Planification des cours"
              : "Course", // Default to English
      description:
        currentLanguage === "en"
          ? "All Courses in School"
          : currentLanguage === "ar"
            ? "جميع الدورات في المدرسة"
            : currentLanguage === "fr"
              ? "Tous les cours à l'école"
              : "All Courses in School", // Default to English
    },
    {
      href: "/infrastructure/store/digital-resource",
      icon: <AiOutlineFileText size={40} />,
      title:
        currentLanguage === "en"
          ? "Resource Management"
          : currentLanguage === "ar"
            ? "إدارة الموارد"
            : currentLanguage === "fr"
              ? "Gestion des ressources"
              : "Resource", // Default to English
      description:
        currentLanguage === "en"
          ? "Create Course"
          : currentLanguage === "ar"
            ? "إنشاء دورة"
            : currentLanguage === "fr"
              ? "Créer un cours"
              : "Create Course", // Default to English
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

      <Container>
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-6">
          {Courses.map((item, index) => (
            <Card
              key={index}
              href={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default Course;
