"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Upload, DollarSign } from "lucide-react";
import { useState } from "react";

export default function SubmitFeedbackPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [competitorActivity, setCompetitorActivity] = useState("no");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Submit Feedback</h2>
        <p className="text-muted-foreground">Share your experience from a completed gig.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Gig Feedback Form</CardTitle>
          <CardDescription>Your insights are valuable to the brand and to us.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <Label htmlFor="gig-select" className="font-semibold text-base">Campaign Details</Label>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gig-select">Select a Completed Gig</Label>
                        <Select>
                            <SelectTrigger id="gig-select">
                                <SelectValue placeholder="Choose a gig..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tech-expo">Tech Gadget Expo</SelectItem>
                                <SelectItem value="eco-fair">Eco-Friendly Fair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="font-semibold text-base">Customer Interaction</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Overall Rating of Gig</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Customer Sentiment Towards Brand</Label>
                        <RadioGroup defaultValue="neutral" className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="positive" id="positive" />
                                <Label htmlFor="positive">Positive</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="neutral" id="neutral" />
                                <Label htmlFor="neutral">Neutral</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="negative" id="negative" />
                                <Label htmlFor="negative">Negative</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="engaged-customers">How many customers did you engage with?</Label>
                        <Input id="engaged-customers" type="number" placeholder="e.g., 50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="potential-customers">How many potential customers (interested but did not buy)?</Label>
                        <Input id="potential-customers" type="number" placeholder="e.g., 15" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                 <Label className="font-semibold text-base">Customer Demographics</Label>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="male-customers">How many customers were male?</Label>
                        <Input id="male-customers" type="number" placeholder="e.g., 20" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="female-customers">How many customers were female?</Label>
                        <Input id="female-customers" type="number" placeholder="e.g., 30" />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="age-group">Primary age group interacted with?</Label>
                        <Select>
                            <SelectTrigger id="age-group">
                                <SelectValue placeholder="Select age group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="under-18">Under 18</SelectItem>
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25-34">25-34</SelectItem>
                                <SelectItem value="35-44">35-44</SelectItem>
                                <SelectItem value="45-54">45-54</SelectItem>
                                <SelectItem value="55+">55+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
            </div>

            <div className="space-y-4">
                <Label className="font-semibold text-base">Sales & Competitor Information</Label>
                <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="units-sold">How many units sold during your shift? (List all variants and shelf price)</Label>
                        <Textarea id="units-sold" placeholder="e.g.,&#10;- Red Soda: 10 units @ R25.00&#10;- Blue Soda: 5 units @ R25.00" rows={4}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Was there any competitor activity?</Label>
                        <RadioGroup value={competitorActivity} onValueChange={setCompetitorActivity} className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {competitorActivity === 'yes' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/50">
                            <div className="space-y-2">
                                <Label htmlFor="competitor-price">Price of competitor product?</Label>
                                 <div className="relative">
                                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">R</span>
                                    <Input id="competitor-price" type="number" placeholder="e.g., 30.00" className="pl-8"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="competitor-photo">Upload picture of competitor activity</Label>
                                <label htmlFor="competitor-photo-input" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                    </div>
                                    <input id="competitor-photo-input" type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="feedback-comments">Additional Comments</Label>
                <Textarea id="feedback-comments" placeholder="How was the event? Any other suggestions for the brand?" rows={5}/>
            </div>

            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
