import{ NextResponse } from "next/server";
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const clarifyResearchGoals = async (topic: string) => {

    const prompt = `
    Given the research topic <topic>${topic}</topic>, generate2-4 clarifying questions to help narrow down the research scope. Focus on identifying:
    - Specifi aspects of interest
    - Required depth/complexity level
    - Any particular perspectives or excluded sources
    `
    try{
        const { text } = await generateText({
            model: openrouter("/google/gemini-2.5-pro-exp-03-25:free"),
            prompt,
          });

          return text;
    }catch (error) {
        console.log("Error while generating questions: ", error)
    }
}

export async function POST(req: Request) {
    const {topic} = await req.json();
    console.log("Topic: ", topic);

    try {
        const questions = await clarifyResearchGoals(topic);
        console.log("Questions: ", questions);

        return NextResponse.json({
            success: true,
          }, {status: 200})
    } catch (error) {
        console.error("Error while processing request: ", error);
        return NextResponse.json({
            success: false, error: "Failed to generate questions"
        }, {status: 500})
    }
}