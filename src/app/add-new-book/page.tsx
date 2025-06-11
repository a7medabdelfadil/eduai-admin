"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const AddNewBook = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "الدورات والموارد",
      nameFr: "Cours et Ressources",
      href: "/infrastructure",
    },
    {
      nameEn: "Library",
      nameAr: "المكتبة",
      nameFr: "Bibliothèque",
      href: "/book",
    },
    {
      nameEn: "Add New Book",
      nameAr: "إضافة كتاب جديد",
      nameFr: "Ajouter un nouveau livre",
      href: "/add-new-book",
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
        <div className="mb-8 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {currentLanguage === "en"
              ? "Add New Book"
              : currentLanguage === "ar"
                ? "إضافة كتاب جديد"
                : currentLanguage === "fr"
                  ? "Ajouter un nouveau livre"
                  : "Add New Book"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center">
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
            <div className="flex items-center justify-start gap-2 mb-8">
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
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="5 6 12 3 19 6" />
                <line x1="4" y1="10" x2="4" y2="21" />
                <line x1="20" y1="10" x2="20" y2="21" />
                <line x1="8" y1="14" x2="8" y2="17" />
                <line x1="12" y1="14" x2="12" y2="17" />
                <line x1="16" y1="14" x2="16" y2="17" />
              </svg>
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Book Information"
                  : currentLanguage === "ar"
                    ? "معلومات الكتاب"
                    : currentLanguage === "fr"
                      ? "Informations sur le livre"
                      : "Book Information"}{" "}
                {/* default */}
              </h1>
            </div>
            <div className="p-6 w-full grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Book Number"
                  : currentLanguage === "ar"
                    ? "رقم الكتاب"
                    : currentLanguage === "fr"
                      ? "Numéro du livre"
                      : "Book Number"}{" "}
                {/* default */}
                <input
                  id="name"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Book Name"
                  : currentLanguage === "ar"
                    ? "اسم الكتاب"
                    : currentLanguage === "fr"
                      ? "Nom du livre"
                      : "Book Name"}{" "}
                {/* default */}
                <input
                  id="code"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Writer"
                  : currentLanguage === "ar"
                    ? "الكاتب"
                    : currentLanguage === "fr"
                      ? "Auteur"
                      : "Writer"}{" "}
                {/* default */}
                <input
                  id="about"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label
                htmlFor="subject"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Subject"
                  : currentLanguage === "ar"
                    ? "الموضوع"
                    : currentLanguage === "fr"
                      ? "Sujet"
                      : "Subject"}{" "}
                {/* default */}
                <input
                  id="subject"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label
                htmlFor="creationDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Creation Date"
                  : currentLanguage === "ar"
                    ? "تاريخ الإنشاء"
                    : currentLanguage === "fr"
                      ? "Date de création"
                      : "Creation Date"}{" "}
                {/* default */}
                <input
                  id="creationDate"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "en"
                  ? "Add Book"
                  : currentLanguage === "ar"
                    ? "إضافة كتاب"
                    : currentLanguage === "fr"
                      ? "Ajouter un livre"
                      : "Add Book"}{" "}
                {/* default */}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddNewBook;
