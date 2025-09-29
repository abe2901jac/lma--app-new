"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { MapPin, CheckCircle, AlertCircle, Camera } from "lucide-react";
import Image from 'next/image';

export default function LiveGigPage() {
    const { toast } = useToast();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [stockLevel, setStockLevel] = useState(80);

    const handleCheckIn = () => {
        setIsCheckedIn(true);
        toast({
            title: "Check-in Successful!",
            description: "Your location has been verified. You are now live.",
        });
    };

    const handleStockReport = (e: React.FormEvent) => {
        e.preventDefault();
        const newStockLevel = parseInt((e.target as HTMLFormElement).stock.value);
        setStockLevel(newStockLevel);
        toast({
            title: "Stock Level Updated",
            description: "The brand and admin have been notified.",
        });
    };

    const handleSaleReport = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Sales Data Submitted",
            description: "Great work! Your sale has been logged.",
        });
        (e.target as HTMLFormElement).reset();
    };
    
    const onPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            toast({
                title: "Photo Uploaded",
                description: "Your photo has been sent to the dashboard.",
            });
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Live Gig: Summer Soda Fest</h2>
                <p className="text-muted-foreground">You are on the ground. Here's your mission control.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-In & Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isCheckedIn ? (
                                <>
                                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Checked-In at Downtown Plaza</span>
                                    </div>
                                    <div className="mt-4 rounded-lg overflow-hidden border">
                                        <Image 
                                            src="https://placehold.co/600x400.png" 
                                            alt="Map placeholder" 
                                            width={600} 
                                            height={400} 
                                            className="w-full"
                                            data-ai-hint="city map"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-start gap-4">
                                     <div className="flex items-center gap-2 text-amber-600 font-semibold">
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Awaiting Check-in...</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        You must check-in to verify your location and start the gig.
                                    </p>
                                    <Button onClick={handleCheckIn}>
                                        <MapPin className="mr-2 h-4 w-4" /> Check-In Now
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <CardTitle>Capture the Moment</CardTitle>
                            <CardDescription>Upload photos of the event in real-time.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-center w-full">
                                <label htmlFor="photo-upload-input" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload photo</span></p>
                                        <p className="text-xs text-muted-foreground">Capture interactions and crowd!</p>
                                    </div>
                                    <input id="photo-upload-input" type="file" className="hidden" accept="image/*" onChange={onPhotoSelected} />
                                </label>
                            </div> 
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Levels</CardTitle>
                            <CardDescription>Report current inventory.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>Current Stock: {stockLevel}%</Label>
                                    <Progress value={stockLevel} className="mt-2" />
                                </div>
                                <form onSubmit={handleStockReport} className="space-y-2">
                                    <Label htmlFor="stock">Update %</Label>
                                    <Input id="stock" type="number" min="0" max="100" defaultValue={stockLevel} />
                                    <Button type="submit" variant="secondary" className="w-full">Report Stock</Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Log a Sale</CardTitle>
                            <CardDescription>Record a new transaction.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaleReport} className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="units">Units Sold</Label>
                                    <Input id="units" type="number" placeholder="e.g., 5" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="revenue">Revenue</Label>
                                    <div className="relative">
                                         <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">R</span>
                                        <Input id="revenue" type="number" placeholder="e.g., 125.00" className="pl-8" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Submit Sale</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
