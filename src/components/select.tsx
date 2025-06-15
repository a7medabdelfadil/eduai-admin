import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

interface SearchableSelectProps {
  name: string;
  control: any;
  errors: Record<string, any>;
  options: any;
  currentLanguage: string;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  name,
  control,
  errors,
  options,
  currentLanguage,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on the search term
  const filteredOptions = options.filter((option: { label: string }) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Controller
        name={name}
        control={control}
        rules={{ required: "required" }}
        render={({ field }) => (
          <div className="relative">
            {/* Search Input */}
            <input
              type="text"
              placeholder={
                placeholder ||
                (currentLanguage === "ar"
                  ? "ابحث عن مدرسة"
                  : currentLanguage === "fr"
                    ? "Rechercher une école"
                    : "Search and select a school")
              }
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setIsOpen(true); // Open dropdown
              }}
              onFocus={() => setIsOpen(true)}
              className={`w-full rounded-xl p-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary ${
                errors[name] ? "border-red-500" : "border-gray-300"
              } border border-border bg-bgPrimary text-textPrimary shadow-sm`}
            />

            {/* Dropdown List */}
            {isOpen && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-bgSecondary">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(
                    (option: {
                      value: React.Key | null | undefined;
                      label:
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.SetStateAction<string>
                        | null
                        | undefined;
                    }) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          setSearchTerm(String(option.label)); // Set display to the selected option
                          setIsOpen(false); // Close dropdown
                          field.onChange(String(option.value)); // Ensure the value passed is a string
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {String(option.label)}
                      </li>
                    ),
                  )
                ) : (
                  <li className="p-2 text-gray-500 dark:text-gray-300">
                    {currentLanguage === "ar"
                      ? "لا توجد بيانات"
                      : currentLanguage === "fr"
                        ? "Aucune donnée trouvée"
                        : "No data found"}
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      />

      {/* Validation Error */}
      {errors[name] && (
        <span className="mt-1 block text-sm text-red-500">
          {errors[name].message}
        </span>
      )}
    </div>
  );
};

export default SearchableSelect;
