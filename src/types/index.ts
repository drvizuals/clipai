export type LanguagePreference = 'es' | 'en' | 'spanglish';

export type Industry =
  | 'food_beverage'
  | 'beauty_wellness'
  | 'fashion'
  | 'music_arts'
  | 'real_estate'
  | 'fitness'
  | 'tech'
  | 'consulting'
  | 'education'
  | 'hospitality'
  | 'content_creator'
  | 'other';

export interface OnboardingDraft {
  name: string;
  language: LanguagePreference | null;
  industry: Industry | null;
  story: string;
}

export interface BrandVoice {
  tagline: string;
  voice_description: string;
  pillars: string[];
  sample_posts: string[];
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  language: LanguagePreference;
  industry: Industry;
  story: string;
  brand_voice: BrandVoice | null;
  created_at: string;
  updated_at: string;
}
