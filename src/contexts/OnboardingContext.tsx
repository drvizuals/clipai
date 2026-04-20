import React, { createContext, useContext, useMemo, useState } from 'react';
import type { BrandVoice, OnboardingDraft } from '@/types';

interface OnboardingContextValue {
  draft: OnboardingDraft;
  brandVoice: BrandVoice | null;
  setField: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  setBrandVoice: (voice: BrandVoice | null) => void;
  reset: () => void;
}

const initialDraft: OnboardingDraft = {
  name: '',
  language: null,
  industry: null,
  story: '',
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);
  const [brandVoice, setBrandVoice] = useState<BrandVoice | null>(null);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      brandVoice,
      setField: (key, value) => setDraft((prev) => ({ ...prev, [key]: value })),
      setBrandVoice,
      reset: () => {
        setDraft(initialDraft);
        setBrandVoice(null);
      },
    }),
    [draft, brandVoice],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
