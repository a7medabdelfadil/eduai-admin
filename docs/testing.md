# ✅ Testing Documentation

## 🧪 `BreadCrumbs.test.tsx`
- **Component:** BreadCrumbs Component: checks localization, current path highlighting, RTL/LTR support, and breadcrumb rendering
- **Covered Scenarios:**
  - English, Arabic, French localization
  - Active link highlighting
  - Directionality (LTR/RTL)
  - Arrow icons behavior

## 🧪 `Calendar.test.tsx`
- **Component:** Calendar Component: validates month navigation, day selection, and localization (English/Arabic)
- **Covered Scenarios:**
  - Current month/year rendering
  - Next/Previous month navigation
  - Day cell selection and styling
  - Localization of day names

## 🧪 `card.test.tsx`
- **Component:** Card Component: verifies rendering with image or icon, RTL/LTR layout based on language
- **Covered Scenarios:**
  - Rendering image if `imgSrc` is provided
  - Rendering icon fallback if no image
  - Text and href checks
  - RTL/LTR layout based on language

## 🧪 `ImageComponent.test.tsx`
- **Component:** ImageComponent: handles image loading, error fallback, placeholders, and priority rendering
- **Covered Scenarios:**
  - Image loading with priority
  - Custom loading placeholder
  - Error handling with fallback
  - `onLoadingComplete` and `onError` callbacks

## 🧪 `Modal.test.tsx`
- **Component:** Modal Component: tests open/close behavior, backdrop clicks, and conditional rendering
- **Covered Scenarios:**
  - Conditional rendering based on `isOpen`
  - Close callback from backdrop click
  - Prevent close when clicking inside modal

## 🧪 `Pagination.test.tsx`
- **Component:** Pagination Component: validates localization, page switching, element selection, and visibility handling
- **Covered Scenarios:**
  - Localization of labels (EN, AR, FR)
  - Page navigation via buttons
  - Element per page dropdown
  - Visibility logic for prev/next buttons
  - Ellipsis when total pages > 5

## 🧪 `Sheet.test.tsx`
- **Component:** Sheet Component: checks slide-over visibility, close actions, and user interaction with backdrop vs content
- **Covered Scenarios:**
  - Slide-over visibility control via `isOpen`
  - Close button functionality
  - Backdrop click to close
  - Prevent close on internal click

## 🧪 `TimePicker.test.tsx`
- **Component:** TimePicker Component: verifies time input behavior, wheel interaction, and AM/PM toggling
- **Covered Scenarios:**
  - Default time rendering
  - Manual hour/minute input and wrapping
  - Mouse wheel interaction
  - AM/PM toggle and state switching
