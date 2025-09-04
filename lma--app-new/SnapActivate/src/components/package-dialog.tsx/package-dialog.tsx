"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Package = {
  id: string;
  name: string;
  price: string;
  promoters: number;
  locations: number;
}

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Package, 'id'>) => void;
  packageData: Package | null;
}

export function PackageDialog({ open, onOpenChange, onSave, packageData }: PackageDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [promoters, setPromoters] = useState("");
  const [locations, setLocations] = useState("");

  useEffect(() => {
    if (packageData) {
      setName(packageData.name);
      setPrice(packageData.price.toString());
      setPromoters(packageData.promoters.toString());
      setLocations(packageData.locations.toString());
    } else {
      setName("");
      setPrice("");
      setPromoters("");
      setLocations("");
    }
  }, [packageData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price: price,
      promoters: parseInt(promoters, 10),
      locations: parseInt(locations, 10),
    });
  };

  const dialogTitle = packageData ? "Edit Campaign Package" : "Create New Campaign Package";
  const dialogDescription = packageData ? "Update the details for this package." : "Fill in the details for the new package.";
  const buttonText = packageData ? "Save Changes" : "Create Package";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (R)
              </Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="promoters" className="text-right">
                Promoters
              </Label>
              <Input id="promoters" type="number" value={promoters} onChange={(e) => setPromoters(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locations" className="text-right">
                Locations
              </Label>
              <Input id="locations" type="number" value={locations} onChange={(e) => setLocations(e.target.value)} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{buttonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}