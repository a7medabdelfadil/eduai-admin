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

export const otherOfficialDocumentsApi = createApi({
  reducerPath: "otherOfficialDocumentsApi",
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
    getAllIdCards: builder.query({
      query: () => "/api/v1/shared/user/id-cards",
      transformResponse: (response: any) => {
        return {
          idCards: response.data.content,
          pagination: {
            totalElements: response.data.totalElementsCount,
            totalPages: response.data.totalPagesCount,
            currentPage: response.data.pageNumber,
            pageSize: response.data.pageSize,
          },
        };
      },
    }),
    getStudentsWithMedicalStatus: builder.query({
      query: () => '/api/v1/student/medical-record/students-with-status',
      transformResponse: (response: any) => response.data.content,
    }),
     createMedicalRecord: builder.mutation({
      query: (formValues: {
        file: File;
        studentId: string;
        title: string;
        result: string;
        note: string;
      }) => {
        const formData = new FormData();
        formData.append("file", formValues.file);
        formData.append("student-id", formValues.studentId);
        formData.append("title", formValues.title);
        formData.append("result", formValues.result);
        formData.append("note", formValues.note);

        return {
          url: "/api/v1/student/medical-record/new",
          method: "POST",
          body: formData,
        };
      },
    }),

  }),
});

export const { useGetAllIdCardsQuery, useGetStudentsWithMedicalStatusQuery, useCreateMedicalRecordMutation } = otherOfficialDocumentsApi;
