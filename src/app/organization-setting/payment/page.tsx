/* eslint-disable @next/next/no-img-element */
"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import Spinner from "@/components/spinner";
import { useGetAllPaymentsQuery } from "@/features/Financial/paymentDueDateApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";

const Payment = () => {
  const { data, isLoading } = useGetAllPaymentsQuery(null);
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Setting",
      nameAr: "إعداد المنظمة",
      nameFr: "Gestion Paramètres de l'organisation",
      href: "/organization-setting",
    },
    {
      nameEn: "Payment",
      nameAr: "قسط",
      nameFr: "Paiement",
      href: "/organization-setting/payment",
    },
  ];
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  const taxFields = [
    {
      label: "Tuition Date",
      type: data.data?.tuitionTaxType,
      value: data.data?.tuitionDate,
      img: "/images/tuition.png",
    },
    {
      label: "Activity Date",
      type: data.data?.activityTaxType,
      value: data.data?.activityDate,
      img: "/images/calendar.png",
    },
    {
      label: "TransportDate",
      type: data.data?.transportTaxType,
      value: data.data?.transportDate,
      img: "/images/buss.png",
    },
    {
      label: "Uniform Date",
      type: data.data?.uniformTaxType,
      value: data.data?.uniformDate,
      img: "/images/uniform.png",
    },
    {
      label: "Material Date",
      type: data.data?.materialTaxType,
      value: data.data?.activityDate,
      img: "/images/tuition.png",
    },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="grid w-full grid-cols-3 gap-10">
          {taxFields?.map((tax, index) => (
            <div key={index} className="grid gap-4 rounded-xl bg-bgPrimary p-8">
              <div className="flex justify-between text-[20px] font-semibold">
                <p className="flex gap-2">
                  <img src={tax.img} alt="#" />
                  {tax.label}
                </p>
                <p>{tax.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default Payment;
