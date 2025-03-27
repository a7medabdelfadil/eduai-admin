/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useUpdatePasswordMutation } from "@/features/User-Management/employeeApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const Password = () => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [UpdateUser, { isLoading }] = useUpdatePasswordMutation();
  const onSubmit = async (data: any) => {
    try {
      await UpdateUser(data).unwrap();
      toast.success("User Updated successfully");
    } catch (err) {
      toast.error("Failed to Update User");
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
        <div className="grid h-full w-full rounded-xl bg-bgPrimary p-7">
          <div>
            <div className="justify-left mb-5 ml-4 flex gap-5 text-[18px] font-semibold">
              <Link href="/profile">
                {currentLanguage === "ar"
                  ? "ملفي الشخصي"
                  : currentLanguage === "fr"
                    ? "Mon profil"
                    : "My Profile"}
              </Link>
              <Link
                href="/profile/password"
                className="text-blue-500 underline"
              >
                {currentLanguage === "ar"
                  ? "كلمة المرور"
                  : currentLanguage === "fr"
                    ? "Mot de passe"
                    : "Password"}
              </Link>
            </div>
          </div>
          <div className="text-semibold mt-5 flex h-full w-full rounded-xl border-2 border-borderPrimary p-5">
            <div className="grid w-full gap-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid justify-center">
                  <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
                    <label
                      htmlFor="password"
                      className="grid text-[18px] font-semibold"
                    >
                      {currentLanguage === "ar"
                        ? "كلمة المرور الحالية"
                        : currentLanguage === "fr"
                          ? "Mot de passe actuel"
                          : "Current Password"}

                      <input
                        {...register("password")}
                        id="password"
                        type="password"
                        className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                      />
                    </label>
                    <label
                      htmlFor="newPassword"
                      className="grid text-[18px] font-semibold"
                    >
                      {currentLanguage === "ar"
                        ? "كلمة مرور جديدة"
                        : currentLanguage === "fr"
                          ? "Nouveau mot de passe"
                          : "New Password"}
                      <input
                        {...register("newPassword")}
                        id="newPassword"
                        type="password"
                        className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                      />
                    </label>
                  </div>
                  <div className="mt-7 flex justify-between">
                    <button
                      type="submit"
                      className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                    >
                      {currentLanguage === "ar"
                        ? "حفظ"
                        : currentLanguage === "fr"
                          ? "Sauvegarder"
                          : "Save"}
                    </button>
                    <Link
                      href="/"
                      className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl border border-primary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
                    >
                      {currentLanguage === "ar"
                        ? "إلغاء"
                        : currentLanguage === "fr"
                          ? "Annuler"
                          : "Cancel"}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
