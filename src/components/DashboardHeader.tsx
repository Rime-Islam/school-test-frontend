import { Link } from "react-router-dom"; 
import { Bell, Menu, Search, University } from "lucide-react";
import { useCurrentRole } from "../redux/features/auth/authSlice";
import { useAppSelector } from "../redux/hook";

export function DashboardHeader() {
  const role = useAppSelector(useCurrentRole);
  const Role = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : '';
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <button type="button" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <Link to="/" className="flex items-center gap-2">
       <University className="h-6 w-6 text-emerald-600 rounded" />
          <span className="hidden text-sm font-semibold sm:inline">
            {Role} Dashboard
          </span>
        </Link>

        <div className="ml-auto flex flex-1 items-center gap-2 md:ml-6 md:flex-none">
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search..." className="pl-8 border rounded p-2" />
          </div>

          <button type="button" className="ml-auto">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>


        </div>
      </div>
    </header>
  );
}
