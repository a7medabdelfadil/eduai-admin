/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import {
  useDeleteEmployeesMutation,
  useGetEmployeeByIdQuery,
} from "@/features/User-Management/employeeApi";
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
import EmployeeInfo from "@/components/employeeInfo";
import Sheet from "@/components/sheet";
import BreadCrumbs from "@/components/BreadCrumbs";

const EmployeeAttendance = () => {
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
      nameEn: "Employee Attendances",
      nameAr: "حضور الموظفين",
      nameFr: "Présences des Employés",
      href: "/employee-attendance",
    },
  ];

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Employee = Record<string, any>;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, refetch } = useGetAllEmpolyeesAttendQuery({
    employeeType: "EMPLOYEE",
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
  const [selectAll, setSelectAll] = useState(false);

  const onPageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const onElementChange = (ele: SetStateAction<number>) => {
    setRowsPerPage(ele);
    setCurrentPage(0);
  };

  const [deleteEmployees] = useDeleteEmployeesMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployees({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Employee with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to lock the Employee");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll;
    });
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)',
      );
      const allChecked = Array.from(allCheckboxes).every(
        checkbox => checkbox.checked,
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search",
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    otherCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

  const [selectedId, setSelectedId] = useState(null);
  const { data: EmployeeQ, isLoading: isEmployee } = useGetEmployeeByIdQuery(
    selectedId,
    {
      skip: !selectedId,
    },
  );
  const handleClick = (id: SetStateAction<null>) => {
    setSelectedId(id);
  };

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
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
          } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {data?.data.content
            .filter((employee: Employee) => {
              return search.toLocaleLowerCase() === ""
                ? employee
                : employee.userFullName.toLocaleLowerCase().includes(search);
            })
            .map((employee: Employee, index: number) => (
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
                        ? "الموظف"
                        : currentLanguage === "fr"
                          ? "Employé"
                          : "Employee"}
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
      </div>
      <Sheet isOpen={isSheetOpen} onClose={handleClose}>
        {EmployeeQ && (
          <>
            <h2 className="mb-4 text-2xl font-semibold">Sheet Content</h2>
            {isEmployee ? <Spinner /> : <EmployeeInfo data={EmployeeQ} />}
          </>
        )}
      </Sheet>
    </>
  );
};

export default EmployeeAttendance;
