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
              ? "lg:mr-[110px] ml-[15px]"
              : "lg:mr-[270px] ml-[15px]"
            : booleanValue
              ? "lg:ml-[110px] mr-[15px]"
              : "lg:ml-[270px] mr-[15px]"
        } grid p-4 `}
      >
        {children}
      </div>
   );
}
 
export default Container;
