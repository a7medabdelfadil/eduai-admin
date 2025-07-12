import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/components/BaseURL";

export const signupApi = createApi({
  reducerPath: "signupApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: builder => ({
    signupApiDashboard: builder.mutation({
      query: credentials => ({
        url: "/api/v1/auth/employee-registration",
        method: "POST",
        body: credentials,
      }),
    }),
    //
    getAllNationalitys: builder.query({
      query: () => "/api/v1/public/enumeration/nationality",
    }),
    //
    getAllCountryCode: builder.query({
      query: () => "/api/v1/public/enumeration/country-code",
    }),
    //
    getAllsubjects: builder.query({
      query: () => "/api/v1/public/enumeration/subject",
    }),
    //
    getValidUsername: builder.query({
      query: username => `/api/v1/auth/exists-by-username?username=${username}`,
    }),
    getAllReginionID: builder.query({
      query: () => "/api/v1/public/region/search?page=0&size=1000000&name",
    }),
    //
    getAllRoles: builder.query({
      query: () => "/api/v1/public/enumeration/employee-role",
    }),

    //
    getAllLevels: builder.query({
      query: () => "/api/v1/public/enumeration/study-level",
    }),
    //
    getAllRegistrations: builder.query({
      query: () => "/api/v1/public/enumeration/registration-type",
    }),
    //
    getAllLanguages: builder.query({
      query: () => "/api/v1/public/enumeration/language",
    }),
    getAllSemester: builder.query({
      query: () => "/api/v1/public/enumeration/semester-name",
    }),
    getAllSecondarySchoolDepartments: builder.query({
      query: () => "/api/v1/public/enumeration/secondary-school-department",
    }),
    getAllSecondarySchoolSubDepartments: builder.query({
      query: department => `/api/v1/public/enumeration/secondary-school-sub-department?department=${department}`,
    }),
  }),
});

export const {
  useSignupApiDashboardMutation,
  useGetAllsubjectsQuery,
  useGetAllNationalitysQuery,
  useGetAllCountryCodeQuery,
  useGetAllRolesQuery,
  useGetAllReginionIDQuery,
  useGetAllLevelsQuery,
  useGetAllRegistrationsQuery,
  useGetAllLanguagesQuery,
  useGetValidUsernameQuery,
  useGetAllSemesterQuery,
  useGetAllSecondarySchoolDepartmentsQuery,
  useGetAllSecondarySchoolSubDepartmentsQuery,
} = signupApi;
