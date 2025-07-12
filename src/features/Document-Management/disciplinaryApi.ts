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
export const disciplinaryApi = createApi({
  reducerPath: "disciplinaryApi",
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
    getAllDisciplinaryRecords: builder.query({
      query: () => `/api/v1/disciplinary-Record/all/disciplinary-record`,
    }),
    getViolationTypes: builder.query({
      query: () => `/api/v1/public/enumeration/violation-type`,
    }),
    getActionsTaken: builder.query({
      query: () => `/api/v1/public/enumeration/actions-taken`,
    }),
    createDisciplinaryRecord: builder.mutation({
      query: formData => ({
        url: `/api/v1/disciplinary-Record/new`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => response.data,
    }),
    deleteDisciplinaryRecord: builder.mutation({
      query: (id: string | number) => ({
        url: `/api/v1/disciplinary-Record/${id}`,
        method: "DELETE",
      }),
    }),
    getDisciplinaryRecordById: builder.query({
      query: (id: string | number) => `/api/v1/disciplinary-Record/${id}`,
    }),

    updateDisciplinaryRecord: builder.mutation({
      query: ({ id, data }: { id: string | number; data: any }) => ({
        url: `/api/v1/disciplinary-Record/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

  }),
});

export const {
  useGetAllDisciplinaryRecordsQuery,
  useGetViolationTypesQuery,
  useGetActionsTakenQuery,
  useCreateDisciplinaryRecordMutation,
  useDeleteDisciplinaryRecordMutation,
  useGetDisciplinaryRecordByIdQuery,
  useUpdateDisciplinaryRecordMutation,

} = disciplinaryApi;
