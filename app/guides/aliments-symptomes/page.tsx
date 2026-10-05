import type { Metadata } from 'next';
import { BonusGuide } from '@/components/BonusGuide';

export const metadata: Metadata = {
  title: "Guide Aliments et symptômes | natura'bio by yas",
  description:
    "Guide offert avec l'accès illimité : ces aliments du quotidien qui pourraient entretenir tes symptômes.",
};

export default function GuideAlimentsSymptomes() {
  return <BonusGuide variant="aliments" />;
}
