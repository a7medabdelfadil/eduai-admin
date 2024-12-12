"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetClassByIdQuery } from "@/features/Infrastructure/classApi";
import { RootState } from "@/GlobalRedux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ViewDriverProps {
  params: {
    classId: string;
  };
}

const classDetails: React.FC<ViewDriverProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Classes",
      nameAr: "الفصل",
      nameFr: "Classe",
      href: "/classes",
    },
    {
      nameEn: `Class details`,
      nameAr: `تفاصيل الفصل`,
      nameFr: `Détails de la classe`,
      href: `/class-details/${params.classId}`,
    },
  ];

  const tableHeaders: { [key: string]: { en: string; ar: string; fr: string } } = {
    buildingNumber: {
      en: "Building Number",
      ar: "رقم المبنى",
      fr: "Numéro de bâtiment",
    },
    roomNumber: {
      en: "Room Number",
      ar: "رقم الغرفة",
      fr: "Numéro de chambre",
    },
    floorNumber: {
      en: "Floor Number",
      ar: "رقم الطابق",
      fr: "Numéro d'étage",
    },
    type: {
      en: "Type",
      ar: "النوع",
      fr: "Type",
    },
    status: {
      en: "Status",
      ar: "الحالة",
      fr: "Statut",
    },
    category: {
      en: "Category",
      ar: "الفئة",
      fr: "Catégorie",
    },
    maxCapacity: {
      en: "Max Capacity",
      ar: "الطاقة القصوى",
      fr: "Capacité maximale",
    },
    classroomName: {
      en: "Classroom Name",
      ar: "اسم الفصل",
      fr: "Nom de la classe",
    },
    classroomNumber: {
      en: "Classroom Number",
      ar: "رقم الفصل",
      fr: "Numéro de classe",
    },
    studyLevel: {
      en: "Study Level",
      ar: "مستوى الدراسة",
      fr: "Niveau d'étude",
    },
    studyStage: {
      en: "Study Stage",
      ar: "مرحلة الدراسة",
      fr: "Étape d'étude",
    },
  };

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !selectAll;
    });
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)'
      );
      const allChecked = Array.from(allCheckboxes).every(
        (checkbox) => checkbox.checked
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search"
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)'
    );
    otherCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach((checkbox) => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

  const { data, isLoading } = useGetClassByIdQuery(params.classId);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
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
        } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="flex justify-center"></div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                {Object.keys(tableHeaders).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="whitespace-nowrap px-6 py-3"
                  >
                    {tableHeaders[key][currentLanguage as keyof typeof tableHeaders[typeof key]]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.buildingNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.roomNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.floorNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.type}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.status}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.category}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.maxCapacity}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.classroomName}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.classroomNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.studyLevel}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {data.data.studyStage}
                </td>
              </tr>
            </tbody>
          </table>
          {(data?.length === 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "There is No Data"
                : currentLanguage === "ar"
                ? "لا توجد بيانات"
                : currentLanguage === "fr"
                ? "Il n'y a pas de données"
                : "There is No Data"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default classDetails;
