import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Confidentialité (RGPD) | natura'bio by yas",
  description: 'Politique de confidentialité et protection des données — naturabioyas.fr',
};

export default function Confidentialite() {
  return (
    <LegalPageShell title="Politique de confidentialité (RGPD)">
      <p>
        Responsable du traitement : <strong className="text-[#2A3A32]">Yasmine Bounazou</strong> —
        35 rue Léonard de Vinci, 25200 Bethoncourt — contact :{' '}
        <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
          contact@naturabioyas.fr
        </a>
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Données collectées</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Compte membre : email, mot de passe (chiffré via Supabase Auth), pseudo forum</li>
        <li>Accès premium : plan (ebook / coaching) lié au profil après achat Beacons</li>
        <li>Bilan / emails transactionnels : adresse email que tu fournis</li>
        <li>Mesure d&apos;audience : Vercel Analytics (statistiques de visite)</li>
        <li>Conversations chat IA : traitées pour te répondre (prestataire xAI)</li>
      </ul>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Finalités</h2>
      <p>
        Fournir l&apos;espace membres, le forum, les accès après achat, répondre à tes messages, et
        améliorer le site. Tes données ne sont <strong className="text-[#2A3A32]">jamais vendues</strong>.
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Sous-traitants</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Supabase (auth &amp; base de données)</li>
        <li>Vercel (hébergement &amp; analytics)</li>
        <li>xAI (réponses du chat IA)</li>
        <li>Beacons (paiement / livraison des offres)</li>
        <li>Resend (envoi d&apos;emails, le cas échéant)</li>
      </ul>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Tes droits</h2>
      <p>
        Accès, rectification, suppression, opposition : écris à{' '}
        <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
          contact@naturabioyas.fr
        </a>
        . Tu peux aussi te déconnecter et demander la suppression de ton compte.
      </p>

      <p>
        Voir aussi :{' '}
        <Link href="/mentions-legales" className="underline text-[var(--sage-600)]">
          mentions légales
        </Link>
        {' · '}
        <Link href="/cgv" className="underline text-[var(--sage-600)]">
          CGV
        </Link>
      </p>
    </LegalPageShell>
  );
}
