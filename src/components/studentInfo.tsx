/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const StudentInfo = ({ data }: { data: any }) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <div className="grid rounded-xl bg-bgPrimary p-5 w-full">
        <div className="flex justify-between">
          <h1 className="font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "معلومات الطالب"
              : currentLanguage === "fr"
                ? "Informations sur l'élève"
                : "Student Information"}
          </h1>
          <Link href={`/user-management/student/edit-student/${data?.data?.id}`}>
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

       <div className="flex justify-between  flex-row-reverse items-start p-5">
         <div className="grid items-center justify-center text-center">
          {data?.data?.picture == null ? (
            <img
              src="/images/userr.png"
              className="mx-2 h-[150px] w-[150px] rounded-full"
              alt="#"
            />
          ) : (
            <img
              src={data?.data?.picture}
              className="mx-2 h-[150px] w-[150px] rounded-full"
              alt="#"
            />
          )}
          <h1 className="font-semibold text-textPrimary text-2xl mt-1">{data?.data?.name}</h1>
          <p className="font-semibold text-textPrimary">
            {" "}
            <span className="font-semibold text-textSecondary">
              {currentLanguage === "ar"
                ? "الرقم التعريفي للطالب:"
                : currentLanguage === "fr"
                  ? "ID de l'élève :"
                  : "Student ID:"}{" "}
            </span>
            {data?.data?.id}
          </p>
        </div>
        <div>

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
                  ? "الدور:"
                  : currentLanguage === "fr"
                    ? "Rôle :"
                    : "Role:"}
              </h3>
              <p className="font-semibold text-textPrimary">{data?.data?.role}</p>
              <h3 className="font-semibold text-textSecondary">
                {currentLanguage === "ar"
                  ? "تاريخ الميلاد:"
                  : currentLanguage === "fr"
                    ? "Date de naissance :"
                    : "Date Of Birth:"}
              </h3>
              <p className="font-semibold text-textPrimary">
                {data?.data?.birthday}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1">
            <p className="text-[20px] font-semibold text-textPrimary">
              {currentLanguage === "ar"
                ? "حول الطالب:"
                : currentLanguage === "fr"
                  ? "À propos de l'élève :"
                  : "About the student:"}
            </p>
            <p className="mb-5 text-[16px] font-semibold text-textSecondary">
              {data?.data?.about}
            </p>
            <p className="text-[20px] font-semibold text-textPrimary">
              {currentLanguage === "ar"
                ? "الشهادة"
                : currentLanguage === "fr"
                  ? "Certification"
                  : "Certification"}
            </p>
            <p className="text-[16px] font-semibold text-textSecondary">
              2021-2022 <br />{" "}
              {currentLanguage === "ar"
                ? "حصل على المركز الأول في المدرسة"
                : currentLanguage === "fr"
                  ? "Il a obtenu la première place à l'école"
                  : "He got first place in the school"}
            </p>
          </div>
        </div>
       </div>
      </div>
    </>
  );
};

export default StudentInfo;
