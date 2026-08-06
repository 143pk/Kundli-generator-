import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { NAKSHATRAS, ZODIAC_SIGNS } from '../utils/ephemeris';
import { calculateGunMilan } from '../utils/gunMilan';
import { GunMilanResult } from '../types/kundli';

export const GunMilanTool: React.FC = () => {
  const [boyName, setBoyName] = useState('Anand Verma');
  const [boySignIndex, setBoySignIndex] = useState(0); // Aries
  const [boyNakshatraIndex, setBoyNakshatraIndex] = useState(0); // Ashwini

  const [girlName, setGirlName] = useState('Priya Sharma');
  const [girlSignIndex, setGirlSignIndex] = useState(3); // Cancer
  const [girlNakshatraIndex, setGirlNakshatraIndex] = useState(7); // Pushya

  const [result, setResult] = useState<GunMilanResult | null>(() =>
    calculateGunMilan(boyName, boySignIndex, boyNakshatraIndex, girlName, girlSignIndex, girlNakshatraIndex)
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateGunMilan(
      boyName,
      boySignIndex,
      boyNakshatraIndex,
      girlName,
      girlSignIndex,
      girlNakshatraIndex
    );
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-rose-400">Kundli Matching (Ashtakoot 36 Gun Milan)</h2>
            <p className="text-xs text-slate-400">Marriage compatibility assessment based on Moon Sign and Janma Nakshatra</p>
          </div>
          <div className="rounded-full bg-rose-500/10 p-2 text-rose-400">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Boy's Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <h3 className="font-bold text-sm text-sky-400 border-b border-slate-800 pb-2">Groom's (Boy's) Details</h3>

              <div>
                <label htmlFor="input-boy-name" className="mb-1 block text-xs font-semibold text-slate-300">Name</label>
                <input
                  id="input-boy-name"
                  type="text"
                  required
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="select-boy-sign" className="mb-1 block text-xs font-semibold text-slate-300">Moon Sign (Rashi)</label>
                <select
                  id="select-boy-sign"
                  value={boySignIndex}
                  onChange={(e) => setBoySignIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                >
                  {ZODIAC_SIGNS.map((sign, idx) => (
                    <option key={sign.id} value={idx}>
                      {sign.name} ({sign.sanskrit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-boy-nakshatra" className="mb-1 block text-xs font-semibold text-slate-300">Birth Nakshatra</label>
                <select
                  id="select-boy-nakshatra"
                  value={boyNakshatraIndex}
                  onChange={(e) => setBoyNakshatraIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                >
                  {NAKSHATRAS.map((nak, idx) => (
                    <option key={idx} value={idx}>
                      {nak.name} ({nak.sanskrit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Girl's Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <h3 className="font-bold text-sm text-rose-400 border-b border-slate-800 pb-2">Bride's (Girl's) Details</h3>

              <div>
                <label htmlFor="input-girl-name" className="mb-1 block text-xs font-semibold text-slate-300">Name</label>
                <input
                  id="input-girl-name"
                  type="text"
                  required
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="select-girl-sign" className="mb-1 block text-xs font-semibold text-slate-300">Moon Sign (Rashi)</label>
                <select
                  id="select-girl-sign"
                  value={girlSignIndex}
                  onChange={(e) => setGirlSignIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                >
                  {ZODIAC_SIGNS.map((sign, idx) => (
                    <option key={sign.id} value={idx}>
                      {sign.name} ({sign.sanskrit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-girl-nakshatra" className="mb-1 block text-xs font-semibold text-slate-300">Birth Nakshatra</label>
                <select
                  id="select-girl-nakshatra"
                  value={girlNakshatraIndex}
                  onChange={(e) => setGirlNakshatraIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                >
                  {NAKSHATRAS.map((nak, idx) => (
                    <option key={idx} value={idx}>
                      {nak.name} ({nak.sanskrit})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            id="btn-calculate-gunmilan"
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-rose-500/25 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            <span>Calculate 36 Gunas Compatibility Score</span>
          </button>
        </form>
      </div>

      {/* Result Section */}
      {result && (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-amber-400">Matching Verdict & Scorecard</h3>
              <p className="text-xs text-slate-400">
                Between <span className="text-sky-300 font-semibold">{result.boyName}</span> &{' '}
                <span className="text-rose-300 font-semibold">{result.girlName}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-amber-400">
                  {result.totalPoints} / {result.maxPoints}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Gunas Matched
                </div>
              </div>

              <div
                className={`rounded-xl border px-3 py-2 text-center text-xs font-bold ${
                  result.totalPoints >= 18
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                }`}
              >
                {result.compatibilityLevel}
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="font-semibold text-xs text-amber-400 mb-1">Astrological Summary Recommendation:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Ashtakoot Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-500/20 bg-slate-950/80 text-amber-400">
                  <th className="px-3 py-2.5 font-semibold">Koota Parameter</th>
                  <th className="px-3 py-2.5 font-semibold">Groom Attribute</th>
                  <th className="px-3 py-2.5 font-semibold">Bride Attribute</th>
                  <th className="px-3 py-2.5 font-semibold">Score / Max</th>
                  <th className="px-3 py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.kootas.map((koota, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-3 py-2.5 font-semibold text-slate-200">
                      <span>{koota.name}</span>
                      <span className="text-slate-500 text-[10px] ml-1">({koota.sanskritName})</span>
                    </td>
                    <td className="px-3 py-2.5 text-sky-300">{koota.boyAttribute}</td>
                    <td className="px-3 py-2.5 text-rose-300">{koota.girlAttribute}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-400">
                      {koota.obtainedPoints} / {koota.maxPoints}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 text-[11px]">{koota.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
