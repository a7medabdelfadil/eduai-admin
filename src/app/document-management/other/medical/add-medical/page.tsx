"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { useCreateMedicalRecordMutation } from "@/features/Document-Management/otherOfficialDocumentsApi";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddMedicalRecord = () => {
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
      nameEn: "Add Medical Record",
      nameAr: "إضافة سجل طبي",
      nameFr: "Ajouter un dossier médical",
      href: "/document-management/other/medical/add-medical",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createMedicalRecord, { isLoading: submitting }] =
    useCreateMedicalRecordMutation();

  const { data: students, isLoading: isStudentsLoading } =
    useGetAllStudentsQuery({
      archived: "false",
      page: 0,
      size: 1000000,
      graduated: "false",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!studentId) newErrors.studentId = "required";
    if (!title) newErrors.title = "required";
    if (!result) newErrors.result = "required";
    if (!note) newErrors.note = "required";
    if (!file) newErrors.file = "required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(
        currentLanguage === "ar"
          ? "جميع الحقول مطلوبة"
          : currentLanguage === "fr"
            ? "Tous les champs sont requis"
            : "All fields are required",
      );
      return;
    }

    try {
      await createMedicalRecord({
        file: file as File,
        studentId,
        title,
        result,
        note,
      }).unwrap();

      toast.success(
        currentLanguage === "ar"
          ? "تمت الإضافة بنجاح"
          : currentLanguage === "fr"
            ? "Ajouté avec succès"
            : "Added successfully",
      );

      setTimeout(() => {
        router.push("/document-management/other/medical");
      }, 1000);
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (loading || isStudentsLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  const renderError = (field: string) =>
    errors[field] && (
      <span className="text-sm text-red-500">
        {currentLanguage === "ar"
          ? "هذا الحقل مطلوب"
          : currentLanguage === "fr"
            ? "Ce champ est requis"
            : "This field is required"}
      </span>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="my-8 flex justify-center">
          <form
            className="w-full px-4 sm:w-[90%] md:w-[80%]"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10">
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Medical Record Information"
                  : currentLanguage === "ar"
                    ? "معلومات السجل الطبي"
                    : currentLanguage === "fr"
                      ? "Informations médicales"
                      : "Medical Record Information"}
              </h1>
              <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
                <label className="grid text-[18px] font-semibold">
                  Student ID
                  <select
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.studentId
                        ? "border-red-500"
                        : "border-borderPrimary"
                    }`}
                  >
                    <option value="" disabled>
                      {currentLanguage === "en"
                        ? "Select a student"
                        : currentLanguage === "ar"
                          ? "اختر الطالب"
                          : currentLanguage === "fr"
                            ? "Sélectionner un élève"
                            : "Select a student"}
                    </option>
                    {students?.data?.content?.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  {renderError("studentId")}
                </label>

                <label className="grid text-[18px] font-semibold">
                  Title
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.title ? "border-red-500" : "border-borderPrimary"
                    }`}
                  />
                  {renderError("title")}
                </label>

                <label className="grid text-[18px] font-semibold">
                  Result
                  <select
                    value={result}
                    onChange={e => setResult(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.result ? "border-red-500" : "border-borderPrimary"
                    }`}
                  >
                    <option value="" disabled>
                      {currentLanguage === "en"
                        ? "Select result"
                        : currentLanguage === "ar"
                          ? "اختر النتيجة"
                          : currentLanguage === "fr"
                            ? "Sélectionner le résultat"
                            : "Select result"}
                    </option>
                    <option value="true">
                      {currentLanguage === "en"
                        ? "True"
                        : currentLanguage === "ar"
                          ? "صحيح"
                          : currentLanguage === "fr"
                            ? "Vrai"
                            : "True"}
                    </option>
                    <option value="false">
                      {currentLanguage === "en"
                        ? "False"
                        : currentLanguage === "ar"
                          ? "خطأ"
                          : currentLanguage === "fr"
                            ? "Faux"
                            : "False"}
                    </option>
                  </select>
                  {renderError("result")}
                </label>

                <label className="grid text-[18px] font-semibold">
                  Note
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.note ? "border-red-500" : "border-borderPrimary"
                    }`}
                  />
                  {renderError("note")}
                </label>

                <label className="grid text-[18px] font-semibold">
                  File
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className={`w-full rounded-xl border px-2 py-2 ${
                      errors.file ? "border-red-500" : "border-borderPrimary"
                    }`}
                  />
                  {renderError("file")}
                </label>
              </div>
              <div className="flex justify-center text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {submitting
                    ? currentLanguage === "ar"
                      ? "جارٍ الإضافة..."
                      : "Submitting..."
                    : currentLanguage === "en"
                      ? "Add Record"
                      : currentLanguage === "ar"
                        ? "إضافة سجل"
                        : currentLanguage === "fr"
                          ? "Ajouter le dossier"
                          : "Add Record"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
};

export default AddMedicalRecord;
