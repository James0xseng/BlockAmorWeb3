import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BellRing, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Alert = {
  id: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  source: string;
  status: "Active" | "Resolved" | "Ignored";
};

const alertsData: Alert[] = [
  { id: "1", timestamp: "2024-07-28 10:30:00", severity: "Critical", description: "Large withdrawal from high-risk contract 0x123...", source: "Transaction Monitor", status: "Active" },
  { id: "2", timestamp: "2024-07-28 09:15:00", severity: "High", description: "Multiple failed login attempts on admin account.", source: "Access Control", status: "Active" },
  { id: "3", timestamp: "2024-07-27 18:00:00", severity: "Medium", description: "Unusual gas consumption pattern detected for contract 0xabc...", source: "Gas Anomaly Detector", status: "Resolved" },
  { id: "4", timestamp: "2024-07-27 15:20:00", severity: "Low", description: "New contract deployed from untrusted address.", source: "Deployment Monitor", status: "Ignored" },
  { id: "5", timestamp: "2024-07-26 11:05:00", severity: "High", description: "Smart contract reentrancy attempt detected on 0xdef...", source: "Vulnerability Scanner", status: "Active" },
];

const SeverityBadge = ({ severity }: { severity: Alert["severity"] }) => {
  let variant: "destructive" | "secondary" | "default" | "outline" = "default";
  let icon = <Info className="mr-1 h-3 w-3" />;
  if (severity === "Critical") { variant = "destructive"; icon = <AlertTriangle className="mr-1 h-3 w-3" />; }
  else if (severity === "High") { variant = "destructive"; icon = <AlertTriangle className="mr-1 h-3 w-3 opacity-80" />; } // Use secondary if primary is red
  else if (severity === "Medium") { variant = "secondary"; icon = <AlertTriangle className="mr-1 h-3 w-3 text-yellow-600" />; } // Custom color via text
  
  // Shadcn badge does not change text color based on variant for destructive, it uses destructive-foreground
  // For Medium, using secondary which is gray. Can add custom class or use text-yellow-X for specific color.
  
  return <Badge variant={variant} className={cn(
    severity === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200" : "",
    severity === "Low" ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" : ""
  )}>
    {icon}
    {severity}
  </Badge>;
};

import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: Alert["status"] }) => {
  let className = "";
  let icon = null;
  if (status === "Active") { className = "bg-red-100 text-red-700 border-red-300"; icon = <BellRing className="mr-1 h-3 w-3"/>; }
  else if (status === "Resolved") { className = "bg-green-100 text-green-700 border-green-300"; icon = <CheckCircle className="mr-1 h-3 w-3"/>;}
  else if (status === "Ignored") { className = "bg-gray-100 text-gray-700 border-gray-300"; icon = <Info className="mr-1 h-3 w-3"/>;}
  
  return <Badge variant="outline" className={cn("font-normal", className)}>{icon}{status}</Badge>;
};


export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <AlertTriangle className="mr-3 h-7 w-7 text-primary" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              View and manage real-time security alerts for your Web3 assets.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertsData.map((alert) => (
                <TableRow key={alert.id} className={cn(alert.severity === "Critical" || alert.severity === "High" ? "bg-destructive/5 hover:bg-destructive/10" : "")}>
                  <TableCell className="text-xs">{alert.timestamp}</TableCell>
                  <TableCell><SeverityBadge severity={alert.severity} /></TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alert.source}</TableCell>
                  <TableCell><StatusBadge status={alert.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
