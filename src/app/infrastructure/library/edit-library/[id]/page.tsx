"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
} from "@/features/Infrastructure/roomApi";
import { useParams, useRouter } from "next/navigation";

const EditLibrary = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading: isFetching } = useGetRoomByIdQuery(id);
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  useEffect(() => {
    if (data?.data) {
      const room = data.data;
      setValue("buildingNumber", room.buildingNumber);
      setValue("roomNumber", room.roomNumber);
      setValue("floorNumber", room.floorNumber);
      setValue("maxCapacity", room.maxCapacity);
      setValue("status", room.status?.toUpperCase());
    }
  }, [data, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      await updateRoom({
        id,
        formData: {
          ...formData,
          type: "EDUCATIONAL",
          category: "LIBRARY",
        },
      }).unwrap();
      toast.success("Room updated successfully");
      router.push("/infrastructure/library");
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (loading || isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs
        breadcrumbs={[
          {
            nameEn: "Administration",
            nameAr: "الإدارة",
            nameFr: "Administration",
            href: "/",
          },
          {
            nameEn: "Infrastructure",
            nameAr: "الدورات والموارد",
            nameFr: "Cours et Ressources",
            href: "/infrastructure",
          },
          {
            nameEn: "Library",
            nameAr: "المكتبة",
            nameFr: "bibliothèque",
            href: "/infrastructure/library",
          },
          {
            nameEn: "Edit Library",
            nameAr: "تعديل المكتبة",
            nameFr: "Modifier la bibliothèque",
            href: `/infrastructure/library/edit-library/${id}`,
          },
        ]}
      />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Edit Room"
              : currentLanguage === "ar"
                ? "تعديل الغرفة"
                : currentLanguage === "fr"
                  ? "Modifier la salle"
                  : "Edit Room"}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              {[
                {
                  id: "buildingNumber",
                  labelEn: "Building Number",
                  labelAr: "رقم المبنى",
                  labelFr: "Numéro du bâtiment",
                  type: "text",
                },
                {
                  id: "roomNumber",
                  labelEn: "Room Number",
                  labelAr: "رقم الغرفة",
                  labelFr: "Numéro de la salle",
                  type: "text",
                },
                {
                  id: "floorNumber",
                  labelEn: "Floor Number",
                  labelAr: "رقم الطابق",
                  labelFr: "Numéro d'étage",
                  type: "number",
                },
                {
                  id: "maxCapacity",
                  labelEn: "Max Capacity",
                  labelAr: "الحد الأقصى للسعة",
                  labelFr: "Capacité maximale",
                  type: "number",
                },
              ].map(field => (
                <label
                  key={field.id}
                  htmlFor={field.id}
                  className="grid text-[18px] font-semibold"
                >
                  {currentLanguage === "en"
                    ? field.labelEn
                    : currentLanguage === "ar"
                      ? field.labelAr
                      : currentLanguage === "fr"
                        ? field.labelFr
                        : field.labelEn}
                  <input
                    id={field.id}
                    {...register(field.id, { required: true })}
                    type={field.type}
                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  />
                  {errors[field.id] && (
                    <span className="text-error">
                      {currentLanguage === "en"
                        ? "This field is required"
                        : currentLanguage === "ar"
                          ? "هذا الحقل مطلوب"
                          : currentLanguage === "fr"
                            ? "Ce champ est requis"
                            : "This field is required"}
                    </span>
                  )}
                </label>
              ))}

              {/* Status */}
              <div className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Status"
                  : currentLanguage === "ar"
                    ? "الحالة"
                    : currentLanguage === "fr"
                      ? "Statut"
                      : "Status"}
                <div className="mt-2 flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="AVAILABLE"
                      {...register("status", { required: true })}
                    />
                    <span>
                      {currentLanguage === "en"
                        ? "Available"
                        : currentLanguage === "ar"
                          ? "متاحة"
                          : "Disponible"}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="UNAVAILABLE"
                      {...register("status", { required: true })}
                    />
                    <span>
                      {currentLanguage === "en"
                        ? "Unavailable"
                        : currentLanguage === "ar"
                          ? "غير متاحة"
                          : "Indisponible"}
                    </span>
                  </label>
                </div>
                {errors.status && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "Please select a status"
                      : currentLanguage === "ar"
                        ? "يرجى اختيار الحالة"
                        : "Veuillez sélectionner un statut"}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-center text-center">
              {isUpdating ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Update Room"
                    : currentLanguage === "ar"
                      ? "تحديث الغرفة"
                      : currentLanguage === "fr"
                        ? "Mettre à jour"
                        : "Update Room"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditLibrary;
