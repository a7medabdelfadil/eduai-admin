"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Trash2,
  Search,
  Upload,
  Plus,
  BookOpen,
  Users,
  School,
} from "lucide-react";

import BreadCrumbs from "@/components/BreadCrumbs";
import Modal from "@/components/model";
import { useUploadClassroomsMutation } from "@/features/events/eventsApi";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import { RootState } from "@/GlobalRedux/store";

const Infrastructure = () => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Infrastructures",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructures",
      href: "/infrastructure",
    },
    {
      nameEn: "Classes",
      nameAr: "الفصل",
      nameFr: "Classe",
      href: "/classes",
    },
  ];

  type Class = Record<string, any>;
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading, refetch } = useGetAllClasssQuery(null);
  const [search, setSearch] = useState("");

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadEvent, { isLoading: isUploading }] =
    useUploadClassroomsMutation();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetNumber, setSheetNumber] = useState("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate progress
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFile(null);
    setProgress(0);
    setSheetNumber("");
  };

  const handleUploadEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetNumber", sheetNumber);

    try {
      await uploadEvent(formData).unwrap();
      toast.success("Event uploaded successfully");
      handleCloseModal();
      void refetch();
    } catch (err: any) {
      toast.error(`${err?.data?.message}`);
    }
  };

  // Display placeholder cards during loading
  const placeholderCards = Array(6)
    .fill(0)
    .map((_, index) => (
      <div key={`placeholder-${index}`} className="animate-pulse">
        <div className="flex h-[160px] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <div className="flex h-full w-full flex-col p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 rounded bg-gray-200"></div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="h-3 w-20 rounded bg-gray-200"></div>
              <div className="h-3 w-16 rounded bg-gray-200"></div>
            </div>
            <div className="mt-2 flex justify-between">
              <div className="h-3 w-24 rounded bg-gray-200"></div>
              <div className="h-3 w-12 rounded bg-gray-200"></div>
            </div>
            <div className="mt-auto h-8 w-full rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    ));

  if (loading || isLoading)
    return (
      <div
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[150px]"
              : "lg:mr-[320px]"
            : booleanValue
              ? "lg:ml-[150px]"
              : "lg:ml-[320px]"
        }`}
      >
        <BreadCrumbs breadcrumbs={breadcrumbs} />
        <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-textPrimary">
            {currentLanguage === "ar"
              ? "الفصول الدراسية"
              : currentLanguage === "fr"
                ? "Classes"
                : "Classrooms"}
          </h1>
          <div className="flex gap-2">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200"></div>
          </div>
        </div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-gray-200"></div>
          <div className="flex gap-2">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderCards}
        </div>
      </div>
    );

  const getClassColorClasses = (index: number) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-purple-500 text-white",
      "bg-teal-500 text-white",
      "bg-amber-500 text-white",
      "bg-pink-500 text-white",
      "bg-indigo-500 text-white",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[150px]"
              : "lg:mr-[320px]"
            : booleanValue
              ? "lg:ml-[150px]"
              : "lg:ml-[320px]"
        } mt-16 text-center max-[502px]:grid max-[502px]:justify-center lg:mr-[40px]`}
      >
        {/* Header section */}
        <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">
              {currentLanguage === "ar"
                ? "الفصول الدراسية"
                : currentLanguage === "fr"
                  ? "Classes"
                  : "Classrooms"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {currentLanguage === "ar"
                ? "إدارة الفصول الدراسية والمساحات التعليمية"
                : currentLanguage === "fr"
                  ? "Gérer les salles de classe et les espaces d'apprentissage"
                  : "Manage classrooms and learning spaces"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-thead px-4 py-2 text-blue-700">
              <Users size={18} />
              <span className="text-sm font-medium">
                {data?.data?.content?.length || 0}{" "}
                {currentLanguage === "ar"
                  ? "فصل"
                  : currentLanguage === "fr"
                    ? "Classes"
                    : "Classes"}
              </span>
            </div>
          </div>
        </div>

        {/* Search and action buttons */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              onChange={e => setSearch(e.target.value)}
              className="block w-full rounded-lg border border-borderPrimary bg-bgPrimary py-3 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={
                currentLanguage === "en"
                  ? "Search classrooms..."
                  : currentLanguage === "ar"
                    ? "البحث عن الفصول الدراسية..."
                    : "Rechercher des classes..."
              }
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-lg border border-primary bg-bgPrimary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Upload size={18} />
              <span>
                {currentLanguage === "ar"
                  ? "تحميل"
                  : currentLanguage === "fr"
                    ? "Télécharger"
                    : "Upload"}
              </span>
            </button>
            <Link
              href="/classes/add-class"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hover"
            >
              <Plus size={18} />
              <span>
                {currentLanguage === "ar"
                  ? "إضافة فصل"
                  : currentLanguage === "fr"
                    ? "Ajouter une classe"
                    : "Add Class"}
              </span>
            </Link>
          </div>
        </div>

        {/* Class cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.content
            .filter((classItem: Class) => {
              return search.toLowerCase() === ""
                ? classItem
                : classItem.classroomName
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
            .map((classItem: Class, index: number) => (
              <Link
                href={`/class-detials/${classItem.roomId}`}
                key={classItem.roomId}
                className="group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-bgPrimary shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex items-center gap-4 border-b p-6">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${getClassColorClasses(index)}`}
                    >
                      <School size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-primary">
                        {classItem.classroomName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {currentLanguage === "ar"
                          ? "رقم الغرفة:"
                          : currentLanguage === "fr"
                            ? "Numéro de salle:"
                            : "Room #:"}{" "}
                        {classItem.roomNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {currentLanguage === "ar"
                            ? "السعة القصوى"
                            : currentLanguage === "fr"
                              ? "Capacité max"
                              : "Max Capacity"}
                        </span>
                        <span className="text-sm font-medium">
                          {classItem.maxCapacity}
                        </span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(100, (classItem.maxCapacity / 50) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <button className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition-colors group-hover:bg-primary group-hover:text-white">
                      <BookOpen size={16} />
                      <span>
                        {currentLanguage === "ar"
                          ? "عرض التفاصيل"
                          : currentLanguage === "fr"
                            ? "Voir les détails"
                            : "View Details"}
                      </span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Empty state */}
        {data?.data.content.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-borderPrimary bg-bgPrimary px-6 py-16 text-center">
            <School size={48} className="mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {currentLanguage === "ar"
                ? "لا توجد فصول دراسية"
                : currentLanguage === "fr"
                  ? "Pas de classes"
                  : "No Classrooms"}
            </h3>
            <p className="mb-6 max-w-md text-sm text-gray-500">
              {currentLanguage === "ar"
                ? "لم يتم إضافة أي فصول دراسية بعد. أضف فصلًا جديدًا للبدء."
                : currentLanguage === "fr"
                  ? "Aucune classe n'a encore été ajoutée. Ajoutez une nouvelle classe pour commencer."
                  : "No classrooms have been added yet. Add a new class to get started."}
            </p>
            <Link
              href="/classes/add-class"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-hover"
            >
              <Plus size={18} />
              <span>
                {currentLanguage === "ar"
                  ? "إضافة فصل جديد"
                  : currentLanguage === "fr"
                    ? "Ajouter une nouvelle classe"
                    : "Add New Class"}
              </span>
            </Link>
          </div>
        )}

        {/* Upload Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-1">
            <h1 className="mb-2 text-xl font-semibold text-gray-800">
              {currentLanguage === "ar"
                ? "تحميل ملف"
                : currentLanguage === "fr"
                  ? "Télécharger un fichier"
                  : "Upload File"}
            </h1>
            <p className="mb-4 text-sm text-gray-500">
              {currentLanguage === "ar"
                ? "يرجى تحميل الملفات بتنسيق Excel والتأكد من أن حجم الملف أقل من 25 ميجابايت."
                : currentLanguage === "fr"
                  ? "Veuillez télécharger des fichiers au format Excel et assurez-vous que la taille du fichier est inférieure à 25 Mo."
                  : "Please upload files in Excel format and make sure the file size is under 25 MB."}
            </p>

            <form onSubmit={handleUploadEvent} className="space-y-4">
              <div
                className="border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              >
                {!file ? (
                  <div>
                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-primary">
                      <Upload size={20} />
                    </div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      {currentLanguage === "ar"
                        ? "اسحب وأفلت الملف هنا أو"
                        : currentLanguage === "fr"
                          ? "Déposez le fichier ici ou"
                          : "Drop file here or"}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={e =>
                        e.target.files && handleFile(e.target.files[0])
                      }
                      className="hidden"
                      accept=".xlsx,.xls"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-primary bg-bgPrimary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <span>
                        {currentLanguage === "ar"
                          ? "تصفح الملفات"
                          : currentLanguage === "fr"
                            ? "Parcourir les fichiers"
                            : "Browse Files"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full text-primary">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteFile}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {progress}%
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="sheetNumber"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {currentLanguage === "ar"
                    ? "رقم الورقة"
                    : currentLanguage === "fr"
                      ? "Numéro de feuille"
                      : "Sheet Number"}
                </label>
                <input
                  id="sheetNumber"
                  placeholder="0"
                  type="number"
                  value={sheetNumber}
                  onChange={e => setSheetNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {currentLanguage === "ar"
                    ? "أدخل فهرس ورقة Excel (0 للورقة الأولى)"
                    : currentLanguage === "fr"
                      ? "Entrez l'index de la feuille Excel (0 pour la première feuille)"
                      : "Enter the Excel sheet index (0 for the first sheet)"}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-gray-300 bg-bgPrimary px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {currentLanguage === "ar"
                    ? "إلغاء"
                    : currentLanguage === "fr"
                      ? "Annuler"
                      : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-hover disabled:opacity-70"
                  disabled={!file || isUploading}
                >
                  {isUploading
                    ? currentLanguage === "ar"
                      ? "جارٍ التحميل..."
                      : currentLanguage === "fr"
                        ? "Téléchargement..."
                        : "Uploading..."
                    : currentLanguage === "ar"
                      ? "تحميل"
                      : currentLanguage === "fr"
                        ? "Télécharger"
                        : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Infrastructure;
