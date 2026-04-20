import type { Industry, LanguagePreference } from '@/types';

export const INDUSTRIES: { value: Industry; labels: Record<LanguagePreference, string>; emoji: string }[] = [
  { value: 'food_beverage', emoji: '🌮', labels: { en: 'Food & Beverage', es: 'Comida y Bebida', spanglish: 'Food & Bebida' } },
  { value: 'beauty_wellness', emoji: '💅', labels: { en: 'Beauty & Wellness', es: 'Belleza y Bienestar', spanglish: 'Beauty & Wellness' } },
  { value: 'fashion', emoji: '👗', labels: { en: 'Fashion', es: 'Moda', spanglish: 'Fashion' } },
  { value: 'music_arts', emoji: '🎵', labels: { en: 'Music & Arts', es: 'Música y Arte', spanglish: 'Music y Arte' } },
  { value: 'real_estate', emoji: '🏡', labels: { en: 'Real Estate', es: 'Bienes Raíces', spanglish: 'Real Estate' } },
  { value: 'fitness', emoji: '💪', labels: { en: 'Fitness', es: 'Fitness', spanglish: 'Fitness' } },
  { value: 'tech', emoji: '💻', labels: { en: 'Tech', es: 'Tecnología', spanglish: 'Tech' } },
  { value: 'consulting', emoji: '📊', labels: { en: 'Consulting', es: 'Consultoría', spanglish: 'Consulting' } },
  { value: 'education', emoji: '📚', labels: { en: 'Education', es: 'Educación', spanglish: 'Education' } },
  { value: 'hospitality', emoji: '🏨', labels: { en: 'Hospitality', es: 'Hospitalidad', spanglish: 'Hospitality' } },
  { value: 'content_creator', emoji: '📸', labels: { en: 'Content Creator', es: 'Creador de Contenido', spanglish: 'Content Creator' } },
  { value: 'other', emoji: '✨', labels: { en: 'Something else', es: 'Otra cosa', spanglish: 'Otra cosa' } },
];

export const LANGUAGES: { value: LanguagePreference; title: string; subtitle: string; emoji: string }[] = [
  { value: 'es', title: 'Español', subtitle: 'Hablo y publico en español', emoji: '🇲🇽' },
  { value: 'en', title: 'English', subtitle: 'I speak and post in English', emoji: '🇺🇸' },
  { value: 'spanglish', title: 'Spanglish', subtitle: 'Mezclo los dos, como en casa', emoji: '🌎' },
];
