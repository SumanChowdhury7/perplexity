import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage,tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0,
});

const searchInternetTool = tool(
  async ({ query }) => {
    return await searchInternet(query);
  },
  {
    name: "search_internet",
    description:
      "Search the internet for latest information",
    schema: z.object({
      query: z.string().describe("Search query")
    }),
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
  systemPrompt: `
You are an AI assistant with internet access.

If a question requires latest or real-time information,
use the "search_internet" tool.

Always summarize the results clearly for the user.
`
});

// const agent = createReactAgent({
//     llm: model,
//     tools: [emailTool]
// })

export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
      })
  });

  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and relevant titles for user chats. The title should capture the essence of the conversation in a few words.
    User will provide you with the first message of the chat, and you will generate a suitable title with in 2 - 4 words for that chat. The title should be unique and descriptive, helping users easily identify their conversations later on. Please ensure the title is clear and to the point.
    `),
    new HumanMessage(`
        Generate a title for a chat with the first message: "${message}"
        `)
  ]);
  return response.text;
}

