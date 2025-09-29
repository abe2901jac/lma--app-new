"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

type UploadedFile = {
    name: string;
    type: 'Brand Logo' | 'Report Template';
    size: string;
    date: string;
};

const initialFiles = [
    { name: 'Primary_Logo_Dark.png', type: 'Brand Logo' as const, size: '1.2 MB' },
    { name: 'Q3_Activation_Report.pdf', type: 'Report Template' as const, size: '2.5 MB' },
];

export default function BrandAssetsPage() {
    const { toast } = useToast();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    useEffect(() => {
        const processedFiles = initialFiles.map(file => ({
            ...file,
            date: new Date().toLocaleDateString(),
        }));
        setUploadedFiles(processedFiles);
    }, []);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newFile: UploadedFile = {
                name: file.name,
                type: 'Report Template',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                date: new Date().toLocaleDateString(),
            };
            setUploadedFiles(prev => [...prev, newFile]);
            toast({
                title: "File Uploaded",
                description: `${file.name} has been successfully uploaded.`,
            });
        }
    };

    const handleDelete = (fileName: string) => {
        setUploadedFiles(files => files.filter(f => f.name !== fileName));
        toast({
            variant: 'destructive',
            title: "File Deleted",
            description: `${fileName} has been removed.`,
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Brand Assets</h2>
                <p className="text-muted-foreground">Manage your logos, campaign briefs, and report templates.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Asset</CardTitle>
                        <CardDescription>Upload a new report template, brief, or logo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG (MAX. 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Logo</CardTitle>
                        <CardDescription>This logo appears on your campaign materials.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                         <Image 
                            src="https://placehold.co/300x150.png" 
                            alt="Brand Logo" 
                            width={300}
                            height={150}
                            className="rounded-md"
                            data-ai-hint="modern company logo"
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>File Management</CardTitle>
                    <CardDescription>View and manage all your uploaded assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Date Uploaded</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploadedFiles.map((file) => (
                                <TableRow key={file.name}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {file.name}
                                    </TableCell>
                                    <TableCell>{file.type}</TableCell>
                                    <TableCell>{file.size}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(file.name)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                         <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download</span>
                                        </Button>
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
