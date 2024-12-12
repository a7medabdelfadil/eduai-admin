"use client";
/* eslint-disable @next/next/no-img-element */
import DriverInfo from "@/components/driverInfo";
import Spinner from "@/components/spinner";
import { useGetDriverByIdQuery } from "@/features/User-Management/driverApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";

interface ViewDriverProps {
  params: {
    driverId: string;
  };
}

const ViewDriver: React.FC<ViewDriverProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
    {
      nameEn: "Driver",
      nameAr: "السائق",
      nameFr: "Conducteurs",
      href: "/driver",
    },
    {
      nameEn: "View Driver",
      nameAr: "عرض السائق",
      nameFr: "Voir le conducteur",
      href: `/driver/view-driver/${params.driverId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const { data, error, isLoading } = useGetDriverByIdQuery(params.driverId);
  useEffect(() => {
    if (data) {
      console.log(data);
    }
    if (error) {
      console.error("Error:", error);
    }
  }, [data, error]);

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
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
        } mt-[40px] grid py-4`}
      >
        <div className="grid grid-cols-2 gap-7 pr-7 max-[1342px]:grid-cols-1 max-[1342px]:px-5">
          <DriverInfo data={data} />
          <div className="grid h-[400px] items-center justify-center gap-10 rounded-xl bg-bgPrimary p-5">
            <div className="flex justify-between">
              <h1 className="font-sans font-semibold text-textPrimary">
                {currentLanguage === "ar"
                  ? "عدد الطلاب في الحافلة"
                  : currentLanguage === "fr"
                    ? "Nombre d'élèves dans le bus"
                    : "Number of students in Bus"}
              </h1>
              <img src="/images/bus 1.png" alt="#" />
            </div>
            <div className="grid w-[500px] rounded-xl bg-bgPrimary p-5 max-[1342px]:w-full">
              <div className="relative overflow-auto shadow-md sm:rounded-lg">
                <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
                  <thead className="bg-thead text-xs uppercase text-textPrimary">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "الاسم الكامل"
                          : currentLanguage === "fr"
                            ? "Nom complet"
                            : "Full Name"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "الرقم التعريفي"
                          : currentLanguage === "fr"
                            ? "ID"
                            : "ID"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "العنوان"
                          : currentLanguage === "fr"
                            ? "Adresse"
                            : "Address"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "الحالة"
                          : currentLanguage === "fr"
                            ? "Statut"
                            : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                      >
                        Nahda
                      </th>
                      <td className="whitespace-nowrap px-6 py-4">C45121</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        This is text
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">kdsk</td>
                    </tr>
                    <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                      >
                        Nahda
                      </th>
                      <td className="whitespace-nowrap px-6 py-4">C45121</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        This is text
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">sdsdd</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDriver;
