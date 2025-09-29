'use server';
/**
 * @fileOverview An AI flow for generating campaign performance reports.
 *
 * - generateCampaignReport - A function that handles the report generation process.
 * - CampaignReportInput - The input type for the generateCampaignReport function.
 * - CampaignReportOutput - The return type for the generateCampaignReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CampaignReportInputSchema = z.object({
    campaignName: z.string().describe('The name of the campaign to generate a report for.'),
});
export type CampaignReportInput = z.infer<typeof CampaignReportInputSchema>;

const CampaignReportOutputSchema = z.object({
  executiveSummary: z.string().describe("A high-level overview of the campaign's performance, key achievements, and recommendations."),
  salesPerformance: z.object({
    totalRevenue: z.string().describe("Total revenue generated during the campaign."),
    unitsSold: z.string().describe("Total number of units sold."),
    bestSellingVariant: z.string().describe("The top-selling product variant."),
  }),
  customerInsights: z.object({
    sentiment: z.string().describe("Overall customer sentiment (Positive, Neutral, Negative) with a brief explanation."),
    demographics: z.string().describe("A summary of the primary customer demographics (age, gender)."),
  }),
  promoterFeedback: z.string().describe("A summary of qualitative feedback and key observations from promoters."),
  competitorActivity: z.string().describe("A summary of any competitor activity reported during the campaign."),
  recommendations: z.array(z.string()).describe("A list of actionable recommendations for future campaigns.")
});
export type CampaignReportOutput = z.infer<typeof CampaignReportOutputSchema>;

// Mock data that would typically come from a database
const getMockCampaignData = (campaignName: string) => {
    // In a real app, this data would be fetched from a database based on the campaignName
    return {
        totalRevenue: "5000.00",
        unitsSold: 200,
        variantsSold: [
            { name: 'Red Soda', units: 120, price: "25.00" },
            { name: 'Blue Soda', units: 80, price: "25.00" }
        ],
        promoterFeedback: [
            { rating: 5, sentiment: 'Positive', engagedCustomers: 80, potentialCustomers: 20, maleCustomers: 30, femaleCustomers: 50, ageGroup: '25-34', comments: "Customers loved the taste! Very busy day." },
            { rating: 4, sentiment: 'Positive', engagedCustomers: 60, potentialCustomers: 15, maleCustomers: 25, femaleCustomers: 35, ageGroup: '18-24', comments: "Great event, lots of interest. Some people asked for a sugar-free option." }
        ],
        competitorActivity: {
            active: true,
            details: "Competitor 'SuperFizz' was also present, selling their product for R30.00. They had a smaller stand but were quite aggressive with their marketing."
        }
    }
}

// Internal schema for the prompt, combining original input with fetched data
const InternalPromptInputSchema = CampaignReportInputSchema.extend({
    totalRevenue: z.string(),
    unitsSold: z.number(),
    variantsSold: z.any(),
    promoterFeedback: z.any(),
    competitorActivity: z.any()
});


export async function generateCampaignReport(input: CampaignReportInput): Promise<CampaignReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignReportPrompt',
  input: { schema: InternalPromptInputSchema }, // Use the extended schema here
  output: { schema: CampaignReportOutputSchema },
  prompt: `You are a Marketing Analyst AI. Your task is to generate a comprehensive post-campaign report based on the data provided. The report should be insightful, clear, and professional.

Campaign Name: {{{campaignName}}}

Analyze the following campaign data:
- Total Revenue: R{{{totalRevenue}}}
- Total Units Sold: {{unitsSold}}
- Sales by Variant: {{#each variantsSold}}{{this.name}}: {{this.units}} units @ R{{this.price}}; {{/each}}
- Promoter Feedback Summary: {{#each promoterFeedback}}Engaged with {{this.engagedCustomers}} customers ({{this.maleCustomers}} male, {{this.femaleCustomers}} female, primarily {{this.ageGroup}}). Sentiment was {{this.sentiment}}. Comments: "{{this.comments}}". {{/each}}
- Competitor Activity: {{#if competitorActivity.active}}{{competitorActivity.details}}{{else}}No significant competitor activity was reported.{{/if}}

Please generate the report structured as a JSON object with the following sections:
- executiveSummary: A high-level overview of the campaign's performance.
- salesPerformance: Detail the total revenue, units sold, and identify the best-selling variant.
- customerInsights: Summarize the customer sentiment and demographic data.
- promoterFeedback: Consolidate the qualitative feedback from promoters.
- competitorActivity: Briefly describe any competitor presence.
- recommendations: Provide a list of actionable recommendations for future campaigns based on all available data (e.g., pricing strategy, product variations, location choice).`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: CampaignReportInputSchema,
    outputSchema: CampaignReportOutputSchema,
  },
  async (input) => {
    // In a real app, you would fetch this data from your database based on the input.campaignName
    const mockData = getMockCampaignData(input.campaignName);

    // Combine original input with fetched data to match the prompt's schema
    const promptInput = {
        ...input,
        ...mockData,
    };

    const { output } = await prompt(promptInput);
    
    if (!output) {
      throw new Error("The AI model failed to return a valid report. This might be due to a content safety issue or an internal error. Please try again or adjust the campaign data.");
    }
    
    return output;
  }
);