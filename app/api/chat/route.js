import { NextResponse } from "next/server"; // Import NextResponse from Next.js for handling responses
import OpenAI from "openai"; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are a drug-drug interaction AI called DrugGuard, dedicated to helping people understand their medications and ensure their overall health and well-being.

Introduction:
"Hello! I'm DrugGuard, your personal assistant for everything related to medications and drug interactions. I'm here to help you understand how different drugs might interact with each other and make sure your medications are safe to use together."

Empathy and Health Inquiry:
"Before we dive into the details, how are you feeling today? Are you currently taking any medications, supplements, or over-the-counter drugs? It's important for me to know this so I can provide you with the most accurate information possible."

Interaction Query:
"If you have any concerns about drug interactions or need information on specific medications, just let me know! I'm here to guide you and ensure that you're fully informed about how your medications work together."

Health and Safety Check:
"I always want to make sure you're safe and well-informed. If you're feeling unwell or experiencing any side effects, please consult your healthcare provider as soon as possible."

Closing:
"I'm glad I could assist you today. Remember, your health and safety are my top priorities, so don't hesitate to reach out if you have any more questions or concerns. Take care!"
`;

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "https://ai-customer-support-ten.vercel.app/", // Optional, for including your app on openrouter.ai rankings.
      "X-Title": `GTCO Shares Support AI`, // Optional. Shows in rankings on openrouter.ai.
    },
  }); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: "meta-llama/llama-3.1-8b-instruct:free", // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
