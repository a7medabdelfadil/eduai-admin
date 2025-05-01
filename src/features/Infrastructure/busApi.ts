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

export const busApi = createApi({
  reducerPath: "busApi",
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
    getAllBuss: builder.query({
      query: archive =>
        `/api/v1/bus/all?size=1000000&page=0&getActive=${archive}`,
    }),
    //
    deleteBuss: builder.mutation({
      query: id => ({
        url: `/api/v1/bus/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createBuss: builder.mutation({
      query: formData => ({
        url: `/api/v1/bus`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getBusById: builder.query({
      query: id => `/api/v1/bus/${id}`,
    }),
    //
    updateBuss: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/bus/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllBussQuery,
  useDeleteBussMutation,
  useCreateBussMutation,
  useGetBusByIdQuery,
  useUpdateBussMutation,
} = busApi;
