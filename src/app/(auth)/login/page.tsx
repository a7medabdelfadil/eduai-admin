"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useLoginDashboardMutation,
  useSelectAccoutConfirmMutation,
} from "@/features/loginApi";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";

import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { setUser } from "@/features/userSlice";
import { RootState } from "@/GlobalRedux/store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Text } from "@/components/Text";

interface ErrorMessage {
  userId: string;
  email: string;
  message: string;
}

const Login = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
    }
  }, []);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setPageHeight(window.innerHeight);
    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
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
  const [loginDashboard, { isLoading, error }] = useLoginDashboardMutation();
  let errorData: ErrorMessage = {
    message: "",
    email: "",
    userId: "",
  };
  const [selectAccount] = useSelectAccoutConfirmMutation();

  const onSubmit = async (data: any) => {
    try {
      const result = await loginDashboard(data).unwrap();
      Cookie.set("token", result.data);
      toast.success(
        currentLanguage === "ar"
          ? "تسجيل الدخول ناجح"
          : currentLanguage === "fr"
            ? "Connexion réussie"
            : "Login success",
      );
      router.replace("/");
    } catch (err: any) {
      toast.error(
        currentLanguage === "ar"
          ? "فشل في تسجيل الدخول"
          : currentLanguage === "fr"
            ? "Échec de la connexion"
            : "Failed to login",
      );
      try {
        errorData = JSON.parse(err.data.errorMessage);
      } catch (e) {}
    }
    if (errorData.message === "The account is not activated yet.") {
      dispatch2(
        setUser({
          email: errorData?.email,
          id: errorData?.userId,
        }),
      );
      await selectAccount({
        id: errorData?.userId,
        email: errorData?.email,
      }).unwrap();
      toast.success(
        currentLanguage === "ar"
          ? "تم إنشاء وإرسال بريد إعادة تعيين كلمة المرور بنجاح"
          : currentLanguage === "fr"
            ? "Email de réinitialisation du mot de passe généré et envoyé avec succès"
            : "Reset password email generated and sent successfully",
      );

      router.push("/confirm-account");
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
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden"
      >
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
        <div
          className={`absolute ${currentLanguage === "ar" ? "left-10 scale-x-[-1]" : "right-10"} z-10 hidden max-h-[80vh] max-w-[40vw] md:top-52 lg:top-48 lg:block xl:top-32 2xl:top-28`}
        >
          <img
            src="/images/dashboard-login.png"
            alt="Logo"
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Background */}
        <div className="absolute inset-0 flex">
          <div className="w-full bg-bgPrimary lg:w-2/3"></div>
          <div className="w-0 bg-bgPrimary lg:w-1/3 lg:bg-[#B2BDF9] dark:lg:bg-[#2a3469]" />
        </div>
        {/* Card */}
        <div
          style={{ height: `${pageHeight - 100}px` }}
          className="relative my-0 w-full rounded-xl bg-transparent md:my-[40px] md:w-[85%] md:shadow-2xl"
        >
          <div className="mb-20">
            <img
              className={`absolute ${currentLanguage === "ar" ? "right-5" : "left-5"} left-5 top-5 w-[200px]`}
              src="images/logo.png"
              alt="EduAi Logo"
            />
          </div>

          <div className="flex flex-col items-start p-10">
            <Text font={"bold"} size={"4xl"}>
              {currentLanguage === "ar"
                ? "تسجيل الدخول"
                : currentLanguage === "fr"
                  ? "Connexion"
                  : "Sign in"}
            </Text>
            <Text font={"medium"} size={"xl"} color={"gray"} className="mt-2">
              {currentLanguage === "ar"
                ? "يرجى تسجيل الدخول للمتابعة إلى حسابك."
                : currentLanguage === "fr"
                  ? "Veuillez vous connecter pour accéder à votre compte."
                  : "Please login to continue to your account."}
            </Text>
            <form
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="z-20 mt-6 grid w-full gap-10 md:w-fit"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative mt-6 w-full md:w-fit">
                <label
                  htmlFor="email"
                  className={`absolute left-4 rounded px-1 text-sm font-semibold transition-all duration-200 ${
                    emailFocused
                      ? "top-[-10px] bg-bgPrimary opacity-100"
                      : "top-4 opacity-0"
                  } text-primary`}
                >
                  {currentLanguage === "ar"
                    ? "البريد الإلكتروني"
                    : currentLanguage === "fr"
                      ? "Email"
                      : "Email"}
                </label>

                <input
                  id="email"
                  type="email"
                  {...register("username", { required: true })}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={e => setEmailFocused(!!e.target.value)}
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Entrez votre email"
                        : "Enter Your Email"
                  }
                  className={`w-full rounded-xl border p-4 text-textPrimary bg-bgPrimary outline-none transition-all duration-200 md:w-[450px] ${
                    errors.username
                      ? "border-warning"
                      : emailFocused
                        ? "border-primary"
                        : "border-borderPrimary"
                  }`}
                />

                {errors.username && (
                  <span className="mt-1 block text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "البريد الإلكتروني مطلوب"
                      : currentLanguage === "fr"
                        ? "L'email est requis"
                        : "Email is Required"}
                  </span>
                )}
              </div>

              <div className="relative w-full md:w-fit">
                <label
                  htmlFor="password"
                  className={`absolute left-4 rounded px-1 text-sm font-semibold transition-all duration-200 ${
                    passwordFocused
                      ? "top-[-10px] bg-bgPrimary opacity-100"
                      : "top-4 opacity-0"
                  } text-primary`}
                >
                  {currentLanguage === "ar"
                    ? "كلمة المرور الخاصة بك"
                    : currentLanguage === "fr"
                      ? "Votre mot de passe"
                      : "Your Password"}
                </label>
                <input
                  id="password"
                  {...register("password", { required: true })}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={e => setPasswordFocused(!!e.target.value)}
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل كلمة المرور الخاصة بك"
                      : currentLanguage === "fr"
                        ? "Entrez votre mot de passe"
                        : "Enter Your Password"
                  }
                  className={`w-full rounded-xl border bg-bgPrimary p-4 text-textPrimary outline-none transition-all duration-200 md:w-[450px] ${
                    errors.password
                      ? "border-warning"
                      : passwordFocused
                        ? "border-primary"
                        : "border-borderPrimary"
                  }`}
                  type="password"
                />
                {errors.password && (
                  <span className="text-[13px] text-error">
                    {currentLanguage === "ar"
                      ? "كلمة المرور مطلوبة"
                      : currentLanguage === "fr"
                        ? "Le mot de passe est requis"
                        : "Password is Required"}
                  </span>
                )}
                <div className="mt-2 flex justify-end text-end">
                  <a
                    href="/forget-password"
                    className="flex text-[12px] font-medium text-secondary hover:underline"
                  >
                    {currentLanguage === "ar"
                      ? "نسيت كلمة المرور؟"
                      : currentLanguage === "fr"
                        ? "Mot de passe oublié ?"
                        : "Forgot password ?"}
                  </a>
                </div>
              </div>

              {/* <Spinner/> */}
              <div className="flex justify-center text-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full rounded-xl bg-primary p-4 text-[18px] font-bold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl md:w-[450px]"
                >
                  {isLoading
                    ? currentLanguage === "ar"
                      ? "جاري التحميل..."
                      : currentLanguage === "fr"
                        ? "Chargement..."
                        : "Loading..."
                    : currentLanguage === "ar"
                      ? "تسجيل الدخول"
                      : currentLanguage === "fr"
                        ? "Connexion"
                        : "Login"}
                </button>
              </div>
              {error && (
                <p className="font-semibold text-error">
                  {currentLanguage === "ar"
                    ? "اسم المستخدم أو كلمة المرور غير صالحين!"
                    : currentLanguage === "fr"
                      ? "Le nom d'utilisateur ou le mot de passe ne sont pas valides !"
                      : "Username or Password are not valid!"}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 text-center">
                <p className="font-medium text-secondary">
                  {currentLanguage === "ar"
                    ? "تحتاج إلى حساب؟"
                    : currentLanguage === "fr"
                      ? "Besoin d'un compte ?"
                      : "Need an account?"}
                </p>
                <a
                  href="/signup"
                  className="flex font-medium text-primary hover:underline"
                >
                  {currentLanguage === "ar"
                    ? "إنشاء حساب"
                    : currentLanguage === "fr"
                      ? "Créer un compte"
                      : "Create Account"}
                </a>
              </div>
            </form>
          </div>
          <div
            className={`absolute ${currentLanguage === "ar" ? "left-5 scale-x-[-1]" : "right-5"} top-5 z-20`}
          >
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
        </div>
      </div>
    </>
  );
};

export default Login;
