import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-conversation-history.ts';
import '@/ai/flows/provide-feedback-on-user-input.ts';
import '@/ai/flows/generate-contextual-response.ts';
import '@/ai/flows/translate-word-flow.ts';
