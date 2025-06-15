import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/components/BaseURL";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const getTokenFromCookie = (): string | null => {
  return getCookie("token") ?? null;
};

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
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
    getEnrollmentStatus: builder.query({
      query: () => "/api/v1/Enrollment/status",
    }),

    getEnrollmentDate: builder.query({
      query: () => "/api/v1/Enrollment/date",
    }),
  }),
});

export const { useGetEnrollmentStatusQuery, useGetEnrollmentDateQuery } =
  enrollmentApi;
