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

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
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
    averageGradesAtSchool: builder.query({
      query: () =>
        `/api/v1/daily-exam/grade/average-grades-at-school?period=SEMESTER`,
    }),
    //
    averageAttendance: builder.query({
      query: () =>
        `/api/v1/aiInsights/average-attendance-at-school`,
    }),
    //
    topStudentsInClass: builder.query({
      query: ({classRoom}) =>
        `/api/v1/ai-insights/top-student-in-classroom?classroom-id=${classRoom}`,
    }),
    //
    getAllTeacherSchedule: builder.query({
      query: teacherId =>
        `/api/v1/schedule/teacher?size=1000000&page=0&teacherId=${teacherId}&getActive=1`,
    }),
    //
    getAllClassSchedule: builder.query({
      query: classroomId =>
        `/api/v1/schedule/classroom?size=10&page=0&classroomId=${classroomId}&getActive=1`,
    }),
    //
    deleteSchedual: builder.mutation({
      query: id => ({
        url: `/api/v1/schedule/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createSchedual: builder.mutation({
      query: formData => ({
        url: `/api/v1/schedule`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getCourseById: builder.query({
      query: id => `/api/v1/management/course/${id}`,
    }),
    //
    getSchedualById: builder.query({
      query: id => `/api/v1/schedule/${id}`,
    }),
    //
    updateSchedual: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/schedule/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useAverageGradesAtSchoolQuery,
  useAverageAttendanceQuery,
  useTopStudentsInClassQuery,
  useGetAllTeacherScheduleQuery,
  useGetAllClassScheduleQuery,
  useGetSchedualByIdQuery,
  useDeleteSchedualMutation,
  useCreateSchedualMutation,
  useUpdateSchedualMutation,
} = scheduleApi;
