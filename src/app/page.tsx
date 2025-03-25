"use client";
import Dashboard from "./Dashboard/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

export default function Home() {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  return (
    <>
      <div
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[290px]"
        } mt-12`}
      >
        <Dashboard />
      </div>
    </>
  );
}
