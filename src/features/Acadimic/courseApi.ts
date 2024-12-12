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

export const courseApi = createApi({
  reducerPath: "courseApi",
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
    getAllCourses: builder.query({
      query: () => "/api/v1/management/course/all?size=1000000&page=0",
    }),
    //
    getAllGrades: builder.query({
      query: ({ studentId, semesterId }) =>
        `/api/v1/grade-report/student-report?studentId=${studentId}&semesterId=${semesterId}`,
    }),
    //
    deleteCourses: builder.mutation({
      query: id => ({
        url: `/api/v1/management/course/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createCourses: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/course`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getCourseById: builder.query({
      query: id => `/api/v1/management/course/${id}`,
    }),
    //
    updateCourses: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/course/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useDeleteCoursesMutation,
  useCreateCoursesMutation,
  useGetCourseByIdQuery,
  useUpdateCoursesMutation,
  useGetAllGradesQuery,
} = courseApi;
