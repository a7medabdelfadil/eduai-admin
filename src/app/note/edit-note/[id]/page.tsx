"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import TextEditor from "@/components/textEditor";
import {
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
} from "@/features/dashboard/dashboardApi";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useParams, useRouter } from "next/navigation";

const EditNote = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const noteId = Array.isArray(id) ? id[0] : id;
  const { data, isLoading: isFetching } = useGetNoteByIdQuery(noteId);
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى ملء كل الحقول"
          : currentLanguage === "fr"
            ? "Veuillez remplir tous les champs"
            : "Please fill in all fields."
      );
      return;
    }

    try {
      await updateNote({ id, title, description }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم تحديث الإعلان بنجاح"
          : currentLanguage === "fr"
            ? "Annonce mise à jour avec succès"
            : "Notice updated successfully!"
      );
      router.push("/");
    } catch (err) {
      toast.error(
        (err as any)?.data?.message
          ? (currentLanguage === "ar"
              ? `حدث خطأ: ${(err as any).data.message}`
              : currentLanguage === "fr"
                ? `Erreur: ${(err as any).data.message}`
                : `Error: ${(err as any).data.message}`)
          : (currentLanguage === "ar"
              ? "حدث خطأ غير متوقع"
              : currentLanguage === "fr"
                ? "Une erreur inattendue s'est produite"
                : "An unexpected error occurred")
      );
    }
  };

  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة التحكم",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Edit Note",
      nameAr: "تعديل ملاحظة",
      nameFr: "Modifier une note",
      href: `/note/edit-note/${noteId}`,
    },
  ];

  if (loading || isFetching)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Container>
        <h1 className="text-3xl font-semibold">
          {currentLanguage === "ar"
            ? "لوحة الإعلانات"
            : currentLanguage === "fr"
              ? "Tableau d'affichage"
              : "Notice Board"}
        </h1>
        <div className="mb-10">
          <div className="mx-6 my-6 grid h-full w-[90%] items-center gap-3 rounded-xl bg-bgPrimary p-6 md:mx-auto md:w-[80%]">
            <h1 className="text-2xl font-semibold">
              {currentLanguage === "ar"
                ? "تعديل إعلان"
                : currentLanguage === "fr"
                  ? "Modifier une annonce"
                  : "Edit Notice"}
            </h1>
            <form
              className="flex h-full w-full items-center justify-center px-6"
              onSubmit={handleSubmit}
            >
              <div className="grid h-full w-full gap-6">
                <label
                  className="grid gap-2 text-[18px] font-semibold"
                  htmlFor="title"
                >
                  Title
                  <input
                    maxLength={55}
                    className="mx-4 rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 pb-2 outline-none"
                    placeholder={
                      currentLanguage === "en"
                        ? "Write title...."
                        : currentLanguage === "ar"
                          ? "اكتب العنوان...."
                          : "Écrire le titre...."
                    }
                    name="title"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </label>
                <label
                  className="grid gap-2 text-[18px] font-semibold"
                  htmlFor="description"
                >
                  Description
                  <div className="mb-5 bg-bgPrimary">
                    <TextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder={
                        currentLanguage === "en"
                          ? "Enter your content here..."
                          : currentLanguage === "ar"
                            ? "أدخل محتواك هنا..."
                            : "Entrez votre contenu ici..."
                      }
                    />
                  </div>
                </label>
                <div>
                  {isUpdating ? (
                    <Spinner />
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <button
                        type="submit"
                        className="mx-3 flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-4 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      >
                        {currentLanguage === "ar"
                          ? "تحديث الإعلان"
                          : currentLanguage === "fr"
                            ? "Mettre à jour l'annonce"
                            : "Update Notice"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EditNote;
