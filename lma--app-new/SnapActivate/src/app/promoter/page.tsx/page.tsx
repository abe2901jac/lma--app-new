"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { getCampaigns } from '@/services/campaignService';
import { useAuth } from '@/contexts/auth-context';

export default function PromoterDashboardPage() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [gigs, setGigs] = useState<any[]>([]);

  const fetchGigs = useCallback(async () => {
    const availableGigs = await getCampaigns(['Active', 'Pending Review']);
    setGigs(availableGigs ? availableGigs.slice(0, 3) : []);
  }, []);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleApply = (title: string) => {
    toast({
      title: "Application Sent!",
      description: `You have successfully applied for ${title}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {userData?.name || "Promoter"}!</h2>
        <p className="text-muted-foreground">Ready for your next gig? Find opportunities below.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Next Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Summer Soda Fest</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> July 15, 2024</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/> Downtown Plaza</p>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link href="/promoter/live">View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Available Gigs</h3>
            <Button variant="link" asChild><Link href="/promoter/gigs">View All</Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <Card key={gig.id}>
              <CardHeader>
                <CardTitle>{gig.title}</CardTitle>
                <CardDescription>{gig.brandName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> {gig.locationZone}</p>
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/> {gig.date ? new Date(gig.date).toLocaleDateString() : 'TBD'}</p>
                <Badge variant="outline">{gig.packageTier}</Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleApply(gig.title)}>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
