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

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
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
    getAllEmpolyeesAttend: builder.query({
      query: ({ role, size, page, employeeType }) =>
        `/api/v1/employee-attendance/by-role?date=&role=${role}&size=${size}&page=${page}&employeeType=${employeeType}`,
    }),
    //
    getAllStudentsAttend: builder.query({
      query: ({ size, page }) =>
        `/api/v1/student-attendance/all?date=&size=${size}&page=${page}`,
    }),
    //
    getAllSchools: builder.query({
      query: () => `/api/v1/public/school/basic-info?name&size=1000000&page=0`,
    }),
    //
    getDriversCount: builder.query({
      query: () => `/api/v1/dashboard/drivers-count`,
    }),
    //
    getDriversAttend: builder.query({
      query: () => `/api/v1/dashboard/drivers-attendance?status=PRESENT`,
    }),
    //
    deleteBuss: builder.mutation({
      query: id => ({
        url: `/api/v1/bus/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createAttendance: builder.mutation({
      query: formData => ({
        url: `/api/v1/employee-attendance`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getBusById: builder.query({
      query: id => `/api/v1/bus/${id}`,
    }),
    //
    updateAttendance: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/employee-attendance/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    //
    updateStudentAttendance: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/student-attendance/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllEmpolyeesAttendQuery,
  useGetAllSchoolsQuery,
  useGetAllStudentsAttendQuery,
  useGetDriversCountQuery,
  useGetDriversAttendQuery,
  useDeleteBussMutation,
  useCreateAttendanceMutation,
  useGetBusByIdQuery,
  useUpdateAttendanceMutation,
  useUpdateStudentAttendanceMutation,
} = attendanceApi;
