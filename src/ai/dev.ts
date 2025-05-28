
import { config } from 'dotenv';
config();

import '@/ai/flows/vulnerability-scan.ts';
import '@/ai/flows/contract-type-test-flow.ts'; // Added import for the new flow
