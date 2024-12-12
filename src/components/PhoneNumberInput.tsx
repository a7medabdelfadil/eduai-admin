// PhoneNumberInput.tsx

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

  const countryOptions = Object.entries(countryCodeData).map(
    ([key, value]) => ({
      value: key,
      label: `+${key} (${value})`,
    }),
  );

  return (
    <label
      htmlFor="phoneNumber"
      className="grid font-sans text-[18px] font-semibold"
    >
      {label || getTranslation("phoneNumber")}
      <div className="flex w-[400px] max-w-full items-center gap-2 rounded-xl border border-borderPrimary px-4 py-2">
        <div className="w-[150px]">
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
          placeholder={getTranslation("phoneNumber")}
          className="flex-1 rounded-xl border-none outline-none"
          {...register("number", { required: true })}
        />
      </div>
      {(errors.countryCode || errors.number) && (
        <span className="text-error">{getTranslation("requiredField")}</span>
      )}
    </label>
  );
};

export default PhoneNumberInput;
