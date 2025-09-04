"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, avoiding hydration mismatches.
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Last updated: {date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground pt-2">1. Terms</h3>
            <p>
                By accessing the application at [Your App URL], you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this application are protected by applicable copyright and trademark law.
            </p>

            <h3 className="font-semibold text-foreground pt-2">2. Use License</h3>
            <ol type="a" className="list-[lower-alpha] pl-5 space-y-2">
                <li>
                    Permission is granted to temporarily download one copy of the materials (information or software) on SnapActivate's application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    <ul className="list-disc pl-5 mt-2">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on SnapActivate's application;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
                    </ul>
                </li>
                <li>
                    This license shall automatically terminate if you violate any of these restrictions and may be terminated by SnapActivate at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </li>
            </ol>

            <h3 className="font-semibold text-foreground pt-2">3. Disclaimer</h3>
            <p>
                The materials on SnapActivate's application are provided on an 'as is' basis. SnapActivate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h3 className="font-semibold text-foreground pt-2">4. Limitations</h3>
            <p>
                In no event shall SnapActivate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SnapActivate's application, even if SnapActivate or a SnapActivate authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h3 className="font-semibold text-foreground pt-2">5. Governing Law</h3>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
        </CardContent>
    </Card>
  );
}
