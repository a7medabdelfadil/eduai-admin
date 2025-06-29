"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import Spinner from "@/components/spinner";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

const Class = () => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar

  const breadcrumbs = [
    {
      nameEn: "Ai Insights",
      nameAr: "رؤى الذكاء الاصطناعي",
      nameFr: "Perspectives de l'IA",
      href: "/",
    },
    {
      nameEn: "School Comparisons",
      nameAr: "مقارنات المدارس",
      nameFr: "Comparaisons des écoles",
      href: "/insight/class",
    },
  ];

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
      <Container>
        <div className="grid overflow-x-auto">
          <div className="justify-left mb-5 ml-4 mt-10 flex flex-wrap gap-5 overflow-x-auto text-nowrap text-[20px] font-semibold">
            <Link className="hover:text-blue-500 hover:underline" href="/insight">
              {currentLanguage === "en"
                ? "Student Performance"
                : currentLanguage === "ar"
                  ? "أداء الطالب"
                  : currentLanguage === "fr"
                    ? "Performance de l'étudiant"
                    : "Student Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/school">
              {currentLanguage === "en"
                ? "School Performance"
                : currentLanguage === "ar"
                  ? "أداء المدرسة"
                  : currentLanguage === "fr"
                    ? "Performance de l'école"
                    : "School Performance"}
            </Link>
            <Link href="/insight/class" className="text-blue-500 underline">
              {currentLanguage === "en"
                ? "Class Performance"
                : currentLanguage === "ar"
                  ? "أداء الفصل"
                  : currentLanguage === "fr"
                    ? "Performance de la classe"
                    : "Class Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/ml-exam">
              {currentLanguage === "en"
                ? "ML Exam Performance"
                : currentLanguage === "ar"
                  ? "أداء اختبار تعلم الآلة"
                  : currentLanguage === "fr"
                    ? "Performance de l'examen ML"
                    : "ML Exam Performance"}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Class;
