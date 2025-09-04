"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { campaign: "Soda Fest '23", roi: 185 },
  { campaign: "Gadget Expo '23", roi: 210 },
  { campaign: "Eco Fair '23", roi: 150 },
  { campaign: "Coffee Tasting '24", roi: 250 },
  { campaign: "Fashion Show '24", roi: 175 },
  { campaign: "VR Experience '24", roi: 280 },
]

const chartConfig = {
  roi: {
    label: "ROI (%)",
    color: "hsl(var(--primary))",
  },
}

export function CampaignRoiChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="campaign"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 15)}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="dot"
            formatter={(value) => `${value}%`} 
          />}
        />
        <Bar dataKey="roi" fill="var(--color-roi)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}