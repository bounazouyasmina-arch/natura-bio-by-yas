import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function blockToHtml(text: string) {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ageRange, mainConcerns, goals, duration, personalized } =
      body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Email invalide.' },
        { status: 400 }
      );
    }

    console.log('=== NOUVEAU BILAN REÇU ===', {
      email,
      ageRange,
      mainConcerns,
      goals,
      duration,
    });

    const p = personalized || {};
    const concernsHtml =
      Array.isArray(p.concerns) && p.concerns.length > 0
        ? p.concerns
            .map(
              (c: {
                title: string;
                reading: string;
                whyNow: string;
                ageNote: string;
                dailyProtocol: string[];
                foodAndPlants: string[];
                lifestyle: string[];
                avoid: string[];
                sevenDayTest: string;
              }) => `
          <div style="margin:28px 0;padding:20px;background:#F8F5F0;border-radius:12px;border-left:4px solid #5B7B6E;">
            <h2 style="color:#2A3A32;margin:0 0 12px;font-size:18px;">${escapeHtml(c.title)}</h2>
            <p style="margin:0 0 10px;">${escapeHtml(c.reading || '')}</p>
            <p style="margin:0 0 10px;color:#5A6B62;"><em>${escapeHtml(c.whyNow || '')}</em></p>
            <p style="margin:0 0 14px;font-size:14px;">${escapeHtml(c.ageNote || '')}</p>
            <h3 style="font-size:14px;color:#5B7B6E;margin:16px 0 8px;">Protocole du jour</h3>
            <ul style="margin:0;padding-left:18px;">${(c.dailyProtocol || []).map((x: string) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join('')}</ul>
            <h3 style="font-size:14px;color:#5B7B6E;margin:16px 0 8px;">Alimentation & plantes</h3>
            <ul style="margin:0;padding-left:18px;">${(c.foodAndPlants || []).map((x: string) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join('')}</ul>
            <h3 style="font-size:14px;color:#5B7B6E;margin:16px 0 8px;">Mode de vie</h3>
            <ul style="margin:0;padding-left:18px;">${(c.lifestyle || []).map((x: string) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join('')}</ul>
            <h3 style="font-size:14px;color:#5B7B6E;margin:16px 0 8px;">À éviter</h3>
            <ul style="margin:0;padding-left:18px;">${(c.avoid || []).map((x: string) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join('')}</ul>
            <p style="margin:16px 0 0;padding:12px;background:#fff;border-radius:8px;"><strong>Test 7 jours :</strong> ${escapeHtml(c.sevenDayTest || '')}</p>
          </div>`
            )
            .join('')
        : (p.detailedAdvice || [])
            .map(
              (a: string) =>
                `<div style="margin:12px 0;padding:12px;border-left:3px solid #5B7B6E;">${blockToHtml(a)}</div>`
            )
            .join('');

    const weekBlocks = p.weekPlan || p.fourteenDayPlan;
    const planHtml = Array.isArray(weekBlocks)
      ? weekBlocks
          .map(
            (d: { day: string; focus: string; actions: string[] }) => `
        <div style="margin:12px 0;">
          <strong>${escapeHtml(d.day)}</strong> — ${escapeHtml(d.focus)}
          <ul>${(d.actions || []).map((a: string) => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
        </div>`
          )
          .join('')
      : '';

    const priorityHtml = Array.isArray(p.priorityPlan)
      ? `<ul>${p.priorityPlan.map((x: string) => `<li style="margin-bottom:6px;">${escapeHtml(x)}</li>`).join('')}</ul>`
      : '';

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 640px; margin: auto; padding: 24px; line-height: 1.65; color:#2A3A32;">
        <h1 style="color:#2A3A32;font-size:22px;">${escapeHtml(p.headline || 'Ton bilan santé au naturel')}</h1>
        <p style="color:#5A6B62;font-size:13px;">${new Date().toLocaleDateString('fr-FR')} — natura'bio by yas</p>
        
        <p>Bonjour !</p>
        <p>${escapeHtml(p.synthesis || p.summary || 'Voici ton bilan personnalisé.')}</p>

        <h2 style="font-size:16px;color:#5B7B6E;">Ton profil</h2>
        <p><strong>Âge :</strong> ${escapeHtml(ageRange || '—')} • <strong>Depuis :</strong> ${escapeHtml(duration || 'non précisé')}</p>
        <p><strong>Axes :</strong> ${escapeHtml((mainConcerns || []).join(', '))}</p>
        <p><strong>Objectif :</strong> ${escapeHtml(goals || 'mieux te comprendre')}</p>
        <p style="font-size:14px;color:#5A6B62;">${escapeHtml(p.profileReading || '')}</p>
        <p style="font-size:14px;">${escapeHtml(p.durationInsight || '')}</p>
        ${p.goalSection ? `<p style="background:#F4F7F5;padding:14px;border-radius:10px;">${escapeHtml(p.goalSection)}</p>` : ''}

        <h2 style="font-size:16px;color:#5B7B6E;margin-top:28px;">Analyse détaillée par axe</h2>
        ${concernsHtml}

        <h2 style="font-size:16px;color:#5B7B6E;">Plan de priorité</h2>
        ${priorityHtml}

        <h2 style="font-size:16px;color:#5B7B6E;">Plan sur 1 semaine (7 jours)</h2>
        ${planHtml}

        <p style="margin-top:24px;"><strong>${escapeHtml(p.closingMessage || p.message || '')}</strong></p>
        <p style="font-size:12px;color:#666;margin-top:28px;">${escapeHtml(p.disclaimer || "Bilan informatif — ne remplace pas un avis médical.")}</p>
        <p style="font-size:12px;color:#666;margin-top:16px;">
          natura'bio by yas — Santé & bien-être au naturel<br/>
          https://naturabioyas.fr
        </p>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY manquante');
      return NextResponse.json(
        {
          success: false,
          message:
            "L'envoi d'email n'est pas encore configuré (clé Resend manquante).",
        },
        { status: 503 }
      );
    }

    const from =
      process.env.RESEND_FROM_EMAIL ||
      "natura'bio by yas <onboarding@resend.dev>";

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Ton bilan santé au naturel détaillé',
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          success: false,
          message:
            error.message ||
            "L'email n'a pas pu être envoyé. Réessaie dans quelques minutes.",
        },
        { status: 502 }
      );
    }

    console.log('Email bilan envoyé:', data?.id);
    return NextResponse.json({
      success: true,
      message: "✅ Ton bilan détaillé vient de t'être envoyé par email !",
    });
  } catch (error) {
    console.error('Erreur envoi bilan:', error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}
