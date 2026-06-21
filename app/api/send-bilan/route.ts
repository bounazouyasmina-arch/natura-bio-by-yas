import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ageRange, mainConcerns, goals, duration, personalized } = body;

    // === LOG (visible dans Vercel logs ou local terminal) ===
    console.log('=== NOUVEAU BILAN REÇU ===', { email, ageRange, mainConcerns, goals, duration });

    const adviceHtml = personalized?.detailedAdvice?.map((a: string) => `<p style="margin:8px 0;">${a}</p>`).join('') || '';

    const recsHtml = personalized?.recommendations?.map((agent: string) => 
      `<li style="margin-bottom:4px;">→ <strong>Agent ${agent}</strong></li>`
    ).join('') || '';

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
        <h1 style="color:#2A3A32;">Ton bilan santé au naturel – ${new Date().toLocaleDateString('fr-FR')}</h1>
        
        <p>Bonjour !</p>
        <p>Voici le résumé personnalisé de ton bilan :</p>
        
        <h3>Profil</h3>
        <p><strong>Âge :</strong> ${ageRange} • <strong>Depuis :</strong> ${duration || 'non précisé'}</p>
        <p><strong>Principaux axes :</strong> ${mainConcerns?.join(', ')}</p>
        <p><strong>Objectif :</strong> ${goals || 'mieux te comprendre'}</p>

        <h3>Conseils concrets</h3>
        ${adviceHtml}

        <h3>Recommandations IA</h3>
        <ul>${recsHtml}</ul>

        <p style="margin-top:30px;"><strong>Prochaines étapes :</strong></p>
        <ul>
          <li>Va dans l'espace membres et pose des questions précises aux agents recommandés.</li>
          <li>Commence par 1-2 outils pendant 7-14 jours et note tes symptômes.</li>
          <li>Pour aller plus loin : l'ebook ou le coaching.</li>
        </ul>

        <p style="font-size:12px; color:#666; margin-top:40px;">
          Tu peux te désabonner à tout moment en répondant à cet email.<br>
          natura'bio by yas – Santé & bien-être au naturel
        </p>
      </div>
    `;

    // === VRAI ENVOI SI RESEND EST CONFIGURÉ ===
    if (process.env.RESEND_API_KEY) {
      try {
        // @ts-ignore - install resend when you add the key
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "natura'bio by yas <onboarding@resend.dev>",
          to: email,
          subject: "Ton bilan santé au naturel personnalisé",
          html: html,
        });

        return NextResponse.json({ 
          success: true, 
          message: "✅ Ton bilan détaillé vient de t'être envoyé par email !" 
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Simulation si pas de clé
    return NextResponse.json({ 
      success: true, 
      message: "Bilan enregistré. Configure Resend pour envoyer de vrais emails (voir instructions)." 
    });

  } catch (error) {
    console.error('Erreur envoi bilan:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
