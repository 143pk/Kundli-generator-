import React, { useState } from 'react';
import { EngineSettings, KundliReport } from '../types/kundli';
import { KundliChart } from './KundliChart';
import { AccuracyDiagnosticEngine } from './AccuracyDiagnosticEngine';
import { generateKundli } from '../utils/kundliCalc';

interface ReportViewProps {
  report: KundliReport;
  onReset?: () => void;
  onUpdateReport?: (updatedReport: KundliReport) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onReset, onUpdateReport }) => {
  const [currentReport, setCurrentReport] = useState<KundliReport>(report);

  const { birthDetails, chartData, dashaPeriods, doshaAnalysis, panchang, summary } = currentReport;

  const handleUpdateEngineSettings = (newSettings: EngineSettings) => {
    const updatedDetails = {
      ...birthDetails,
      engineSettings: newSettings,
    };
    const newReport = generateKundli(updatedDetails);
    setCurrentReport(newReport);
    if (onUpdateReport) {
      onUpdateReport(newReport);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl text-slate-100">
      {/* Action Header */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-amber-400">Janam Kundli for {birthDetails.name}</h2>
          <p className="text-xs text-slate-400">
            Born on {birthDetails.dateOfBirth} at {birthDetails.timeOfBirth} in {birthDetails.placeName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-amber-600 text-slate-950 font-bold text-xs hover:bg-amber-500 shadow transition-all flex items-center gap-1.5"
          >
            <span>🖨️</span> Print / Save PDF
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700 transition-all"
            >
              New Chart
            </button>
          )}
        </div>
      </div>

      {/* Summary Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ascendant (Lagna)</span>
          <span className="text-sm font-bold text-amber-300">{summary.ascendantSign}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Moon Sign (Rashi)</span>
          <span className="text-sm font-bold text-cyan-300">{summary.moonSign}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sun Sign</span>
          <span className="text-sm font-bold text-amber-400">{summary.sunSign}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Birth Nakshatra</span>
          <span className="text-sm font-bold text-emerald-300">{summary.nakshatra} (Pada {summary.pada})</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <KundliChart chartData={chartData} title="Lagna (D1) Main Chart" type="D1" />
        <KundliChart chartData={chartData} title="Navamsha (D9) Marriage & Destiny Chart" type="D9" />
      </div>

      {/* Planetary Positions Table */}
      <div className="w-full rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-md font-bold text-amber-400 mb-4 flex items-center gap-2">
          <span>🪐</span> Planetary Longitudes & Nakshatra Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/60">
                <th className="p-2.5">Planet</th>
                <th className="p-2.5">Sign (Rashi)</th>
                <th className="p-2.5">Degree</th>
                <th className="p-2.5">House</th>
                <th className="p-2.5">Nakshatra</th>
                <th className="p-2.5">Lord</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {chartData.planets.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-bold text-amber-300 flex items-center gap-1.5">
                    <span>{p.symbol}</span> {p.name} <span className="text-[10px] text-slate-500">({p.sanskritName})</span>
                  </td>
                  <td className="p-2.5 text-slate-200">{p.signName} ({p.signSanskrit})</td>
                  <td className="p-2.5 font-mono text-cyan-300">{p.formattedDegree}</td>
                  <td className="p-2.5 font-bold text-amber-400">House {p.house}</td>
                  <td className="p-2.5 text-emerald-300">{p.nakshatra} (Pada {p.pada})</td>
                  <td className="p-2.5 text-slate-300">{p.nakshatraLord}</td>
                  <td className="p-2.5">
                    {p.isRetrograde ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Retrograde (R)
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Direct</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vimshottari Dasha Timeline */}
      <div className="w-full rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-md font-bold text-amber-400 mb-4 flex items-center gap-2">
          <span>⏳</span> 120-Year Vimshottari Dasha Timeline
        </h3>
        <div className="space-y-3">
          {dashaPeriods.map((d, idx) => (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                d.isCurrent
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                  {d.planet.substring(0, 2)}
                </span>
                <div>
                  <span className="font-bold text-slate-100 text-sm">{d.planet} Mahadasha</span>
                  <span className="text-[10px] text-slate-400 block">{d.durationYears} Years Duration</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-slate-300 font-mono text-[11px]">
                  {d.startDate} ➔ {d.endDate}
                </span>
                {d.isCurrent && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase animate-pulse">
                    Current Active Dasha
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dosha Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Mangal Dosha */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-400 text-sm">Mangal Dosha</h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                doshaAnalysis.mangalDosha.hasDosha
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {doshaAnalysis.mangalDosha.hasDosha ? 'Present' : 'Absent'}
            </span>
          </div>
          <p className="text-xs text-slate-300">{doshaAnalysis.mangalDosha.description}</p>
          {doshaAnalysis.mangalDosha.hasDosha && (
            <div className="text-[11px] space-y-1 pt-2 border-t border-slate-800">
              <span className="font-semibold text-amber-300 block">Suggested Remedies:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                {doshaAnalysis.mangalDosha.remedies.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Kaal Sarp Dosha */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-400 text-sm">Kaal Sarp Dosha</h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                doshaAnalysis.kaalSarpDosha.hasDosha
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {doshaAnalysis.kaalSarpDosha.hasDosha ? 'Present' : 'Absent'}
            </span>
          </div>
          <p className="text-xs text-slate-300">{doshaAnalysis.kaalSarpDosha.description}</p>
          {doshaAnalysis.kaalSarpDosha.hasDosha && (
            <div className="text-[11px] space-y-1 pt-2 border-t border-slate-800">
              <span className="font-semibold text-amber-300 block">Suggested Remedies:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                {doshaAnalysis.kaalSarpDosha.remedies.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sade Sati */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-400 text-sm">Saturn Sade Sati</h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                doshaAnalysis.sadeSati.isSadeSati
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {doshaAnalysis.sadeSati.isSadeSati ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-slate-300">{doshaAnalysis.sadeSati.description}</p>
          {doshaAnalysis.sadeSati.isSadeSati && (
            <div className="text-[11px] space-y-1 pt-2 border-t border-slate-800">
              <span className="font-semibold text-amber-300 block">Suggested Remedies:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                {doshaAnalysis.sadeSati.remedies.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Panchang & Birth Attributes */}
      <div className="w-full rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-md font-bold text-amber-400 mb-4 flex items-center gap-2">
          <span>📜</span> Panchang & Astrological Attributes at Birth
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Tithi</span>
            <span className="font-bold text-amber-300">{panchang.tithi}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Day (Vaara)</span>
            <span className="font-bold text-amber-300">{panchang.vaara}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Gana</span>
            <span className="font-bold text-cyan-300">{summary.gan}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Yoni</span>
            <span className="font-bold text-emerald-300">{summary.yoni}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Nadi</span>
            <span className="font-bold text-pink-300">{summary.nadi}</span>
          </div>
        </div>
      </div>

      {/* Ephemeris Accuracy Diagnostic Engine */}
      <div className="w-full">
        <AccuracyDiagnosticEngine
          birthDetails={birthDetails}
          chartData={chartData}
          onUpdateEngineSettings={handleUpdateEngineSettings}
        />
      </div>
    </div>
  );
};
