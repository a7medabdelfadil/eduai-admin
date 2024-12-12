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

export const labApi = createApi({
  reducerPath: "labApi",
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
    getAllLabs: builder.query({
      query: () => "/api/v1/management/lab/all?size=10&page=0&semesterId",
    }),
    //
    deleteLabs: builder.mutation({
      query: id => ({
        url: `/api/v1/management/lab/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createLabs: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/lab/`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getLabById: builder.query({
      query: id => `/api/v1/management/lab/${id}`,
    }),
    //
    updateLabs: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/lab/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllLabsQuery,
  useDeleteLabsMutation,
  useCreateLabsMutation,
  useGetLabByIdQuery,
  useUpdateLabsMutation,
} = labApi;
