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

export const parentApi = createApi({
  reducerPath: "parentApi",
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
    getAllParents: builder.query({
      query: ({ archived, page, size }) =>
        `/api/v1/management/parent/all?size=${size}&page=${page}&archived=${archived}`,
    }),
    //
    deleteParents: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/parent/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createParents: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/parent/new`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getParentById: builder.query({
      query: id => `/api/v1/management/parent/${id}`,
    }),
    //
    updateParents: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/parent/${id}/update`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllParentsQuery,
  useDeleteParentsMutation,
  useCreateParentsMutation,
  useGetParentByIdQuery,
  useUpdateParentsMutation,
} = parentApi;
