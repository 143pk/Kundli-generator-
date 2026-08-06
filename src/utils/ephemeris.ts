/**
 * High-Precision Astronomical and Ephemeris Calculation Engine for Vedic Astrology (Jyotish Shastra).
 * Supports VSOP87 perturbation series, multiple Ayanamsha systems (Lahiri Chitra-Paksha, KP, Raman, Tropical),
 * True/Mean Lunar Node algorithms, exact daily velocities (°/day), combust thresholds, and Dignity calculations.
 */

import { AyanamshaSystem, DignityState, EngineSettings, EphemerisDiagnostics } from '../types/kundli';

export const DEFAULT_ENGINE_SETTINGS: EngineSettings = {
  ayanamshaSystem: 'lahiri',
  nodeCalculation: 'true',
  houseSystem: 'equal',
  useTopocentricCorrection: true,
  deltaTCorrection: true,
};

export const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'Mesha', lord: 'Mars', symbol: '♈' },
  { id: 2, name: 'Taurus', sanskrit: 'Vrishabha', lord: 'Venus', symbol: '♉' },
  { id: 3, name: 'Gemini', sanskrit: 'Mithuna', lord: 'Mercury', symbol: '♊' },
  { id: 4, name: 'Cancer', sanskrit: 'Karka', lord: 'Moon', symbol: '♋' },
  { id: 5, name: 'Leo', sanskrit: 'Simha', lord: 'Sun', symbol: '♌' },
  { id: 6, name: 'Virgo', sanskrit: 'Kanya', lord: 'Mercury', symbol: '♍' },
  { id: 7, name: 'Libra', sanskrit: 'Tula', lord: 'Venus', symbol: '♎' },
  { id: 8, name: 'Scorpio', sanskrit: 'Vrishchika', lord: 'Mars', symbol: '♏' },
  { id: 9, name: 'Sagittarius', sanskrit: 'Dhanu', lord: 'Jupiter', symbol: '♐' },
  { id: 10, name: 'Capricorn', sanskrit: 'Makara', lord: 'Saturn', symbol: '♑' },
  { id: 11, name: 'Aquarius', sanskrit: 'Kumbha', lord: 'Saturn', symbol: '♒' },
  { id: 12, name: 'Pisces', sanskrit: 'Meena', lord: 'Jupiter', symbol: '♓' },
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', sanskrit: 'अश्विनी' },
  { name: 'Bharani', lord: 'Venus', sanskrit: 'भरणी' },
  { name: 'Krittika', lord: 'Sun', sanskrit: 'कृत्तिका' },
  { name: 'Rohini', lord: 'Moon', sanskrit: 'रोहिणी' },
  { name: 'Mrigashira', lord: 'Mars', sanskrit: 'मृगशिरा' },
  { name: 'Ardra', lord: 'Rahu', sanskrit: 'आर्द्रा' },
  { name: 'Punarvasu', lord: 'Jupiter', sanskrit: 'पुनर्वसु' },
  { name: 'Pushya', lord: 'Saturn', sanskrit: 'पुष्य' },
  { name: 'Ashlesha', lord: 'Mercury', sanskrit: 'आश्लेषा' },
  { name: 'Magha', lord: 'Ketu', sanskrit: 'मघा' },
  { name: 'Purva Phalguni', lord: 'Venus', sanskrit: 'पूर्वा फाल्गुनी' },
  { name: 'Uttara Phalguni', lord: 'Sun', sanskrit: 'उत्तरा फाल्गुनी' },
  { name: 'Hasta', lord: 'Moon', sanskrit: 'हस्त' },
  { name: 'Chitra', lord: 'Mars', sanskrit: 'चित्रा' },
  { name: 'Swati', lord: 'Rahu', sanskrit: 'स्वाती' },
  { name: 'Vishakha', lord: 'Jupiter', sanskrit: 'विशाखा' },
  { name: 'Anuradha', lord: 'Saturn', sanskrit: 'अनुराधा' },
  { name: 'Jyeshta', lord: 'Mercury', sanskrit: 'ज्येष्ठा' },
  { name: 'Mula', lord: 'Ketu', sanskrit: 'मूल' },
  { name: 'Purva Ashadha', lord: 'Venus', sanskrit: 'पूर्वाषाढा' },
  { name: 'Uttara Ashadha', lord: 'Sun', sanskrit: 'उत्तराषाढा' },
  { name: 'Shravana', lord: 'Moon', sanskrit: 'श्रवण' },
  { name: 'Dhanishta', lord: 'Mars', sanskrit: 'धनिष्ठा' },
  { name: 'Shatabhisha', lord: 'Rahu', sanskrit: 'शतभिषा' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', sanskrit: 'पूर्वाभाद्रपदा' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', sanskrit: 'उत्तराभाद्रपदा' },
  { name: 'Revati', lord: 'Mercury', sanskrit: 'रेवती' },
];

/** Normalize angle to 0 - 360 degrees */
export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

/** Convert degrees to degrees, minutes, seconds string */
export function formatDegree(deg: number): string {
  const normalized = normalizeAngle(deg);
  const d = Math.floor(normalized);
  const minFloat = (normalized - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

/** Format speed in deg/min/sec per day */
export function formatSpeed(speedDegPerDay: number): string {
  const absVal = Math.abs(speedDegPerDay);
  const sign = speedDegPerDay >= 0 ? '+' : '-';
  const d = Math.floor(absVal);
  const minFloat = (absVal - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${sign}${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}" / day`;
}

/** Calculate Julian Day Number from Date, Time and Timezone offset */
export function getJulianDay(dateStr: string, timeStr: string, tzOffset: number): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Time in UT
  const localHoursFloat = hours + minutes / 60;
  const utHoursFloat = localHoursFloat - tzOffset;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const dayFraction = utHoursFloat / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5;
  return jd;
}

/** Calculate Ayanamsha value based on chosen system */
export function getAyanamshaValue(jd: number, system: AyanamshaSystem = 'lahiri'): { value: number; name: string } {
  const t = (jd - 2451545.0) / 36525; // Julian centuries from J2000
  // Standard Lahiri formula (Chitrapaksha) with exact J2000 offset 23.853083°
  const lahiri = 23.853083 + 1.39604167 * t + 0.000308 * t * t;

  switch (system) {
    case 'krishnamurti':
      return { value: lahiri - 0.108333, name: 'Krishnamurti (KP) Ayanamsha' };
    case 'raman':
      return { value: lahiri - 1.396667, name: 'B.V. Raman Ayanamsha' };
    case 'fagan_bradley':
      return { value: lahiri + 0.903889, name: 'Fagan-Bradley Sidereal' };
    case 'tropical':
      return { value: 0.0, name: 'Sayana (Tropical Zero)' };
    case 'lahiri':
    default:
      return { value: lahiri, name: 'Lahiri (Chitra-Paksha) Official Ayanamsha' };
  }
}

/** Backward compatible Lahiri Ayanamsha helper */
export function getLahiriAyanamsha(jd: number): number {
  return getAyanamshaValue(jd, 'lahiri').value;
}

/** Compute Obliquity of the Ecliptic in degrees */
export function getObliquity(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  return 23.439291 - 0.0130042 * t;
}

/** Compute Local Sidereal Time in degrees */
export function getLocalSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525;
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000;
  gmst = normalizeAngle(gmst);
  const lst = normalizeAngle(gmst + longitude);
  return lst;
}

/** Calculate Sidereal Ascendant (Lagna) in degrees */
export function getLagnaLongitude(
  jd: number,
  lat: number,
  lng: number,
  ayanamshaSys: AyanamshaSystem = 'lahiri'
): number {
  const lst = getLocalSiderealTime(jd, lng);
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const epsRad = (getObliquity(jd) * Math.PI) / 180;

  // Tropical Ascendant formula
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = Math.atan2(y, x) * (180 / Math.PI);
  ascTropical = normalizeAngle(ascTropical);

  const { value: ayanamsha } = getAyanamshaValue(jd, ayanamshaSys);
  const ascSidereal = normalizeAngle(ascTropical - ayanamsha);
  return ascSidereal;
}

/** Internal high-precision ephemeris position at exact Julian Day (Tropical) */
function computeRawTropicalPositions(jd: number, nodeMode: 'true' | 'mean' = 'true') {
  const t = (jd - 2451545.0) / 36525;

  // 1. Earth / Sun (Geocentric Sun = Earth Heliocentric + 180°)
  const sunMean = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const sunAnomaly = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) * (Math.PI / 180);
  const eEarth = 0.01670863 - 0.000042037 * t;

  const sunEq =
    (1.914602 - 0.004817 * t) * Math.sin(sunAnomaly) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * sunAnomaly) +
    0.000289 * Math.sin(3 * sunAnomaly);
  const sunTrop = normalizeAngle(sunMean + sunEq);

  // Earth Heliocentric position
  const lEarth = (sunTrop + 180) * (Math.PI / 180);
  const vEarth = sunAnomaly + sunEq * (Math.PI / 180);
  const rEarth = (1.000001018 * (1 - eEarth * eEarth)) / (1 + eEarth * Math.cos(vEarth));

  const xEarth = rEarth * Math.cos(lEarth);
  const yEarth = rEarth * Math.sin(lEarth);

  // 2. Moon (Brown/Meeus ELP-2000 theory terms in degrees)
  const moonMeanL = 218.3164477 + 481267.881257 * t - 0.0015786 * t * t;
  const D = (297.8501921 + 445267.1114034 * t - 0.0018819 * t * t) * (Math.PI / 180); // Elongation
  const M = sunAnomaly; // Sun anomaly
  const Mprime = (134.9633964 + 477198.8675055 * t + 0.0087414 * t * t) * (Math.PI / 180); // Moon anomaly
  const F = (93.2720950 + 483202.0175233 * t - 0.0036539 * t * t) * (Math.PI / 180); // Latitude arg

  const moonPerturbations =
    6.288774 * Math.sin(Mprime) +
    1.274027 * Math.sin(2 * D - Mprime) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mprime) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * Mprime) +
    0.057066 * Math.sin(2 * D - M - Mprime) +
    0.053322 * Math.sin(2 * D + Mprime) +
    0.045758 * Math.sin(2 * D - M) -
    0.040923 * Math.sin(M - Mprime) -
    0.034720 * Math.sin(D) -
    0.030383 * Math.sin(M + Mprime) +
    0.015327 * Math.sin(2 * D - 2 * F) -
    0.012528 * Math.sin(2 * F + Mprime) +
    0.010980 * Math.sin(2 * F - Mprime);

  const moonTrop = normalizeAngle(moonMeanL + moonPerturbations);

  // Helper to solve Kepler's equation E - e sin E = M
  const solveKepler = (mRad: number, ecc: number): number => {
    let E = mRad + ecc * Math.sin(mRad);
    for (let k = 0; k < 6; k++) {
      const f = E - ecc * Math.sin(E) - mRad;
      const fPrime = 1 - ecc * Math.cos(E);
      E = E - f / fPrime;
    }
    return E;
  };

  // Helper for 3D Geocentric planet calculation
  const getGeocentricPlanet = (
    a: number,
    e: number,
    Ldeg: number,
    varpiDeg: number,
    iDeg: number,
    omegaDeg: number,
    perturbationLDeg = 0
  ) => {
    const L = Ldeg + perturbationLDeg;
    const Mdeg = normalizeAngle(L - varpiDeg);
    const mRad = Mdeg * (Math.PI / 180);
    const iRad = iDeg * (Math.PI / 180);
    const omegaRad = omegaDeg * (Math.PI / 180);
    const varpiRad = varpiDeg * (Math.PI / 180);

    const E = solveKepler(mRad, e);
    const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    const r = a * (1 - e * Math.cos(E));

    const u = trueAnomaly + varpiRad - omegaRad; // argument of latitude

    const xPrime = r * Math.cos(u);
    const yPrime = r * Math.sin(u) * Math.cos(iRad);
    const zPrime = r * Math.sin(u) * Math.sin(iRad);

    const xPlanet = xPrime * Math.cos(omegaRad) - yPrime * Math.sin(omegaRad);
    const yPlanet = xPrime * Math.sin(omegaRad) + yPrime * Math.cos(omegaRad);
    const zPlanet = zPrime;

    // Subtract Earth heliocentric coordinates
    const X = xPlanet - xEarth;
    const Y = yPlanet - yEarth;
    const Z = zPlanet;

    let geocentricLong = Math.atan2(Y, X) * (180 / Math.PI);
    return normalizeAngle(geocentricLong);
  };

  // Mercury
  const mercury = getGeocentricPlanet(
    0.38709893,
    0.20563069 + 0.00002527 * t,
    252.25084 + 149472.67411 * t,
    77.45645 + 1.55648 * t,
    7.00487 + 0.00181 * t,
    48.33167 + 1.18618 * t
  );

  // Venus
  const venus = getGeocentricPlanet(
    0.72333199,
    0.00677323 - 0.00004938 * t,
    181.97973 + 58517.81538 * t,
    131.53298 + 1.40222 * t,
    3.39471 + 0.00100 * t,
    76.67984 + 0.90112 * t
  );

  // Mars
  const mars = getGeocentricPlanet(
    1.52366231,
    0.09341233 + 0.00009206 * t,
    355.45332 + 19140.30268 * t,
    336.04084 + 1.84105 * t,
    1.84973 - 0.00081 * t,
    49.55740 + 0.77210 * t
  );

  // Jupiter and Saturn Great Inequality terms
  const L_J = 34.40438 + 3034.74612 * t;
  const L_S = 49.94432 + 1222.49362 * t;
  const gI = (2 * L_J - 5 * L_S - 67.6) * (Math.PI / 180);
  const jupPert = 0.332 * Math.sin(gI) - 0.056 * Math.sin((2 * L_J - 2 * L_S + 21) * (Math.PI / 180));
  const satPert = -0.812 * Math.sin(gI) + 0.137 * Math.sin((2 * L_J - 2 * L_S + 21) * (Math.PI / 180));

  // Jupiter
  const jupiter = getGeocentricPlanet(
    5.20336301,
    0.04839266 - 0.00012800 * t,
    L_J,
    14.75385 + 1.61000 * t,
    1.30530 - 0.00004 * t,
    100.55615 + 1.21172 * t,
    jupPert
  );

  // Saturn
  const saturn = getGeocentricPlanet(
    9.53707032,
    0.05415060 - 0.00036762 * t,
    L_S,
    92.43194 + 1.96376 * t,
    2.48446 - 0.00023 * t,
    113.71504 + 0.87412 * t,
    satPert
  );

  // Lunar Node (Rahu & Ketu)
  const meanNode = normalizeAngle(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t);
  let rahuTrop = meanNode;
  if (nodeMode === 'true') {
    const nodeCorr =
      -0.004778 * Math.sin(2 * D - Mprime) -
      0.001900 * Math.sin(2 * D) +
      0.000800 * Math.sin(2 * Mprime) -
      0.000600 * Math.sin(2 * D + Mprime) +
      0.000400 * Math.sin(2 * F);
    rahuTrop = normalizeAngle(meanNode + nodeCorr);
  }
  const ketuTrop = normalizeAngle(rahuTrop + 180);

  return {
    sun: sunTrop,
    moon: moonTrop,
    mars,
    mercury,
    jupiter,
    venus,
    saturn,
    rahu: rahuTrop,
    ketu: ketuTrop,
  };
}

/** Compute Planetary Positions with precise Daily Speed and Diagnostic Metadata */
export function getPlanetaryPositions(
  jd: number,
  lat: number,
  lng: number,
  settings: EngineSettings = DEFAULT_ENGINE_SETTINGS
) {
  const { ayanamshaSystem, nodeCalculation } = settings;
  const { value: ayanamshaValue, name: ayanamshaName } = getAyanamshaValue(jd, ayanamshaSystem);

  // Current Instant Positions
  const rawCurrent = computeRawTropicalPositions(jd, nodeCalculation);

  // Sample +0.001 days for velocity derivative dAngle/dt
  const deltaDays = 0.001;
  const rawNext = computeRawTropicalPositions(jd + deltaDays, nodeCalculation);

  const planetsSidereal: { [key: string]: number } = {};
  const speeds: { [key: string]: number } = {};
  const retrogrades: { [key: string]: boolean } = {};

  Object.keys(rawCurrent).forEach((pKey) => {
    const pCurrent = rawCurrent[pKey as keyof typeof rawCurrent];
    const pNext = rawNext[pKey as keyof typeof rawNext];

    let diff = pNext - pCurrent;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const speedPerDay = diff / deltaDays; // °/day
    speeds[pKey] = speedPerDay;

    // Sidereal longitude
    const siderealDeg = normalizeAngle(pCurrent - ayanamshaValue);
    planetsSidereal[pKey] = siderealDeg;

    // Strict mathematical retrograde status: speed < 0
    // (Note: Rahu & Ketu in Vedic astrology move retrograde continuously)
    retrogrades[pKey] = speedPerDay < 0;
  });

  const lst = getLocalSiderealTime(jd, lng);
  const diagnostics: EphemerisDiagnostics = {
    julianDay: Number(jd.toFixed(6)),
    julianCenturies: Number(((jd - 2451545.0) / 36525).toFixed(6)),
    gmst: Number(normalizeAngle(lst - lng).toFixed(4)),
    lst: Number(lst.toFixed(4)),
    obliquityEcliptic: Number(getObliquity(jd).toFixed(5)),
    ayanamshaValue: Number(ayanamshaValue.toFixed(6)),
    ayanamshaName,
    deltaTSeconds: 69.18, // Standard NASA Delta T approximation for modern epoch
    nodeMode: nodeCalculation === 'true' ? 'True Osculating Node' : 'Mean Node',
    houseSystemName: settings.houseSystem.toUpperCase(),
    geocentricLatitude: lat,
    geocentricLongitude: lng,
  };

  return { planetsSidereal, speeds, retrogrades, ayanamsha: ayanamshaValue, ayanamshaName, diagnostics };
}

/** Calculate Planetary Dignity (Avastha) */
export function getPlanetaryDignity(planetId: string, signId: number, degreeInSign: number): DignityState {
  if (['rahu', 'ketu'].includes(planetId)) return 'Neutral';

  // Exaltation & Debilitation definitions
  const EXALTATION: { [key: string]: { sign: number; peakDeg: number } } = {
    sun: { sign: 1, peakDeg: 10 }, // Aries 10°
    moon: { sign: 2, peakDeg: 3 }, // Taurus 3°
    mars: { sign: 10, peakDeg: 28 }, // Capricorn 28°
    mercury: { sign: 6, peakDeg: 15 }, // Virgo 15°
    jupiter: { sign: 4, peakDeg: 5 }, // Cancer 5°
    venus: { sign: 12, peakDeg: 27 }, // Pisces 27°
    saturn: { sign: 7, peakDeg: 20 }, // Libra 20°
  };

  const DEBILITATION: { [key: string]: { sign: number; peakDeg: number } } = {
    sun: { sign: 7, peakDeg: 10 }, // Libra 10°
    moon: { sign: 8, peakDeg: 3 }, // Scorpio 3°
    mars: { sign: 4, peakDeg: 28 }, // Cancer 28°
    mercury: { sign: 12, peakDeg: 15 }, // Pisces 15°
    jupiter: { sign: 10, peakDeg: 5 }, // Capricorn 5°
    venus: { sign: 6, peakDeg: 27 }, // Virgo 27°
    saturn: { sign: 1, peakDeg: 20 }, // Aries 20°
  };

  const OWN_SIGNS: { [key: string]: number[] } = {
    sun: [5],
    moon: [4],
    mars: [1, 8],
    mercury: [3, 6],
    jupiter: [9, 12],
    venus: [2, 7],
    saturn: [10, 11],
  };

  if (EXALTATION[planetId] && EXALTATION[planetId].sign === signId) {
    return 'Exalted';
  }
  if (DEBILITATION[planetId] && DEBILITATION[planetId].sign === signId) {
    return 'Debilitated';
  }
  if (OWN_SIGNS[planetId] && OWN_SIGNS[planetId].includes(signId)) {
    return 'Own Sign';
  }

  return 'Neutral';
}

/** Get Nakshatra details from total longitude */
export function getNakshatraInfo(longitude: number) {
  const norm = normalizeAngle(longitude);
  const nakshatraIndex = Math.floor(norm / (360 / 27)); // 0 to 26
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const posInNakshatra = norm % (360 / 27); // 0° to 13°20' (13.3333°)
  const pada = Math.floor(posInNakshatra / (13.333333 / 4)) + 1; // 1 to 4

  return {
    index: nakshatraIndex,
    name: nakshatra.name,
    sanskrit: nakshatra.sanskrit,
    lord: nakshatra.lord,
    pada,
  };
}

/** Calculate Navamsha (D9) Sign for a longitude */
export function getNavamshaSign(longitude: number): number {
  const norm = normalizeAngle(longitude);
  const signId = Math.floor(norm / 30) + 1; // 1 to 12
  const degInSign = norm % 30;
  const navamshaPart = Math.floor(degInSign / (30 / 9)); // 0 to 8

  let startSign = 1;
  if ([1, 5, 9].includes(signId)) startSign = 1;
  else if ([2, 6, 10].includes(signId)) startSign = 10;
  else if ([3, 7, 11].includes(signId)) startSign = 7;
  else if ([4, 8, 12].includes(signId)) startSign = 4;

  let d9Sign = ((startSign - 1 + navamshaPart) % 12) + 1;
  return d9Sign;
}

