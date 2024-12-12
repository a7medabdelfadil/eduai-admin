"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import {
  useCreateInvoicesMutation,
  useGetAllInvoicesItemsQuery,
} from "@/features/Financial/feesApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";

// Define a Zod schema that matches your API's expected data structure
const invoiceSchema = z.object({
  paidAmount: z.string().regex(/^\d+$/, "Paid amount must be a number"),
  discountAmount: z.string().regex(/^\d+$/, "Discount amount must be a number"),
  billedToId: z
    .number()
    .int()
    .positive("Billed To ID must be a positive number"),
  invoiceItem: z.object({
    rate: z.number().nonnegative("Rate must be a non-negative number"),
    qty: z.number().nonnegative("Quantity must be a non-negative number"),
    type: z.string().nonempty("Type is required"),
    about: z.string().optional(),
  }),
});

const NewInvoice = () => {
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
    {
      nameEn: "Fees Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/fees-management",
    },
    {
      nameEn: "Add Invoices",
      nameAr: "إضافة الفواتير",
      nameFr: "Ajouter des factures",
      href: "/fees-management/new-invoice",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      paidAmount: "",
      discountAmount: "",
      billedToId: null,
      invoiceItem: {
        rate: null,
        qty: null,
        type: "",
        about: "",
      },
    },
  });

  const [createInvoice, { isLoading }] = useCreateInvoicesMutation();
  const { data: items, isLoading: isItemsLoading } =
    useGetAllInvoicesItemsQuery(null);

  const onSubmit = async (data: any) => {
    try {
      await createInvoice(data).unwrap();
      toast.success("Invoice created successfully");
    } catch (err) {
      toast.error("Failed to create invoice");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isItemsLoading)
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
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mx-3 mt-[40px] grid h-[850px] items-center justify-center`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
            <div className="flex items-center justify-start gap-2">
              <h1 className="font-sans text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Invoice Information"
                  : currentLanguage === "ar"
                    ? "معلومات الفاتورة"
                    : "Informations sur la facture"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              {/* Paid Amount Field */}
              <label
                htmlFor="paidAmount"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Paid Amount"
                  : currentLanguage === "ar"
                    ? "المبلغ المدفوع"
                    : "Montant payé"}
                <input
                  id="paidAmount"
                  {...register("paidAmount")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.paidAmount && (
                  <span className="text-error">
                    {errors.paidAmount.message}
                  </span>
                )}
              </label>

              {/* Discount Amount Field */}
              <label
                htmlFor="discountAmount"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Discount Amount"
                  : currentLanguage === "ar"
                    ? "مقدار الخصم"
                    : "Montant de la réduction"}
                <input
                  id="discountAmount"
                  {...register("discountAmount")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.discountAmount && (
                  <span className="text-error">
                    {errors.discountAmount.message}
                  </span>
                )}
              </label>

              {/* Billed To ID Field */}
              <label
                htmlFor="billedToId"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Billed To ID"
                  : currentLanguage === "ar"
                    ? "رقم الفاتورة إلى"
                    : "ID facturé à"}
                <input
                  id="billedToId"
                  {...register("billedToId", { valueAsNumber: true })}
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.billedToId && (
                  <span className="text-error">
                    {errors.billedToId.message}
                  </span>
                )}
              </label>

              {/* Item Rate Field */}
              <label
                htmlFor="rate"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Item Rate"
                  : currentLanguage === "ar"
                    ? "سعر العنصر"
                    : "Tarif de l'article"}
                <input
                  id="rate"
                  {...register("invoiceItem.rate", { valueAsNumber: true })}
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.invoiceItem?.rate && (
                  <span className="text-error">
                    {errors.invoiceItem.rate.message}
                  </span>
                )}
              </label>

              {/* Item Quantity Field */}
              <label
                htmlFor="qty"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Item Quantity"
                  : currentLanguage === "ar"
                    ? "كمية العنصر"
                    : "Quantité de l'article"}
                <input
                  id="qty"
                  {...register("invoiceItem.qty", { valueAsNumber: true })}
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.invoiceItem?.qty && (
                  <span className="text-error">
                    {errors.invoiceItem.qty.message}
                  </span>
                )}
              </label>

              {/* Item Type Field */}
              <label
                htmlFor="type"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Item Type"
                  : currentLanguage === "ar"
                    ? "نوع العنصر"
                    : "Type d'article"}
                <select
                  id="type"
                  {...register("invoiceItem.type")}
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select Item Type"
                      : currentLanguage === "ar"
                        ? "اختر نوع العنصر"
                        : "Sélectionner le type d'article"}
                  </option>
                  {items &&
                    Object.entries(items.data).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value as string}
                      </option>
                    ))}
                </select>
                {errors.invoiceItem?.type && (
                  <span className="text-error">
                    {(errors.invoiceItem?.type as any)?.message}
                  </span>
                )}
              </label>
            </div>
            <div className="flex justify-center text-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Add Invoice"
                    : currentLanguage === "ar"
                      ? "إضافة فاتورة"
                      : "Ajouter une facture"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewInvoice;
