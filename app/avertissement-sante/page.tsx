import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Avertissement santé | natura'bio by yas",
  description:
    'Les contenus natura’bio by yas sont éducatifs et ne remplacent pas un avis médical.',
};

export default function AvertissementSante() {
  return (
    <LegalPageShell title="Avertissement santé important">
      <p className="font-medium text-[#2A3A32]">
        natura&apos;bio by yas fournit des informations éducatives et des pistes issues de traditions
        naturelles (aromathérapie, naturopathie, médecine prophétique, médecine chinoise, etc.).
      </p>
      <p>
        Ces contenus <strong className="text-[#2A3A32]">ne remplacent en aucun cas</strong> un
        diagnostic médical, un traitement ou un suivi par un médecin ou tout autre professionnel de
        santé qualifié.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Ne jamais arrêter un traitement médical sans avis de ton médecin.</li>
        <li>
          Les huiles essentielles, plantes et protocoles peuvent avoir des contre-indications et
          interactions.
        </li>
        <li>En cas de symptômes importants ou de détresse, consulte rapidement un professionnel.</li>
      </ul>
      <p>
        En utilisant ce site et l&apos;IA, tu reconnais que tu es responsable de tes choix de santé.
      </p>
      <p>
        <Link href="/" className="underline text-[var(--sage-600)]">
          Retour à l&apos;accueil
        </Link>
      </p>
    </LegalPageShell>
  );
}
