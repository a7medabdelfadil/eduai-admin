/* eslint-disable @next/next/no-img-element */
"use client";
import Modal from "@/components/model";
import Spinner from "@/components/spinner";
import {
  useGetAllBankAcountsQuery,
  useDeleteBankAcountsMutation,
  useCreateBankAcountsMutation,
  useUpdateBankAcountsMutation,
} from "@/features/Financial/bankApi";
import { RootState } from "@/GlobalRedux/store";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";

const Bank = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Bank",
      nameAr: "البنك",
      nameFr: "Banque",
      href: "/financial-management/bank",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [bankType, setBankType] = useState<"Local" | "IBAN">("Local");

  const [createAcount, { isLoading: isCreating }] =
    useCreateBankAcountsMutation();
  const [UpdateAcount, { isLoading: isUpdating }] =
    useUpdateBankAcountsMutation();
  const [editAcount, setEditAcount] = useState({
    id: "",
    bankName: "",
    bankShortName: "",
    beneficiaryName: "",
    beneficiaryAddress: "",
    beneficiaryAccountNumber: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenModal2 = (bank: Record<string, any>) => {
    setEditAcount({
      id: bank.id,
      bankName: bank.bankName,
      bankShortName: bank.bankShortName,
      beneficiaryName: bank.beneficiaryName,
      beneficiaryAddress: bank.beneficiaryAddress,
      beneficiaryAccountNumber: bank.beneficiaryAccountNumber,
    });
    const startsWithLetters = /^[A-Za-z]{2}/.test(bank.beneficiaryAccountNumber);
    setBankType(startsWithLetters ? "IBAN" : "Local");
    setValue("bankName", bank.bankName);
    setValue("bankShortName", bank.bankShortName);
    setValue("beneficiaryName", bank.beneficiaryName);
    setValue("beneficiaryAddress", bank.beneficiaryAddress);
    setValue("beneficiaryAccountNumber", bank.beneficiaryAccountNumber);
    setModalOpen2(true);
  };

  const handleCloseModal2 = () => {
    setModalOpen2(false);
    reset();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };
  type Bank = Record<string, any>;
  const { data, error, isLoading, refetch } = useGetAllBankAcountsQuery(null);

  const [deleteBankAcount] = useDeleteBankAcountsMutation();
  const handleDelete = async (id: string) => {
    try {
      await deleteBankAcount(id).unwrap();
      toast.success("Delete post Success");
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };
  const onSubmit = async (data: any) => {
    if (bankType === "IBAN") {
      const ibanRegex = /^[A-Z]{2}[A-Za-z0-9]{0,32}$/;
      if (!ibanRegex.test(data.beneficiaryAccountNumber)) {
        toast.error(
          currentLanguage === "en"
            ? "IBAN must start with 2 letters followed by alphanumeric characters (up to 34 characters)"
            : currentLanguage === "fr"
              ? "L'IBAN doit commencer par 2 lettres suivies de caractères alphanumériques (jusqu'à 34 caractères)"
              : "IBAN يجب أن يبدأ بحرفين ويليه حروف أو أرقام (حد أقصى 34)"
        );
        return;
      }
      if (data.beneficiaryAccountNumber.length > 34) {
        toast.error(
          currentLanguage === "en"
            ? "IBAN must not exceed 34 characters"
            : currentLanguage === "fr"
              ? "L'IBAN ne doit pas dépasser 34 caractères"
              : "الـ IBAN لا يجب أن يتجاوز 34 خانة"
        );
        return;
      }
    } else if (bankType === "Local") {
      const localRegex = /^[0-9]+$/;
      if (!localRegex.test(data.beneficiaryAccountNumber)) {
        toast.error(
          currentLanguage === "en"
            ? "Local account number must contain digits only"
            : currentLanguage === "fr"
              ? "Le compte local doit contenir uniquement des chiffres"
              : "رقم الحساب المحلي يجب أن يحتوي على أرقام فقط"
        );
        return;
      }
      if (data.beneficiaryAccountNumber.length > 16) {
        toast.error(
          currentLanguage === "en"
            ? "Local account number must not exceed 16 digits"
            : currentLanguage === "fr"
              ? "Le numéro de compte local ne doit pas dépasser 16 chiffres"
              : "رقم الحساب المحلي لا يجب أن يتجاوز 16 رقم"
        );
        return;
      }
    }

    try {
      await createAcount(data).unwrap();
      void refetch();
      setModalOpen(false);
      reset();
      toast.success("Acount created successfully");
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const onSubmitUpdate = async (data: any) => {
    const startsWithLetters = /^[A-Za-z]{2}/.test(data.beneficiaryAccountNumber);
    const inferredType: "IBAN" | "Local" = startsWithLetters ? "IBAN" : "Local";

    if (inferredType === "IBAN") {
      const ibanRegex = /^[A-Z]{2}[A-Za-z0-9]{0,32}$/;
      if (!ibanRegex.test(data.beneficiaryAccountNumber)) {
        toast.error(
          currentLanguage === "en"
            ? "IBAN must start with 2 letters followed by alphanumeric characters (up to 34 characters)"
            : currentLanguage === "fr"
              ? "L'IBAN doit commencer par 2 lettres suivies de caractères alphanumériques (jusqu'à 34 caractères)"
              : "IBAN يجب أن يبدأ بحرفين ويليه حروف أو أرقام (حد أقصى 34)"
        );
        return;
      }
      if (data.beneficiaryAccountNumber.length > 34) {
        toast.error(
          currentLanguage === "en"
            ? "IBAN must not exceed 34 characters"
            : currentLanguage === "fr"
              ? "L'IBAN ne doit pas dépasser 34 caractères"
              : "الـ IBAN لا يجب أن يتجاوز 34 خانة"
        );
        return;
      }
    } else {
      const localRegex = /^[0-9]+$/;
      if (!localRegex.test(data.beneficiaryAccountNumber)) {
        toast.error(
          currentLanguage === "en"
            ? "Local account number must contain digits only"
            : currentLanguage === "fr"
              ? "Le compte local doit contenir uniquement des chiffres"
              : "رقم الحساب المحلي يجب أن يحتوي على أرقام فقط"
        );
        return;
      }
      if (data.beneficiaryAccountNumber.length > 16) {
        toast.error(
          currentLanguage === "en"
            ? "Local account number must not exceed 16 digits"
            : currentLanguage === "fr"
              ? "Le numéro de compte local ne doit pas dépasser 16 chiffres"
              : "رقم الحساب المحلي لا يجب أن يتجاوز 16 رقم"
        );
        return;
      }
    }
    const { id } = editAcount;
    try {
      await UpdateAcount({ id, formData: data }).unwrap();
      toast.success("Acount Update successfully");
      void refetch();
      setModalOpen2(false);
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };
  const [open, setOpen] = useState<number | boolean | null>(false);
  const toggleNavbar = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
          } mt-10`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleOpenModal}
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ New Bank Information"
                : currentLanguage === "ar"
                  ? "+ معلومات مصرفية جديدة"
                  : "+ Informations Bancaires Nouvelles"}
            </button>
          </div>
        </div>
        <div className="grid h-full w-full items-center gap-4 rounded-xl bg-bgPrimary p-9 max-[505px]:p-2">
          {data?.data.content
            .filter((bank: Bank) => {
              return search.toLocaleLowerCase() === ""
                ? bank
                : bank.bankShortName.toLocaleLowerCase().includes(search);
            })
            .map((bank: Bank, index: number) => (
              <>
                <div className="flex items-start justify-end gap-2">
                  {open === index ? (
                    <div className="flex h-[35px] items-center gap-2 rounded-full bg-bgPrimary px-1.5 py-1">
                      <button onClick={() => handleDelete(bank.id)}>
                        <svg
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button onClick={() => handleOpenModal2(bank)}>
                        <svg
                          className="h-6 w-6 text-blue-500"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                          <line x1="16" y1="5" x2="19" y2="8" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="invisible flex h-[35px] w-[100px] gap-2 rounded-full bg-white px-3 py-0.5">
                      <button>
                        <svg
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button>
                        <svg
                          className="h-6 w-6 text-blue-500"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                          <line x1="16" y1="5" x2="19" y2="8" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button onClick={() => toggleNavbar(index)}>
                    <svg
                      className="mt-1.5 h-6 w-6 text-gray-500"
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
                      <circle cx="12" cy="12" r="1" />{" "}
                      <circle cx="12" cy="19" r="1" />{" "}
                      <circle cx="12" cy="5" r="1" />
                    </svg>
                  </button>
                </div>
                <div
                  key={index}
                  className="flex w-full items-center justify-between max-[1150px]:grid max-[1150px]:justify-center"
                >
                  <div className="flex justify-center">
                    <div className="relative h-56 w-96 transform rounded-xl bg-red-100 text-white shadow-2xl transition-transform max-[1150px]:mb-4 max-[840px]:w-[340px]">
                      <img
                        className="relative h-full w-full rounded-xl object-cover"
                        src="https://i.imgur.com/kGkSg1v.png"
                        alt="#"
                      />
                      <div className="absolute top-8 w-full px-8">
                        <div className="flex justify-between">
                          <div className="">
                            <h1 className="font-light">
                              {currentLanguage === "en"
                                ? "Name"
                                : currentLanguage === "ar"
                                  ? "الاسم"
                                  : "Nom"}
                            </h1>
                            <p className="font-medium tracking-widest">
                              {bank.beneficiaryName}
                            </p>
                          </div>
                          <img
                            className="h-14 w-14"
                            src="https://i.imgur.com/bbPHJVe.png"
                            alt="#"
                          />
                        </div>
                        <div className="pt-1">
                          <h1 className="font-light">
                            {currentLanguage === "en"
                              ? "Card Number"
                              : currentLanguage === "ar"
                                ? "رقم البطاقة"
                                : "Numéro de Carte"}
                          </h1>
                          <p className="tracking-more-wider font-medium">
                            {bank.beneficiaryAccountNumber}
                          </p>
                        </div>
                        <div className="pr-6 pt-6">
                          <div className="flex justify-between">
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 justify-center">
                    <div className="grid gap-5 max-[1150px]:justify-center max-[1150px]:text-center">
                      <div>
                        <h1 className="text-[18px] font-semibold text-[#526484]">
                          {currentLanguage === "en"
                            ? "Bank Name"
                            : currentLanguage === "ar"
                              ? "اسم البنك"
                              : "Nom de la Banque"}
                        </h1>
                        <p className="ml-3 font-semibold">{bank.bankName}</p>
                      </div>
                      <div>
                        <h1 className="text-[18px] font-semibold text-[#526484]">
                          {currentLanguage === "en"
                            ? "Beneficiary Name"
                            : currentLanguage === "ar"
                              ? "اسم المستفيد"
                              : "Nom du Bénéficiaire"}
                        </h1>
                        <p className="ml-3 font-semibold">
                          {bank.beneficiaryName}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-5 max-[1150px]:justify-center max-[1150px]:text-center">
                      <div>
                        <h1 className="text-[18px] font-semibold text-[#526484]">
                          {currentLanguage === "en"
                            ? "Beneficiary Address"
                            : currentLanguage === "ar"
                              ? "عنوان المستفيد"
                              : "Adresse du Bénéficiaire"}
                        </h1>
                        <p className="ml-3 font-semibold">
                          {bank.beneficiaryAddress}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-[18px] font-semibold text-[#526484]">
                          {currentLanguage === "en"
                            ? "Beneficiary Account Number"
                            : currentLanguage === "ar"
                              ? "رقم حساب المستفيد"
                              : "Numéro de Compte du Bénéficiaire"}
                        </h1>
                        <p className="ml-3 font-semibold">
                          {bank.beneficiaryAccountNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Bank Name"
                : currentLanguage === "ar"
                  ? "اسم البنك"
                  : "Nom de la banque"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                type="text"
                placeholder={
                  currentLanguage === "en"
                    ? "Bank Name"
                    : currentLanguage === "ar"
                      ? "اسم البنك"
                      : "Nom de la banque"
                }
                {...register("bankName", { required: true })}
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.bankName && (
                <span className="text-error">
                  {currentLanguage === "en"
                    ? "This field is required"
                    : currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : "Ce champ est requis"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Bank Type"
                : currentLanguage === "ar"
                  ? "نوع البنك"
                  : "Type de banque"}
            </h2>
            <div className="mb-4 rounded-sm">
              <select
                value={bankType}
                onChange={e => setBankType(e.target.value as "Local" | "IBAN")}
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Local">
                  {currentLanguage === "en"
                    ? "Local"
                    : currentLanguage === "ar"
                      ? "محلي"
                      : "Locale"}
                </option>
                <option value="IBAN">IBAN</option>
              </select>
            </div>

            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Beneficiary Address"
                : currentLanguage === "ar"
                  ? "عنوان المستفيد"
                  : "Adresse du bénéficiaire"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                placeholder={
                  currentLanguage === "en"
                    ? "Beneficiary Address"
                    : currentLanguage === "ar"
                      ? "عنوان المستفيد"
                      : "Adresse du bénéficiaire"
                }
                {...register("beneficiaryAddress", { required: true })}
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryAddress && (
                <span className="text-error">
                  {currentLanguage === "en"
                    ? "This field is required"
                    : currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : "Ce champ est requis"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Beneficiary Name"
                : currentLanguage === "ar"
                  ? "اسم المستفيد"
                  : "Nom du bénéficiaire"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("beneficiaryName", { required: true })}
                type="text"
                placeholder={
                  currentLanguage === "en"
                    ? "Beneficiary Name"
                    : currentLanguage === "ar"
                      ? "اسم المستفيد"
                      : "Nom du bénéficiaire"
                }
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryName && (
                <span className="text-error">
                  {currentLanguage === "en"
                    ? "This field is required"
                    : currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : "Ce champ est requis"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Beneficiary Account Number"
                : currentLanguage === "ar"
                  ? "رقم حساب المستفيد"
                  : "Numéro de compte du bénéficiaire"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("beneficiaryAccountNumber", { required: true })}
                placeholder={
                  currentLanguage === "en"
                    ? "Beneficiary Account"
                    : currentLanguage === "ar"
                      ? "حساب المستفيد"
                      : "Compte du bénéficiaire"
                }
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryAccountNumber && (
                <span className="text-error">
                  {currentLanguage === "en"
                    ? "This field is required"
                    : currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : "Ce champ est requis"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "en"
                ? "Bank Short Name"
                : currentLanguage === "ar"
                  ? "الاسم المختصر للبنك"
                  : "Nom court de la banque"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("bankShortName", { required: true })}
                placeholder={
                  currentLanguage === "en"
                    ? "Bank Short Name"
                    : currentLanguage === "ar"
                      ? "الاسم المختصر للبنك"
                      : "Nom court de la banque"
                }
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.bankShortName && (
                <span className="text-error">
                  {currentLanguage === "en"
                    ? "This field is required"
                    : currentLanguage === "ar"
                      ? "هذا الحقل مطلوب"
                      : "Ce champ est requis"}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              {isCreating ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "en"
                    ? "Add"
                    : currentLanguage === "ar"
                      ? "إضافة"
                      : "Ajouter"}
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl border border-borderPrimary bg-error px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:shadow-xl"
              >
                {currentLanguage === "en"
                  ? "Cancel"
                  : currentLanguage === "ar"
                    ? "إلغاء"
                    : "Annuler"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={isModalOpen2} onClose={handleCloseModal2}>
          <form onSubmit={handleSubmit(onSubmitUpdate)}>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "ar"
                ? "اسم البنك"
                : currentLanguage === "fr"
                  ? "Nom de la banque"
                  : "Bank Name"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                type="text"
                placeholder={
                  currentLanguage === "ar"
                    ? "اسم البنك"
                    : currentLanguage === "fr"
                      ? "Nom de la banque"
                      : "Bank Name"
                }
                {...register("bankName", { required: true })}
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.bankName && (
                <span className="text-error">
                  {currentLanguage === "ar"
                    ? "هذه الخانة مطلوبه"
                    : currentLanguage === "fr"
                      ? "Ce champ est requis"
                      : "This field is required"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "ar"
                ? "عنوان المستفيد"
                : currentLanguage === "fr"
                  ? "Adresse du bénéficiaire"
                  : "Beneficiary Address"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                placeholder={
                  currentLanguage === "ar"
                    ? "عنوان المستفيد"
                    : currentLanguage === "fr"
                      ? "Adresse du bénéficiaire"
                      : "Beneficiary Address"
                }
                {...register("beneficiaryAddress", { required: true })}
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryAddress && (
                <span className="text-error">
                  {currentLanguage === "ar"
                    ? "هذه الخانة مطلوبه"
                    : currentLanguage === "fr"
                      ? "Ce champ est requis"
                      : "This field is required"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "ar"
                ? "اسم المستفيد"
                : currentLanguage === "fr"
                  ? "Nom du bénéficiaire"
                  : "Beneficiary Name"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("beneficiaryName", { required: true })}
                type="text"
                placeholder={
                  currentLanguage === "ar"
                    ? "اسم المستفيد"
                    : currentLanguage === "fr"
                      ? "Nom du bénéficiaire"
                      : "Beneficiary Name"
                }
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryName && (
                <span className="text-error">
                  {currentLanguage === "ar"
                    ? "هذه الخانة مطلوبه"
                    : currentLanguage === "fr"
                      ? "Ce champ est requis"
                      : "This field is required"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "ar"
                ? "رقم حساب المستفيد"
                : currentLanguage === "fr"
                  ? "Numéro de compte du bénéficiaire"
                  : "Beneficiary Account Number"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("beneficiaryAccountNumber", { required: true })}
                placeholder={
                  currentLanguage === "ar"
                    ? "رقم حساب المستفيد"
                    : currentLanguage === "fr"
                      ? "Numéro de compte du bénéficiaire"
                      : "Beneficiary Account"
                }
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.beneficiaryAccountNumber && (
                <span className="text-error">
                  {currentLanguage === "ar"
                    ? "هذه الخانة مطلوبه"
                    : currentLanguage === "fr"
                      ? "Ce champ est requis"
                      : "This field is required"}
                </span>
              )}
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              {currentLanguage === "ar"
                ? "الاسم المختصر للبنك"
                : currentLanguage === "fr"
                  ? "Nom abrégé de la banque"
                  : "Bank Short Name"}
            </h2>
            <div className="mb-4 rounded-sm">
              <input
                {...register("bankShortName", { required: true })}
                placeholder={
                  currentLanguage === "ar"
                    ? "الاسم المختصر للبنك"
                    : currentLanguage === "fr"
                      ? "Nom abrégé de la banque"
                      : "Bank Short Name"
                }
                type="text"
                className="w-full rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.bankShortName && (
                <span className="text-error">
                  {currentLanguage === "ar"
                    ? "هذه الخانة مطلوبه"
                    : currentLanguage === "fr"
                      ? "Ce champ est requis"
                      : "This field is required"}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              {isUpdating ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  {currentLanguage === "ar"
                    ? "تعديل"
                    : currentLanguage === "fr"
                      ? "Modifier"
                      : "Edit"}
                </button>
              )}
              <button
                onClick={handleCloseModal2}
                className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl border bg-bgSecondary px-4 py-2 text-[18px] font-semibold text-black duration-300 ease-in hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إلغاء"
                  : currentLanguage === "fr"
                    ? "Annuler"
                    : "Cancel"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Bank;
