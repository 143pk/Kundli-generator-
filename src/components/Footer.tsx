import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-amber-500/20 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-100">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Vedic Kundli Generator</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Precise online Janam Kundli calculator featuring Nirayana Sidereal ephemeris calculations, Lahiri Ayanamsha, Lagna D1 and Navamsha D9 charts, Vimshottari Dasha, and Ashtakoot Gun Milan.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 mb-3">Astrological Tools</h4>
            <ul className="space-y-2">
              <li><a href="#input-name" className="hover:text-amber-300">Janam Kundli Calculator</a></li>
              <li><a href="#nav-tab-matching" className="hover:text-amber-300">Ashtakoot Gun Milan (36 Points)</a></li>
              <li><a href="#card-mangal-dosha" className="hover:text-amber-300">Mangal Dosha Analysis</a></li>
              <li><a href="#card-kaalsarp-dosha" className="hover:text-amber-300">Kaal Sarp Yoga Calculator</a></li>
              <li><a href="#card-sade-sati" className="hover:text-amber-300">Shani Sade Sati Status</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 mb-3">Divisional Charts & Dashas</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300">Lagna D1 Birth Chart</span></li>
              <li><span className="text-slate-300">Navamsha D9 Chart</span></li>
              <li><span className="text-slate-300">120-Year Vimshottari Dasha</span></li>
              <li><span className="text-slate-300">Planetary Positions & Nakshatras</span></li>
              <li><span className="text-slate-300">12 Bhavas (House Analysis)</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400 mb-3">Disclaimer & Privacy</h4>
            <div className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
              <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Calculations are provided for educational and guidance purposes. No personal birth details are stored on external servers.
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} Vedic Kundli Generator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
