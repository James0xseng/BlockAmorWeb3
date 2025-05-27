
"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { vulnerabilityScan, VulnerabilityScanOutput, VulnerabilityScanInput } from "@/ai/flows/vulnerability-scan";
import { Loader2, SearchCode, CheckCircle, AlertCircle, Info, ShieldAlert, ListChecks, Wrench, Gauge, Gem } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ScannerPage() {
  const [contractCode, setContractCode] = useState("");
  const [scanResult, setScanResult] = useState<VulnerabilityScanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [userTier, setUserTier] = useState<VulnerabilityScanInput['userTier']>('free');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contractCode.trim()) {
      setError("Smart contract code cannot be empty.");
      return;
    }
    setError(null);
    setScanResult(null);

    startTransition(async () => {
      try {
        const result = await vulnerabilityScan({ smartContractCode: contractCode, userTier });
        setScanResult(result);
        toast({
          title: "Scan Complete",
          description: `Vulnerability scan finished successfully (Tier: ${result.tierApplied || userTier}).`,
          variant: "default",
        });
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to scan contract: ${errorMessage}`);
        toast({
          title: "Scan Failed",
          description: `An error occurred: ${errorMessage}`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <SearchCode className="mr-3 h-7 w-7 text-primary" />
            Smart Contract Vulnerability Scanner
          </CardTitle>
          <CardDescription>
            Enter your smart contract code (e.g., Solidity) below. Our AI will analyze it for common vulnerabilities and provide suggestions. Higher tiers provide more detailed analysis.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="userTier" className="font-medium">Simulated User Tier</Label>
              <Select value={userTier} onValueChange={(value: VulnerabilityScanInput['userTier']) => setUserTier(value)}>
                <SelectTrigger id="userTier" className="w-full md:w-[240px] mt-1">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Tier (Standard Analysis)</SelectItem>
                  <SelectItem value="pro">Pro Tier (Detailed Analysis)</SelectItem>
                  <SelectItem value="enterprise">Enterprise Tier (In-depth Analysis)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Select a tier to see how the analysis detail changes. This is for demonstration.</p>
            </div>
            <div>
              <Label htmlFor="contractCode" className="text-lg font-medium">Contract Code</Label>
              <Textarea
                id="contractCode"
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="pragma solidity ^0.8.0; ..."
                rows={15}
                className="mt-2 font-mono text-sm border-input focus:ring-primary"
                disabled={isPending}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !contractCode.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <SearchCode className="mr-2 h-5 w-5" />
                  Scan Contract ({userTier ? userTier.charAt(0).toUpperCase() + userTier.slice(1) : 'Free'})
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {scanResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl flex items-center">
                <ShieldAlert className="mr-3 h-7 w-7 text-primary" />
                Scan Results
              </CardTitle>
              {scanResult.tierApplied && (
                <Badge variant={scanResult.tierApplied === 'pro' || scanResult.tierApplied === 'enterprise' ? 'default' : 'secondary'} className="capitalize">
                  {scanResult.tierApplied === 'pro' && <Gem className="mr-1.5 h-3.5 w-3.5" />}
                  {scanResult.tierApplied === 'enterprise' && <Gem className="mr-1.5 h-3.5 w-3.5 text-amber-400" />}
                  {scanResult.tierApplied} Tier Analysis
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center"><Gauge className="mr-2 h-6 w-6 text-muted-foreground" />Security Score</h3>
              <div className="flex items-center gap-4">
                <Progress value={scanResult.securityScore} className="w-full h-4" />
                <span className="text-2xl font-bold text-primary">{scanResult.securityScore}/100</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center"><ListChecks className="mr-2 h-6 w-6 text-muted-foreground" />Vulnerabilities Found ({scanResult.vulnerabilities.length})</h3>
              {scanResult.vulnerabilities.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 pl-4 bg-muted/30 p-4 rounded-md border border-border">
                  {scanResult.vulnerabilities.map((vuln, index) => (
                    <li key={index} className="text-destructive-foreground bg-destructive/10 p-2 rounded-sm border border-destructive/30 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-destructive shrink-0" />
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-700">No Vulnerabilities Found</AlertTitle>
                  <AlertDescription>
                    Our AI scanner did not find any common vulnerabilities in the provided code.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center"><Wrench className="mr-2 h-6 w-6 text-muted-foreground" />Suggested Fixes ({scanResult.suggestedFixes.length})</h3>
              {scanResult.suggestedFixes.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 pl-4 bg-muted/30 p-4 rounded-md border border-border">
                  {scanResult.suggestedFixes.map((fix, index) => (
                    <li key={index} className="bg-accent/10 p-2 rounded-sm border border-accent/30 flex items-start">
                       <Info className="h-5 w-5 mr-2 mt-0.5 text-accent shrink-0" />
                       <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <Alert variant="default" className="bg-blue-50 border-blue-300 text-blue-700">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-700">No Specific Fixes Suggested</AlertTitle>
                  <AlertDescription>
                    As no vulnerabilities were identified, no specific fixes are suggested. Always follow best security practices.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
