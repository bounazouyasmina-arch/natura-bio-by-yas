import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, type AccessTier } from '@/lib/member-access';
import { isValidUnlockToken } from '@/lib/access-config';
import { grantAccessToProfile } from '@/lib/access-profile';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  let body: { token?: string; plan?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const token = (body.token || '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
  }

  const candidates: AccessTier[] =
    body.plan === 'ebook' || body.plan === 'coaching'
      ? [body.plan]
      : ['ebook', 'coaching'];

  let matched: AccessTier | null = null;
  for (const plan of candidates) {
    if (isValidUnlockToken(plan, token)) {
      matched = plan;
      break;
    }
  }

  if (!matched) {
    return NextResponse.json(
      { error: 'Code invalide. Vérifie le lien reçu après ton achat Beacons.' },
      { status: 403 }
    );
  }

  let linked = false;
  let finalPlan: AccessTier = matched;
  let linkMessage = '';

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const result = await grantAccessToProfile(user.id, matched, {
          userClient: supabase,
        });
        if (result.ok && result.linked) {
          linked = true;
          finalPlan = result.tier;
          linkMessage =
            ' L’accès est aussi enregistré sur ton compte (tous tes appareils).';
        } else {
          linkMessage = result.error
            ? ` Attention : non enregistré sur le compte (${result.error}).`
            : ' Attention : non enregistré sur le compte. Réessaie connectée.';
        }
      } else {
        linkMessage =
          ' Tu n’étais pas connectée : accès OK sur cet appareil seulement. Connecte-toi puis réactive le code pour l’enregistrer sur le compte.';
      }
    } catch {
      /* cookie + localStorage restent valides */
    }
  }

  const baseMessage =
    finalPlan === 'coaching'
      ? 'Coaching activé avec succès'
      : 'Accès illimité activé avec succès';

  const response = NextResponse.json({
    ok: true,
    plan: finalPlan,
    linked,
    message: baseMessage + linkMessage,
  });

  response.cookies.set(ACCESS_COOKIE, finalPlan, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}
