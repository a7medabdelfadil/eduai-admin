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

export const annualApi = createApi({
  reducerPath: "annualApi",
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
    // Fetch all annual leaves
    getAllAnnualLeaves: builder.query({
      query: () => "/api/v1/annual-leave/all",
    }),

    // Create a new annual leave
    createAnnualLeave: builder.mutation({
      query: formData => ({
        url: "/api/v1/annual-leave",
        method: "POST",
        body: formData,
      }),
    }),

    // Get a specific annual leave by ID
    getAnnualLeaveById: builder.query({
      query: id => `/api/v1/annual-leave/${id}`,
    }),

    // Update a specific annual leave by ID
    updateAnnualLeave: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/annual-leave/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    // Delete a specific annual leave by ID
    deleteAnnualLeave: builder.mutation({
      query: id => ({
        url: `/api/v1/annual-leave/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAnnualLeavesQuery,
  useCreateAnnualLeaveMutation,
  useGetAnnualLeaveByIdQuery,
  useUpdateAnnualLeaveMutation,
  useDeleteAnnualLeaveMutation,
} = annualApi;
