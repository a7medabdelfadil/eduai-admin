"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import {
  useGetAllTeacherScheduleQuery,
  useDeleteSchedualMutation,
} from "@/features/Acadimic/scheduleApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import TimeTable from "@/components/TimeTable";
import Spinner from "@/components/spinner";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useGetAllTeachersQuery } from "@/features/User-Management/teacherApi";
import { toast } from "react-toastify";
import Modal from "@/components/model";
import { useUploadEventMutation } from "@/features/events/eventsApi";
import { Trash2 } from "lucide-react";
import Container from "@/components/Container";

const Schedule = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الشئون التعليمية",
      nameFr: "Affaires éducatives",
      href: "/educational-affairs",
    },
    {
      nameEn: "Schedule",
      nameAr: "الجدول",
      nameFr: "Emploi du temps",
      href: "/educational-affairs/schedule",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { register, watch } = useForm();
  const selectedTeacherId = watch("teacherId");
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadEvent, { isLoading: isUploading }] = useUploadEventMutation();

  // File Upload State
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

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error("Can not Delete post");
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

  const { data, isLoading, refetch } = useGetAllTeacherScheduleQuery(
    selectedTeacherId,
    {
      skip: !selectedTeacherId,
    },
  );

  const [deleteEvent] = useDeleteSchedualMutation();

  const { data: teachers, isLoading: isTeacher } = useGetAllTeachersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isTeacher)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="mb-6 mr-5 flex justify-between max-[540px]:my-1 max-[540px]:mr-0 max-[540px]:grid max-[540px]:justify-center">
          <div className="ml-2 flex items-center justify-start gap-3 text-xl font-semibold max-[540px]:mb-2 max-[540px]:ml-0 max-[540px]:justify-center">
            <Link
              className="text-primary underline"
              href="/educational-affairs/schedule"
            >
              {currentLanguage === "ar"
                ? "معلم"
                : currentLanguage === "fr"
                  ? "Enseignant"
                  : "Teacher"}
            </Link>
            <Link
              className="transition hover:text-primary hover:underline"
              href="/educational-affairs/schedule/class"
            >
              {currentLanguage === "ar"
                ? "الصف"
                : currentLanguage === "fr"
                  ? "Classe"
                  : "Class"}
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-3 md:flex-row">
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-primary bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة جدول"
                : currentLanguage === "fr"
                  ? "ajouter un horaire"
                  : "Upload Schedule"}
              <svg
                className="h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <line x1="12" y1="5" x2="12" y2="19" />{" "}
                <line x1="16" y1="9" x2="12" y2="5" />{" "}
                <line x1="8" y1="9" x2="12" y2="5" />
              </svg>
            </button>
            <Link
              href="/educational-affairs/schedule/add-schedule"
              className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة جدول"
                : currentLanguage === "fr"
                  ? "ajouter un horaire"
                  : "Add schedule"}
            </Link>
            <select
              id="teacherCourseRegistrationId"
              className="rounded-lg border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-sm outline-none"
              {...register("teacherId", { required: true })}
            >
              <option value="">Select Teacher</option>
              {teachers?.data.content.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isLoading && <Spinner />}
        <TimeTable
          handleDelete={handleDelete}
          scheduleData={data?.data?.content ? data?.data?.content : []}
        />
      </Container>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1 className="text-lg font-semibold">Upload File</h1>
        <p className="mb-4 font-light text-secondary">
          Please upload files in Excel format and make sure the file size is
          under 25 MB.
        </p>
        <form onSubmit={handleUploadEvent} className="space-y-4">
          <div
            className="rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center">
                <div className="mb-4">Drop file or Browse</div>
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
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-hover"
                >
                  Browse
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-600">
                      <svg
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        Format: {file.type || "Excel"} file size:{" "}
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    className="text-gray-500 hover:text-red-500"
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
                <div className="text-right text-sm text-gray-500">
                  {progress}%
                </div>
              </div>
            )}
          </div>
          <input
            placeholder="Sheet Number"
            type="number"
            value={sheetNumber}
            onChange={e => setSheetNumber(e.target.value)}
            className="w-full rounded-lg border border-borderPrimary p-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2 text-white hover:bg-hover"
            disabled={!file}
          >
            {isUploading ? "uploading..." : "Upload"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Schedule;
