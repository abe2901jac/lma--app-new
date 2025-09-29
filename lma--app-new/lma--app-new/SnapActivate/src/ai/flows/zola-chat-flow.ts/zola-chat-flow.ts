'use server';
/**
 * @fileOverview A conversational AI agent (Zola) for assisting brand managers.
 *
 * - zolaChat - The main function that handles the conversational chat logic.
 * - ZolaChatInput - The input type for the zolaChat function.
 * - ZolaChatOutput - The return type for the zolaChat function.
 */

import { ai } from '@/ai/genkit';
import { bookCampaign, getCampaigns } from '@/services/campaignService';
import { createSupportTicket } from '@/services/supportService';
import { z } from 'zod';

const PromoterStatusSchema = z.object({
  name: z.string().describe("The promoter's full name."),
  status: z.enum(["Checked-In", "Awaiting Check-In", "Delayed"]).describe("The promoter's current check-in status."),
  location: z.string().describe("The location where the promoter is checked in."),
  checkedInTime: z.string().describe("The time the promoter checked in, or 'N/A'.").optional(),
});

const CampaignLiveStatusSchema = z.object({
  campaignTitle: z.string().describe("The title of the campaign."),
  promoters: z.array(PromoterStatusSchema).describe("A list of promoters for this campaign and their status."),
  suggestedActions: z.array(z.string()).describe("A list of suggested action buttons for the user, like 'View Full Report' or 'Chat with Promoter'.")
});

const LiveStatusResponseSchema = z.object({
  campaigns: z.array(CampaignLiveStatusSchema).describe("An array of active campaigns with their live status."),
});

const CampaignSetupInputSchema = z.object({
  title: z.string().describe("The title of the new campaign."),
  locationZone: z.string().describe("The general location zone for the campaign (e.g., Downtown, Suburbs)."),
  date: z.string().describe("The start date for the campaign in YYYY-MM-DD format."),
  packageTier: z.string().describe("The package tier for the campaign (e.g., Bronze, Silver, Gold)."),
  promoters: z.number().describe("The number of promoters required."),
  description: z.string().optional().describe("A brief description of the campaign."),
});

const PerformanceSummarySchema = z.object({
  campaignName: z.string().describe("The name of the campaign being summarized."),
  summary: z.object({
    attendanceRate: z.string().describe("The overall promoter attendance rate as a percentage."),
    totalSales: z.string().describe("The total sales figures reported."),
    customerEngagements: z.string().describe("The total number of customer engagements."),
    feedbackHighlights: z.string().describe("A brief summary of key feedback received from promoters."),
  }),
  actionButtons: z.array(z.string()).describe("A list of suggested action buttons for the user, like 'Download Report' or 'Rate Promoter'.")
});

const ReportIssueInputSchema = z.object({
  campaignName: z.string().describe("The name of the campaign the issue relates to."),
  issueDescription: z.string().describe("A clear and concise description of the issue being reported."),
  priority: z.enum(['Urgent', 'High', 'General Query']).describe("The priority level of the issue. Default to 'General Query' if unsure.")
});

// Define tools that Zola can use
const getLiveCampaigns = ai.defineTool(
  {
    name: 'getLiveCampaigns',
    description: 'Returns a list of all campaigns that are currently active, including promoter check-in details. Use this to give the user a live dashboard view.',
    inputSchema: z.object({}),
    outputSchema: LiveStatusResponseSchema,
  },
  async () => {
    const campaigns = await getCampaigns('Active');
    
    // Mock promoter data for demonstration
    const mockPromoters = [
        { name: 'Alice Johnson', status: 'Checked-In', location: 'Downtown Plaza', checkedInTime: '09:02 AM' },
        { name: 'Bob Williams', status: 'Checked-In', location: 'Downtown Plaza', checkedInTime: '08:55 AM' },
        { name: 'Charlie Brown', status: 'Awaiting Check-In', location: 'Downtown Plaza', checkedInTime: 'N/A' },
    ];
    
    const liveCampaigns = (campaigns || []).map(campaign => ({
      campaignTitle: campaign.title,
      promoters: mockPromoters, 
      suggestedActions: ['View Report', 'Promoter Chat', 'Campaign Status'],
    }));

    return { campaigns: liveCampaigns };
  }
);

const setupCampaign = ai.defineTool(
    {
        name: 'setupCampaign',
        description: 'Used to create or set up a new campaign. Collects all necessary details from the user before calling.',
        inputSchema: CampaignSetupInputSchema,
        outputSchema: z.object({
            id: z.string(),
            status: z.string(),
            title: z.string(),
        }),
    },
    async (input, context) => {
        const brandId = context?.auth?.uid;
        if (!brandId) {
            throw new Error("User is not authenticated. Cannot create a campaign.");
        }
        
        const result = await bookCampaign(input, brandId);
        if (!result) {
            throw new Error("Failed to book the campaign in the system.");
        }
        return result;
    }
);

const getPerformanceSummary = ai.defineTool(
    {
        name: 'getPerformanceSummary',
        description: 'Generates a performance summary report for a specific campaign. Use this when the user asks for a summary, report, or performance details.',
        inputSchema: z.object({
            campaignName: z.string().describe("The name of the campaign to summarize."),
        }),
        outputSchema: PerformanceSummarySchema,
    },
    async ({ campaignName }) => {
        // In a real application, this would query and aggregate data from Firestore.
        // For now, we mock the data to build the feature.
        return {
            campaignName: campaignName,
            summary: {
                attendanceRate: "98%",
                totalSales: "R4,850.00",
                customerEngagements: "142",
                feedbackHighlights: "Customers loved the new flavor but asked for a sugar-free option. Event was very busy on Saturday.",
            },
            actionButtons: ['Download Report', 'Flag Issue', 'Rate Promoter'],
        };
    }
);

const reportIssue = ai.defineTool(
  {
      name: 'reportIssue',
      description: 'Use this tool when the user wants to report a problem, flag an issue, or needs support. This creates a support ticket in the system.',
      inputSchema: ReportIssueInputSchema,
      outputSchema: z.object({ ticketId: z.string() }),
  },
  async (input, context) => {
      const brandId = context?.auth?.uid;
      if (!brandId) {
          throw new Error("User is not authenticated. Cannot create a support ticket.");
      }
      
      const ticketId = await createSupportTicket(input, brandId);
      if (!ticketId) {
          throw new Error("Failed to create the support ticket in the system.");
      }
      return { ticketId };
  }
);


const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const ZolaChatInputSchema = z.object({
  history: z.array(MessageSchema).describe("The history of the conversation so far."),
  brandId: z.string().describe("The UID of the authenticated brand user."),
});
export type ZolaChatInput = z.infer<typeof ZolaChatInputSchema>;


const ZolaChatOutputSchema = z.object({
  text: z.string().optional().describe("Zola's text response to the user."),
  campaignLiveStatus: LiveStatusResponseSchema.optional().describe("The structured live status of campaigns, if requested."),
  performanceSummary: PerformanceSummarySchema.optional().describe("A structured performance summary for a campaign, if requested."),
  buttons: z.array(z.string()).optional().describe("A list of suggested action buttons for the user to click."),
});
export type ZolaChatOutput = z.infer<typeof ZolaChatOutputSchema>;


export async function zolaChat(input: ZolaChatInput): Promise<ZolaChatOutput> {
  return zolaChatFlow(input);
}

const zolaChatFlow = ai.defineFlow(
  {
    name: 'zolaChatFlow',
    inputSchema: ZolaChatInputSchema,
    outputSchema: ZolaChatOutputSchema,
  },
  async ({ history, brandId }) => {

    const llmResponse = await ai.generate({
      prompt: `You are Zola, a friendly and expert AI assistant for the SnapActivate platform. Your role is to help brand managers streamline their campaign management.

      Your responses should be concise, helpful, and friendly.

      Use the tools provided to answer user questions about their campaigns. 
      - If the user asks for a live dashboard, live status, or what's happening now, use the 'getLiveCampaigns' tool. When you use this tool, your final output should ONLY be the structured 'campaignLiveStatus' object. Do not add any extra conversational text.
      - If the user wants to create, set up, or book a new campaign, use the 'setupCampaign' tool. If you don't have all the required information (title, locationZone, date, packageTier, promoters), ask the user for the missing pieces one by one before calling the tool.
      - If the user asks for a performance summary or report on a campaign, use the 'getPerformanceSummary' tool. Your final output should ONLY be the structured 'performanceSummary' object.
      - If a user wants to report an issue, flag a problem, or needs support, use the 'reportIssue' tool. Ask for the campaign name and a description of the problem. Then, ask the user to choose a priority level from the following options only: 'Urgent', 'High', 'General Query', before calling the tool.
      - After successfully creating a support ticket, your response should be a text confirmation like "Your support ticket #TICKET_ID has been created." and provide these buttons: 'Report Another Issue', 'View Live Campaigns'.
      - After successfully setting up a campaign, confirm it with the user and provide the following buttons for next steps: 'Assign Promoters', 'Upload Brief', 'Set Objectives'.
      - If no live campaigns are found, respond with a simple text message saying so.
      - For all other questions, respond with a conversational text message.

      Here is the conversation history with the user:`,
      history: history.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.content }],
      })),
      tools: [getLiveCampaigns, setupCampaign, getPerformanceSummary, reportIssue],
      model: 'googleai/gemini-2.0-flash', 
      context: {
        auth: { uid: brandId }, 
      },
      output: {
        schema: ZolaChatOutputSchema,
      }
    });

    const output = llmResponse.output();

    if (!output) {
       throw new Error("The AI model failed to return a valid response.");
    }

    return output;
  }
);