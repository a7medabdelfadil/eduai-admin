"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/Container";
import { useGetAllReginionIDQuery } from "@/features/signupApi";
import { useGetBusCostByRegionIdQuery, useUpdateBusCostMutation } from "@/features/Financial/transportApi";
import { useEffect } from "react";

const EditTransport = () => {
  const params = useParams();
  const regionIdRaw = params?.id;
  const regionId = Array.isArray(regionIdRaw) ? regionIdRaw[0] : regionIdRaw;
  const breadcrumbs = [
    { nameEn: "Financial Management", nameAr: "الإدارة المالية", nameFr: "Gestion financière", href: "/financial-management" },
    { nameEn: "Transport", nameAr: "النقل", nameFr: "Transport", href: "/financial-management/transport" },
    { nameEn: "Edit Transport", nameAr: "تعديل نقل", nameFr: "Modifier un transport", href: `/financial-management/transport/edit-transport/${regionId}` },
  ];

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const { language: currentLanguage } = useSelector((state: RootState) => state.language);

  const { data: regionsData, isLoading: regionsLoading, refetch } = useGetAllReginionIDQuery(null);
  const { data: busCostData, isLoading: costLoading } = useGetBusCostByRegionIdQuery(regionId);
  const [updateBusCost, { isLoading: submitting }] = useUpdateBusCostMutation();

  useEffect(() => {
    if (busCostData?.data) {
      setValue("cost", busCostData.data.cost);
      setValue("about", busCostData.data.about);
      setValue("regionId", regionId);
    }
    refetch();
  }, [busCostData, regionId, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      await updateBusCost({ ...formData, regionId }).unwrap();
      toast.success("Transport cost updated successfully!");
      router.push("/financial-management/transport");
      refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  if (regionsLoading || costLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en" ? "Edit Transport" : currentLanguage === "ar" ? "تعديل نقل" : "Modifier un transport"}
          </h1>
        </div>
        <form className="flex h-full w-full items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-[90] rounded-xl bg-bgPrimary p-10 md:w-[80%]">
            <div className="flex items-center justify-start gap-2">
              <svg className="h-6 w-6 font-bold text-secondary" /* icon same as add */ width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                {currentLanguage === "ar" ? "معلومات النقل" : currentLanguage === "fr" ? "Informations sur le transport" : "Transport Information"}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 max-[1278px]:grid-cols-1">
              <label htmlFor="cost" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar" ? "التكلفة" : currentLanguage === "fr" ? "Coût" : "Cost"}
                <input id="cost" type="number" {...register("cost")} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              </label>
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar" ? "حول (اختياري)" : currentLanguage === "fr" ? "À propos (Facultatif)" : "About (Optional)"}
                <input id="about" type="text" {...register("about")} className="w-full rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-3 outline-none max-[471px]:w-[350px]" />
              </label>
            </div>
            <div className="flex justify-center text-center">
              <button type="submit" disabled={submitting} className={`w-fit rounded-xl px-4 py-2 text-[18px] text-white duration-300 ease-in hover:shadow-xl ${submitting ? "cursor-not-allowed bg-gray-400" : "bg-primary hover:bg-hover"}`}>
                {submitting
                  ? currentLanguage === "ar" ? "جاري التعديل..." : currentLanguage === "fr" ? "Mise à jour..." : "Updating..."
                  : currentLanguage === "ar" ? "تحديث" : currentLanguage === "fr" ? "Mettre à jour" : "Update"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditTransport;
