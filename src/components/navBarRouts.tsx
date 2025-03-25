export const navigationItems = [
  {
    id: 'dashboard',
    path: '/',
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>,
    translations: {
      en: "Dashboard",
      ar: "لوحة القيادة",
      fr: "Tableau de bord"
    }
  },
  {
    id: 'search',
    path: '/search',
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>,
    translations: {
      en: "Search",
      ar: "البحث",
      fr: "Recherche"
    }
  },
  {
    id: 'insight',
    path: '/insight',
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-[#526484] group-hover:text-[#3e5af0]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>,
    translations: {
      en: "Insight",
      ar: "نظرة",
      fr: "Aperçu"
    }
  },
  {
    id: 'administration',
    path: '#',
    isDropdown: true,
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 11l2 2l4 -4" />
    </svg>,
    translations: {
      en: "Administration",
      ar: "إدارة",
      fr: "Administration"
    },
    submenu: [
      {
        id: 'user-management',
        path: '/user-management',
        translations: {
          en: "User Management",
          ar: "إدارة المستخدمين",
          fr: "Gestion des utilisateurs"
        }
      },
      {
        id: 'financial-management',
        path: '/financial-management',
        translations: {
          en: "Financial Management",
          ar: "الإدارة المالية",
          fr: "Gestion financière"
        }
      },
      {
        id: 'organization-setting',
        path: '/organization-setting',
        translations: {
          en: "Organization Settings",
          ar: "إعدادات المؤسسة",
          fr: "Paramètres org."
        }
      },
      {
        id: 'document-management',
        path: '/document-management',
        translations: {
          en: "Document Management",
          ar: "إدارة المستندات",
          fr: "Gestion des documents"
        }
      },
      {
        id: 'archive',
        path: '/archive',
        translations: {
          en: "Archive",
          ar: "الأرشيف",
          fr: "Archives"
        }
      }
    ]
  },
  {
    id: 'academic',
    path: '#',
    isDropdown: true,
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="5 6 12 3 19 6" />
      <line x1="4" y1="10" x2="4" y2="21" />
      <line x1="20" y1="10" x2="20" y2="21" />
      <line x1="8" y1="14" x2="8" y2="17" />
      <line x1="12" y1="14" x2="12" y2="17" />
      <line x1="16" y1="14" x2="16" y2="17" />
    </svg>,
    translations: {
      en: "Academic",
      ar: "أكاديمي",
      fr: "Académique"
    },
    submenu: [
      {
        id: 'course',
        path: '/course',
        translations: {
          en: "Course and Resource",
          ar: "الدورات والموارد",
          fr: "Cours et Ressources"
        }
      },
      {
        id: 'educational-affairs',
        path: '/educational-affairs',
        translations: {
          en: "Educational Affairs",
          ar: "الشؤون البيداغوجية",
          fr: "Gestion pédagogique"
        }
      }
    ]
  },
  {
    id: 'operations',
    path: '#',
    isDropdown: true,
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>,
    translations: {
      en: "Operations",
      ar: "العمليات",
      fr: "Opérations"
    },
    submenu: [
      {
        id: 'infrastructure',
        path: '/infrastructure',
        translations: {
          en: "Infrastructures",
          ar: "البنية التحتية",
          fr: "Infrastructures"
        }
      },
      {
        id: 'attendances',
        path: '/attendances',
        translations: {
          en: "Attendance/Leave",
          ar: "الحضور / الإجازة",
          fr: "Assiduité"
        }
      }
    ]
  },
  {
    id: 'communication',
    path: '#',
    isDropdown: true,
    icon: <svg
      className="h-6 w-6 font-sans font-bold text-secondary group-hover:text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>,
    translations: {
      en: "Communication",
      ar: "التواصل",
      fr: "Communication"
    },
    submenu: [
      {
        id: 'chat',
        path: '/chat',
        translations: {
          en: "Reported Chat",
          ar: "الإبلاغات",
          fr: "Discussion signalée"
        }
      },
      {
        id: 'news',
        path: '/post-management/news',
        translations: {
          en: "News",
          ar: "الأخبار",
          fr: "Actualités"
        }
      },
      {
        id: 'post-management',
        path: '/post-management',
        translations: {
          en: "Post Management",
          ar: "إدارة المشاركات",
          fr: "Gestion des publications"
        }
      },
      {
        id: 'notifies',
        path: '/notifies',
        translations: {
          en: "Notifies",
          ar: "الإشعارات",
          fr: "Notifications"
        }
      }
    ]
  }
];
