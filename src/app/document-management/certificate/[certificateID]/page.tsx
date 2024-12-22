/* eslint-disable @next/next/no-img-element */
"use client";

import Spinner from "@/components/spinner";
import { useGetCertificateByIdQuery } from "@/features/Document-Management/certificatesApi";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
interface ViewDriverProps {
  params: {
    certificateID: string;
  };
}
const ViewCertificate: React.FC<ViewDriverProps> = ({ params }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading } = useGetCertificateByIdQuery(
    params.certificateID,
  );


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
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className={` ${
        currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
      }`}
    >
      <div className="grid h-full w-full items-center justify-center gap-4 rounded-xl bg-bgPrimary p-9 max-[505px]:p-2">
        <div className="flex w-full justify-end">
          <Link href={data.data.fileViewDownload}>
            <svg
              className="h-10 w-10 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </Link>
        </div>
        <div>
          <img src={data.data.fileViewLink} alt="#" className="w-[1000px]" />
        </div>
      </div>
    </div>
  );
};

export default ViewCertificate;
