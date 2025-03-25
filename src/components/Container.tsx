import { RootState } from '@/GlobalRedux/store';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

const Container = ({ children }: { children: ReactNode }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return ( 
    <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[110px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[110px]"
              : "lg:ml-[290px]"
        } mt-[40px] grid py-4`}
      >
        {children}
      </div>
   );
}
 
export default Container;
