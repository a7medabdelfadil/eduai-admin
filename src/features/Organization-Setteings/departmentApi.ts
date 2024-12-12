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

export const departmentApi = createApi({
  reducerPath: "departmentApi",
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
    getAllDepartments: builder.query({
      query: () => "/api/v1/management/department/all?size=1000000&page=0",
    }),
    //
    deleteDepartments: builder.mutation({
      query: id => ({
        url: `/api/v1/management/department/${id}`,
        method: "PUT",
      }),
    }),
    //
    createDepartments: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/department`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getDepartmentById: builder.query({
      query: id => `/api/v1/management/department/${id}`,
    }),
    //
    updateDepartments: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/department/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllDepartmentsQuery,
  useDeleteDepartmentsMutation,
  useCreateDepartmentsMutation,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentsMutation,
} = departmentApi;
