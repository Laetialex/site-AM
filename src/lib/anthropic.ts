import Anthropic from "@anthropic-ai/sdk";

export const anthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

export function getAnthropic() {
  if (!anthropicConfigured) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
