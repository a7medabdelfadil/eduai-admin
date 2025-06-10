"use client";
import React from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import SearchableSelect from "./select";

interface CountryCodeDataItem {
  countryCode: string;
  countryName: string;
  dialCode: string;
}

interface PhoneNumberInputProps {
  countryCodeData: CountryCodeDataItem[];
  currentLanguage: string;
  label?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  countryCodeData,
  currentLanguage,
  label,
  register,
  errors,
  control,
}) => {
  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      phoneNumber: {
        en: "Phone Number",
        ar: "رقم الهاتف",
        fr: "Numéro de téléphone",
      },
      requiredField: {
        en: "This field is required",
        ar: "هذا الحقل مطلوب",
        fr: "Ce champ est requis",
      },
      code: {
        en: "Code",
        ar: "رمز",
        fr: "Code",
      },
    };
    return translations[key][currentLanguage] || translations[key]["en"];
  };

  const safeCountryCodeData = countryCodeData || {};
  const countryOptions = Object.entries(safeCountryCodeData).map(
    ([key, value]) => ({
      value: key,
      label: `+${key} (${value})`,
    }),
  );

  return (
    <label htmlFor="phoneNumber" className="grid text-[18px] font-semibold">
      {label || getTranslation("phoneNumber")}
      <div className="flex w-full max-w-full items-center gap-2 rounded-xl border border-borderPrimary px-4 py-2">
        <div className="w-[25%]">
          <SearchableSelect
            name="countryCode"
            control={control}
            errors={errors}
            options={countryOptions}
            currentLanguage={currentLanguage}
            placeholder={getTranslation("code")}
          />
        </div>
        <input
          id="number"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={getTranslation("phoneNumber")}
          className="flex-1 bg-bgPrimary rounded-xl border-none outline-none"
          {...register("number", {
            required: true,
            onChange: e => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
        />
      </div>
      {(errors.countryCode || errors.number) && (
        <span className="text-error">{getTranslation("requiredField")}</span>
      )}
    </label>
  );
};

export default PhoneNumberInput;
