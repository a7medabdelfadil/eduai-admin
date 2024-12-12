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

export const reportApi = createApi({
  reducerPath: "reportApi",
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
    getAllReports: builder.query({
      query: type =>
        `/api/v1/management/report/all?size=1000000&page=0&deleted=false&type=${type}`,
    }),
    //
    deleteReports: builder.mutation({
      query: id => ({
        url: `/api/v1/management/report/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createReports: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/department`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getReportById: builder.query({
      query: id => `/api/v1/management/department/${id}`,
    }),
    //
    updateReports: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/department/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useDeleteReportsMutation,
  useCreateReportsMutation,
  useGetReportByIdQuery,
  useUpdateReportsMutation,
} = reportApi;
