"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import Spinner from "@/components/spinner";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useRouter, useParams } from "next/navigation";
import {
  useGetDisciplinaryRecordByIdQuery,
  useUpdateDisciplinaryRecordMutation,
  useGetActionsTakenQuery,
  useGetViolationTypesQuery,
} from "@/features/Document-Management/disciplinaryApi";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import { useGetAllEmployeesQuery } from "@/features/User-Management/employeeApi";

const EditDisciplinaryRecordForm = () => {
  const { language: currentLanguage } = useSelector((state: RootState) => state.language);
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { data: recordData, isLoading: isRecordLoading } = useGetDisciplinaryRecordByIdQuery(id);
  const { data: studentsData } = useGetAllStudentsQuery({ page: 0, size: 1000000, archived: false, graduated: false });
  const { data: teachersData } = useGetAllTeachersQuery({ page: 0, size: 1000000, archived: false });
  const { data: employeesData } = useGetAllEmployeesQuery({ page: 0, size: 1000000, archived: false });
  const { data: violationTypes } = useGetViolationTypesQuery(null);
  const { data: actionsTaken } = useGetActionsTakenQuery(null);

  const [updateRecord, { isLoading }] = useUpdateDisciplinaryRecordMutation();

  const [formData, setFormData] = useState({
    DateOfIssue: "",
    description: "",
    violationType: "",
    actionTaken: "",
    providedTo: "",
  });

  useEffect(() => {
    if (recordData?.data) {
      setFormData({
        DateOfIssue: recordData.data.DateOfIssue,
        description: recordData.data.description,
        violationType: recordData.data.violationType,
        actionTaken: recordData.data.actionTaken,
        providedTo: recordData.data.providedTo || "",
      });
    }
  }, [recordData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRecord({ id, data: formData }).unwrap();
      toast.success(currentLanguage === "ar" ? "تم التحديث بنجاح" : currentLanguage === "fr" ? "Mis à jour avec succès" : "Updated successfully");
      router.push("/document-management/other/disciplinary");
    } catch (err: any) {
      toast.error(err?.data?.message || (currentLanguage === "ar" ? "فشل في التحديث" : currentLanguage === "fr" ? "Échec de la mise à jour" : "Update failed"));
    }
  };

  if (isRecordLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={[
        { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
        { nameEn: "Document Management", nameAr: "إدارة المستندات", nameFr: "Gestion des documents", href: "/document-management" },
        { nameEn: "Disciplinary Records", nameAr: "السجلات التأديبية", nameFr: "Dossiers disciplinaires", href: "/document-management/other/disciplinary" },
        { nameEn: "Edit Disciplinary Record", nameAr: "تعديل سجل تأديبي", nameFr: "Modifier un dossier disciplinaire", href: `/document-management/other/disciplinary/${id}` },
      ]} />

      <Container>
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
          {currentLanguage === "ar" ? "تعديل سجل تأديبي" : currentLanguage === "fr" ? "Modifier un dossier disciplinaire" : "Edit Disciplinary Record"}
        </h2>

        <form onSubmit={handleSubmit} className="mx-auto w-[80%] space-y-6 rounded-xl bg-bgPrimary p-6 shadow-md">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar" ? "تاريخ الإصدار" : currentLanguage === "fr" ? "Date d\'émission" : "Date of Issue"}
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
                {currentLanguage === "ar" ? "نوع المخالفة" : currentLanguage === "fr" ? "Type d\'infraction" : "Violation Type"}
              </label>
              <select
                name="violationType"
                value={formData.violationType}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">{currentLanguage === "ar" ? "اختر المخالفة" : currentLanguage === "fr" ? "Sélectionner une infraction" : "Select Violation"}</option>
                {violationTypes?.data?.map((type: string) => (
                  <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar" ? "الإجراء المتخذ" : currentLanguage === "fr" ? "Action prise" : "Action Taken"}
              </label>
              <select
                name="actionTaken"
                value={formData.actionTaken}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">{currentLanguage === "ar" ? "اختر إجراء" : currentLanguage === "fr" ? "Sélectionner une action" : "Select Action"}</option>
                {actionsTaken?.data?.map((action: string) => (
                  <option key={action} value={action}>{action.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                {currentLanguage === "ar" ? "نسخة مقدمة إلى" : currentLanguage === "fr" ? "Copie fournie à" : "Copy Provided To"}
              </label>
              <select
                name="providedTo"
                value={formData.providedTo}
                onChange={handleChange}
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              >
                <option value="">{currentLanguage === "ar" ? "اختر المستلم (اختياري)" : currentLanguage === "fr" ? "Sélectionner un destinataire" : "Select recipient (optional)"}</option>

                {teachersData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "المعلمين" : currentLanguage === "fr" ? "Enseignants" : "Teachers"}>
                    {teachersData.data.content.map((t: any) => (
                      <option key={`teacher-${t.id}`} value={t.email || t.username}>{t.name}</option>
                    ))}
                  </optgroup>
                )}

                {employeesData?.data?.content?.length > 0 && (
                  <optgroup label={currentLanguage === "ar" ? "الموظفين" : currentLanguage === "fr" ? "Employés" : "Employees"}>
                    {employeesData.data.content.map((e: any) => (
                      <option key={`employee-${e.id}`} value={e.email || e.username}>{e.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium">
              {currentLanguage === "ar" ? "تفاصيل الواقعة" : currentLanguage === "fr" ? "Détails de l'incident" : "Details of the Incident"}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              placeholder={currentLanguage === "ar" ? "أدخل التفاصيل" : currentLanguage === "fr" ? "Entrez les détails" : "Enter details"}
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

export default EditDisciplinaryRecordForm;
