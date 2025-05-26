"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Network, Share2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"

const barChartData = [
  { type: "Reentrancy", count: 12, fill: "var(--color-reentrancy)" },
  { type: "Overflow", count: 8, fill: "var(--color-overflow)" },
  { type: "Gas Issues", count: 5, fill: "var(--color-gas)" },
  { type: "Access Control", count: 15, fill: "var(--color-access)" },
  { type: "Timestamp Dep.", count: 3, fill: "var(--color-timestamp)" },
];

const barChartConfig = {
  count: {
    label: "Count",
  },
  reentrancy: { label: "Reentrancy", color: "hsl(var(--chart-1))" },
  overflow: { label: "Integer Overflow", color: "hsl(var(--chart-2))" },
  gas: { label: "Gas Issues", color: "hsl(var(--chart-3))" },
  access: { label: "Access Control", color: "hsl(var(--chart-4))" },
  timestamp: { label: "Timestamp Dep.", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const pieChartData = [
  { name: 'Safe Transactions', value: 400, fill: 'hsl(var(--chart-2))' },
  { name: 'Risky Transactions', value: 75, fill: 'hsl(var(--chart-1))' },
  { name: 'Failed Transactions', value: 25, fill: 'hsl(var(--chart-5))' },
];

const pieChartConfig = {
  transactions: {
    label: "Transactions",
  },
} satisfies ChartConfig


export default function VisualizationsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-primary" />
            Security Visualization Tools
          </CardTitle>
          <CardDescription>
            Visual representations of transaction flows, security risks, and vulnerability distributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Share2 className="mr-2 h-5 w-5 text-primary"/>Vulnerability Distribution</CardTitle>
              <CardDescription>Distribution of detected vulnerability types.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" accessibilityLayer>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" dataKey="count" />
                    <YAxis 
                      dataKey="type" 
                      type="category" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={5}
                      width={120}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="count" radius={5}>
                       {barChartData.map((entry) => (
                        <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Network className="mr-2 h-5 w-5 text-primary"/>Transaction Risk Overview</CardTitle>
              <CardDescription>Breakdown of simulated transaction risk levels.</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart accessibilityLayer>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                       {pieChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                    </Pie>
                     <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-full shadow-md">
            <CardHeader>
              <CardTitle>Placeholder: Transaction Flow Graph</CardTitle>
              <CardDescription>A visual representation of transaction interactions (e.g., contract calls).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md border border-dashed">
                <p className="text-muted-foreground">Transaction flow graph will be displayed here.</p>
                <img src="https://placehold.co/600x300.png" alt="Placeholder transaction flow" data-ai-hint="network graph" className="object-cover opacity-20 absolute inset-0 w-full h-full"/>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
