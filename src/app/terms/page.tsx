"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { Text } from "@/components/Text";
import Container from "@/components/Container";

type SectionProps = {
  title: string;
  content?: string;
  items?: { title: string; description: string }[];
};

const Section: React.FC<SectionProps> = ({ title, content, items }) => (
  <div className="rounded-2xl bg-bgPrimary p-6 shadow-md dark:shadow-[0_8px_32px_rgba(93,188,252,0.2)] hover:scale-[1.02] transform transition-all duration-300 space-y-3">
    <Text font="semiBold" size="2xl" className="text-primary">{title}</Text>
    {content && <Text font="medium" color="gray" className="leading-relaxed">{content}</Text>}
    {items && (
      <ol className="list-decimal pl-5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-lg font-semibold text-textPrimary">
            {item.title}
            <Text font="medium" color="gray">{item.description}</Text>
          </li>
        ))}
      </ol>
    )}
  </div>
);

const Terms: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.language);
  const translate = (en: string, fr: string, ar: string) =>
    language === "fr" ? fr : language === "ar" ? ar : en;

  return (
    <Container>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="w-full rounded-2xl bg-[#f9f9f9] dark:bg-[#0d0d0d] p-6 space-y-6 transition-all">
        <Text font="bold" size="4xl" className="text-center text-primary">
          {translate("Terms and Conditions", "Termes et Conditions", "الشروط والأحكام")}
        </Text>

        {/* كل الأقسام بنفس التنسيق */}
        <Section title={translate("Effective Date", "Date d'entrée en vigueur", "تاريخ السريان")} content="01/09/2025" />

        <Section
          title={translate("Acceptance Of Terms", "Acceptation des Conditions", "قبول الشروط")}
          content={translate(
            "By accessing or using the EDU AI System, you agree to be bound by these Terms and Conditions...",
            "En accédant ou en utilisant le système EDU AI...",
            "من خلال الوصول إلى نظام EDU AI أو استخدامه..."
          )}
        />

        <Section title={translate("Use Of The Service", "Utilisation du Service", "استخدام الخدمة")} />

        <Section
          title={translate("Eligibility", "Admissibilité", "الأهلية")}
          content={translate(
            "You must be at least 13 years old to use the EDU AI System...",
            "Vous devez avoir au moins 13 ans...",
            "يجب أن تكون على الأقل في سن 13 عامًا..."
          )}
        />

        <Section
          title={translate("Account Registration", "Enregistrement de Compte", "تسجيل الحساب")}
          content={translate(
            "To use certain features of the EDU AI System, you may need to create an account...",
            "Pour utiliser certaines fonctionnalités...",
            "قد تحتاج إلى إنشاء حساب..."
          )}
        />

        <Section
          title={translate("User Responsibilities", "Responsabilités de l'Utilisateur", "مسؤوليات المستخدم")}
          content={translate(
            "You are responsible for maintaining the confidentiality of your account credentials...",
            "Vous êtes responsable de la confidentialité...",
            "أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك..."
          )}
        />

        <Section
          title={translate("Prohibited Activities", "Activités Interdites", "الأنشطة المحظورة")}
          content={translate(
            "You agree not to use the EDU AI System for any unlawful or prohibited activities...",
            "Vous acceptez de ne pas utiliser le système EDU AI...",
            "توافق على عدم استخدام نظام EDU AI..."
          )}
          items={[
            { title: translate("Innovation", "Innovation", "الابتكار"), description: translate("We believe in the power of innovation...", "Nous croyons au pouvoir de l'innovation...", "نؤمن بقوة الابتكار...") },
            { title: translate("Excellence", "Excellence", "التميز"), description: translate("We are committed to delivering high-quality solutions...", "Nous nous engageons à fournir des solutions...", "نلتزم بتقديم حلول عالية الجودة...") },
            { title: translate("Accessibility", "Accessibilité", "إمكانية الوصول"), description: translate("We strive to make education accessible to everyone...", "Nous nous efforçons de rendre l'éducation accessible...", "نسعى لجعل التعليم متاحًا للجميع...") },
            { title: translate("Integrity", "Intégrité", "النزاهة"), description: translate("We uphold the highest standards of integrity...", "Nous respectons les normes les plus élevées...", "نتمسك بأعلى معايير النزاهة...") },
            { title: translate("Collaboration", "Collaboration", "التعاون"), description: translate("We believe in the importance of collaboration...", "Nous croyons en l'importance de la collaboration...", "نؤمن بأهمية التعاون...") }
          ]}
        />

        <Section
          title={translate("Intellectual Property", "Propriété Intellectuelle", "الملكية الفكرية")}
          content={translate(
            "All content, trademarks, and intellectual property on the EDU AI System are owned by us or our licensors...",
            "Tous les contenus, marques et propriétés intellectuelles...",
            "جميع المحتويات والعلامات التجارية والملكية الفكرية..."
          )}
        />

        <Section
          title={translate("Termination Of Service", "Résiliation du Service", "إنهاء الخدمة")}
          content={translate(
            "We reserve the right to suspend or terminate your access...",
            "Nous nous réservons le droit de suspendre...",
            "نحتفظ بالحق في تعليق أو إنهاء..."
          )}
        />

        <Section
          title={translate("Limitation of Liability", "Limitation de Responsabilité", "تحديد المسؤولية")}
          content={translate(
            "To the fullest extent permitted by law, we shall not be liable for any damages...",
            "Dans toute la mesure permise par la loi...",
            "إلى الحد الأقصى الذي يسمح به القانون..."
          )}
        />

        <Section
          title={translate("Indemnification", "Indemnisation", "التعويض")}
          content={translate(
            "You agree to indemnify, defend, and hold harmless the EDU AI System...",
            "Vous acceptez d'indemniser, de défendre...",
            "أنت توافق على تعويض وحماية..."
          )}
        />

        <Section
          title={translate("Governing Law", "Droit Applicable", "القانون الساري")}
          content={translate(
            "These Terms and Conditions shall be governed by and construed in accordance with the laws of...",
            "Ces Termes et Conditions seront régis...",
            "تخضع هذه الشروط والأحكام..."
          )}
        />

        <Section
          title={translate("Changes to Terms", "Modifications des Conditions", "تغييرات في الشروط")}
          content={translate(
            "We may update these Terms and Conditions from time to time...",
            "Nous pouvons mettre à jour ces Termes et Conditions...",
            "يجوز لنا تحديث هذه الشروط والأحكام..."
          )}
        />

        <Section title={translate("Contact Information", "Informations de Contact", "معلومات الاتصال")} />
        <Section title={translate("Email", "E-mail", "البريد الإلكتروني")} content="contact@expotech.online" />
        <Section title={translate("Address", "Adresse", "العنوان")} content="Tetouan: Mezanine block B Office n° 4 BOROUJ 16 Avenue des Far N° 873 Tétouan" />
        <Section title={translate("Phone", "Téléphone", "الهاتف")} content="+212657396706" />
      </div>
    </Container>
  );
};

export default Terms;
