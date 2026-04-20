import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const colors = {
  background: '#0B0B0F',
  surface: '#15151C',
  surfaceElevated: '#1E1E28',
  border: '#2A2A36',
  terracotta: '#F26B3A',
  terracottaPressed: '#D8562B',
  gold: '#E8B86B',
  goldSoft: '#FFD89B',
  text: '#F5F1EA',
  textMuted: '#9A93A6',
  textSubtle: '#6C6478',
};

const LANGUAGES = [
  { value: 'es', title: 'Español', subtitle: 'Hablo y publico en español', emoji: '🇲🇽' },
  { value: 'en', title: 'English', subtitle: 'I speak and post in English', emoji: '🇺🇸' },
  { value: 'spanglish', title: 'Spanglish', subtitle: 'Mezclo los dos, como en casa', emoji: '🌎' },
];

const INDUSTRIES = [
  { value: 'food', emoji: '🌮', labels: { en: 'Food & Beverage', es: 'Comida y Bebida', spanglish: 'Food & Bebida' } },
  { value: 'beauty', emoji: '💅', labels: { en: 'Beauty & Wellness', es: 'Belleza y Bienestar', spanglish: 'Beauty & Wellness' } },
  { value: 'fashion', emoji: '👗', labels: { en: 'Fashion', es: 'Moda', spanglish: 'Fashion' } },
  { value: 'music', emoji: '🎵', labels: { en: 'Music & Arts', es: 'Música y Arte', spanglish: 'Music y Arte' } },
  { value: 'real_estate', emoji: '🏡', labels: { en: 'Real Estate', es: 'Bienes Raíces', spanglish: 'Real Estate' } },
  { value: 'fitness', emoji: '💪', labels: { en: 'Fitness', es: 'Fitness', spanglish: 'Fitness' } },
  { value: 'tech', emoji: '💻', labels: { en: 'Tech', es: 'Tecnología', spanglish: 'Tech' } },
  { value: 'consulting', emoji: '📊', labels: { en: 'Consulting', es: 'Consultoría', spanglish: 'Consulting' } },
  { value: 'education', emoji: '📚', labels: { en: 'Education', es: 'Educación', spanglish: 'Education' } },
  { value: 'hospitality', emoji: '🏨', labels: { en: 'Hospitality', es: 'Hospitalidad', spanglish: 'Hospitality' } },
  { value: 'creator', emoji: '📸', labels: { en: 'Content Creator', es: 'Creador de Contenido', spanglish: 'Content Creator' } },
  { value: 'other', emoji: '✨', labels: { en: 'Something else', es: 'Otra cosa', spanglish: 'Otra cosa' } },
];

const COPY = {
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
    finishTitle: 'Gracias.',
    finishSubtitle: 'Your Lazo brand voice is being shaped. In the full app, Claude writes your tagline, pillars, and sample posts from here.',
    finishCta: 'Start over',
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
    finishTitle: 'Gracias.',
    finishSubtitle: 'Tu voz de marca Lazo se está formando. En la app completa, Claude escribe tu tagline, pilares y posts de ejemplo desde aquí.',
    finishCta: 'Empezar de nuevo',
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
    finishTitle: 'Gracias.',
    finishSubtitle: 'Tu Lazo brand voice se está formando. En la full app, Claude writes tu tagline, pilares y sample posts desde aquí.',
    finishCta: 'Empezar otra vez',
  },
};

const STEPS = ['welcome', 'name', 'language', 'industry', 'story', 'done'];

export default function App() {
  const [step, setStep] = useState('welcome');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [story, setStory] = useState('');

  const lang = language ?? 'en';
  const copy = COPY[lang];

  const progress = useMemo(() => {
    const idx = STEPS.indexOf(step);
    if (idx <= 0) return 0;
    if (idx >= STEPS.length - 1) return 1;
    return (idx - 1) / 4;
  }, [step]);

  function goNext() {
    const idx = STEPS.indexOf(step);
    setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  }
  function goBack() {
    const idx = STEPS.indexOf(step);
    setStep(STEPS[Math.max(idx - 1, 0)]);
  }
  function reset() {
    setStep('welcome');
    setName('');
    setLanguage(null);
    setIndustry(null);
    setStory('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {step !== 'welcome' && step !== 'done' ? (
            <View style={styles.topBar}>
              <Pressable onPress={goBack} hitSlop={12} style={styles.backBtn}>
                <Text style={styles.backText}>← {copy.back}</Text>
              </Pressable>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>
          ) : null}

          {step === 'welcome' && <Welcome copy={copy} onContinue={goNext} />}
          {step === 'name' && (
            <Name copy={copy} value={name} setValue={setName} onContinue={goNext} />
          )}
          {step === 'language' && (
            <Language selected={language} setSelected={setLanguage} onContinue={goNext} copy={copy} />
          )}
          {step === 'industry' && (
            <Industry lang={lang} selected={industry} setSelected={setIndustry} onContinue={goNext} copy={copy} />
          )}
          {step === 'story' && (
            <Story copy={copy} value={story} setValue={setStory} onContinue={goNext} />
          )}
          {step === 'done' && <Done copy={copy} name={name} onReset={reset} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Welcome({ copy, onContinue }) {
  return (
    <View style={styles.flex}>
      <View style={styles.hero}>
        <View style={styles.monogramWrap}>
          <View style={styles.monogram}>
            <Text style={styles.monogramLetter}>L</Text>
          </View>
          <Text style={styles.mark}>LAZO</Text>
        </View>
        <Text style={styles.displayTitle}>{copy.welcomeTitle}</Text>
        <Text style={styles.bodyMuted}>{copy.welcomeSubtitle}</Text>
      </View>
      <View>
        <PrimaryButton label={copy.welcomeCta} onPress={onContinue} />
      </View>
    </View>
  );
}

function Name({ copy, value, setValue, onContinue }) {
  const canContinue = value.trim().length >= 2;
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{copy.nameTitle}</Text>
        <Text style={styles.bodyMuted}>{copy.nameSubtitle}</Text>
      </View>
      <View style={styles.flex}>
        <Field
          value={value}
          onChangeText={setValue}
          placeholder={copy.namePlaceholder}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={60}
          returnKeyType="next"
          onSubmitEditing={() => canContinue && onContinue()}
        />
      </View>
      <PrimaryButton label={copy.continue} onPress={onContinue} disabled={!canContinue} />
    </View>
  );
}

function Language({ selected, setSelected, onContinue, copy }) {
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{copy.languageTitle}</Text>
        <Text style={styles.bodyMuted}>{copy.languageSubtitle}</Text>
      </View>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((opt) => (
          <OptionCard
            key={opt.value}
            title={opt.title}
            subtitle={opt.subtitle}
            emoji={opt.emoji}
            selected={selected === opt.value}
            onPress={() => setSelected(opt.value)}
          />
        ))}
      </ScrollView>
      <PrimaryButton label={copy.continue} onPress={onContinue} disabled={!selected} />
    </View>
  );
}

function Industry({ lang, selected, setSelected, onContinue, copy }) {
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{copy.industryTitle}</Text>
        <Text style={styles.bodyMuted}>{copy.industrySubtitle}</Text>
      </View>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {INDUSTRIES.map((opt) => (
          <OptionCard
            key={opt.value}
            title={opt.labels[lang]}
            emoji={opt.emoji}
            selected={selected === opt.value}
            onPress={() => setSelected(opt.value)}
          />
        ))}
      </ScrollView>
      <PrimaryButton label={copy.continue} onPress={onContinue} disabled={!selected} />
    </View>
  );
}

function Story({ copy, value, setValue, onContinue }) {
  const canContinue = value.trim().length >= 40;
  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{copy.storyTitle}</Text>
          <Text style={styles.bodyMuted}>{copy.storySubtitle}</Text>
        </View>
        <Field
          value={value}
          onChangeText={setValue}
          placeholder={copy.storyPlaceholder}
          multiline
          maxLength={1200}
          autoCapitalize="sentences"
          showCount
        />
      </ScrollView>
      <PrimaryButton label={copy.continue} onPress={onContinue} disabled={!canContinue} />
    </View>
  );
}

function Done({ copy, name, onReset }) {
  return (
    <View style={styles.flex}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>LAZO · {name.toUpperCase() || 'TU MARCA'}</Text>
        <Text style={styles.displayTitle}>{copy.finishTitle}</Text>
        <Text style={styles.bodyMuted}>{copy.finishSubtitle}</Text>
      </View>
      <GhostButton label={copy.finishCta} onPress={onReset} />
    </View>
  );
}

function OptionCard({ title, subtitle, emoji, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected && styles.optionCardSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      {emoji ? <Text style={styles.optionEmoji}>{emoji}</Text> : null}
      <View style={styles.flex}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.optionSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function Field({ showCount, maxLength, multiline, value, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginTop: 16 }}>
      <TextInput
        {...rest}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.terracotta}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          focused && styles.inputFocused,
        ]}
      />
      {showCount && typeof maxLength === 'number' ? (
        <Text style={styles.count}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

function PrimaryButton({ label, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        styles.btnPrimary,
        pressed && !disabled && { backgroundColor: colors.terracottaPressed },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Text style={styles.btnPrimaryLabel}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.btnGhost,
        pressed && { backgroundColor: colors.surface },
      ]}
    >
      <Text style={styles.btnGhostLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  hero: { flex: 1, justifyContent: 'center' },
  monogramWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.terracotta,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  monogramLetter: { color: colors.text, fontSize: 22, fontWeight: '800' },
  mark: {
    fontSize: 13,
    letterSpacing: 6,
    color: colors.gold,
    fontWeight: '700',
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 4,
    color: colors.gold,
    fontWeight: '700',
    marginBottom: 16,
  },
  displayTitle: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.text,
    lineHeight: 42,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.text,
    lineHeight: 32,
  },
  bodyMuted: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textMuted,
    marginTop: 12,
    lineHeight: 24,
  },
  headerBlock: { marginBottom: 8 },
  input: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputMultiline: { minHeight: 180, textAlignVertical: 'top' },
  inputFocused: { borderColor: colors.terracotta },
  count: {
    fontSize: 13,
    color: colors.textSubtle,
    marginTop: 6,
    textAlign: 'right',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  optionCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceElevated,
  },
  optionEmoji: { fontSize: 24 },
  optionTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  optionSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.gold },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  btn: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  btnPrimary: { backgroundColor: colors.terracotta },
  btnPrimaryLabel: { fontSize: 16, fontWeight: '700', color: colors.background },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
});
