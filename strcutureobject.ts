import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import 'dotenv/config'
import { z } from 'zod'

const definitionsSchema = z.object({
  definitions: z.array(z.string()),
})
 
const main = async () => {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    prompt: 'Give me the top 5 best sex positions?',
    schema: definitionsSchema,
  })

  console.log(result.object.definitions)
  console.log(result.object.definitions[0])
}
 
main()


--

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "dotenv/config";
import { z } from "zod";
 
const main = async () => {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: "Please come up with 10 definitions for AI agents.",
    schema: z.object({
      definitions: z.array(z.string().describe("Use as much jargon as possible. It should be completely incoherent.")),
    }),
  });
  console.log(result.object.definitions);
};
 
main();