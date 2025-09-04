"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Upload, FileDown, RadioTower, CalendarClock, UserCheck, Download, Users2, PackageSearch, UserPlus, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateCampaignReport, CampaignReportOutput } from "@/ai/flows/generate-report-flow";
import { getCampaigns, getPackages, createPackage, updatePackage, deletePackage } from "@/services/campaignService";
import { getUsersByRole, approvePromoter, rejectPromoter } from "@/services/userService";
import { ReportDialog } from "@/components/report-dialog";
import { PackageDialog } from "@/components/package-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Package = {
  id: string;
  name: string;
  price: string;
  promoters: number;
  locations: number;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pendingPromoters, setPendingPromoters] = useState<any[]>([]);
  const [totalPromoters, setTotalPromoters] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageMap, setPackageMap] = useState<Map<string, Package>>(new Map());
  const [report, setReport] = useState<CampaignReportOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isPackageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    const campaignsData = await getCampaigns();
    setCampaigns(campaignsData || []);
  }, []);

  const fetchPendingPromoters = useCallback(async () => {
    const promotersData = await getUsersByRole('promoter', 'pending');
    setPendingPromoters(promotersData || []);
  }, []);

  const fetchTotalPromoters = useCallback(async () => {
    const allPromoters = await getUsersByRole('promoter');
    setTotalPromoters(allPromoters?.length || 0);
  }, []);

  const fetchPackages = useCallback(async () => {
    const packageData = await getPackages();
    setPackages(packageData);
    setPackageMap(new Map(packageData.map(p => [p.name.toLowerCase(), p])));
  }, []);

  useEffect(() => {
    fetchCampaigns();
    fetchPendingPromoters();
    fetchTotalPromoters();
    fetchPackages();
  }, [fetchCampaigns, fetchPendingPromoters, fetchTotalPromoters, fetchPackages]);

  const handleApprove = async (promoterId: string) => {
    const success = await approvePromoter(promoterId);
    if (success) {
        toast({ title: "Promoter Approved", description: "The promoter can now access the platform." });
        fetchPendingPromoters();
        fetchTotalPromoters();
    } else {
        toast({ variant: "destructive", title: "Approval Failed", description: "Could not approve the promoter." });
    }
  }

  const handleReject = async (promoterId: string) => {
    const success = await rejectPromoter(promoterId);
    if (success) {
        toast({ title: "Promoter Rejected", description: "The promoter has been rejected." });
        fetchPendingPromoters();
        fetchTotalPromoters();
    } else {
        toast({ variant: "destructive", title: "Rejection Failed", description: "Could not reject the promoter." });
    }
  }

  const handleGenerateReport = async (campaignName: string) => {
    setIsGenerating(true);
    setSelectedCampaign(campaignName);
    toast({
        title: "Generating AI Report...",
        description: `A comprehensive report for "${campaignName}" is being generated. This may take a moment.`,
    });

    try {
        const generatedReport = await generateCampaignReport({ campaignName });
        setReport(generatedReport);
    } catch(error: any) {
        console.error("Failed to generate report:", error);
        toast({
            variant: "destructive",
            title: "Report Generation Failed",
            description: error?.message || "There was an error generating the AI report. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const closeReportDialog = () => {
    setReport(null);
    setSelectedCampaign(null);
  }
  
  const handleExportCSV = () => {
    if (campaigns.length === 0) {
      toast({ variant: "destructive", title: "No Data", description: "There is no campaign data to export." });
      return;
    }

    const headers = ["Campaign", "Brand", "Tier", "Status", "Revenue"];
    const csvRows = [headers.join(",")];

    campaigns.forEach(campaign => {
      const pkg = packageMap.get(campaign.packageTier?.toLowerCase());
      const revenue = pkg ? parseFloat(pkg.price).toFixed(2) : "0.00";
      const row = [
        `"${campaign.title?.replace(/"/g, '""') || ''}"`,
        `"${campaign.brandName?.replace(/"/g, '""') || ''}"`,
        `"${campaign.packageTier?.replace(/"/g, '""') || ''}"`,
        `"${campaign.status?.replace(/"/g, '""') || ''}"`,
        `"${revenue}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "campaigns.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Export Successful", description: "Campaign data has been downloaded as campaigns.csv." });
  };
  
  const handleCreatePackage = () => {
    setEditingPackage(null);
    setPackageDialogOpen(true);
  }
  
  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageDialogOpen(true);
  }

  const handleDeletePackage = (pkgId: string) => {
    setDeletingPackageId(pkgId);
    setDeleteDialogOpen(true);
  }

  const confirmDeletePackage = async () => {
    if (!deletingPackageId) return;
    const success = await deletePackage(deletingPackageId);
    if(success) {
      toast({ title: "Package Deleted", description: "The package has been removed." });
      fetchPackages();
    } else {
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the package." });
    }
    setDeleteDialogOpen(false);
    setDeletingPackageId(null);
  }

  const handleSavePackage = async (pkgData: Omit<Package, 'id'>) => {
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, pkgData);
        toast({ title: "Package Updated", description: "The package details have been saved." });
      } else {
        await createPackage(pkgData);
        toast({ title: "Package Created", description: "The new package has been added." });
      }
      fetchPackages();
      setPackageDialogOpen(false);
      setEditingPackage(null);
    } catch(error) {
       toast({ variant: "destructive", title: "Save Failed", description: "Could not save the package." });
    }
  }

  const stats = [
    { title: "Active Campaigns Today", value: "12", icon: RadioTower },
    { title: "Promoters Checked-In", value: "48", icon: UserCheck },
    { title: "Total Promoters", value: totalPromoters, icon: Users2 },
    { title: "Pending/Upcoming Campaigns", value: "23", icon: CalendarClock },
  ];
    
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="promoters">Promoters</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Campaign Management</CardTitle>
                        <CardDescription>Oversee all active, pending, and completed campaigns.</CardDescription>
                    </div>
                    <Button onClick={handleExportCSV} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                              <Info className="h-8 w-8 text-muted-foreground" />
                              <span className="text-muted-foreground">No active campaigns found.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign) => {
                        const pkg = packageMap.get(campaign.packageTier?.toLowerCase());
                        const revenue = pkg ? `R${parseFloat(pkg.price).toFixed(2)}` : "N/A";
                        return (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.brandName}</TableCell>
                            <TableCell>{campaign.packageTier}</TableCell>
                            <TableCell>
                                <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                  {campaign.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{revenue}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isGenerating && selectedCampaign === campaign.title}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        onClick={() => handleGenerateReport(campaign.title)}
                                        disabled={isGenerating}
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        {isGenerating && selectedCampaign === campaign.title ? 'Generating...' : 'Generate AI Report'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="packages">
            <Card>
                <CardHeader>
                    <CardTitle>Campaign Packages</CardTitle>
                    <CardDescription>Manage pricing tiers, categories, and location zones.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Package Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Promoters</TableHead>
                            <TableHead>Locations</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                               <div className="flex flex-col items-center gap-2">
                                  <PackageSearch className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-muted-foreground">No campaign packages have been created yet.</span>
                                  <Button size="sm" className="mt-2" onClick={handleCreatePackage}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create First Package
                                  </Button>
                               </div>
                            </TableCell>
                        </TableRow>
                      ) : (
                        packages.map((pkg) => (
                             <TableRow key={pkg.id}>
                                <TableCell className="font-medium">{pkg.name}</TableCell>
                                <TableCell>R{parseFloat(pkg.price).toFixed(2)}</TableCell>
                                <TableCell>{pkg.promoters}</TableCell>
                                <TableCell>{pkg.locations}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeletePackage(pkg.id)} className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                      )}
                    </TableBody>
                </Table>
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleCreatePackage}>Create Package</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="promoters">
             <Card>
                <CardHeader>
                    <CardTitle>Promoter Approvals</CardTitle>
                    <CardDescription>Review and approve or reject new promoter signups.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Sign-up Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {pendingPromoters.length === 0 ? (
                       <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <UserCheck className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-muted-foreground">No pending promoters to review.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                      pendingPromoters.map((promoter) => (
                          <TableRow key={promoter.id}>
                          <TableCell className="font-medium">{promoter.name}</TableCell>
                          <TableCell>{promoter.email}</TableCell>
                          <TableCell>{promoter.createdAt?.seconds ? new Date(promoter.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleApprove(promoter.id)}>
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleReject(promoter.id)}>
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </TableCell>
                          </TableRow>
                      ))
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="assets">
            <Card>
                <CardHeader>
                    <CardTitle>Pop-up Kit Designs</CardTitle>
                    <CardDescription>Upload and manage brand assets and kit designs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
       <ReportDialog 
        report={report} 
        campaignName={selectedCampaign}
        open={!!report} 
        onOpenChange={(isOpen) => { if (!isOpen) closeReportDialog(); }} 
      />
      <PackageDialog
        open={isPackageDialogOpen}
        onOpenChange={setPackageDialogOpen}
        onSave={handleSavePackage}
        packageData={editingPackage}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign package.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePackage}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
