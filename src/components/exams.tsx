import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const Exams = () => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <div className="grid w-[500px] rounded-xl bg-bgPrimary p-5 max-[1342px]:w-full">
        <div className="mb-5 flex justify-between">
          <h1 className="font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "جميع نتائج الامتحانات"
              : currentLanguage === "fr"
                ? "Tous les résultats d'examen"
                : "All Exam Result"}
          </h1>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "اسم المدرسة"
                    : currentLanguage === "fr"
                      ? "Nom de l'école"
                      : "Name School"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الرمز"
                    : currentLanguage === "fr"
                      ? "Code"
                      : "Code"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الرمز"
                    : currentLanguage === "fr"
                      ? "Code"
                      : "Code"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عرض"
                    : currentLanguage === "fr"
                      ? "Voir"
                      : "View"}
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
                <td className="whitespace-nowrap px-6 py-4">This is text</td>
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
                <td className="whitespace-nowrap px-6 py-4">This is text</td>
                <td className="whitespace-nowrap px-6 py-4">sdsdd</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Exams;
