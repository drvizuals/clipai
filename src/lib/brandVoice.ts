import { supabase } from '@/lib/supabase';
import type { BrandVoice, Industry, LanguagePreference } from '@/types';

export interface GenerateBrandVoiceInput {
  name: string;
  language: LanguagePreference;
  industry: Industry;
  story: string;
}

export async function generateBrandVoice(input: GenerateBrandVoiceInput): Promise<BrandVoice> {
  const { data, error } = await supabase.functions.invoke<BrandVoice>('generate-brand-voice', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('No brand voice returned from edge function.');
  return data;
}
