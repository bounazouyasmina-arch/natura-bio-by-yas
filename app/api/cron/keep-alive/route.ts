import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Ping léger de Supabase pour éviter la pause automatique (plan gratuit ~7 jours d'inactivité).
 * Appelé par Vercel Cron (voir vercel.json).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  // En prod : Vercel envoie Authorization: Bearer <CRON_SECRET>
  if (process.env.NODE_ENV === 'production') {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: 'supabase_not_configured',
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      pinged: true,
      at: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
