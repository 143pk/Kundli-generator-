import React from 'react';
import { Compass, FileText, Heart, Moon, Sun, Sparkles, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: 'kundli' | 'matching' | 'faq';
  setActiveTab: (tab: 'kundli' | 'matching' | 'faq') => void;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onPrint }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <a href="./" className="group flex items-center gap-2 text-xl font-bold tracking-tight text-slate-100 hover:text-amber-400">
              <span>Vedic Kundli</span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </a>
            <p className="text-xs text-slate-400">Precision Sidereal Astrological Janam Kundli</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-kundli"
            onClick={() => setActiveTab('kundli')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'kundli'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Compass className="h-4 w-4 text-amber-400" />
            <span>Kundli Generator</span>
          </button>

          <button
            id="nav-tab-matching"
            onClick={() => setActiveTab('matching')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'matching'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Heart className="h-4 w-4 text-rose-400" />
            <span>Gun Milan (Matching)</span>
          </button>

          <button
            id="nav-tab-faq"
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'faq'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <FileText className="h-4 w-4 text-sky-400" />
            <span>Astrology Guide</span>
          </button>

          {onPrint && (
            <button
              id="btn-print-report"
              onClick={onPrint}
              title="Print or Save PDF Report"
              className="ml-2 hidden items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 sm:flex"
            >
              <Printer className="h-4 w-4 text-amber-400" />
              <span>Print PDF</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
