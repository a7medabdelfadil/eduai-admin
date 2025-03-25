"use client";
/* eslint-disable @next/next/no-img-element */
import DynamicPartition from "@/components/dynamicPartition";
import Spinner from "@/components/spinner";
import WorkerInfo from "@/components/workerInfo";
import { useGetWorkerByIdQuery } from "@/features/User-Management/workerApi";
import { useEffect } from "react";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Container from "@/components/Container";
interface ViewWorkerProps {
  params: {
    workerId: string;
  };
}
const ViewWorker: React.FC<ViewWorkerProps> = ({ params }) => {
  const { data, error, isLoading } = useGetWorkerByIdQuery(params.workerId);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);



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
    <Container>
        <div className="grid grid-cols-2 gap-7 pr-7 max-[1342px]:grid-cols-1 max-[1342px]:px-5">
          <WorkerInfo data={data} />
          <div className="grid h-[400px] items-center justify-center gap-10 rounded-xl bg-bgPrimary p-5">
            <div className="grid justify-start">
              <h1 className="font-sans font-semibold text-textPrimary">
                {currentLanguage === "en"
                  ? "Available days of absence"
                  : currentLanguage === "ar"
                    ? "أيام الغياب المتاحة"
                    : "Jours d'absence disponibles"}
              </h1>
              <h1 className="font-sans text-[14px] font-semibold text-textSecondary">
                {currentLanguage === "en"
                  ? "14 days in a year"
                  : currentLanguage === "ar"
                    ? "14 يوم في السنة"
                    : "14 jours par an"}
              </h1>
            </div>
            <DynamicPartition percentage={5} />
          </div>
        </div>
        </Container>
  );
};

export default ViewWorker;
