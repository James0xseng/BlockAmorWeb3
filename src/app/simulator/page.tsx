"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IterationCcw, PlayCircle, BarChartHorizontal } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SimulatorPage() {
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSimulationResult(null);
    // Mock simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSimulationResult("Transaction simulated successfully. Outcome: Gas used: 21000, No reverts. Ether balance changed by -0.1 ETH.");
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PlayCircle className="mr-3 h-7 w-7 text-primary" />
            Transaction Simulator
          </CardTitle>
          <CardDescription>
            Simulate transactions to identify potential risks and outcomes before execution on the mainnet.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSimulate}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromAddress">From Address</Label>
              <Input id="fromAddress" placeholder="0x..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="toAddress">To Address (Contract or EOA)</Label>
              <Input id="toAddress" placeholder="0x..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="value">Value (ETH)</Label>
              <Input id="value" type="number" step="any" placeholder="0.1" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="data">Transaction Data (Hex)</Label>
              <Textarea id="data" placeholder="0x..." rows={3} className="mt-1 font-mono" />
            </div>
             <div>
              <Label htmlFor="gasLimit">Gas Limit (Optional)</Label>
              <Input id="gasLimit" type="number" placeholder="21000" className="mt-1" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <><IterationCcw className="mr-2 h-4 w-4 animate-spin" /> Simulating...</>
              ) : (
                <><PlayCircle className="mr-2 h-4 w-4" /> Simulate Transaction</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {simulationResult && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><BarChartHorizontal className="mr-2 h-6 w-6 text-primary"/>Simulation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Simulation Complete</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{simulationResult}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
