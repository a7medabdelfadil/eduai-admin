"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  useCreateDisciplinaryRecordMutation,
  useGetActionsTakenQuery,
  useGetViolationTypesQuery,
} from "@/features/Document-Management/disciplinaryApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useRouter } from "next/navigation";

const AddDisciplinaryRecordForm = () => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language
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
      nameEn: "Other Official Documents",
      nameAr: "وثائق رسمية أخرى",
      nameFr: "Autres documents officiels",
      href: "/document-management/other",
    },
    {
      nameEn: "Add Disciplinary Record",
      nameAr: "إضافة سجل تأديبي",
      nameFr: "Ajouter un dossier disciplinaire",
      href: "/document-management/other/disciplinary/add-disciplinary",
    },
  ];

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
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            : "Record created successfully"
      );
      router.push(
        "/document-management/other/disciplinary");
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

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          {currentLanguage === "ar"
            ? "إشعار تأديبي"
            : currentLanguage === "fr"
              ? "Avis disciplinaire"
              : "Disciplinary Notice"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-[80%] space-y-6 bg-bgPrimary p-6 shadow-md rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                {currentLanguage === "ar"
                  ? "معرف المستخدم"
                  : currentLanguage === "fr"
                    ? "ID de l'utilisateur"
                    : "User ID"}
              </label>
              <input
                type="number"
                name="UserId"
                value={formData.UserId}
                onChange={handleChange}
                required
                className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
                placeholder={
                  currentLanguage === "ar"
                    ? "أدخل معرف المستخدم"
                    : currentLanguage === "fr"
                      ? "Entrez l'ID"
                      : "Enter User ID"
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
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
          </div>

          <div>
            <label className="block mb-1 font-medium">
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
            <label className="block mb-1 font-medium">
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
            <label className="block mb-1 font-medium">
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

          <div>
            <label className="block mb-1 font-medium">
              {currentLanguage === "ar"
                ? "نسخة مقدمة إلى"
                : currentLanguage === "fr"
                  ? "Copie fournie à"
                  : "Copy Provided To"}
            </label>
            <input
              type="text"
              name="providedTo"
              value={formData.providedTo}
              onChange={handleChange}
              className="w-full rounded border border-borderPrimary bg-bgPrimary p-2"
              placeholder={
                currentLanguage === "ar"
                  ? "أدخل المستلم (اختياري)"
                  : currentLanguage === "fr"
                    ? "Entrez le destinataire (facultatif)"
                    : "Enter recipient (optional)"
              }
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-xl bg-primary px-10 py-2 text-white hover:bg-primaryHover"
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
