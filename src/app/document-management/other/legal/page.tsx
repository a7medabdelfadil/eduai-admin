/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useCreateFolderMutation, useDeleteFileMutation, useDeleteFolderMutation, useGetFolderContentsQuery, useUpdateFolderNameMutation, useUploadFileMutation } from "@/features/Document-Management/otherOfficialDocumentsApi";
import { baseUrl } from "@/components/BaseURL";
import { FaArrowLeft, FaArrowRight, FaDownload, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Text } from "@/components/Text";
import { BiSearchAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";

const Legal = () => {
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
      nameEn: "Legal Documents",
      nameAr: "المستندات القانونية",
      nameFr: "Documents juridiques",
      href: "/document-management/other/legal",
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId") ?? undefined;
  const [searchValue, setSearchValue] = useState("");

  const imageExtensions = ["png", "jpg", "jpeg", "webp", "gif"];

  const { data: folderContents, isLoading, refetch, isError } = useGetFolderContentsQuery(folderId);
  const [deleteFile] = useDeleteFileMutation();
  const [deleteFolder] = useDeleteFolderMutation();

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );

  const [folderName, setFolderName] = useState("");
  const [createFolder] = useCreateFolderMutation();
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const [uploadFile] = useUploadFileMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const closeUploadDialogRef = useRef<HTMLButtonElement>(null);
  const [updateFolderName] = useUpdateFolderNameMutation();
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const closeEditDialogRef = useRef<HTMLButtonElement>(null);

  const filteredItems = folderContents?.filter((item: any) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  ) || [];

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  const handleFolderClick = (id: string) => {
    router.push(`?folderId=${id}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>

        <Text font={"bold"} size={"3xl"}>
          {currentLanguage === "ar"
            ? "وثائق رسمية أخرى"
            : currentLanguage === "fr"
              ? "Autres documents officiels"
              : "Other Official Documents"}
        </Text>
        <div className="justify-left ml-4 my-8 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/document-management/other"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/disciplinary">
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link
            className="text-blue-500 underline"
            href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>

        <div className="flex justify-between items-center text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="flex justify-between p-4 text-center max-[502px]:grid max-[502px]:justify-center">
            <div className="mb-3">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative min-w-72 md:min-w-80">
                <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                  <BiSearchAlt className="text-secondary" size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={searchValue}
                    onChange={(e: any) => setSearchValue(e.target.value)}
                    type="text"
                    id="icon"
                    name="icon"
                    className="border-borderSecondary block w-full rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
                    placeholder={
                      currentLanguage === "ar"
                        ? "ابحث عن أي شيء"
                        : currentLanguage === "fr"
                          ? "Rechercher n'importe quoi"
                          : "Search anything"
                    }
                  />
                  <span className="min-w-[120px] text-primary">
                    {filteredItems.length}{" "}
                    {currentLanguage === "ar"
                      ? "نتيجة"
                      : currentLanguage === "fr"
                        ? "Résultat(s)"
                        : "Result(s)"}
                  </span>


                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center flex-wrap mb-5">
            {/* Dialog - Add Folder */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="mx-3 m-0 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl">
                  {currentLanguage === "ar"
                    ? "+ إضافة مجلد"
                    : currentLanguage === "fr"
                      ? "+ Ajouter un dossier"
                      : "+ Add Folder"}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {currentLanguage === "ar"
                      ? "إضافة مجلد جديد"
                      : currentLanguage === "fr"
                        ? "Ajouter un nouveau dossier"
                        : "Add New Folder"}
                  </DialogTitle>
                  <DialogDescription>
                    {currentLanguage === "ar"
                      ? "يرجى إدخال اسم المجلد"
                      : currentLanguage === "fr"
                        ? "Veuillez entrer le nom du dossier"
                        : "Please enter folder name"}
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await createFolder({
                        name: folderName,
                        parentFolderId: folderId || undefined,
                      }).unwrap();
                      setFolderName("");
                      refetch();
                      closeDialogRef.current?.click();
                      toast.success(currentLanguage === "ar" ? "تم إنشاء المجلد بنجاح" : currentLanguage === "fr" ? "Dossier créé avec succès" : "Folder created successfully");
                    } catch (err) {
                      toast.error(currentLanguage === "ar" ? "فشل في إنشاء المجلد" : currentLanguage === "fr" ? "Échec de la création du dossier" : "Failed to create folder");
                    }

                  }}

                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder={
                      currentLanguage === "ar"
                        ? "اسم المجلد"
                        : currentLanguage === "fr"
                          ? "Nom du dossier"
                          : "Folder name"
                    }
                    className="w-full rounded border border-borderPrimary px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        ref={closeDialogRef}
                        type="button"
                        className="rounded px-4 py-2 bg-bgPrimary text-sm hover:bg-bgSecondary"
                      >
                        {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}
                      </button>
                    </DialogClose>
                    <button type="submit" className="rounded px-4 py-2 bg-primary text-white text-sm hover:bg-hover">
                      {currentLanguage === "ar" ? "إنشاء" : currentLanguage === "fr" ? "Créer" : "Create"}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Dialog - Upload File */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="mx-3 m-0 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl">
                  {currentLanguage === "ar"
                    ? "+ رفع ملف"
                    : currentLanguage === "fr"
                      ? "+ Téléverser un fichier"
                      : "+ Upload File"}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {currentLanguage === "ar"
                      ? "رفع ملف جديد"
                      : currentLanguage === "fr"
                        ? "Téléverser un fichier"
                        : "Upload New File"}
                  </DialogTitle>
                  <DialogDescription>
                    {currentLanguage === "ar"
                      ? "اختر الملف من جهازك"
                      : currentLanguage === "fr"
                        ? "Sélectionnez un fichier depuis votre appareil"
                        : "Select a file from your device"}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!fileInputRef.current?.files?.[0]) return;

                    try {
                      await uploadFile({
                        file: fileInputRef.current.files[0],
                        folderId: folderId || undefined,
                      }).unwrap();

                      fileInputRef.current.value = "";
                      refetch();
                      closeUploadDialogRef.current?.click();
                      toast.success(currentLanguage === "ar" ? "تم رفع الملف بنجاح" : currentLanguage === "fr" ? "Fichier téléversé avec succès" : "File uploaded successfully");
                    } catch (err) {
                      toast.error(currentLanguage === "ar" ? "فشل في رفع الملف" : currentLanguage === "fr" ? "Échec du téléversement" : "File upload failed");
                    }

                  }}

                  className="space-y-4"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="w-full text-sm"
                    required
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        ref={closeUploadDialogRef}
                        type="button"
                        className="rounded px-4 py-2 bg-bgPrimary text-sm hover:bg-bgSecondary"
                      >
                        {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}
                      </button>
                    </DialogClose>
                    <button type="submit" className="rounded px-4 py-2 bg-primary text-white text-sm hover:bg-hover">
                      {currentLanguage === "ar" ? "رفع" : currentLanguage === "fr" ? "Téléverser" : "Upload"}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

        </div>
        <div className={`${folderId ? "block" : "invisible"}  px-10 mb-6`}>

          <button
            onClick={() => router.push("/document-management/other/legal")}
            className="rounded flex gap-2 items-center bg-bgPrimary px-4 py-2 text-sm text-gray-700 hover:bg-bgSecondary transition"
          >
            {currentLanguage !== "ar" && <FaArrowLeft />}

            {currentLanguage === "ar"
              ? "الرجوع إلى المجلد الرئيسي"
              : currentLanguage === "fr"
                ? "Retour au dossier principal"
                : "Back to root folder"}

            {currentLanguage === "ar" && <FaArrowRight />}
          </button>

        </div>


        {filteredItems?.length === 0 ? (
          <div className="w-full py-10 text-center text-gray-500 text-sm">
            {currentLanguage === "ar"
              ? "لا توجد ملفات أو مجلدات"
              : currentLanguage === "fr"
                ? "Aucun fichier ou dossier trouvé"
                : "No files or folders found"}
          </div>
        ) : (
          <div className="relative overflow-auto px-10">
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">
                <Spinner />
              </div>
            ) : isError ? (
              <div className="text-red-500 text-center py-10">
                <div className="text-red-500 text-center py-10">
                  {currentLanguage === "ar"
                    ? "حدث خطأ أثناء تحميل المجلدات."
                    : currentLanguage === "fr"
                      ? "Une erreur s'est produite lors du chargement des dossiers."
                      : "An error occurred while loading folders."}
                </div>
              </div>
            ) : (
              <div className="flex gap-8 flex-wrap">
                {filteredItems?.map((item: any) =>
                  item.type === "FOLDER" ? (
                    <div
                      key={item.id}
                      className="relative group grid justify-center gap-4 text-center font-semibold transition"
                    >
                      <button
                        onClick={() => handleFolderClick(item.id)}
                        className="flex flex-col items-center"
                      >
                        <img
                          src="/images/folder.png"
                          alt={item.name}
                          className="object-contain mx-auto"
                        />
                        <p className="truncate max-w-[100px] mt-2 text-sm">{item.name}</p>
                      </button>
                      <div className="absolute top-1 right-1 hidden group-hover:flex gap-2 z-10">
                        {/* Edit */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => {
                                setEditFolderId(item.id);
                                setEditFolderName(item.name);
                              }}
                              className="rounded-full mt-1 bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 transition"
                              title={
                                currentLanguage === "ar"
                                  ? "تعديل"
                                  : currentLanguage === "fr"
                                    ? "Renommer"
                                    : "Rename"
                              }
                            >
                              <FaEdit className="text-[14px]" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>
                                {currentLanguage === "ar"
                                  ? "تعديل اسم المجلد"
                                  : currentLanguage === "fr"
                                    ? "Renommer le dossier"
                                    : "Rename Folder"}
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                if (!editFolderId) return;
                                try {
                                  await updateFolderName({ folderId: editFolderId, newName: editFolderName }).unwrap();
                                  refetch();
                                  closeEditDialogRef.current?.click();
                                  toast.success(
                                    currentLanguage === "ar"
                                      ? "تم التعديل بنجاح"
                                      : currentLanguage === "fr"
                                        ? "Nom du dossier modifié"
                                        : "Folder renamed"
                                  );
                                } catch (err) {
                                  toast.error(
                                    currentLanguage === "ar"
                                      ? "فشل في تعديل الاسم"
                                      : currentLanguage === "fr"
                                        ? "Échec de la modification du nom"
                                        : "Rename failed"
                                  );
                                }
                              }}
                              className="space-y-4"
                            >
                              <input
                                value={editFolderName}
                                onChange={(e) => setEditFolderName(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm"
                                required
                              />
                              <DialogFooter>
                                <DialogClose asChild>
                                  <button
                                    ref={closeEditDialogRef}
                                    className="rounded px-4 py-2 bg-bgPrimary text-sm hover:bg-bgSecondary">
                                    {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                                  </button>
                                </DialogClose>
                                <button
                                  type="submit"
                                  className="rounded px-4 py-2 bg-primary text-white text-sm hover:bg-hover"
                                >
                                  {currentLanguage === "ar"
                                    ? "تعديل"
                                    : currentLanguage === "fr"
                                      ? "Renommer"
                                      : "Rename"}
                                </button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}

                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="absolute top-1 right-8 hidden group-hover:flex items-center justify-center rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                              title={
                                currentLanguage === "ar"
                                  ? "حذف المجلد"
                                  : currentLanguage === "fr"
                                    ? "Supprimer le dossier"
                                    : "Delete Folder"
                              }
                            >
                              <FaTrashAlt className="text-[14px]" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>{currentLanguage === "ar" ? "هل أنت متأكد؟" : currentLanguage === "fr" ? "Êtes-vous sûr ?" : "Are you sure?"}</DialogTitle>
                              <DialogDescription>
                                {currentLanguage === "ar"
                                  ? "هل تريد حذف هذا المجلد؟ لا يمكن التراجع عن هذا الإجراء."
                                  : currentLanguage === "fr"
                                    ? "Voulez-vous supprimer ce dossier ? Cette action est irréversible."
                                    : "Do you want to delete this folder? This action cannot be undone."}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-between">
                              <DialogClose asChild>
                                <button className="rounded px-4 py-2 bg-bgPrimary text-sm hover:bg-bgSecondary">
                                  {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}
                                </button>
                              </DialogClose>
                              <DialogClose asChild>
                                <button
                                  onClick={async () => {
                                    try {
                                      await deleteFolder(item.id).unwrap();
                                      refetch();
                                      toast.success(currentLanguage === "ar" ? "تم حذف المجلد بنجاح" : currentLanguage === "fr" ? "Dossier supprimé avec succès" : "Folder deleted successfully");
                                    } catch (err) {
                                      toast.error(currentLanguage === "ar" ? "فشل في حذف المجلد" : currentLanguage === "fr" ? "Échec de la suppression du dossier" : "Failed to delete folder");
                                    }
                                  }}
                                  className="rounded px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700"
                                >
                                  {currentLanguage === "ar" ? "تأكيد الحذف" : currentLanguage === "fr" ? "Confirmer la suppression" : "Confirm Delete"}
                                </button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                    </div>

                  ) : (
                    <div
                      key={item.id}
                      className="relative group grid justify-center gap-2 text-center font-semibold"
                    >
                      <div className="relative">
                        <img
                          src={
                            imageExtensions.includes(item.extension?.toLowerCase())
                              ? `${baseUrl}/api/v1/files/view-file/public/${item.id}`
                              : "/images/file.png"
                          }
                          alt={item.name}
                          className="w-[100px] h-[100px] object-contain mx-auto"
                        />

                        {/* ACTIONS */}
                        <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                          {/* Download */}
                          <a
                            href={`${baseUrl}/api/v1/files/download-file/public/${item.id}`}
                            download
                            className="flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 transition"
                            title={
                              currentLanguage === "ar"
                                ? "تحميل"
                                : currentLanguage === "fr"
                                  ? "Télécharger"
                                  : "Download"
                            }
                          >
                            <FaDownload className="text-[14px]" />
                          </a>

                          {/* Delete */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className="flex items-center justify-center rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                                title={
                                  currentLanguage === "ar"
                                    ? "حذف"
                                    : currentLanguage === "fr"
                                      ? "Supprimer"
                                      : "Delete"
                                }
                              >
                                <FaTrashAlt className="text-[14px]" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                              <DialogHeader>
                                <DialogTitle
                                >
                                  {currentLanguage === "ar"
                                    ? "هل أنت متأكد؟"
                                    : currentLanguage === "fr"
                                      ? "Êtes-vous sûr ?"
                                      : "Are you sure?"}
                                </DialogTitle>

                                <DialogDescription>
                                  {currentLanguage === "ar"
                                    ? "هل تريد حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء."
                                    : currentLanguage === "fr"
                                      ? "Voulez-vous supprimer ce fichier ? Cette action est irréversible."
                                      : "Do you want to delete this file? This action cannot be undone."}
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-between">
                                <DialogClose asChild>
                                  <button className="rounded px-4 py-2 bg-bgPrimary text-sm hover:bg-bgSecondary">
                                    {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}

                                  </button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await deleteFile(item.id).unwrap();
                                        refetch();
                                        toast.success(currentLanguage === "ar" ? "تم حذف الملف بنجاح" : currentLanguage === "fr" ? "Fichier supprimé avec succès" : "File deleted successfully");
                                      } catch (err) {
                                        toast.error(currentLanguage === "ar" ? "فشل في حذف الملف" : currentLanguage === "fr" ? "Échec de la suppression du fichier" : "Failed to delete file");
                                      }
                                    }}
                                    className="rounded px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700"
                                  >
                                    {currentLanguage === "ar"
                                      ? "تأكيد الحذف"
                                      : currentLanguage === "fr"
                                        ? "Confirmer la suppression"
                                        : "Confirm Delete"}
                                  </button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <p className="truncate max-w-[100px] text-sm mt-2">
                        {item.name}.{item.extension}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </Container>
    </Suspense >
  );
};

export default Legal;
