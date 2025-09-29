"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, PlusSquare, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { bookCampaign } from "@/services/campaignService"
import { useAuth } from "@/contexts/auth-context"

export function BookCampaignModal() {
  const [date, setDate] = useState<Date>()
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to book a campaign.",
        });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData(event.currentTarget);
    const campaignData = Object.fromEntries(formData.entries());
    if (date) {
        campaignData.date = date.toISOString();
    }
    
    const brandId = user.uid;

    toast({
      title: "Submitting your campaign...",
      description: "Please wait while we process your booking.",
    });

    try {
        const result = await bookCampaign(campaignData, brandId);
        if (result) {
            toast({
                title: "Campaign Booked!",
                description: `Your campaign has been submitted. Status: ${result.status}`,
            });
            setOpen(false);
        } else {
             throw new Error("Campaign booking failed.");
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: error.message || "There was an error submitting your campaign. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusSquare className="mr-2 h-4 w-4" />
          Book Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>Book a New Campaign</DialogTitle>
            <DialogDescription>
              Fill out the details below to launch your next activation.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-title">Campaign Title</Label>
              <Input id="campaign-title" name="title" placeholder="e.g., Summer Soda Fest" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Briefly describe the campaign's objectives." />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Zone</Label>
                  <Select name="locationZone">
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select a zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="uptown">Uptown</SelectItem>
                      <SelectItem value="suburbs">Suburbs</SelectItem>
                      <SelectItem value="campus">University Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Commencement Date</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select name="province">
                        <SelectTrigger id="province">
                        <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gauteng">Gauteng</SelectItem>
                            <SelectItem value="western-cape">Western Cape</SelectItem>
                            <SelectItem value="kzn">KZN</SelectItem>
                            <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                            <SelectItem value="limpopo">Limpopo</SelectItem>
                            <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="north-west">North West</SelectItem>
                            <SelectItem value="free-state">Free State</SelectItem>
                            <SelectItem value="northern-cape">Northern Cape</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store">Store</Label>
                  <Input id="store" name="store" placeholder="e.g., Checkers Hyper" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promoters">Number of Promoters</Label>
                  <Input
                    id="promoters"
                    name="promoters"
                    type="number"
                    defaultValue="5"
                    required
                  />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="package">Package</Label>
                    <Select name="packageTier">
                        <SelectTrigger id="package">
                        <SelectValue placeholder="Select a tier" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea name="requirements" id="requirements" placeholder="List any specific requirements for promoters (e.g., dress code, specific skills)." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="brief-upload">Upload Campaign Brief</Label>
                 <label htmlFor="brief-upload-input" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Click to upload</span> (PDF, DOCX)</p>
                    </div>
                    <input id="brief-upload-input" name="brief" type="file" className="hidden" />
                </label>
            </div>
             <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Info</Label>
                <Textarea id="additional-info" name="additionalInfo" placeholder="Any other details or comments?" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}