import { StreamChunkCallback } from './suggestionsService';

const SYSTEM_INSTRUCTION =
  '你是一位專業攀岩教練助理。你的職責是根據攀岩者的程度與風格偏好，推薦適合的攀岩路線。' +
  '回應格式必須為 JSON 陣列，包含：name（路線名稱）、grade（難度）、style（風格）、reason（推薦理由，繁體中文）。' +
  '只回應 JSON 陣列本身，不要有任何前言或後記。';

export interface GeminiClient {
  complete(userPrompt: string): Promise<string>;
  completeStream(userPrompt: string, onChunk: StreamChunkCallback): Promise<string>;
}

export function createGeminiClient(): GeminiClient {
  const apiKey = import.meta.env.VITE_VERTEX_AI_KEY;
  const modelName = 'gemini-2.5-flash-lite';
  // 使用非串流端點，解析更穩定
  const generateUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/${modelName}:generateContent?key=${apiKey}`;

  async function callAPI(prompt: string): Promise<string> {
    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: 'user', 
          parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n使用者請求：${prompt}` }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Vertex AI Error: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('AI 回傳空白回應');
    return text;
  }

  return {
    async complete(userPrompt: string): Promise<string> {
      return callAPI(userPrompt);
    },

    // 使用非串流 API，但仍模擬串流體驗（分批推送字元）
    async completeStream(userPrompt: string, onChunk: StreamChunkCallback): Promise<string> {
      const fullText = await callAPI(userPrompt);
      
      // 模擬串流：每 50ms 推送一個字，讓 UI 有動態感
      const chars = fullText.split('');
      let i = 0;
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          const batch = chars.slice(i, i + 10).join('');
          if (batch) onChunk(batch);
          i += 10;
          if (i >= chars.length) {
            clearInterval(interval);
            resolve();
          }
        }, 30);
      });

      return fullText;
    },
  };
}
