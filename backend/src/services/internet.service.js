import { tavily as Tavily} from "@tavily/core";

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

export const searchInternet = async (query) => {
    try {
        const response = await tavily.search(query,{
           maxResults: 5,
           searchDepth: "basic",
        });
        return JSON.stringify(response);
    } catch (error) {
        console.error("Error searching internet:", error);
        throw error;
    }
};

