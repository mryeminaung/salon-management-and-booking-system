"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Scissors, Users } from "lucide-react";
import { apiError, type BookableSalon, type SalonDetails } from "../types";

export function CustomerSalons() {
  const router = useRouter();
  const [salons, setSalons] = useState<BookableSalon[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<SalonDetails | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ data: BookableSalon[] }>("/api/appointments/bookable-salons")
      .then((response) => setSalons(response.data.data))
      .catch((err) => setError(apiError(err, "Could not load salons")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let current = true;
    setDetails(null);
    setError("");
    api.get<{ data: SalonDetails }>(`/api/appointments/bookable-salons/${selectedId}`)
      .then((response) => { if (current) setDetails(response.data.data); })
      .catch((err) => { if (current) setError(apiError(err, "Could not load salon")); });
    return () => { current = false; };
  }, [selectedId]);

  useEffect(() => {
    setSlot("");
    setSlots([]);
    if (!selectedId || !serviceId || !staffId || !date) return;
    let current = true;
    setError("");
    setLoadingSlots(true);
    const timezoneOffset = new Date(`${date}T12:00:00`).getTimezoneOffset();
    api.get<{ data: string[] }>(`/api/appointments/bookable-salons/${selectedId}/availability`, {
      params: { serviceId, staffId, date, timezoneOffset },
    }).then((response) => { if (current) setSlots(response.data.data); })
      .catch((err) => { if (current) setError(apiError(err, "Could not load available times")); })
      .finally(() => { if (current) setLoadingSlots(false); });
    return () => { current = false; };
  }, [selectedId, serviceId, staffId, date]);

  const openBooking = (id: string) => {
    setServiceId(""); setStaffId(""); setDate(""); setSlot(""); setSlots([]); setNotes(""); setError("");
    setSelectedId(id);
  };

  const book = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId || !serviceId || !staffId || !slot || !date) return;
    setSaving(true);
    setError("");
    try {
      await api.post("/api/appointments", {
        salonId: selectedId, serviceId, staffId, startAt: slot,
        timezoneOffset: new Date(`${date}T12:00:00`).getTimezoneOffset(), notes,
      });
      setSelectedId(null);
      router.push("/appointments");
    } catch (err) {
      setError(apiError(err, "Could not book appointment"));
      setSlot("");
      setSlots((current) => current.filter((time) => time !== slot));
    } finally { setSaving(false); }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const latest = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const maxDate = `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, "0")}-${String(latest.getDate()).padStart(2, "0")}`;

  return <div className="space-y-4">
    <PageHeader title="Salons" description="Choose a salon, service, stylist, and available time." />
    <Separator />
    {error && !selectedId && <p className="text-sm text-destructive">{error}</p>}
    {loading ? <p className="text-muted-foreground">Loading salons...</p> : salons.length === 0 ?
      <p className="text-muted-foreground">No salons are accepting bookings yet.</p> :
      <div className="grid gap-4 md:grid-cols-2">{salons.map((salon) => <Card key={salon.id}>
        <CardHeader><CardTitle>{salon.name}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{salon.description}</p>
          <p className="flex items-center gap-2 text-sm"><MapPin className="size-4" />{salon.address}</p>
          <div className="flex gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Scissors className="size-4" />{salon._count.services} services</span><span className="flex items-center gap-1"><Users className="size-4" />{salon._count.staff} stylists</span></div>
          <Button onClick={() => openBooking(salon.id)}><CalendarDays className="size-4" /> Book appointment</Button>
        </CardContent>
      </Card>)}</div>}

    <Dialog open={selectedId !== null} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Book at {details?.name || "salon"}</DialogTitle></DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!details ? <p className="text-muted-foreground">Loading services and stylists...</p> :
          <form onSubmit={book} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="booking-service">Service</Label><select id="booking-service" className="w-full rounded-md border bg-background px-3 py-2" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
              <option value="">Choose a service</option>{details.services.map((service) => <option key={service.id} value={service.id}>{service.name} · {service.duration} min · ${Number(service.price).toLocaleString()}</option>)}
            </select></div>
            <div className="space-y-2"><Label htmlFor="booking-staff">Stylist</Label><select id="booking-staff" className="w-full rounded-md border bg-background px-3 py-2" value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
              <option value="">Choose a stylist</option>{details.staff.map((staff) => <option key={staff.id} value={staff.id}>{staff.user.name}{staff.specialty ? ` · ${staff.specialty}` : ""}</option>)}
            </select></div>
            <div className="space-y-2"><Label htmlFor="booking-date">Date</Label><Input id="booking-date" type="date" min={minDate} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} required /></div>
            {date && serviceId && staffId && <div className="space-y-2"><Label>Available times</Label>
              {loadingSlots ? <p className="text-sm text-muted-foreground">Loading times...</p> : slots.length === 0 ? <p className="text-sm text-muted-foreground">No available times on this date.</p> :
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{slots.map((time) => <Button key={time} type="button" variant={slot === time ? "default" : "outline"} onClick={() => setSlot(time)}>{new Date(time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Button>)}</div>}
            </div>}
            <div className="space-y-2"><Label htmlFor="booking-notes">Notes (optional)</Label><Input id="booking-notes" maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the stylist should know" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setSelectedId(null)}>Cancel</Button><Button type="submit" disabled={!slot || saving}>{saving ? "Booking..." : "Confirm booking"}</Button></DialogFooter>
          </form>}
      </DialogContent>
    </Dialog>
  </div>;
}
