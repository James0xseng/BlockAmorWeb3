"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, ShieldCheck, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ReputationData {
  address: string;
  score: number;
  riskLevel: "Low" | "Medium" | "High" | "Unknown";
  firstTransaction: string;
  lastTransaction: string;
  totalTransactions: number;
  knownFlags: string[];
}

export default function AddressReputationPage() {
  const [address, setAddress] = useState("");
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setReputationData(null);

    // Mock reputation check
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Example data
    const scores = [30, 65, 90];
    const randomScore = scores[Math.floor(Math.random() * scores.length)];
    let riskLevel: ReputationData["riskLevel"] = "Low";
    if (randomScore < 50) riskLevel = "High";
    else if (randomScore < 75) riskLevel = "Medium";

    setReputationData({
      address: address,
      score: randomScore,
      riskLevel: riskLevel,
      firstTransaction: "2022-01-15",
      lastTransaction: "2024-07-01",
      totalTransactions: Math.floor(Math.random() * 1000) + 50,
      knownFlags: riskLevel === "High" ? ["Associated with Phishing Attack (XYZ)", "Reported for Suspicious Activity"] : (riskLevel === "Medium" ? ["Interacted with known risky contract"] : []),
    });
    setIsLoading(false);
  };


  const getRiskColor = (riskLevel: ReputationData["riskLevel"]) => {
    if (riskLevel === "Low") return "text-green-500";
    if (riskLevel === "Medium") return "text-yellow-500";
    if (riskLevel === "High") return "text-red-500";
    return "text-gray-500";
  };

   const getRiskIcon = (riskLevel: ReputationData["riskLevel"]) => {
    if (riskLevel === "Low") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (riskLevel === "Medium") return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (riskLevel === "High") return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <ShieldCheck className="h-5 w-5 text-gray-500" />;
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCheck className="mr-3 h-7 w-7 text-primary" />
            Address Reputation Scoring
          </CardTitle>
          <CardDescription>
            Check the reputation score of an Ethereum address based on its transaction history and known security information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Ethereum Address</Label>
              <Input 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..." 
                className="mt-1" 
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Invalid Input</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !address} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <><Search className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
              ) : (
                <><Search className="mr-2 h-4 w-4" /> Check Reputation</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {reputationData && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary"/>Reputation Report for <span className="font-mono text-sm ml-2 truncate">{reputationData.address}</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Reputation Score</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={reputationData.score} className="h-3 flex-1" />
                  <span className={`text-xl font-bold ${getRiskColor(reputationData.riskLevel)}`}>{reputationData.score}/100</span>
                </div>
              </div>
              <div>
                <Label>Risk Level</Label>
                <div className={`flex items-center gap-2 mt-1 text-lg font-semibold ${getRiskColor(reputationData.riskLevel)}`}>
                  {getRiskIcon(reputationData.riskLevel)}
                  {reputationData.riskLevel}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-semibold">First Transaction:</span> {reputationData.firstTransaction}</div>
              <div><span className="font-semibold">Last Transaction:</span> {reputationData.lastTransaction}</div>
              <div><span className="font-semibold">Total Transactions:</span> {reputationData.totalTransactions}</div>
            </div>

            {reputationData.knownFlags.length > 0 && (
              <div>
                <Label className="text-base">Known Flags ({reputationData.knownFlags.length})</Label>
                <ul className="list-disc list-inside space-y-1 mt-2 pl-4 bg-destructive/5 p-3 rounded-md border border-destructive/20">
                  {reputationData.knownFlags.map((flag, index) => (
                    <li key={index} className="text-destructive flex items-start">
                       <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                       <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
             {reputationData.knownFlags.length === 0 && reputationData.riskLevel === "Low" && (
                <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-700">No Negative Flags Found</AlertTitle>
                  <AlertDescription>
                    This address has a good reputation score and no known negative flags.
                  </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
