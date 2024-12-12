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

export const workerApi = createApi({
  reducerPath: "workerApi",
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
    getAllWorkers: builder.query({
      query: ({ archived, page, size }) =>
        `api/v1/management/employee/all?size=${size}&page=${page}&type=WORKER&archived=${archived}`,
    }),
    //
    deleteWorkers: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/employee/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createWorkers: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/employee/new?type=WORKER`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getWorkerById: builder.query({
      query: id => `/api/v1/management/employee/${id}`,
    }),
    //
    updateWorkers: builder.mutation({
      query: ({ formData, id }) => ({
        url: `cases/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllWorkersQuery,
  useDeleteWorkersMutation,
  useCreateWorkersMutation,
  useGetWorkerByIdQuery,
  useUpdateWorkersMutation,
} = workerApi;
