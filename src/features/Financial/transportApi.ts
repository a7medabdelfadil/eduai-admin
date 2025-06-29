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

export const transportApi = createApi({
  reducerPath: "transportApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: headers => {
      const token = getTokenFromCookie();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getAllBusCosts: builder.query({
      query: () => "/api/v1/bus-cost/all",
    }),
    createBusCost: builder.mutation({
      query: body => ({
        url: "/api/v1/bus-cost",
        method: "POST",
        body,
      }),
    }),
    getBusCostByRegionId: builder.query({
      query: (regionId: number | string) =>
        `/api/v1/bus-cost/update?regionId=${regionId}`,
    }),
    updateBusCost: builder.mutation({
      query: body => ({
        url: "/api/v1/bus-cost",
        method: "PUT",
        body,
      }),
    }),
    deleteBusCost: builder.mutation({
      query: (regionId: number | string) => ({
        url: `/api/v1/bus-cost?regionId=${regionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBusCostsQuery,
  useGetBusCostByRegionIdQuery,
  useCreateBusCostMutation,
  useUpdateBusCostMutation,
  useDeleteBusCostMutation,
} = transportApi;
