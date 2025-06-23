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

export const paymentApi = createApi({
  reducerPath: "paymentApi",
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
    getFeesItemsByType: builder.query({
      query: (type: string) => `/api/v1/fees-item/all?type=${type}`,
    }),
    deleteFeesItem: builder.mutation({
      query: (feesItemId: number | string) => ({
        url: `/api/v1/fees-item/${feesItemId}`,
        method: "DELETE",
      }),
    }),
    createFeesItem: builder.mutation({
      query: body => ({
        url: `/api/v1/fees-item`,
        method: "POST",
        body,
      }),
    }),
    updateFeesItem: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/fees-item/${id}`,
        method: "PUT",
        body,
      }),
    }),
    getFeesItemById: builder.query({
      query: (id: number | string) => `/api/v1/fees-item/update/${id}`,
    }),

  }),
});

export const {
  useGetFeesItemsByTypeQuery,
  useDeleteFeesItemMutation,
  useCreateFeesItemMutation,
  useUpdateFeesItemMutation,
  useGetFeesItemByIdQuery,

} = paymentApi;
