"use client";

import Container from "@/components/Container";
import { Text } from "@/components/Text";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl bg-bgPrimary p-6 shadow-md dark:shadow-[0_8px_32px_rgba(93,188,252,0.2)]
  hover:scale-[1.02] transform transition-all duration-300">
        <Text font="semiBold" size="2xl" className="mb-2 text-primary">{title}</Text>
        {children}
    </div>
);

const ContactInfo = ({ label, value }: { label: string; value: string }) => (
    <div>
        <Text font="semiBold" size="lg">{label}:</Text>
        <Text font="medium" color="gray">{value}</Text>
    </div>
);

const About = () => {
    const { language } = useSelector((state: RootState) => state.language);
    const translate = (en: string, fr: string, ar: string) =>
        language === "fr" ? fr : language === "ar" ? ar : en;

    const values = [
        {
            en: "Innovation",
            fr: "Innovation",
            ar: "الابتكار",
            description: {
                en: "We believe in the power of innovation to transform education and drive progress.",
                fr: "Nous croyons au pouvoir de l'innovation pour transformer l'éducation et stimuler le progrès.",
                ar: "نؤمن بقوة الابتكار في تحويل التعليم ودفع التقدم.",
            },
        },
        {
            en: "Excellence",
            fr: "Excellence",
            ar: "التميز",
            description: {
                en: "We are committed to delivering high-quality solutions that meet the needs of our users.",
                fr: "Nous nous engageons à fournir des solutions de haute qualité répondant aux besoins de nos utilisateurs.",
                ar: "نلتزم بتقديم حلول عالية الجودة تلبي احتياجات مستخدمينا.",
            },
        },
    ];

    return (
        <Container>
            <div
                dir={language === "ar" ? "rtl" : "ltr"}
                className="w-full rounded-2xl bg-bgPrimary p-8 space-y-8 shadow-sm transition-all"
            >
                <Text font="bold" size="4xl" className="text-center text-primary">
                    {translate("About us", "À propos de nous", "من نحن")}
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section title={translate("About EDU AI System", "À propos du système EDU AI", "حول نظام EDU AI")}>
                        <Text font="medium" color="gray">
                            {translate(
                                "The EDU AI System is an advanced educational platform designed to enhance the learning experience...",
                                "Le système EDU AI est une plateforme éducative avancée conçue pour améliorer l'expérience...",
                                "نظام EDU AI هو منصة تعليمية متقدمة تهدف إلى تحسين تجربة التعلم..."
                            )}
                        </Text>
                    </Section>

                    <Section title={translate("Our Mission", "Notre mission", "مهمتنا")}>
                        <Text font="medium" color="gray">
                            {translate(
                                "Our mission is to revolutionize education by providing intelligent solutions...",
                                "Notre mission est de révolutionner l'éducation...",
                                "مهمتنا هي إحداث ثورة في التعليم..."
                            )}
                        </Text>
                    </Section>

                    <Section title={translate("Our Vision", "Notre vision", "رؤيتنا")}>
                        <Text font="medium" color="gray">
                            {translate(
                                "We envision a world where every learner has access to the tools...",
                                "Nous envisageons un monde où chaque apprenant a accès...",
                                "نحن نتخيل عالماً يتمكن فيه كل متعلم من الوصول..."
                            )}
                        </Text>
                    </Section>

                    <Section title={translate("Our Values", "Nos valeurs", "قيمنا")}>
                        <ul className="list-decimal pl-5 space-y-2">
                            {values.map(({ en, fr, ar, description }) => (
                                <li key={en}>
                                    <Text font="semiBold" size="lg">{translate(en, fr, ar)}</Text>
                                    <Text font="medium" color="gray">
                                        {translate(description.en, description.fr, description.ar)}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>

                <Section title={translate("Contact Information", "Informations de contact", "معلومات الاتصال")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ContactInfo label={translate("Email", "E-mail", "البريد الإلكتروني")} value="contact@expotech.online" />
                        <ContactInfo label={translate("Address", "Adresse", "العنوان")} value="Tetouan..." />
                        <ContactInfo label={translate("Phone", "Téléphone", "الهاتف")} value="0708759037" />
                    </div>
                </Section>
            </div>
        </Container>
    );
};

export default About;
