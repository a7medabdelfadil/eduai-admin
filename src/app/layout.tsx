"use client";

import React, { ReactNode, useEffect } from "react";
import "./globals.css";
import NavBar from "./../components/navBar";
import { Providers } from "@/GlobalRedux/provider";
import Notification from "@/components/Notifications";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import ThemeProvider from "./providers/themeProvider";
import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
});

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/new-password" ||
    pathname === "/forget-password" ||
    pathname === "/otp" ||
    pathname === "/confirm-account" ||
    pathname === "/choose-account";

  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <title>Welcome to EduAI Admin Portal</title>
        <meta
          name="description"
          content="Manage school operations efficiently, oversee teacher and student activities, and streamline communication. Your central hub for organizing and optimizing school management tasks."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=1.1, user-scalable=no"
        />
        <link rel="icon" type="image/x-icon" href="/images/Login.png" />
      </head>
      <body className={`bg-bgSecondary ${sora.variable} font-sora`}>
      <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {!isLoginPage && <NavBar />}
            <Notification />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
