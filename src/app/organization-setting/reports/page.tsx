"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import {
  useGetAllReportsQuery,
  useDeleteReportsMutation,
} from "@/features/Organization-Setteings/reportApi";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

const Report = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Reports",
      nameAr: "التقارير",
      nameFr: "Rapports",
      href: "/organization-setting/reports",
    },
  ];
  const { data, error, isLoading, refetch } = useGetAllReportsQuery("REPORT");
  console.log("🚀 ~ Report ~ data:", data);
  type Notifi = Record<string, any>;

  const [deleteReport] = useDeleteReportsMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id).unwrap();
      toast.success(`report deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to delete the report");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

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
              ? "Reports"
              : currentLanguage === "ar"
                ? "Rapports"
                : currentLanguage === "fr"
                  ? "Rapports"
                  : "Reports"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="mx-2 -ml-1 -mt-2 mb-8 flex items-center gap-4 text-xl font-semibold">
          <Link
            href="/organization-setting/reports"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "التقارير"
              : currentLanguage === "fr"
                ? "Rapports"
                : "Reports"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/organization-setting/suggestions"
          >
            {currentLanguage === "ar"
              ? "الاقتراحات"
              : currentLanguage === "fr"
                ? "Suggestions"
                : "Suggestions"}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <tbody>
              {data?.data.content.map((report: Notifi) => (
                <tr
                  key={report.id}
                  className="text-nowrap border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                >
                  <th
                    scope="row"
                    className="flex h-full items-center whitespace-nowrap px-6 py-4 text-[25px] font-medium text-gray-900"
                  >
                    <div className="flex items-center gap-2 text-[15px] text-black">
                      {report.userPicture == null ? (
                        <img
                          src="/images/userr.png"
                          className="mx-2 h-[40px] w-[40px] rounded-full"
                          alt="#"
                        />
                      ) : (
                        <img
                          src={report.userPicture}
                          className="mx-2 h-[40px] w-[40px] rounded-full"
                          alt="#"
                        />
                      )}
                      <span className="grid">
                        <p className="text-textPrimary">
                          {report.userFullName}
                        </p>
                        <p className="text-textSecondary">
                          ID:{" "}
                          <span className="text-textPrimary">{report.id}</span>
                        </p>
                      </span>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex w-[300px]">
                      <img src={report.viewAttachment} alt="#" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-3">
                      {report.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleDelete(report.id)}>
                        <svg
                          className="h-6 w-6 text-error"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(data?.data.content.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "ar"
                ? "لا توجد بيانات"
                : currentLanguage === "fr"
                  ? "Il n'y a pas de données"
                  : "There is No Data"}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Report;
