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

export const positionApi = createApi({
  reducerPath: "positionApi",
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
    getAllPositions: builder.query({
      query: () => "/api/v1/management/position/all?size=1000000&page=0",
    }),
    //
    deletePositions: builder.mutation({
      query: id => ({
        url: `/api/v1/management/position/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createPositions: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/position`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getPositionById: builder.query({
      query: id => `/api/v1/management/position/${id}`,
    }),
    //
    updatePositions: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/position/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllPositionsQuery,
  useDeletePositionsMutation,
  useCreatePositionsMutation,
  useGetPositionByIdQuery,
  useUpdatePositionsMutation,
} = positionApi;
