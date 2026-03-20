import { tool } from "@langchain/core/tools";
import axios from "axios";

export const tavilyTool = tool(
  async (input) => {
    try {
      // ✅ FIX: handle both formats
      const query = input?.query || input?.input || input;

      if (!query) {
        console.log("NO QUERY RECEIVED:", input);
        return "No query provided";
      }

      console.log("TAVILY CALLED:", query);

      const res = await axios.post(
        "https://api.tavily.com/search",
        {
          query,
          search_depth: "advanced",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
          },
        }
      );

      const results = res.data?.results || [];

      if (!results.length) return "No results found";

      return results
        .slice(0, 5)
        .map(r => `Title: ${r.title}\nContent: ${r.content}`)
        .join("\n\n");

    } catch (err) {
      console.error("TAVILY ERROR:", err.response?.data || err.message);
      return "Error fetching web data";
    }
  },
  {
    name: "web_search",
    description: "Search latest info from internet",
  }
);