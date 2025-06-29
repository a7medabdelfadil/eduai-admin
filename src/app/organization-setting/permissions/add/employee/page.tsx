"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetAllCategoriesQuery,
  useGetEmployeePermissionByIdQuery,
  useUpdateEmployeePermissionsMutation,
} from "@/features/Organization-Setteings/employeePermissionApi";
import Spinner from "@/components/spinner";
import { useState, useEffect } from "react";
import { useGetAllEmployeesQuery } from "@/features/User-Management/employeeApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormData {
  selectedEmployeeId: string;
  permissions: Record<string, boolean>;
}

const Permissions = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const { data: employees, isLoading: isEmployee } = useGetAllEmployeesQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const [updateEmployeePermissions] = useUpdateEmployeePermissionsMutation();

  const formatPermission = (permission: string) => {
    return permission
      .toLowerCase()
      .split("_")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const { register, watch, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      selectedEmployeeId: "",
      permissions: {},
    },
  });

  const selectedEmployeeId = watch("selectedEmployeeId");

  const onSubmit = async () => {
    const data = getValues();
    const selectedPermissions = Object.keys(data.permissions).filter(
      key => data.permissions[key],
    );
    if (data.selectedEmployeeId) {
      try {
        await updateEmployeePermissions({
          id: data.selectedEmployeeId,
          formData: { permissions: selectedPermissions },
        });
        toast.success("Permission Submitted successfully!");
      } catch (err) {
        toast.error((err as { data: { message: string } }).data?.message);
      }
    }
  };

  const { data, isLoading } = useGetAllCategoriesQuery(null);

  const { data: employeePermissionsData, isLoading: isPermissionsLoading } =
    useGetEmployeePermissionByIdQuery(selectedEmployeeId, {
      skip: !selectedEmployeeId,
    });

  useEffect(() => {
    if (data && employeePermissionsData) {
      // Get all permissions
      const allPermissions = data.data.reduce(
        (acc: string[], categoryData: any) => {
          return acc.concat(categoryData.Permissions);
        },
        [],
      );
      // Initialize permissions object
      const permissionsObject: Record<string, boolean> = {};
      allPermissions.forEach((permission: string | number) => {
        permissionsObject[permission] = false;
      });
      // Set permissions based on employee data
      employeePermissionsData.data.forEach((permission: string) => {
        permissionsObject[permission] = true;
      });
      setValue("permissions", permissionsObject);
    }
  }, [data, employeePermissionsData, setValue]);

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Employee",
      nameAr: "موظف",
      nameFr: "Employé",
      href: "/organization-setting/permissions/add/employee",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  if (isLoading || isEmployee || isPermissionsLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <div
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
          } mx-3 mt-[70px]`}
      >
        <div className="rounded-xl bg-bgPrimary pb-5">
          <div className="flex justify-between rounded-t-xl bg-thead px-10 py-4 text-[18px] font-semibold">
            <p>Permission</p>
            <p>Applicable For</p>
          </div>
          <div className="flex justify-between px-10 py-8 max-[640px]:grid max-[640px]:justify-center max-[640px]:gap-10">
            <div className="grid gap-5 text-[18px] font-semibold">
              {data?.data?.map((categoryData: any, index: number) => (
                <div key={index}>
                  <div className="mb-4 flex items-center gap-2">
                    <button
                      onClick={() => toggleCategory(categoryData.category)}
                    >
                      {!openCategories[categoryData.category] && (
                        <svg
                          className="h-6 w-6 text-secondary"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      )}
                      {openCategories[categoryData.category] && (
                        <svg
                          className="h-6 w-6 text-secondary"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </button>
                    <input
                      id={`checkbox-all-${index}`}
                      type="checkbox"
                      disabled={!watch("selectedEmployeeId")}
                      className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                      {...register(`permissions.${categoryData.category}`, {
                        onChange: e => {
                          const isChecked = e.target.checked;
                          categoryData.Permissions.forEach(
                            (permission: string) => {
                              setValue(`permissions.${permission}`, isChecked);
                            },
                          );
                          setTimeout(() => {
                            onSubmit();
                          }, 0);
                        },
                      })}
                    />
                    <label
                      htmlFor={`checkbox-all-${index}`}
                      className="cursor-pointer"
                    >
                      {formatPermission(categoryData.category)}
                    </label>
                  </div>
                  {openCategories[categoryData.category] && (
                    <div className="ml-10 grid gap-4">
                      {categoryData.Permissions.map(
                        (permission: any, permIndex: number) => (
                          <div
                            key={permIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              id={`permission-${categoryData.category}-${permIndex}`}
                              type="checkbox"
                              disabled={!watch("selectedEmployeeId")}
                              className="-gray-800 h-5 w-5 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                              {...register(`permissions.${permission}`, {
                                onChange: () => {
                                  setTimeout(() => {
                                    onSubmit();
                                  }, 0);
                                },
                              })}
                            />
                            <label
                              htmlFor={`permission-${categoryData.category}-${permIndex}`}
                              className="cursor-pointer"
                            >
                              {formatPermission(permission)}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid h-[90px] w-[300px] gap-5 font-semibold">
              <p>Sections</p>
              <select
                id="countries"
                className="block w-full rounded-lg border border-borderPrimary bg-bgPrimary p-1.5 text-sm text-textSecondary outline-none focus:border-blue-500 focus:ring-blue-500"
                {...register("selectedEmployeeId")}
              >
                <option value="">
                  {currentLanguage === "ar"
                    ? "اختر"
                    : currentLanguage === "fr"
                      ? "Choisir"
                      : "Choose"}
                </option>
                {employees?.data.content.map((employee: any) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permissions;
