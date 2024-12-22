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

export const schoolApi = createApi({
  reducerPath: "schoolApi",
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
    // New query to get the school logo name
    getSchoolLogoName: builder.query({
      query: () => "/api/v1/school-logo/name-logo",
    }),

    uploadSchoolLogo: builder.mutation({
      query: logoFile => {
        const formData = new FormData();
        formData.append("logo", logoFile);

        return {
          url: "/api/v1/school-logo",
          method: "PUT",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetSchoolLogoNameQuery, // Export the new query hook
  useUploadSchoolLogoMutation, // Export the new mutation hook
} = schoolApi;
