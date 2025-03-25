/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction, useRef } from "react";
import {
  useDeleteEmployeesMutation,
  useGetAllEmployeesQuery,
} from "@/features/User-Management/employeeApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { useUploadEmployeeMutation } from "@/features/events/eventsApi";
import { Trash2 } from "lucide-react";
import Modal from "@/components/model";

const Employee = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
    {
      nameEn: "Employee",
      nameAr: "موظف",
      nameFr: "Employé",
      href: "/employee",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Employee = Record<string, any>;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, refetch } = useGetAllEmployeesQuery({
    archived: "false",
    page: currentPage,
    size: rowsPerPage,
  });
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

      const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);
  
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };
  
      const handleExport = async (params: any) => {
        // Add loading state
    
        try {
          setIsLoadingDownload(true); // Start loading
          
          const queryParams = new URLSearchParams({
            size: params.size?.toString() || '',
            type: "EMPLOYEE",
            page: params.page?.toString() || '',
            archived: params.archived?.toString() || '',
            graduated: params.graduated?.toString() || '',
            'search-word': params.searchWord || '',
            genders: params.genders?.join(',') || '',
            'classroom-names': params.classroomNames?.join(',') || '',
            address: params.address || ''
          });
      
          const response = await fetch(
            `${baseUrl}/api/v1/export/employee/excel?${queryParams}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`,
              },
            }
          );
      
          if (!response.ok) {
            throw new Error('Export failed');
          }
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'employees.xlsx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
      
        } catch (error) {
          toast.error("Failed to export students data");
          console.error('Export error:', error);
        } finally {
          setIsLoadingDownload(false); // End loading regardless of success or failure
        }
      }

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

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadEvent, {isLoading: isUploading}] = useUploadEmployeeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetNumber, setSheetNumber] = useState("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate progress
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFile(null);
    setProgress(0);
    setSheetNumber("");
  };

  const handleUploadEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetNumber", sheetNumber);
    
    try {
      await uploadEvent(formData).unwrap();
      toast.success("Event uploaded successfully");
      handleCloseModal();
      void refetch();
    } catch (err: any) {
      toast.error(`${err?.data?.message}`);
    }
  };

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
        className={`${
          currentLanguage === "ar"
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
                  className="size-4 flex-shrink-0 text-secondary"
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
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
          
          <div className="flex justify-center">
          <button
              onClick={handleOpenModal}
              className="mx-3 mb-5 w-[190px] flex justify-center whitespace-nowrap rounded-xl bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in border border-primary hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة"
                : currentLanguage === "fr"
                  ? "ajouter"
                  : "Upload"}
                  <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="16" y1="9" x2="12" y2="5" />  <line x1="8" y1="9" x2="12" y2="5" /></svg>
            </button>
          <button
              onClick={()=>handleExport({
                size: rowsPerPage,
                page: currentPage,
                archived: false,
                graduated: false
              })}
              className="mx-3 mb-5 w-[190px] flex justify-center whitespace-nowrap rounded-xl bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in border border-primary hover:shadow-xl"
            >
              {
              isLoadingDownload ? <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div> : currentLanguage === "en"
                ? "Export Data"
                : currentLanguage === "ar"
                ? "تصدير البيانات"
                : "Exporter les données"
            }
              
            </button>
            <Link
              href="/add-new-employee"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ New Employee"
                : currentLanguage === "ar"
                  ? "+ موظف جديد"
                  : "+ Nouvel Employé"}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Name"
                    : currentLanguage === "ar"
                      ? "الاسم"
                      : "Nom"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : "Genre"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : "Nationalité"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : "Email"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الهاتف المحمول"
                      : "Téléphone"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : "Voir"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Action"
                    : currentLanguage === "ar"
                      ? "الإجراء"
                      : "Action"}
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.data.content
                .filter((employee: Employee) => {
                  return search.toLocaleLowerCase() === ""
                    ? employee
                    : employee.name.toLocaleLowerCase().includes(search);
                })
                .map((employee: Employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="h-4 w-4 rounded border-borderPrimary bg-bgSecondary text-primary focus:ring-2 focus:ring-hover"
                        />
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                    >
                      <div className="w-[50px]">
                        {employee.picture == null ? (
                          <img
                            src="/images/userr.png"
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        ) : (
                          <img
                            src={employee.picture}
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        )}
                      </div>
                      <p className="text-textSecondary"> {employee.name} </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {employee.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {employee.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {employee.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {employee.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {employee.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/employee/view-employee/${employee.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "en"
                          ? "View"
                          : currentLanguage === "ar"
                            ? "عرض"
                            : "Voir"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleDelete(employee.id)}
                        disabled={employee.role === "Admin"}
                        className={`rounded-lg px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out ${employee.role === "Admin" ? "cursor-not-allowed bg-red-800" : "bg-error hover:-translate-y-1 hover:scale-110"}`}
                      >
                        {currentLanguage === "en"
                          ? "Lock"
                          : currentLanguage === "ar"
                            ? "قفل"
                            : "Verrouiller"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(data?.data.content.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "There is No Data"
                : currentLanguage === "ar"
                  ? "لا توجد بيانات"
                  : "Aucune donnée"}
            </div>
          )}
        </div>
        <div className="relative overflow-auto">
          <Pagination
            totalPages={data?.data.totalPages}
            elementsPerPage={rowsPerPage}
            onChangeElementsPerPage={onElementChange}
            currentPage={currentPage}
            onChangePage={onPageChange}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1 className="font-semibold text-lg">Upload File</h1>
        <p className="font-light text-secondary mb-4">Please upload files in Excel format and make sure the file size is under 25 MB.</p>
        <form onSubmit={handleUploadEvent} className="space-y-4">
          <div 
            className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center">
                <div className="mb-4">Drop file or Browse</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  className="hidden"
                  accept=".xlsx,.xls"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover"
                >
                  Browse
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-600">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        Format: {file.type || 'Excel'} file size: {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-500">{progress}%</div>
              </div>
            )}
          </div>
          <input
            placeholder="Sheet Number"
            type="number"
            value={sheetNumber}
            onChange={(e) => setSheetNumber(e.target.value)}
            className="w-full rounded-lg border border-borderPrimary p-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2 text-white hover:bg-hover"
            disabled={!file}
          >
            {isUploading? "uploading..." : "Upload"}
            
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Employee;
