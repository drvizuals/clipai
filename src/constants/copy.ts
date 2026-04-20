import type { LanguagePreference } from '@/types';

type CopyKey =
  | 'welcomeTitle'
  | 'welcomeSubtitle'
  | 'welcomeCta'
  | 'nameTitle'
  | 'nameSubtitle'
  | 'namePlaceholder'
  | 'languageTitle'
  | 'languageSubtitle'
  | 'industryTitle'
  | 'industrySubtitle'
  | 'storyTitle'
  | 'storySubtitle'
  | 'storyPlaceholder'
  | 'continue'
  | 'back'
  | 'generating'
  | 'brandVoiceTitle'
  | 'brandVoiceSubtitle'
  | 'pillarsHeading'
  | 'samplesHeading'
  | 'finish'
  | 'tryAgain';

const copy: Record<LanguagePreference, Record<CopyKey, string>> = {
  en: {
    welcomeTitle: 'Build the brand only you can build.',
    welcomeSubtitle: 'Lazo is your AI co-pilot for Latino entrepreneurs and creators — your voice, your story, your way.',
    welcomeCta: "Let's begin",
    nameTitle: 'What should we call you?',
    nameSubtitle: 'Your name or the name of your brand — whichever you build under.',
    namePlaceholder: 'e.g. Sofia Ramirez or Sofia Studio',
    languageTitle: 'How do you want to show up?',
    languageSubtitle: 'Pick the language you create in. You can change this anytime.',
    industryTitle: 'What do you do?',
    industrySubtitle: 'Pick the space where your work lives.',
    storyTitle: 'Tell us your story.',
    storySubtitle: 'In your own words — where you come from, what you make, who it is for. No script.',
    storyPlaceholder: 'Soy la hija de...  /  I started this because...',
    continue: 'Continue',
    back: 'Back',
    generating: 'Shaping your brand voice…',
    brandVoiceTitle: 'Here is your brand voice.',
    brandVoiceSubtitle: "We'll use this to guide every caption, post, and pitch going forward.",
    pillarsHeading: 'Your pillars',
    samplesHeading: 'Try it on',
    finish: 'Enter Lazo',
    tryAgain: 'Regenerate',
  },
  es: {
    welcomeTitle: 'Construye la marca que solo tú puedes construir.',
    welcomeSubtitle: 'Lazo es tu copiloto de IA para emprendedores y creadores latinos — tu voz, tu historia, a tu manera.',
    welcomeCta: 'Empecemos',
    nameTitle: '¿Cómo te llamamos?',
    nameSubtitle: 'Tu nombre o el de tu marca — como te conoce la gente.',
    namePlaceholder: 'Ej. Sofía Ramírez o Sofía Studio',
    languageTitle: '¿Cómo quieres aparecer?',
    languageSubtitle: 'Elige el idioma en que creas. Lo puedes cambiar cuando quieras.',
    industryTitle: '¿A qué te dedicas?',
    industrySubtitle: 'Elige el espacio donde vive tu trabajo.',
    storyTitle: 'Cuéntanos tu historia.',
    storySubtitle: 'En tus propias palabras — de dónde vienes, qué haces, para quién. Sin guion.',
    storyPlaceholder: 'Soy la hija de... / Empecé esto porque...',
    continue: 'Continuar',
    back: 'Atrás',
    generating: 'Formando tu voz de marca…',
    brandVoiceTitle: 'Aquí está tu voz de marca.',
    brandVoiceSubtitle: 'La vamos a usar para guiar cada caption, post y propuesta de aquí en adelante.',
    pillarsHeading: 'Tus pilares',
    samplesHeading: 'Pruébalo',
    finish: 'Entrar a Lazo',
    tryAgain: 'Volver a generar',
  },
  spanglish: {
    welcomeTitle: 'Construye the brand only you can build.',
    welcomeSubtitle: 'Lazo es tu AI co-pilot para emprendedores y creadores latinos — tu voz, tu story, a tu manera.',
    welcomeCta: "Let's empezar",
    nameTitle: '¿Cómo te llamamos?',
    nameSubtitle: 'Your name o el de tu brand — como te conoce la gente.',
    namePlaceholder: 'Ej. Sofía Ramírez o Sofía Studio',
    languageTitle: '¿Cómo quieres show up?',
    languageSubtitle: 'Pick the idioma en que creas. Lo puedes cambiar cuando quieras.',
    industryTitle: '¿A qué te dedicas?',
    industrySubtitle: 'Pick the space donde vive tu trabajo.',
    storyTitle: 'Cuéntanos tu story.',
    storySubtitle: 'In your own words — de dónde vienes, qué haces, para quién. No script.',
    storyPlaceholder: 'Soy la hija de... / I started this because...',
    continue: 'Continuar',
    back: 'Back',
    generating: 'Shaping tu brand voice…',
    brandVoiceTitle: 'Aquí está tu brand voice.',
    brandVoiceSubtitle: 'La vamos a usar para guiar cada caption, post y pitch de aquí en adelante.',
    pillarsHeading: 'Tus pilares',
    samplesHeading: 'Pruébalo',
    finish: 'Entrar a Lazo',
    tryAgain: 'Regenerar',
  },
};

export function t(key: CopyKey, language: LanguagePreference | null): string {
  const resolved = language ?? 'en';
  return copy[resolved][key];
}
