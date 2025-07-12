/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";

const WorkerInfo = ({ data }: { data: any }) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <div className="grid rounded-xl bg-bgPrimary p-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "معلومات العامل"
              : currentLanguage === "fr"
                ? "Informations sur le travailleur"
                : "Worker Information"}
          </h1>
          <Link href={`/user-management/worker/edit-worker/${data.data.id}`}>
            <svg
              className="h-6 w-6 text-textPrimary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
        </div>

        <div className="grid items-center justify-center text-center">
          {data.data.picture == null ? (
            <img
              src="/images/userr.png"
              className="mx-2 h-[120px] w-[120px] rounded-full"
              alt="#"
            />
          ) : (
            <img
              src={data.data.picture}
              className="mx-2 h-[120px] w-[120px] rounded-full"
              alt="#"
            />
          )}
          <h1 className="font-semibold text-textPrimary">{data.data.name}</h1>
          <p className="font-semibold text-textPrimary">{data.data.id}</p>
        </div>

        <div className="grid justify-start">
          <h1 className="text-[22px] font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "التفاصيل الأساسية"
              : currentLanguage === "fr"
                ? "Détails de base"
                : "Basic Details"}
          </h1>
          <div className="grid w-[400px] grid-cols-2 max-[485px]:w-[240px]">
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "البريد الإلكتروني:"
                : currentLanguage === "fr"
                  ? "Email :"
                  : "Email:"}
            </h3>
            <p className="font-semibold text-textPrimary">{data.data.email}</p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الراتب:"
                : currentLanguage === "fr"
                  ? "Salaire :"
                  : "Salary:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data.data.salary == null ? `Not specified` : data.data.salary}
            </p>
            <h3 className="font-semibold text-textSecondary">Age:</h3>
            <p className="font-semibold text-textPrimary">
              {data.data.birthDate}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الجنس:"
                : currentLanguage === "fr"
                  ? "Sexe :"
                  : "Gender:"}
            </h3>
            <p className="font-semibold text-textPrimary">{data.data.gender}</p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الوظيفة:"
                : currentLanguage === "fr"
                  ? "Position :"
                  : "Position:"}
            </h3>
            <p className="font-semibold text-textPrimary">{data.data.role}</p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الدين:"
                : currentLanguage === "fr"
                  ? "Religion :"
                  : "Religion:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data.data.religion}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "العنوان:"
                : currentLanguage === "fr"
                  ? "Adresse :"
                  : "Address:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data.data.nationality}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الهاتف المحمول:"
                : currentLanguage === "fr"
                  ? "Mobile :"
                  : "Mobile:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data.data.phoneNumber}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "حول:"
                : currentLanguage === "fr"
                  ? "À propos :"
                  : "About:"}
            </h3>
            <p className="font-semibold text-textPrimary">{data.data.about}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerInfo;
