/* eslint-disable @next/next/no-img-element */
"use client";
import DynamicPartition from "@/components/dynamicPartition";
import { useGetEmployeeByIdQuery } from "@/features/User-Management/employeeApi";
import EmployeeInfo from "@/components/employeeInfo";
import { useEffect } from "react";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Container from "@/components/Container";
interface ViewEmployeeProps {
  params: {
    employeeId: string;
  };
}

const ViewEmployee: React.FC<ViewEmployeeProps> = ({ params }) => {
  const { data, error, isLoading } = useGetEmployeeByIdQuery(params.employeeId);

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
      <Container>
        <div className="grid grid-cols-2 gap-7 pr-7 max-[1342px]:grid-cols-1 max-[1342px]:px-5">
          <EmployeeInfo data={data} />
          <div className="grid h-[400px] items-center justify-center gap-10 rounded-xl bg-bgPrimary p-5">
            <div className="grid justify-start">
              <h1 className="font-semibold text-textPrimary">
                {currentLanguage === "en"
                  ? "Available days of absence"
                  : currentLanguage === "ar"
                    ? "أيام الغياب المتاحة"
                    : "Jours d'absence disponibles"}
              </h1>
              <h1 className="text-[14px] font-semibold text-textSecondary">
                {currentLanguage === "en"
                  ? "14 days in year"
                  : currentLanguage === "ar"
                    ? "14 يومًا في السنة"
                    : "14 jours par an"}
              </h1>
            </div>
            <DynamicPartition percentage={5} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default ViewEmployee;
