"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Fuel, Gauge, Zap } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GasEstimatorPage() {
  const [gasEstimate, setGasEstimate] = useState<{ limit: string; costEth: string; costUsd: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEstimate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setGasEstimate(null);
    // Mock estimation
    await new Promise(resolve => setTimeout(resolve, 1200));
    setGasEstimate({
      limit: "25,430 units",
      costEth: "~0.0005 ETH",
      costUsd: "~$1.50 (at $3000/ETH)",
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Fuel className="mr-3 h-7 w-7 text-primary" />
            Gas Limit Estimator
          </CardTitle>
          <CardDescription>
            Estimate gas costs for your transactions to prevent out-of-gas errors and optimize fees.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEstimate}>
          <CardContent className="space-y-4">
             <div>
              <Label htmlFor="toAddress">To Address (Contract or EOA)</Label>
              <Input id="toAddress" placeholder="0x..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="value">Value (ETH)</Label>
              <Input id="value" type="number" step="any" placeholder="0.0" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="data">Transaction Data (Hex, Optional)</Label>
              <Textarea id="data" placeholder="0x..." rows={3} className="mt-1 font-mono" />
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <><Gauge className="mr-2 h-4 w-4 animate-spin" /> Estimating...</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" /> Estimate Gas</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {gasEstimate && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Fuel className="mr-2 h-6 w-6 text-primary" />Estimated Gas Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-accent/10 border-accent/30">
              <AlertTitle className="text-accent-foreground">Estimation Complete</AlertTitle>
              <AlertDescription className="space-y-1">
                <p><strong>Estimated Gas Limit:</strong> {gasEstimate.limit}</p>
                <p><strong>Estimated Cost (ETH):</strong> {gasEstimate.costEth}</p>
                <p><strong>Estimated Cost (USD):</strong> {gasEstimate.costUsd}</p>
                <p className="text-xs text-muted-foreground mt-2">Note: This is an estimate. Actual gas costs may vary based on network conditions.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
