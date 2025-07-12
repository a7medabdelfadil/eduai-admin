"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  useCreateDisciplinaryRecordMutation,
  useGetActionsTakenQuery,
  useGetViolationTypesQuery,
} from "@/features/Document-Management/disciplinaryApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useRouter } from "next/navigation";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import { useGetAllEmployeesQuery } from "@/features/User-Management/employeeApi";
import Spinner from "@/components/spinner";

const AddDisciplinaryRecordForm = () => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  const router = useRouter();

  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Disciplinary Records",
      nameAr: "السجلات التأديبية",
      nameFr: "Dossiers disciplinaires",
      href: "/document-management/other/disciplinary",
    },
    {
      nameEn: "Add Disciplinary Record",
      nameAr: "إضافة سجل تأديبي",
      nameFr: "Ajouter un dossier disciplinaire",
      href: "/document-management/other/disciplinary/add-disciplinary",
    },
  ];

  const { data: studentsData, isLoading: isStudentLoading } = useGetAllStudentsQuery({
    page: 0,
    size: 1000000,
    archived: false,
    graduated: false,
  });

  const { data: teachersData, isLoading: isTeacherLoading } = useGetAllTeachersQuery({
    page: 0,
    size: 1000000,
    archived: false,
  });

  const { data: employeesData, isLoading: isEmployeesLoading } = useGetAllEmployeesQuery({
    page: 0,
    size: 1000000,
    archived: false,
  });

  const [formData, setFormData] = useState({
    UserId: "",
    DateOfIssue: "",
    description: "",
    violationType: "",
    actionTaken: "",
    providedTo: "",
  });

  const { data: violationTypes } = useGetViolationTypesQuery(null);
  const { data: actionsTaken } = useGetActionsTakenQuery(null);
  const [createRecord, { isLoading }] = useCreateDisciplinaryRecordMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      UserId: Number(formData.UserId),
      DateOfIssue: formData.DateOfIssue.trim(),
      description: formData.description.trim(),
      violationType: formData.violationType,
      actionTaken: formData.actionTaken,
      providedTo: formData.providedTo.trim() || "",
    };

    try {
      const res = await createRecord(payload).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء السجل بنجاح"
          : currentLanguage === "fr"
            ? "Dossier créé avec succès"
            : "Record created successfully",
      );
      router.push("/document-management/other/disciplinary");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        (currentLanguage === "ar"
          ? "فشل في إنشاء السجل"
          : currentLanguage === "fr"
            ? "Échec de la création du dossier"
            : "Failed to create record");
      toast.error(errorMessage);
    }
  };


  if (isStudentLoading || isTeacherLoading || isEmployeesLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-hidden ">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
          {currentLanguage === "ar"
            ? "السجلات التأديبية"
            : currentLanguage === "fr"
              ? "Dossiers disciplinaires"
              : "Disciplinary Records"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-[80%] space-y-6 rounded-xl bg-bgPrimary p-6 shadow-md"
        >
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
                ? "إشعار تأديبي"
                : currentLanguage === "fr"
                  ? "Avis disciplinaire"
                  : "Disciplinary Notice"}
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar"
                  ? "معرف المستخدم"
                  : currentLanguage === "fr"
                    ? "ID de l'utilisateur"
                    : "User ID"}
              </label>
              <select
                name="UserId"
                value={formData.UserId}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">
                  {currentLanguage === "ar"
                    ? "اختر المستخدم"
                    : currentLanguage === "fr"
                      ? "Sélectionner un utilisateur"
                      : "Select User"}
                </option>

                {studentsData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "الطلاب" : currentLanguage === "fr" ? "Étudiants" : "Students"}>
                    {studentsData.data.content.map((s: any) => (
                      <option key={`student-${s.id}`} value={s.id}>
                        {s.name} (student)
                      </option>
                    ))}
                  </optgroup>
                )}

                {teachersData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "المعلمين" : currentLanguage === "fr" ? "Enseignants" : "Teachers"}>
                    {teachersData.data.content.map((t: any) => (
                      <option key={`teacher-${t.id}`} value={t.id}>
                        {t.name} (teacher)
                      </option>
                    ))}
                  </optgroup>
                )}

                {employeesData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "الموظفين" : currentLanguage === "fr" ? "Employés" : "Employees"}>
                    {employeesData.data.content.map((e: any) => (
                      <option key={`employee-${e.id}`} value={e.id}>
                        {e.name} (employee)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>


            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar"
                  ? "تاريخ الإصدار"
                  : currentLanguage === "fr"
                    ? "Date d'émission"
                    : "Date of Issue"}
              </label>
              <input
                type="date"
                name="DateOfIssue"
                value={formData.DateOfIssue}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar"
                  ? "نوع المخالفة"
                  : currentLanguage === "fr"
                    ? "Type d'infraction"
                    : "Violation Type"}
              </label>
              <select
                name="violationType"
                value={formData.violationType}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">
                  {currentLanguage === "ar"
                    ? "اختر المخالفة"
                    : currentLanguage === "fr"
                      ? "Sélectionner une infraction"
                      : "Select Violation"}
                </option>
                {violationTypes?.data?.map((type: string) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar"
                  ? "الإجراء المتخذ"
                  : currentLanguage === "fr"
                    ? "Action prise"
                    : "Action Taken"}
              </label>
              <select
                name="actionTaken"
                value={formData.actionTaken}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">
                  {currentLanguage === "ar"
                    ? "اختر إجراء"
                    : currentLanguage === "fr"
                      ? "Sélectionner une action"
                      : "Select Action"}
                </option>
                {actionsTaken?.data?.map((action: string) => (
                  <option key={action} value={action}>
                    {action.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar"
                  ? "نسخة مقدمة إلى"
                  : currentLanguage === "fr"
                    ? "Copie fournie à"
                    : "Copy Provided To"}
              </label>
              <select
                name="providedTo"
                value={formData.providedTo}
                onChange={handleChange}
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">
                  {currentLanguage === "ar"
                    ? "اختر المستلم (اختياري)"
                    : currentLanguage === "fr"
                      ? "Sélectionner un destinataire"
                      : "Select recipient (optional)"}
                </option>

                {teachersData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "المعلمين" : currentLanguage === "fr" ? "Enseignants" : "Teachers"}>
                    {teachersData.data.content.map((t: any) => (
                      <option key={`teacher-${t.id}`} value={t.email || t.username}>
                        {t.name} (teacher)
                      </option>
                    ))}
                  </optgroup>
                )}

                {employeesData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "الموظفين" : currentLanguage === "fr" ? "Employés" : "Employees"}>
                    {employeesData.data.content.map((e: any) => (
                      <option key={`employee-${e.id}`} value={e.email || e.username}>
                        {e.name} (employee)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

          </div>
          <div>
            <label className="mb-1 block font-medium">
              {currentLanguage === "ar"
                ? "تفاصيل الواقعة"
                : currentLanguage === "fr"
                  ? "Détails de l'incident"
                  : "Details of the Incident"}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              placeholder={
                currentLanguage === "ar"
                  ? "أدخل التفاصيل"
                  : currentLanguage === "fr"
                    ? "Entrez les détails"
                    : "Enter details"
              }
              rows={4}
            />
          </div>


          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-xl bg-primary px-10 py-2 text-white hover:bg-hover"
              disabled={isLoading}
            >
              {isLoading
                ? currentLanguage === "ar"
                  ? "جارٍ الحفظ..."
                  : currentLanguage === "fr"
                    ? "Enregistrement..."
                    : "Saving..."
                : currentLanguage === "ar"
                  ? "حفظ"
                  : currentLanguage === "fr"
                    ? "Enregistrer"
                    : "Save"}
            </button>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddDisciplinaryRecordForm;
