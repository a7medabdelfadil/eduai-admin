"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetClassByIdQuery, useUpdateClasssMutation } from "@/features/Infrastructure/classApi";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";

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
      href: "/classes",
    },
    {
      nameEn: `Class details`,
      nameAr: `تفاصيل الفصل`,
      nameFr: `Détails de la classe`,
      href: `/class-detials/${params.classId}`,
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

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, isLoading } = useGetClassByIdQuery(params.classId);
  const [updateClass, { isLoading: isUpdating }] = useUpdateClasssMutation();
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    if (data && data.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateClass({
        id: params.classId,
        formData: formData
      }).unwrap();
      
      toast.success(
        currentLanguage === "en"
          ? "Class updated successfully!"
          : currentLanguage === "ar"
            ? "تم تحديث الفصل بنجاح!"
            : "Classe mise à jour avec succès!"
      );
    } catch (error) {
      console.error("Failed to update class:", error);
      toast.error(
        currentLanguage === "en"
          ? "Failed to update class"
          : currentLanguage === "ar"
            ? "فشل تحديث الفصل"
            : "Échec de la mise à jour de la classe"
      );
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
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } relative mx-3 mt-10 overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="relative shadow-md sm:rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-6">
            {currentLanguage === "en"
              ? "Edit Class Details"
              : currentLanguage === "ar"
                ? "تعديل تفاصيل الفصل"
                : "Modifier les détails de la classe"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(formLabels).map((key) => {
                // Special handling for fields that should be numbers
                const isNumberField = ["floorNumber", "maxCapacity", "schoolId", "classroomNumber"].includes(key);
                // Special handling for fields that might be null in the API response
                const acceptsNull = ["type", "classroomStudyLevel", "classroomStudyStage"].includes(key);
                
                return (
                  <div key={key} className="mb-4">
                    <label 
                      htmlFor={key} 
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      {formLabels[key][currentLanguage as keyof (typeof formLabels)[typeof key]]}
                    </label>
                    <input
                      type={isNumberField ? "number" : "text"}
                      id={key}
                      {...register(key, { 
                        required: !acceptsNull,
                        valueAsNumber: isNumberField 
                      })}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {errors[key] && (
                      <p className="text-red-500 text-xs mt-1">
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
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300"
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
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-4 focus:outline-none ${
                  !isDirty || isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentLanguage === "en"
                      ? "Saving..."
                      : currentLanguage === "ar"
                        ? "جاري الحفظ..."
                        : "Enregistrement..."}
                  </div>
                ) : (
                  currentLanguage === "en"
                    ? "Save Changes"
                    : currentLanguage === "ar"
                      ? "حفظ التغييرات"
                      : "Enregistrer les modifications"
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
