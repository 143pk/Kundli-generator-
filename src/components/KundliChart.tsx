import React, { useState } from 'react';
import { ChartData } from '../types/kundli';

interface KundliChartProps {
  chartData: ChartData;
  title: string;
  type?: 'd1' | 'd9';
}

export const KundliChart: React.FC<KundliChartProps> = ({ chartData, title, type = 'd1' }) => {
  const [style, setStyle] = useState<'north' | 'south'>('north');
  const [showDegrees, setShowDegrees] = useState<boolean>(false);

  const lagnaSignId = chartData.lagnaSignId;
  const d9LagnaSign = chartData.navamshaPlanets['lagna'] || lagnaSignId;

  const activeLagnaSign = type === 'd1' ? lagnaSignId : d9LagnaSign;

  // Planet placement lookup map for each house (1 to 12)
  interface PlanetTag {
    symbol: string;
    isRetro: boolean;
    degStr?: string;
  }

  const housePlanets: { [houseNumber: number]: PlanetTag[] } = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];

  const getPlanetSymbol = (id: string) => {
    switch (id) {
      case 'sun':
        return 'Su';
      case 'moon':
        return 'Mo';
      case 'mars':
        return 'Ma';
      case 'mercury':
        return 'Me';
      case 'jupiter':
        return 'Ju';
      case 'venus':
        return 'Ve';
      case 'saturn':
        return 'Sa';
      case 'rahu':
        return 'Ra';
      case 'ketu':
        return 'Ke';
      default:
        return id.substring(0, 2).toUpperCase();
    }
  };

  chartData.planets.forEach((p) => {
    let houseNum = 1;
    if (type === 'd1') {
      houseNum = p.house;
    } else {
      const pD9Sign = chartData.navamshaPlanets[p.id];
      houseNum = ((pD9Sign - d9LagnaSign + 12) % 12) + 1;
    }

    const degStr = `${Math.floor(p.degreeInSign)}°`;
    housePlanets[houseNum].push({
      symbol: getPlanetSymbol(p.id),
      isRetro: p.isRetrograde && !['rahu', 'ketu'].includes(p.id),
      degStr,
    });
  });

  // Get zodiac sign number (1 to 12) for a given house number (1 to 12)
  const getHouseSignNum = (houseNum: number) => {
    return ((activeLagnaSign - 1 + (houseNum - 1)) % 12) + 1;
  };

  // Helper to chunk array of planet tags for SVG multiline rendering
  const renderPlanetTextLines = (planets: PlanetTag[], centerX: number, startY: number) => {
    if (planets.length === 0) return null;

    // Group into chunks of 3 max per line
    const chunks: PlanetTag[][] = [];
    for (let i = 0; i < planets.length; i += 3) {
      chunks.push(planets.slice(i, i + 3));
    }

    return chunks.map((chunk, lineIdx) => {
      const text = chunk
        .map((p) => `${p.symbol}${p.isRetro ? '(R)' : ''}${showDegrees ? ` ${p.degStr}` : ''}`)
        .join(' ');

      return (
        <text
          key={lineIdx}
          x={centerX}
          y={startY + lineIdx * 14}
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="11"
          fontWeight="bold"
        >
          {text}
        </text>
      );
    });
  };

  // South Indian Sign Mapping: Box 1..12 definitions
  // Fixed Zodiac signs: Pisces=12, Aries=1, Taurus=2, Gemini=3, Cancer=4, Leo=5, Virgo=6, Libra=7, Scorpio=8, Sagittarius=9, Capricorn=10, Aquarius=11
  const southIndianBoxes = [
    { sign: 12, name: 'Pisces', cx: 57.5, cy: 57.5 },
    { sign: 1, name: 'Aries', cx: 152.5, cy: 57.5 },
    { sign: 2, name: 'Taurus', cx: 247.5, cy: 57.5 },
    { sign: 3, name: 'Gemini', cx: 342.5, cy: 57.5 },
    { sign: 4, name: 'Cancer', cx: 342.5, cy: 152.5 },
    { sign: 5, name: 'Leo', cx: 342.5, cy: 247.5 },
    { sign: 6, name: 'Virgo', cx: 342.5, cy: 342.5 },
    { sign: 7, name: 'Libra', cx: 247.5, cy: 342.5 },
    { sign: 8, name: 'Scorpio', cx: 152.5, cy: 342.5 },
    { sign: 9, name: 'Sagittarius', cx: 57.5, cy: 342.5 },
    { sign: 10, name: 'Capricorn', cx: 57.5, cy: 247.5 },
    { sign: 11, name: 'Aquarius', cx: 57.5, cy: 152.5 },
  ];

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-amber-400">{title}</h3>
          <p className="text-xs text-slate-400">
            {type === 'd1' ? 'Main Natal Lagna Chart (Rashi D1)' : 'Navamsha Divisional Chart (D9)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Degree Toggle Button */}
          <button
            type="button"
            onClick={() => setShowDegrees(!showDegrees)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
              showDegrees
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {showDegrees ? 'Hide Degrees' : 'Show Degrees'}
          </button>

          {/* Style Toggle */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-1">
            <button
              type="button"
              id={`btn-style-north-${type}`}
              onClick={() => setStyle('north')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                style === 'north' ? 'bg-amber-500/30 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              North Indian
            </button>
            <button
              type="button"
              id={`btn-style-south-${type}`}
              onClick={() => setStyle('south')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                style === 'south' ? 'bg-amber-500/30 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              South Indian
            </button>
          </div>
        </div>
      </div>

      {/* Chart SVG Container */}
      <div className="flex justify-center py-2">
        {style === 'north' ? (
          /* North Indian Diamond Chart SVG */
          <svg viewBox="0 0 400 400" className="w-full max-w-[380px] rounded-xl bg-slate-950 border border-amber-500/40 p-2 shadow-inner">
            {/* Outer Box */}
            <rect x="10" y="10" width="380" height="380" fill="none" stroke="#d97706" strokeWidth="2.5" />
            {/* Main Diagonals */}
            <line x1="10" y1="10" x2="390" y2="390" stroke="#d97706" strokeWidth="1.5" />
            <line x1="390" y1="10" x2="10" y2="390" stroke="#d97706" strokeWidth="1.5" />
            {/* Inner Diamond */}
            <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#d97706" strokeWidth="2" />

            {/* House 1: Top Center Diamond */}
            <g id="house-1">
              <text x="200" y="52" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="extrabold">
                Lagna (1)
              </text>
              <text x="200" y="70" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
                {getHouseSignNum(1)}
              </text>
              {renderPlanetTextLines(housePlanets[1], 200, 95)}
            </g>

            {/* House 2: Top-Left Outer Triangle */}
            <g id="house-2">
              <text x="105" y="32" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(2)}
              </text>
              {renderPlanetTextLines(housePlanets[2], 105, 50)}
            </g>

            {/* House 3: Upper-Left Outer Triangle */}
            <g id="house-3">
              <text x="42" y="95" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(3)}
              </text>
              {renderPlanetTextLines(housePlanets[3], 42, 115)}
            </g>

            {/* House 4: Left Diamond */}
            <g id="house-4">
              <text x="105" y="175" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
                {getHouseSignNum(4)}
              </text>
              {renderPlanetTextLines(housePlanets[4], 105, 198)}
            </g>

            {/* House 5: Lower-Left Outer Triangle */}
            <g id="house-5">
              <text x="42" y="285" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(5)}
              </text>
              {renderPlanetTextLines(housePlanets[5], 42, 305)}
            </g>

            {/* House 6: Bottom-Left Outer Triangle */}
            <g id="house-6">
              <text x="105" y="348" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(6)}
              </text>
              {renderPlanetTextLines(housePlanets[6], 105, 365)}
            </g>

            {/* House 7: Bottom Center Diamond */}
            <g id="house-7">
              <text x="200" y="270" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
                {getHouseSignNum(7)}
              </text>
              {renderPlanetTextLines(housePlanets[7], 200, 295)}
            </g>

            {/* House 8: Bottom-Right Outer Triangle */}
            <g id="house-8">
              <text x="295" y="348" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(8)}
              </text>
              {renderPlanetTextLines(housePlanets[8], 295, 365)}
            </g>

            {/* House 9: Lower-Right Outer Triangle */}
            <g id="house-9">
              <text x="358" y="285" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(9)}
              </text>
              {renderPlanetTextLines(housePlanets[9], 358, 305)}
            </g>

            {/* House 10: Right Diamond */}
            <g id="house-10">
              <text x="295" y="175" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
                {getHouseSignNum(10)}
              </text>
              {renderPlanetTextLines(housePlanets[10], 295, 198)}
            </g>

            {/* House 11: Upper-Right Outer Triangle */}
            <g id="house-11">
              <text x="358" y="95" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(11)}
              </text>
              {renderPlanetTextLines(housePlanets[11], 358, 115)}
            </g>

            {/* House 12: Top-Right Outer Triangle */}
            <g id="house-12">
              <text x="295" y="32" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                {getHouseSignNum(12)}
              </text>
              {renderPlanetTextLines(housePlanets[12], 295, 50)}
            </g>
          </svg>
        ) : (
          /* South Indian Grid Chart SVG */
          <svg viewBox="0 0 400 400" className="w-full max-w-[380px] rounded-xl bg-slate-950 border border-amber-500/40 p-2 shadow-inner">
            <rect x="10" y="10" width="380" height="380" fill="none" stroke="#d97706" strokeWidth="2.5" />

            {/* Grid Dividers */}
            <line x1="105" y1="10" x2="105" y2="390" stroke="#d97706" strokeWidth="1" />
            <line x1="200" y1="10" x2="200" y2="390" stroke="#d97706" strokeWidth="1" />
            <line x1="295" y1="10" x2="295" y2="390" stroke="#d97706" strokeWidth="1" />

            <line x1="10" y1="105" x2="390" y2="105" stroke="#d97706" strokeWidth="1" />
            <line x1="10" y1="200" x2="390" y2="200" stroke="#d97706" strokeWidth="1" />
            <line x1="10" y1="295" x2="390" y2="295" stroke="#d97706" strokeWidth="1" />

            {/* Center Box */}
            <rect x="105" y="105" width="190" height="190" fill="#020617" stroke="#d97706" strokeWidth="1.5" />
            <text x="200" y="190" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">
              {type === 'd1' ? 'D1 RASHI' : 'D9 NAVAMSHA'}
            </text>
            <text x="200" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11">
              South Indian Fixed Grid
            </text>

            {/* Render 12 Fixed Zodiac Boxes */}
            {southIndianBoxes.map(({ sign, name, cx, cy }) => {
              // House number relative to Lagna
              const houseNum = ((sign - activeLagnaSign + 12) % 12) + 1;
              const isLagnaBox = houseNum === 1;

              return (
                <g key={sign}>
                  {/* Lagna Corner Line indicator if this is Lagna box */}
                  {isLagnaBox && (
                    <line
                      x1={cx - 35}
                      y1={cy - 35}
                      x2={cx - 15}
                      y2={cy - 35}
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Sign Title & Lagna Label */}
                  <text x={cx} y={cy - 25} textAnchor="middle" fill={isLagnaBox ? '#fbbf24' : '#d97706'} fontSize="10" fontWeight="bold">
                    {name} {isLagnaBox ? '(Asc)' : ''}
                  </text>

                  {/* Planets inside this sign */}
                  {renderPlanetTextLines(housePlanets[houseNum], cx, cy - 2)}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
        <span className="text-amber-400 font-semibold">Planets:</span>
        <span>Su = Sun</span>
        <span>Mo = Moon</span>
        <span>Ma = Mars</span>
        <span>Me = Mercury</span>
        <span>Ju = Jupiter</span>
        <span>Ve = Venus</span>
        <span>Sa = Saturn</span>
        <span>Ra = Rahu</span>
        <span>Ke = Ketu</span>
        <span className="text-amber-300 font-medium">(R) = Retrograde (Vakri)</span>
      </div>
    </div>
  );
};
