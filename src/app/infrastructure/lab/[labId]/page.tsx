"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import {
  useGetLabByIdQuery,
  useUpdateLabsMutation,
} from "@/features/Infrastructure/labApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

interface ViewEmployeeProps {
  params: {
    labId: string;
  };
}

const EditLab: React.FC<ViewEmployeeProps> = ({ params }) => {
  const breadcrumbs = [
    {
      nameEn: "Operations",
      nameAr: "العمليات",
      nameFr: "Opérations",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructure",
      href: "/infrastructure",
    },
    {
      nameEn: "Lab",
      nameAr: "المختبر",
      nameFr: "Laboratoire",
      href: "/infrastructure/lab",
    },
    {
      nameEn: "Edit Lab",
      nameAr: "تعديل مختبر",
      nameFr: "Modifier le Laboratoire",
      href: `/infrastructure/lab/${params.labId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const [createDriver, { isLoading: isUpdating }] = useUpdateLabsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { data, isLoading: isG } = useGetLabByIdQuery(params.labId);

  useEffect(() => {
    if (data) {
      setValue("buildingNumber", data.data.buildingNumber);
      setValue("floorNumber", data.data.floorNumber);
      setValue("labName", data.data.labName);
      setValue("labType", data.data.labType);
      setValue("maxCapacity", data.data.maxCapacity);
      setValue("roomNumber", data.data.roomNumber);
      setValue("type", data.data.type);
      setValue("name_fr", data.data.name_fr);
    }
  }, [data]);

  const onSubmit = async (data: any) => {
    try {
      await createDriver({ formData: data, id: params.labId }).unwrap();
      toast.success("Driver Updated successfully");
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isG || isUpdating)
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
              ? "Edit Lab"
              : currentLanguage === "ar"
                ? "تعديل مختبر"
                : currentLanguage === "fr"
                  ? "Modifier le Laboratoire"
                  : "Edit Lab"}{" "}
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
                className="h-6 w-6 font-bold text-secondary group-hover:text-primary"
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
                <line x1="3" y1="21" x2="21" y2="21" />{" "}
                <line x1="3" y1="10" x2="21" y2="10" />{" "}
                <polyline points="5 6 12 3 19 6" />{" "}
                <line x1="4" y1="10" x2="4" y2="21" />{" "}
                <line x1="20" y1="10" x2="20" y2="21" />{" "}
                <line x1="8" y1="14" x2="8" y2="17" />{" "}
                <line x1="12" y1="14" x2="12" y2="17" />{" "}
                <line x1="16" y1="14" x2="16" y2="17" />
              </svg>
              <h1 className="text-[22px] font-semibold">
                {currentLanguage === "ar"
                  ? "معلومات المختبر"
                  : currentLanguage === "fr"
                    ? "Informations sur le laboratoire"
                    : "Lab Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label
                htmlFor="buildingNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
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
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="roomNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم الغرفة"
                  : currentLanguage === "fr"
                    ? "Numéro de la pièce"
                    : "Room Number"}
                <input
                  id="roomNumber"
                  {...register("roomNumber", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.roomNumber && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="floorNumber"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم الطابق"
                  : currentLanguage === "fr"
                    ? "Numéro de l'étage"
                    : "Floor Number"}
                <input
                  id="floorNumber"
                  {...register("floorNumber", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.floorNumber && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label htmlFor="type" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "النوع"
                  : currentLanguage === "fr"
                    ? "Type"
                    : "Type"}
                <input
                  id="type"
                  {...register("type", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.type && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="maxCapacity"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
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
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="schoolId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "رقم المدرسة"
                  : currentLanguage === "fr"
                    ? "ID de l'école"
                    : "School Id"}
                <input
                  id="schoolId"
                  {...register("schoolId", { required: true })}
                  type="number"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.schoolId && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="labName"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "اسم المختبر"
                  : currentLanguage === "fr"
                    ? "Nom du laboratoire"
                    : "Lab Name"}
                <input
                  id="labName"
                  {...register("labName", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.labName && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
              <label
                htmlFor="labType"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "نوع المختبر"
                  : currentLanguage === "fr"
                    ? "Type de laboratoire"
                    : "Lab Type"}
                <input
                  id="labType"
                  {...register("labType", { required: true })}
                  type="text"
                  className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
                {errors.labType && (
                  <span className="text-error">This field is required</span>
                )}
              </label>
            </div>

            <div className="flex justify-center text-center">
              {isG ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  Edit Lab
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditLab;
