"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { tryCreateClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { toFriendlyAuthError } from '@/lib/auth-errors';

type Props = {
  user: User | null;
  displayName: string;
  onAuthChange: () => void;
  onDisplayNameChange?: (name: string) => void;
};

type Mode = 'login' | 'signup' | 'forgot';

export default function AuthPanel({
  user,
  displayName,
  onAuthChange,
  onDisplayNameChange,
}: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [pendingConfirmEmail, setPendingConfirmEmail] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setEditName(displayName);
  }, [displayName]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="card rounded-3xl p-6 sm:p-8 space-y-3 border border-amber-200 bg-amber-50/40">
        <h3 className="font-semibold text-lg">Compte &amp; communauté</h3>
        <p className="text-sm text-[#5A6B62]">
          Le service compte est temporairement indisponible. Réessaie un peu plus tard, ou écris à{' '}
          <a href="mailto:contact@naturabioyas.fr" className="underline text-[var(--sage-600)]">
            contact@naturabioyas.fr
          </a>
          .
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

        if (data.user && !data.session) {
          setPendingConfirmEmail(email.trim());
          toast.success('Presque terminé', {
            description:
              'Si la confirmation email est active, ouvre le lien reçu. Sinon reconnecte-toi avec ton mot de passe.',
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
              'Email pas encore confirmé. Écris à contact@naturabioyas.fr si tu n’as pas reçu de mail.'
            );
          }
          throw error;
        }
        toast.success('Connectée !');
        setPendingConfirmEmail(null);
        onAuthChange();
      }
    } catch (err: unknown) {
      toast.error(toFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const mail = email.trim();
    if (!mail) {
      toast.error('Indique ton email');
      return;
    }
    setLoading(true);
    setResetSent(false);
    try {
      const siteOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'https://naturabioyas.fr';
      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: `${siteOrigin}/espace?tab=compte&reset=1`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('Demande envoyée', {
        description:
          'Si un compte existe, tu recevras un email. Sinon écris-nous, on t’aide manuellement.',
      });
    } catch (err: unknown) {
      toast.error(toFriendlyAuthError(err));
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
        description: 'Vérifie ta boîte et les spams. Sinon contact@naturabioyas.fr',
      });
    } catch (err: unknown) {
      toast.error(toFriendlyAuthError(err));
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
      toast.error(toFriendlyAuthError(err));
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

  if (mode === 'forgot') {
    return (
      <div className="card rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-semibold text-lg">Mot de passe oublié</h3>
        <p className="text-sm text-[#5A6B62]">
          Indique l&apos;email de ton compte. On essaie d&apos;envoyer un lien de
          réinitialisation. Si tu ne reçois rien (les mails sont parfois capricieux), écris-nous
          — on t&apos;aide.
        </p>

        {resetSent && (
          <div className="rounded-2xl border border-[#C5A46E]/40 bg-[#FBF7F0] px-4 py-3 text-sm text-[#5A6B62] space-y-2">
            <p>
              Demande enregistrée pour <strong className="text-[#2A3A32]">{email.trim()}</strong>.
              Vérifie ta boîte et les spams.
            </p>
            <a
              href={`mailto:contact@naturabioyas.fr?subject=Mot%20de%20passe%20oubli%C3%A9&body=Bonjour%2C%0A%0AJe%20n%27arrive%20pas%20%C3%A0%20r%C3%A9initialiser%20mon%20mot%20de%20passe.%0AMon%20email%20compte%20%3A%20${encodeURIComponent(email.trim())}%0A%0AMerci%20!`}
              className="inline-block text-[var(--sage-600)] font-medium underline"
            >
              Je n&apos;ai rien reçu — écrire à Yas
            </a>
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ton email"
            className="w-full border border-[#E6EDE9] rounded-xl px-4 py-3 text-sm"
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
          >
            {loading ? '…' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="flex flex-col gap-2 text-sm">
          <button
            type="button"
            className="text-[var(--sage-600)] hover:underline text-left"
            onClick={() => {
              setMode('login');
              setResetSent(false);
            }}
          >
            Retour à la connexion
          </button>
          <a
            href="mailto:contact@naturabioyas.fr?subject=Aide%20mot%20de%20passe"
            className="text-[#5A6B62] hover:underline"
          >
            Contacter Yas directement →
          </a>
        </div>
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
            Un lien a été demandé pour <strong className="text-[#2A3A32]">{pendingConfirmEmail}</strong>.
            Si tu n&apos;as rien reçu, écris à contact@naturabioyas.fr.
          </p>
          <button
            type="button"
            onClick={() => void resendConfirmation()}
            disabled={loading}
            className="text-[var(--sage-600)] font-medium underline disabled:opacity-60"
          >
            Renvoyer l&apos;email
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

      <div className="flex flex-col gap-2 text-sm">
        {mode === 'login' && (
          <button
            type="button"
            className="text-[var(--sage-600)] hover:underline text-left"
            onClick={() => {
              setMode('forgot');
              setPendingConfirmEmail(null);
              setResetSent(false);
            }}
          >
            Mot de passe oublié ?
          </button>
        )}
        <button
          type="button"
          className="text-[var(--sage-600)] hover:underline text-left"
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
    </div>
  );
}
