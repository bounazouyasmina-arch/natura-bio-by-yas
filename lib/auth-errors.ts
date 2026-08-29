/** Traduit les erreurs réseau / Supabase Auth en français lisible. */
export function toFriendlyAuthError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Une erreur est survenue';

  const lower = raw.toLowerCase();

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('load failed') ||
    lower.includes('fetch failed')
  ) {
    return 'Connexion au serveur impossible pour le moment. Réessaie dans une minute. Si ça continue, le service est peut‑être en pause — réessaie un peu plus tard.';
  }

  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Email ou mot de passe incorrect.';
  }

  if (lower.includes('email not confirmed') || lower.includes('not confirmed')) {
    return 'Email pas encore confirmé. Si tu n’as pas reçu de mail, écris à contact@naturabioyas.fr.';
  }

  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'Un compte existe déjà avec cet email. Connecte-toi, ou utilise « Mot de passe oublié ».';
  }

  if (lower.includes('password') && (lower.includes('least') || lower.includes('short') || lower.includes('6'))) {
    return 'Le mot de passe doit faire au moins 6 caractères.';
  }

  if (lower.includes('invalid path') || lower.includes('invalid url')) {
    return 'Configuration serveur incorrecte. Réessaie plus tard ou contacte-nous.';
  }

  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Trop de tentatives. Attends une minute puis réessaie.';
  }

  if (lower.includes('invalid path specified')) {
    return 'Problème de configuration. Réessaie plus tard.';
  }

  // Déjà en français
  if (/[àâäéèêëïîôùûüç]/i.test(raw) || raw.includes('’') || raw.includes("'")) {
    return raw;
  }

  return raw.length < 120 ? raw : 'Une erreur est survenue. Réessaie ou écris à contact@naturabioyas.fr.';
}

export function toFriendlyNetworkError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  const lower = raw.toLowerCase();
  if (
    lower.includes('failed to fetch') ||
    lower.includes('network') ||
    lower.includes('load failed')
  ) {
    return 'Connexion au serveur impossible pour le moment. Réessaie dans une minute.';
  }
  if (raw && /[àâäéèêëïîôùûüç]/i.test(raw)) return raw;
  return fallback;
}
