import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { LANGUAGES } from '@/constants/industries';
import { t } from '@/constants/copy';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { colors, spacing, typography } from '@/theme';

export default function LanguageScreen() {
  const router = useRouter();
  const { draft, setField } = useOnboarding();

  return (
    <Screen>
      <View style={styles.header}>
        <ProgressBar step={2} total={4} />
        <Text style={styles.title}>{t('languageTitle', draft.language)}</Text>
        <Text style={styles.subtitle}>{t('languageSubtitle', draft.language)}</Text>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((opt) => (
          <OptionCard
            key={opt.value}
            title={opt.title}
            subtitle={opt.subtitle}
            emoji={opt.emoji}
            selected={draft.language === opt.value}
            onPress={() => setField('language', opt.value)}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label={t('continue', draft.language)}
          onPress={() => router.push('/onboarding/industry')}
          disabled={!draft.language}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.lg },
  title: { ...typography.title, color: colors.text, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.textMuted },
  body: { flex: 1 },
  footer: { gap: spacing.sm },
});
