
import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiModel } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Expose client for Live API usage in components
export const getGenAIClient = () => getClient();

export const chatWithGemini = async (
    prompt: string, 
    options: {
        modelType: 'fast' | 'standard' | 'pro' | 'thinking';
        useSearch?: boolean;
        useMaps?: boolean;
        media?: { mimeType: string; data: string }
    }
) => {
  const ai = getClient();
  const tools: any[] = [];
  
  // Model Selection Logic
  let modelName: string = GeminiModel.FLASH;
  let config: any = {};

  if (options.modelType === 'fast') {
      modelName = GeminiModel.FLASH_LITE;
  } else if (options.modelType === 'pro') {
      modelName = GeminiModel.PRO;
  } else if (options.modelType === 'thinking') {
      modelName = GeminiModel.PRO;
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Do not set maxOutputTokens when using thinking
  } else {
      // standard
      modelName = GeminiModel.FLASH;
  }

  // Tools
  if (options.useSearch) tools.push({ googleSearch: {} });
  if (options.useMaps) tools.push({ googleMaps: {} });
  if (tools.length > 0) config.tools = tools;

  // Contents
  let contents: any = prompt;
  if (options.media) {
      contents = {
          parts: [
              { inlineData: { mimeType: options.media.mimeType, data: options.media.data } },
              { text: prompt }
          ]
      };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: contents,
    config: config
  });

  return response;
};

// Legacy support wrapper
export const generateArchitecturalAdvice = async (prompt: string, useSearch: boolean = false, useMaps: boolean = false) => {
    return chatWithGemini(prompt, { modelType: 'standard', useSearch, useMaps });
};

export const generateMOUContent = async (topic: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.PRO, 
    contents: `Draft a formal clause for an MOU regarding: ${topic}. Keep it professional and legally sound for Bangladesh context.`,
  });
  return response.text;
};

export const generateDesignImage = async (prompt: string, size: '1K'|'2K'|'4K' = '1K', aspectRatio: string = '16:9') => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.IMAGE_PRO,
    contents: prompt,
    config: {
        imageConfig: {
            imageSize: size,
            aspectRatio: aspectRatio
        }
    }
  });
  return response;
};

export const editDesignImage = async (base64Image: string, prompt: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: GeminiModel.IMAGE_FLASH,
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/png', data: base64Image } },
                { text: prompt }
            ]
        }
    });
    return response;
};

export const generateWalkthroughVideo = async (prompt: string, imageBase64?: string, aspectRatio: string = '16:9') => {
  const ai = getClient();
  
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
      }
  }

  const freshAi = getClient();

  // Construct request payload
  const request: any = {
    model: GeminiModel.VIDEO,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  };

  if (imageBase64) {
      request.image = {
          imageBytes: imageBase64,
          mimeType: 'image/png' // Assuming png for simplicity, adjust as needed
      };
      if (prompt) request.prompt = prompt; // Prompt optional if image provided? usually required for Veo to guide
      else request.prompt = "Animate this image";
  } else {
      request.prompt = prompt;
  }

  let operation = await freshAi.models.generateVideos(request);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await freshAi.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video generated");
  
  return `${videoUri}&key=${process.env.API_KEY}`;
};

export const transcribeAudio = async (audioBase64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: GeminiModel.FLASH,
        contents: {
            parts: [
                { inlineData: { mimeType: 'audio/wav', data: audioBase64 } },
                { text: "Transcribe this audio." }
            ]
        }
    });
    return response.text;
}

export const generateSpeech = async (text: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: GeminiModel.TTS,
        contents: { parts: [{ text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
