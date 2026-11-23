"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useSalonStore } from "@/features/salon";
import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { DashboardQuickActions } from "@/components/dashboard-quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  CartesianGrid,
  YAxis,
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
  Briefcase,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// --- Demo data ---

const monthlyBookings = [
  { month: "Jan", bookings: 85 },
  { month: "Feb", bookings: 102 },
  { month: "Mar", bookings: 118 },
  { month: "Apr", bookings: 135 },
  { month: "May", bookings: 158 },
  { month: "Jun", bookings: 190 },
  { month: "Jul", bookings: 210 },
  { month: "Aug", bookings: 195 },
  { month: "Sep", bookings: 170 },
  { month: "Oct", bookings: 145 },
  { month: "Nov", bookings: 160 },
  { month: "Dec", bookings: 200 },
];

const salonRevenue = [
  { month: "Jan", revenue: 8500 },
  { month: "Feb", revenue: 10200 },
  { month: "Mar", revenue: 11800 },
  { month: "Apr", revenue: 13500 },
  { month: "May", revenue: 15800 },
  { month: "Jun", revenue: 19000 },
];

const salonTypeBreakdown = [
  { name: "Hair Salon", value: 45, fill: "var(--color-hair)" },
  { name: "Nail Studio", value: 25, fill: "var(--color-nail)" },
  { name: "Spa & Wellness", value: 20, fill: "var(--color-spa)" },
  { name: "Barbershop", value: 10, fill: "var(--color-barber)" },
];

const recentCustomers = [
  { name: "Emma Wilson", email: "emma@example.com", joined: "2 hours ago" },
  { name: "James Chen", email: "james@example.com", joined: "5 hours ago" },
  { name: "Sophia Martinez", email: "sophia@example.com", joined: "1 day ago" },
  { name: "Liam Johnson", email: "liam@example.com", joined: "2 days ago" },
  { name: "Olivia Brown", email: "olivia@example.com", joined: "3 days ago" },
];

const barChartConfig = {
  bookings: {
    label: "Bookings",
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
  hair: { label: "Hair Salon", color: "#8b5cf6" },
  nail: { label: "Nail Studio", color: "#ec4899" },
  spa: { label: "Spa & Wellness", color: "#14b8a6" },
  barber: { label: "Barbershop", color: "#f59e0b" },
} satisfies ChartConfig;

const quickActions = [
  { label: "Manage salons", description: "Locations and publishing", href: "/admin/salons", icon: Scissors },
  { label: "Add manager", description: "Assign location leadership", href: "/admin/managers", icon: Users },
  { label: "Manage staff", description: "Team access and schedules", href: "/admin/staff", icon: Users },
  { label: "Manage services", description: "Pricing and availability", href: "/admin/services", icon: Scissors },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { salons, fetchSalons } = useSalonStore();

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  const totalStaff = salons.reduce((acc, s) => acc + (s._count?.staff ?? 0), 0);
  const totalServices = salons.reduce((acc, s) => acc + (s._count?.services ?? 0), 0);

  const stats = [
    { title: "Total Salons", value: salons.length, description: "Active salons", icon: Scissors },
    { title: "Total Staff", value: totalStaff, description: "Across all salons", icon: Users },
    { title: "Total Services", value: totalServices, description: "Active services", icon: Briefcase },
    { title: "Managers", value: salons.filter((s) => s.manager).length, description: "Assigned", icon: UserCheck },
  ];

  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["owner"]}>
        <div className="space-y-8">
          <PageHeader
            title={`Welcome back, ${user?.name}!`}
            description="Owner Dashboard"
          />

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

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Bar Chart — Monthly Bookings */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  Monthly Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                  <BarChart data={monthlyBookings} barSize={28}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Customers */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base">Recent Customers</CardTitle>
                <p className="text-sm text-muted-foreground">5 new this week</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCustomers.map((customer, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Avatar className="size-9">
                        <AvatarFallback className="text-xs bg-muted">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">{customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {customer.joined}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue + Salon Types Row */}
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Line Chart — Revenue Trend */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="h-[260px] w-full">
                  <LineChart data={salonRevenue}>
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

            {/* Pie Chart — Salon Type Breakdown */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-1">
                <CardTitle className="text-base font-semibold">Salon types</CardTitle>
                <p className="text-sm text-muted-foreground">Portfolio distribution by location type</p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
                  <div className="relative mx-auto w-full max-w-56">
                    <ChartContainer config={pieChartConfig} className="h-[220px] w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie
                          data={salonTypeBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={82}
                          innerRadius={56}
                          paddingAngle={2}
                          cornerRadius={4}
                          strokeWidth={0}
                        >
                          {salonTypeBreakdown.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-semibold tabular-nums">100%</span>
                      <span className="text-[11px] text-muted-foreground">Portfolio</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
                    {salonTypeBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-2.5">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{item.name}</p>
                          <p className="text-[11px] tabular-nums text-muted-foreground">{item.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DashboardQuickActions actions={quickActions} />
        </div>
      </RoleGuard>
    </ProtectedLayout>
  );
}
