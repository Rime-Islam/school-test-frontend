import { BadgeCheck, BarChart3, Home, Layers, Settings, Users, Wrench } from "lucide-react";
import { useAppSelector } from "../redux/hook";
import { useCurrentRole } from "../redux/features/auth/authSlice";

const roleBasedItems = {
  student: [
    { label: "Overview", href: "/student/dashboard", icon: "Home", active: true },
    { label: "Users", href: "/student/dashboard/user", icon: "Users" },
    { label: "Text", href: "/student/dashboard/test", icon: "Layers" },
    { label: "Certificates", href: "/student/dashboard/certificate", icon: "BarChart3" },
    { label: "Change Password", href: "/student/dashboard/change-password", icon: "BadgeCheck" },
    { label: "Settings", href: "/student/dashboard", icon: "Settings" },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: "Home", active: true },
    { label: "Users", href: "/admin/dashboard/user", icon: "Users" },
    { label: "Create Question", href: "/admin/dashboard/create-question", icon: "Layers" },
    { label: "All Question", href: "/admin/dashboard/questions", icon: "BarChart3" },
    { label: "Change Password", href: "/admin/dashboard/change-password", icon: "BadgeCheck" },
    { label: "Admin Tools", href: "/admin/dashboard", icon: "Tool" },
    { label: "Settings", href: "/admin/dashboard", icon: "Settings" },
  ],
  supervisor: [
    { label: "Overview", href: "/supervisor/dashboard", icon: "Home", active: true },
    { label: "Students", href: "/supervisor/dashboard/students", icon: "Users" },
    { label: "Projects", href: "/supervisor/dashboard/projects", icon: "Layers" },
    { label: "Change Password", href: "/supervisor/dashboard/change-password", icon: "BadgeCheck" },
  ]
};

const iconMap = {
  Home,
  Users,
  Layers,
  BarChart3,
  Settings,
  BadgeCheck,
  Tool: Wrench, // Map "Tool" to Wrench icon
};

export function DashboardSidebar() {
  const role = useAppSelector(useCurrentRole);
  const formattedRole = role?.toLowerCase();
  const items = formattedRole ? roleBasedItems[formattedRole as keyof typeof roleBasedItems] || [] : [];
  
  return (
    <nav className="rounded-lg border bg-white p-2 text-gray-900 shadow-sm">
      <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Main</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          if (!Icon) return null; // Skip if icon not found
          
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
        <p className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700">
          Make Request
        </p>
      </div>
    </nav>
  );
}