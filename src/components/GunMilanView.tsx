import React, { useState } from 'react';
import { POPULAR_CITIES } from '../data/cities';
import { calculateGunMilan, generateKundli } from '../utils/kundliCalc';
import { GunMilanResult } from '../types/kundli';

export const GunMilanView: React.FC = () => {
  const [boyName, setBoyName] = useState('Rahul');
  const [boyDob, setBoyDob] = useState('1995-08-15');
  const [boyTob, setBoyTob] = useState('10:30');
  const [boyCity, setBoyCity] = useState(POPULAR_CITIES[0]);

  const [girlName, setGirlName] = useState('Priya');
  const [girlDob, setGirlDob] = useState('1997-05-20');
  const [girlTob, setGirlTob] = useState('14:15');
  const [girlCity, setGirlCity] = useState(POPULAR_CITIES[1]);

  const [result, setResult] = useState<GunMilanResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const boyKundli = generateKundli({
      name: boyName,
      gender: 'male',
      dateOfBirth: boyDob,
      timeOfBirth: boyTob,
      placeName: boyCity.name,
      latitude: boyCity.lat,
      longitude: boyCity.lng,
      timezone: boyCity.tz,
    });

    const girlKundli = generateKundli({
      name: girlName,
      gender: 'female',
      dateOfBirth: girlDob,
      timeOfBirth: girlTob,
      placeName: girlCity.name,
      latitude: girlCity.lat,
      longitude: girlCity.lng,
      timezone: girlCity.tz,
    });

    const boyMoon = boyKundli.chartData.planets.find((p) => p.id === 'moon')!;
    const girlMoon = girlKundli.chartData.planets.find((p) => p.id === 'moon')!;

    const boyNakshatraIdx = Math.floor(boyMoon.longitude / (360 / 27));
    const girlNakshatraIdx = Math.floor(girlMoon.longitude / (360 / 27));

    const res = calculateGunMilan(boyMoon.signId, boyNakshatraIdx, girlMoon.signId, girlNakshatraIdx);
    res.boyName = boyName;
    res.girlName = girlName;

    setResult(res);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <form onSubmit={handleCalculate} className="w-full rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-6 border-b border-slate-800 pb-4 text-center">
          <h2 className="text-xl font-bold text-amber-400">💍 Ashtakoota Gun Milan (Kundli Matching)</h2>
          <p className="text-xs text-slate-400 mt-1">36 Points Vedic Compatibility Analysis for Marriage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Groom Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
              <span>👨</span> Groom (Boy) Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">DOB</label>
                  <input
                    type="date"
                    required
                    value={boyDob}
                    onChange={(e) => setBoyDob(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Time</label>
                  <input
                    type="time"
                    required
                    value={boyTob}
                    onChange={(e) => setBoyTob(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">City</label>
                <select
                  value={boyCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setBoyCity(c);
                  }}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bride Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-sm font-bold text-pink-400 mb-3 flex items-center gap-1.5">
              <span>👩</span> Bride (Girl) Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">DOB</label>
                  <input
                    type="date"
                    required
                    value={girlDob}
                    onChange={(e) => setGirlDob(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Time</label>
                  <input
                    type="time"
                    required
                    value={girlTob}
                    onChange={(e) => setGirlTob(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">City</label>
                <select
                  value={girlCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setGirlCity(c);
                  }}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <span>💖</span> Match Kundli & Calculate Gun Milan
        </button>
      </form>

      {/* Gun Milan Results Table */}
      {result && (
        <div className="w-full rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <h3 className="text-lg font-bold text-amber-400">
                Match Score: <span className="text-2xl text-emerald-400">{result.totalPoints}</span> / {result.maxPoints} Gunas
              </h3>
              <p className="text-xs text-slate-300 mt-1">{result.recommendation}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                result.totalPoints >= 21
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : result.totalPoints >= 18
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {result.compatibilityLevel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/60">
                  <th className="p-2.5">Koota</th>
                  <th className="p-2.5">Groom ({result.boyName})</th>
                  <th className="p-2.5">Bride ({result.girlName})</th>
                  <th className="p-2.5 text-center">Score</th>
                  <th className="p-2.5">Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.kootas.map((k, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-2.5 font-bold text-amber-300">
                      {k.name} ({k.sanskritName})
                    </td>
                    <td className="p-2.5 text-slate-300">{k.boyAttribute}</td>
                    <td className="p-2.5 text-slate-300">{k.girlAttribute}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-400">
                      {k.obtainedPoints} / {k.maxPoints}
                    </td>
                    <td className="p-2.5 text-slate-400 text-[11px]">{k.description}</td>
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
