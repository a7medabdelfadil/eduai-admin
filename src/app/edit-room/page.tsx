"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const EditRoom = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Room",
      nameAr: "غرفة",
      nameFr: "Chambre",
      href: "/room",
    },
    {
      nameEn: "Edit Room",
      nameAr: "تعديل الغرفة",
      nameFr: "Modifier la chambre",
      href: "/edit-room",
    },
  ];
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

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
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Room"
              : currentLanguage === "ar"
                ? "تعديل الغرفة"
                : currentLanguage === "fr"
                  ? "Modifier la chambre"
                  : "Edit Room"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center">
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
              <svg
                className="h-6 w-6 font-bold text-secondary group-hover:text-primary"
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
                  ? "معلومات الغرفة"
                  : currentLanguage === "fr"
                    ? "Informations sur la chambre"
                    : "Room Information"}
              </h1>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "رقم الغرفة"
                  : currentLanguage === "fr"
                    ? "Numéro de la chambre"
                    : "Room Number"}
                <input
                  id="name"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الطابق"
                  : currentLanguage === "fr"
                    ? "Étage"
                    : "Floor"}
                <input
                  id="code"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "نوع الغرفة"
                  : currentLanguage === "fr"
                    ? "Type de chambre"
                    : "Room Type"}
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
                  ? "فئة الغرفة"
                  : currentLanguage === "fr"
                    ? "Catégorie de chambre"
                    : "Room Category"}
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
                  ? "الطاقة الاستيعابية"
                  : currentLanguage === "fr"
                    ? "Capacité"
                    : "Capacity"}
                <input
                  id="Version"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
              <label
                htmlFor="Initial"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الحالة"
                  : currentLanguage === "fr"
                    ? "État"
                    : "Status"}
                <input
                  id="Initial"
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
                  ? "إضافة غرفة"
                  : currentLanguage === "fr"
                    ? "Ajouter une chambre"
                    : "Add Room"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditRoom;
