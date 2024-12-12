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

export const teacherApi = createApi({
  reducerPath: "teacherApi",
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
    getAllTeachers: builder.query({
      query: ({ archived, page, size }) =>
        `/api/v1/management/teacher/all?size=${size}&page=${page}&archived=${archived}`,
    }),
    //
    getAllUsersChat: builder.query({
      query: () => `/api/v1/shared/user/all?size=1000000&page=0`,
    }),
    //
    deleteTeachers: builder.mutation({
      query: ({ id, lock }) => ({
        url: `/api/v1/management/teacher/account-lock/${id}?locked=${lock}`,
        method: "PUT",
      }),
    }),
    //
    createTeachers: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/teacher/new`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getTeacherById: builder.query({
      query: id => `/api/v1/management/teacher/${id}`,
    }),
    //
    getTeacherClass: builder.query({
      query: id => `/api/v1/management/teacher/today-classes/${id}`,
    }),
    //
    getTeacherByIdUpdate: builder.query({
      query: id => `/api/v1/management/teacher/${id}/update`,
    }),
    //
    updateTeachers: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/teacher/${id}/update`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateTeachersMutation,
  useDeleteTeachersMutation,
  useGetTeacherByIdUpdateQuery,
  useGetAllTeachersQuery,
  useGetTeacherByIdQuery,
  useGetTeacherClassQuery,
  useUpdateTeachersMutation,
  useGetAllUsersChatQuery,
} = teacherApi;
