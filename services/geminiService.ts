import { GoogleGenAI, Type } from "@google/genai";
import { Complexity } from "../App";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-lite';

type PromptCategory = 'Software Development' | 'Business Planning' | 'Creative Writing' | 'Content Creation' | 'Generic';

const getSystemPrompt = (complexity: Complexity, category: PromptCategory): string => {
  let basePrompt: string;
  let complexityInstructions: Record<Complexity, string>;

  const finalRules = `
    You MUST adhere to the following rules:
    - The output must be a single, valid JSON object.
    - Do NOT wrap the JSON in markdown code blocks (e.g., \`\`\`json).
    - Do NOT add any introductory text, explanations, or concluding remarks.
    - The JSON should be well-formatted and easy to read.
  `;

  switch (category) {
    case 'Software Development':
      basePrompt = `
        You are an expert prompt engineer specializing in software development. Your task is to convert a user's app or website idea into a detailed, structured JSON object. This JSON object should meticulously break down the user's request into key functional components, potential features, and design considerations.
        Based on the user's request, you must identify:
        1.  A core 'Usecase' or 'Goal' summarizing the main objective.
        2.  An array of specific 'Features'.
      `;
      complexityInstructions = {
        Basic: `- Only include the 'Usecase' and 'Features' keys. Keep descriptions concise.`,
        Precise: `- In addition to basics, infer and add 'TargetAudience', 'DesignStyle' (e.g., 'Minimalist', 'Corporate'), and 'Platforms' (e.g., ['Web', 'iOS']).`,
        Advanced: `- Include all from 'Precise'. Also, add detailed, inferred fields like 'Monetization' (e.g., 'Freemium'), 'TechnicalStack' (suggest technologies), 'SecurityConsiderations', and 'AccessibilityFeatures'.`
      };
      break;

    case 'Business Planning':
      basePrompt = `
        You are a senior business strategist. Your task is to convert a user's business or marketing idea into a structured JSON object. This JSON should outline a clear plan with objectives, strategies, and metrics.
        Based on the user's request, you must identify:
        1.  A primary 'Objective' for the business or campaign.
        2.  An array of 'KeyStrategies' to achieve the objective.
      `;
      complexityInstructions = {
        Basic: `- Only include the 'Objective' and 'KeyStrategies' keys.`,
        Precise: `- In addition to basics, infer and add 'TargetMarket', 'SuccessMetrics' (e.g., 'Increase sales by 15%'), and 'Channels' (e.g., ['Social Media', 'Email Marketing']).`,
        Advanced: `- Include all from 'Precise'. Also, add 'CompetitiveAnalysis', 'BudgetAllocation' (suggest categories), and 'Timeline' (e.g., 'Q1', 'Q2').`
      };
      break;

    case 'Creative Writing':
      basePrompt = `
        You are a seasoned story editor. Your task is to structure a user's creative idea (novel, movie, story) into a JSON object that outlines the narrative.
        Based on the user's request, you must identify:
        1.  The 'Genre' of the story.
        2.  A 'Logline' summarizing the story in one sentence.
        3.  An array of 'MainCharacters' with brief descriptions.
      `;
      complexityInstructions = {
        Basic: `- Only include 'Genre', 'Logline', and 'MainCharacters'.`,
        Precise: `- In addition to basics, add a 'Synopsis' (a short summary), 'Themes' (e.g., ['Redemption', 'Betrayal']), and 'Setting' (time and place).`,
        Advanced: `- Include all from 'Precise'. Also, add 'PlotPoints' (as an array of objects with 'event' and 'description' keys, like 'Inciting Incident', 'Climax'), and 'Tone' (e.g., 'Suspenseful', 'Comedic').`
      };
      break;
      
    case 'Content Creation':
        basePrompt = `
        You are a content strategy expert. Your task is to structure a user's idea for content (like a blog post, video, or podcast) into a detailed JSON plan.
        Based on the user's request, you must identify:
        1. The 'Topic' of the content.
        2. The 'Format' (e.g., 'Blog Post', 'YouTube Video', 'Podcast Episode').
        3. The intended 'TargetAudience'.
        `;
        complexityInstructions = {
            Basic: `- Only include 'Topic', 'Format', and 'TargetAudience'.`,
            Precise: `- In addition to basics, add 'KeyTakeaways' (a list of main points for the audience), a 'Hook' (an engaging opening sentence), and a 'CallToAction'.`,
            Advanced: `- Include all from 'Precise'. Also, add 'SEOKeywords' (an array of relevant keywords), 'VisualElements' (e.g., 'Infographics', 'B-roll footage'), and a 'DistributionPlan' (e.g., ['Twitter', 'LinkedIn']).`
        };
        break;

    default: // Generic
      basePrompt = `
        You are an expert in structuring information. Your task is to convert a user's request into a general-purpose, structured JSON object.
        Based on the user's request, you must identify:
        1.  The 'PrimaryGoal' of the request.
        2.  An array of 'KeyComponents' that make up the request.
      `;
      complexityInstructions = {
        Basic: `- Only include the 'PrimaryGoal' and 'KeyComponents'.`,
        Precise: `- In addition to basics, infer and add 'IntendedAudience' and 'SuccessCriteria'.`,
        Advanced: `- Include all from 'Precise'. Also, add 'PotentialChallenges' and 'RequiredResources'.`
      };
  }

  return basePrompt + complexityInstructions[complexity] + finalRules;
};

const classifyPrompt = async (textToClassify: string): Promise<PromptCategory> => {
    const classificationPrompt = `
    Classify the user's goal into ONE of the following categories based on its primary goal:
    - "Software Development" (for creating apps, websites, tools, digital products)
    - "Business Planning" (for marketing plans, business strategies, campaign ideas)
    - "Creative Writing" (for stories, novels, screenplays, character development)
    - "Content Creation" (for blog posts, articles, videos, social media content)
    - "Generic" (if it does not clearly fit into the other categories)

    User's goal: "${textToClassify}"

    Respond with ONLY the category name.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: classificationPrompt,
        });
        const category = response.text.trim() as PromptCategory;
        const validCategories: PromptCategory[] = ['Software Development', 'Business Planning', 'Creative Writing', 'Content Creation', 'Generic'];
        if (validCategories.includes(category)) {
            return category;
        }
        return 'Generic';
    } catch (error) {
        console.error("Error classifying prompt:", error);
        return 'Generic'; // Default to generic if classification fails
    }
}


export const generateJsonPrompt = async (simplePrompt: string, complexity: Complexity, userContext?: string): Promise<string> => {
  const textToClassify = userContext?.trim() || simplePrompt;
  const category = await classifyPrompt(textToClassify);
  const systemPrompt = getSystemPrompt(complexity, category);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: `Understood. I will now receive the user's prompt and generate a structured JSON output based on the provided instructions, category (${category}), and complexity level (${complexity}).` }] },
        { role: 'user', parts: [{ text: `User's simple prompt:\n"${simplePrompt}"\n\nYour JSON output:` }] },
      ],
    });

    let jsonString = response.text.trim();
    
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    
    JSON.parse(jsonString);

    return jsonString;

  } catch (error) {
    console.error("Error generating JSON prompt:", error);
    if (error instanceof Error && error.message.includes("JSON")) {
      throw new Error("The AI returned an invalid JSON format. Please try again.");
    }
    throw new Error("Failed to communicate with the Gemini API. Please check your connection and API key.");
  }
};


export const generateKeywordSuggestions = async (prompt: string, currentJson: string): Promise<string[]> => {
    const suggestionPrompt = `
    Based on the user's initial prompt and the JSON that was just generated, suggest 5 to 7 additional JSON keys (NOT values) that would make the prompt even more detailed and effective.
    These keys should be relevant to the user's goal.
    
    User's prompt: "${prompt}"
    
    Generated JSON:
    ${currentJson}
    
    Provide your suggestions as a JSON array of strings.
    Example output: ["Monetization", "CoreTechnology", "SeoStrategy"]
    
    You MUST adhere to the following rules:
    - The output must be a single, valid JSON array of strings.
    - Do NOT wrap the JSON in markdown code blocks.
    - Do NOT add any introductory text or explanations.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: suggestionPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString);
        return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
        console.error("Error generating keyword suggestions:", error);
        throw new Error("Failed to generate suggestions.");
    }
};