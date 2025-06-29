/* eslint-disable @next/next/no-img-element */
"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import Spinner from "@/components/spinner";
import { useGetAllPaymentsQuery, useUpdateFeesDueDateMutation } from "@/features/Financial/paymentDueDateApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Payment = () => {
  const { data, isLoading } = useGetAllPaymentsQuery(null);
  const [updateFeesDueDate, { isLoading: isUpdating }] = useUpdateFeesDueDateMutation();

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

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

  const [formData, setFormData] = useState({
    tuitionDate: "",
    transportDate: "",
    activityDate: "",
    materialDate: "",
    uniformDate: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        tuitionDate: data.data.tuitionDate || "",
        transportDate: data.data.transportDate || "",
        activityDate: data.data.activityDate || "",
        materialDate: data.data.materialDate || "",
        uniformDate: data.data.uniformDate || "",
      });
    }
  }, [data]);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!data?.data?.id) return;

    try {
      await updateFeesDueDate({
        id: data.data.id,
        body: formData,
      }).unwrap();
      toast.success(
        currentLanguage === "en"
          ? "Saved successfully"
          : currentLanguage === "ar"
            ? "تم الحفظ بنجاح"
            : currentLanguage === "fr"
              ? "Enregistré avec succès"
              : "Saved successfully"
      );
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };


  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const taxFields = [
    { key: "tuitionDate", label: "Tuition Date", img: "/images/tuition.png" },
    { key: "activityDate", label: "Activity Date", img: "/images/calendar.png" },
    { key: "transportDate", label: "Transport Date", img: "/images/buss.png" },
    { key: "uniformDate", label: "Uniform Date", img: "/images/uniform.png" },
    { key: "materialDate", label: "Material Date", img: "/images/tuition.png" },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="grid w-full grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-10">
          {taxFields.map((tax, index) => (
            <div key={index} className="grid gap-4 rounded-xl bg-bgPrimary p-8">
              <div className="flex justify-between text-[20px] font-semibold">
                <p className="flex gap-2 items-center">
                  <img src={tax.img} alt="#" />
                  {tax.label}
                </p>
                <input
                  type="date"
                  value={formData[tax.key as keyof typeof formData]}
                  onChange={(e) => handleChange(tax.key, e.target.value)}
                  className="rounded bg-transparent px-2 py-1 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="rounded bg-primary px-6 py-2 text-white hover:bg-hover transition-all duration-300 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </Container>
    </>
  );
};

export default Payment;
