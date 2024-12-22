"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCreateNotificationsMutation } from "@/features/communication/notficationsApi";
import Spinner from "@/components/spinner";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TextEditor from "@/components/textEditor";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const SendNotifications = () => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Notifications",
      nameAr: "الإشعارات",
      nameFr: "Notifications",
      href: "/notifies",
    },
    {
      nameEn: "Send Notifications",
      nameAr: "إرسال الإشعارات",
      nameFr: "Envoyer des notifications",
      href: "/notifies/send-notifications",
    },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [isAllRolesChecked, setIsAllRolesChecked] = useState(false);
  const [createNotification, { isLoading }] = useCreateNotificationsMutation();

  const roleOptions = [
    "SUPER_ADMIN",
    "ADMIN",
    "TEACHER",
    "STUDENT",
    "PARENT",
    "EMPLOYEE",
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar

  const handleCheckboxChange = (role: string) => {
    setRoles(prevRoles =>
      prevRoles.includes(role)
        ? prevRoles.filter(r => r !== role)
        : [...prevRoles, role],
    );
    // Uncheck "All Roles" if not all roles are selected
    setIsAllRolesChecked(false);
  };

  const handleAllRolesChange = () => {
    const newIsAllRolesChecked = !isAllRolesChecked;
    setIsAllRolesChecked(newIsAllRolesChecked);

    if (newIsAllRolesChecked) {
      // Select all roles
      setRoles([...roleOptions]);
    } else {
      // Deselect all roles
      setRoles([]);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title || !description || roles.length === 0) {
      toast.error("Please fill in all fields and select at least one role.");
      return;
    }
    try {
      await createNotification({ title, description, roles }).unwrap();
      toast.success("Notification sent successfully!");
      setTitle("");
      setDescription("");
      setRoles([]);
      setIsAllRolesChecked(false);
    } catch (error) {
      toast.error("Failed to send notification. Please try again.");
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
      <div
        className={`mt-12 flex gap-10 max-[1500px]:grid ${booleanValue ? "lg:ml-[120px]" : "lg:ml-[290px]"}`}
      >
        <div className="grid h-full w-full items-center gap-3 rounded-xl bg-bgPrimary p-5">
          {/* All Roles Checkbox */}
          <label
            key="ALL_ROLES"
            htmlFor="ALL_ROLES"
            className="flex items-center gap-2 text-[18px] font-semibold"
          >
            <input
              type="checkbox"
              name="ALL_ROLES"
              id="ALL_ROLES"
              checked={isAllRolesChecked}
              onChange={handleAllRolesChange}
            />
            {currentLanguage === "ar"
              ? "جميع الأدوار"
              : currentLanguage === "fr"
                ? "Tous les rôles"
                : "All Roles"}
          </label>

          {roleOptions.map(role => (
            <label
              key={role}
              htmlFor={role}
              className="flex items-center gap-2 text-[18px] font-semibold"
            >
              <input
                type="checkbox"
                name={role}
                id={role}
                checked={roles.includes(role)}
                onChange={() => handleCheckboxChange(role)}
              />
              {role === "SUPER_ADMIN" || role === "ADMIN" ? (
                <span>{role.replace("_", " ")}</span>
              ) : (
                <>
                  <div className="grid h-[60px] w-[60px] items-center justify-center rounded-full bg-[#dbdada]">
                    <img
                      src={
                        role == "TEACHER"
                          ? `/images/Teacher.png`
                          : `/images/${role.toLowerCase()}.png`
                      }
                      alt={role}
                    />
                  </div>
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </>
              )}
            </label>
          ))}
        </div>
        <div
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          className="grid h-full w-full items-center gap-3 rounded-xl bg-bgPrimary p-5"
        >
          <div className="mb-5 flex w-full justify-start">
            <h1 className="text-[22px] font-semibold">
              {currentLanguage === "ar"
                ? "إرسال الإشعارات"
                : currentLanguage === "fr"
                  ? "Envoyer des notifications"
                  : "Send Notifications"}
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid h-full w-full gap-6">
              <label
                className="grid gap-2 text-[18px] font-semibold"
                htmlFor="title"
              >
                {currentLanguage === "ar"
                  ? "العنوان"
                  : currentLanguage === "fr"
                    ? "Titre"
                    : "Title"}
                <input
                  className="rounded-xl border border-borderPrimary px-4 py-2 outline-none"
                  placeholder={
                    currentLanguage === "ar"
                      ? "اكتب العنوان هنا..."
                      : currentLanguage === "fr"
                        ? "Écrivez le titre ici..."
                        : "Write title...."
                  }
                  name="title"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>
              <label
                className="grid gap-2 text-[18px] font-semibold"
                htmlFor="description"
              >
                {currentLanguage === "ar"
                  ? "الوصف"
                  : currentLanguage === "fr"
                    ? "Description"
                    : "Description"}
                <div className="mb-5 bg-bgPrimary">
                  <TextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder={
                      currentLanguage === "ar"
                        ? "أدخل محتواك هنا..."
                        : currentLanguage === "fr"
                          ? "Entrez votre contenu ici..."
                          : "Enter your content here..."
                    }
                  />
                </div>
              </label>
              <div>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <button
                    type="submit"
                    className="mx-3 mb-5 flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                  >
                    <svg
                      className="h-7 w-7 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    {currentLanguage === "ar"
                      ? "إرسال الإشعارات"
                      : currentLanguage === "fr"
                        ? "Envoyer des notifications"
                        : "Send Notifications"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SendNotifications;
