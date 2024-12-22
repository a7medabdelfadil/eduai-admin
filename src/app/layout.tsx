"use client";

import React, { ReactNode, useEffect } from "react";
import "./globals.css";
import NavBar from "./../components/navBar";
import { Providers } from "@/GlobalRedux/provider";
import Notification from "@/components/Notifications";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import ThemeProvider from "./providers/themeProvider";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/components/chat").then(({ initCometChat }: any) => {
        initCometChat();
      });
    }
  }, []);

  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <title>Admin Dashboard</title>
        <meta
          name="description"
          content="Manage your EduAI tech settings and configurations from the Admin Dashboard."
        />
        <meta property="og:title" content="Admin Dashboard" />
        <meta
          property="og:description"
          content="Manage your EduAI tech settings and configurations from the Admin Dashboard."
        />
        <meta property="og:url" content="https://admin.eduai.tech/" />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/x-icon" href="/images/Login.png" />
      </head>
      <body className="bg-bgSecondary">
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
