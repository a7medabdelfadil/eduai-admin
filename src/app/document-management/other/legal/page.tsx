// app/document-management/other/legal/page.tsx
import dynamic from "next/dynamic";

const Legal = dynamic(() => import("./LegalComponent"), { ssr: false });

export default function LegalPage() {
  return <Legal />;
}
