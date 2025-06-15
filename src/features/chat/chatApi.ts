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

export const chatApi = createApi({
  reducerPath: "chatApi",
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
    getAllChats: builder.query({
      query: () => `/api/v1/chat/all`,
    }),
    //
    getChatMessages: builder.query({
      query: id => ({
        url: `/api/v1/messages/messagesInChat/${id}?page=0&size=100`,
      }),
    }),
    //
    sendMessage: builder.mutation({
      query: formData => ({
        url: `/api/v1/messages/new`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    uploadFile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/messages/${id}/file`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    CreateNewChat: builder.mutation({
      query: formData => ({
        url: `/api/v1/chat/new`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getBusById: builder.query({
      query: id => `/api/v1/bus/${id}`,
    }),
    //
    deleteChat: builder.mutation({
      query: id => ({
        url: `/api/v1/chat/${id}`,
        method: "DELETE",
      }),
    }),
    //
    updateStudentAttendance: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/student-attendance/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetChatMessagesQuery,
  useCreateNewChatMutation,
  useUploadFileMutation,
  useSendMessageMutation,
  useGetBusByIdQuery,
  useDeleteChatMutation,
  useUpdateStudentAttendanceMutation,
} = chatApi;
