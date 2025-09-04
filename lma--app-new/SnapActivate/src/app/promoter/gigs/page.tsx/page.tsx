"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCampaigns } from '@/services/campaignService';

export default function AvailableGigsPage() {
  const { toast } = useToast();
  const [gigs, setGigs] = useState<any[]>([]);

  const fetchGigs = useCallback(async () => {
    const availableGigs = await getCampaigns(['Active', 'Pending Review']);
    setGigs(availableGigs || []);
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
        <h2 className="text-3xl font-bold tracking-tight">Available Gigs</h2>
        <p className="text-muted-foreground">Browse and apply for new opportunities.</p>
      </div>

       <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input placeholder="Filter by keyword..." className="flex-grow" />
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downtown-plaza">Downtown Plaza</SelectItem>
              <SelectItem value="city-tech-park">City Tech Park</SelectItem>
              <SelectItem value="central-park">Central Park</SelectItem>
              <SelectItem value="university-campus">University Campus</SelectItem>
              <SelectItem value="uptown-mall">Uptown Mall</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
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
  )
}
