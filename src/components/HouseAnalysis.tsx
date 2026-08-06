import React from 'react';
import { ChartData } from '../types/kundli';

interface HouseAnalysisProps {
  chartData: ChartData;
}

export const HouseAnalysis: React.FC<HouseAnalysisProps> = ({ chartData }) => {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-amber-400">12 Bhavas (House Analysis & Lords)</h3>
        <p className="text-xs text-slate-400">Individual domain analysis for each house relative to Lagna</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chartData.houses.map((house) => (
          <div
            key={house.houseNumber}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-amber-500/40 hover:bg-slate-950"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-amber-300">
                  {house.sanskritTitle}
                </span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                  {house.signSanskrit} ({house.signName})
                </span>
              </div>

              <div className="text-xs text-slate-300 mb-3">
                <span className="font-semibold text-slate-400">House Lord:</span>{' '}
                <span className="text-amber-400 font-medium">{house.signLord}</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {house.significance}
              </p>
            </div>

            {/* Planets in House */}
            <div className="border-t border-slate-800/80 pt-2.5 mt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Planets in House:
              </span>
              {house.planetsPresent.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {house.planetsPresent.map((p) => (
                    <span
                      key={p.id}
                      className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-sky-300 border border-slate-700"
                    >
                      {p.sanskritName} ({p.formattedDegree})
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Unoccupied</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
