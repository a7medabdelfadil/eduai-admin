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

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: headers => {
      const token = getTokenFromCookie();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(`Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: builder => ({
    getAllPosts: builder.query({
      query: () => "/api/v1/management/post/all?size=1000000&page=0",
    }),
    //
    getAllComments: builder.query({
      query: id => `/api/v1/post/${id}/comment/all?size=10&page=0`,
    }),
    //
    getAllAllPosts: builder.query({
      query: () => "/api/v1/post/all?size=1000000&page=0",
    }),
    //
    deletePosts: builder.mutation({
      query: id => ({
        url: `/api/v1/management/post/${id}`,
        method: "DELETE",
      }),
    }),
    //
    createPosts: builder.mutation({
      query: formData => ({
        url: `/api/v1/management/post`,
        method: "POST",
        body: formData,
      }),
    }),
    //
    getPostById: builder.query({
      query: id => `/api/v1/management/post/${id}`,
    }),
    //
    updatePosts: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/post/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    //
    updatePostsFiles: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/v1/management/post/${id}/files`,
        method: "PUT",
        body: formData,
      }),
    }),
    //
    putPostLike: builder.mutation({
      query: ({ like, id }) => ({
        url: `/api/v1/post/${id}/like?liked=${like}`,
        method: "PUT",
      }),
    }),
    //
    createComment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/post/${id}/comment`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useDeletePostsMutation,
  useCreatePostsMutation,
  useGetPostByIdQuery,
  useUpdatePostsMutation,
  useUpdatePostsFilesMutation,
  useGetAllAllPostsQuery,
  usePutPostLikeMutation,
  useCreateCommentMutation,
  useGetAllCommentsQuery,
} = postApi;
