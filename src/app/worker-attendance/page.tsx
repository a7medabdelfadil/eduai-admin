/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import {
  useCreateAttendanceMutation,
  useGetAllEmpolyeesAttendQuery,
  useUpdateAttendanceMutation,
} from "@/features/attendance/attendanceApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";

const WorkerAttendance = () => {
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
      nameEn: "Worker Attendances",
      nameAr: "حضور العمال",
      nameFr: "Présences des Ouvrier",
      href: "/worker-attendance",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Employee = Record<string, any>;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, refetch } = useGetAllEmpolyeesAttendQuery({
    employeeType: "WORKER",
    role: "EMPLOYEE",
    page: currentPage,
    size: rowsPerPage,
  });
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [createAttendance] = useCreateAttendanceMutation();
  const [updateAttendance] = useUpdateAttendanceMutation();

  const handleSelect = (
    label: string,
    index: number,
    userId: undefined,
    driverStatus: string | null,
    attendenceId: number,
    checkin: Date,
    checkout: Date,
  ) => {
    setSelectedStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = newStates[index] === label ? label : label; // Toggle selection
      return newStates;
    });

    const attendanceData = {
      userId: userId,
      attendenceId: attendenceId,
      status: label === "P" ? "PRESENT" : label === "A" ? "ABSENT" : "LEAVE",
      absenceReason: null,
      checkInTime: checkin,
      checkOutTime: checkout,
    };

    if (driverStatus === null) {
      // Use createAttendance if status is null
      createAttendance(attendanceData)
        .unwrap()
        .then(response => {
          refetch();
          toast.success("Attendance recorded successfully");
        })
        .catch(error => {
          toast.error("Failed to record attendance");
        });
    } else {
      // Use updateAttendance if status is not null
      updateAttendance({
        formData: attendanceData,
        id: attendanceData.attendenceId,
      })
        .unwrap()
        .then(response => {
          refetch();
          toast.info("Attendance updated successfully");
        })
        .catch(error => {
          toast.error("Failed to update attendance");
        });
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

  const filteredEmployees = data?.data.content.filter((employee: Employee) =>
    search.trim() === ""
      ? true
      : employee.userFullName?.toLowerCase()?.includes(search.toLowerCase())
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
          className="relative w-full max-w-md mb-4"
        >
          <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
            <BiSearchAlt className="text-secondary" size={18} />
          </div>
          <div className="flex items-center gap-2">
            <input
              onChange={e => setSearch(e.target.value)}
              type="text"
              className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
              placeholder={currentLanguage === "ar"
                ? "بحث"
                : currentLanguage === "fr"
                  ? "Rechercher"
                  : "Search"}
            />
            <span className="min-w-[120px] text-primary">
              {filteredEmployees?.length ?? 0} {currentLanguage === "ar"
                ? "نتيجة"
                : currentLanguage === "fr"
                  ? "résultat(s)"
                  : "Result(s)"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {filteredEmployees?.map((employee: Employee, index: number) => (
              <div
                key={index}
                className="grid h-[320px] w-[300px] items-center justify-center rounded-xl bg-bgPrimary shadow-lg"
              >
                <div className="grid items-center justify-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  <div className="grid w-[120px] items-center justify-center text-center">
                    <div className="flex justify-center">
                      {employee.picture == null ? (
                        <img
                          src="/images/userr.png"
                          className="h-[100px] w-[100px] rounded-full"
                          alt="#"
                        />
                      ) : (
                        <img
                          src={employee.picture}
                          className="h-[100px] w-[100px] rounded-full"
                          alt="#"
                        />
                      )}
                    </div>
                    <p className="mt-4 text-[22px] text-textPrimary">
                      {" "}
                      {employee.userFullName}{" "}
                    </p>
                    <p className="whitespace-nowrap font-semibold text-secondary">
                      {currentLanguage === "ar"
                        ? "العامل"
                        : currentLanguage === "fr"
                          ? "Ouvrier"
                          : "Worker"}
                      : {employee.userId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-center">
                  {["P", "A", "L"].map(label => (
                    <label
                      key={label}
                      className={`flex h-[55px] w-[55px] cursor-pointer items-center justify-center rounded-full border border-borderPrimary p-5 text-center text-[24px] font-semibold ${selectedStates[index] === label ||
                        (label === "P" && employee.status === "PRESENT") ||
                        (label === "L" && employee.status === "LEAVE") ||
                        (label === "A" && employee.status === "ABSENT")
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
                          handleSelect(
                            label,
                            index,
                            employee.userId,
                            employee.status,
                            employee.attendanceId,
                            employee.checkInTime,
                            employee.checkOutTime,
                          )
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

export default WorkerAttendance;
