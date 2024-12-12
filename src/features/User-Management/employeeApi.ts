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

export const employeeApi = createApi({
  reducerPath: "employeeApi",
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
    getAllEmployees: builder.query({
      query: ({ archived, page, size }) =>
        `api/v1/management/employee/all?size=${size}&page=${page}&type=EMPLOYEE&archived=${archived}`,
    }),
    //
    deleteEmployees: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/employee/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createEmployees: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/employee/new?type=EMPLOYEE`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    UpdateCurrentUser: builder.mutation({
      query: formData => ({
        url: `/api/v1/my-account/profile/employee/update`,
        method: "PUT",
        body: formData,
      }),
    }),
    //
    getEmployeeById: builder.query({
      query: id => `/api/v1/management/employee/${id}`,
    }),
    //
    updatePassword: builder.mutation({
      query: formData => ({
        url: `/api/v1/my-account/password/change`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    updatePicture: builder.mutation({
      query: formData => ({
        url: `/api/v1/my-account/picture`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useDeleteEmployeesMutation,
  useUpdateCurrentUserMutation,
  useCreateEmployeesMutation,
  useGetEmployeeByIdQuery,
  useUpdatePasswordMutation,
  useUpdatePictureMutation,
} = employeeApi;
