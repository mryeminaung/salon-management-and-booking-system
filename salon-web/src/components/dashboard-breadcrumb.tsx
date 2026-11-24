import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  salons: "Salons",
  staff: "Staff",
  services: "Services",
  appointments: "Appointments",
  schedule: "Schedule",
  profile: "Profile",
  settings: "Settings",
  managers: "Managers",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-foreground hover:bg-muted"
      >
        <Home className="size-3.5" />
        <span>Home</span>
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = routeLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 1;

        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="rounded-md px-1.5 py-0.5 transition-colors hover:text-foreground hover:bg-muted"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
