"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./Dialog";
import { useGetEmployeePermissionByIdQuery } from "@/features/Organization-Setteings/employeePermissionApi";
import { useGetAllCurrentUserQuery } from "@/features/dashboard/dashboardApi";

const PermissionGuard = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const userId = useSelector((state: RootState) => state.user?.id) || null;
    const { language: currentLanguage } = useSelector(
        (state: RootState) => state.language
    );

    const {
        data: userData,
        isLoading: userLoading,
    } = useGetAllCurrentUserQuery(null);

    const {
        data: permissionData,
        isLoading: permissionLoading,
    } = useGetEmployeePermissionByIdQuery(userId, {
        skip: !userId,
    });

    const [showDialog, setShowDialog] = useState(false);

    type SupportedLanguage = "ar" | "en" | "fr";
    const translations: Record<
        SupportedLanguage,
        { title: string; description: string; button: string }
    > = {
        ar: {
            title: "🚫 لا تملك صلاحية الوصول",
            description:
                "يبدو أنك تحاول الوصول إلى صفحة ليست ضمن صلاحياتك. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مسؤول النظام.",
            button: "الرجوع إلى الصفحة الرئيسية",
        },
        en: {
            title: "🚫 Access Denied",
            description:
                "You are trying to access a page you are not authorized to view. If you believe this is a mistake, please contact the administrator.",
            button: "Go to Home Page",
        },
        fr: {
            title: "🚫 Accès refusé",
            description:
                "Vous essayez d'accéder à une page non autorisée. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.",
            button: "Aller à la page d'accueil",
        },
    };

    const t = translations[(currentLanguage as SupportedLanguage) || "ar"];

    const hasAccess = useMemo(() => {
        if (userLoading || permissionLoading || !userData?.data) return true;

        const role = userData.data.role?.toUpperCase();
        const permissions: string[] = permissionData?.data || [];

        const isAdmin = role === "ADMIN" || permissions.includes("ADMIN");
        if (isAdmin) return true;

        const permissionMap: Record<string, string> = {
            "/financial-management": "FINANCIAL_MANAGEMENT",
            "/course": "COURSE_AND_RESOURCES_MANAGEMENT",
            "/educational-affairs": "EDUCATIONAL_AFFAIRS",
            "/organization-setting": "ORGANIZATION_MANAGEMENT",
            "/post-management": "POST_MANAGEMENT",
            "/notifies": "NOTIFIES",
            "/chat": "REPORTED_CHATS",
            "/document-management": "DOCUMENT_MANAGEMENT",
            "/infrastructure": "INFRASTRUCTURE",
            "/user-management": "USER_MANAGEMENT",
            "/attendances": "ATTENDANCE",
            "/archive": "ARCHIVE",
        };

        for (const path in permissionMap) {
            if (pathname.startsWith(path) && !permissions.includes(permissionMap[path])) {
                return false;
            }
        }

        return true;
    }, [userData, permissionData, userLoading, permissionLoading, pathname]);

    useEffect(() => {
        if (!userLoading && !permissionLoading && userData?.data) {
            setShowDialog(!hasAccess);
        }
    }, [hasAccess, userData, userLoading, permissionLoading]);

    return (
        <>
            <Dialog open={showDialog}>
                <DialogContent className="text-center space-y-4">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 text-xl font-bold">
                            {t.title}
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            {t.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="justify-center">
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
                        >
                            {t.button}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {!showDialog && children}
        </>
    );
};

export default PermissionGuard;
