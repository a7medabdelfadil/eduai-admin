import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/components/BaseURL";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: builder => ({
    //
    loginDashboard: builder.mutation({
      query: credentials => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    //
    findAccount: builder.mutation({
      query: userName => ({
        url: `/api/v1/auth/password/find-account?username=${userName}`,
        method: "POST",
      }),
    }),
    //
    selectAccout: builder.mutation({
      query: ({ id, email }) => ({
        url: `/api/v1/auth/password/select-email?user-id=${id}&email=${email}`,
        method: "POST",
      }),
    }),
    //
    selectAccoutConfirm: builder.mutation({
      query: ({ id, email }) => ({
        url: `/api/v1/auth/email/send?user-id=${id}&email=${email}`,
        method: "POST",
      }),
    }),
    //
    sendOtp: builder.mutation({
      query: ({ code, email }) => ({
        url: `/api/v1/auth/password/validate-code?email=${email}&code=${code}`,
        method: "POST",
      }),
    }),
    //
    sendOtpConfirm: builder.mutation({
      query: ({ code, email }) => ({
        url: `/api/v1/auth/email/confirm?email=${email}&code=${code}`,
        method: "POST",
      }),
    }),
    //
    resetPassword: builder.mutation({
      query: ({ code, email, password }) => ({
        url: `/api/v1/auth/password/reset-password?email=${email}&code=${code}&password=${password}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginDashboardMutation,
  useFindAccountMutation,
  useSelectAccoutMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
  useSendOtpConfirmMutation,
  useSelectAccoutConfirmMutation,
} = loginApi;
