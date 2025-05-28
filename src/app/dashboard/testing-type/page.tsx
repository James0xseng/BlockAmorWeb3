
"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { contractTypeTest, type ContractTypeTestOutput } from "@/ai/flows/contract-type-test-flow";
import { Loader2, FlaskConical, CheckCircle, AlertCircle, Info, TestTubeDiagonal, ListTree, FileText, Lightbulb, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const testingPitfalls = [
  {
    attackType: "Test Injection",
    description: "Modify or recompile contract with hidden logic to pass tests.",
  },
  {
    attackType: "Role Misconfiguration",
    description: "Bypass test assumptions by impersonating authorized roles (e.g., via `vm.prank`).",
  },
  {
    attackType: "Hidden State Drift",
    description: "State is manipulated outside the function being tested.",
  },
  {
    attackType: "False Positive Test Logic",
    description: "Unit test always passes due to poor assertion logic.",
  },
  {
    attackType: "Missing Negative Cases",
    description: "No coverage for invalid inputs, allowing security bypass.",
  },
  {
    attackType: "Function Mutation Drift",
    description: "Function signature changes without corresponding test updates.",
  },
  {
    attackType: "Selector Shadowing",
    description: "Reuse of function names with different params to hide behavior.",
  },
  {
    attackType: "Gas-Bomb Passes",
    description: "Malicious logic increases gas usage without causing test failure.",
  },
];

export default function TestingTypePage() {
  const [contractCode, setContractCode] = useState("");
  const [analysisResult, setAnalysisResult] = useState<ContractTypeTestOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contractCode.trim()) {
      setError("Smart contract code cannot be empty.");
      return;
    }
    setError(null);
    setAnalysisResult(null);

    startTransition(async () => {
      try {
        const result = await contractTypeTest({ contractCode });
        setAnalysisResult(result);
        toast({
          title: "Analysis Complete",
          description: "Contract type analysis and testing suggestions generated.",
          variant: "default",
        });
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to analyze contract: ${errorMessage}`);
        toast({
          title: "Analysis Failed",
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
            <FlaskConical className="mr-3 h-7 w-7 text-primary" />
            Smart Contract Testing Analyzer
          </CardTitle>
          <CardDescription>
            Enter any smart contract code. Our AI will attempt to identify its type, provide an overview, and suggest general testing approaches, keeping in mind common testing pitfalls (listed below).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="contractCode" className="text-lg font-medium">Contract Code</Label>
              <Textarea
                id="contractCode"
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="Paste your smart contract code here..."
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
                  Analyzing...
                </>
              ) : (
                <>
                  <TestTubeDiagonal className="mr-2 h-5 w-5" />
                  Analyze Contract
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <ShieldAlert className="mr-3 h-6 w-6 text-muted-foreground" />
            Common Smart Contract Testing Pitfalls
          </CardTitle>
          <CardDescription>
            Be mindful of these common issues when designing and writing your smart contract tests. The AI considers these when generating suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Attack Type / Pitfall</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testingPitfalls.map((pitfall) => (
                <TableRow key={pitfall.attackType}>
                  <TableCell className="font-medium">{pitfall.attackType}</TableCell>
                  <TableCell>{pitfall.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <ListTree className="mr-3 h-7 w-7 text-primary" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysisResult.identifiedLanguage && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                  Identified Language
                </h3>
                <Badge variant="secondary">{analysisResult.identifiedLanguage}</Badge>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center">
                 <Lightbulb className="mr-2 h-5 w-5 text-muted-foreground" />
                Contract Overview
              </h3>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md border border-border">{analysisResult.contractOverview}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FlaskConical className="mr-2 h-5 w-5 text-muted-foreground" />
                Suggested Testing Areas ({analysisResult.suggestedTestingAreas.length})
              </h3>
              {analysisResult.suggestedTestingAreas.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 pl-4">
                  {analysisResult.suggestedTestingAreas.map((area, index) => (
                    <li key={index} className="bg-accent/10 p-2 rounded-sm border border-accent/30 flex items-start">
                       <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-accent shrink-0" />
                       <span>{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert variant="default">
                  <Info className="h-5 w-5" />
                  <AlertTitle>No Specific Testing Areas Suggested</AlertTitle>
                  <AlertDescription>
                    The AI did not provide specific testing areas. Consider general smart contract testing best practices.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {analysisResult.generalNotes && (
               <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                  General Notes
                </h3>
                <p className="text-muted-foreground bg-muted/30 p-3 rounded-md border border-border">{analysisResult.generalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
