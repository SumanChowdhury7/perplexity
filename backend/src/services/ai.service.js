import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY
});

export async function testAi() {
model.invoke("Who is the most handsome guy in india").then((response)=>{
console.log(response.text);
})
}