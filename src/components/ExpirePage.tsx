/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const ExpirePage = () => {
  return (
    <div className="fixed z-[120] flex h-screen w-screen flex-col items-center bg-[url('/images/Expired.jpg')] bg-cover bg-center">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="relative top-[110px] h-[108px] w-[353px]"
      />

      <h2 className="relative top-[160px] font-sora text-[36px] font-semibold leading-[44px] text-black">
        You have been disconnected
      </h2>

      <p className="relative top-[200px] font-sora text-[28px] font-semibold leading-[36px] text-[#4f5c72]">
        The page has expired!
      </p>

      <Link
        href="/login"
        className="relative top-[250px] flex h-[44px] w-[144px] items-center justify-center rounded-lg bg-blue-500 text-center text-[18px] font-semibold text-white"
      >
        Sign in
      </Link>

      <img
        src="/images/eximage.png"
        alt="#"
        className="relative top-[250px] mt-8 h-[450px] w-[709px]"
      />
    </div>
  );
};

export default ExpirePage;
