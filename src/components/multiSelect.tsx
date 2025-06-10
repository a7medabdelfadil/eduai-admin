import { useState, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";

interface MultiSelectComponentProps {
  control: Control<any>;
  currentLanguage: string;
  errors: FieldErrors;
  name?: string;
  rules?: object;
}

const MultiSelectComponent = ({
  control,
  currentLanguage,
  errors,
  name = "subjects",
  rules = { required: true },
}: MultiSelectComponentProps) => {
  const { setValue } = useFormContext();

  const subjectsOptions = [
    {
      value: "ARABIC",
      label:
        currentLanguage === "en"
          ? "Arabic"
          : currentLanguage === "ar"
            ? "عربي"
            : "Arabe",
    },
    {
      value: "MUSIC",
      label:
        currentLanguage === "en"
          ? "Music"
          : currentLanguage === "ar"
            ? "موسيقى"
            : "Musique",
    },
    {
      value: "ART",
      label:
        currentLanguage === "en"
          ? "Art"
          : currentLanguage === "ar"
            ? "فن"
            : "Art",
    },
    {
      value: "FOREIGN_LANGUAGE",
      label:
        currentLanguage === "en"
          ? "Foreign Language"
          : currentLanguage === "ar"
            ? "لغة أجنبية"
            : "Langue étrangère",
    },
    {
      value: "ENGLISH",
      label:
        currentLanguage === "en"
          ? "English"
          : currentLanguage === "ar"
            ? "إنجليزي"
            : "Anglais",
    },
    {
      value: "SOCIAL_STUDIES",
      label:
        currentLanguage === "en"
          ? "Social Studies"
          : currentLanguage === "ar"
            ? "دراسات اجتماعية"
            : "Études sociales",
    },
    {
      value: "FRENCH",
      label:
        currentLanguage === "en"
          ? "French"
          : currentLanguage === "ar"
            ? "فرنسي"
            : "Français",
    },
    {
      value: "MATHEMATICS",
      label:
        currentLanguage === "en"
          ? "Mathematics"
          : currentLanguage === "ar"
            ? "رياضيات"
            : "Mathématiques",
    },
    {
      value: "COMPUTER_SCIENCE",
      label:
        currentLanguage === "en"
          ? "Computer Science"
          : currentLanguage === "ar"
            ? "علوم الكمبيوتر"
            : "Informatique",
    },
    {
      value: "CHEMISTRY",
      label:
        currentLanguage === "en"
          ? "Chemistry"
          : currentLanguage === "ar"
            ? "كيمياء"
            : "Chimie",
    },
    {
      value: "ECONOMICS",
      label:
        currentLanguage === "en"
          ? "Economics"
          : currentLanguage === "ar"
            ? "اقتصاد"
            : "Économie",
    },
    {
      value: "SCIENCE",
      label:
        currentLanguage === "en"
          ? "Science"
          : currentLanguage === "ar"
            ? "علوم"
            : "Sciences",
    },
    {
      value: "PHYSICS",
      label:
        currentLanguage === "en"
          ? "Physics"
          : currentLanguage === "ar"
            ? "فيزياء"
            : "Physique",
    },
    {
      value: "GEOGRAPHY",
      label:
        currentLanguage === "en"
          ? "Geography"
          : currentLanguage === "ar"
            ? "جغرافيا"
            : "Géographie",
    },
    {
      value: "HISTORY",
      label:
        currentLanguage === "en"
          ? "History"
          : currentLanguage === "ar"
            ? "تاريخ"
            : "Histoire",
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (value: string) => {
    setSelectedOptions(prevSelected =>
      prevSelected.includes(value)
        ? prevSelected.filter(option => option !== value)
        : [...prevSelected, value],
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Synchronize selectedOptions with react-hook-form
  useEffect(() => {
    setValue(name, selectedOptions);
  }, [selectedOptions, setValue, name]);

  return (
    <div className="mt-4 grid items-start text-[18px] font-semibold">
      <label>
        {currentLanguage === "en"
          ? "Subjects"
          : currentLanguage === "ar"
            ? "المواد"
            : "Matières"}
      </label>
      <div className="relative w-full" ref={dropdownRef}>
        <div
          className="mt-2 flex cursor-pointer justify-between overflow-hidden text-clip rounded-xl border border-borderPrimary p-4"
          onClick={toggleDropdown}
        >
          {selectedOptions.length > 0
            ? subjectsOptions
                .filter(option => selectedOptions.includes(option.value))
                .map(option => option.label)
                .join(", ")
            : currentLanguage === "en"
              ? "Select Subjects"
              : currentLanguage === "ar"
                ? "اختر المواد"
                : "Sélectionnez les matières"}
          <div>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 max-h-[200px] w-full overflow-y-auto rounded-xl border border-borderPrimary bg-bgPrimary p-4">
            {subjectsOptions.map(option => (
              <div key={option.value} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  id={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => {
                    handleCheckboxChange(option.value);
                  }}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input type="hidden" {...field} value={selectedOptions} />
        )}
      />
      {errors[name] && (
        <span className="text-[18px] text-error">
          {currentLanguage === "en"
            ? "At least one subject is required"
            : currentLanguage === "ar"
              ? "يجب اختيار مادة واحدة على الأقل"
              : "Au moins un sujet est requis"}
        </span>
      )}
    </div>
  );
};

export default MultiSelectComponent;
