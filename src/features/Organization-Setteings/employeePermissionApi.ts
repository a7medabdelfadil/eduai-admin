import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/components/BaseURL";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const getTokenFromCookie = () => {
  return getCookie("token");
};

export const employeePermissionApi = createApi({
  reducerPath: "employeePermissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: headers => {
      const token = getTokenFromCookie();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: builder => ({
    getAllEmployeePermissions: builder.query({
      query: () =>
        "/api/v1/management/permission/employee/all?size=1000000&page=0",
    }),
    //
    getAllCategories: builder.query({
      query: () =>
        "/api/v1/management/permission/employee/permission_categories",
    }),
    //
    getEmployeePermissionById: builder.query({
      query: id => `/api/v1/management/permission/employee/${id}`,
    }),
    //
    updateEmployeePermissions: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/permission/employee/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllEmployeePermissionsQuery,
  useGetAllCategoriesQuery,
  useGetEmployeePermissionByIdQuery,
  useUpdateEmployeePermissionsMutation,
} = employeePermissionApi;
