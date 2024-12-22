"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner";
import { useGetSchoolLogoNameQuery } from "@/features/school/schoolLogo";
import { useState } from "react";
import { useUploadSchoolLogoMutation } from "@/features/school/schoolLogo";
import { toast } from "react-toastify"; // إضافة toast notification

const EditSchool = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Edit School Logo",
      nameAr:  "تعديل شعار المدرسة",
      nameFr: "Modifier le logo de l'école",
      href: "/organization-setting/edit-school-logo",
    },
  ];
  const [logo, setLogo] = useState<File | null>(null);
  const {
    data: logoData,
    error,
    isLoading,
    refetch,
  } = useGetSchoolLogoNameQuery(null);
  const [uploadSchoolLogo, { isLoading: isUploading, isError, isSuccess }] =
    useUploadSchoolLogoMutation();
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  // Loading spinner if language state is loading
  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];

      if (validTypes.includes(file.type)) {
        setLogo(file);
      } else {
        toast.error(
          "Invalid file type! Please upload an image (JPG, PNG, GIF).",
        );
      }
    } else {
      toast.error("No file selected.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (logo) {
      try {
        await uploadSchoolLogo(logo).unwrap();
        refetch();
        toast.success("Logo uploaded successfully!"); // Show success toast
      } catch (error) {
        toast.error("Error uploading logo!"); // Show error toast
      }
    } else {
      toast.error("Please select a logo to upload.");
    }
  };

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
        } mx-[5px] mt-[40px] grid h-[450px] items-center justify-center`}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid h-[600px] items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:h-[500px] xl:w-[1000px]">
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
              <h1 className="font-sans text-[22px] font-semibold">
                {logoData?.data?.name}
              </h1>
              <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden">
                {logoData?.data?.hasLogo ? (
                  <img
                    src={logoData?.data?.logoLink || ""}
                    alt="School logo"
                    className="rounded-full"
                    width={100}
                    height={100}
                  />
                ) : (
                  <p className="font-sans text-[18px] font-semibold">
                    {currentLanguage === "en"
                      ? "No Logo"
                      : currentLanguage === "ar"
                        ? "لا يوجد شعار"
                        : currentLanguage === "fr"
                          ? "Pas de logo"
                          : "No Logo"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              <label
                htmlFor="logo"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "Upload Logo"
                  : currentLanguage === "ar"
                    ? "رفع الشعار"
                    : currentLanguage === "fr"
                      ? "Télécharger le logo"
                      : "Upload Logo"}
                <input
                  id="logo"
                  type="file"
                  onChange={handleFileChange}
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                />
              </label>
            </div>

            <div className="flex justify-center text-center">
              <button
                type="submit"
                className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                disabled={isUploading}
              >
                {currentLanguage === "en"
                  ? "Add Logo"
                  : currentLanguage === "ar"
                    ? "إضافة شعار"
                    : currentLanguage === "fr"
                      ? "Ajouter le logo"
                      : "Add Logo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSchool;
