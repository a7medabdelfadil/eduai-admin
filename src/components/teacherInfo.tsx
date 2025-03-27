/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const TeacherInfo = ({ data }: { data: any }) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <div className="grid rounded-xl bg-bgPrimary p-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "معلومات المعلم"
              : currentLanguage === "fr"
                ? "Informations sur l'enseignant"
                : "Teacher Information"}
          </h1>
          <Link href={`/edit-teacher/${data?.data?.id}`}>
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
          {data?.data?.picture == null ? (
            <img
              src="/images/userr.png"
              className="mx-2 h-[120px] w-[120px] rounded-full"
              alt="#"
            />
          ) : (
            <img
              src={data?.data?.picture}
              className="mx-2 h-[120px] w-[120px] rounded-full"
              alt="#"
            />
          )}
          <h1 className="font-semibold text-textPrimary">{data?.data?.name}</h1>
          <p className="font-semibold text-textPrimary">
            {" "}
            <span className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "رقم المعلم:"
                : currentLanguage === "fr"
                  ? "ID de l'enseignant :"
                  : "Teacher ID:"}
            </span>
            {data?.data?.id}
          </p>
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
            <p className="font-semibold text-textPrimary">
              {data?.data?.email}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الراتب:"
                : currentLanguage === "fr"
                  ? "Salaire :"
                  : "Salary:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.salary == null
                ? `Not specified`
                : data?.data?.salary}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "تاريخ الميلاد:"
                : currentLanguage === "fr"
                  ? "Date de naissance :"
                  : "Date Of Birth:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.birthDate}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الجنس:"
                : currentLanguage === "fr"
                  ? "Sexe :"
                  : "Gender:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.gender}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الجنسية:"
                : currentLanguage === "fr"
                  ? "Nationalité :"
                  : "Nationality:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.nationality}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الجنس:"
                : currentLanguage === "fr"
                  ? "Sexe :"
                  : "Gender:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.gender}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "المؤهل:"
                : currentLanguage === "fr"
                  ? "Qualification :"
                  : "Qualification:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.qualification}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "العنوان:"
                : currentLanguage === "fr"
                  ? "Adresse :"
                  : "Address:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.address}
            </p>
            <h3 className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الهاتف المحمول:"
                : currentLanguage === "fr"
                  ? "Mobile :"
                  : "Mobile:"}
            </h3>
            <p className="font-semibold text-textPrimary">
              {data?.data?.number}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1">
          <p className="text-[20px] font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "حول المعلم:"
              : currentLanguage === "fr"
                ? "À propos de l'enseignant :"
                : "About the Teacher:"}
          </p>
          <p className="mb-5 text-[16px] font-semibold text-textSecondary">
            {data?.data?.about}
          </p>
          <p className="mb-5 text-[16px] font-semibold text-textSecondary">
            {data?.data?.subjects.map((sub: string) => <p key={sub}>{sub}</p>)}
          </p>
        </div>
      </div>
    </>
  );
};

export default TeacherInfo;
