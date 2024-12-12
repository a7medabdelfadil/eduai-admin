"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineSave } from "react-icons/ai"; // Save Icon
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetTaxeByIdQuery,
  useUpdateTaxesMutation,
} from "@/features/Financial/taxesApi";
import React from "react";
import Spinner from "@/components/spinner";

interface TaxesId {
  params: {
    taxesId: number;
  };
}

const EditTaxes = ({ params }: TaxesId) => {
  const { taxesId } = params;

  const taxTypes = [
    {
      value: "INCOME",
      labels: {
        en: "Income",
        ar: "دخل",
        fr: "Revenu",
      },
    },
    {
      value: "PROPERTY",
      labels: {
        en: "Property",
        ar: "ملكية",
        fr: "Propriété",
      },
    },
    {
      value: "PAYROLL",
      labels: {
        en: "Payroll",
        ar: "رواتب",
        fr: "Paie",
      },
    },
  ];

  const paymentMethods = [
    {
      value: "ONLINE_PAYMENT",
      labels: {
        en: "Online payment",
        ar: "دفع عبر الإنترنت",
        fr: "Paiement en ligne",
      },
    },
    {
      value: "BANK_TRANSFER",
      labels: {
        en: "Bank transfer",
        ar: "تحويل بنكي",
        fr: "Virement bancaire",
      },
    },
    {
      value: "CHECK",
      labels: {
        en: "Check",
        ar: "شيك",
        fr: "Chèque",
      },
    },
  ];

  const breadcrumbs = [
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Taxes",
      nameAr: "الضرائب",
      nameFr: "Taxes",
      href: "/financial-management/taxes",
    },
    {
      nameEn: "Edit Taxes",
      nameAr: "تعديل الضريبة",
      nameFr: "Modifier la taxe",
      href: `/financial-management/taxes/${params.taxesId}`,
    },
  ];
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch the tax data by ID
  const { data: taxData, isLoading: isFetching } = useGetTaxeByIdQuery(taxesId);

  // Update mutation
  const [updateTax, { isLoading }] = useUpdateTaxesMutation();

  // Prefill the form when the tax data is fetched
  React.useEffect(() => {
    if (taxData) {
      reset({
        taxType: taxData.data.taxType,
        paymentMethod: taxData.data.paymentMethod,
        paidAmount: taxData.data.paidAmount,
        startDate: taxData.data.startDate,
        endDate: taxData.data.endDate,
        paymentDate: taxData.data.paymentDate,
        receiptNumber: taxData.data.receiptNumber,
        about: taxData.data.about,
      });
    }
  }, [taxData, reset]);

  const onSubmit = async (data: any) => {
    // Create the request body
    const taxUpdateData = {
      taxType: data.taxType,
      paymentMethod: data.paymentMethod,
      paidAmount: parseFloat(data.paidAmount),
      startDate: data.startDate,
      endDate: data.endDate,
      paymentDate: data.paymentDate,
      receiptNumber: data.receiptNumber,
      about: data.about,
    };

    try {
      await updateTax({ id: taxesId, formData: taxUpdateData }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث سجل الضريبة بنجاح"
          : currentLanguage === "fr"
            ? "Enregistrement de la taxe mis à jour avec succès"
            : "Tax record updated successfully",
      );
    } catch (err) {
      console.error("Failed to update tax record", err);
      toast.error(
        currentLanguage === "ar"
          ? "فشل في تحديث سجل الضريبة"
          : currentLanguage === "fr"
            ? "Échec de la mise à jour de l'enregistrement de la taxe"
            : "Failed to update tax record",
      );
    }
  };

  if (loading || isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mt-20`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 rounded-xl bg-bgSecondary p-10">
            <div className="rounded-xl border border-borderPrimary bg-bgPrimary p-10">
              <div className="mb-10 flex w-full items-center justify-between text-[18px] font-semibold">
                <h1 className="text-[20px]">
                  {currentLanguage === "ar"
                    ? "تفاصيل الضريبة"
                    : currentLanguage === "fr"
                      ? "Détails de la taxe"
                      : "Tax Details"}
                </h1>
                <button className="flex gap-2" type="submit">
                  <AiOutlineSave size={25} />
                  {isLoading
                    ? currentLanguage === "ar"
                      ? "جاري الحفظ..."
                      : currentLanguage === "fr"
                        ? "Enregistrement..."
                        : "Saving..."
                    : currentLanguage === "ar"
                      ? "حفظ"
                      : currentLanguage === "fr"
                        ? "Enregistrer"
                        : "Save"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold max-[614px]:grid-cols-1">
                {/* Tax Type */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "نوع الضريبة"
                    : currentLanguage === "fr"
                      ? "Type de taxe"
                      : "Tax Type"}
                  <select
                    {...register("taxType", {
                      required:
                        currentLanguage === "ar"
                          ? "نوع الضريبة مطلوب"
                          : currentLanguage === "fr"
                            ? "Le type de taxe est requis"
                            : "Tax Type is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  >
                    <option value="">
                      {currentLanguage === "ar"
                        ? "اختر نوع الضريبة"
                        : currentLanguage === "fr"
                          ? "Sélectionnez le type de taxe"
                          : "Select Tax Type"}
                    </option>
                    {taxTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {currentLanguage === "ar"
                          ? type.labels.ar
                          : currentLanguage === "fr"
                            ? type.labels.fr
                            : type.labels.en}
                      </option>
                    ))}
                  </select>
                  {errors.taxType && (
                    <span className="text-red-500">
                      {errors.taxType.message?.toString()}
                    </span>
                  )}
                </label>
                {/* Payment Method */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "طريقة الدفع"
                    : currentLanguage === "fr"
                      ? "Méthode de paiement"
                      : "Payment Method"}
                  <select
                    {...register("paymentMethod", {
                      required:
                        currentLanguage === "ar"
                          ? "طريقة الدفع مطلوبة"
                          : currentLanguage === "fr"
                            ? "La méthode de paiement est requise"
                            : "Payment Method is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  >
                    <option value="">
                      {currentLanguage === "ar"
                        ? "اختر طريقة الدفع"
                        : currentLanguage === "fr"
                          ? "Sélectionnez la méthode de paiement"
                          : "Select Payment Method"}
                    </option>
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {currentLanguage === "ar"
                          ? method.labels.ar
                          : currentLanguage === "fr"
                            ? method.labels.fr
                            : method.labels.en}
                      </option>
                    ))}
                  </select>
                  {errors.paymentMethod && (
                    <span className="text-red-500">
                      {errors.paymentMethod.message?.toString()}
                    </span>
                  )}
                </label>
                {/* Paid Amount */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "المبلغ المدفوع"
                    : currentLanguage === "fr"
                      ? "Montant payé"
                      : "Paid Amount"}
                  <input
                    type="number"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب المبلغ المدفوع"
                        : currentLanguage === "fr"
                          ? "Entrez le montant payé"
                          : "Enter Paid Amount"
                    }
                    {...register("paidAmount", {
                      required:
                        currentLanguage === "ar"
                          ? "المبلغ المدفوع مطلوب"
                          : currentLanguage === "fr"
                            ? "Le montant payé est requis"
                            : "Paid Amount is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.paidAmount && (
                    <span className="text-red-500">
                      {errors.paidAmount.message?.toString()}
                    </span>
                  )}
                </label>
                {/* Start Date */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "تاريخ البدء"
                    : currentLanguage === "fr"
                      ? "Date de début"
                      : "Start Date"}
                  <input
                    type="date"
                    {...register("startDate", {
                      required:
                        currentLanguage === "ar"
                          ? "تاريخ البدء مطلوب"
                          : currentLanguage === "fr"
                            ? "La date de début est requise"
                            : "Start Date is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.startDate && (
                    <span className="text-red-500">
                      {errors.startDate.message?.toString()}
                    </span>
                  )}
                </label>
                {/* End Date */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "تاريخ الانتهاء"
                    : currentLanguage === "fr"
                      ? "Date de fin"
                      : "End Date"}
                  <input
                    type="date"
                    {...register("endDate", {
                      required:
                        currentLanguage === "ar"
                          ? "تاريخ الانتهاء مطلوب"
                          : currentLanguage === "fr"
                            ? "La date de fin est requise"
                            : "End Date is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.endDate && (
                    <span className="text-red-500">
                      {errors.endDate.message?.toString()}
                    </span>
                  )}
                </label>
                {/* Payment Date */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "تاريخ الدفع"
                    : currentLanguage === "fr"
                      ? "Date de paiement"
                      : "Payment Date"}
                  <input
                    type="datetime-local"
                    {...register("paymentDate", {
                      required:
                        currentLanguage === "ar"
                          ? "تاريخ الدفع مطلوب"
                          : currentLanguage === "fr"
                            ? "La date de paiement est requise"
                            : "Payment Date is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.paymentDate && (
                    <span className="text-red-500">
                      {errors.paymentDate.message?.toString()}
                    </span>
                  )}
                </label>
                {/* Receipt Number */}
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "رقم الإيصال"
                    : currentLanguage === "fr"
                      ? "Numéro de reçu"
                      : "Receipt Number"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب رقم الإيصال"
                        : currentLanguage === "fr"
                          ? "Entrez le numéro de reçu"
                          : "Enter Receipt Number"
                    }
                    {...register("receiptNumber", {
                      required:
                        currentLanguage === "ar"
                          ? "رقم الإيصال مطلوب"
                          : currentLanguage === "fr"
                            ? "Le numéro de reçu est requis"
                            : "Receipt Number is required",
                    })}
                    className="h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.receiptNumber && (
                    <span className="text-red-500">
                      {errors.receiptNumber.message?.toString()}
                    </span>
                  )}
                </label>
                {/* About */}
                <label className="col-span-2 grid">
                  {currentLanguage === "ar"
                    ? "حول"
                    : currentLanguage === "fr"
                      ? "À propos"
                      : "About"}
                  <textarea
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب معلومات إضافية"
                        : currentLanguage === "fr"
                          ? "Entrez des informations supplémentaires"
                          : "Enter additional information"
                    }
                    {...register("about", {
                      required:
                        currentLanguage === "ar"
                          ? "المعلومات مطلوبة"
                          : currentLanguage === "fr"
                            ? "Les informations sont requises"
                            : "About is required",
                    })}
                    className="h-[100px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.about && (
                    <span className="text-red-500">
                      {errors.about.message?.toString()}
                    </span>
                  )}
                </label>
              </div>
            </div>
            {/* Removed file upload section as image is not handled in the update */}
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTaxes;
