import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { t } from '@/constants/copy';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { generateBrandVoice } from '@/lib/brandVoice';
import { colors, spacing, typography } from '@/theme';

export default function StoryScreen() {
  const router = useRouter();
  const { draft, setField, setBrandVoice } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const canContinue = draft.story.trim().length >= 40;

  async function onContinue() {
    if (!draft.language || !draft.industry) return;
    setLoading(true);
    try {
      const voice = await generateBrandVoice({
        name: draft.name,
        language: draft.language,
        industry: draft.industry,
        story: draft.story,
      });
      setBrandVoice(voice);
      router.push('/onboarding/brand-voice');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      Alert.alert('Lazo', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ProgressBar step={4} total={4} />
          <Text style={styles.title}>{t('storyTitle', draft.language)}</Text>
          <Text style={styles.subtitle}>{t('storySubtitle', draft.language)}</Text>
        </View>
        <TextField
          value={draft.story}
          onChangeText={(value) => setField('story', value)}
          placeholder={t('storyPlaceholder', draft.language)}
          multiline
          maxLength={1200}
          autoCapitalize="sentences"
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label={loading ? t('generating', draft.language) : t('continue', draft.language)}
          onPress={onContinue}
          disabled={!canContinue}
          loading={loading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  header: { gap: spacing.md, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.textMuted },
  footer: { gap: spacing.sm, paddingTop: spacing.md },
});
