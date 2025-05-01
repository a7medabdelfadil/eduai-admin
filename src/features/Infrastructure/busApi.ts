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


export type Region = {
  id: number;
  name: string;
};

export type MyRegion = {
  id: number;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  zipCode?: string | null;
};

export type SubscriptionInfo = {
  semesterId: number;
  regionId: number;
  regionName: string;
  cityName: string;
  cost: number;
  about: string;
  currency: string;
  semesterStart: string;
  semesterEnd: string;
};

type BusSubscriptionRequest = {
  regionId: number;
  notes?: string;
  homeLocation: {
    latitude: number;
    longitude: number;
  };
};

export type BusInfo = {
  driverName: string;
  busNumber: string;
  speed: number;
  phoneNumber: {
    countryCode: number;
    nationalNumber: string;
  };
};


export const busApi = createApi({
  reducerPath: "busApi",
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
    getAllBuss: builder.query({
      query: archive =>
        `/api/v1/bus/all?size=1000000&page=0&getActive=${archive}`,
    }),
    //
    deleteBuss: builder.mutation({
      query: id => ({
        url: `/api/v1/bus/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createBuss: builder.mutation({
      query: formData => ({
        url: `/api/v1/bus`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getBusById: builder.query({
      query: id => `/api/v1/bus/${id}`,
    }),
    //
    updateBuss: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/bus/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    getAllRegions: builder.query<Region[], void>({
      query: () => '/api/v1/location/public/region',
    }),

    getMyRegion: builder.query<MyRegion, void>({
      query: () => '/api/v1/user/my-region',
    }),

    getBusSubscriptionInfo: builder.query<SubscriptionInfo, number>({
      query: (regionId) => `/api/v1/bus-subscription/fees-and-period/${regionId}`,
    }),

    getStudentBusId: builder.query<string, string>({
      query: (studentId) => `/api/v1/bus/student/${studentId}/bus`,
      transformResponse: (response: { data: number }) => response.data.toString(),
    }),

    subscribeStudentToBus: builder.mutation<void, BusSubscriptionRequest>({
      query: (body) => ({
        url: '/api/v1/bus-subscription/teacher',
        method: 'POST',
        body,
      }),
    }),

    getBusInfo: builder.query<BusInfo, number>({
      query: (busId) => ({
        url: `/api/v1/bus/bus-info`,
        params: { busId },
      }),
    }),
  }),
});

export const {
  useGetAllBussQuery,
  useDeleteBussMutation,
  useCreateBussMutation,
  useGetBusByIdQuery,
  useUpdateBussMutation,
  useGetAllRegionsQuery,
  useGetMyRegionQuery,
  useGetBusSubscriptionInfoQuery,
  useGetStudentBusIdQuery,
  useSubscribeStudentToBusMutation,
  useGetBusInfoQuery, 
  
} = busApi;
