"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookCampaignModal } from "@/components/book-campaign-modal";
import { DollarSign, Target, BarChart2 } from "lucide-react";
import { CampaignRoiChart } from '@/components/campaign-roi-chart';
import { getCampaignsByBrand } from '@/services/campaignService';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function BrandDashboardPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const { user, userData } = useAuth();
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    if (user?.uid) {
      try {
        const campaignsData = await getCampaignsByBrand(user.uid);
        setCampaigns(campaignsData || []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        toast({
          variant: "destructive",
          title: "Failed to load campaigns",
          description: "There was an issue retrieving your campaign data. Please try again later.",
        });
      }
    }
  }, [user?.uid, toast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => {
          if (campaign.status === 'Active' && (campaign.progress || 0) < 100) {
            return {
              ...campaign,
              reach: (campaign.reach || 0) + Math.floor(Math.random() * 50) + 10,
              engagement: (campaign.engagement || 0) + Math.floor(Math.random() * 5) + 1,
              progress: Math.min((campaign.progress || 0) + 1, 100),
            };
          }
          return campaign;
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {userData?.companyName || userData?.name || "Brand"}!</h2>
          <p className="text-muted-foreground">Here's what's happening with your campaigns.</p>
        </div>
        <BookCampaignModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">185%</div>
                <p className="text-xs text-muted-foreground">+25% from last campaign</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Customer Lifetime Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">R125.50</div>
                <p className="text-xs text-muted-foreground">Based on recent cohorts</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Customer Acquisition Cost</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">R22.75</div>
                <p className="text-xs text-muted-foreground">-10% from last campaign</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Campaign ROI Analysis</CardTitle>
                <CardDescription>Return on investment by campaign.</CardDescription>
            </CardHeader>
            <CardContent>
                <CampaignRoiChart />
            </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
            {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{campaign.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {campaign.status === 'Active' && (
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-muted-foreground">Live</span>
                          </div>
                        )}
                         <Badge variant={campaign.status === 'Active' ? 'default' : 'outline'} className={campaign.status === 'Active' ? 'bg-green-500/20 text-green-700' : ''}>{campaign.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Mock Reach</p>
                        <p className="font-semibold">{(campaign.reach || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mock Engagement</p>
                        <p className="font-semibold">{(campaign.engagement || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Progress</p>
                      <Progress value={campaign.progress || 0} />
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button variant="secondary" size="sm">View Report</Button>
                  </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
