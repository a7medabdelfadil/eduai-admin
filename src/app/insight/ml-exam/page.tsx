"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

const MLExam = () => {
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
      href: "/insight",
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
      <div
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        }`}
      >
        <div className="grid overflow-x-auto">
          <div className="justify-left mb-5 ml-4 mt-10 flex gap-5 overflow-x-auto text-nowrap text-[20px] font-semibold">
            <Link href="/insight">
              {currentLanguage === "en"
                ? "Student Performance"
                : currentLanguage === "ar"
                  ? "أداء الطالب"
                  : currentLanguage === "fr"
                    ? "Performance de l'étudiant"
                    : "Student Performance"}
            </Link>
            <Link href="/insight/school">
              {currentLanguage === "en"
                ? "School Performance"
                : currentLanguage === "ar"
                  ? "أداء المدرسة"
                  : currentLanguage === "fr"
                    ? "Performance de l'école"
                    : "School Performance"}
            </Link>
            <Link href="/insight/class">
              {currentLanguage === "en"
                ? "Class Performance"
                : currentLanguage === "ar"
                  ? "أداء الفصل"
                  : currentLanguage === "fr"
                    ? "Performance de la classe"
                    : "Class Performance"}
            </Link>
            <Link href="/insight/ml-exam" className="text-blue-500 underline">
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
      </div>
    </>
  );
};

export default MLExam;
