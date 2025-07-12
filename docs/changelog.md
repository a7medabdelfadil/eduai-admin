# 📦 Changelog

## [v0.1.0] - 2025-07-02

### Added
- UI components: `Box`, `BoxGrid`, `Button`, `Comment`, `Input`, `Modal`, `Pagination`, `SearchableSelect`, `Text`, `MessageBubble`, `Sheet`, `TimePicker`, `ImageComponent`, `BreadCrumbs`, `Calendar`.
- Zustand/Redux state slices for: `userData`, `language`, `selectedStudent`, `boolean` toggle.
- Axios setup with token handling and base URL.
- Unit tests for core UI components including Modal, Pagination, Calendar, Card, etc.
- API layer with RTK Query endpoints and custom hooks (e.g., `useStudent`, `usePost`).
- Error handling with `toast.error`, `try/catch`, and `response?.data?.message` support.

### Changed
- Refactored components into structured folders like `components/ui` and `_components`.
- Organized features and API hooks under `APIs/` with clean separation.
- Improved file naming conventions for clarity and scalability.

### Docs
- `api.md`: توثيق كامل لنقاط الاتصال مع الـ Backend.
- `components.md`: توثيق لكل مكون وخصائصه.
- `routing.md`: جميع مسارات صفحات Next.js.
- `state-management.md`: إعداد Zustand أو Redux provider.
- `structure.md`: شجرة مشروع src.
- `testing.md`: سيناريوهات وتغطية ملفات الاختبار.
- `error-handling.md`: استراتيجيات معالجة الأخطاء داخل المشروع.