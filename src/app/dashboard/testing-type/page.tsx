
"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { contractTypeTest, type ContractTypeTestOutput } from "@/ai/flows/contract-type-test-flow";
import { Loader2, FlaskConical, CheckCircle, AlertCircle, Info, TestTubeDiagonal, ListTree, FileText, Lightbulb, ShieldAlert, ShieldCheck, Microscope, BookOpen, ClipboardList } from "lucide-react"; // Added ClipboardList
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const testingTypesDetailed = [
  { name: "Unit Testing", purpose: "Test isolated smart contract functions for expected inputs/outputs", labUse: "Validate that attack vectors (e.g. reentrancy) or defenses (e.g. reentrancy guards) behave correctly" },
  { name: "Integration Testing", purpose: "Test interaction between multiple contracts or protocols", labUse: "Simulate attack chains that involve routers, token contracts, or oracles" },
  { name: "Property-Based Testing", purpose: "Fuzz function inputs to explore edge cases", labUse: "Auto-discover Zero-Day vectors or entropy-sensitive drift (e.g., fallback abuse)" },
  { name: "Fuzz Testing", purpose: "Randomized input mutation for entropy drift, selector collision, invalid calls", labUse: "Detect unexpected state changes, access control bypass, gas griefs, etc." },
  { name: "Invariant Testing", purpose: "Assert that certain properties (e.g., total supply, locked funds) always hold", labUse: "Ensure that no exploit can break protocol invariants (e.g., locked funds stay locked)" },
  { name: "Snapshot Testing", purpose: "Record state snapshots and compare post-action diffs", labUse: "Detect tampering or drift in storage across exploit execution" },
  { name: "Regression Testing", purpose: "Catch reintroduced bugs or failed patches", labUse: "Lock in previous fixes for exploits; test old payloads vs. new defenses" },
  { name: "Gas Testing", purpose: "Measure gas costs to detect gas bombs or inefficiencies", labUse: "Flag DoS-style attacks or defense inefficiencies via loop, fallback, or recursion" },
  { name: "Replay Testing", purpose: "Replay real exploit calldata or test vector from chain logs", labUse: "Simulate real-world hacks to ensure defenses now mitigate them" },
  { name: "Access Control Testing", purpose: "Ensure correct role/permission boundaries", labUse: "Prevent elevation attacks, ensure `onlyOwner`, `RBAC`, `BitGuard`, etc., are effective" },
  { name: "Mutation Testing", purpose: "Modify function signatures, storage layout, or selector entropy to test robustness", labUse: "Simulates ABI drift, zombie selector exploits, and storage slot injection vulnerabilities" },
  { name: "Time/Block Testing", purpose: "Manipulate block.timestamp or block.number", labUse: "Useful for attacks relying on timelocks, cooldowns, TWAP/TWAMM drift" },
  { name: "Event-Based Testing", purpose: "Validate event emissions or detect missing logs", labUse: "Ensures traceability; detects event suppression or spoofing attacks" },
  { name: "Fork Testing", purpose: "Fork a real chain state and simulate your exploit", labUse: "Attack contracts as they exist in production (e.g., Curve, Aave) with real balances" },
  { name: "Chain Differential Testing", purpose: "Compare behavior across multiple chains/forks", labUse: "Detect behavior differences due to opcode changes, gas pricing, or storage limits" },
  { name: "Oracle Testing", purpose: "Test how your contracts respond to price or data oracle manipulation", labUse: "Simulate fake prices, stale rounds, or oracle front-runs" },
  { name: "ZK/MetaTx Testing", purpose: "Verify proof-based access, relayer security, and gasless call integrity", labUse: "Ensure signature replay protection, Semaphore access control, ZK-gated execution" },
  { name: "Concurrency / Race Testing", purpose: "Test how the contract behaves with fast sequence/multi-call submissions", labUse: "Detect reentrancy, race conditions, frontruns, and router feedback loops" },
  { name: "Fallback Testing", purpose: "Test undefined selectors, fallback logic, receive() attacks", labUse: "Validate fallback drift abuse, rogue calls, and gas griefs via low-level calls" },
  { name: "Entropy Drift Testing", purpose: "Log and test changes in selector entropy or hash values across versions", labUse: "Detect replayable payloads or identifier collision (e.g. mutated function names)" },
];

const testCategories = [
  { type: "Positive Tests", description: "Ensure functions behave correctly for valid inputs" },
  { type: "Negative Tests", description: "Ensure errors are correctly thrown on invalid inputs" },
  { type: "Boundary/Edge Tests", description: "Test upper/lower bounds (e.g., overflows, limits, time cutoffs)" },
  { type: "Revert Expectation Tests", description: "Confirm function reverts on invalid access or logic violation" },
  { type: "Permission Tests", description: "Validate only authorized roles/users can call a function" },
  { type: "Gas-Use Assertion Tests", description: "Check that gas used remains under a defined limit" },
  { type: "Storage/State Tests", description: "Ensure storage is updated correctly (e.g., after transfers/mints)" },
  { type: "Event Emission Tests", description: "Confirm proper event logs are emitted during actions" },
  { type: "Constructor Tests", description: "Verify initial values after deployment" },
  { type: "Function Selector Tests", description: "Ensure correct dispatching of function selectors" },
];

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

const defenseStrategies = [
  {
    strategy: "Assertion Strengthening",
    description: "Use `assert`, `require`, `expectRevert` with specific errors.",
  },
  {
    strategy: "Role Mocking With Control",
    description: "Carefully simulate roles using `vm.startPrank` with controlled accounts.",
  },
  {
    strategy: "Full Revert Coverage",
    description: "For every `require`, write a test that confirms revert on failure.",
  },
  {
    strategy: "State Validation After Calls",
    description: "Always validate `storage` state changes after actions.",
  },
  {
    strategy: "Event Assertions",
    description: "Validate `emit` logs to ensure code path coverage.",
  },
  {
    strategy: "Fuzz Entry Constraints",
    description: "Use assumptions in fuzz/unit tests to prevent false positives.",
  },
];

const testTypesByFocus = [
  { focus: "Access Bypass", types: "Unit, Access Control, Replay, ZK Testing" },
  { focus: "Gas Bombs", types: "Gas Testing, Fallback, Loop Simulation" },
  { focus: "Race Conditions", types: "Race Testing, Fuzzing, Concurrency" },
  { focus: "Fallback Abuse", types: "Fallback, Entropy Drift, Selector Mutation" },
  { focus: "Zero-Day", types: "Replay, Mutation, Fork Testing, Snapshot" },
  { focus: "Zombie Selectors", types: "Mutation, Drift Replay, Entropy Analysis" },
  { focus: "Timelocks", types: "Block.time tests, Snapshot, Rewind Tests" },
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
            Enter any smart contract code. Our AI will attempt to identify its type, provide an overview, and suggest general testing approaches, keeping in mind common testing pitfalls and defense strategies.
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

      <Accordion type="single" collapsible className="w-full shadow-md rounded-lg border bg-card text-card-foreground">
        <AccordionItem value="detailed-testing-types">
          <AccordionTrigger className="px-6 py-4 text-xl hover:no-underline">
            <div className="flex items-center">
              <BookOpen className="mr-3 h-6 w-6 text-muted-foreground" />
              Smart Contract Testing Methodologies
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardDescription className="mb-4">
              Explore various smart contract testing types, their purposes, and applications in a security lab context.
            </CardDescription>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Testing Type</TableHead>
                    <TableHead className="min-w-[300px]">Purpose / Use Case</TableHead>
                    <TableHead className="min-w-[300px]">How It Works in Your Security Lab</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testingTypesDetailed.map((type) => (
                    <TableRow key={type.name}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.purpose}</TableCell>
                      <TableCell>{type.labUse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full shadow-md rounded-lg border bg-card text-card-foreground">
        <AccordionItem value="test-categories">
          <AccordionTrigger className="px-6 py-4 text-xl hover:no-underline">
            <div className="flex items-center">
              <ClipboardList className="mr-3 h-6 w-6 text-muted-foreground" />
              Key Test Categories & Focus
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardDescription className="mb-4">
              Common categories of tests and what they typically aim to verify.
            </CardDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Test Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCategories.map((category) => (
                  <TableRow key={category.type}>
                    <TableCell className="font-medium">{category.type}</TableCell>
                    <TableCell>{category.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full shadow-md rounded-lg border bg-card text-card-foreground">
        <AccordionItem value="testing-pitfalls">
          <AccordionTrigger className="px-6 py-4 text-xl hover:no-underline">
            <div className="flex items-center">
              <ShieldAlert className="mr-3 h-6 w-6 text-muted-foreground" />
              Common Smart Contract Testing Pitfalls
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardDescription className="mb-4">
              Be mindful of these common issues when designing and writing your smart contract tests. The AI considers these when generating suggestions.
            </CardDescription>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full shadow-md rounded-lg border bg-card text-card-foreground">
        <AccordionItem value="defense-strategies">
          <AccordionTrigger className="px-6 py-4 text-xl hover:no-underline">
            <div className="flex items-center">
              <ShieldCheck className="mr-3 h-6 w-6 text-muted-foreground" />
              Defense Strategies for Robust Testing
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardDescription className="mb-4">
              Employ these strategies to build more resilient and effective smart contract tests.
            </CardDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Defense Strategy</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defenseStrategies.map((strategy) => (
                  <TableRow key={strategy.strategy}>
                    <TableCell className="font-medium">{strategy.strategy}</TableCell>
                    <TableCell>{strategy.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full shadow-md rounded-lg border bg-card text-card-foreground">
        <AccordionItem value="test-types-by-focus">
          <AccordionTrigger className="px-6 py-4 text-xl hover:no-underline">
            <div className="flex items-center">
              <Microscope className="mr-3 h-6 w-6 text-muted-foreground" />
              Test Types by Focus Area
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardDescription className="mb-4">
              Reference common test types based on the security focus area.
            </CardDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Focus Area</TableHead>
                  <TableHead>Relevant Test Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testTypesByFocus.map((item) => (
                  <TableRow key={item.focus}>
                    <TableCell className="font-medium">{item.focus}</TableCell>
                    <TableCell>{item.types}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>


      {analysisResult && (
        <Card className="shadow-lg mt-8">
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

