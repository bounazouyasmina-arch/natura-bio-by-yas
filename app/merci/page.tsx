"use client";

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, BookOpen, MessageCircle, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function MerciContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const error = searchParams.get('error');
  const isEbook = plan === 'ebook';
  const isCoaching = plan === 'coaching';

  useEffect(() => {
    if (error || (!isEbook && !isCoaching)) return;

    const timer = setTimeout(() => {
      window.location.href = `/espace?unlocked=${plan}&from=beacons&welcome=1`;
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, isEbook, isCoaching, plan]);

  if (error === 'token') {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
        <div className="card max-w-lg w-full rounded-3xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-[#C5A46E] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Lien d&apos;accès invalide</h1>
          <p className="text-[#5A6B62] mb-6">
            Ce lien n&apos;est pas reconnu. Vérifie l&apos;email de confirmation Beacons ou contacte-moi si tu as bien payé.
          </p>
          <Link href="/" className="btn-secondary inline-block px-6 py-3 rounded-2xl text-sm">
            Retour au site
          </Link>
        </div>
      </div>
    );
  }

  if (!isEbook && !isCoaching) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
        <div className="card max-w-lg w-full rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Merci pour ton achat</h1>
          <p className="text-[#5A6B62] mb-6">
            Utilise le lien reçu par email après ton achat Beacons pour débloquer ton espace membres.
          </p>
          <Link
            href="/espace"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold"
          >
            Aller à l&apos;espace gratuit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
      <div className="card max-w-xl w-full rounded-3xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0EC] text-3xl mb-4">
            🎉
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Merci pour ton achat !</h1>
          <p className="text-[#5A6B62]">
            {isCoaching
              ? 'Ton accompagnement coaching est activé. Bienvenue dans l\'espace premium.'
              : 'Ton ebook Hormones Sereine et ton accès illimité au chat IA sont activés.'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F7F5]">
            <Check className="h-5 w-5 text-[var(--sage-600)] mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Chat IA illimité</div>
              <div className="text-sm text-[#5A6B62]">9 expertes disponibles 24h/24</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F7F5]">
            <MessageCircle className="h-5 w-5 text-[var(--sage-600)] mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Forum communauté</div>
              <div className="text-sm text-[#5A6B62]">Pose tes questions et partage tes expériences</div>
            </div>
          </div>
          {isEbook && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F7F5]">
              <BookOpen className="h-5 w-5 text-[var(--sage-600)] mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Ebook Hormones Sereine (PDF)</div>
                <div className="text-sm text-[#5A6B62]">Cycle, SOPK, thyroïde, ménopause… — téléchargeable dans ton espace</div>
              </div>
            </div>
          )}
          {isCoaching && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F7F5] border border-[#C5A46E]/30">
              <div className="font-medium text-[#C5A46E]">Coaching 4 semaines + protocoles personnalisés + WhatsApp</div>
            </div>
          )}
        </div>

        <Link
          href={`/espace?unlocked=${plan}&from=beacons&welcome=1`}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold"
        >
          Accéder à mon espace maintenant <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-center text-xs text-[#5A6B62] mt-4">
          Redirection automatique dans quelques secondes…
        </p>
        <p className="text-center text-xs text-[#5A6B62] mt-2">
          Astuce : dans l&apos;espace, crée un compte (onglet Compte) pour retrouver ton accès sur tous tes appareils.
        </p>
      </div>
    </div>
  );
}

export default function MerciPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement…</div>}>
      <MerciContent />
    </Suspense>
  );
}