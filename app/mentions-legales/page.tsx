import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Mentions légales | natura'bio by yas",
  description: 'Mentions légales du site naturabioyas.fr',
};

export default function MentionsLegales() {
  return (
    <LegalPageShell title="Mentions légales">
      <p>
        <strong className="text-[#2A3A32]">Éditrice :</strong> Yasmine Bounazou — projet{' '}
        <em>natura&apos;bio by yas</em>
      </p>
      <p>
        <strong className="text-[#2A3A32]">Adresse :</strong> 35 rue Léonard de Vinci, 25200
        Bethoncourt, France
      </p>
      <p>
        <strong className="text-[#2A3A32]">Site :</strong>{' '}
        <a href="https://naturabioyas.fr" className="underline text-[var(--sage-600)]">
          https://naturabioyas.fr
        </a>
      </p>
      <p>
        <strong className="text-[#2A3A32]">Contact :</strong>{' '}
        <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
          contact@naturabioyas.fr
        </a>
      </p>
      <p>
        <strong className="text-[#2A3A32]">Hébergement :</strong> Vercel Inc. — vercel.com
      </p>
      <p>
        Ce site propose des <strong className="text-[#2A3A32]">ressources éducatives</strong> sur la
        santé au naturel (chat IA, ebook, coaching). Il ne constitue pas un exercice de la médecine.
        Voir l&apos;
        <Link href="/avertissement-sante" className="underline text-[var(--sage-600)]">
          avertissement santé
        </Link>
        .
      </p>
      <p>
        <Link href="/confidentialite" className="underline text-[var(--sage-600)]">
          Politique de confidentialité
        </Link>
        {' · '}
        <Link href="/cgv" className="underline text-[var(--sage-600)]">
          CGV
        </Link>
      </p>
    </LegalPageShell>
  );
}
