"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiError, type Appointment } from "../types";

type ViewRole = "customer" | "manager" | "staff";

export function AppointmentList({ role }: { role: ViewRole }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await api.get<{ data: Appointment[] }>("/api/appointments");
      setAppointments(response.data.data);
      setError("");
    } catch (err) {
      setError(apiError(err, "Could not load appointments"));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const changeStatus = async (id: string, status: "confirmed" | "completed" | "cancelled") => {
    setBusyId(id);
    setError("");
    try {
      if (role === "customer") await api.patch(`/api/appointments/${id}/cancel`);
      else await api.patch(`/api/appointments/${id}/status`, { status });
      await load();
    } catch (err) {
      await load();
      setError(apiError(err, "Could not update appointment"));
    } finally { setBusyId(null); }
  };

  const title = role === "staff" ? "My Schedule" : role === "customer" ? "My Appointments" : "Appointments";
  const description = role === "manager" ? "Review and update bookings for your salon." : role === "staff" ? "Your assigned appointments." : "View or cancel your bookings.";
  const now = Date.now();

  return <div className="space-y-4">
    <PageHeader title={title} description={description} action={role === "customer" ? <Button render={<Link href="/salons" />}>Book appointment</Button> : undefined} />
    <Separator />
    {error && <p className="text-sm text-destructive">{error}</p>}
    {loading ? <p className="text-muted-foreground">Loading appointments...</p> : appointments.length === 0 ?
      <div className="space-y-3"><p className="text-muted-foreground">No appointments yet.</p>{role === "customer" && <Button render={<Link href="/salons" />}>Browse salons</Button>}</div> :
      <div className="grid gap-4">{appointments.map((appointment) => {
        const canCustomerCancel = role === "customer" && (appointment.status === "pending" || appointment.status === "confirmed") && new Date(appointment.startAt).getTime() > now;
        const canConfirm = role === "manager" && appointment.status === "pending";
        const canComplete = role === "manager" && appointment.status === "confirmed" && new Date(appointment.startAt).getTime() <= now;
        const canManagerCancel = role === "manager" && (appointment.status === "pending" || appointment.status === "confirmed");
        return <Card key={appointment.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle className="text-base">{appointment.serviceName} at {appointment.salonName}</CardTitle><span className="rounded-full border px-3 py-1 text-xs font-medium capitalize">{appointment.status}</span></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-1 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">When:</span> {new Date(appointment.startAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
              <p><span className="text-muted-foreground">Stylist:</span> {appointment.staffName}</p>
              <p><span className="text-muted-foreground">Duration:</span> {Math.round((new Date(appointment.endAt).getTime() - new Date(appointment.startAt).getTime()) / 60000)} min</p>
              <p><span className="text-muted-foreground">Price:</span> ${Number(appointment.price).toLocaleString()}</p>
              {role === "manager" && <p><span className="text-muted-foreground">Customer:</span> {appointment.customer?.user.name} · {appointment.customer?.user.phone}</p>}
            </div>
            {appointment.notes && <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {appointment.notes}</p>}
            {(canCustomerCancel || canConfirm || canComplete || canManagerCancel) && <div className="flex flex-wrap gap-2">
              {canConfirm && <Button disabled={busyId === appointment.id} onClick={() => changeStatus(appointment.id, "confirmed")}>Confirm</Button>}
              {canComplete && <Button disabled={busyId === appointment.id} onClick={() => changeStatus(appointment.id, "completed")}>Complete</Button>}
              {(canCustomerCancel || canManagerCancel) && <Button variant="outline" disabled={busyId === appointment.id} onClick={() => changeStatus(appointment.id, "cancelled")}>Cancel appointment</Button>}
            </div>}
          </CardContent>
        </Card>;
      })}</div>}
  </div>;
}
