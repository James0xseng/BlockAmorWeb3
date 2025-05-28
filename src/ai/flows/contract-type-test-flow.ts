
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
  suggestedTestingAreas: z.array(z.string()).describe('High-level areas or categories of tests to consider for this contract type/purpose (e.g., Access Control, State Changes, Event Emissions, Input Validation, Error Handling).'),
  generalNotes: z.string().optional().describe('Any other general notes, observations, or things to consider when testing this contract.'),
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
