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

var colors = {
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

var LANGUAGES = [
  { value: 'es', title: 'Espanol', subtitle: 'Hablo y publico en espanol', emoji: 'ES' },
  { value: 'en', title: 'English', subtitle: 'I speak and post in English', emoji: 'EN' },
  { value: 'spanglish', title: 'Spanglish', subtitle: 'Mezclo los dos, como en casa', emoji: 'SPG' },
];

var INDUSTRIES = [
  { value: 'food', emoji: 'Food', labels: { en: 'Food & Beverage', es: 'Comida y Bebida', spanglish: 'Food & Bebida' } },
  { value: 'beauty', emoji: 'Beauty', labels: { en: 'Beauty & Wellness', es: 'Belleza y Bienestar', spanglish: 'Beauty & Wellness' } },
  { value: 'fashion', emoji: 'Fashion', labels: { en: 'Fashion', es: 'Moda', spanglish: 'Fashion' } },
  { value: 'music', emoji: 'Music', labels: { en: 'Music & Arts', es: 'Musica y Arte', spanglish: 'Music y Arte' } },
  { value: 'real_estate', emoji: 'Realty', labels: { en: 'Real Estate', es: 'Bienes Raices', spanglish: 'Real Estate' } },
  { value: 'fitness', emoji: 'Fit', labels: { en: 'Fitness', es: 'Fitness', spanglish: 'Fitness' } },
  { value: 'tech', emoji: 'Tech', labels: { en: 'Tech', es: 'Tecnologia', spanglish: 'Tech' } },
  { value: 'consulting', emoji: 'Biz', labels: { en: 'Consulting', es: 'Consultoria', spanglish: 'Consulting' } },
  { value: 'education', emoji: 'Edu', labels: { en: 'Education', es: 'Educacion', spanglish: 'Education' } },
  { value: 'hospitality', emoji: 'Hosp', labels: { en: 'Hospitality', es: 'Hospitalidad', spanglish: 'Hospitality' } },
  { value: 'creator', emoji: 'Creator', labels: { en: 'Content Creator', es: 'Creador de Contenido', spanglish: 'Content Creator' } },
  { value: 'other', emoji: 'Other', labels: { en: 'Something else', es: 'Otra cosa', spanglish: 'Otra cosa' } },
];

var COPY = {
  en: {
    welcomeTitle: 'Build the brand only you can build.',
    welcomeSubtitle: 'Lazo is your AI co-pilot for Latino entrepreneurs and creators - your voice, your story, your way.',
    welcomeCta: "Let's begin",
    nameTitle: 'What should we call you?',
    nameSubtitle: 'Your name or the name of your brand - whichever you build under.',
    namePlaceholder: 'e.g. Sofia Ramirez or Sofia Studio',
    languageTitle: 'How do you want to show up?',
    languageSubtitle: 'Pick the language you create in. You can change this anytime.',
    industryTitle: 'What do you do?',
    industrySubtitle: 'Pick the space where your work lives.',
    storyTitle: 'Tell us your story.',
    storySubtitle: 'In your own words - where you come from, what you make, who it is for. No script.',
    storyPlaceholder: 'Soy la hija de... / I started this because...',
    continue: 'Continue',
    back: 'Back',
    finishTitle: 'Gracias.',
    finishSubtitle: 'Your Lazo brand voice is being shaped. In the full app, Claude writes your tagline, pillars, and sample posts from here.',
    finishCta: 'Start over',
  },
  es: {
    welcomeTitle: 'Construye la marca que solo tu puedes construir.',
    welcomeSubtitle: 'Lazo es tu copiloto de IA para emprendedores y creadores latinos - tu voz, tu historia, a tu manera.',
    welcomeCta: 'Empecemos',
    nameTitle: 'Como te llamamos?',
    nameSubtitle: 'Tu nombre o el de tu marca - como te conoce la gente.',
    namePlaceholder: 'Ej. Sofia Ramirez o Sofia Studio',
    languageTitle: 'Como quieres aparecer?',
    languageSubtitle: 'Elige el idioma en que creas. Lo puedes cambiar cuando quieras.',
    industryTitle: 'A que te dedicas?',
    industrySubtitle: 'Elige el espacio donde vive tu trabajo.',
    storyTitle: 'Cuentanos tu historia.',
    storySubtitle: 'En tus propias palabras - de donde vienes, que haces, para quien. Sin guion.',
    storyPlaceholder: 'Soy la hija de... / Empece esto porque...',
    continue: 'Continuar',
    back: 'Atras',
    finishTitle: 'Gracias.',
    finishSubtitle: 'Tu voz de marca Lazo se esta formando. En la app completa, Claude escribe tu tagline, pilares y posts de ejemplo desde aqui.',
    finishCta: 'Empezar de nuevo',
  },
  spanglish: {
    welcomeTitle: 'Construye the brand only you can build.',
    welcomeSubtitle: 'Lazo es tu AI co-pilot para emprendedores y creadores latinos - tu voz, tu story, a tu manera.',
    welcomeCta: "Let's empezar",
    nameTitle: 'Como te llamamos?',
    nameSubtitle: 'Your name o el de tu brand - como te conoce la gente.',
    namePlaceholder: 'Ej. Sofia Ramirez o Sofia Studio',
    languageTitle: 'Como quieres show up?',
    languageSubtitle: 'Pick the idioma en que creas. Lo puedes cambiar cuando quieras.',
    industryTitle: 'A que te dedicas?',
    industrySubtitle: 'Pick the space donde vive tu trabajo.',
    storyTitle: 'Cuentanos tu story.',
    storySubtitle: 'In your own words - de donde vienes, que haces, para quien. No script.',
    storyPlaceholder: 'Soy la hija de... / I started this because...',
    continue: 'Continuar',
    back: 'Back',
    finishTitle: 'Gracias.',
    finishSubtitle: 'Tu Lazo brand voice se esta formando. En la full app, Claude writes tu tagline, pilares y sample posts desde aqui.',
    finishCta: 'Empezar otra vez',
  },
};

var STEPS = ['welcome', 'name', 'language', 'industry', 'story', 'done'];

export default function App() {
  var stepState = useState('welcome');
  var step = stepState[0];
  var setStep = stepState[1];

  var nameState = useState('');
  var name = nameState[0];
  var setName = nameState[1];

  var langState = useState(null);
  var language = langState[0];
  var setLanguage = langState[1];

  var industryState = useState(null);
  var industry = industryState[0];
  var setIndustry = industryState[1];

  var storyState = useState('');
  var story = storyState[0];
  var setStory = storyState[1];

  var lang = language || 'en';
  var copy = COPY[lang];

  var progress = useMemo(function () {
    var idx = STEPS.indexOf(step);
    if (idx <= 0) return 0;
    if (idx >= STEPS.length - 1) return 1;
    return (idx - 1) / 4;
  }, [step]);

  function goNext() {
    var idx = STEPS.indexOf(step);
    setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  }
  function goBack() {
    var idx = STEPS.indexOf(step);
    setStep(STEPS[Math.max(idx - 1, 0)]);
  }
  function reset() {
    setStep('welcome');
    setName('');
    setLanguage(null);
    setIndustry(null);
    setStory('');
  }

  var showTopBar = step !== 'welcome' && step !== 'done';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {showTopBar ? (
            <View style={styles.topBar}>
              <Pressable onPress={goBack} hitSlop={12} style={styles.backBtn}>
                <Text style={styles.backText}>{'< ' + copy.back}</Text>
              </Pressable>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: (progress * 100) + '%' }]} />
              </View>
            </View>
          ) : null}

          {step === 'welcome' ? (
            <Welcome copy={copy} onContinue={goNext} />
          ) : null}
          {step === 'name' ? (
            <NameStep copy={copy} value={name} setValue={setName} onContinue={goNext} />
          ) : null}
          {step === 'language' ? (
            <LanguageStep selected={language} setSelected={setLanguage} onContinue={goNext} copy={copy} />
          ) : null}
          {step === 'industry' ? (
            <IndustryStep lang={lang} selected={industry} setSelected={setIndustry} onContinue={goNext} copy={copy} />
          ) : null}
          {step === 'story' ? (
            <StoryStep copy={copy} value={story} setValue={setStory} onContinue={goNext} />
          ) : null}
          {step === 'done' ? (
            <Done copy={copy} name={name} onReset={reset} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Welcome(props) {
  return (
    <View style={styles.flex}>
      <View style={styles.hero}>
        <View style={styles.monogramWrap}>
          <View style={styles.monogram}>
            <Text style={styles.monogramLetter}>L</Text>
          </View>
          <Text style={styles.mark}>LAZO</Text>
        </View>
        <Text style={styles.displayTitle}>{props.copy.welcomeTitle}</Text>
        <Text style={styles.bodyMuted}>{props.copy.welcomeSubtitle}</Text>
      </View>
      <View>
        <PrimaryButton label={props.copy.welcomeCta} onPress={props.onContinue} />
      </View>
    </View>
  );
}

function NameStep(props) {
  var canContinue = props.value.trim().length >= 2;
  function onSubmit() {
    if (canContinue) props.onContinue();
  }
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{props.copy.nameTitle}</Text>
        <Text style={styles.bodyMuted}>{props.copy.nameSubtitle}</Text>
      </View>
      <View style={styles.flex}>
        <Field
          value={props.value}
          onChangeText={props.setValue}
          placeholder={props.copy.namePlaceholder}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={60}
          returnKeyType="next"
          onSubmitEditing={onSubmit}
        />
      </View>
      <PrimaryButton label={props.copy.continue} onPress={props.onContinue} disabled={!canContinue} />
    </View>
  );
}

function LanguageStep(props) {
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{props.copy.languageTitle}</Text>
        <Text style={styles.bodyMuted}>{props.copy.languageSubtitle}</Text>
      </View>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map(function (opt) {
          return (
            <OptionCard
              key={opt.value}
              title={opt.title}
              subtitle={opt.subtitle}
              emoji={opt.emoji}
              selected={props.selected === opt.value}
              onPress={function () { props.setSelected(opt.value); }}
            />
          );
        })}
      </ScrollView>
      <PrimaryButton label={props.copy.continue} onPress={props.onContinue} disabled={!props.selected} />
    </View>
  );
}

function IndustryStep(props) {
  return (
    <View style={styles.flex}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{props.copy.industryTitle}</Text>
        <Text style={styles.bodyMuted}>{props.copy.industrySubtitle}</Text>
      </View>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {INDUSTRIES.map(function (opt) {
          return (
            <OptionCard
              key={opt.value}
              title={opt.labels[props.lang]}
              emoji={opt.emoji}
              selected={props.selected === opt.value}
              onPress={function () { props.setSelected(opt.value); }}
            />
          );
        })}
      </ScrollView>
      <PrimaryButton label={props.copy.continue} onPress={props.onContinue} disabled={!props.selected} />
    </View>
  );
}

function StoryStep(props) {
  var canContinue = props.value.trim().length >= 40;
  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{props.copy.storyTitle}</Text>
          <Text style={styles.bodyMuted}>{props.copy.storySubtitle}</Text>
        </View>
        <Field
          value={props.value}
          onChangeText={props.setValue}
          placeholder={props.copy.storyPlaceholder}
          multiline={true}
          maxLength={1200}
          autoCapitalize="sentences"
          showCount={true}
        />
      </ScrollView>
      <PrimaryButton label={props.copy.continue} onPress={props.onContinue} disabled={!canContinue} />
    </View>
  );
}

function Done(props) {
  var displayName = (props.name || '').toUpperCase() || 'TU MARCA';
  return (
    <View style={styles.flex}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{'LAZO . ' + displayName}</Text>
        <Text style={styles.displayTitle}>{props.copy.finishTitle}</Text>
        <Text style={styles.bodyMuted}>{props.copy.finishSubtitle}</Text>
      </View>
      <GhostButton label={props.copy.finishCta} onPress={props.onReset} />
    </View>
  );
}

function OptionCard(props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={function (state) {
        return [
          styles.optionCard,
          props.selected ? styles.optionCardSelected : null,
          state.pressed ? { opacity: 0.85 } : null,
        ];
      }}
    >
      {props.emoji ? (
        <View style={styles.emojiPill}>
          <Text style={styles.emojiPillText}>{props.emoji}</Text>
        </View>
      ) : null}
      <View style={styles.optionTextCol}>
        <Text style={styles.optionTitle}>{props.title}</Text>
        {props.subtitle ? (
          <Text style={styles.optionSubtitle}>{props.subtitle}</Text>
        ) : null}
      </View>
      <View style={[styles.radio, props.selected ? styles.radioSelected : null]}>
        {props.selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function Field(props) {
  var focusedState = useState(false);
  var focused = focusedState[0];
  var setFocused = focusedState[1];
  var showCount = props.showCount === true;
  var hasMax = typeof props.maxLength === 'number';
  return (
    <View style={{ marginTop: 16 }}>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        autoCapitalize={props.autoCapitalize}
        autoCorrect={props.autoCorrect}
        maxLength={props.maxLength}
        multiline={props.multiline}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
        onFocus={function () { setFocused(true); }}
        onBlur={function () { setFocused(false); }}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.terracotta}
        style={[
          styles.input,
          props.multiline ? styles.inputMultiline : null,
          focused ? styles.inputFocused : null,
        ]}
      />
      {showCount && hasMax ? (
        <Text style={styles.count}>
          {props.value.length + '/' + props.maxLength}
        </Text>
      ) : null}
    </View>
  );
}

function PrimaryButton(props) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={function (state) {
        return [
          styles.btn,
          styles.btnPrimary,
          state.pressed && !props.disabled ? { backgroundColor: colors.terracottaPressed } : null,
          props.disabled ? { opacity: 0.4 } : null,
        ];
      }}
    >
      <Text style={styles.btnPrimaryLabel}>{props.label}</Text>
    </Pressable>
  );
}

function GhostButton(props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={function (state) {
        return [
          styles.btn,
          styles.btnGhost,
          state.pressed ? { backgroundColor: colors.surface } : null,
        ];
      }}
    >
      <Text style={styles.btnGhostLabel}>{props.label}</Text>
    </Pressable>
  );
}

var styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 8,
    marginRight: 12,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
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
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  monogramWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: colors.terracotta,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  monogramLetter: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
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
  headerBlock: {
    marginBottom: 8,
  },
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
  inputMultiline: {
    minHeight: 180,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.terracotta,
  },
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
  },
  optionCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceElevated,
  },
  emojiPill: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emojiPillText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: colors.gold,
  },
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
  btnPrimary: {
    backgroundColor: colors.terracotta,
  },
  btnPrimaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
