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

export const bankApi = createApi({
  reducerPath: "bankApi",
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
    getAllBankAcounts: builder.query({
      query: () => "/api/v1/bank-account/all?size=1000000&page=0&getActive=1",
    }),
    //
    deleteBankAcounts: builder.mutation({
      query: id => ({
        url: `/api/v1/bank-account/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createBankAcounts: builder.mutation({
      query: formData => ({
        url: `/api/v1/bank-account`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getBankAcountById: builder.query({
      query: id => `/api/v1/bank-account/${id}`,
    }),
    //
    updateBankAcounts: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/bank-account/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    
  }),
});

export const {
  useGetAllBankAcountsQuery,
  useDeleteBankAcountsMutation,
  useCreateBankAcountsMutation,
  useGetBankAcountByIdQuery,
  useUpdateBankAcountsMutation,
} = bankApi;
