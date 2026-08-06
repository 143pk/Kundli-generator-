import React, { useState } from 'react';
import { DashaPeriod } from '../types/kundli';
import { Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface DashaTimelineProps {
  dashaPeriods: DashaPeriod[];
}

export const DashaTimeline: React.FC<DashaTimelineProps> = ({ dashaPeriods }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    dashaPeriods.findIndex((d) => d.isCurrent) !== -1
      ? dashaPeriods.findIndex((d) => d.isCurrent)
      : 0
  );

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-amber-400">Vimshottari Dasha Timeline (120 Years)</h3>
        <p className="text-xs text-slate-400">Major planetary periods (Mahadasha) and sub-periods (Antardasha)</p>
      </div>

      <div className="space-y-3">
        {dashaPeriods.map((dasha, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                dasha.isCurrent
                  ? 'border-amber-500/60 bg-amber-500/10 shadow-md shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <button
                type="button"
                id={`btn-dasha-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="flex w-full items-center justify-between p-3.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs ${
                      dasha.isCurrent
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    {dasha.planetSanskrit.substring(0, 2)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{dasha.planetSanskrit} ({dasha.planet}) Mahadasha</span>
                      {dasha.isCurrent && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                          Active Now
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{dasha.startDate} to {dasha.endDate}</span>
                      <span className="text-slate-500">({dasha.durationYears} Years)</span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {/* Sub-Periods (Antardasha) */}
              {isExpanded && dasha.subPeriods && (
                <div className="border-t border-slate-800 bg-slate-950/90 p-3.5">
                  <div className="mb-2.5 text-xs font-semibold text-amber-400/90 uppercase tracking-wider">
                    {dasha.planet} Antardasha Breakdown
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {dasha.subPeriods.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className={`rounded-lg border p-2.5 text-xs ${
                          sub.isCurrent
                            ? 'border-amber-500/80 bg-amber-500/20 text-amber-200 font-medium'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{dasha.planet} - {sub.planet}</span>
                          {sub.isCurrent && (
                            <span className="text-[10px] font-bold text-amber-400">Current</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {sub.startDate} to {sub.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
