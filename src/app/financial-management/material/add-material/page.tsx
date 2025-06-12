"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const AddMaterial = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Material",
      nameAr: "المادة",
      nameFr: "Matériel",
      href: "/financial-management/material",
    },
    {
      nameEn: "Add Material",
      nameAr: "إضافة مادة",
      nameFr: "Ajouter un matériel",
      href: "/financial-management/material/add-material",
    },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
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
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add Material"
              : currentLanguage === "ar"
                ? "إضافة مادة"
                : currentLanguage === "fr"
                  ? "Ajouter un matériel"
                  : "Add Material"}{" "}
            {/* default */}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center">
          <div className="rounded-xl bg-bgPrimary p-10 w-[90] md:w-[80%]">
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
                {currentLanguage === "ar"
                  ? "معلومات المادة"
                  : currentLanguage === "fr"
                    ? "Informations sur le matériel"
                    : "Material Information"}
                {/* default */}
              </h1>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label htmlFor="grade" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الدرجة"
                  : currentLanguage === "fr"
                    ? "Note"
                    : "Grade"}
                <select
                  id="grade"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("grade", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر الدرجة"
                      : currentLanguage === "fr"
                        ? "Sélectionnez la note"
                        : "Select Grade"}
                  </option>
                  <option value="EXCELLENT">
                    {currentLanguage === "ar"
                      ? "ممتاز"
                      : currentLanguage === "fr"
                        ? "Excellent"
                        : "Excellent"}
                  </option>
                  <option value="VERY_GOOD">
                    {currentLanguage === "ar"
                      ? "جيد جدًا"
                      : currentLanguage === "fr"
                        ? "Très bon"
                        : "Very Good"}
                  </option>
                  <option value="GOOD">
                    {currentLanguage === "ar"
                      ? "جيد"
                      : currentLanguage === "fr"
                        ? "Bon"
                        : "Good"}
                  </option>
                  <option value="ACCEPTABLE">
                    {currentLanguage === "ar"
                      ? "مقبول"
                      : currentLanguage === "fr"
                        ? "Passable"
                        : "Acceptable"}
                  </option>
                  <option value="FAIL">
                    {currentLanguage === "ar"
                      ? "راسب"
                      : currentLanguage === "fr"
                        ? "Échoué"
                        : "Fail"}
                  </option>
                </select>
              </label>
              <label htmlFor="cost" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "التكلفة"
                  : currentLanguage === "fr"
                    ? "Coût"
                    : "Cost"}
                {/* default */}
                <input
                  id="cost"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل التكلفة"
                      : currentLanguage === "fr"
                        ? "Entrez le coût"
                        : "Enter Cost"
                  }
                />
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "حول (اختياري)"
                  : currentLanguage === "fr"
                    ? "À propos (Facultatif)"
                    : "About (Optional)"}
                {/* default */}
                <input
                  id="about"
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "اكتب شيئًا"
                      : currentLanguage === "fr"
                        ? "Écrivez quelque chose"
                        : "Write Something"
                  }
                />
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "حفظ"
                  : currentLanguage === "fr"
                    ? "Sauvegarder"
                    : "Save"}

                {/* default */}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddMaterial;
