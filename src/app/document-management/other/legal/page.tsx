// app/document-management/other/legal/page.tsx
import { Suspense } from "react";
import Legal from "./LegalComponent";

export default function LegalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Legal />
    </Suspense>
  );
}
