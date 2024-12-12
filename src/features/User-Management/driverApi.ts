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

export const driverApi = createApi({
  reducerPath: "driverApi",
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
    getAllPositions: builder.query({
      query: () => `/api/v1/management/position/all?size=1000000&page=0`,
    }),
    //
    getAllDrivers: builder.query({
      query: ({ archived, page, size }) =>
        `api/v1/management/employee/all?size=${size}&page=${page}&type=DRIVER&archived=${archived}`,
    }),
    //
    deleteDrivers: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/employee/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createDrivers: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/employee/new?type=DRIVER`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getDriverById: builder.query({
      query: id => `/api/v1/management/employee/${id}`,
    }),
    //
    updateDrivers: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/employee/${id}/update`,
        method: "PUT",
        body: formData,
      }),
    }),
    //
    getDrivers: builder.query({
      query: id => ({
        url: `/api/v1/management/employee/${id}/update`,
      }),
    }),
  }),
});

export const {
  useGetAllPositionsQuery,
  useGetAllDriversQuery,
  useDeleteDriversMutation,
  useCreateDriversMutation,
  useGetDriverByIdQuery,
  useUpdateDriversMutation,
  useGetDriversQuery,
} = driverApi;
