import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Conditions générales de vente | natura'bio by yas",
  description: 'CGV — ebook Hormones Sereine, coaching 4 semaines, appel découverte',
};

export default function CGV() {
  return (
    <LegalPageShell title="Conditions générales de vente">
      <p>
        Les offres sont proposées via <strong className="text-[#2A3A32]">Beacons</strong> et/ou le site{' '}
        <strong className="text-[#2A3A32]">naturabioyas.fr</strong>. Contact :{' '}
        <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
          contact@naturabioyas.fr
        </a>
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">
        Ebook Hormones Sereine — 9,99 €
      </h2>
      <p>
        Produit numérique (équilibre hormonal : cycle, SOPK, endométriose, thyroïde, pré-ménopause,
        ménopause) avec accès illimité au chat IA et au forum selon les conditions du site. Livraison
        / accès après paiement (lien ou code). Conformément au droit européen, pas de droit de
        rétractation pour un contenu numérique fourni immédiatement après accord.
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">
        Coaching 4 semaines — 149 €
      </h2>
      <p>
        Prestation d&apos;accompagnement personnalisé (visioconférence / suivi, protocole, échanges).
        Annulation possible jusqu&apos;à 48 h avant le premier rendez-vous avec remboursement intégral.
        Au-delà, aucun remboursement sauf accord exceptionnel.
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Appel découverte gratuit</h2>
      <p>
        Entretien sans engagement pour voir si le coaching convient. Réservation via Beacons. Aucun
        paiement requis pour cet appel.
      </p>

      <h2 className="text-lg font-semibold text-[#2A3A32] pt-2">Santé</h2>
      <p>
        Les contenus et l&apos;IA sont éducatifs et ne remplacent pas un avis médical. Voir l&apos;
        <Link href="/avertissement-sante" className="underline text-[var(--sage-600)]">
          avertissement santé
        </Link>
        .
      </p>

      <p>
        En cas de problème d&apos;accès ou de paiement : contacte-moi directement à{' '}
        <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
          contact@naturabioyas.fr
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
