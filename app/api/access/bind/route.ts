import { NextResponse } from 'next/server';
import {
  ACCESS_COOKIE,
  isAccessTier,
  type AccessTier,
} from '@/lib/member-access';
import { grantAccessToProfile } from '@/lib/access-profile';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { cookies } from 'next/headers';

/**
 * Lie le plan déjà validé (cookie / body) au compte Supabase connecté.
 * POST { plan?: 'ebook' | 'coaching' }
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase non configuré', linked: false },
      { status: 503 }
    );
  }

  let bodyPlan: string | undefined;
  try {
    const body = await request.json();
    bodyPlan = body?.plan;
  } catch {
    bodyPlan = undefined;
  }

  const cookieStore = await cookies();
  const cookiePlan = cookieStore.get(ACCESS_COOKIE)?.value;

  const planRaw = bodyPlan || cookiePlan;
  if (!isAccessTier(planRaw) || planRaw === 'free') {
    return NextResponse.json(
      {
        error:
          'Aucun accès premium à lier. Utilise d’abord ton lien Beacons ou ton code.',
        linked: false,
      },
      { status: 400 }
    );
  }

  const plan = planRaw as AccessTier;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Connecte-toi pour enregistrer l’accès sur ton compte.',
          linked: false,
          needsAuth: true,
        },
        { status: 401 }
      );
    }

    const result = await grantAccessToProfile(user.id, plan, {
      userClient: supabase,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Échec de liaison', linked: false },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      linked: true,
      plan: result.tier,
      message:
        result.tier === 'coaching'
          ? 'Coaching enregistré sur ton compte'
          : 'Accès illimité enregistré sur ton compte',
    });

    response.cookies.set(ACCESS_COOKIE, result.tier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : 'Erreur serveur',
        linked: false,
      },
      { status: 500 }
    );
  }
}
