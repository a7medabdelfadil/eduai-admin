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

export const participationApi = createApi({
  reducerPath: "participationApi",
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
    getAllParticipations: builder.query({
      query: () =>
        "/api/v1/management/certificate/participation/all?size=1000000&page=0",
    }),
    //
    deleteParticipations: builder.mutation({
      query: id => ({
        url: `/api/v1/management/certificate/participation/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createParticipations: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/certificate/participation`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getParticipationById: builder.query({
      query: id => `/api/v1/management/certificate/participation/${id}`,
    }),
    //
    updateParticipations: builder.mutation({
      query: ({ formData, id }) => ({
        url: `cases/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllParticipationsQuery,
  useDeleteParticipationsMutation,
  useCreateParticipationsMutation,
  useGetParticipationByIdQuery,
  useUpdateParticipationsMutation,
} = participationApi;
