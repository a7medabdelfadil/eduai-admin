/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import {
  useGetAllAllPostsQuery,
  useDeletePostsMutation,
  usePutPostLikeMutation,
  useCreateCommentMutation,
  useGetAllCommentsQuery,
} from "@/features/communication/postApi";
import Link from "next/link";
import {
  useState,
  useEffect,
  SetStateAction,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { FaThumbsUp } from "react-icons/fa";
import BreadCrumbs from "@/components/BreadCrumbs";
import { FaComment } from "react-icons/fa";

const News = () => {
  const breadcrumbs = [
    {
      nameEn: "Communication",
      nameAr: "التواصل",
      nameFr: "Communication",
      href: "/",
    },
    {
      nameEn: "Post Management",
      nameAr: "إدارة المشاركات",
      nameFr: "Gestion des publications",
      href: "/post-management",
    },
    {
      nameEn: "News",
      nameAr: "الأخبار",
      nameFr: "Actualités",
      href: "/post-management/news",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  type Post = Record<string, any>;
  const { data, error, isLoading, refetch } = useGetAllAllPostsQuery(null);
  const [deletePosts] = useDeletePostsMutation();
  const [putLike] = usePutPostLikeMutation();

  const [selectedId, setSelectedId] = useState(null);
  const {
    data: Comments,
    isLoading: isComment,
    refetch: refetchComment,
  } = useGetAllCommentsQuery(selectedId, {
    skip: !selectedId,
  });
  const handleClick = (id: SetStateAction<null>) => {
    setSelectedId(id);
  };

  const [open, setOpen] = useState<number | boolean | null>(false);
  const toggleNavbar = (index: number) => {
    setOpen(open === index ? null : index);
  };
  const [open2, setOpen2] = useState<number | boolean | null>(false);
  const toggleNavbar2 = (index: number) => {
    setOpen2(open2 === index ? null : index);
  };
  const [open3, setOpen3] = useState<number | boolean | null>(false);
  const toggleNavbar3 = (index: number) => {
    setOpen3(open3 === index ? null : index);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [createSemester, { isLoading: isCreating }] =
    useCreateCommentMutation();

  const onSubmit = (id: string) => async (data: any) => {
    try {
      await createSemester({ formData: data, id: id }).unwrap();
      refetchComment();
      reset();
      toast.success("Comment Added successfully");
    } catch (err) {
      toast.error("Failed to create Comment");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePosts(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error("Can not Delete post");
    }
  };
  const PutLike = async (id: string) => {
    try {
      await putLike({
        id: id,
        like: "true",
      }).unwrap();
      void refetch();
    } catch (err) {

    }
  };
  const DeleteLike = async (id: string) => {
    try {
      await putLike({
        id: id,
        like: "false",
      }).unwrap();
      void refetch();
    } catch (err) {

    }
  };

  const formatTransactionDate = (dateString: string | number | Date) => {
    if (!dateString) return "No transaction date";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mt-[40px]`}
      >
        <div className="grid h-full w-full items-center justify-center gap-4 rounded-xl bg-bgSecondary p-9 max-[505px]:p-2">
          {data?.data.content.map((post: Post, index: number) => (
            <div
              key={post.id}
              className="grid w-[800px] rounded-xl border border-borderPrimary bg-bgPrimary p-4 max-[1190px]:w-[600px] max-[710px]:w-[400px] max-[450px]:w-[350px]"
            >
              <div className="flex w-full justify-between gap-8">
                <div className="flex items-center gap-1">
                  {post.isPublisherPictureExists ? (
                    <img
                      src={post.publisherPicture}
                      className="mx-2 h-[40px] w-[40px] rounded-full"
                      alt="user"
                    />
                  ) : (
                    <img
                      src="/images/userr.png"
                      className="mx-2 h-[40px] w-[40px] rounded-full"
                      alt="user"
                    />
                  )}
                  <div className="grid text-nowrap text-[14px] font-semibold">
                    <p className="text-blackOrWhite">{post.publisherName}</p>
                    <p className="text-textSecondary">
                      {formatTransactionDate(post.creationDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {open === index ? (
                    <div className="flex h-[35px] items-center gap-2 rounded-full bg-bgPrimary px-1.5 py-1">
                      <button onClick={() => handleDelete(post.id)}>
                        <svg
                          className="h-6 w-6 text-error"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <Link href={`/post-management/${post.id}`}>
                        <svg
                          className="h-6 w-6 text-blue-500"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                          <line x1="16" y1="5" x2="19" y2="8" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="invisible flex h-[35px] w-[100px] gap-2 rounded-full bg-bgPrimary px-3 py-0.5">
                      <button>
                        <svg
                          className="h-6 w-6 text-error"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button>
                        <svg
                          className="h-6 w-6 text-blue-500"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                          <line x1="16" y1="5" x2="19" y2="8" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button onClick={() => toggleNavbar(index)}>
                    <svg
                      className="mt-1.5 h-6 w-6 text-gray-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <circle cx="12" cy="12" r="1" />{" "}
                      <circle cx="12" cy="19" r="1" />{" "}
                      <circle cx="12" cy="5" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-2 mt-2 text-wrap font-semibold max-[450px]:text-[15px]">
                <p>{post.content}</p>
              </div>
              <div className="mt-2 flex justify-center">
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {post.attachments.map((img: any, index: number) => (
                    <img
                      className="w-[300px] rounded-md max-[450px]:w-[250px]"
                      src={img.viewLink}
                      alt="#"
                      key={index}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-3 mt-2 flex items-center justify-between font-semibold">
                <div className="flex items-center">
                  {currentLanguage ? (
                    <>
                      <p className="text-textSecondary">{post.likesCount}</p>
                      <FaThumbsUp
                        size={20}
                        className="mx-[10px] text-primary"
                      />
                    </>
                  ) : (
                    <>
                      <FaThumbsUp
                        size={20}
                        className="mx-[10px] text-primary"
                      />
                      <p className="text-textSecondary">{post.likesCount}</p>
                    </>
                  )}
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => {
                      handleClick(post.id);
                      toggleNavbar3(index);
                    }}
                    className="primary:border-b border-spacing-2 text-textSecondary"
                  >
                    {currentLanguage === "ar"
                      ? "تعليقات"
                      : currentLanguage === "fr"
                        ? "Commentaires"
                        : "Comments"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-10 border-y border-borderPrimary px-2 py-3 font-semibold text-textSecondary max-[505px]:gap-8">
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      !post.isLiked ? PutLike(post.id) : DeleteLike(post.id)
                    }
                    className="flex gap-2"
                  >
                    {post.isLiked ? (
                      <FaThumbsUp
                        size={20}
                        className="mx-[10px] text-primary"
                      />
                    ) : (
                      <FaThumbsUp size={20} className="mx-[10px]" />
                    )}
                    {currentLanguage === "ar"
                      ? "إعجاب"
                      : currentLanguage === "fr"
                        ? "J'aime"
                        : "Like"}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleNavbar2(index)}
                    className="flex gap-2"
                  >
                    <FaComment
                      size={20}
                      className="mt-[2px] text-textSecondary"
                    />
                    {currentLanguage === "ar"
                      ? "تعليق"
                      : currentLanguage === "fr"
                        ? "Commentaire"
                        : "Comment"}
                  </button>
                </div>
              </div>
              {open2 === index && (
                <div className="mt-4 flex w-full items-center gap-3">
                  <form
                    onSubmit={handleSubmit(onSubmit(post.id))}
                    className="mt-4 flex w-full items-center gap-3"
                  >
                    <input
                      placeholder="Write Comment"
                      type="text"
                      className={`w-full rounded-md border px-3 py-2 font-semibold outline-none ${errors.comment ? "border-error" : "border-borderPrimary"} `}
                      {...register("comment", { required: true })}
                    />
                    {isCreating ? (
                      <Spinner />
                    ) : (
                      <button
                        type="submit"
                        className="primary:bg-primary primary:shadow-xl rounded-lg bg-primary px-3 py-1.5 duration-300 ease-in"
                      >
                        <svg
                          className="h-7 w-7 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                      </button>
                    )}
                  </form>
                </div>
              )}
              {open3 === index && (
                <div className="mt-4 flex w-full items-center gap-3">
                  {isComment ? (
                    <Spinner />
                  ) : (
                    <div className="grid h-full w-full overflow-y-auto">
                      {Comments.data.content.map(
                        (
                          comment: {
                            creatorName: ReactNode;
                            comment:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  any,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | null
                              | undefined;
                          },
                          index: number,
                        ) => (
                          <div key={index} className="flex items-center gap-2">
                            <h1 className="font-semibold text-gray-400">
                              {comment.creatorName}:
                            </h1>
                            <p className="font-semibold">
                              {String(comment.comment)}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default News;
