"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useFindAccountMutation,
  useSelectAccoutMutation,
} from "@/features/loginApi";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";

import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { RootState } from "@/GlobalRedux/store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const ForgetPassword = () => {
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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [forgetPassword, { isLoading }] = useFindAccountMutation();
  const [selectAccount] = useSelectAccoutMutation();

  const onSubmit = async (data: any) => {
    try {
      const username = data.username;
      const result = await forgetPassword(username).unwrap();
      Cookie.set("userId", result.data.userId);
      Cookie.set("email", result.data.emails);
      const Email = Cookie.get("email");
      const UserId = Cookie.get("userId");
      await selectAccount({ id: UserId, email: Email }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء وإرسال بريد إعادة تعيين كلمة المرور بنجاح"
          : currentLanguage === "fr"
            ? "Email de réinitialisation du mot de passe généré et envoyé avec succès"
            : "Reset password email generated and sent successfully",
      );
      router.replace("/otp");
    } catch (err) {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في العثور على اسم المستخدم أو البريد الإلكتروني"
          : currentLanguage === "fr"
            ? "Échec de la recherche de ce nom d'utilisateur ou de cet e-mail"
            : "Failed to find this username or email",
      );
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
        <div
          className={`absolute -bottom-40 ${currentLanguage === "ar" ? "right-0 scale-x-[-1]" : "left-0"} z-10 hidden h-[600px] w-[600px] lg:block`}
        >
          <img
            src={
              theme === "light"
                ? "/images/bottomleft-login.png"
                : "/images/bottomleft-login-dark.png"
            }
            alt="Logo"
            className="m-0 w-full p-0"
          />
        </div>
        <div className="gird z-20 w-full items-center justify-center text-center">
          <div className="mb-10 grid">
            <h1 className="text-[28px] font-bold text-primary">
              {currentLanguage === "ar"
                ? "نسيت كلمة المرور"
                : currentLanguage === "fr"
                  ? "Mot de passe oublié"
                  : "Forgot Password"}
            </h1>
            <p className="text-[20px] font-semibold text-secondary">
              {currentLanguage === "ar"
                ? "أدخل رقم هاتفك للحصول على رمز التحقق"
                : currentLanguage === "fr"
                  ? "Entrez votre téléphone pour recevoir le code OTP"
                  : "Enter your phone to get OTP"}
            </p>
          </div>
          <div className="grid items-center justify-center">
            <form
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="grid gap-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                htmlFor="text"
                className="grid text-start text-[18px] font-semibold text-textSecondary"
              >
                {currentLanguage === "ar"
                  ? "اسم المستخدم | البريد الإلكتروني"
                  : currentLanguage === "fr"
                    ? "Nom d'utilisateur | Email"
                    : "Username | Email"}
                <input
                  id="text"
                  {...register("username", { required: true })}
                  placeholder={
                    currentLanguage === "ar"
                      ? "اسم المستخدم | البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Nom d'utilisateur | Email"
                        : "Username | Email"
                  }
                  className={`w-[450px] rounded-xl border px-4 py-3 ${errors.username ? "border-warning" : "border-borderPrimary"} outline-none max-[471px]:w-[350px]`}
                  type="text"
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
                    className="w-[170px] rounded-xl bg-primary px-4 py-2 text-[18px] font-bold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                  >
                    {currentLanguage === "ar"
                      ? "رمز الاسترداد"
                      : currentLanguage === "fr"
                        ? "Code de récupération"
                        : "Recovery Code"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="flex h-full justify-end">
          <div className="hidden h-full w-[250px] items-center justify-end bg-[#B2BDF9] dark:bg-[#2a3469] md:flex lg:w-[600px]">
            <img
              className="h-[150px] -translate-x-[40px] lg:h-[300px] lg:w-[500px] xl:-translate-x-[260px]"
              src="images/forget.png"
              alt="#"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
