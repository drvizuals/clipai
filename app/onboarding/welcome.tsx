import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { t } from '@/constants/copy';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.mark}>LAZO</Text>
        <Text style={styles.title}>{t('welcomeTitle', 'en')}</Text>
        <Text style={styles.subtitle}>{t('welcomeSubtitle', 'en')}</Text>
      </View>
      <View>
        <Button label={t('welcomeCta', 'en')} onPress={() => router.push('/onboarding/name')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: spacing.md },
  mark: {
    fontSize: 13,
    letterSpacing: 6,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  title: { ...typography.display, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
});
