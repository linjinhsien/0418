import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION =
  '你是一位專業攀岩教練助理。你的唯一職責是根據攀岩者的程度與風格偏好，推薦適合的攀岩路線。' +
  '請勿回答與攀岩路線建議無關的任何問題。' +
  '回應格式必須為 JSON 陣列，每筆包含：name（路線名稱）、grade（難度）、style（風格）、reason（推薦理由，繁體中文）。';

export interface GeminiClient {
  complete(userPrompt: string): Promise<string>;
}

export function createGeminiClient(apiKey: string): GeminiClient {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return {
    async complete(userPrompt: string): Promise<string> {
      const result = await model.generateContent(userPrompt);
      return result.response.text();
    },
  };
}
