
export interface ScopeItem {
  id: string;
  description: string;
  category: 'Construction' | 'Maintenance' | 'Design' | 'Renovation';
  timeline: string;
  cost: number;
  status: 'Pending' | 'In_Progress' | 'Completed' | 'Approved_By_Client';
}

export interface PaymentMilestone {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  milestoneId: string;
  items: ScopeItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
  FLASH_LITE = 'gemini-2.5-flash-lite-latest',
  PRO = 'gemini-3-pro-preview',
  IMAGE_PRO = 'gemini-3-pro-image-preview', // For High Quality Gen
  IMAGE_FLASH = 'gemini-2.5-flash-image', // For Editing/Fast Gen
  VIDEO = 'veo-3.1-fast-generate-preview',
  TTS = 'gemini-2.5-flash-preview-tts',
  LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  grounding?: {
    search?: { uri: string; title: string }[];
    maps?: { uri: string; title: string }[];
  };
}
