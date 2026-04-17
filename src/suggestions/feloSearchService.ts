
export interface FeloResource {
  title: string;
  link: string;
}

export interface FeloSearchResponse {
  answer: string;
  resources: FeloResource[];
}

export const feloSearchService = {
  async search(query: string): Promise<FeloSearchResponse | null> {
    const apiKey = import.meta.env.VITE_FELO_API_KEY;
    if (!apiKey) {
      console.warn('Felo API Key is missing');
      return null;
    }

    try {
      const response = await fetch('https://openapi.felo.ai/v2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Felo API failure');

      const data = await response.json();
      const resData = data.data || data;

      return {
        answer: resData.answer || '',
        resources: (resData.resources || []).map((r: any) => ({
          title: r.title,
          link: r.link || r.url
        }))
      };
    } catch (error) {
      console.error('Felo Search Error:', error);
      return null;
    }
  }
};
