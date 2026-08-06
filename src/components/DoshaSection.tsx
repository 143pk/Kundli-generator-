import React from 'react';
import { DoshaAnalysis } from '../types/kundli';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface DoshaSectionProps {
  dosha: DoshaAnalysis;
}

export const DoshaSection: React.FC<DoshaSectionProps> = ({ dosha }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xl font-bold text-amber-400">Astrological Dosha & Transit Analysis</h3>
        <p className="text-xs text-slate-400">Comprehensive examination of Mangal, Kaal Sarp, and Shani Sade Sati</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Mangal Dosha Card */}
        <div
          id="card-mangal-dosha"
          className={`rounded-2xl border p-5 backdrop-blur-md transition ${
            dosha.mangalDosha.hasDosha
              ? 'border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/20'
              : 'border-emerald-500/40 bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {dosha.mangalDosha.hasDosha ? (
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              <h4 className="font-bold text-slate-100">Mangal Dosha (Kuja)</h4>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                dosha.mangalDosha.hasDosha
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {dosha.mangalDosha.hasDosha ? `Severity: ${dosha.mangalDosha.severity}` : 'No Dosha'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3">{dosha.mangalDosha.description}</p>

          {dosha.mangalDosha.placements.length > 0 && (
            <div className="mb-3 rounded-lg bg-slate-950/60 p-2.5 text-xs text-rose-300 border border-rose-500/30">
              <span className="font-semibold block mb-1">Mars Placements:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {dosha.mangalDosha.placements.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Vedic Remedies
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {dosha.mangalDosha.remedies.map((rem, rIdx) => (
                <li key={rIdx}>{rem}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kaal Sarp Dosha Card */}
        <div
          id="card-kaalsarp-dosha"
          className={`rounded-2xl border p-5 backdrop-blur-md transition ${
            dosha.kaalSarpDosha.hasDosha
              ? 'border-amber-500/40 bg-amber-950/20 shadow-lg shadow-amber-950/20'
              : 'border-emerald-500/40 bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {dosha.kaalSarpDosha.hasDosha ? (
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              <h4 className="font-bold text-slate-100">Kaal Sarp Yoga</h4>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                dosha.kaalSarpDosha.hasDosha
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {dosha.kaalSarpDosha.hasDosha ? 'Present' : 'Not Present'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3">{dosha.kaalSarpDosha.description}</p>

          {dosha.kaalSarpDosha.type && (
            <div className="mb-3 rounded-lg bg-slate-950/60 p-2.5 text-xs text-amber-300 border border-amber-500/30 font-semibold">
              Kaal Sarp Variant: {dosha.kaalSarpDosha.type}
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Recommended Remedies
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {dosha.kaalSarpDosha.remedies.map((rem, rIdx) => (
                <li key={rIdx}>{rem}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shani Sade Sati Card */}
        <div
          id="card-sade-sati"
          className={`rounded-2xl border p-5 backdrop-blur-md transition ${
            dosha.sadeSati.isSadeSati
              ? 'border-sky-500/40 bg-sky-950/20 shadow-lg shadow-sky-950/20'
              : 'border-emerald-500/40 bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {dosha.sadeSati.isSadeSati ? (
                <AlertTriangle className="h-5 w-5 text-sky-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              <h4 className="font-bold text-slate-100">Shani Sade Sati</h4>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                dosha.sadeSati.isSadeSati
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {dosha.sadeSati.isSadeSati ? 'Active Transit' : 'Inactive'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3">{dosha.sadeSati.description}</p>

          {dosha.sadeSati.phase && (
            <div className="mb-3 rounded-lg bg-slate-950/60 p-2.5 text-xs text-sky-300 border border-sky-500/30 font-semibold">
              Current Phase: {dosha.sadeSati.phase}
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Saturn Remedies
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {dosha.sadeSati.remedies.map((rem, rIdx) => (
                <li key={rIdx}>{rem}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
