# Features Documentation

This document provides an overview of the main features available in the EduAI employee website.

## Dashboard

The dashboard provides a comprehensive overview of key metrics and activities.

### Key Components:

- Activity summary
- Quick navigation to essential features
- Notifications center
- Performance metrics

## Financial Management

### Budget Management

The budget section allows financial administrators to:

- Create and manage budgets
- Track expenses against allocated budgets
- Generate visual reports using ApexCharts
- Export financial data

### Example Budget Chart Implementation:

```tsx
const BudgetChart = () => {
  const [series, setSeries] = useState([
    {
      name: "Expense",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ]);

  const [options, setOptions] = useState({
    // Chart options configuration
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};
```

## User Management

The user management system allows administrators to:

- Create and manage user accounts
- Assign roles and permissions
- View user activity and statistics
- Manage user groups and departments

### User Roles:

- Administrator
- Teacher
- Finance Manager
- Support Staff

## Communication Tools

### Chat System

Integrated with CometChat, the platform offers:

- One-on-one messaging
- Group chats
- File sharing
- Read receipts

### Notifications

Real-time notifications via WebSocket for:

- New messages
- System alerts
- Task assignments
- Deadline reminders

## Internationalization

The application supports multiple languages through the language system:

- English
- Arabic
- French
- Other languages as configured

Implementation uses Redux for language state management:

```tsx
// Example usage
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/features/language/languageSlice";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(state => state.language.current);

  const changeLanguage = lang => {
    dispatch(setLanguage(lang));
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ar")}>Arabic</button>
      <button onClick={() => changeLanguage("fr")}>French</button>
    </div>
  );
};
```

## Theme Support

The application includes a dark/light theme toggle using next-themes:

- System preference detection
- Manual theme selection
- Persistent theme preference

## Authentication and Authorization

- Secure login and registration
- Password reset functionality
- Two-factor authentication
- Route protection via middleware
- Role-based access control
