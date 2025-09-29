"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const gigReports = [
  {
    gigTitle: "Summer Soda Fest",
    brand: "FizzCo",
    fileName: "FizzCo_Activation_Report_Q3.pdf",
    status: "Pending",
  },
  {
    gigTitle: "Tech Gadget Expo",
    brand: "Innovate Inc.",
    fileName: "Innovate_Event_Feedback.docx",
    status: "Completed",
  },
  {
    gigTitle: "Eco-Friendly Fair",
    brand: "GreenLife",
    fileName: "GreenLife_Post_Event_Survey.pdf",
    status: "Completed",
  },
];

export default function PromoterReportsPage() {
    const { toast } = useToast();

    const handleUploadClick = (fileName: string) => {
        document.getElementById(`upload-input-${fileName}`)?.click();
    };

    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            toast({
                title: "Report Uploaded",
                description: `Your completed report "${event.target.files[0].name}" has been submitted.`,
            });
        }
    }


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Briefs</h2>
        <p className="text-muted-foreground">Download brand reports and upload your completed sheets here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Gigs</CardTitle>
          <CardDescription>Find the required report templates for each of your confirmed gigs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gig / Brand</TableHead>
                <TableHead>Report Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gigReports.map((report) => (
                <TableRow key={report.gigTitle}>
                  <TableCell>
                    <div className="font-medium">{report.gigTitle}</div>
                    <div className="text-sm text-muted-foreground">{report.brand}</div>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {report.fileName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Completed' ? 'default' : 'secondary'} className={report.status === 'Completed' ? 'bg-green-500/20 text-green-700' : ''}>
                        {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleUploadClick(report.fileName)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Completed
                    </Button>
                    <input type="file" id={`upload-input-${report.fileName}`} className="hidden" onChange={onFileSelected}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
