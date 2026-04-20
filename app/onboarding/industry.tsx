import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { INDUSTRIES } from '@/constants/industries';
import { t } from '@/constants/copy';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { colors, spacing, typography } from '@/theme';

export default function IndustryScreen() {
  const router = useRouter();
  const { draft, setField } = useOnboarding();
  const lang = draft.language ?? 'en';

  return (
    <Screen>
      <View style={styles.header}>
        <ProgressBar step={3} total={4} />
        <Text style={styles.title}>{t('industryTitle', draft.language)}</Text>
        <Text style={styles.subtitle}>{t('industrySubtitle', draft.language)}</Text>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {INDUSTRIES.map((opt) => (
          <OptionCard
            key={opt.value}
            title={opt.labels[lang]}
            emoji={opt.emoji}
            selected={draft.industry === opt.value}
            onPress={() => setField('industry', opt.value)}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label={t('continue', draft.language)}
          onPress={() => router.push('/onboarding/story')}
          disabled={!draft.industry}
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
