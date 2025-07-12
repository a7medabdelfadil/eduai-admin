"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetInvoiceByIdQuery } from "@/features/Financial/feesApi";
import { RootState } from "@/GlobalRedux/store";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSelector } from "react-redux";

interface ViewInvoiceProps {
  params: {
    invoiceId: string;
  };
}
const ViewInvoice: React.FC<ViewInvoiceProps> = ({ params }) => {
  const formatTransactionDate = (dateString: string): string => {
    if (!dateString) return translations[currentLanguage].noDate;
    const formatter = new Intl.DateTimeFormat("en-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
    });
    return formatter.format(new Date(dateString));
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      administration: "Administration",
      feesManagement: "Fees Management",
      export: "Export",
      billedTo: "Billed To",
      id: "ID",
      email: "Email",
      phone: "Phone",
      invoiceDate: "Invoice Date",
      dueDate: "Due Date",
      status: "Status",
      totalAmount: "Total Amount",
      lineItem: "Line Item",
      rate: "Rate",
      qty: "Qty",
      type: "Type",
      paidAmount: "Paid Amount",
      discountAmount: "Discount Amount",
      taxAmount: "Tax Amount",
      dueAmount: "Due Amount",
      noDate: "No Date",
    },
    ar: {
      administration: "الإدارة",
      feesManagement: "إدارة المستندات",
      export: "تصدير",
      billedTo: "إلى الفاتورة",
      id: "المعرف",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      invoiceDate: "تاريخ الفاتورة",
      dueDate: "تاريخ الاستحقاق",
      status: "الحالة",
      totalAmount: "المبلغ الإجمالي",
      lineItem: "بند السطر",
      rate: "المعدل",
      qty: "الكمية",
      type: "النوع",
      paidAmount: "المبلغ المدفوع",
      discountAmount: "مبلغ الخصم",
      taxAmount: "قيمة الضريبة",
      dueAmount: "المبلغ المستحق",
      noDate: "لا يوجد تاريخ",
    },
    fr: {
      administration: "Administration",
      feesManagement: "Gestion des documents",
      export: "Exporter",
      billedTo: "Facturé à",
      id: "ID",
      email: "Email",
      phone: "Téléphone",
      invoiceDate: "Date de la facture",
      dueDate: "Date d'échéance",
      status: "Statut",
      totalAmount: "Montant total",
      lineItem: "Ligne d'article",
      rate: "Taux",
      qty: "Quantité",
      type: "Type",
      paidAmount: "Montant payé",
      discountAmount: "Montant de la remise",
      taxAmount: "Montant de la taxe",
      dueAmount: "Montant dû",
      noDate: "Pas de date",
    },
  };

  const { theme } = useTheme();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, isLoading: isItemsLoading } = useGetInvoiceByIdQuery(
    params.invoiceId,
  );

  if (loading || isItemsLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  const breadcrumbs = [
    {
      name: translations[currentLanguage].administration,
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      name: translations[currentLanguage].feesManagement,
      nameEn: "Fees Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/financial-management/fees-management",
    },
    {
      name: params.invoiceId,
      nameEn: params.invoiceId,
      nameAr: params.invoiceId,
      nameFr: params.invoiceId,
      href: `/financial-management/fees-management/${params.invoiceId}`,
    },
  ];

  const handleDownload = () => {
    const invoiceData = `
      ${translations[currentLanguage].administration}
      ${translations[currentLanguage].feesManagement}
      ${translations[currentLanguage].billedTo}: ${data.data.billedToBasicInfo?.name}
      ${translations[currentLanguage].id}: ${data.data.billedToBasicInfo?.id}
      ${translations[currentLanguage].email}: ${data.data.billedToBasicInfo?.email}
      ${translations[currentLanguage].phone}: ${data.data.billedToBasicInfo.phone == null ? "_" : data.data.billedToBasicInfo.phone}
      ${translations[currentLanguage].invoiceDate}: ${formatTransactionDate(data.data.creationDate)}
      ${translations[currentLanguage].dueDate}: ${formatTransactionDate(data.data.dueDate)}
      ${translations[currentLanguage].status}: ${data.data.paymentStatus
        .toLowerCase()
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
      ${translations[currentLanguage].totalAmount}: ${data.data.totalAmount}
      ${translations[currentLanguage].paidAmount}: ${data.data.paidAmount}
      ${translations[currentLanguage].discountAmount}: ${data.data.discountAmount}
      ${translations[currentLanguage].taxAmount}: ${data.data.taxAmount}
      ${translations[currentLanguage].dueAmount}: ${data.data.dueAmount}
    `;

    const blob = new Blob([invoiceData], { type: "application/docx" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${params.invoiceId}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
          } mt-4 rounded-xl bg-bgPrimary px-8 py-4`}
      >
        <div className="flex w-full justify-between">
          <Image
            src="/images/logo.png"
            width={150}
            height={150}
            alt="logo"
          ></Image>
          <button
            className="flex items-center gap-1 rounded-lg border border-borderPrimary px-2 py-1 text-primary"
            onClick={handleDownload}
          >
            <svg
              className="h-6 w-6 text-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <line x1="12" y1="5" x2="12" y2="19" />{" "}
              <line x1="16" y1="15" x2="12" y2="19" />{" "}
              <line x1="8" y1="15" x2="12" y2="19" />
            </svg>
            {translations[currentLanguage].export}
          </button>
        </div>
        <div className="mt-10 flex justify-between max-[1235px]:grid">
          <div className="grid gap-2">
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].billedTo}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.billedToBasicInfo?.name}
              </p>
            </h1>
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].id}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.billedToBasicInfo?.id}
              </p>
            </h1>
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].email}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.billedToBasicInfo?.email}
              </p>
            </h1>
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].phone}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.billedToBasicInfo?.phone == null
                  ? "_"
                  : data?.data?.billedToBasicInfo?.phone}
              </p>
            </h1>
          </div>
          <div className="grid gap-2">
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].invoiceDate}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {formatTransactionDate(data?.data?.creationDate)}
              </p>
            </h1>
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].dueDate}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {formatTransactionDate(data?.data?.dueDate)}
              </p>
            </h1>
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].status}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.paymentStatus
                  .toLowerCase()
                  .split("_")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(" ")}
              </p>
            </h1>
          </div>
          <div className="grid gap-2">
            <h1 className="flex items-center gap-1 text-[20px] font-semibold text-secondary">
              {translations[currentLanguage].totalAmount}:{" "}
              <p
                className={`text-[17px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.totalAmount}
              </p>
            </h1>
          </div>
        </div>
        <div className="mt-10 grid gap-2">
          <h1 className="text-[25px] font-semibold text-secondary">
            {translations[currentLanguage].lineItem}
          </h1>
          <div className="relative overflow-auto sm:rounded-lg">
            <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
              <thead className="bg-thead text-xs uppercase text-textPrimary">
                <tr>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    {translations[currentLanguage].lineItem}
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    {translations[currentLanguage].rate}
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    {translations[currentLanguage].qty}
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    {translations[currentLanguage].type}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                  >
                    {data?.data?.invoiceItem.id}
                  </th>
                  <td className="whitespace-nowrap px-6 py-4">
                    {data?.data?.invoiceItem.rate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {data?.data?.invoiceItem.qty}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {data?.data?.invoiceItem.type}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div className="mt-14 grid rounded-xl border border-borderPrimary p-3">
            <p className="flex items-center justify-between gap-4 border-b border-borderPrimary text-[18px] font-semibold text-secondary">
              {translations[currentLanguage].paidAmount}:{" "}
              <p
                className={`text-end text-[18px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.paidAmount}
              </p>
            </p>
            <p className="flex items-center justify-between gap-4 border-b border-borderPrimary text-[18px] font-semibold text-secondary">
              {translations[currentLanguage].discountAmount}:{" "}
              <p
                className={`text-[18px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.discountAmount}
              </p>
            </p>
            <p className="flex items-center justify-between gap-4 border-b border-borderPrimary text-[18px] font-semibold text-secondary">
              {translations[currentLanguage].taxAmount}:{" "}
              <p
                className={`text-[18px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.taxAmount}
              </p>
            </p>
            <p className="flex items-center justify-between gap-4 text-[18px] font-semibold text-secondary">
              {translations[currentLanguage].dueAmount}:{" "}
              <p
                className={`text-[18px] ${theme == "dark" ? "text-white" : "text-black"
                  }`}
              >
                {data?.data?.dueAmount}
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
