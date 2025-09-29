"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Briefcase, Megaphone } from "lucide-react";

const adminGuide = [
  {
    question: "How do I use the main dashboard?",
    answer: "The main dashboard gives you a real-time overview of all platform activity. You can see stats like active campaigns today, promoters who have checked in, pending campaigns, and more. This is your command center for daily operations."
  },
  {
    question: "How do I manage campaigns?",
    answer: "Navigate to the 'Campaigns' tab. Here you will see a list of all campaigns. You can see their status (e.g., Active, Pending Payment). For any campaign, you can click the three-dots menu to generate a detailed AI-powered performance report or export all campaign data to a CSV file for analysis in Excel or Google Sheets."
  },
  {
    question: "How do I manage pricing packages?",
    answer: "The 'Packages' tab shows the different campaign tiers you offer (Bronze, Silver, Gold, etc.). You can create, edit, and delete campaign packages that brands can choose from."
  },
  {
    question: "How do I approve new promoters?",
    answer: "Go to the 'Promoters' tab. This shows a list of all promoters who have signed up and are awaiting approval. You can review their details and use the checkmark button to approve them or the 'X' button to reject them. Approving a promoter allows them to start applying for gigs."
  }
];

const brandGuide = [
  {
    question: "How do I use my dashboard?",
    answer: "Your dashboard provides a high-level view of your campaign performance. Key metrics like Campaign ROI (Return on Investment), Average Customer Lifetime Value, and Customer Acquisition Cost are displayed prominently. You can also see a live feed of your active and past campaigns."
  },
  {
    question: "How do I use Zola, my AI Assistant?",
    answer: "Zola is your conversational AI assistant, available by clicking the sparkle icon on your dashboard. You can ask Zola to perform key tasks for you. For example: 'Show me my live campaigns' to get a real-time status update. 'Set up a new campaign' to be guided through the booking process. 'How did the Summer Soda Fest perform?' to get a performance summary. 'I need to report an issue' to log a support ticket."
  },
  {
    question: "How do I book a new campaign?",
    answer: "You can click the 'Book Campaign' button on your dashboard to open the booking form, or you can simply ask Zola to help you by typing 'Book a campaign' in the chat."
  },
  {
    question: "What happens after I book a campaign?",
    answer: "The status of your campaign depends on your payment plan. If you are on the Standard plan, the campaign will be 'Pending Payment'. If you are on the Elite plan, it will be 'Pending PO'. Once the necessary steps are completed and approved by an admin, the campaign will become active and available for promoters to apply."
  },
  {
    question: "Where can I find reports for my campaigns?",
    answer: "On your dashboard, each completed campaign card will have a 'View Report' button. You can also ask Zola to generate a performance summary for any campaign by name."
  }
];

const promoterGuide = [
  {
    question: "What is my dashboard for?",
    answer: "Your dashboard is your home base. It shows your very next upcoming booking for quick access and a list of new 'Available Gigs' that you can apply for."
  },
  {
    question: "How do I find and apply for gigs?",
    answer: "Go to the 'Available Gigs' page from the sidebar. You can browse all active campaigns that need promoters. Use the filters to find gigs by location or category. When you find one you like, click 'Apply Now'."
  },
  {
    question: "What is the 'Live Gig' page?",
    answer: "When it's time for a confirmed booking, you'll use the 'Live Gig' page. This is your mission control during the event. You must use it to check in, report your stock levels, log sales, and upload photos of the event in real-time."
  },
  {
    question: "How do I submit feedback after a gig?",
    answer: "After a gig is completed, go to the 'Submit Feedback' page. You'll be asked to fill out a form about your experience, customer interactions, sales you made, and any competitor activity you noticed. This feedback is very important for the brand."
  },
  {
    question: "Where can I see my confirmed gigs?",
    answer: "The 'My Bookings' page lists all your confirmed and past gigs, helping you keep track of your schedule."
  }
];


export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">User Guides</h1>
        <p className="text-muted-foreground">Find answers to common questions for your role.</p>
      </div>
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promoter"><Megaphone className="mr-2 h-4 w-4" />Promoter</TabsTrigger>
          <TabsTrigger value="brand"><Briefcase className="mr-2 h-4 w-4" />Brand/Client</TabsTrigger>
          <TabsTrigger value="admin"><Shield className="mr-2 h-4 w-4" />Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="promoter">
          <Card>
            <CardHeader>
              <CardTitle>Promoter Guide</CardTitle>
              <CardDescription>How to find gigs, manage bookings, and provide feedback.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {promoterGuide.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brand">
           <Card>
            <CardHeader>
              <CardTitle>Brand/Client Guide</CardTitle>
              <CardDescription>How to book campaigns and track their performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {brandGuide.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
           <Card>
            <CardHeader>
              <CardTitle>Admin Guide</CardTitle>
              <CardDescription>How to manage the platform, users, and campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {adminGuide.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
