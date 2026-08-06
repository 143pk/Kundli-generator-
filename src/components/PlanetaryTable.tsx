import React from 'react';
import { ChartData } from '../types/kundli';

interface PlanetaryTableProps {
  chartData: ChartData;
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({ chartData }) => {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-amber-400">Planetary Positions & Details</h3>
        <p className="text-xs text-slate-400">Nirayana (Sidereal) Longitudes with Lahiri Ayanamsha ({chartData.ayanamsha.toFixed(2)}°)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-amber-500/20 bg-slate-950/80 text-amber-400">
              <th className="px-3 py-2.5 font-semibold">Planet</th>
              <th className="px-3 py-2.5 font-semibold">Sign (Rashi)</th>
              <th className="px-3 py-2.5 font-semibold">Degree</th>
              <th className="px-3 py-2.5 font-semibold">Nakshatra</th>
              <th className="px-3 py-2.5 font-semibold">Pada</th>
              <th className="px-3 py-2.5 font-semibold">House</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {/* Ascendant / Lagna Row */}
            <tr className="bg-amber-500/10 font-semibold text-amber-300">
              <td className="px-3 py-2.5">
                <span>Ascendant / Lagna</span>
              </td>
              <td className="px-3 py-2.5">
                {chartData.lagnaSignSanskrit} ({chartData.lagnaSignName})
              </td>
              <td className="px-3 py-2.5">{chartData.formattedLagnaDegree}</td>
              <td className="px-3 py-2.5">-</td>
              <td className="px-3 py-2.5">-</td>
              <td className="px-3 py-2.5">1st House</td>
              <td className="px-3 py-2.5">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-500/30">
                  Ascendant
                </span>
              </td>
            </tr>

            {/* Planets */}
            {chartData.planets.map((planet) => (
              <tr key={planet.id} className="hover:bg-slate-800/40 transition">
                <td className="px-3 py-2.5 font-semibold text-slate-100 flex items-center gap-1.5">
                  <span className="text-amber-400">{planet.symbol}</span>
                  <span>{planet.sanskritName}</span>
                  <span className="text-slate-500 text-[11px]">({planet.name})</span>
                </td>

                <td className="px-3 py-2.5 text-slate-300">
                  <span>{planet.signSanskrit}</span>
                  <span className="text-slate-500 ml-1">({planet.signLord})</span>
                </td>

                <td className="px-3 py-2.5 font-mono text-slate-200">{planet.formattedDegree}</td>

                <td className="px-3 py-2.5 text-slate-300">
                  <span>{planet.nakshatra}</span>
                  <span className="text-slate-500 ml-1 text-[10px]">[{planet.nakshatraLord}]</span>
                </td>

                <td className="px-3 py-2.5 text-slate-300">{planet.pada}</td>

                <td className="px-3 py-2.5 font-medium text-amber-300">{planet.house}th House</td>

                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {planet.isRetrograde && (
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                        Vakri (Retro)
                      </span>
                    )}
                    {planet.isCombust && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        Asta (Combust)
                      </span>
                    )}
                    {!planet.isRetrograde && !planet.isCombust && (
                      <span className="text-emerald-400 text-[11px]">Direct</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
