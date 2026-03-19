import { tool } from "@langchain/core/tools";
import axios from "axios";

export const tavilyTool = tool(
  async ({ query }) => {
    try {
      const res = await axios.post("https://api.tavily.com/search", {
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "advanced",
      });

      const results = res.data.results;

      return results
        .map(r => `Title: ${r.title}\nContent: ${r.content}`)
        .join("\n\n");
    } catch (err) {
      return "Error fetching web data";
    }
  },
  {
    name: "web_search",
    description:
      "Search the web for latest information. Use this when user asks about current events, news, or recent data.",
  }
);