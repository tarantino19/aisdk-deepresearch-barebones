import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import { z } from "zod";
 
const main = async () => {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "Get the weather in SF and NY, then add them together.",
    maxSteps: 3,
    tools: {
      addNumbers: tool({
        description: "Add two numbers together",
        parameters: z.object({
          num1: z.number(),
          num2: z.number(),
        }),
        execute: async ({ num1, num2 }) => {
          return num1 + num2;
        },
      }),
      getWeather: tool({
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
          city: z.string(),
        }),
        execute: async ({ latitude, longitude, city }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`,
          );
 
          const weatherData = await response.json();
          return {
            temperature: weatherData.current.temperature_2m,
            weatherCode: weatherData.current.weathercode,
            humidity: weatherData.current.relativehumidity_2m,
            city,
          };
        },
      }),
    },
  });
  console.log(result.steps.length)
  console.log(result.text);
  console.log(result.steps);
};
 
main();


---

import { openai } from '@ai-sdk/openai'
import { generateText, Output, tool } from 'ai'
import 'dotenv/config'
import { z } from 'zod'
 
const main = async () => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Get the weather in SF and NY, then add them together.',
    maxSteps: 3,
    tools: {
      addNumbers: tool({
        description: 'Add two numbers together',
        parameters: z.object({
          num1: z.number(),
          num2: z.number(),
        }),
        execute: async ({ num1, num2 }) => {
          return num1 + num2
        },
      }),
      getWeather: tool({
        description: 'Get the current weather at a location',
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
          city: z.string(),
        }),
        execute: async ({ latitude, longitude, city }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`
          )
 
          const weatherData = await response.json()
          return {
            temperature: weatherData.current.temperature_2m,
            weatherCode: weatherData.current.weathercode,
            humidity: weatherData.current.relativehumidity_2m,
            city,
          }
        },
      }),
    },
    experimental_output: Output.object({
      schema: z.object({ sum: z.string() }),
    }),
  })
  console.log(result.steps.length)
  console.log(result.experimental_output)
    console.log(result.experimental_output.sum)
}
 
main()

