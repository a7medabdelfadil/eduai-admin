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

export const certificatesApi = createApi({
  reducerPath: "certificatesApi",
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
    getAllCertificates: builder.query({
      query: () =>
        "/api/v1/management/certificate/completion/all?size=1000000&page=0",
    }),
    //
    deleteCertificates: builder.mutation({
      query: id => ({
        url: `/api/v1/management/certificate/completion/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createCertificates: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/certificate/completion`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getCertificateById: builder.query({
      query: id => `/api/v1/management/certificate/completion/${id}`,
    }),
    //
    getAllTranscriptCourses: builder.query({
      query: ( id ) => ({
        url: `/api/v1/transcript/courses?semesterId=${id}`,
      }),
    }),
    getAllGradeCourse: builder.query({
      query: ( id ) => ({
        url: `/api/v1/transcript/grades-of-course?courseSemesterRegistrationId=${id}`,
      }),
    }),
    getAllStudentGrads: builder.query({
      query: ( id ) => ({
        url: `/api/v1/transcript/list-of-points/grades-for-all-semesters?student-id=${id}`,
      }),
    }),
    getAllListPoints: builder.query({
      query: () => ({
        url: `/api/v1/transcript/list-of-points/students?search&size=1000000&page=0`,
      }),
    }),
  }),
});

export const {
  useGetAllCertificatesQuery,
  useDeleteCertificatesMutation,
  useCreateCertificatesMutation,
  useGetCertificateByIdQuery,
  useGetAllStudentGradsQuery,
  useGetAllTranscriptCoursesQuery,
  useGetAllGradeCourseQuery,
  useGetAllListPointsQuery,
} = certificatesApi;
