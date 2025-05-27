
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ArrowRight, CheckCircle2, SearchCode, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ChartConfig } from "@/components/ui/chart"
import DynamicDashboardChartLoader from "@/components/dashboard/DynamicDashboardChartLoader";


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
  mobile: {
    label: "Medium",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Welcome to BlockArmor</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Your comprehensive suite for Web3 security. Monitor, scan, and protect your smart contracts and transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/scanner">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <SearchCode className="mr-2 h-5 w-5" />
                Scan a Contract
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Overall Security Score</CardDescription>
            <CardTitle className="text-4xl text-primary">88/100</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={88} aria-label="88% security score" className="h-3"/>
          </CardContent>
          <CardContent className="pt-2">
             <p className="text-xs text-muted-foreground">
              Based on recent scans and activity.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Active Alerts</CardDescription>
            <CardTitle className="text-4xl text-destructive">3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              2 High, 1 Medium severity
            </div>
          </CardContent>
           <CardContent className="pt-2">
             <Link href="/alerts">
                <Button variant="outline" size="sm" className="text-xs">View Alerts <ArrowRight className="ml-1 h-3 w-3"/></Button>
             </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 shadow-md">
          <CardHeader>
            <CardTitle>Recent Vulnerability Trends</CardTitle>
            <CardDescription>Vulnerabilities found in the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicDashboardChartLoader data={chartData} config={chartConfig} />
          </CardContent>
        </Card>
        
        <Card className="col-span-full lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>Actions to improve your security posture.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <ShieldCheck className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Enhance account security by enabling 2FA.</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Enable</Button>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <AlertTriangle className="h-6 w-6 text-amber-500 mt-1" />
              <div>
                <h4 className="font-semibold">Review Contract Permissions</h4>
                <p className="text-sm text-muted-foreground">Audit permissions for deployed contracts.</p>
              </div>
               <Button variant="outline" size="sm" className="ml-auto">Review</Button>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Update Dependencies</h4>
                <p className="text-sm text-muted-foreground">Ensure all project dependencies are up to date.</p>
              </div>
               <Button variant="outline" size="sm" className="ml-auto">Check</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
