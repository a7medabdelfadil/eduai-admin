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

export const achievementApi = createApi({
  reducerPath: "achievementApi",
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
    getAllAchievements: builder.query({
      query: () =>
        "/api/v1/management/certificate/achievement/all?size=10&page=0",
    }),
    //
    deleteAchievements: builder.mutation({
      query: id => ({
        url: `/api/v1/management/certificate/achievement/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createAchievements: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/certificate/achievement`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getAchievementById: builder.query({
      query: id => `/api/v1/management/certificate/achievement/${id}`,
    }),
    //
    updateAchievements: builder.mutation({
      query: ({ formData, id }) => ({
        url: `cases/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllAchievementsQuery,
  useDeleteAchievementsMutation,
  useCreateAchievementsMutation,
  useGetAchievementByIdQuery,
  useUpdateAchievementsMutation,
} = achievementApi;
