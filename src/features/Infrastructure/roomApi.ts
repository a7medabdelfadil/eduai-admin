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

export const roomApi = createApi({
  reducerPath: "roomApi",
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
    getAllRooms: builder.query({
      query: () => "/api/v1/room/by-category?category=LIBRARY",
    }),
    createRoom: builder.mutation({
      query: formData => ({
        url: "/api/v1/room",
        method: "POST",
        body: formData,
      }),
    }),
    getRoomById: builder.query({
      query: id => `/api/v1/room/${id}`,
    }),
    updateRoom: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/room/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteRoom: builder.mutation({
      query: id => ({
        url: `/api/v1/room/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
