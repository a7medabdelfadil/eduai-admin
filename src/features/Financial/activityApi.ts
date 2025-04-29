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

export const activityApi = createApi({
  reducerPath: "activityApi",
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
    getActivityTypes: builder.query({
      query: () => "/api/v1/public/enumeration/activity-type",
    }),
    createActivity: builder.mutation({
      query: body => ({
        url: "/api/v1/activity-cost",
        method: "POST",
        body,
      }),
    }),
    getAllActivities: builder.query({
      query: () => "/api/v1/activity-cost/all",
    }),
    getUnusedActivities: builder.query({
      query: () => "/api/v1/activity-cost/unused-types",
    }),
    getActivityById: builder.query({
      query: id => `/api/v1/activity-cost/update?activityCostId=${id}`,
    }),
    updateActivity: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/activity-cost?activityCostId=${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteActivity: builder.mutation({
      query: (id: string) => ({
        url: `/api/v1/activity-cost?activityCostId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetActivityTypesQuery,
  useCreateActivityMutation,
  useGetAllActivitiesQuery,
  useGetActivityByIdQuery,
  useGetUnusedActivitiesQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activityApi;
