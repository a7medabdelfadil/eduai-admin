"use client";
import {
  useGetEventByIdQuery,
  useUpdateEventsMutation,
} from "@/features/events/eventsApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  params: {
    eventId: number;
  };
};

const UpdateEvent = ({ params }: Props) => {
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
      nameAr: "الاحداث",
      nameFr: "événements",
      href: "/educational-affairs/events",
    },
    {
      nameEn: `Update Event`,
      nameAr: `événement de mise à jour`,
      nameFr: `تعديل حدث`,
      href: `/educational-affairs/events/${params.eventId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  // Define the validation schema
  const schema = z
    .object({
      title_en: z.string().nonempty({ message: "This field is required" }),
      title_ar: z.string().nonempty({ message: "This field is required" }),
      title_fr: z.string().nonempty({ message: "This field is required" }),
      description_en: z
        .string()
        .nonempty({ message: "This field is required" }),
      description_ar: z
        .string()
        .nonempty({ message: "This field is required" }),
      description_fr: z
        .string()
        .nonempty({ message: "This field is required" }),
      startTime: z.string().nonempty({ message: "This field is required" }),
      endTime: z.string().nonempty({ message: "This field is required" }),
    })
    .refine(data => new Date(data.startTime) <= new Date(data.endTime), {
      message: "Start Time must be before End Time",
      path: ["startTime"],
    });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [updateEvent, { isLoading }] = useUpdateEventsMutation();
  const { data: eventData, isLoading: isEventLoading } = useGetEventByIdQuery(
    params.eventId,
  );

  useEffect(() => {
    if (eventData && eventData.data) {
      reset({
        title_en: eventData.data.title,
        title_ar: eventData.data.title,
        title_fr: eventData.data.title,
        description_en: eventData.data.description,
        description_ar: eventData.data.description,
        description_fr: eventData.data.description,
        startTime: eventData.data.startDate,
        endTime: eventData.data.endDate,
      });
    }
  }, [eventData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateEvent({ id: params.eventId, formData: data }).unwrap();
      toast.success("Event updated successfully");
    } catch (err) {
      toast.error("Failed to update event");
    }
  };

  // Function to get error message based on current language
  const getErrorMessage = (message: string) => {
    switch (message) {
      case "This field is required":
        return currentLanguage === "en"
          ? "This field is required"
          : currentLanguage === "ar"
            ? "هذا الحقل مطلوب"
            : currentLanguage === "fr"
              ? "Ce champ est requis"
              : "This field is required";
      case "Start Time must be before End Time":
        return currentLanguage === "en"
          ? "Start Time must be before End Time"
          : currentLanguage === "ar"
            ? "وقت البدء يجب أن يكون قبل وقت الانتهاء"
            : currentLanguage === "fr"
              ? "L'heure de début doit être avant l'heure de fin"
              : "Start Time must be before End Time";
      default:
        return message;
    }
  };

  if (loading || isEventLoading)
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
        } mx-[5px] mt-[40px] grid h-[500px] items-center justify-center`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid h-auto items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:h-auto xl:w-[1000px]">
            <div className="flex items-center justify-start gap-2">
              <h1 className="font-sans text-[22px] font-semibold">
                {currentLanguage === "en"
                  ? "Event Information"
                  : currentLanguage === "ar"
                    ? "معلومات الحدث"
                    : currentLanguage === "fr"
                      ? "Informations sur l'événement"
                      : "Event Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              {/* Title English */}
              <label
                htmlFor="title_en"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Title (English)"
                  : currentLanguage === "ar"
                    ? "عنوان الحدث (بالإنجليزية)"
                    : currentLanguage === "fr"
                      ? "Titre de l'événement (Anglais)"
                      : "Event Title (English)"}
                <input
                  id="title_en"
                  {...register("title_en")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.title_en && (
                  <span className="text-error">
                    {getErrorMessage(errors.title_en.message || "")}
                  </span>
                )}
              </label>
              {/* Title Arabic */}
              <label
                htmlFor="title_ar"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Title (Arabic)"
                  : currentLanguage === "ar"
                    ? "عنوان الحدث (بالعربية)"
                    : currentLanguage === "fr"
                      ? "Titre de l'événement (Arabe)"
                      : "Event Title (Arabic)"}
                <input
                  id="title_ar"
                  {...register("title_ar")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.title_ar && (
                  <span className="text-error">
                    {getErrorMessage(errors.title_ar.message || "")}
                  </span>
                )}
              </label>
              {/* Title French */}
              <label
                htmlFor="title_fr"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Title (French)"
                  : currentLanguage === "ar"
                    ? "عنوان الحدث (بالفرنسية)"
                    : currentLanguage === "fr"
                      ? "Titre de l'événement (Français)"
                      : "Event Title (French)"}
                <input
                  id="title_fr"
                  {...register("title_fr")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.title_fr && (
                  <span className="text-error">
                    {getErrorMessage(errors.title_fr.message || "")}
                  </span>
                )}
              </label>
              {/* Description English */}
              <label
                htmlFor="description_en"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Description (English)"
                  : currentLanguage === "ar"
                    ? "وصف الحدث (بالإنجليزية)"
                    : currentLanguage === "fr"
                      ? "Description de l'événement (Anglais)"
                      : "Event Description (English)"}
                <input
                  id="description_en"
                  {...register("description_en")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_en && (
                  <span className="text-error">
                    {getErrorMessage(errors.description_en.message || "")}
                  </span>
                )}
              </label>
              {/* Description Arabic */}
              <label
                htmlFor="description_ar"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Description (Arabic)"
                  : currentLanguage === "ar"
                    ? "وصف الحدث (بالعربية)"
                    : currentLanguage === "fr"
                      ? "Description de l'événement (Arabe)"
                      : "Event Description (Arabic)"}
                <input
                  id="description_ar"
                  {...register("description_ar")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_ar && (
                  <span className="text-error">
                    {getErrorMessage(errors.description_ar.message || "")}
                  </span>
                )}
              </label>
              {/* Description French */}
              <label
                htmlFor="description_fr"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Event Description (French)"
                  : currentLanguage === "ar"
                    ? "وصف الحدث (بالفرنسية)"
                    : currentLanguage === "fr"
                      ? "Description de l'événement (Français)"
                      : "Event Description (French)"}
                <input
                  id="description_fr"
                  {...register("description_fr")}
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.description_fr && (
                  <span className="text-error">
                    {getErrorMessage(errors.description_fr.message || "")}
                  </span>
                )}
              </label>
              {/* Start Time */}
              <label
                htmlFor="startTime"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Start Time"
                  : currentLanguage === "ar"
                    ? "وقت البدء"
                    : currentLanguage === "fr"
                      ? "Heure de début"
                      : "Start Time"}
                <input
                  id="startTime"
                  {...register("startTime")}
                  type="datetime-local"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.startTime && (
                  <span className="text-error">
                    {getErrorMessage(errors.startTime.message || "")}
                  </span>
                )}
              </label>
              {/* End Time */}
              <label
                htmlFor="endTime"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "End Time"
                  : currentLanguage === "ar"
                    ? "وقت الانتهاء"
                    : currentLanguage === "fr"
                      ? "Heure de fin"
                      : "End Time"}
                <input
                  id="endTime"
                  {...register("endTime")}
                  type="datetime-local"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.endTime && (
                  <span className="text-error">
                    {getErrorMessage(errors.endTime.message || "")}
                  </span>
                )}
              </label>
              {/* Active */}
            </div>
            <div className="flex justify-center text-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Update Event"
                    : currentLanguage === "ar"
                      ? "تحديث الحدث"
                      : currentLanguage === "fr"
                        ? "Mettre à jour l'événement"
                        : "Update Event"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateEvent;
