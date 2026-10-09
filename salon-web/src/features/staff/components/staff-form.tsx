"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCwIcon } from "lucide-react";
import { CredentialsDisplayDialog } from "./credentials-display-dialog";
import type { Staff } from "../hooks/use-staff";

const SPECIALTY_OPTIONS = [
  { value: "Hair Stylist", label: "Hair Stylist" },
  { value: "Colorist", label: "Colorist" },
  { value: "Barber", label: "Barber" },
  { value: "Nail Technician", label: "Nail Technician" },
  { value: "Esthetician", label: "Esthetician" },
  { value: "Makeup Artist", label: "Makeup Artist" },
  { value: "Massage Therapist", label: "Massage Therapist" },
];

function generatePassword(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff | null;
  onSubmit: (data: any) => Promise<void>;
}

export function StaffForm({ open, onOpenChange, staff, onSubmit }: StaffFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", specialty: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ name: string; email: string; password: string } | null>(null);

  const isEditing = !!staff;
  const selectedSpecialty = SPECIALTY_OPTIONS.find((o) => o.value === formData.specialty);

  useEffect(() => {
    if (open && staff) {
      setFormData({
        name: staff.user?.name || "",
        email: staff.user?.email || "",
        password: "",
        phone: staff.user?.phone || "",
        specialty: staff.specialty || "",
      });
    } else if (open) {
      setFormData({ name: "", email: "", password: "", phone: "", specialty: "" });
    }
    setError("");
  }, [open, staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (isEditing) {
        await onSubmit({
          name: formData.name,
          phone: formData.phone,
          specialty: formData.specialty || undefined,
        });
        onOpenChange(false);
      } else {
        // Capture credentials before submission
        const credentials = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        await onSubmit({
          ...formData,
          phone: formData.phone,
          specialty: formData.specialty || undefined,
        });

        // Close form and show credentials dialog
        onOpenChange(false);
        setCreatedCredentials(credentials);
        setShowCredentials(true);

        // Reset form
        setFormData({ name: "", email: "", password: "", phone: "", specialty: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Staff" : "Add Staff"}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" autoComplete="off" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="off" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input id="password" type="password" autoComplete="off" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                  <Button type="button" variant="outline" size="icon" title="Generate random password" onClick={() => setFormData({ ...formData, password: generatePassword() })}>
                    <RefreshCwIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" autoComplete="off" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty (optional)</Label>
            <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value ?? "" })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select specialty">
                  {selectedSpecialty?.label || "Select specialty"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SPECIALTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save" : "Add Staff")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <CredentialsDisplayDialog
      open={showCredentials}
      onOpenChange={setShowCredentials}
      credentials={createdCredentials}
    />
    </>
  );
}
