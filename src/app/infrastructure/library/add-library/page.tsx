"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useCreateRoomMutation } from "@/features/Infrastructure/roomApi";
import { useRouter } from "next/navigation";

const AddNewLibrary = () => {
    const breadcrumbs = [
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
            nameEn: "Add Library",
            nameAr: "إضافة مكتبة",
            nameFr: "Ajouter une bibliothèque",
            href: "/infrastructure/library/add-library",
        },
    ];

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [createRoom, { isLoading }] = useCreateRoomMutation();
    const { language: currentLanguage, loading } = useSelector(
        (state: RootState) => state.language
    );

    const onSubmit = async (data: any) => {
        try {
            await createRoom({
                ...data,
                type: "EDUCATIONAL",
                category: "LIBRARY",
            }).unwrap();
            toast.success("Room created successfully");
            router.push("/infrastructure/library")
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create room");
        }
    };

    if (loading)
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
            </div>
        );

    return (
        <>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
            <Container>
                <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">
                        {currentLanguage === "en"
                            ? "Add New Room"
                            : currentLanguage === "ar"
                                ? "إضافة غرفة جديدة"
                                : currentLanguage === "fr"
                                    ? "Ajouter une nouvelle salle"
                                    : "Add New Room"}
                    </h1>
                </div>
                <form
                    className="flex h-full w-full items-center justify-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <h1 className="text-[22px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Room Information"
                                    : currentLanguage === "ar"
                                        ? "معلومات الغرفة"
                                        : currentLanguage === "fr"
                                            ? "Informations sur la salle"
                                            : "Room Information"}
                            </h1>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
                            <label htmlFor="buildingNumber" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Building Number"
                                    : currentLanguage === "ar"
                                        ? "رقم المبنى"
                                        : currentLanguage === "fr"
                                            ? "Numéro du bâtiment"
                                            : "Building Number"}
                                <input
                                    id="buildingNumber"
                                    {...register("buildingNumber", { required: true })}
                                    type="text"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.buildingNumber && (
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

                            <label htmlFor="roomNumber" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Room Number"
                                    : currentLanguage === "ar"
                                        ? "رقم الغرفة"
                                        : currentLanguage === "fr"
                                            ? "Numéro de la salle"
                                            : "Room Number"}
                                <input
                                    id="roomNumber"
                                    {...register("roomNumber", { required: true })}
                                    type="text"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.roomNumber && (
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

                            <label htmlFor="floorNumber" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Floor Number"
                                    : currentLanguage === "ar"
                                        ? "رقم الطابق"
                                        : currentLanguage === "fr"
                                            ? "Numéro d'étage"
                                            : "Floor Number"}
                                <input
                                    id="floorNumber"
                                    {...register("floorNumber", { required: true })}
                                    type="number"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.floorNumber && (
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

                            <label htmlFor="maxCapacity" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Max Capacity"
                                    : currentLanguage === "ar"
                                        ? "الحد الأقصى للسعة"
                                        : currentLanguage === "fr"
                                            ? "Capacité maximale"
                                            : "Max Capacity"}
                                <input
                                    id="maxCapacity"
                                    {...register("maxCapacity", { required: true })}
                                    type="number"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.maxCapacity && (
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
                                        ? "Add Room"
                                        : currentLanguage === "ar"
                                            ? "إضافة غرفة"
                                            : currentLanguage === "fr"
                                                ? "Ajouter une salle"
                                                : "Add Room"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </Container>
        </>
    );
};

export default AddNewLibrary;
