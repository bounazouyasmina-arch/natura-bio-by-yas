"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { tryCreateClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Props = {
  user: User | null;
  displayName: string;
  onAuthChange: () => void;
  onDisplayNameChange?: (name: string) => void;
};

export default function AuthPanel({
  user,
  displayName,
  onAuthChange,
  onDisplayNameChange,
}: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [pendingConfirmEmail, setPendingConfirmEmail] = useState<string | null>(null);

  useEffect(() => {
    setEditName(displayName);
  }, [displayName]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="card rounded-3xl p-6 sm:p-8 space-y-3 border border-amber-200 bg-amber-50/40">
        <h3 className="font-semibold text-lg">Compte &amp; communauté</h3>
        <p className="text-sm text-[#5A6B62]">
          Supabase n&apos;est pas encore branché. Ajoute{' '}
          <code className="text-xs bg-white px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
          <code className="text-xs bg-white px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans
          Vercel / <code className="text-xs">.env.local</code>, puis exécute le SQL dans{' '}
          <code className="text-xs">supabase/schema.sql</code>.
        </p>
      </div>
    );
  }

  const supabase = tryCreateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setPendingConfirmEmail(null);
    try {
      if (mode === 'signup') {
        const siteOrigin =
          typeof window !== 'undefined' ? window.location.origin : 'https://naturabioyas.fr';
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() || email.split('@')[0] },
            emailRedirectTo: `${siteOrigin}/espace?tab=compte&confirmed=1`,
          },
        });
        if (error) throw error;

        // Session absente = confirmation email requise
        if (data.user && !data.session) {
          setPendingConfirmEmail(email.trim());
          toast.success('Email de confirmation envoyé', {
            description: 'Ouvre ta boîte mail (et les spams), puis clique sur le lien.',
          });
          setMode('login');
          return;
        }

        toast.success('Compte créé et connectée !');
        onAuthChange();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          const lower = error.message.toLowerCase();
          if (lower.includes('email not confirmed') || lower.includes('not confirmed')) {
            setPendingConfirmEmail(email.trim());
            throw new Error(
              'Email pas encore confirmé. Ouvre le lien reçu par mail, ou renvoie un email ci-dessous.'
            );
          }
          throw error;
        }
        toast.success('Connectée !');
        setPendingConfirmEmail(null);
        onAuthChange();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!supabase || !pendingConfirmEmail) return;
    setLoading(true);
    try {
      const siteOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'https://naturabioyas.fr';
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingConfirmEmail,
        options: {
          emailRedirectTo: `${siteOrigin}/espace?tab=compte&confirmed=1`,
        },
      });
      if (error) throw error;
      toast.success('Email renvoyé', {
        description: 'Vérifie ta boîte de réception et les spams.',
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Impossible de renvoyer l’email');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast.success('Déconnectée');
    onAuthChange();
  };

  const saveDisplayName = async () => {
    if (!supabase || !user) return;
    const next = editName.trim();
    if (!next) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: next, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      onDisplayNameChange?.(next);
      toast.success('Pseudo mis à jour');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    const helloName = (editName || displayName || user.email?.split('@')[0] || '').trim();
    return (
      <div className="card rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[2px] text-[var(--sage-600)] font-medium mb-1">
            Mon profil
          </p>
          <h3 className="font-semibold text-xl sm:text-2xl tracking-tight text-[#2A3A32]">
            Bonjour{helloName ? ` ${helloName}` : ''}
          </h3>
          <p className="text-sm text-[#5A6B62] mt-1">
            Connectée avec <strong className="text-[#2A3A32]">{user.email}</strong>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pseudo sur le forum</label>
          <div className="flex gap-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 border border-[#E6EDE9] rounded-xl px-4 py-2 text-sm"
              placeholder="Ton prénom ou pseudo"
            />
            <button
              type="button"
              onClick={saveDisplayName}
              disabled={loading}
              className="btn-secondary px-4 py-2 rounded-xl text-sm disabled:opacity-60"
            >
              Sauver
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm text-[#5A6B62] underline hover:text-[#2A3A32]"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="card rounded-3xl p-6 sm:p-8 space-y-4">
      <h3 className="font-semibold text-lg">
        {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
      </h3>
      <p className="text-sm text-[#5A6B62]">
        Compte gratuit pour publier sur le forum et retrouver ton accès premium sur tous tes
        appareils. Tu es connectée tout de suite après l&apos;inscription.
      </p>

      {pendingConfirmEmail && (
        <div className="rounded-2xl border border-[#C5A46E]/40 bg-[#FBF7F0] px-4 py-3 text-sm text-[#5A6B62] space-y-2">
          <p>
            Un lien a été envoyé à <strong className="text-[#2A3A32]">{pendingConfirmEmail}</strong>.
            Ouvre-le pour activer ton compte (regarde aussi les spams).
          </p>
          <button
            type="button"
            onClick={() => void resendConfirmation()}
            disabled={loading}
            className="text-[var(--sage-600)] font-medium underline disabled:opacity-60"
          >
            Renvoyer l&apos;email de confirmation
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom ou pseudo"
            className="w-full border border-[#E6EDE9] rounded-xl px-4 py-3 text-sm"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-[#E6EDE9] rounded-xl px-4 py-3 text-sm"
          autoComplete="email"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe (6 caractères min.)"
          className="w-full border border-[#E6EDE9] rounded-xl px-4 py-3 text-sm"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
        >
          {loading
            ? '…'
            : mode === 'login'
              ? 'Se connecter'
              : 'Créer mon compte'}
        </button>
      </form>
      <button
        type="button"
        className="text-sm text-[var(--sage-600)] hover:underline"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          setPendingConfirmEmail(null);
        }}
      >
        {mode === 'login'
          ? 'Pas encore de compte ? S’inscrire'
          : 'Déjà un compte ? Se connecter'}
      </button>
    </div>
  );
}
