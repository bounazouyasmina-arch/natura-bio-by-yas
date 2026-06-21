"use client";

import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A32]">
      {/* Navbar simple */}
      <nav className="sticky top-0 z-50 border-b border-[#E6EDE9] bg-[#F9F6F0]/95 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/natura-bio-logo.jpg" alt="natura'bio" className="h-8 w-auto" />
            <span className="font-semibold">natura'bio by yas</span>
          </Link>
          <Link href="/" className="text-sm hover:text-[#4A9B8C]">← Retour à l'accueil</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-12">
          <div className="text-[#4A9B8C] text-sm tracking-[2px] font-medium mb-2">RESSOURCES &amp; ARTICLES</div>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">Le blog de natura'bio by yas</h1>
          <p className="text-lg text-[#5A6B62]">Des articles approfondis pour mieux comprendre et prendre soin de vous au naturel.</p>
        </div>

        {/* Article 1 */}
        <article id="approche-holistique" className="card rounded-3xl p-8 mb-10 scroll-mt-20">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">APPROCHE HOLISTIQUE</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">L'approche holistique : harmoniser corps, émotions et hormones</h2>
          
          <div className="prose prose-sm max-w-none text-[#5A6B62]">
            <p>En période de ménopause ou de déséquilibre hormonal, il est rare qu’un seul symptôme se manifeste isolément. Bouffées de chaleur, insomnies, irritabilité, brouillard mental et prise de poids sont souvent interconnectés.</p>
            
            <p>L’approche holistique consiste à traiter la personne dans sa globalité plutôt que de masquer un symptôme. Chez natura’bio, nous combinons :</p>
            
            <ul>
              <li><strong>Aromathérapie</strong> : synergies d’huiles essentielles ciblées (sauge sclarée, lavande, géranium)</li>
              <li><strong>Régulation du nerf vague</strong> : exercices de respiration et techniques de recentrage</li>
              <li><strong>Alimentation thérapeutique</strong> : cycle syncing, adaptogènes et micronutrition</li>
              <li><strong>Médecine traditionnelle chinoise et prophétique</strong> : points d’acupression, plantes et rituels ancestraux</li>
            </ul>

            <p>Cette vision intégrative permet d’obtenir des résultats durables, car elle agit sur les causes profondes plutôt que sur les manifestations.</p>

            <p className="mt-4 font-medium text-[#2A3A32]">Exemple concret :</p>
            <p>Une femme en périménopause qui souffre de bouffées de chaleur et d’anxiété peut bénéficier d’une synergie huile essentielle de sauge sclarée + respiration 4-6 + infusion de mélisse le soir. Les résultats sont souvent visibles en 2 à 3 semaines.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6EDE9]">
            <Link href="/espace" className="text-sm text-[#4A9B8C] hover:underline">→ Poser vos questions dans le chat IA</Link>
          </div>
        </article>

        {/* Article 2 */}
        <article id="racines-traditionnelles" className="card rounded-3xl p-8 mb-10 scroll-mt-20">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">RACINES TRADITIONNELLES + SCIENCE</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">La science valide les traditions : plantes et hormones</h2>
          
          <div className="prose prose-sm max-w-none text-[#5A6B62]">
            <p>Les médecines ancestrales n’étaient pas des « remèdes de grand-mère » sans fondement. De nombreuses études modernes confirment aujourd’hui l’efficacité de plantes utilisées depuis des millénaires.</p>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-[#2A3A32]">Quelques exemples validés par la science :</h3>
            
            <ul>
              <li><strong>Nigelle (cumin noir)</strong> : études montrent son action régulatrice sur les hormones thyroïdiennes et la réduction de l’inflammation.</li>
              <li><strong>Sauge sclarée</strong> : des recherches ont démontré son effet sur les bouffées de chaleur et l’équilibre des œstrogènes.</li>
              <li><strong>Maca</strong> : plusieurs essais cliniques confirment son action sur l’énergie, la libido et l’humeur pendant la ménopause.</li>
              <li><strong>Huiles essentielles</strong> : la lavande et le géranium ont des effets prouvés sur le système nerveux et la qualité du sommeil.</li>
            </ul>

            <p>C’est précisément cette alliance entre traditions ancestrales et données scientifiques qui rend notre approche si puissante et sécuritaire.</p>

            <p className="mt-4">Chez natura’bio, nous ne proposons jamais une plante ou une huile sans avoir croisé les savoirs anciens et les preuves actuelles.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6EDE9]">
            <Link href="/espace" className="text-sm text-[#4A9B8C] hover:underline">→ Explorer les agents IA spécialisés</Link>
          </div>
        </article>

        {/* Article 3 */}
        <article id="tu-nes-pas-seule" className="card rounded-3xl p-8 mb-10 scroll-mt-20">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">TU N'ES PAS SEULE</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">La force du collectif et du soutien émotionnel</h2>
          
          <div className="prose prose-sm max-w-none text-[#5A6B62]">
            <p>La charge mentale, l’isolement et le manque de reconnaissance sont souvent les symptômes les plus invisibles de la ménopause et des déséquilibres hormonaux.</p>

            <p>Pourtant, des études montrent que le soutien social et émotionnel joue un rôle majeur dans l’amélioration des symptômes physiques et de la qualité de vie.</p>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-[#2A3A32]">Ce que nous proposons concrètement :</h3>
            
            <ul>
              <li>Un <strong>forum bienveillant</strong> où vous pouvez poser vos questions sans jugement</li>
              <li>Des <strong>agents IA spécialisés</strong> (dont un dédié à la charge mentale et aux émotions)</li>
              <li>La possibilité d’accéder au <strong>coaching humain</strong> pour un accompagnement profond</li>
              <li>Des protocoles qui intègrent le travail intérieur et la revalorisation de soi</li>
            </ul>

            <p className="mt-4">Vous n’avez pas à porter seule la transformation de cette période de vie. Des centaines de femmes vivent les mêmes questionnements et trouvent du réconfort et des solutions dans la communauté.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6EDE9]">
            <Link href="/espace" className="text-sm text-[#4A9B8C] hover:underline">→ Rejoindre le forum et la communauté</Link>
          </div>
        </article>

        {/* Article 4 - Nouveauté pour variété */}
        <article id="sommeil-hormones" className="card rounded-3xl p-8 mb-10 scroll-mt-20">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">SOMMEIL &amp; HORMONES</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Mieux dormir quand les hormones s'affolent</h2>
          
          <div className="prose prose-sm max-w-none text-[#5A6B62]">
            <p>Les insomnies en ménopause ou en cas de déséquilibre hormonal sont souvent liées à la chute de progestérone et à l'augmentation du cortisol le soir.</p>

            <p>Plutôt que de lutter contre le sommeil, on peut accompagner le corps avec des outils naturels ciblés :</p>
            
            <ul>
              <li>Huile essentielle de lavande vraie + camomille romaine en diffusion 30 min avant le coucher.</li>
              <li>Respiration 4-7-8 (4s inspire, 7s retenir, 8s expire) répétée 4 fois.</li>
              <li>Magnésium bisglycinate 300-400mg + infusion de mélisse ou valériane.</li>
              <li>Éviter les écrans bleus et les repas lourds après 20h.</li>
            </ul>

            <p className="mt-4">Beaucoup de femmes remarquent une amélioration notable en combinant 2-3 de ces outils de façon régulière.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6EDE9]">
            <Link href="/espace" className="text-sm text-[#4A9B8C] hover:underline">→ Demander un protocole sommeil à l'agent Respiration</Link>
          </div>
        </article>

        {/* Article 5 */}
        <article id="charge-mentale" className="card rounded-3xl p-8 mb-10 scroll-mt-20">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">CHARGE MENTALE &amp; ÉMOTIONS</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Alléger la charge mentale sans culpabilité</h2>
          
          <div className="prose prose-sm max-w-none text-[#5A6B62]">
            <p>La charge mentale n'est pas qu'une question d'organisation : c'est aussi une charge émotionnelle et identitaire, surtout à la ménopause quand on remet beaucoup de choses en question.</p>

            <p>Quelques pistes puissantes et douces :</p>
            
            <ul>
              <li>Pratiquer le "non" avec douceur : "Je ne peux pas cette semaine, je priorise mon repos."</li>
              <li>Utiliser l'huile essentielle de bergamote ou d'ylang-ylang pour apaiser le mental avant les prises de décision.</li>
              <li>Faire un "brain dump" écrit chaque soir : vider tout ce qui tourne dans la tête sur papier.</li>
              <li>Revaloriser ce qui est déjà fait au lieu de se focaliser sur ce qui reste à faire.</li>
            </ul>

            <p className="mt-4">Le travail sur les limites et la déculpabilisation est souvent celui qui apporte le plus de soulagement profond et durable.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6EDE9]">
            <Link href="/espace" className="text-sm text-[#4A9B8C] hover:underline">→ Explorer l'agent Émotion &amp; Charge mentale</Link>
          </div>
        </article>

        <div className="text-center mt-12">
          <p className="text-[#5A6B62] mb-4">Vous voulez aller plus loin sur ces thématiques ?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/espace" className="btn-primary px-6 py-3 rounded-2xl font-semibold">Accéder à l'espace membres</Link>
            <Link href="/bilan" className="px-6 py-3 rounded-2xl font-semibold border border-[#4A9B8C] hover:bg-[#F4F7F5]">Faire mon bilan personnalisé</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#E6EDE9] bg-white py-8 mt-12">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-[#5A6B62]">
          © {new Date().getFullYear()} natura'bio by yas — Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
