import { GroundingChunk } from "@google/genai";

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}
