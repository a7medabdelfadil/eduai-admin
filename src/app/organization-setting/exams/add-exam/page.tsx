"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateExamTypeMutation } from "@/features/Acadimic/examsApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";

const AddExam = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      nameEn: "Add Exam",
      nameAr: "إضافة إمتحان",
      nameFr: "Ajouter un examen",
      href: "/organization-setting/exams/add-exam",
    },
  ];
  
  // Legal type options
  const legalTypeOptions = {
    "FIRST": "First",
    "SECOND": "Second",
    "THIRD": "Third", 
    "FOURTH": "Fourth",
    "INTEGRATED_ACTIVITIES": "Integrated Activities"
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Get course data for course selection
  
  // Use the create exam type mutation
  const [createExamType, { isLoading: isCreating }] = useCreateExamTypeMutation();

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert numeric form values from strings to numbers
      const payload = {
        name: data.examName,
        examGrade: Number(data.examGrade),
        passingGrade: Number(data.passingGrade),
        studyLevel: data.studyLevel,
        legalType: data.legalType,
      };
      
      const response = await createExamType(payload).unwrap();
      
      if (response) {
        toast.success(
          currentLanguage === "ar"
            ? "تم إضافة الامتحان بنجاح"
            : currentLanguage === "fr"
              ? "Examen ajouté avec succès"
              : "Exam added successfully"
        );
        reset(); // Reset form after successful submission
        router.push("/organization-setting/exams"); // Redirect to exams page
      }
    } catch (error) {
      toast.error(
        currentLanguage === "ar"
          ? "حدث خطأ أثناء إضافة الامتحان"
          : currentLanguage === "fr"
            ? "Une erreur s'est produite lors de l'ajout de l'examen"
            : "An error occurred while adding the exam"
      );
      console.error("Error creating exam type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
    
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
        } mx-3 mt-[40px] grid items-center justify-center`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
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
              <h1 className="font-sans text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "إضافة امتحان"
                  : currentLanguage === "fr"
                    ? "Ajouter un examen"
                    : "Add Exam"}
              </h1>
            </div>
          
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="examName"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم الامتحان"
                  : currentLanguage === "fr"
                    ? "Nom de l'examen"
                    : "Exam Name"}
                <input
                  id="examName"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل اسم الامتحان"
                      : currentLanguage === "fr"
                        ? "Entrez le nom de l'examen"
                        : "Enter exam name"
                  }
                  {...register("examName", { required: true })}
                />
                {errors.examName && (
                  <span className="text-sm text-red-500">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est obligatoire"
                        : "This field is required"}
                  </span>
                )}
              </label>
              
              <label
                htmlFor="examGrade"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "درجة الامتحان"
                  : currentLanguage === "fr"
                    ? "Note de l'examen"
                    : "Exam Grade"}
                <input
                  id="examGrade"
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل درجة الامتحان"
                      : currentLanguage === "fr"
                        ? "Entrez la note de l'examen"
                        : "Enter exam grade"
                  }
                  {...register("examGrade", { required: true, min: 0 })}
                />
                {errors.examGrade && (
                  <span className="text-sm text-red-500">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب ويجب أن يكون رقماً موجباً"
                      : currentLanguage === "fr"
                        ? "Ce champ est obligatoire et doit être un nombre positif"
                        : "This field is required and must be a positive number"}
                  </span>
                )}
              </label>
              
              <label
                htmlFor="passingGrade"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "درجة النجاح"
                  : currentLanguage === "fr"
                    ? "Note de passage"
                    : "Passing Grade"}
                <input
                  id="passingGrade"
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل درجة النجاح"
                      : currentLanguage === "fr"
                        ? "Entrez la note de passage"
                        : "Enter passing grade"
                  }
                  {...register("passingGrade", { required: true, min: 0 })}
                />
                {errors.passingGrade && (
                  <span className="text-sm text-red-500">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب ويجب أن يكون رقماً موجباً"
                      : currentLanguage === "fr"
                        ? "Ce champ est obligatoire et doit être un nombre positif"
                        : "This field is required and must be a positive number"}
                  </span>
                )}
              </label>

              <label
                htmlFor="studyLevel"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "المستوى الدراسي"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude"
                    : "Study Level"}
                <select
                  id="studyLevel"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("studyLevel", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر المستوى الدراسي"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le niveau d'étude"
                        : "Select study level"}
                  </option>
                  <option value="GRADE1">Grade 1</option>
                  <option value="GRADE2">Grade 2</option>
                  <option value="GRADE3">Grade 3</option>
                  <option value="GRADE4">Grade 4</option>
                  <option value="GRADE5">Grade 5</option>
                  <option value="GRADE6">Grade 6</option>
                </select>
                {errors.studyLevel && (
                  <span className="text-sm text-red-500">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est obligatoire"
                        : "This field is required"}
                  </span>
                )}
              </label>
              
              {/* Legal Type Selection */}
              <label
                htmlFor="legalType"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "النوع القانوني"
                  : currentLanguage === "fr"
                    ? "Type légal"
                    : "Legal Type"}
                <select
                  id="legalType"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  {...register("legalType", { required: true })}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر النوع القانوني"
                      : currentLanguage === "fr"
                        ? "Sélectionnez le type légal"
                        : "Select legal type"}
                  </option>
                  {Object.entries(legalTypeOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors.legalType && (
                  <span className="text-sm text-red-500">
                    {currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : currentLanguage === "fr"
                        ? "Ce champ est obligatoire"
                        : "This field is required"}
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting || isCreating}
              >
                {(isSubmitting || isCreating) ? (
                  <span className="flex items-center gap-2">
                    {currentLanguage === "ar"
                      ? "جاري الحفظ..."
                      : currentLanguage === "fr"
                        ? "Sauvegarde en cours..."
                        : "Saving..."}
                  </span>
                ) : (
                  currentLanguage === "ar"
                    ? "حفظ"
                    : currentLanguage === "fr"
                      ? "Sauvegarder"
                      : "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddExam;
