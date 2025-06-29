"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineSave } from "react-icons/ai"; // Save Icon
import { useState } from "react"; // Added import for useState
import BreadCrumbs from "@/components/BreadCrumbs";
import { useCreateTaxesMutation } from "@/features/Financial/taxesApi";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const AddTaxes = () => {
  // Added state for file preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
      nameEn: "Add Taxes",
      nameAr: "إضافة ضريبة",
      nameFr: "Ajouter une taxe",
      href: "/financial-management/taxes/add-taxes",
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
  } = useForm();

  const [createTax, { isLoading }] = useCreateTaxesMutation();

  // Added file handler function
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create file preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setFilePreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files (like PDF)
        setFilePreview(null);
      }
    }
  };

  const onSubmit = async (data: any) => {
    // Create FormData object
    const formData = new FormData();

    // Append JSON stringified tax data
    const taxData = {
      taxType: data.taxType,
      paymentMethod: data.paymentMethod,
      paidAmount: data.paidAmount,
      startDate: data.startDate,
      endDate: data.endDate,
      paymentDate: data.paymentDate,
      receiptNumber: data.receiptNumber,
      about: data.about,
    };
    formData.append("request", JSON.stringify(taxData));

    // Append file data - ensure a file is always present
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      // Create an empty file if none is selected (to satisfy the server requirement)
      const emptyBlob = new Blob([""], { type: "application/octet-stream" });
      const emptyFile = new File([emptyBlob], "empty.txt", {
        type: "application/octet-stream",
      });
      formData.append("file", emptyFile);
    }

    try {
      await createTax(formData).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء سجل الضريبة بنجاح"
          : currentLanguage === "fr"
            ? "Enregistrement de la taxe créé avec succès"
            : "Tax record created successfully",
      );
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add Taxes"
              : currentLanguage === "ar"
                ? "إضافة ضريبة"
                : currentLanguage === "fr"
                  ? "Ajouter une taxe"
                  : "Add Taxes"}{" "}
            {/* default */}
          </h1>
        </div>
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
            <div className="rounded-xl border border-borderPrimary bg-bgPrimary p-10">
              <div className="mb-10 flex w-full items-center justify-between text-[18px] font-semibold">
                <h1 className="text-[20px]">
                  {currentLanguage === "ar"
                    ? "تحميل ملف"
                    : currentLanguage === "fr"
                      ? "Télécharger un fichier"
                      : "Upload File"}
                </h1>
              </div>
              <div className="flex justify-center gap-3 font-semibold">
                <div className="flex w-full items-center justify-center">
                  {selectedFile ? (
                    <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-borderPrimary bg-bgPrimary">
                      <div className="flex flex-col items-center justify-center p-5 text-center">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="File preview"
                            className="mb-3 max-h-40 max-w-full object-contain"
                          />
                        ) : (
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-8 w-8 text-textSecondary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="mb-1 font-medium text-textPrimary">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                          className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200"
                        >
                          {currentLanguage === "ar"
                            ? "إزالة الملف"
                            : currentLanguage === "fr"
                              ? "Supprimer le fichier"
                              : "Remove File"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-borderPrimary bg-bgPrimary hover:bg-bgPrimary"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <svg
                          className="mb-4 h-8 w-8 text-textSecondary"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-textSecondary">
                          {currentLanguage === "ar"
                            ? "انقر للرفع أو اسحب وأفلت"
                            : currentLanguage === "fr"
                              ? "Cliquez pour télécharger ou glissez-déposez"
                              : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-textSecondary">
                          {currentLanguage === "ar"
                            ? "PNG، JPG أو PDF (الحد الأقصى. 10 ميغابايت)"
                            : currentLanguage === "fr"
                              ? "PNG, JPG ou PDF (MAX. 10MB)"
                              : "PNG, JPG or PDF (MAX. 10MB)"}
                        </p>
                      </div>
                      <input
                        {...register("file")}
                        id="dropzone-file"
                        type="file"
                        className="opacity-0"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddTaxes;
