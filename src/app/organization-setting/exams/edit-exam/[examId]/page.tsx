"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const EditExam = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Exams",
      nameAr: "الإمتحانات",
      nameFr: "Examens",
      href: "/organization-setting/exams",
    },
    {
      nameEn: "Edit Exam",
      nameAr: "تعديل الإمتحان",
      nameFr: "Modifier l'examen",
      href: "/organization-setting/exams/edit-exam",
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
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Exam"
              : currentLanguage === "ar"
                ? "تعديل الإمتحان"
                : currentLanguage === "fr"
                  ? "Modifier l'examen"
                  : "Edit Exam"}{" "}
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
                  ? "تعديل الامتحان"
                  : currentLanguage === "fr"
                    ? "Modifier l'examen"
                    : "Edit Exam"}

                {/* default */}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="annual"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الامتحان"
                  : currentLanguage === "fr"
                    ? "Nom de l'examen"
                    : "Exam Name"}

                {/* default */}
                <input
                  id="annual"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل اسم الامتحان"
                      : currentLanguage === "fr"
                        ? "Entrez le nom de l'examen"
                        : "Enter exam name"
                  }
                />
              </label>
              <label
                htmlFor="annual"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "درجة الامتحان"
                  : currentLanguage === "fr"
                    ? "Note de l'examen"
                    : "Exam Grade"}

                {/* default */}
                <input
                  id="annual"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل درجة الامتحان"
                      : currentLanguage === "fr"
                        ? "Entrez la note de l'examen"
                        : "Enter exam grade"
                  }
                />
              </label>
              <label
                htmlFor="annual"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "درجة النجاح"
                  : currentLanguage === "fr"
                    ? "Note de passage"
                    : "Passing Grade"}

                {/* default */}
                <input
                  id="annual"
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل درجة النجاح"
                      : currentLanguage === "fr"
                        ? "Entrez la note de passage"
                        : "Enter passing grade"
                  }
                />
              </label>

              <label
                htmlFor="leaveType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "المستوى الدراسي"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude"
                    : "Study Level"}
                <select
                  id="leaveType"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("leaveType", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر المستوى الدراسي"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le niveau d'étude"
                        : "Select study level"}
                  </option>
                </select>
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

export default EditExam;
