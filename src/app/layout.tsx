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

  // useEffect(() => {
  //   (document.documentElement.style as any).zoom = "1";
  //   // Initialize CometChat
  //   if (typeof window !== "undefined") {
  //     import("@/components/chat").then(({ initCometChat }: any) => {
  //       initCometChat();
  //     });
  //   }

  //   // Zoom control logic
  //   const handleZoom = (e: WheelEvent | KeyboardEvent) => {
  //     if ((e as KeyboardEvent).ctrlKey || (e as WheelEvent).ctrlKey) {
  //       e.preventDefault();
        
  //       const currentZoom = (document.documentElement.style as any).zoom 
  //         ? parseFloat((document.documentElement.style as any).zoom) 
  //         : 1;

  //       let newZoom = currentZoom;
        
  //       if (e.type === 'wheel') {
  //         const wheelEvent = e as WheelEvent;
  //         if (wheelEvent.deltaY < 0) {
  //           newZoom = Math.min(currentZoom + 0.1, 1.1); // Max 110%
  //         } else {
  //           newZoom = Math.max(currentZoom - 0.1, 0.7); // Min 70%
  //         }
  //       }
        
  //       if (e.type === 'keydown') {
  //         const keyEvent = e as KeyboardEvent;
  //         if (keyEvent.key === '+' || keyEvent.key === '=') {
  //           newZoom = Math.min(currentZoom + 0.1, 1.1);
  //         } else if (keyEvent.key === '-') {
  //           newZoom = Math.max(currentZoom - 0.1, 0.7);
  //         }
  //       }
        
  //       (document.documentElement.style as any).zoom = newZoom.toString();
  //     }
  //   };

  //   // Prevent pinch-to-zoom on touch devices
  //   const handleTouchMove = (e: TouchEvent) => {
  //     if (e.touches.length > 1) {
  //       e.preventDefault();
  //     }
  //   };

  //   // Prevent double-tap zoom
  //   let lastTouchEnd = 0;
  //   const handleTouchEnd = (e: TouchEvent) => {
  //     const now = Date.now();
  //     if (now - lastTouchEnd <= 300) {
  //       e.preventDefault();
  //     }
  //     lastTouchEnd = now;
  //   };

  //   // Add event listeners
  //   window.addEventListener('wheel', handleZoom as any, { passive: false });
  //   window.addEventListener('keydown', handleZoom as any);
  //   document.addEventListener('touchmove', handleTouchMove, { passive: false });
  //   document.addEventListener('touchend', handleTouchEnd, { passive: false });

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener('wheel', handleZoom as any);
  //     window.removeEventListener('keydown', handleZoom as any);
  //     document.removeEventListener('touchmove', handleTouchMove);
  //     document.removeEventListener('touchend', handleTouchEnd);
  //   };
  // }, []);
  


  // useEffect(() => {
  //   const preventZoom = (e: WheelEvent | KeyboardEvent) => {
  //     if ((e as KeyboardEvent).ctrlKey) {
  //       e.preventDefault();
  //     }
  //   };
  
  //   window.addEventListener('wheel', preventZoom as any, { passive: false });
  //   window.addEventListener('keydown', preventZoom as any);
  
  //   return () => {
  //     window.removeEventListener('wheel', preventZoom as any);
  //     window.removeEventListener('keydown', preventZoom as any);
  //   };
  // }, []);
  

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
