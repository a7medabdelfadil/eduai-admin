"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";

const Features = () => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

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
        } relative mx-3 mt-10 flex h-[650px] items-center justify-center overflow-x-auto bg-transparent max-[1200px]:w-screen sm:rounded-lg`}
      >
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="h-[600px] w-[1000px] overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap px-6 py-6 text-[28px]"
                >
                  {currentLanguage === "ar"
                    ? "الميزات"
                    : currentLanguage === "fr"
                      ? "Fonctionnalités"
                      : "Features"}
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-6 py-3 text-[28px]"
                >
                  {currentLanguage === "ar"
                    ? "ينطبق على"
                    : currentLanguage === "fr"
                      ? "Applicable à"
                      : "Applicable For"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 text-[25px] font-medium text-textPrimary"
                >
                  <label className="inline-flex cursor-pointer items-center">
                    <input type="checkbox" value="" className="peer sr-only" />
                    <div className="peer relative h-7 w-14 rounded-full bg-thead after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-borderPrimary after:bg-bgPrimary after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-borderPrimary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 whitespace-nowrap text-[25px] font-medium text-textPrimary">
                      {currentLanguage === "ar"
                        ? "الحضور"
                        : currentLanguage === "fr"
                          ? "Présence"
                          : "Attendance"}
                    </span>
                  </label>

                  <p className="mt-3 text-[14px] text-secondary">
                    {currentLanguage === "ar"
                      ? "قم بتمكين أو تعطيل وحدة الحضور على مستوى عالمي أو للمستخدمين الفرديين."
                      : currentLanguage === "fr"
                        ? "Activer ou désactiver le module de présence globalement ou pour des rôles d'utilisateur individuels."
                        : "Enable or disable Attendance Module globally or for individual user roles."}
                    <br />
                    {currentLanguage === "ar"
                      ? "لاحظ أن تعطيل وحدة الحضور للمستخدمين الفرديين سيظل"
                      : currentLanguage === "fr"
                        ? "Notez que désactiver le module de présence pour les profils individuels continuera à"
                        : "Note that disabling Attendance module for individual profile users will"}
                    <br />
                    {currentLanguage === "ar"
                      ? "لا يوقف إشعارات الغياب للطلاب أو الآباء."
                      : currentLanguage === "fr"
                        ? "ne stoppe pas les notifications d'absence aux étudiants ou aux parents."
                        : "not stop absent notifications to students or parents."}
                  </p>
                </th>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "المسؤول"
                        : currentLanguage === "fr"
                          ? "Administrateurs"
                          : "Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />

                      {currentLanguage === "ar"
                        ? "المعلمين"
                        : currentLanguage === "fr"
                          ? "Enseignants"
                          : "Teachers"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الطلاب"
                        : currentLanguage === "fr"
                          ? "Étudiants"
                          : "Students"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الآباء"
                        : currentLanguage === "fr"
                          ? "Parents"
                          : "Parents"}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 text-[25px] font-medium text-textPrimary"
                >
                  <label className="inline-flex cursor-pointer items-center">
                    <input type="checkbox" value="" className="peer sr-only" />
                    <div className="peer relative h-7 w-14 rounded-full bg-thead after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-borderPrimary after:bg-bgPrimary after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-borderPrimary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 whitespace-nowrap text-[25px] font-medium text-textPrimary">
                      {currentLanguage === "ar"
                        ? "التقييمات والدرجات"
                        : currentLanguage === "fr"
                          ? "Évaluations et Notations"
                          : "Assessment & Gradings"}
                    </span>
                  </label>

                  <p className="mt-3 text-[14px] text-secondary">
                    {currentLanguage === "ar"
                      ? "قم بتمكين أو تعطيل التقييمات والدرجات على مستوى عالمي أو للمستخدمين الفرديين."
                      : currentLanguage === "fr"
                        ? "Activer ou désactiver les évaluations et notations globalement ou pour des utilisateurs individuels."
                        : "Enable or disable Assessment & Grading globally or for individual user roles."}

                    <br />
                    {currentLanguage === "ar"
                      ? "الأدوار. لاحظ أن تعطيل وحدة التقييمات والدرجات للمستخدمين الفرديين"
                      : currentLanguage === "fr"
                        ? "rôles. Notez que désactiver le module d'évaluations et de notations pour les utilisateurs individuels"
                        : "roles. Note that disabling Assessment & Grading module for individual"}

                    <br />
                    {currentLanguage === "ar"
                      ? "ملفات تعريف المستخدمين لن يوقف إشعارات الغياب للطلاب أو الآباء."
                      : currentLanguage === "fr"
                        ? "profils ne stoppe pas les notifications d'absence aux étudiants ou aux parents."
                        : "profile users will not stop absent notifications to students or parents."}
                  </p>
                </th>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "المسؤول"
                        : currentLanguage === "fr"
                          ? "Administrateurs"
                          : "Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />

                      {currentLanguage === "ar"
                        ? "المعلمين"
                        : currentLanguage === "fr"
                          ? "Enseignants"
                          : "Teachers"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الطلاب"
                        : currentLanguage === "fr"
                          ? "Étudiants"
                          : "Students"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الآباء"
                        : currentLanguage === "fr"
                          ? "Parents"
                          : "Parents"}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 text-[25px] font-medium text-textPrimary"
                >
                  <label className="inline-flex cursor-pointer items-center">
                    <input type="checkbox" value="" className="peer sr-only" />
                    <div className="peer relative h-7 w-14 rounded-full bg-thead after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-borderPrimary after:bg-bgPrimary after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-borderPrimary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 whitespace-nowrap text-[25px] font-medium text-textPrimary">
                      {currentLanguage === "ar"
                        ? "الأحداث"
                        : currentLanguage === "fr"
                          ? "Événements"
                          : "Events"}
                    </span>
                  </label>
                  <p className="mt-3 text-[14px] text-secondary">
                    {currentLanguage === "ar"
                      ? "قم بتمكين أو تعطيل وحدة الأحداث على مستوى عالمي أو للمستخدمين الفرديين."
                      : currentLanguage === "fr"
                        ? "Activer ou désactiver le module d'événements globalement ou pour des rôles d'utilisateur individuels."
                        : "Enable or disable Events Module globally or for individual user roles."}
                  </p>
                </th>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "المسؤول"
                        : currentLanguage === "fr"
                          ? "Administrateurs"
                          : "Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />

                      {currentLanguage === "ar"
                        ? "المعلمين"
                        : currentLanguage === "fr"
                          ? "Enseignants"
                          : "Teachers"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الطلاب"
                        : currentLanguage === "fr"
                          ? "Étudiants"
                          : "Students"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الآباء"
                        : currentLanguage === "fr"
                          ? "Parents"
                          : "Parents"}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 text-[25px] font-medium text-textPrimary"
                >
                  <label className="inline-flex cursor-pointer items-center">
                    <input type="checkbox" value="" className="peer sr-only" />
                    <div className="peer relative h-7 w-14 rounded-full bg-thead after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-borderPrimary after:bg-bgPrimary after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-borderPrimary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 whitespace-nowrap text-[25px] font-medium text-textPrimary">
                      {currentLanguage === "ar"
                        ? "الرسوم والفواتير"
                        : currentLanguage === "fr"
                          ? "Frais et Facturation"
                          : "Fees & Invoicing"}
                    </span>
                  </label>
                  <p className="mt-3 text-[14px] text-secondary">
                    {currentLanguage === "ar"
                      ? "قم بتمكين أو تعطيل وحدة الرسوم والفواتير على مستوى عالمي أو للمستخدمين الفرديين."
                      : currentLanguage === "fr"
                        ? "Activer ou désactiver le module de frais et de facturation globalement ou pour des utilisateurs individuels."
                        : "Enable or disable Fee & Invoicing Module globally or for individual user roles."}

                    <br />
                    {currentLanguage === "ar"
                      ? "الأدوار. لاحظ أن أي إشعارات فواتير يتم إرسالها إلى المستخدمين المعطلين"
                      : currentLanguage === "fr"
                        ? "rôles. Notez que toute notification de facture envoyée aux utilisateurs désactivés"
                        : "user roles. Note that any invoice notifications sent to disabled user profiles"}

                    <br />
                    {currentLanguage === "ar"
                      ? "لن تتوقف عن إرسال رسائل البريد الإلكتروني أو الرسائل القصيرة أو إشعارات التطبيقات المحمولة."
                      : currentLanguage === "fr"
                        ? "ne stoppent pas l'envoi d'e-mails, de SMS ou de notifications push sur mobile."
                        : "profiles don’t stop sending emails, SMS, or mobile app push notifications."}
                  </p>
                </th>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "المسؤول"
                        : currentLanguage === "fr"
                          ? "Administrateurs"
                          : "Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الطلاب"
                        : currentLanguage === "fr"
                          ? "Étudiants"
                          : "Students"}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      {currentLanguage === "ar"
                        ? "الآباء"
                        : currentLanguage === "fr"
                          ? "Parents"
                          : "Parents"}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Features;
