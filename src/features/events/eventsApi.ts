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

export const eventsApi = createApi({
  reducerPath: "eventsApi",
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
    getAllEvents: builder.query({
      query: () => "/api/v1/event/all?size=1000000&page=0&getActive=1",
    }),
    //
    getSchoolLogo: builder.query({
      query: () => "/api/v1/school-logo/name-logo",
    }),
    //
    getAllEventsDashboard: builder.query({
      query: () =>
        "/api/v1/dashboard/upcoming-events?size=3&page=0&getActive=1",
    }),
    //
    deleteEvents: builder.mutation({
      query: id => ({
        url: `/api/v1/event/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createEvents: builder.mutation({
      query: formData => ({
        url: `/api/v1/event`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadEvent: builder.mutation({
      query: formData => ({
        url: `/api/v1/upload-data/timetable/excel`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadEmployee: builder.mutation({
      query: formData => ({
        url: `/api/v1/upload-data/employees/excel`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadTeacher: builder.mutation({
      query: formData => ({
        url: `/api/v1/upload-data/teachers/excel`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadParent: builder.mutation({
      query: formData => ({
        url: `/api/v1/upload-data/parents/excel`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadClassrooms: builder.mutation({
      query: formData => ({
        url: `/api/v1/upload-data/classrooms/excel`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getEventById: builder.query({
      query: id => `/api/v1/event/${id}`,
    }),
    //
    updateEvents: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/event/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetAllEventsDashboardQuery,
  useDeleteEventsMutation,
  useGetSchoolLogoQuery,
  useUploadEventMutation,
  useUploadEmployeeMutation,
  useUploadTeacherMutation,
  useUploadClassroomsMutation,
  useUploadParentMutation,
  useCreateEventsMutation,
  useGetEventByIdQuery,
  useUpdateEventsMutation,
} = eventsApi;
