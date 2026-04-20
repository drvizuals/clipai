import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { t } from '@/constants/copy';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { colors, spacing, typography } from '@/theme';

export default function NameScreen() {
  const router = useRouter();
  const { draft, setField } = useOnboarding();

  const canContinue = draft.name.trim().length >= 2;

  return (
    <Screen>
      <View style={styles.header}>
        <ProgressBar step={1} total={4} />
        <Text style={styles.title}>{t('nameTitle', draft.language)}</Text>
        <Text style={styles.subtitle}>{t('nameSubtitle', draft.language)}</Text>
      </View>
      <View style={styles.body}>
        <TextField
          value={draft.name}
          onChangeText={(value) => setField('name', value)}
          placeholder={t('namePlaceholder', draft.language)}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={60}
          returnKeyType="next"
          onSubmitEditing={() => canContinue && router.push('/onboarding/language')}
        />
      </View>
      <View style={styles.footer}>
        <Button
          label={t('continue', draft.language)}
          onPress={() => router.push('/onboarding/language')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md },
  title: { ...typography.title, color: colors.text, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.textMuted },
  body: { flex: 1 },
  footer: { gap: spacing.sm },
});
