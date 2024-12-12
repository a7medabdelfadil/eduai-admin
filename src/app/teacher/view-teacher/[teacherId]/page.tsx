"use client";
import Calendar from "@/components/calendar";
import Spinner from "@/components/spinner";
import TeacherInfo from "@/components/teacherInfo";
import { useGetTeacherByIdQuery, useGetTeacherClassQuery } from "@/features/User-Management/teacherApi";
import { useEffect } from "react";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
interface ViewTeacherProps {
  params: {
    teacherId: string;
  };
}
const ViewTeacher: React.FC<ViewTeacherProps> = ({ params }) => {
  const { data, error, isLoading } = useGetTeacherByIdQuery(params.teacherId);
  const { data: Classes, isLoading: isClasses } = useGetTeacherClassQuery(params.teacherId);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

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

  if (loading || isLoading)
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
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
        } grid py-4`}
      >
        <div className="grid grid-cols-2 gap-7 pr-7 max-[1342px]:grid-cols-1 max-[1342px]:px-5">
          <TeacherInfo data={data} />
          <div className="grid h-[700px] items-center justify-center gap-10 rounded-xl bg-bgPrimary p-5">
            <div className="flex justify-start">
              <h1 className="font-sans font-semibold text-textPrimary">
                {currentLanguage === "en"
                  ? "Today Schedule"
                  : currentLanguage === "ar"
                    ? "جدول اليوم"
                    : currentLanguage === "fr"
                      ? "Programme du jour"
                      : "Today Schedule"}
              </h1>
            </div>
            <Calendar />
          </div>
          <div className="grid w-[500px] rounded-xl bg-bgPrimary p-5 max-[1342px]:w-full">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
                <thead className="bg-thead text-xs uppercase text-textPrimary">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                    courseName
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                    classroomName
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                    startTime
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                    endTime
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                    day
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Classes.data.map((classItem: any) => (
                      <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                        >
                          {classItem.courseName}
                        </th>
                        <td className="whitespace-nowrap px-6 py-4">{classItem.classroomName}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                        {classItem.startTime}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{classItem.endTime}</td>
                        <td className="whitespace-nowrap px-6 py-4">{classItem.day}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTeacher;
