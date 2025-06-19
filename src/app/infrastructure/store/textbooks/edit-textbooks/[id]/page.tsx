"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useParams, useRouter } from "next/navigation";
import {
    useGetResourceByIdQuery,
    useUpdateResourceMutation,
} from "@/features/Infrastructure/storeApi";

const EditDigitalResource = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data, isLoading: isFetching } = useGetResourceByIdQuery(id);
    const [updateResource, { isLoading: isUpdating }] = useUpdateResourceMutation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const { language: currentLanguage, loading } = useSelector(
        (state: RootState) => state.language
    );

    useEffect(() => {
        if (data?.data) {
            setValue("name", data.data.name);
            setValue("totalCount", data.data.totalCount);
        }
    }, [data, setValue]);

    const onSubmit = async (formData: any) => {
        try {
            await updateResource({
                id,
                body: {
                    ...formData,
                    resourceType: "TEXTBOOKS",
                },
            }).unwrap();
            toast.success("Resource updated successfully");
            router.push("/infrastructure/store/textbooks");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update resource");
        }
    };

    if (loading || isFetching)
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
            </div>
        );

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
                        nameEn: "Textbooks",
                        nameAr: "كتب دراسية",
                        nameFr: "Manuels",
                        href: "/infrastructure/store/textbooks",
                    },
                    {
                        nameEn: "Edit Textbooks",
                        nameAr: "تعديل كتب دراسية",
                        nameFr: "Modifier les manuels",
                        href: `/infrastructure/store/textbooks/edit-textbooks/${id}`,
                    },
                ]}
            />
            <Container>
                <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">
                        {currentLanguage === "en"
                            ? "Edit Textbooks Resource"
                            : currentLanguage === "ar"
                                ? "تعديل مورد كتب دراسية"
                                : currentLanguage === "fr"
                                    ? "Modifier la ressource de manuels"
                                    : "Edit Textbooks Resource"}
                    </h1>
                </div>
                <form
                    className="flex h-full w-full items-center justify-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
                        <div className="mb-8 flex items-center justify-start gap-2">
                            <svg
                                className="h-6 w-6 font-bold text-secondary group-hover:text-hover"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1="3" y1="21" x2="21" y2="21" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                                <polyline points="5 6 12 3 19 6" />
                                <line x1="4" y1="10" x2="4" y2="21" />
                                <line x1="20" y1="10" x2="20" y2="21" />
                                <line x1="8" y1="14" x2="8" y2="17" />
                                <line x1="12" y1="14" x2="12" y2="17" />
                                <line x1="16" y1="14" x2="16" y2="17" />
                            </svg>
                            <h1 className="text-[22px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Edit Textbooks Resource"
                                    : currentLanguage === "ar"
                                        ? "تعديل مورد كتب دراسية"
                                        : currentLanguage === "fr"
                                            ? "Modifier la ressource de manuels"
                                            : "Edit Textbooks Resource"}
                                {/* default */}
                            </h1>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
                            <label htmlFor="name" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Resource Name"
                                    : currentLanguage === "ar"
                                        ? "اسم المورد"
                                        : currentLanguage === "fr"
                                            ? "Nom de la ressource"
                                            : "Resource Name"}
                                <input
                                    id="name"
                                    {...register("name", { required: true })}
                                    type="text"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.name && (
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

                            <label htmlFor="totalCount" className="grid text-[18px] font-semibold">
                                {currentLanguage === "en"
                                    ? "Total Count"
                                    : currentLanguage === "ar"
                                        ? "العدد الكلي"
                                        : currentLanguage === "fr"
                                            ? "Nombre total"
                                            : "Total Count"}
                                <input
                                    id="totalCount"
                                    {...register("totalCount", { required: true })}
                                    type="number"
                                    className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                                />
                                {errors.totalCount && (
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

                        <div className="flex justify-center text-center mt-4">
                            {isUpdating ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                                >
                                    {currentLanguage === "en"
                                        ? "Update Resource"
                                        : currentLanguage === "ar"
                                            ? "تحديث المورد"
                                            : currentLanguage === "fr"
                                                ? "Mettre à jour la ressource"
                                                : "Update Resource"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </Container>
        </>
    );
};

export default EditDigitalResource;
