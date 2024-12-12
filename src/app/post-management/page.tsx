/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import { useDeletePostsMutation, useGetAllPostsQuery } from "@/features/communication/postApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { toast } from "react-toastify";

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

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [search, setSearch] = useState("");
  type Post = Record<string, any>;
  const { data, error, isLoading, refetch } = useGetAllPostsQuery(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (data) console.log("Response Data:", data);
    if (error) console.log("Error:", error);
  }, [data, error]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll;
    });
  };
  const [deletePosts] = useDeletePostsMutation();
  const handleDelete = async (id: string) => {
    try {
      await deletePosts(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error("Can not Delete post");
    }
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)',
      );
      const allChecked = Array.from(allCheckboxes).every(
        checkbox => checkbox.checked,
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search",
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    otherCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);
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
        } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        {/* <div className="justify-left mb-[80px] ml-4 mt-[20px] flex gap-5 text-[23px] font-semibold">
          <Link href="/post-management" className="text-blue-500 underline">
            {currentLanguage === "ar"
              ? "منشور"
              : currentLanguage === "fr"
                ? "Publication"
                : "Post"}
          </Link>
          <Link href="/post-management/reviews">
            {currentLanguage === "ar"
              ? "التقييمات"
              : currentLanguage === "fr"
                ? "Avis"
                : "Reviews"}
          </Link>
        </div> */}
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/post-management/add-new-post"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة منشور جديد"
                : currentLanguage === "fr"
                  ? "+ Ajouter une nouvelle publication"
                  : "+ Add new Post"}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border border-borderPrimary bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "العنوان"
                    : currentLanguage === "fr"
                      ? "Titre"
                      : "Title"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "المعرف"
                    : currentLanguage === "fr"
                      ? "Identifiant"
                      : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "المحتوى"
                    : currentLanguage === "fr"
                      ? "Contenu"
                      : "Content"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الصورة"
                    : currentLanguage === "fr"
                      ? "Image"
                      : "Image"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                    ? "تحرير"
                    : currentLanguage === "fr"
                      ? "Modifier"
                      : "Edit"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الإجراء"
                    : currentLanguage === "fr"
                      ? "Action"
                      : "Action"}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data.content
                .filter((post: Post) => {
                  return search.toLocaleLowerCase() === ""
                    ? post
                    : post.title_en.toLocaleLowerCase().includes(search);
                })
                .map((post: Post) => (
                  <tr
                    key={post.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <th scope="row" className="whitespace-nowrap px-6 py-4">
                      <p> {post.title_en} </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">{post.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {post.content_en}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        {post.attachments.map((img: any, index: number) => (
                          <img
                            className="w-[200px] rounded-md"
                            src={img.viewLink}
                            alt="#"
                            key={index}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/post-management/${post.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "تعديل"
                          : currentLanguage === "fr"
                            ? "Modifier"
                            : "Edit"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button onClick={() => handleDelete(post.id)} className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                        {currentLanguage === "ar"
                          ? "حذف"
                          : currentLanguage === "fr"
                            ? "Supprimer"
                            : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(data?.data.content.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              There is No Data
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostManagment;
