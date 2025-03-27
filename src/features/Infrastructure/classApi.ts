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

export const classApi = createApi({
  reducerPath: "classApi",
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
    getAllClasss: builder.query({
      query: () =>
        "/api/v1/management/classroom/all?size=1000000&page=0&semesterId=",
    }),
    //
    deleteClasss: builder.mutation({
      query: id => ({
        url: `/api/v1/management/classroom/${id}`,
        method: "PUT",
      }),
    }),
    //
    createClasss: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/classroom`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getClassById: builder.query({
      query: id => `/api/v1/management/classroom/${id}`,
    }),
    //
    updateClasss: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/classroom/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllClasssQuery,
  useDeleteClasssMutation,
  useCreateClasssMutation,
  useGetClassByIdQuery,
  useUpdateClasssMutation,
} = classApi;
