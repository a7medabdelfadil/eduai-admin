/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useDeletePostsMutation,
  useGetAllPostsQuery,
} from "@/features/communication/postApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { toast } from "react-toastify";
import Container from "@/components/Container";
import { Text } from "@/components/Text";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import {
  BiEditAlt,
  BiTrash,
  BiShowAlt,
  BiDownload,
  BiSearchAlt,
} from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

const PostManagment = () => {
  const breadcrumbs = [
    {
      nameEn: "Communication",
      nameAr: "التواصل",
      nameFr: "Communication",
      href: "/",
    },
    {
      nameEn: "Post Management",
      nameAr: "إدارة المنشورات",
      nameFr: "Gestion des publications",
      href: "/post-management",
    },
  ];

  const [search, setSearch] = useState("");
  type Post = Record<string, any>;
  const { data, error, isLoading, refetch } = useGetAllPostsQuery(null);
  const [filteredCount, setFilteredCount] = useState(0);
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  useEffect(() => {
    if (!data?.data.content) return;

    const filtered = data.data.content.filter((post: Post) => {
      return search.toLocaleLowerCase() === ""
        ? post
        : post.title_en.toLocaleLowerCase().includes(search);
    });

    setFilteredData(filtered);
    setFilteredCount(filtered.length);
  }, [search, data?.data.content]);

  const [deletePosts] = useDeletePostsMutation();
  const handleDelete = async (id: string) => {
    try {
      await deletePosts(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    title:
      currentLanguage === "ar"
        ? "العنوان"
        : currentLanguage === "fr"
          ? "Titre"
          : "Title",
    id:
      currentLanguage === "ar"
        ? "المعرف"
        : currentLanguage === "fr"
          ? "Identifiant"
          : "ID",
    content:
      currentLanguage === "ar"
        ? "المحتوى"
        : currentLanguage === "fr"
          ? "Contenu"
          : "Content",
    attachment:
      currentLanguage === "ar"
        ? "مرفق"
        : currentLanguage === "fr"
          ? "Pièce jointe"
          : "Attachment",
    edit:
      currentLanguage === "ar"
        ? "تعديل"
        : currentLanguage === "fr"
          ? "Modifier"
          : "Edit",
    del:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
          : "Delete",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "بحث"
        : currentLanguage === "fr"
          ? "Rechercher"
          : "Search",

    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount) || [];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <Text font="bold" size="3xl">
          {currentLanguage === "ar"
            ? "إدارة المنشورات"
            : currentLanguage === "fr"
              ? "Gestion des publications"
              : "Post Management"}
        </Text>
        <div className="justify-left my-6 ml-4 flex gap-5 text-xl font-medium text-secondary">
          <Link href="/post-management" className="text-blue-500 underline">
            {currentLanguage === "ar"
              ? "منشورات"
              : currentLanguage === "fr"
                ? "Publications"
                : "Posts"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/post-management/reviews"
          >
            {currentLanguage === "ar"
              ? "التقييمات"
              : currentLanguage === "fr"
                ? "Avis"
                : "Reviews"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/post-management/news"
          >
            {currentLanguage === "ar"
              ? "الأخبار"
              : currentLanguage === "fr"
                ? "Actualités"
                : "News"}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
            {/* Search Input */}
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="relative w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/post-management/add-new-post"
              className="mx-3 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة منشور جديد"
                : currentLanguage === "fr"
                  ? "+ Ajouter une nouvelle publication"
                  : "+ Add new Post"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.title}</TableHead>
                  <TableHead>{translate.id}</TableHead>
                  <TableHead>{translate.content}</TableHead>
                  <TableHead>{translate.attachment}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((post: Post, index: number) => (
                    <TableRow key={post.id} data-index={index}>
                      <TableCell>{post.title_en}</TableCell>
                      <TableCell>{post.id}</TableCell>
                      <TableCell>{post.content_en}</TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-3">
                          {post.attachments.map(
                            (attachment: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <a
                                  href={attachment.viewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary transition hover:text-hover"
                                  title="View"
                                >
                                  <BiShowAlt size={20} />
                                </a>
                                <a
                                  href={attachment.downloadLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary transition hover:text-hover"
                                  title="Download"
                                >
                                  <FiDownload size={20} />
                                </a>
                              </div>
                            ),
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/post-management/${post.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-error transition hover:text-red-800"
                          title={translate.del}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < filteredData?.length && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 20)}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default PostManagment;
