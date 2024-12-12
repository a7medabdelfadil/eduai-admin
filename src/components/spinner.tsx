import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const Spinner = () => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <span className="sr-only">
          {currentLanguage === "ar"
            ? "جاري التحميل..."
            : currentLanguage === "fr"
              ? "Chargement..."
              : "Loading..."}
        </span>
        <div className="h-6 w-6 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
        <div className="h-6 w-6 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
        <div className="h-6 w-6 animate-bounce rounded-full bg-primary [animation-delay:-0.27s]"></div>
        <div className="h-6 w-6 animate-bounce rounded-full bg-primary [animation-delay:-0.50s]"></div>
        <div className="h-6 w-6 animate-bounce rounded-full bg-primary"></div>
      </div>
    </>
  );
};

export default Spinner;
