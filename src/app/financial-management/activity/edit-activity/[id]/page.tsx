"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import {
  useGetActivityByIdQuery,
  useGetActivityTypesQuery,
  useUpdateActivityMutation,
} from "@/features/Financial/activityApi";
import { useEffect } from "react";
import Container from "@/components/Container";

const EditActivity = () => {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  console.log("👾 ~ EditActivity ~ activityId:", activityId);

  const { data: activityData, isLoading: loadingActivity } =
    useGetActivityByIdQuery(activityId);
  console.log("👾 ~ EditActivity ~ activityData:", activityData);
  const { data: activityTypes, isLoading: activityTypesLoading } =
    useGetActivityTypesQuery(null);

  const [updateActivity, { isLoading: submitting }] =
    useUpdateActivityMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (activityData?.data) {
      reset(activityData.data);
    }
  }, [activityData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateActivity({ id: activityId, body: formData }).unwrap();
      toast.success("Activity updated successfully!");
      router.push("/financial-management/activity");
    } catch (error) {
      toast.error("Error updating activity.");
    }
  };

  const { language: currentLanguage, loading: langLoading } = useSelector(
    (state: RootState) => state.language,
  );
  const sidebarOpen = useSelector((state: RootState) => state.boolean.value);

  const isLoading = langLoading || loadingActivity || activityTypesLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
      nameEn: "Edit Activity",
      nameAr: "تعديل النشاط",
      nameFr: "Modifier l'activité",
      href: `/financial-management/activity/edit-activity/${activityId}`,
    },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Activity"
              : currentLanguage === "ar"
                ? "تعديل النشاط"
                : currentLanguage === "fr"
                  ? "Modifier l'activité"
                  : "Edit Activity"}{" "}
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
                  ? "تعديل النشاط"
                  : currentLanguage === "fr"
                    ? "Modifier l'activité"
                    : "Edit Activity"}
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
                <select
                  id="activityType"
                  {...register("activityType")}
                  defaultValue={activityData?.data?.activityType ?? ""}
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 text-textPrimary outline-none max-[471px]:w-[350px]"
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر نوع النشاط"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le type"
                        : "Select Activity Type"}
                  </option>
                  {activityTypes?.data &&
                    Object.entries(activityTypes.data).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value as string}
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

export default EditActivity;
