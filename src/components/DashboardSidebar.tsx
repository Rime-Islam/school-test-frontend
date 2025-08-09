import { BadgeCheck, BarChart3, Home, Layers, Settings, Users } from "lucide-react";



const items = [
  { label: "Overview", href: "/user/dashboard", icon: "Home", active: true },
  { label: "Users", href: "/user/dashboard/user", icon: "Users" },
  { label: "Text", href: "/user/dashboard/test", icon: "Layers" },
  { label: "Certificates", href: "/user/dashboard/certificate", icon: "BarChart3" },
  { label: "Profile", href: "/user/dashboard/profile", icon: "BadgeCheck" },
  { label: "Settings", href: "#", icon: "Settings" },
];
  const iconMap = {
  Home,
  Users,
  Layers,
  BarChart3,
  Settings,
  BadgeCheck,
};
export function DashboardSidebar() {
  
  return (
    <nav
      className={
        "rounded-lg border bg-white p-2 text-gray-900 shadow-sm " 
      }
    >
      <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Main</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <li key={item.label}>
              <a
                href={item.href}
                className={
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-gray-100 " +
                  (item.active ? "bg-gray-100 font-medium" : "")
                }
                aria-current={item.active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 text-gray-400" />
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-md border bg-gray-100 p-3 text-xs text-gray-500">
        <div className="mb-1 font-medium text-gray-900">Supervisor Access Needed?</div>
        <p className="mb-2">Elevate your account to supervisor status for advanced controls.</p>
        <p
          className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Make Request
        </p>
      </div>
    </nav>
  );
}
