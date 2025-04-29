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

export const feesApi = createApi({
  reducerPath: "feesApi",
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
    getAllInvoices: builder.query({
      query: () => "/api/v1/invoice/all?size=10&page=0&getActive=1",
    }),
    //
    getAllScholarship: builder.query({
      query: () => "/api/v1/scholarship/all",
    }),
    //
    getAllInvoicesItems: builder.query({
      query: () => "/api/v1/public/enumeration/invoice-item-type",
    }),
    //
    getAllCurrency: builder.query({
      query: () => "/api/v1/public/enumeration/currency",
    }),
    //
    deleteInvoices: builder.mutation({
      query: id => ({
        url: `/api/v1/invoice/${id}`,
        method: "DELETE",
      }),
    }),
    //
    deleteScholarship: builder.mutation({
      query: id => ({
        url: `/api/v1/scholarship?scholarshipId=${id}`,
        method: "DELETE",
      }),
    }),
    //
    createInvoices: builder.mutation({
      query: ({ formData, isForStudent }) => ({
        url: `/api/v1/invoice?isForStudent=${isForStudent ? 1 : 0}`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    createScholarship: builder.mutation({
      query: formData => ({
        url: `/api/v1/scholarship`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getInvoiceById: builder.query({
      query: id => `/api/v1/invoice/${id}`,
    }),
    //
    getScholarshipById: builder.query({
      query: id => `/api/v1/scholarship/update?scholarshipId=${id}`,
    }),
    //
    updateInvoices: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/invoice/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    //
    updateScholarship: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/scholarship?scholarshipId=${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
       
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetScholarshipByIdQuery,
  useUpdateScholarshipMutation,
  useCreateScholarshipMutation,
  useDeleteInvoicesMutation,
  useDeleteScholarshipMutation,
  useGetAllScholarshipQuery,
  useCreateInvoicesMutation,
  useGetInvoiceByIdQuery,
  useUpdateInvoicesMutation,
  useGetAllCurrencyQuery,
  useGetAllInvoicesItemsQuery,
} = feesApi;
