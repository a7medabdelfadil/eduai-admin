"use client";
/* eslint-disable @next/next/no-img-element */
import Card from "@/components/card";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import {
  FaDollarSign,
  FaWallet,
  FaBuilding,
  FaMoneyBill,
  FaCalculator,
  FaSchool,
} from "react-icons/fa";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const FinancialManagement = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const financials = [
    {
      href: "/fees-management",
      icon: <FaDollarSign size={30} />,
      title:
        currentLanguage === "en"
          ? "Invoices"
          : currentLanguage === "ar"
            ? "الفواتير"
            : currentLanguage === "fr"
              ? "Factures"
              : "Fees",
      description:
        currentLanguage === "en"
          ? "All invoices"
          : currentLanguage === "ar"
            ? "جميع الفواتير  "
            : currentLanguage === "fr"
              ? "Toutes les factures"
              : "All invoices ",
    },
    {
      href: "/fees-management/scholarship",
      icon: <FaSchool size={30} />,
      title:
        currentLanguage === "en"
          ? "Scholarship"
          : currentLanguage === "ar"
            ? "المنح الدراسية"
            : currentLanguage === "fr"
              ? "Bourses"
              : "Fees",
      description:
        currentLanguage === "en"
          ? "All scholarships"
          : currentLanguage === "ar"
            ? "جميع المنح الدراسية"
            : currentLanguage === "fr"
              ? "Toutes les bourses"
              : "All scholarship",
    },
    {
      href: "/financial-management/budget",
      icon: <FaWallet size={30} />,
      title:
        currentLanguage === "en"
          ? "Budget"
          : currentLanguage === "ar"
            ? "الميزانية"
            : currentLanguage === "fr"
              ? "Budget"
              : "Budget", // Default to English
      description:
        currentLanguage === "en"
          ? "All information about budgeting"
          : currentLanguage === "ar"
            ? "كل المعلومات عن إعداد الميزانية"
            : currentLanguage === "fr"
              ? "Toutes les informations sur la budgétisation"
              : "All information about budgeting", // Default to English
    },
    {
      href: "/financial-management/bank",
      icon: <FaBuilding size={30} />,
      title:
        currentLanguage === "en"
          ? "Bank"
          : currentLanguage === "ar"
            ? "البنك"
            : currentLanguage === "fr"
              ? "Banque"
              : "Bank", // Default to English
      description:
        currentLanguage === "en"
          ? "All information about Bank Account"
          : currentLanguage === "ar"
            ? "كل المعلومات عن حساب البنك"
            : currentLanguage === "fr"
              ? "Toutes les informations sur le compte bancaire"
              : "All information about Bank Account", // Default to English
    },
    {
      href: "/financial-management/tuition",
      icon: <FaMoneyBill size={30} />,
      title:
        currentLanguage === "en"
          ? "Payment"
          : currentLanguage === "ar"
            ? "الدفع"
            : currentLanguage === "fr"
              ? "Paiement"
              : "Paiement", // Default to English
      description:
        currentLanguage === "en"
          ? "Payment Request and Setting"
          : currentLanguage === "ar"
            ? "طلب الدفع والاعدادات"
            : currentLanguage === "fr"
              ? "Demande de paiement, Paramètre"
              : "Demande de paiement, Paramètre", // Default to English
    },
    {
      href: "/financial-management/taxes",
      icon: <FaCalculator size={30} />,
      title:
        currentLanguage === "en"
          ? "Taxes"
          : currentLanguage === "ar"
            ? "الضرائب"
            : currentLanguage === "fr"
              ? "Impôts"
              : "Impôts", // Default to English
      description:
        currentLanguage === "en"
          ? "Payment Request and Setting"
          : currentLanguage === "ar"
            ? "طلب الدفع والاعدادات"
            : currentLanguage === "fr"
              ? "Demande de paiement, Paramètre"
              : "Demande de paiement, Paramètre", // Default to English
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
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
          } mt-12 grid justify-center`}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {financials.map((item, index) => (
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

export default FinancialManagement;
