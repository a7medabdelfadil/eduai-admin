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

export const studentApi = createApi({
  reducerPath: "studentApi",
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
    getAllStudents: builder.query({
      query: ({
        archived,
        page,
        size,
        graduated,
        gender = "",
        classRoom = "",
      }) =>
        `/api/v1/management/student/all?size=${size}&page=${page}&archived=${archived}&graduated=${graduated}&genders=${gender}&classroom-names=${classRoom}`,
    }),
    //
    exportStudentsFile: builder.query({
      query: ({ archived, page, size, graduated }) =>
        `/api/v1/export/student/excel?size=${size}&page=${page}&archived=${archived}&graduated=${graduated}`,
      transformResponse: (response: any) => response.blob(),
    }),
    //
    deleteStudents: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/student/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createStudents: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/student/new`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getStudentById: builder.query({
      query: id => `/api/v1/management/student/${id}`,
    }),
    //
    getStudentExams: builder.query({
      query: ({ id, date }) =>
        `/api/v1/student-study/schedule-at-date-for-admin-to-student?date=${date}&studentId=${id}`,
    }),
    //
    getStudentUpdateById: builder.query({
      query: id => `/api/v1/management/student/${id}/update`,
    }),
    //
    getStudentByIdUpdate: builder.query({
      query: id => `/api/v1/management/student/${id}/update`,
    }),
    //
    getAllEducations: builder.query({
      query: id =>
        `/api/v1/management/education-system/all?size=1000000&page=0`,
    }),
    //
    updateStudents: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/student/${id}/update`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentExamsQuery,
  useLazyExportStudentsFileQuery,
  useGetStudentByIdUpdateQuery,
  useDeleteStudentsMutation,
  useCreateStudentsMutation,
  useGetAllEducationsQuery,
  useGetStudentByIdQuery,
  useGetStudentUpdateByIdQuery,
  useUpdateStudentsMutation,
} = studentApi;
