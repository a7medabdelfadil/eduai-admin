"use client";
import Calendar from "@/components/calendar";
import Exams from "@/components/exams";
import Spinner from "@/components/spinner";
import { format } from "date-fns";
import StudentInfo from "@/components/studentInfo";
import {
  useGetStudentByIdQuery,
  useGetStudentExamsQuery,
} from "@/features/User-Management/studentApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Container from "@/components/Container";

interface ViewStudentProps {
  params: {
    studentId: string;
  };
}

const ViewStudent: React.FC<ViewStudentProps> = ({ params }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Do something with the selected date
  };
  const { data, error, isLoading } = useGetStudentByIdQuery(params.studentId);
  const { data: exams, isLoading: isExams } = useGetStudentExamsQuery({
    id: params.studentId,
    date: format(selectedDate || new Date(), "yyyy-MM-dd"),
  });

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
        <StudentInfo data={data} />
        <div className="grid gap-10">
          <Calendar
            onDateSelect={handleDateSelect}
            initialDate={new Date()} // Optional: provide initial date
          />
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
              <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
                <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
                  <thead className="bg-thead text-xs uppercase text-textPrimary">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "اسم "
                          : currentLanguage === "fr"
                            ? "Nom"
                            : "Name "}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "اسم المدرس"
                          : currentLanguage === "fr"
                            ? "Nom du professeur"
                            : "teacher Name"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "وقت البدء"
                          : currentLanguage === "fr"
                            ? "Heure de début"
                            : "start Time"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "وقت الانتهاء"
                          : currentLanguage === "fr"
                            ? "Fin des temps"
                            : "end Time"}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-6 py-3">
                        {currentLanguage === "ar"
                          ? "اليوم"
                          : currentLanguage === "fr"
                            ? "jour"
                            : "day"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams?.data.map((exam: any) => (
                      <tr
                        key={exam.id}
                        className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                        >
                          {exam.courseName}
                        </th>
                        <td className="whitespace-nowrap px-6 py-4">
                          {exam.teacherName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {exam.startTime}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {exam.endTime}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {exam.day}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </div>
      </div>
    </Container>
  );
};

export default ViewStudent;
