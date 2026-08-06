import React from 'react';
import { HelpCircle, BookOpen, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'What is a Janam Kundli and how is it generated?',
      answer:
        'A Janam Kundli (Vedic Birth Chart) is a cosmic snapshot of the sky at the precise instant and geographical location of an individual birth. It calculates the sidereal longitudes of nine celestial bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu) and divides the sky into 12 houses (Bhavas) relative to the Ascendant (Lagna).',
    },
    {
      question: 'What is the difference between Lagna (D1) Chart and Navamsha (D9) Chart?',
      answer:
        'The Lagna D1 chart represents physical existence, life path, health, and worldly experiences. The Navamsha D9 divisional chart divides each zodiac sign into 9 equal micro-segments of 3°20\', revealing the inner strength of planets, marital happiness, spiritual evolution, and destiny after marriage.',
    },
    {
      question: 'How does Vimshottari Dasha work?',
      answer:
        'Vimshottari Dasha is a 120-year planetary period cycle based on the birth Nakshatra (lunar mansion) of the Moon. Each planet rules a specific number of years (e.g. Venus 20 yrs, Rahu 18 yrs, Jupiter 16 yrs). The active Mahadasha and Antardasha determine the timing of major life events.',
    },
    {
      question: 'What is Mangal Dosha (Kuja Dosha) and how does it affect marriage?',
      answer:
        'Mangal Dosha occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna or Moon. Mars represents aggression and passion; improper house placement can cause friction in relationships unless compensated by neutralizations or proper remedies.',
    },
    {
      question: 'What is Gun Milan in Kundli Matching?',
      answer:
        'Ashtakoot Gun Milan evaluates 8 cosmic parameters (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi) worth a total of 36 points (Gunas). A score of 18 or higher is traditionally considered auspicious for marital harmony.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-400">Vedic Astrology Knowledge Base & FAQ</h2>
            <p className="text-xs text-slate-400">Learn about Sidereal calculations, Dasha systems, and planetary influences</p>
          </div>
          <div className="rounded-full bg-amber-500/10 p-2 text-amber-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
