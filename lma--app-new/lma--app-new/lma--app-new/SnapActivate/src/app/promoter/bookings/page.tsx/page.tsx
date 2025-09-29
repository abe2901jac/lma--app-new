"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialBookings = [
  {
    title: "Summer Soda Fest",
    brand: "FizzCo",
    location: "Downtown Plaza",
    date: "2024-07-15T12:00:00Z",
    status: "Confirmed",
  },
  {
    title: "Tech Gadget Expo",
    brand: "Innovate Inc.",
    location: "City Tech Park",
    date: "2024-06-30T12:00:00Z",
    status: "Completed",
  },
  {
    title: "Eco-Friendly Fair",
    brand: "GreenLife",
    location: "Central Park",
    date: "2024-06-15T12:00:00Z",
    status: "Completed",
  },
];


export default function MyBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    // Process dates on the client to avoid server-client mismatch and prevent hydration errors.
    const processedBookings = initialBookings.map(b => ({
      ...b,
      date: new Date(b.date)
    }));
    setBookings(processedBookings);
  }, []);

  const handleViewDetails = (title: string) => {
    toast({
      title: `Loading Details for ${title}`,
      description: "You would be redirected to the gig details page.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <p className="text-muted-foreground">Manage your confirmed and past gigs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{booking.title}</CardTitle>
              <CardDescription>{booking.brand}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> {booking.location}</p>
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/> {booking.date ? booking.date.toLocaleDateString() : 'N/A'}</p>
              <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                className={booking.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-700' : ''}
              >
                {booking.status === 'Confirmed' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                {booking.status}
              </Badge>
            </CardContent>
            <CardFooter>
                 <Button variant="secondary" className="w-full" onClick={() => handleViewDetails(booking.title)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
