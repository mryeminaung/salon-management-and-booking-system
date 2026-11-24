"use client";

import { useAuthStore } from "@/stores/auth-store";
import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { useAppointments } from "@/features/appointment/hooks/use-appointments";
import { StaffDashboard } from "@/features/staff/components/staff-dashboard";
import {
  DashboardQuickActions,
  type DashboardQuickAction,
} from "@/components/dashboard-quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Scissors,
  Users,
  UserCheck,
  Calendar,
  Settings,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// --- Demo data ---

const weeklyAppointments = [
  { day: "Mon", appointments: 12, revenue: 480 },
  { day: "Tue", appointments: 18, revenue: 720 },
  { day: "Wed", appointments: 15, revenue: 600 },
  { day: "Thu", appointments: 22, revenue: 880 },
  { day: "Fri", appointments: 28, revenue: 1120 },
  { day: "Sat", appointments: 35, revenue: 1400 },
  { day: "Sun", appointments: 10, revenue: 400 },
];

const serviceBreakdown = [
  { name: "Haircut", value: 35, fill: "var(--color-haircut)" },
  { name: "Coloring", value: 25, fill: "var(--color-coloring)" },
  { name: "Styling", value: 20, fill: "var(--color-styling)" },
  { name: "Treatment", value: 15, fill: "var(--color-treatment)" },
  { name: "Other", value: 5, fill: "var(--color-other)" },
];

const monthlyTrend = [
  { month: "Jan", appointments: 120, revenue: 4800 },
  { month: "Feb", appointments: 145, revenue: 5800 },
  { month: "Mar", appointments: 160, revenue: 6400 },
  { month: "Apr", appointments: 190, revenue: 7600 },
  { month: "May", appointments: 210, revenue: 8400 },
  { month: "Jun", appointments: 250, revenue: 10000 },
];

const barChartConfig = {
  appointments: {
    label: "Appointments",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  haircut: { label: "Haircut", color: "hsl(var(--chart-1))" },
  coloring: { label: "Coloring", color: "hsl(var(--chart-2))" },
  styling: { label: "Styling", color: "hsl(var(--chart-3))" },
  treatment: { label: "Treatment", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

// --- Endpoints ---

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getManagerActions(): DashboardQuickAction[] {
  return [
    { label: "Manage staff", description: "Team access and schedules", href: "/staff", icon: Users },
    { label: "Manage services", description: "Pricing and availability", href: "/services", icon: Scissors },
    { label: "Appointments", description: "Review the booking calendar", href: "/appointments", icon: Calendar },
    { label: "Settings", description: "Salon and account preferences", href: "/settings", icon: Settings },
  ];
}

function getCustomerActions(): DashboardQuickAction[] {
  return [
    { label: "Browse salons", description: "Discover services near you", href: "/salons", icon: Scissors },
    { label: "My appointments", description: "Review upcoming bookings", href: "/appointments", icon: Calendar },
    { label: "My profile", description: "Update personal information", href: "/profile", icon: UserCheck },
  ];
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const normalizedRole = user?.role?.toLowerCase() ?? "";
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments(Boolean(user && ["manager", "staff", "customer"].includes(normalizedRole || "")));

  if (isAuthLoading) {
    return (
      <ProtectedLayout>
        <div />
      </ProtectedLayout>
    );
  }

  if (!user) {
    return (
      <ProtectedLayout>
        <RoleGuard allowedRoles={["manager", "staff", "customer"]}><div /></RoleGuard>
      </ProtectedLayout>
    );
  }

  if (normalizedRole === "staff") {
    return (
      <ProtectedLayout>
        <RoleGuard allowedRoles={["staff"]}>
          <StaffDashboard appointments={appointments} isLoading={appointmentsLoading} error={appointmentsError} />
        </RoleGuard>
      </ProtectedLayout>
    );
  }

  const now = new Date();
  const upcoming = appointments?.filter((appointment) =>
    (appointment.status === "pending" || appointment.status === "confirmed") && new Date(appointment.startAt) > now,
  ).length;
  const todayCount = appointments?.filter((appointment) =>
    new Date(appointment.startAt).toDateString() === now.toDateString() && appointment.status !== "cancelled",
  ).length;
  const visitedSalons = new Set(appointments.filter((appointment) => appointment.status === "completed").map((appointment) => appointment.salonName)).size;

  const stats: StatCard[] =
    normalizedRole === "manager"
      ? [
          { title: "Total Staff", value: "12", description: "Active members", icon: Users },
          { title: "Services", value: "24", description: "Active services", icon: Scissors },
          { title: "Today's Bookings", value: appointmentsLoading ? "..." : todayCount, description: "Scheduled today", icon: Calendar },
          { title: "Monthly Revenue", value: "$10.0k", description: "+18% from last month", icon: DollarSign },
        ]
      : normalizedRole === "customer"
      ? [
          { title: "My Appointments", value: appointmentsLoading ? "..." : upcoming, description: "Upcoming", icon: Calendar },
          { title: "Visited Salons", value: appointmentsLoading ? "..." : visitedSalons, description: "Completed visits", icon: Scissors },
        ]
      : [];

  const actions =
    normalizedRole === "manager"
      ? getManagerActions()
      : getCustomerActions();

  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["manager", "customer"]}>
        <div className="space-y-8">
          <PageHeader
            title={`Welcome back, ${user.name}!`}
            description={`${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} Dashboard`}
          />

          {appointmentsError && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{appointmentsError}</p>}

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <KpiCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Charts Section (manager view) */}
          {normalizedRole === "manager" && (
            <div className="grid gap-4 lg:grid-cols-7">
              {/* Weekly Appointments Bar Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    Weekly Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={barChartConfig} className="h-[280px] w-full">
                    <BarChart data={weeklyAppointments} barSize={32}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={4} width={30} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Service Breakdown Pie Chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base">Service Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={pieChartConfig} className="h-[280px] w-full">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <Pie
                        data={serviceBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        strokeWidth={2}
                        stroke="hsl(var(--background))"
                      >
                        {serviceBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Monthly Trend Line Chart (manager view) */}
          {normalizedRole === "manager" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="h-[260px] w-full">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-primary)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          <DashboardQuickActions actions={actions} />
        </div>
      </RoleGuard>
    </ProtectedLayout>
  );
}
