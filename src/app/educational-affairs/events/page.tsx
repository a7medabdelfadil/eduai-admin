"use client";

import Modal from "@/components/model";
import Spinner from "@/components/spinner";
import Timeline from "@/components/timeLine";
import {
  useGetAllEventsQuery,
  useCreateEventsMutation,
  useDeleteEventsMutation,
} from "@/features/events/eventsApi";
import { RootState } from "@/GlobalRedux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";

const eventSchema = z
  .object({
    creatorId: z.string().optional(),
    startTime: z.string().nonempty({ message: "Start time is required" }),
    endTime: z.string().nonempty({ message: "End time is required" }),
    title_en: z.string().nonempty({ message: "Title in English is required" }),
    title_ar: z.string().nonempty({ message: "Title in Arabic is required" }),
    title_fr: z.string().nonempty({ message: "Title in French is required" }),
    description_en: z
      .string()
      .nonempty({ message: "Description in English is required" }),
    description_ar: z
      .string()
      .nonempty({ message: "Description in Arabic is required" }),
    description_fr: z
      .string()
      .nonempty({ message: "Description in French is required" }),
    file: z.any().optional(),
  })
  .refine(data => new Date(data.startTime) <= new Date(data.endTime), {
    message: "Start Time must be before End Time",
    path: ["startTime"],
  });

const Events = () => {
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
      nameEn: "Events",
      nameAr: "الشئون التعليمية",
      nameFr: "Événements",
      href: "/educational-affairs/events",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading, refetch } = useGetAllEventsQuery(null);
  const [createEvent] = useCreateEventsMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };
  const ID = useSelector((state: RootState) => state.user.id);
  const [deleteEvent] = useDeleteEventsMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      // Create JSON object for request key
      const requestData = {
        creatorId: ID,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        title_fr: formData.title_fr,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        description_fr: formData.description_fr,
      };
      // Append the JSON data as a string to FormData
      formDataToSend.append("request", JSON.stringify(requestData));

      // Append the file if it exists
      const file = formData.file?.[0];
      if (file) {
        formDataToSend.append("file", file); // Append the file correctly
      }

      await createEvent(formDataToSend).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء الحدث بنجاح"
          : currentLanguage === "fr"
            ? "Événement créé avec succès"
            : "Event created successfully",
      );
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  // Function to get error message based on current language
  const getErrorMessage = (message: string) => {
    switch (message) {
      case "Start time is required":
        return currentLanguage === "ar"
          ? "وقت البدء مطلوب"
          : currentLanguage === "fr"
            ? "L'heure de début est requise"
            : "Start time is required";
      case "End time is required":
        return currentLanguage === "ar"
          ? "وقت الانتهاء مطلوب"
          : currentLanguage === "fr"
            ? "L'heure de fin est requise"
            : "End time is required";
      case "Title in English is required":
        return currentLanguage === "ar"
          ? "العنوان بالإنجليزية مطلوب"
          : currentLanguage === "fr"
            ? "Le titre en anglais est requis"
            : "Title in English is required";
      case "Title in Arabic is required":
        return currentLanguage === "ar"
          ? "العنوان بالعربية مطلوب"
          : currentLanguage === "fr"
            ? "Le titre en arabe est requis"
            : "Title in Arabic is required";
      case "Title in French is required":
        return currentLanguage === "ar"
          ? "العنوان بالفرنسية مطلوب"
          : currentLanguage === "fr"
            ? "Le titre en français est requis"
            : "Title in French is required";
      case "Description in English is required":
        return currentLanguage === "ar"
          ? "الوصف بالإنجليزية مطلوب"
          : currentLanguage === "fr"
            ? "La description en anglais est requise"
            : "Description in English is required";
      case "Description in Arabic is required":
        return currentLanguage === "ar"
          ? "الوصف بالعربية مطلوب"
          : currentLanguage === "fr"
            ? "La description en arabe est requise"
            : "Description in Arabic is required";
      case "Description in French is required":
        return currentLanguage === "ar"
          ? "الوصف بالفرنسية مطلوب"
          : currentLanguage === "fr"
            ? "La description en français est requise"
            : "Description in French is required";
      case "Start Time must be before End Time":
        return currentLanguage === "ar"
          ? "يجب أن يكون وقت البدء قبل وقت الانتهاء"
          : currentLanguage === "fr"
            ? "L'heure de début doit être avant l'heure de fin"
            : "Start Time must be before End Time";
      default:
        return message;
    }
  };

  if (loading || isLoading)
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
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mt-7`}
      >
        <div className="flex justify-end">
          <button
            onClick={handleOpenModal}
            className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
          >
            {currentLanguage === "ar"
              ? "+ إضافة حدث"
              : currentLanguage === "fr"
                ? "+ Ajouter un événement"
                : "+ Add Event"}
          </button>
        </div>
        <Timeline meetings={data?.data.content} handleDelete={handleDelete} />
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="mb-4 text-xl font-light text-textPrimary">
            {currentLanguage === "ar"
              ? "إنشاء حدث"
              : currentLanguage === "fr"
                ? "Créer un événement"
                : "Create Event"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5"
            encType="multipart/form-data"
          >
            {/* Start Time */}
            <div className="mb-4">
              <input
                type="datetime-local"
                {...register("startTime")}
                placeholder="Start Time"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startTime && (
                <p className="text-error">
                  {getErrorMessage(errors.startTime.message?.toString() || "")}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className="mb-4">
              <input
                type="datetime-local"
                {...register("endTime")}
                placeholder="End Time"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.endTime && (
                <p className="text-error">
                  {getErrorMessage(errors.endTime.message?.toString() || "")}
                </p>
              )}
            </div>

            {/* Title in English */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_en")}
                placeholder="Title (English)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_en && (
                <p className="text-error">
                  {getErrorMessage(errors.title_en.message?.toString() || "")}
                </p>
              )}
            </div>

            {/* Title in Arabic */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_ar")}
                placeholder="Title (Arabic)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_ar && (
                <p className="text-error">
                  {getErrorMessage(errors.title_ar.message?.toString() || "")}
                </p>
              )}
            </div>

            {/* Title in French */}
            <div className="mb-4">
              <input
                type="text"
                {...register("title_fr")}
                placeholder="Title (French)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title_fr && (
                <p className="text-error">
                  {getErrorMessage(errors.title_fr.message?.toString() || "")}
                </p>
              )}
            </div>

            {/* Description in English */}
            <div className="mb-4">
              <input
                {...register("description_en")}
                placeholder="Description (English)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_en && (
                <p className="text-error">
                  {getErrorMessage(
                    errors.description_en.message?.toString() || "",
                  )}
                </p>
              )}
            </div>

            {/* Description in Arabic */}
            <div className="mb-4">
              <input
                {...register("description_ar")}
                placeholder="Description (Arabic)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_ar && (
                <p className="text-error">
                  {getErrorMessage(
                    errors.description_ar.message?.toString() || "",
                  )}
                </p>
              )}
            </div>

            {/* Description in French */}
            <div className="mb-4">
              <input
                {...register("description_fr")}
                placeholder="Description (French)"
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description_fr && (
                <p className="text-error">
                  {getErrorMessage(
                    errors.description_fr.message?.toString() || "",
                  )}
                </p>
              )}
            </div>

            {/* File Input */}
            <div className="mb-4">
              <input
                type="file"
                {...register("file")}
                className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-2 text-textSecondary shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.file && (
                <p className="text-error">
                  {getErrorMessage(errors.file.message?.toString() || "")}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إضافة"
                  : currentLanguage === "fr"
                    ? "Ajouter"
                    : "Add"}
              </button>
              <button
                onClick={handleCloseModal}
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-error px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#af4747] hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إلغاء"
                  : currentLanguage === "fr"
                    ? "Annuler"
                    : "Cancel"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Events;
