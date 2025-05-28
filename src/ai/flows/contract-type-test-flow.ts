
'use server';
/**
 * @fileOverview Smart Contract Type and General Testing Analyzer.
 *
 * - contractTypeTest - A function that handles the smart contract type identification and general test suggestion.
 * - ContractTypeTestInput - The input type for the contractTypeTest function.
 * - ContractTypeTestOutput - The return type for the contractTypeTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContractTypeTestInputSchema = z.object({
  contractCode: z
    .string()
    .describe('The smart contract code to analyze for type and testing suggestions.'),
});
export type ContractTypeTestInput = z.infer<typeof ContractTypeTestInputSchema>;

const ContractTypeTestOutputSchema = z.object({
  identifiedLanguage: z.string().optional().describe('The programming language identified for the smart contract (e.g., Solidity, Vyper, Rust).'),
  contractOverview: z.string().describe("A brief overview of the contract's apparent purpose or main functionality."),
  suggestedTestingAreas: z.array(z.string()).describe('High-level areas or categories of tests to consider for this contract type/purpose (e.g., Access Control, State Changes, Event Emissions, Input Validation, Error Handling). These suggestions should also implicitly guide towards creating tests resilient to common testing pitfalls.'),
  generalNotes: z.string().optional().describe('Any other general notes, observations, or things to consider when testing this contract, including advice on building robust test suites that avoid common vulnerabilities in the tests themselves.'),
});
export type ContractTypeTestOutput = z.infer<typeof ContractTypeTestOutputSchema>;

export async function contractTypeTest(input: ContractTypeTestInput): Promise<ContractTypeTestOutput> {
  return contractTypeTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contractTypeTestPrompt',
  input: {schema: ContractTypeTestInputSchema},
  output: {schema: ContractTypeTestOutputSchema},
  prompt: `You are an expert smart contract auditor and testing specialist.
  Analyze the provided smart contract code. Your goal is to:
  1. Identify the programming language of the contract (e.g., Solidity, Vyper, Rust, Move, etc.). If unsure, state "Unknown".
  2. Provide a brief overview of what the contract appears to do based on its structure, function names, and comments.
  3. Suggest 3-5 high-level testing areas or categories that would be important for this type of contract. Examples: Access Control, State Transitions, Event Verification, Gas Efficiency, Upgradeability, Security Vulnerabilities (mention common ones if apparent for the language).
  4. Add any general notes or specific considerations for testing this particular contract if something stands out.

  When suggesting testing areas and general notes, also consider how the contract's tests themselves might be subverted or flawed. Your advice should help users write tests that are robust against pitfalls such as:
  - **Test Injection**: Where a contract might be modified or recompiled with hidden logic specifically to pass tests.
  - **Role Misconfiguration**: Where tests make assumptions about roles (e.g., 'owner', 'admin') that can be bypassed, for instance, by impersonating authorized roles (e.g., using \`vm.prank\` in Foundry tests if analyzing Solidity).
  - **Hidden State Drift**: Where the state relevant to a test is manipulated by logic outside the specific function being tested, leading to unreliable test outcomes.
  - **False Positive Test Logic**: Where unit tests consistently pass not because the contract logic is correct, but because the test's assertion logic is flawed (e.g., asserting trivial conditions).
  - **Missing Negative Cases**: Where tests lack coverage for invalid inputs or failure scenarios, potentially allowing security bypasses to go undetected.
  - **Function Mutation Drift**: Where changes to a contract's function signatures or behavior are not matched by corresponding updates in the test suite, rendering tests outdated or ineffective.
  - **Selector Shadowing**: Where different functions might reuse names but have different parameters, potentially leading to tests exercising unintended behavior or missing coverage for the intended function.
  - **Gas-Bomb Passes**: Where malicious logic within a contract might be designed to pass functional tests but consume an unexpectedly large amount of gas, which could be problematic in production but not caught by standard unit tests focused on correctness.

  In your 'generalNotes' or within 'suggestedTestingAreas', provide advice or highlight areas where robust testing strategies are needed to mitigate these meta-testing risks. For example, you might suggest "For Access Control, ensure tests rigorously verify role-based permissions under various impersonation scenarios and check for unintended state changes from unrelated functions."

  Smart Contract Code:
  \`\`\`
  {{{contractCode}}}
  \`\`\`

  Respond in the structured format defined by the output schema.
  Ensure 'identifiedLanguage', 'contractOverview', and 'suggestedTestingAreas' are always populated.
  `,
});

const contractTypeTestFlow = ai.defineFlow(
  {
    name: 'contractTypeTestFlow',
    inputSchema: ContractTypeTestInputSchema,
    outputSchema: ContractTypeTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

