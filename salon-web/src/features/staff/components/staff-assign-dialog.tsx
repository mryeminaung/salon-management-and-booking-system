"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffStore } from "../hooks/use-staff";
import api from "@/lib/axios";

interface Salon {
  id: string;
  name: string;
}

interface StaffAssignDialogProps {
  staffId: string | null;
  onOpenChange: (open: boolean) => void;
  onAssigned: () => void;
}

export function StaffAssignDialog({ staffId, onOpenChange, onAssigned }: StaffAssignDialogProps) {
  const [salonId, setSalonId] = useState("");
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { assignStaff } = useStaffStore();

  const open = staffId !== null;
  const selectedSalon = salons.find((s) => s.id === salonId);

  useEffect(() => {
    if (open) {
      setSalonId("");
      setError("");
      api.get("/api/salons").then((res) => {
        setSalons(res.data.data.map((s: any) => ({ id: s.id, name: s.name })));
      }).catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId || !staffId) return;
    setIsLoading(true);
    setError("");
    try {
      await assignStaff(staffId, salonId);
      onOpenChange(false);
      onAssigned();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Salon</DialogTitle>
        </DialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <label htmlFor="salon" className="text-sm font-medium">Salon</label>
            <Select value={salonId} onValueChange={(value) => setSalonId(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a salon">
                  {selectedSalon?.name || "Select a salon"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {salons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Assigning..." : "Assign"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
