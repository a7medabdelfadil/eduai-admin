"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  useCreateActivityMutation,
  useGetUnusedActivitiesQuery,
} from "@/features/Financial/activityApi";
import Container from "@/components/Container";

const AddActivity = () => {
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
      nameEn: "Activity",
      nameAr: "النشاط",
      nameFr: "Activité",
      href: "/financial-management/activity",
    },
    {
      nameEn: "Add Activity",
      nameAr: "إضافة نشاط",
      nameFr: "Ajouter une activité",
      href: "/financial-management/activity/add-activity",
    },
  ];

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const {
    data,
    isLoading: activityLoading,
    refetch,
  } = useGetUnusedActivitiesQuery(null);
  console.log("👾 ~ AddActivity ~ data:", data);
  const [createActivity, { isLoading: submitting }] =
    useCreateActivityMutation();

  const onSubmit = async (formData: any) => {
    console.log("Form data submitted:", formData);
    try {
      await createActivity(formData).unwrap();
      toast.success("Activity created successfully!");
      router.push("/financial-management/activity");
      refetch();
    } catch (error: any) {
      console.error("Error creating activity:", error);
      toast.error("Error creating activity: " + (error?.data?.message || ""));
    }
  };

  if (activityLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  if (
    !activityLoading &&
    (!Array.isArray(data?.data) || data.data.length === 0)
  ) {
    return (
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
        } mx-3 mt-[40px] flex h-[500px] items-center justify-center text-center`}
      >
        <div className="rounded-xl bg-bgPrimary p-10 shadow-md">
          <h2 className="mb-4 text-[20px] font-semibold text-secondary">
            {currentLanguage === "ar"
              ? "لا توجد أنواع نشاط متاحة لإضافتها حالياً."
              : currentLanguage === "fr"
                ? "Aucun type d'activité disponible pour le moment."
                : "No activity types available to add now."}
          </h2>
          <button
            onClick={() => router.push("/financial-management/activity")}
            className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-hover"
          >
            {currentLanguage === "ar"
              ? "العودة"
              : currentLanguage === "fr"
                ? "Retour"
                : "Go Back"}
          </button>
        </div>
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
              ? "Add Activity"
              : currentLanguage === "ar"
                ? "إضافة نشاط"
                : currentLanguage === "fr"
                  ? "Ajouter une activité"
                  : "Add Activity"}{" "}
            {/* default */}
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
                  ? "معلومات النشاط"
                  : currentLanguage === "fr"
                    ? "Informations sur l'activité"
                    : "Activity Information"}
                {/* default */}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="activityType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "نوع النشاط"
                  : currentLanguage === "fr"
                    ? "Type d'activité"
                    : "Activity Type"}
                {/* default */}
                <select
                  id="activityType"
                  {...register("activityType")}
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 text-textPrimary outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر نوع النشاط"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le type"
                        : "Select Activity Type"}
                  </option>
                  {Array.isArray(data?.data) &&
                    data.data.map((activityType: string) => (
                      <option key={activityType} value={activityType}>
                        {activityType}
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
                {/* default */}
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
                {/* default */}
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
                  submitting
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-primary hover:bg-hover"
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

export default AddActivity;
