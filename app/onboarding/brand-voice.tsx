import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { t } from '@/constants/copy';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { generateBrandVoice } from '@/lib/brandVoice';
import { colors, radii, spacing, typography } from '@/theme';

export default function BrandVoiceScreen() {
  const router = useRouter();
  const { draft, brandVoice, setBrandVoice, reset } = useOnboarding();
  const [regenerating, setRegenerating] = useState(false);

  if (!brandVoice) {
    return (
      <Screen>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>{t('generating', draft.language)}</Text>
        </View>
      </Screen>
    );
  }

  async function onRegenerate() {
    if (!draft.language || !draft.industry) return;
    setRegenerating(true);
    try {
      const voice = await generateBrandVoice({
        name: draft.name,
        language: draft.language,
        industry: draft.industry,
        story: draft.story,
      });
      setBrandVoice(voice);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      Alert.alert('Lazo', message);
    } finally {
      setRegenerating(false);
    }
  }

  function onFinish() {
    // TODO(next): persist the profile + brand voice to Supabase once auth is wired.
    reset();
    router.replace('/');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>LAZO · BRAND VOICE</Text>
        <Text style={styles.title}>{t('brandVoiceTitle', draft.language)}</Text>
        <Text style={styles.subtitle}>{t('brandVoiceSubtitle', draft.language)}</Text>

        <View style={styles.taglineCard}>
          <Text style={styles.tagline}>&ldquo;{brandVoice.tagline}&rdquo;</Text>
          <Text style={styles.voiceDescription}>{brandVoice.voice_description}</Text>
        </View>

        <Text style={styles.sectionHeading}>{t('pillarsHeading', draft.language)}</Text>
        <View style={styles.pillarRow}>
          {brandVoice.pillars.map((pillar, i) => (
            <View key={`${pillar}-${i}`} style={styles.pillarChip}>
              <Text style={styles.pillarText}>{pillar}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeading}>{t('samplesHeading', draft.language)}</Text>
        {brandVoice.sample_posts.map((post, i) => (
          <View key={i} style={styles.sampleCard}>
            <Text style={styles.sampleText}>{post}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          variant="ghost"
          label={t('tryAgain', draft.language)}
          onPress={onRegenerate}
          loading={regenerating}
          disabled={regenerating}
        />
        <Button label={t('finish', draft.language)} onPress={onFinish} disabled={regenerating} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl, gap: spacing.md },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { ...typography.heading, color: colors.textMuted },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 4,
    color: colors.primary,
    fontWeight: '700',
  },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  taglineCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  tagline: { ...typography.title, color: colors.accent, fontStyle: 'italic' },
  voiceDescription: { ...typography.body, color: colors.text, lineHeight: 22 },
  sectionHeading: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.md,
  },
  pillarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pillarChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillarText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  sampleCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sampleText: { ...typography.body, color: colors.text, lineHeight: 22 },
  footer: { gap: spacing.sm, paddingTop: spacing.md },
});
