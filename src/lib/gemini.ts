import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export interface AIAnalysisResult {
    items: Array<{ name: string; calories: number }>;
    totalCalories: number;
    recommendation: string;
}

export async function analyzeMealImage(base64Image: string): Promise<AIAnalysisResult> {
    if (!apiKey) {
        throw new Error("Missing Gemini API Key");
    }

    // We use the vision-capable model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analyze this image of a meal.
1. Identify all the food items visible.
2. Estimate the total calories for the meal.
3. Provide a very short, encouraging recommendation or tip for the rest of the day based on this meal.

Respond ONLY with a valid JSON block containing exactly the following structure (no markdown fences, no extra text):
{
  "items": [
    { "name": "Food name", "calories": 100 }
  ],
  "totalCalories": 500,
  "recommendation": "Try to eat a lighter dinner..."
}
`;

    // Provide the image data to Gemini
    const imageParts = [
        {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
            }
        }
    ];

    try {
        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        // Clean up markdown markers if Gemini ignores the instruction
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as AIAnalysisResult;
    } catch (error: any) {
        console.error("Error analyzing image with Gemini:", error);

        let errorMessage = "Failed to analyze the meal. Please try again.";
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }

        throw new Error(errorMessage);
    }
}
