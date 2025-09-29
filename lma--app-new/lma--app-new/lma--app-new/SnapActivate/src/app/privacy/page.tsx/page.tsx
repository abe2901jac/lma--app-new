"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, avoiding hydration mismatches.
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Last updated: {date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
                SnapActivate ("us", "we", or "our") operates the SnapActivate application (the "Service").
            </p>
            <p>
                This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
            <h3 className="font-semibold text-foreground pt-2">Information Collection and Use</h3>
            <p>
                We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your email address, name, and usage data.
            </p>

            <h3 className="font-semibold text-foreground pt-2">Use of Data</h3>
            <p>
                SnapActivate uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide customer care and support</li>
                <li>To provide analysis or valuable information so that we can improve the Service</li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
            </ul>

            <h3 className="font-semibold text-foreground pt-2">Contact Us</h3>
            <p>
                If you have any questions about this Privacy Policy, please contact us: [Your Contact Information].
            </p>
        </CardContent>
    </Card>
  );
}
