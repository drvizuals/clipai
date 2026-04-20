import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helper?: string;
  multiline?: boolean;
  maxLength?: number;
  value: string;
}

export function TextField({ label, helper, multiline, maxLength, value, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const showCount = typeof maxLength === 'number';
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={colors.textSubtle}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.inputFocused,
        ]}
      />
      <View style={styles.footerRow}>
        {helper ? <Text style={styles.helper}>{helper}</Text> : <View />}
        {showCount ? (
          <Text style={styles.count}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFocused: { borderColor: colors.primary },
  multiline: { minHeight: 160, textAlignVertical: 'top' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  helper: { ...typography.caption, color: colors.textSubtle },
  count: { ...typography.caption, color: colors.textSubtle },
});
