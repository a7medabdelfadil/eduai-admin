"use client";
import { useCreatePostsMutation } from "@/features/communication/postApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineSave } from "react-icons/ai"; // Save Icon
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useState } from "react";
import Container from "@/components/Container";
import { Text } from "@/components/Text";
import { useRouter } from "next/navigation";

const AddNewPost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      nameEn: "Add Post",
      nameAr: "إضافة منشور",
      nameFr: "Ajouter un post",
      href: "/post-management/add-new-post",
    },
  ];
const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createPost, { isLoading }] = useCreatePostsMutation();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  const onSubmit = async (data: any) => {
    // Create FormData object
    const formData = new FormData();

    // Append JSON stringified post data
    const postData = {
      title_en: data.title_en,
      title_fr: data.title_fr,
      title_ar: data.title_ar,
      content_en: data.content_en,
      content_fr: data.content_fr,
      content_ar: data.content_ar,
    };
    formData.append("post", JSON.stringify(postData));

    // Append file data
    if (data.files && data.files[0]) {
      formData.append("files", data.files[0]);
    }

    try {
      await createPost(formData).unwrap();
      toast.success("Create post Success");
      router.push("/post-management");
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <Text font="bold" size="3xl">
          {currentLanguage === "ar"
            ? "إضافة منشور"
            : currentLanguage === "fr"
              ? "Ajouter un post"
              : "Add Post"}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 rounded-xl bg-bgSecondary p-10">
            <div className="rounded-xl border border-borderPrimary bg-bgPrimary p-10">
              <div className="mb-10 flex w-full items-center justify-between text-[18px] font-semibold">
                <h1 className="text-[20px]">
                  {currentLanguage === "ar"
                    ? "العنوان"
                    : currentLanguage === "fr"
                      ? "Titre"
                      : "Title"}
                </h1>
                <button className="flex gap-2" type="submit">
                  <AiOutlineSave size={25} />
                  {isLoading
                    ? currentLanguage === "ar"
                      ? "جاري الحفظ..."
                      : currentLanguage === "fr"
                        ? "Enregistrement..."
                        : "Saving..."
                    : currentLanguage === "ar"
                      ? "حفظ"
                      : currentLanguage === "fr"
                        ? "Enregistrer"
                        : "Save"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold max-[614px]:grid-cols-1">
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "العنوان (بالإنجليزية)"
                    : currentLanguage === "fr"
                      ? "Titre (Anglais)"
                      : "Title (English)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب العنوان"
                        : currentLanguage === "fr"
                          ? "Écrire le titre"
                          : "Write Title"
                    }
                    {...register("title_en", {
                      required:
                        currentLanguage === "ar"
                          ? "العنوان بالإنجليزية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le titre en anglais est requis"
                            : "Title in English is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.title_en && (
                    <span className="text-red-500">
                      {errors.title_en.message?.toString()}
                    </span>
                  )}
                </label>
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "العنوان (بالفرنسية)"
                    : currentLanguage === "fr"
                      ? "Titre (français)"
                      : "Title (français)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب العنوان"
                        : currentLanguage === "fr"
                          ? "Écrire le titre"
                          : "Write Title"
                    }
                    {...register("title_fr", {
                      required:
                        currentLanguage === "ar"
                          ? "العنوان بالفرنسية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le titre en français est requis"
                            : "Title in French is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.title_fr && (
                    <span className="text-red-500">
                      {errors.title_fr.message?.toString()}
                    </span>
                  )}
                </label>
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "العنوان (بالعربية)"
                    : currentLanguage === "fr"
                      ? "Titre (arabe)"
                      : "Title (Arabic)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب العنوان"
                        : currentLanguage === "fr"
                          ? "Écrire le titre"
                          : "Write Title"
                    }
                    {...register("title_ar", {
                      required:
                        currentLanguage === "ar"
                          ? "العنوان بالعربية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le titre en arabe est requis"
                            : "Title in Arabic is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.title_ar && (
                    <span className="text-red-500">
                      {errors.title_ar.message?.toString()}
                    </span>
                  )}
                </label>
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "المحتوى (بالإنجليزية)"
                    : currentLanguage === "fr"
                      ? "Contenu (Anglais)"
                      : "Content (English)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب المحتوى"
                        : currentLanguage === "fr"
                          ? "Écrire le contenu"
                          : "Write Content"
                    }
                    {...register("content_en", {
                      required:
                        currentLanguage === "ar"
                          ? "المحتوى بالإنجليزية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le contenu en anglais est requis"
                            : "Content in English is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.content_en && (
                    <span className="text-red-500">
                      {errors.content_en.message?.toString()}
                    </span>
                  )}
                </label>
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "المحتوى (بالفرنسية)"
                    : currentLanguage === "fr"
                      ? "Contenu (français)"
                      : "Content (français)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب المحتوى"
                        : currentLanguage === "fr"
                          ? "Écrire le contenu"
                          : "Write Content"
                    }
                    {...register("content_fr", {
                      required:
                        currentLanguage === "ar"
                          ? "المحتوى بالفرنسية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le contenu en français est requis"
                            : "Content in French is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.content_fr && (
                    <span className="text-red-500">
                      {errors.content_fr.message?.toString()}
                    </span>
                  )}
                </label>
                <label className="grid">
                  {currentLanguage === "ar"
                    ? "المحتوى (بالعربية)"
                    : currentLanguage === "fr"
                      ? "Contenu (arabe)"
                      : "Content (Arabic)"}
                  <input
                    type="text"
                    placeholder={
                      currentLanguage === "ar"
                        ? "اكتب المحتوى"
                        : currentLanguage === "fr"
                          ? "Écrire le contenu"
                          : "Write Content"
                    }
                    {...register("content_ar", {
                      required:
                        currentLanguage === "ar"
                          ? "المحتوى بالعربية مطلوب"
                          : currentLanguage === "fr"
                            ? "Le contenu en arabe est requis"
                            : "Content in Arabic is required",
                    })}
                    className="bg-bgPrimary h-[60px] rounded-lg border border-borderPrimary px-3 py-2 outline-none"
                  />
                  {errors.content_ar && (
                    <span className="text-red-500">
                      {errors.content_ar.message?.toString()}
                    </span>
                  )}
                </label>
              </div>
            </div>
            <div className="rounded-xl border border-borderPrimary bg-bgPrimary p-10">
              <div className="mb-10 flex w-full items-center justify-between text-[18px] font-semibold">
                <h1 className="text-[20px]">
                  {currentLanguage === "ar"
                    ? "الصور أو مقاطع الفيديو"
                    : currentLanguage === "fr"
                      ? "Images ou vidéos"
                      : "Images or Videos"}
                </h1>
              </div>
              <div className="flex flex-col gap-4 font-semibold">
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-borderPrimary bg-bgPrimary hover:bg-bgPrimary"
                  >
                    {imagePreview ? (
                      <div className="h-full w-full p-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <svg
                          className="mb-4 h-8 w-8 text-textSecondary"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-textSecondary">
                          {currentLanguage === "ar"
                            ? "انقر للرفع أو اسحب وأفلت"
                            : currentLanguage === "fr"
                              ? "Cliquez pour télécharger ou glissez-déposez"
                              : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-textSecondary">
                          {currentLanguage === "ar"
                            ? "SVG، PNG، JPG أو GIF (الحد الأقصى. 800x400 بكسل)"
                            : currentLanguage === "fr"
                              ? "SVG, PNG, JPG ou GIF (MAX. 800x400px)"
                              : "SVG, PNG, JPG or GIF (MAX. 800x400px)"}
                        </p>
                      </div>
                    )}
                    <input
                      {...register("files")}
                      id="dropzone-file"
                      type="file"
                      className="opacity-0"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="w-full rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    {currentLanguage === "ar"
                      ? "إزالة الصورة"
                      : currentLanguage === "fr"
                        ? "Supprimer l'image"
                        : "Remove Image"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddNewPost;
