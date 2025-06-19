/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import {
  useCreateAttendanceMutation,
  useGetAllStudentsAttendQuery,
  useUpdateStudentAttendanceMutation,
} from "@/features/attendance/attendanceApi";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";

const StudentAttendance = () => {
  const breadcrumbs = [
    {
      nameEn: "Operation",
      nameAr: "عملية",
      nameFr: "Opération",
      href: "/",
    },
    {
      nameEn: "Attendances",
      nameAr: "الحضور",
      nameFr: "Présences",
      href: "/attendances",
    },
    {
      nameEn: "Student Attendances",
      nameAr: "حضور الطلاب",
      nameFr: "Présences des Étudiants",
      href: "/student-attendance",
    },
  ];

  type Student = Record<string, any>;
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllStudentsAttendQuery({
    page: currentPage,
    size: rowsPerPage,
  });

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [createAttendance] = useUpdateStudentAttendanceMutation();

  const handleSelect = (label: string, index: number, studentId: number) => {
    setSelectedStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = newStates[index] === label ? label : label; // Toggle selection
      return newStates;
    });

    // Check if the "P" button is clicked
    if (label === "P") {
      // Prepare attendance data
      const attendanceData = {
        studentId: studentId,
        status: "PRESENT",
        absenceReason: null,
      };

      // Send the data using the mutation hook
      createAttendance({
        formData: attendanceData,
        id: attendanceData.studentId,
      })
        .unwrap()
        .then(response => {
          refetch();
          toast.info("Update Attendance");
        })
        .catch(error => {
          toast.error("Failed to Update Attendance");
        });
    }
    if (label === "A") {
      // Prepare attendance data
      const attendanceData = {
        studentId: studentId,
        status: "ABSENT",
        absenceReason: null,
      };

      // Send the data using the mutation hook
      createAttendance(attendanceData)
        .unwrap()
        .then(response => {})
        .catch(error => {});
    }
    if (label === "L") {
      // Prepare attendance data
      const attendanceData = {
        studentId: studentId,
        status: "LEAVE",
        absenceReason: null,
      };

      // Send the data using the mutation hook
      createAttendance(attendanceData)
        .unwrap()
        .then(response => {})
        .catch(error => {});
    }
  };

  const onPageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const onElementChange = (ele: SetStateAction<number>) => {
    setRowsPerPage(ele);
    setCurrentPage(0);
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const filteredStudents =
    data?.data.content?.filter((student: any) =>
      student.studentName.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        {/* Search Input */}
        <div
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          className="relative mb-4 w-full max-w-md"
        >
          <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
            <BiSearchAlt className="text-secondary" size={18} />
          </div>
          <div className="flex items-center gap-2">
            <input
              onChange={e => setSearch(e.target.value)}
              type="text"
              className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
              placeholder={
                currentLanguage === "ar"
                  ? "بحث"
                  : currentLanguage === "fr"
                    ? "Rechercher"
                    : "Search"
              }
            />
            <span className="min-w-[120px] text-primary">
              {filteredStudents?.length ?? 0}{" "}
              {currentLanguage === "ar"
                ? "نتيجة"
                : currentLanguage === "fr"
                  ? "résultat(s)"
                  : "Result(s)"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {filteredStudents.map((student: Student, index: number) => (
            <div
              key={index}
              className="grid h-[320px] w-[300px] items-center justify-center rounded-xl bg-bgPrimary shadow-lg"
            >
              <div className="grid items-center justify-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                <div className="grid w-[120px] items-center justify-center text-center">
                  <div className="flex justify-center">
                    {student.picture == null ? (
                      <img
                        src="/images/userr.png"
                        className="h-[100px] w-[100px] rounded-full"
                        alt="#"
                      />
                    ) : (
                      <img
                        src={student.picture}
                        className="h-[100px] w-[100px] rounded-full"
                        alt="#"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-[22px] text-textPrimary">
                    {" "}
                    {student.studentName}{" "}
                  </p>
                  <p className="whitespace-nowrap font-semibold text-secondary">
                    {currentLanguage === "ar"
                      ? "الطالب"
                      : currentLanguage === "fr"
                        ? "Étudiant"
                        : "Student"}
                    : {student.studentId}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-center">
                {["P", "A", "L"].map(label => (
                  <label
                    key={label}
                    className={`flex h-[55px] w-[55px] cursor-pointer items-center justify-center rounded-full border border-borderPrimary p-5 text-center text-[24px] font-semibold ${
                      selectedStates[index] === label ||
                      (label === "P" && student.status === "PRESENT") ||
                      (label === "L" && student.status === "LEAVE") ||
                      (label === "A" && student.status === "ABSENT")
                        ? label === "P"
                          ? "bg-success text-blackOrWhite"
                          : label === "A"
                            ? "bg-error text-blackOrWhite"
                            : "bg-warning text-blackOrWhite"
                        : "bg-bgSecondary"
                    } `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedStates[index] === label}
                      onChange={() =>
                        handleSelect(label, index, student.attendanceId)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {(data?.data.content.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "ar"
                ? "لا توجد بيانات"
                : currentLanguage === "fr"
                  ? "Aucune donnée"
                  : "There is No Data"}
            </div>
          )}
        </div>
        <div className="relative overflow-auto">
          <Pagination
            totalPages={data?.data.totalPagesCount}
            elementsPerPage={rowsPerPage}
            onChangeElementsPerPage={onElementChange}
            currentPage={currentPage}
            onChangePage={onPageChange}
          />
        </div>
      </Container>
    </>
  );
};

export default StudentAttendance;
