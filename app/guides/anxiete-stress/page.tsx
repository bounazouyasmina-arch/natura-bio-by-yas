import type { Metadata } from 'next';
import { BonusGuide } from '@/components/BonusGuide';

export const metadata: Metadata = {
  title: "Guide Anxiété & stress | natura'bio by yas",
  description:
    "Guide offert avec l'accès illimité : anxiété, stress, et si ton corps avait sa part d'explication.",
};

export default function GuideAnxieteStress() {
  return <BonusGuide variant="anxiete" />;
}
