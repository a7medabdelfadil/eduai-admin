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

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: headers => {
      const token = getTokenFromCookie();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(`Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: builder => ({
    //
    getAllNotifications: builder.query({
      query: ({ size, page }) =>
        `/api/v1/my-notification/all?size=${size}&page=${page}`,
    }),
    //
    putNotifiRead: builder.mutation({
      query: id => ({
        url: `/api/v1/my-notification/${id}/read`,
        method: "POST",
      }),
    }),
    //
    deleteNotification: builder.mutation({
      query: id => ({
        url: `/api/v1/my-notification/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createNotifications: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/notification/users-by-role`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  usePutNotifiReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationsMutation,
} = notificationsApi;
