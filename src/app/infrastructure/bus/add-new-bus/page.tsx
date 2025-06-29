"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useCreateBussMutation } from "@/features/Infrastructure/busApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";

const AddNewBus = () => {
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
      nameEn: "Bus",
      nameAr: "حافلة",
      nameFr: "Autobus",
      href: "/infrastructure/bus",
    },
    {
      nameEn: "Add New Bus",
      nameAr: "إضافة حافلة جديدة",
      nameFr: "Ajouter un nouveau bus",
      href: "/infrastructure/bus/add-new-bus",
    },
  ];

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createBus, { isLoading }] = useCreateBussMutation();

  const onSubmit = async (data: any) => {
    try {
      await createBus(data).unwrap();
      toast.success("Bus created successfully");
      router.push("/infrastructure/bus")
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

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
              ? "Add New Bus"
              : currentLanguage === "ar"
                ? "إضافة حافلة جديدة"
                : currentLanguage === "fr"
                  ? "Ajouter un nouveau bus"
                  : "Add New Bus"}{" "}
            {/* default */}
          </h1>
        </div>
        <form
          className="flex h-full w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
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
                  ? "Bus Information"
                  : currentLanguage === "ar"
                    ? "معلومات الحافلة"
                    : currentLanguage === "fr"
                      ? "Informations sur le bus"
                      : "Bus Information"}{" "}
                {/* default */}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label htmlFor="name" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Bus Number"
                  : currentLanguage === "ar"
                    ? "رقم الحافلة"
                    : currentLanguage === "fr"
                      ? "Numéro du bus"
                      : "Bus Number"}{" "}
                {/* default */}
                <input
                  id="name"
                  {...register("busNumber", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.busNumber && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
                  </span>
                )}
              </label>
              <label htmlFor="code" className="grid text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "Bus Capacity"
                  : currentLanguage === "ar"
                    ? "سعة الحافلة"
                    : currentLanguage === "fr"
                      ? "Capacité du bus"
                      : "Bus Capacity"}{" "}
                {/* default */}
                <input
                  id="code"
                  {...register("busCapacity", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.busCapacity && (
                  <span className="text-error">
                    {currentLanguage === "en"
                      ? "This field is required"
                      : currentLanguage === "ar"
                        ? "هذا الحقل مطلوب"
                        : currentLanguage === "fr"
                          ? "Ce champ est requis"
                          : "This field is required"}{" "}
                    {/* default */}
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
                    ? "Add Bus"
                    : currentLanguage === "ar"
                      ? "إضافة حافلة"
                      : currentLanguage === "fr"
                        ? "Ajouter un bus"
                        : "Add Bus"}{" "}
                  {/* default */}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddNewBus;
