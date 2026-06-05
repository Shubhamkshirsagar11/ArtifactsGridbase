// Lucide-style inline SVG icon components.
// Stroke 1.75, default size 16, currentColor.
const Icon = ({ children, size = 16, className = '', strokeWidth = 1.75, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

const IconReceipt = (p) => (<Icon {...p}><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2V2Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></Icon>);
const IconFileSpreadsheet = (p) => (<Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M12 13v4"/></Icon>);
const IconDownload = (p) => (<Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></Icon>);
const IconCheckCircle2 = (p) => (<Icon {...p}><circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></Icon>);
const IconCircleDashed = (p) => (<Icon {...p}><path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/></Icon>);
const IconChevronRight = (p) => (<Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>);
const IconChevronDown = (p) => (<Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>);
const IconChevronUp = (p) => (<Icon {...p}><path d="m18 15-6-6-6 6"/></Icon>);
const IconCalendar = (p) => (<Icon {...p}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></Icon>);
const IconSearch = (p) => (<Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></Icon>);
const IconActivity = (p) => (<Icon {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Icon>);
const IconBolt = (p) => (<Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></Icon>);
const IconClipboard = (p) => (<Icon {...p}><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/></Icon>);
const IconFileText = (p) => (<Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/></Icon>);
const IconClock = (p) => (<Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>);
const IconTicket = (p) => (<Icon {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></Icon>);
const IconBriefcase = (p) => (<Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>);
const IconBookOpen = (p) => (<Icon {...p}><path d="M2 4h7a3 3 0 0 1 3 3v14"/><path d="M22 4h-7a3 3 0 0 0-3 3v14"/></Icon>);
const IconLandmark = (p) => (<Icon {...p}><path d="M3 22h18"/><path d="M5 10h14"/><path d="M5 22V10"/><path d="M19 22V10"/><path d="M9 22v-7"/><path d="M15 22v-7"/><path d="M2 10 12 3l10 7"/></Icon>);
const IconBuilding = (p) => (<Icon {...p}><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></Icon>);
const IconTruck = (p) => (<Icon {...p}><path d="M14 18V6H2v12h12"/><path d="M14 8h4l4 4v6h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></Icon>);
const IconCalculator = (p) => (<Icon {...p}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/></Icon>);
const IconFileBarChart = (p) => (<Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 18v-2"/><path d="M12 18v-4"/><path d="M16 18v-6"/></Icon>);
const IconSettings = (p) => (<Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.41.87.73.21.32.32.69.31 1.07v.4c0 .38-.1.75-.31 1.07-.21.32-.51.57-.87.73Z"/></Icon>);
const IconPanelLeft = (p) => (<Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></Icon>);
const IconChevronUpDown = (p) => (<Icon {...p}><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></Icon>);
const IconInfo = (p) => (<Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></Icon>);
const IconX = (p) => (<Icon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>);
const IconInboxEmpty = (p) => (<Icon {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></Icon>);
const IconSparkle = (p) => (<Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></Icon>);
const IconCornerDownRight = (p) => (<Icon {...p}><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></Icon>);
const IconLock = (p) => (<Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>);
const IconShield = (p) => (<Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>);
const IconUsers = (p) => (<Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>);
const IconLayoutGrid = (p) => (<Icon {...p}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></Icon>);
const IconArrowLeft = (p) => (<Icon {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></Icon>);
const IconDollarSign = (p) => (<Icon {...p}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>);
const IconBuildingOffice = (p) => (<Icon {...p}><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></Icon>);
const IconAlertTriangle = (p) => (<Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></Icon>);
const IconLightbulb = (p) => (<Icon {...p}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></Icon>);

Object.assign(window, {
  Icon,
  IconReceipt, IconFileSpreadsheet, IconDownload, IconCheckCircle2, IconCircleDashed,
  IconChevronRight, IconChevronDown, IconChevronUp, IconCalendar, IconSearch,
  IconActivity, IconBolt, IconClipboard, IconFileText, IconClock, IconTicket,
  IconBriefcase, IconBookOpen, IconLandmark, IconBuilding, IconTruck,
  IconCalculator, IconFileBarChart, IconSettings, IconPanelLeft, IconChevronUpDown,
  IconInfo, IconX, IconInboxEmpty, IconSparkle, IconCornerDownRight, IconLock,
  IconShield, IconUsers, IconLayoutGrid, IconArrowLeft, IconDollarSign, IconBuildingOffice, IconAlertTriangle, IconLightbulb,
});
