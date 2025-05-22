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

export const otherOfficialDocumentsApi = createApi({
  reducerPath: "otherOfficialDocumentsApi",
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
    getIdCards: builder.query({
      query: (role: string) => `/api/v1/shared/user/id-cards?role=${role}`,
      transformResponse: (response: any) => response.data.content,
    }),


    getStudentsWithMedicalStatus: builder.query({
      query: () => "/api/v1/student/medical-record/students-with-status",
      transformResponse: (response: any) => response.data.content,
    }),
    createMedicalRecord: builder.mutation({
      query: (formValues: {
        file: File;
        studentId: string;
        title: string;
        result: string;
        note: string;
      }) => {
        const formData = new FormData();
        formData.append("file", formValues.file);
        formData.append("student-id", formValues.studentId);
        formData.append("title", formValues.title);
        formData.append("result", formValues.result);
        formData.append("note", formValues.note);

        return {
          url: "/api/v1/student/medical-record/new",
          method: "POST",
          body: formData,
        };
      },
    }),
    getFolderContents: builder.query({
      query: (folderId?: string) => {
        const url = folderId
          ? `/api/v1/files/folder-contents?folder-id=${folderId}`
          : "/api/v1/files/folder-contents";

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => response.data,
    }),
    deleteFile: builder.mutation({
      query: (fileId: string) => ({
        url: `/api/v1/files/delete-file/${fileId}`,
        method: "DELETE",
      }),
    }),
    deleteFolder: builder.mutation({
      query: (folderId: string) => ({
        url: `/api/v1/files/delete-folder/${folderId}`,
        method: "DELETE",
      }),
    }),

    createFolder: builder.mutation({
      query: (formValues: { name: string; parentFolderId?: string }) => {
        const formData = new FormData();
        formData.append("name", formValues.name);
        if (formValues.parentFolderId) {
          formData.append("parent-folder-id", formValues.parentFolderId);
        }

        return {
          url: "/api/v1/files/new-folder",
          method: "POST",
          body: formData,
        };
      },
    }),
    uploadFile: builder.mutation({
      query: (formValues: { file: File; folderId?: string }) => {
        const formData = new FormData();
        formData.append("file", formValues.file);
        if (formValues.folderId) {
          formData.append("folder-id", formValues.folderId);
        }

        return {
          url: "/api/v1/files/upload-file",
          method: "POST",
          body: formData,
        };
      },
    }),
    updateFolderName: builder.mutation({
      query: ({ folderId, newName }) => {
        const formData = new FormData();
        formData.append("name", newName);
        return {
          url: `/api/v1/files/update-folder-name/${folderId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),

  }),
});

export const {
  useGetIdCardsQuery,
  useGetStudentsWithMedicalStatusQuery,
  useCreateMedicalRecordMutation,
  useGetFolderContentsQuery,
  useDeleteFileMutation,
  useCreateFolderMutation,
  useUploadFileMutation,
  useDeleteFolderMutation,
  useUpdateFolderNameMutation,
} = otherOfficialDocumentsApi;
