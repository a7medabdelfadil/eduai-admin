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

export const professionalApi = createApi({
  reducerPath: "professionalApi",
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
    getAllProfessionals: builder.query({
      query: () =>
        "/api/v1/management/certificate/professional-development/all?size=1000000&page=0",
    }),

    //
    deleteProfessionals: builder.mutation({
      query: id => ({
        url: `/api/v1/management/certificate/professional-development/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createProfessionals: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/certificate/professional-development`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getProfessionalById: builder.query({
      query: id =>
        `/api/v1/management/certificate/professional-development/${id}`,
    }),
    //
    updateProfessionals: builder.mutation({
      query: ({ formData, id }) => ({
        url: `cases/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getTypesOfCertificates: builder.query({
      query: () => "/api/v1/public/enumeration/certificate-type",
    }),
  }),
});

export const {
  useGetAllProfessionalsQuery,
  useDeleteProfessionalsMutation,
  useCreateProfessionalsMutation,
  useGetProfessionalByIdQuery,
  useUpdateProfessionalsMutation,
  useGetTypesOfCertificatesQuery,
} = professionalApi;
