import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
}

export function Button({ label, onPress, disabled, loading, variant = 'primary', style }: ButtonProps) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        pressed && !disabled && (isGhost ? styles.ghostPressed : styles.primaryPressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.text : colors.background} />
      ) : (
        <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  ghostPressed: { backgroundColor: colors.surface },
  disabled: { opacity: 0.4 },
  label: { ...typography.body, color: colors.background, fontWeight: '700' },
  ghostLabel: { color: colors.text },
});
