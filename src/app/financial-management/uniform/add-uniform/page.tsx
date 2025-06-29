"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { useGetAllLevelsQuery } from "@/features/signupApi";
import { useCreateFeesItemMutation } from "@/features/Financial/paymentApi";

const AddUniform = () => {
  const breadcrumbs = [
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Uniform",
      nameAr: "الزي المدرسي",
      nameFr: "Uniforme",
      href: "/financial-management/uniform",
    },
    {
      nameEn: "Add Uniform",
      nameAr: "إضافة زي",
      nameFr: "Ajouter un uniforme",
      href: "/financial-management/uniform/add-uniform",
    },
  ];

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector((state: RootState) => state.language);

  const { data: levelsData, isLoading: levelsLoading } = useGetAllLevelsQuery(null);
  const [createFeesItem, { isLoading: submitting }] = useCreateFeesItemMutation();

  const onSubmit = async (formData: any) => {
    try {
      await createFeesItem({ ...formData, itemType: "UNIFORM" }).unwrap();
      toast.success("Uniform added successfully!");
      router.push("/financial-management/uniform");
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (levelsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Add Uniform"
              : currentLanguage === "ar"
              ? "إضافة زي"
              : currentLanguage === "fr"
              ? "Ajouter un uniforme"
              : "Add Uniform"}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                  ? "معلومات الزي"
                  : currentLanguage === "fr"
                  ? "Informations sur l'uniforme"
                  : "Uniform Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label htmlFor="studyLevel" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "المرحلة الدراسية"
                  : currentLanguage === "fr"
                  ? "Niveau d'étude"
                  : "Study Level"}
                <select
                  id="studyLevel"
                  {...register("studyLevel")}
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 text-textPrimary outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر المرحلة"
                      : currentLanguage === "fr"
                      ? "Sélectionnez le niveau"
                      : "Select Study Level"}
                  </option>
                  {levelsData?.data &&
                    Object.entries(levelsData.data).map(([key, val]) => (
                      <option key={key} value={key}>
                        {String(val)}
                      </option>
                    ))}
                </select>
              </label>
              <label htmlFor="cost" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "التكلفة"
                  : currentLanguage === "fr"
                  ? "Coût"
                  : "Cost"}
                <input
                  id="cost"
                  type="number"
                  {...register("cost")}
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
                <input
                  id="about"
                  type="text"
                  {...register("about")}
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
                disabled={submitting}
                className={`w-fit rounded-xl px-4 py-2 text-[18px] text-white duration-300 ease-in hover:shadow-xl ${
                  submitting ? "cursor-not-allowed bg-gray-400" : "bg-primary hover:bg-hover"
                }`}
              >
                {submitting
                  ? currentLanguage === "ar"
                    ? "جاري الحفظ..."
                    : currentLanguage === "fr"
                    ? "Enregistrement..."
                    : "Saving..."
                  : currentLanguage === "ar"
                  ? "حفظ"
                  : currentLanguage === "fr"
                  ? "Sauvegarder"
                  : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddUniform;