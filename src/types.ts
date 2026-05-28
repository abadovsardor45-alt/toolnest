export type ToolId = 'home' | 'qr-generator' | 'password-generator' | 'notes' | 'countdown-timer' | 'link-shortener' | 'currency-converter' | 'unit-converter';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: 'utility' | 'developer' | 'productivity' | 'finance';
  icon: string; // lucide icon name
  popular: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

export interface Countdown {
  id: string;
  title: string;
  targetDate: string;
  category: 'personal' | 'work' | 'holiday' | 'other';
  color: string;
}

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
  analytics: {
    device: { desktop: number; mobile: number; tablet: number };
    browser: { chrome: number; safari: number; firefox: number; edge: number };
    traffic: { date: string; clicks: number }[];
  };
}

export interface User {
  username: string;
  email: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
}
