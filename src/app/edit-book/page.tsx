"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const EditBook = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Library",
      nameAr: "المكتبة",
      nameFr: "Bibliothèque",
      href: "/book",
    },
    {
      nameEn: "Edit book",
      nameAr: "تعديل الكتاب",
      nameFr: "Modifier le livre",
      href: "/edit-book",
    },
  ];

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
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit book"
              : currentLanguage === "ar"
                ? "تعديل الكتاب"
                : currentLanguage === "fr"
                  ? "Modifier le livre"
                  : "Edit book"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center">
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
              <svg
                className="h-6 w-6 font-bold text-secondary group-hover:text-hover"
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
                <line x1="3" y1="21" x2="21" y2="21" />{" "}
                <line x1="3" y1="10" x2="21" y2="10" />{" "}
                <polyline points="5 6 12 3 19 6" />{" "}
                <line x1="4" y1="10" x2="4" y2="21" />{" "}
                <line x1="20" y1="10" x2="20" y2="21" />{" "}
                <line x1="8" y1="14" x2="8" y2="17" />{" "}
                <line x1="12" y1="14" x2="12" y2="17" />{" "}
                <line x1="16" y1="14" x2="16" y2="17" />
              </svg>
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "معلومات الكتاب"
                  : currentLanguage === "fr"
                    ? "Informations sur le livre"
                    : "Book Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "رقم الكتاب"
                  : currentLanguage === "fr"
                    ? "Numéro du livre"
                    : "Book Number"}
                <input
                  id="name"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "اسم الكتاب"
                  : currentLanguage === "fr"
                    ? "Nom du livre"
                    : "Book Name"}

                <input
                  id="code"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الكاتب"
                  : currentLanguage === "fr"
                    ? "Auteur"
                    : "Writer"}
                <input
                  id="about"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>

              <label
                htmlFor="Version"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الموضوع"
                  : currentLanguage === "fr"
                    ? "Sujet"
                    : "Subject"}
                <input
                  id="Version"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label
                htmlFor="Version"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ الإنشاء"
                  : currentLanguage === "fr"
                    ? "Date de création"
                    : "Creating Date"}
                <input
                  id="Version"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إضافة كتاب"
                  : currentLanguage === "fr"
                    ? "Ajouter un livre"
                    : "Add Book"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditBook;
