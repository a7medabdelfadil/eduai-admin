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

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
    getAllCurrentUser: builder.query({
      query: () => "/api/v1/my-account/profile/employee",
    }),
    //
    getAllEmployees: builder.query({
      query: () => "/api/v1/dashboard/employees-count",
    }),
    //
    getAllWorkers: builder.query({
      query: () => "/api/v1/dashboard/workers-count",
    }),
    //
    getAllStudents: builder.query({
      query: () => "/api/v1/dashboard/students-count",
    }),
    //
    getAllTeachers: builder.query({
      query: () => "/api/v1/dashboard/teachers-count",
    }),
    //
    getAllNotices: builder.query({
      query: () => "/api/v1/dashboard/notice-board",
    }),
    //
    getAllCountrys: builder.query({
      query: () => "/api/v1/management/country/all",
    }),
    //
    getTeacherAttendence: builder.query({
      query: () => "/api/v1/dashboard/teachers-attendance?status=PRESENT",
    }),
    //
    getStudentAttendence: builder.query({
      query: () => "/api/v1/dashboard/students-attendance?status=PRESENT",
    }),
    //
    getEmployeeAttendence: builder.query({
      query: () => "/api/v1/dashboard/employees-attendance?status=PRESENT",
    }),
    //
    getEventsInMonth: builder.query({
      query: () => "/api/v1/dashboard/month-event-count",
    }),

    getEventsInWeek: builder.query({
      query: () => "/api/v1/dashboard/week-event-count",
    }),
    //
    getWorkerAttendence: builder.query({
      query: () => "/api/v1/dashboard/workers-attendance?status=PRESENT",
    }),
    //
    getNotices: builder.query({
      query: () => "/api/management/note/all?page=0&size=100000",
    }),
    getStudentPercentage: builder.query({
      query: () => "/api/v1/dashboard/student-increase-percentage",
    }),
    createNote: builder.mutation({
      query: ({ title, description }) => ({
        url: `/api/management/note`,
        method: "POST",
        body: { title, description },
      }),
    }),
    //
    deleteNote: builder.mutation({
      query: id => ({
        url: `/api/management/note/${id}`,
        method: "DELETE",
      }),
    }),
    getNoteById: builder.query({
      query: (id: string | number) => `/api/management/note/${id}`,
    }),

    updateNote: builder.mutation({
      query: ({ id, title, description }) => ({
        url: `/api/management/note/${id}`,
        method: "PUT",
        body: { title, description },
      }),
    }),

    //
    getExpenses: builder.query({
      query: ({ start, end }) =>
        `/api/v1/dashboard/school-finance?start-date=${start}&end-date=${end}`,
    }),
  }),
});

export const {
  useGetAllCurrentUserQuery,
  useDeleteNoteMutation,
  useCreateNoteMutation,
  useGetAllEmployeesQuery,
  useGetExpensesQuery,
  useGetAllNoticesQuery,
  useGetAllWorkersQuery,
  useGetAllStudentsQuery,
  useGetAllTeachersQuery,
  useGetEventsInMonthQuery,
  useGetEventsInWeekQuery,
  useGetStudentAttendenceQuery,
  useGetAllCountrysQuery,
  useGetTeacherAttendenceQuery,
  useGetEmployeeAttendenceQuery,
  useGetWorkerAttendenceQuery,
  useGetNoticesQuery,
  useGetStudentPercentageQuery,
  useGetNoteByIdQuery,
  useUpdateNoteMutation
} = dashboardApi;
