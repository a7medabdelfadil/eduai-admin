"use client";
import { useState } from "react";
import Spinner from "@/components/spinner";
import TextEditor from "@/components/textEditor";
import { useCreateNoteMutation } from "@/features/dashboard/dashboardApi";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createNotification, { isLoading }] = useCreateNoteMutation();
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill in all fields and select at least one role.");
      return;
    }
    try {
      // Send the title and description as an object
      await createNotification({
        title,
        description,
      }).unwrap();

      toast.success("Notification sent successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to send notification. Please try again.");
    }
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة التحكم",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Add Note",
      nameAr: "إضافة ملاحظة",
      nameFr: "Ajouter une note",
      href: "/add-note",
    },
  ];

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
        <h1 className="text-3xl font-semibold">
          {currentLanguage === "ar"
            ? "لوحة الإعلانات"
            : currentLanguage === "fr"
              ? "Tableau d'affichage"
              : "Notice Board"}
        </h1>
        <div className="mb-10">

          <div className="mx-6 md:mx-auto my-6 grid h-full w-[90] md:w-[80%] items-center gap-3 rounded-xl bg-bgPrimary p-6">
            <h1 className="text-2xl font-semibold">
              {currentLanguage === "ar"
                ? "إضافة إعلان"
                : currentLanguage === "fr"
                  ? "Ajouter une annonce"
                  : "Add Notice"}
            </h1>
            <form className="px-6 flex justify-center items-center w-full h-full" onSubmit={handleSubmit}>
              <div className="grid h-full w-full gap-6">
                <label
                  className="grid gap-2 text-[18px] font-semibold"
                  htmlFor="title"
                >
                  Title
                  <input
                    className="mx-4 rounded-xl bg-bgPrimary border border-borderPrimary px-4 py-2 pb-28 outline-none"
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
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <button
                        type="submit"
                        className="mx-3 flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary py-4 px-6 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                      >
                        {currentLanguage === "ar"
                          ? "إضافة إعلان"
                          : currentLanguage === "fr"
                            ? "Ajouter une annonce"
                            : "Add Notice"}
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

export default AddNote;
