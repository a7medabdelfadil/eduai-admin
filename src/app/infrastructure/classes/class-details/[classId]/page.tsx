"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import {
  useGetClassByIdQuery,
  useUpdateClasssMutation,
} from "@/features/Infrastructure/classApi";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ClassDetailsProps {
  params: {
    classId: string;
  };
}

const ClassDetails: React.FC<ClassDetailsProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Classes",
      nameAr: "الفصل",
      nameFr: "Classe",
      href: "/infrastructure/classes",
    },
    {
      nameEn: `Class details`,
      nameAr: `تفاصيل الفصل`,
      nameFr: `Détails de la classe`,
      href: `/infrastructure/classes/class-details/${params.classId}`,
    },
  ];

  const formLabels: {
    [key: string]: { en: string; ar: string; fr: string };
  } = {
    buildingNumber: {
      en: "Building Number",
      ar: "رقم المبنى",
      fr: "Numéro de bâtiment",
    },
    roomNumber: {
      en: "Room Number",
      ar: "رقم الغرفة",
      fr: "Numéro de chambre",
    },
    floorNumber: {
      en: "Floor Number",
      ar: "رقم الطابق",
      fr: "Numéro d'étage",
    },
    type: {
      en: "Type",
      ar: "النوع",
      fr: "Type",
    },
    maxCapacity: {
      en: "Max Capacity",
      ar: "الطاقة القصوى",
      fr: "Capacité maximale",
    },
    schoolId: {
      en: "School ID",
      ar: "معرف المدرسة",
      fr: "ID de l'école",
    },
    classroomName: {
      en: "Classroom Name",
      ar: "اسم الفصل",
      fr: "Nom de la classe",
    },
    classroomNumber: {
      en: "Classroom Number",
      ar: "رقم الفصل",
      fr: "Numéro de classe",
    },
    classroomStudyLevel: {
      en: "Study Level",
      ar: "مستوى الدراسة",
      fr: "Niveau d'étude",
    },
    classroomStudyStage: {
      en: "Study Stage",
      ar: "مرحلة الدراسة",
      fr: "Étape d'étude",
    },
  };
  const router = useRouter()
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, isLoading } = useGetClassByIdQuery(params.classId);
  console.log("🚀 ~ data:", data)
  const [updateClass, { isLoading: isUpdating }] = useUpdateClasssMutation();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (data && data.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateClass({
        id: params.classId,
        formData: formData,
      }).unwrap();

      toast.success(
        currentLanguage === "en"
          ? "Class updated successfully!"
          : currentLanguage === "ar"
            ? "تم تحديث الفصل بنجاح!"
            : "Classe mise à jour avec succès!",
      );
      router.push('/infrastructure/classes')
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
          } relative mx-3 mt-10 overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="relative bg-bgPrimary p-6 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Class Details"
              : currentLanguage === "ar"
                ? "تعديل تفاصيل الفصل"
                : "Modifier les détails de la classe"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.keys(formLabels).map(key => {
                // Special handling for fields that should be numbers
                const isNumberField = [
                  "floorNumber",
                  "maxCapacity",
                  "schoolId",
                  "classroomNumber",
                ].includes(key);
                // Special handling for fields that might be null in the API response
                const acceptsNull = [
                  "type",
                  "classroomStudyLevel",
                  "classroomStudyStage",
                ].includes(key);

                return (
                  <div key={key} className="mb-4">
                    <label
                      htmlFor={key}
                      className="mb-2 block text-sm font-medium text-textPrimary"
                    >
                      {
                        formLabels[key][
                        currentLanguage as keyof (typeof formLabels)[typeof key]
                        ]
                      }
                    </label>
                    <input
                      type={isNumberField ? "number" : "text"}
                      id={key}
                      {...register(key, {
                        required: !acceptsNull,
                        valueAsNumber: isNumberField,
                      })}
                      className="block w-full rounded-lg border border-borderPrimary bg-bgPrimary p-2.5 text-sm text-textSecondary focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors[key] && (
                      <p className="mt-1 text-xs text-red-500">
                        {currentLanguage === "en"
                          ? "This field is required"
                          : currentLanguage === "ar"
                            ? "هذا الحقل مطلوب"
                            : "Ce champ est requis"}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => reset(data?.data)}
                className="mr-4 rounded-lg border border-borderPrimary bg-bgPrimary px-4 py-2 text-sm font-medium text-textPrimary hover:bg-bgSecondary focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {currentLanguage === "en"
                  ? "Cancel"
                  : currentLanguage === "ar"
                    ? "إلغاء"
                    : "Annuler"}
              </button>
              <button
                type="submit"
                disabled={!isDirty || isUpdating}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 ${!isDirty || isUpdating
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"
                  }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {currentLanguage === "en"
                      ? "Saving..."
                      : currentLanguage === "ar"
                        ? "جاري الحفظ..."
                        : "Enregistrement..."}
                  </div>
                ) : currentLanguage === "en" ? (
                  "Save Changes"
                ) : currentLanguage === "ar" ? (
                  "حفظ التغييرات"
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>
            </div>
          </form>

          {(!data || !data.data) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "There is No Data"
                : currentLanguage === "ar"
                  ? "لا توجد بيانات"
                  : currentLanguage === "fr"
                    ? "Il n'y a pas de données"
                    : "There is No Data"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassDetails;
