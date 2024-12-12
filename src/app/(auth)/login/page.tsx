"use client";
/* eslint-disable @next/next/no-img-element */
import { useForm } from "react-hook-form";
import {
  useLoginDashboardMutation,
  useSelectAccoutConfirmMutation,
} from "@/features/loginApi";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDispatch } from "react-redux";
import {
  initializeLanguage,
  setLanguage,
} from "@/features/language/languageSlice";
import { useEffect } from "react";
import Spinner from "@/components/spinner";
import { setUser } from "@/features/userSlice";

interface ErrorMessage {
  userId: string;
  email: string;
  message: string;
}

const Login = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

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
      console.log("Login success:", result);
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
      } catch (e) {
        console.error("Failed to parse errorMessage:", e);
      }
      console.error("new", errorData);
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
      <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgSecondary duration-300 ease-in max-[1040px]:grid-cols-1">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="absolute right-5 top-5">
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
      <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgSecondary duration-300 ease-in max-[1040px]:grid-cols-1">
        <div className="gird items-center justify-center text-center">
          <div className="mb-20">
            <img
              className="absolute left-5 top-5 w-[300px]"
              src="images/logo.png"
              alt="#"
            />
          </div>
          <div className="mb-10 grid">
            <h1 className="font-sans text-[28px] font-bold text-primary">
              {currentLanguage === "ar"
                ? "تسجيل الدخول"
                : currentLanguage === "fr"
                  ? "Connexion"
                  : "Log in"}
            </h1>
            <p className="font-sans text-[20px] font-semibold text-secondary">
              {currentLanguage === "ar"
                ? "للوصول إلى حسابك"
                : currentLanguage === "fr"
                  ? "Pour accéder à votre compte"
                  : "To access your account"}
            </p>
          </div>
          <div className="grid items-center justify-center">
            <form
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="grid gap-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                htmlFor="email"
                className="grid text-start font-sans text-[18px] font-semibold text-[#041631] text-primary"
              >
                {currentLanguage === "ar"
                  ? "بريدك الإلكتروني"
                  : currentLanguage === "fr"
                    ? "Votre Email"
                    : "Your Email"}
                <input
                  id="email"
                  {...register("username", { required: true })}
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Entrez votre email"
                        : "Enter Your Email"
                  }
                  className={`w-[450px] rounded-xl border px-4 py-3 text-textPrimary ${errors.username ? "border-warning" : "border-borderPrimary"} outline-none max-[471px]:w-[350px]`}
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
              <label
                htmlFor="password"
                className="grid text-start font-sans text-[18px] font-semibold text-[#041631] text-primary"
              >
                {currentLanguage === "ar"
                  ? "كلمة المرور الخاصة بك"
                  : currentLanguage === "fr"
                    ? "Votre mot de passe"
                    : "Your Password"}
                <input
                  id="password"
                  {...register("password", { required: true })}
                  placeholder={
                    currentLanguage === "ar"
                      ? "أدخل كلمة المرور الخاصة بك"
                      : currentLanguage === "fr"
                        ? "Entrez votre mot de passe"
                        : "Enter Your Password"
                  }
                  className={`w-[450px] rounded-xl border px-4 py-3 text-textPrimary ${errors.password ? "border-warning" : "border-borderPrimary"} outline-none max-[471px]:w-[350px]`}
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
              </label>
              <div className="flex justify-end text-end">
                <a
                  href="/forget-password"
                  className="flex font-sans text-[12px] font-medium text-secondary hover:underline"
                >
                  {currentLanguage === "ar"
                    ? "نسيت كلمة المرور؟"
                    : currentLanguage === "fr"
                      ? "Mot de passe oublié ?"
                      : "Forgot password ?"}
                </a>
              </div>

              {/* <Spinner/> */}
              <div className="flex justify-center text-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-[450px] rounded-xl bg-primary px-4 py-2 text-[18px] font-bold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl max-[471px]:w-[350px]"
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
                <p className="font-sans font-medium text-secondary">
                  {currentLanguage === "ar"
                    ? "تحتاج إلى حساب؟"
                    : currentLanguage === "fr"
                      ? "Besoin d'un compte ?"
                      : "Need an account?"}
                </p>
                <a
                  href="/signup"
                  className="flex font-sans font-medium text-primary hover:underline"
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
        </div>
        <div className="flex h-full w-full justify-end">
          <div className="flex h-full w-[600px] items-center justify-end bg-[#2a3469] max-[1040px]:hidden">
            <img
              className="h-[530px] w-[500px] -translate-x-[260px]"
              src="images/labtop.png"
              alt="#"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
