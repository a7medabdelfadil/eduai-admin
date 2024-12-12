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

export const semesterApi = createApi({
  reducerPath: "semesterApi",
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
    getAllSemesters: builder.query({
      query: () => "/api/v1/management/semester/all?size=1000000&page=0",
    }),
    //
    getAllSemestersByYear: builder.query({
      query: (year) => `/api/v1/student-study/Semesters?academicYearId=${year}`,
    }),
    //
    getAllAcadimicYear: builder.query({
      query: () => "/api/v1/student-study/Academic-YEAR",
    }),
    //
    deleteSemesters: builder.mutation({
      query: id => ({
        url: `/api/v1/management/semester/${id}`,
        method: "PUT",
      }),
    }),
    //
    createSemesters: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/semester`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getSemesterById: builder.query({
      query: id => `/api/v1/management/semester/${id}`,
    }),
    //
    updateSemesters: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/semester/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllSemestersQuery,
  useGetAllAcadimicYearQuery,
  useGetAllSemestersByYearQuery,
  useDeleteSemestersMutation,
  useCreateSemestersMutation,
  useGetSemesterByIdQuery,
  useUpdateSemestersMutation,
} = semesterApi;
