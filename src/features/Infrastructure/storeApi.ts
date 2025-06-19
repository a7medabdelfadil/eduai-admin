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

export const storeApi = createApi({
  reducerPath: "storeApi",
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
    getAllResources: builder.query({
      query: ({ resourceType, archive = false }: { resourceType: string; archive?: boolean }) =>
        `/api/v1/management/resource/all?resourceType=${resourceType}&archived=${archive}`,
    }),
    deleteResource: builder.mutation({
      query: id => ({
        url: `/api/v1/management/resource/${id}`,
        method: "DELETE",
      }),
    }),
    createResource: builder.mutation({
      query: body => ({
        url: `/api/v1/management/resource/new`,
        method: "POST",
        body,
      }),
    }),
    getResourceById: builder.query({
      query: id => `/api/v1/management/resource/${id}`,
    }),
    updateResource: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/management/resource/update/${id}`,
        method: "PUT",
        body,
      }),
    }),
    addItemsToResource: builder.mutation({
      query: ({ id, number }) => ({
        url: `/api/v1/management/resource/Add-items/${id}?items-number=${number}`,
        method: "PUT",
      }),
    }),
    pullItemsFromResource: builder.mutation({
      query: ({ id, number }) => ({
        url: `/api/v1/management/resource/pull-items/${id}?items-number=${number}`,
        method: "PUT",
      }),
    }),
    restoreResource: builder.mutation({
      query: id => ({
        url: `/api/v1/management/resource/restore/${id}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetAllResourcesQuery,
  useGetResourceByIdQuery,
  useDeleteResourceMutation,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useAddItemsToResourceMutation,
  usePullItemsFromResourceMutation,
  useRestoreResourceMutation,
} = storeApi;
