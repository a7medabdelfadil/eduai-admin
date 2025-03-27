"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import { useResetPasswordMutation } from "@/features/loginApi";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDispatch } from "react-redux";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";
import { useEffect, useState } from "react";

const ResetPassword = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
    }
  }, []);

  const dispatchLang = useDispatch();
  useEffect(() => {
    dispatchLang(initializeLanguage());
  }, [dispatchLang]);

  const dispatch2 = useDispatch();
  const handleLanguageChange = (language: any) => {
    dispatch2(setLanguage(language));
  };
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const code = Cookie.get("otp");
  const email = Cookie.get("email");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const password = data.password;

    try {
      await resetPassword({ code, email, password }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تمت إعادة تعيين كلمة المرور بنجاح"
          : currentLanguage === "fr"
            ? "Mot de passe réinitialisé avec succès"
            : "Password Reset successfully",
      );
      Cookie.remove("otp");
      Cookie.remove("email");
      Cookie.remove("userId");
      router.replace("/login");
    } catch (error) {
      toast.error(`${(error as any).data.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bgSecondary duration-300 ease-in">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="absolute right-5 top-5 z-30">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="text-violet11 hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-bgPrimary outline-none"
              aria-label="Customise options"
            >
              {currentLanguage === "en" ? (
                <img src="/images/en.png" alt="#" />
              ) : currentLanguage === "ar" ? (
                <img src="/images/ar.png" alt="#" />
              ) : currentLanguage === "fr" ? (
                <img src="/images/fr.png" alt="#" />
              ) : (
                <img src="/images/fr.png" alt="#" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 mx-2 mt-5 grid min-w-[150px] justify-center gap-5 rounded-md bg-bgPrimary p-[5px] font-semibold shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
              sideOffset={5}
            >
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mt-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "Arabic"
                    : currentLanguage === "ar"
                      ? "العربية"
                      : currentLanguage === "fr"
                        ? "Arabe"
                        : "Arabic"}
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "English"
                    : currentLanguage === "ar"
                      ? "الإنجليزية"
                      : currentLanguage === "fr"
                        ? "Anglais"
                        : "English"}
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative mb-2 flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
                <button
                  onClick={() => handleLanguageChange("fr")}
                  className="rounded-lg px-4 py-2 text-[20px] hover:bg-bgSecondary"
                >
                  {currentLanguage === "en"
                    ? "French"
                    : currentLanguage === "ar"
                      ? "الفرنسية"
                      : currentLanguage === "fr"
                        ? "Français"
                        : "French"}
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="relative flex h-screen items-center justify-center overflow-hidden bg-bgSecondary duration-300 ease-in">
        <div className="gird z-20 w-full items-center justify-center text-center">
          <div className="mb-10 grid">
            <h1 className="text-[28px] font-bold text-primary">
              {currentLanguage === "ar"
                ? "إعادة تعيين كلمة المرور"
                : currentLanguage === "fr"
                  ? "Réinitialiser votre mot de passe"
                  : "Reset your password"}
            </h1>
            <p className="text-[20px] font-semibold text-secondary">
              {currentLanguage === "ar"
                ? "أدخل كلمة المرور الجديدة"
                : currentLanguage === "fr"
                  ? "Entrez le nouveau mot de passe"
                  : "Enter new password"}
            </p>
          </div>
          <div className="grid items-center justify-center">
            <form
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="grid gap-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                htmlFor="password"
                className="grid text-start text-[18px] font-semibold text-textSecondary"
              >
                {currentLanguage === "ar"
                  ? "كلمة المرور الجديدة"
                  : currentLanguage === "fr"
                    ? "Nouveau mot de passe"
                    : "New password"}
                <input
                  {...register("password", { required: true })}
                  id="password"
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل كلمة المرور الجديدة الخاصة بك"
                      : currentLanguage === "fr"
                        ? "Entrez votre nouveau mot de passe"
                        : "Enter your new password"
                  }
                  className={`w-[450px] rounded-xl border px-4 py-3 ${errors.username ? "border-warning" : "border-borderPrimary"} outline-none max-[471px]:w-[350px]`}
                  type="password"
                />
                {errors.username && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "البريد الإلكتروني مطلوب"
                      : currentLanguage === "fr"
                        ? "L'email est requis"
                        : "Email is Required"}
                  </span>
                )}
              </label>
              {isLoading ? (
                <Spinner />
              ) : (
                <div className="flex justify-center text-center">
                  <button
                    type="submit"
                    className="w-fit rounded-xl bg-primary p-5 px-4 py-2 text-[18px] font-bold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                  >
                    {currentLanguage === "ar"
                      ? "إعادة تعيين كلمة المرور"
                      : currentLanguage === "fr"
                        ? "Réinitialiser le mot de passe"
                        : "Reset password"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <div
          className={`absolute -bottom-40 ${currentLanguage === "ar" ? "right-0 scale-x-[-1]" : "left-0"} z-10 hidden h-[600px] w-[600px] lg:block`}
        >
          <img
            src={
              theme === "light"
                ? "/images/bottomleft-login.png"
                : "/images/bottomleft-login-dark.png"
            }
            // src="/images/bottomleft-login.png"
            alt="Logo"
            className="m-0 w-full p-0"
          />
        </div>
        <div className="flex h-full justify-end">
          <div className="hidden h-full w-[250px] items-center justify-end bg-[#B2BDF9] dark:bg-[#2a3469] md:flex lg:w-[600px]">
            <img
              className="md:h-[250px] md:-translate-x-[40px] lg:h-[400px] lg:-translate-x-[140px] xl:-translate-x-[260px]"
              src="images/newpassword.png"
              alt="#"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
