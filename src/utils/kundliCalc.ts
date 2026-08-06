import {
  BirthDetails,
  ChartData,
  DashaPeriod,
  DoshaAnalysis,
  GunMilanResult,
  HouseInfo,
  KootaResult,
  KundliReport,
  PlanetPosition,
} from '../types/kundli';
import {
  DEFAULT_ENGINE_SETTINGS,
  formatDegree,
  formatSpeed,
  getJulianDay,
  getLagnaLongitude,
  getNakshatraInfo,
  getNavamshaSign,
  getPlanetaryDignity,
  getPlanetaryPositions,
  normalizeAngle,
  ZODIAC_SIGNS,
} from './ephemeris';

const PLANET_METADATA: { [key: string]: { name: string; sanskrit: string; symbol: string } } = {
  sun: { name: 'Sun', sanskrit: 'Surya (सूर्य)', symbol: '☉' },
  moon: { name: 'Moon', sanskrit: 'Chandra (चन्द्र)', symbol: '☽' },
  mars: { name: 'Mars', sanskrit: 'Mangal (मंगल)', symbol: '♂' },
  mercury: { name: 'Mercury', sanskrit: 'Budha (बुध)', symbol: '☿' },
  jupiter: { name: 'Jupiter', sanskrit: 'Guru (गुरु)', symbol: '♃' },
  venus: { name: 'Venus', sanskrit: 'Shukra (शुक्र)', symbol: '♀' },
  saturn: { name: 'Saturn', sanskrit: 'Shani (शनि)', symbol: '♄' },
  rahu: { name: 'Rahu', sanskrit: 'Rahu (राहु)', symbol: '☊' },
  ketu: { name: 'Ketu', sanskrit: 'Ketu (केतु)', symbol: '☋' },
};

const DASHA_YEARS: { [key: string]: number } = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

/** Generate complete Kundli report from birth details */
export function generateKundli(birthDetails: BirthDetails): KundliReport {
  const settings = birthDetails.engineSettings || DEFAULT_ENGINE_SETTINGS;

  const jd = getJulianDay(birthDetails.dateOfBirth, birthDetails.timeOfBirth, birthDetails.timezone);
  const lagnaLongitude = getLagnaLongitude(jd, birthDetails.latitude, birthDetails.longitude, settings.ayanamshaSystem);
  const lagnaSignId = Math.floor(lagnaLongitude / 30) + 1;
  const lagnaSign = ZODIAC_SIGNS.find((s) => s.id === lagnaSignId)!;
  const lagnaDegreeInSign = lagnaLongitude % 30;

  const { planetsSidereal, speeds, retrogrades, ayanamsha, ayanamshaName, diagnostics } = getPlanetaryPositions(
    jd,
    birthDetails.latitude,
    birthDetails.longitude,
    settings
  );

  const sunLong = planetsSidereal['sun'];

  const planetList: PlanetPosition[] = [];
  const navamshaPlanets: { [planetId: string]: number } = {
    lagna: getNavamshaSign(lagnaLongitude),
  };

  Object.entries(planetsSidereal).forEach(([planetId, totalDeg]) => {
    const signId = Math.floor(totalDeg / 30) + 1;
    const signInfo = ZODIAC_SIGNS.find((s) => s.id === signId)!;
    const degreeInSign = totalDeg % 30;
    const nakshatraInfo = getNakshatraInfo(totalDeg);
    const navSign = getNavamshaSign(totalDeg);

    // Calculate house relative to Lagna (Whole Sign Rashi House)
    const house = ((signId - lagnaSignId + 12) % 12) + 1;

    const meta = PLANET_METADATA[planetId] || { name: planetId, sanskrit: planetId, symbol: '•' };

    // Combust calculation
    let combustOrb = undefined;
    let isCombust = false;
    if (planetId !== 'sun' && !['rahu', 'ketu'].includes(planetId)) {
      let diff = Math.abs(totalDeg - sunLong);
      if (diff > 180) diff = 360 - diff;
      combustOrb = Number(diff.toFixed(2));

      const COMBUST_LIMITS: { [key: string]: number } = {
        mercury: retrogrades[planetId] ? 14 : 12,
        venus: retrogrades[planetId] ? 8 : 10,
        mars: 17,
        jupiter: 11,
        saturn: 15,
        moon: 12,
      };

      if (COMBUST_LIMITS[planetId] && diff <= COMBUST_LIMITS[planetId]) {
        isCombust = true;
      }
    }

    const dignity = getPlanetaryDignity(planetId, signId, degreeInSign);
    const speedVal = speeds[planetId] || 0;

    planetList.push({
      id: planetId,
      name: meta.name,
      sanskritName: meta.sanskrit,
      symbol: meta.symbol,
      longitude: totalDeg,
      signId,
      signName: signInfo.name,
      signSanskrit: signInfo.sanskrit,
      signLord: signInfo.lord,
      degreeInSign,
      formattedDegree: formatDegree(degreeInSign),
      nakshatra: nakshatraInfo.name,
      nakshatraLord: nakshatraInfo.lord,
      pada: nakshatraInfo.pada,
      house,
      isRetrograde: retrogrades[planetId] || false,
      isCombust,
      speed: Number(speedVal.toFixed(4)),
      formattedSpeed: formatSpeed(speedVal),
      dignity,
      combustOrb,
    });

    navamshaPlanets[planetId] = navSign;
  });

  // Calculate 12 Houses
  const houses: HouseInfo[] = [];
  const HOUSE_SIGNIFICANCE = [
    'Self, Personality, Physical Appearance, Health, Beginnings',
    'Wealth, Family, Speech, Assets, Primary Education',
    'Courage, Siblings, Short Travels, Skills, Communication',
    'Mother, Home, Happiness, Properties, Vehicles, Mental Peace',
    'Children, Intelligence, Higher Education, Creativity, Romance',
    'Health Issues, Enemies, Debts, Service, Daily Work Routine',
    'Spouse, Marriage, Business Partnerships, Public Relations',
    'Longevity, Transformation, Sudden Gains, Hidden Knowledge, Secrets',
    'Dharma, Higher Wisdom, Guru, Long Travels, Good Fortune',
    'Career, Profession, Reputation, Status, Authority, Ambition',
    'Gains, Wealth Accumulation, Social Network, Fulfillment of Desires',
    'Losses, Foreign Lands, Liberation (Moksha), Expenses, Isolation',
  ];

  for (let i = 1; i <= 12; i++) {
    const hSignId = ((lagnaSignId - 1 + (i - 1)) % 12) + 1;
    const signInfo = ZODIAC_SIGNS.find((s) => s.id === hSignId)!;
    const planetsInHouse = planetList.filter((p) => p.house === i);

    const cuspDeg = normalizeAngle((hSignId - 1) * 30 + (lagnaDegreeInSign % 30));

    houses.push({
      houseNumber: i,
      signId: hSignId,
      signName: signInfo.name,
      signSanskrit: signInfo.sanskrit,
      signLord: signInfo.lord,
      startDegree: (hSignId - 1) * 30,
      cuspDegree: cuspDeg,
      formattedCuspDegree: formatDegree(cuspDeg % 30),
      planetsPresent: planetsInHouse,
      significance: HOUSE_SIGNIFICANCE[i - 1],
      sanskritTitle: `Bhava ${i}`,
    });
  }

  const chartData: ChartData = {
    lagnaSignId,
    lagnaSignName: lagnaSign.name,
    lagnaSignSanskrit: lagnaSign.sanskrit,
    lagnaDegree: lagnaDegreeInSign,
    formattedLagnaDegree: formatDegree(lagnaDegreeInSign),
    ayanamsha,
    ayanamshaName,
    planets: planetList,
    houses,
    navamshaPlanets,
    diagnostics,
  };

  // Calculate Dasha
  const moonPlanet = planetList.find((p) => p.id === 'moon')!;
  const dashaPeriods = calculateVimshottariDasha(moonPlanet.longitude, birthDetails.dateOfBirth);

  // Calculate Doshas
  const doshaAnalysis = calculateDoshas(planetList, lagnaSignId);

  // Panchang info
  const moonDeg = moonPlanet.longitude;
  const sunDeg = planetList.find((p) => p.id === 'sun')!.longitude;
  const tithiDiff = normalizeAngle(moonDeg - sunDeg);
  const tithiIndex = Math.floor(tithiDiff / 12) + 1;
  const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shasthi',
    'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
    'Trayodashi', 'Chaturdashi', 'Purnima / Amavasya'
  ];

  const moonNakshatra = getNakshatraInfo(moonDeg);

  const report: KundliReport = {
    birthDetails,
    chartData,
    dashaPeriods,
    doshaAnalysis,
    panchang: {
      tithi: TITHIS[(tithiIndex - 1) % 15],
      vaara: new Date(birthDetails.dateOfBirth).toLocaleDateString('en-US', { weekday: 'long' }),
      nakshatra: `${moonNakshatra.name} (Pada ${moonNakshatra.pada})`,
      yoga: 'Vishkambha / Preeti',
      karana: 'Bava / Balava',
    },
    summary: {
      sunSign: planetList.find((p) => p.id === 'sun')!.signName,
      moonSign: moonPlanet.signName,
      ascendantSign: lagnaSign.name,
      nakshatra: moonNakshatra.name,
      nakshatraLord: moonNakshatra.lord,
      pada: moonNakshatra.pada,
      gan: (moonNakshatra.index % 3 === 0) ? 'Deva' : (moonNakshatra.index % 3 === 1) ? 'Manushya' : 'Rakshasa',
      yoni: 'Ashwa (Horse)',
      nadi: (moonNakshatra.index % 3 === 0) ? 'Adi' : (moonNakshatra.index % 3 === 1) ? 'Madhya' : 'Antya',
    },
  };

  return report;
}

/** Compute 120 years of Vimshottari Dasha starting from birth date */
export function calculateVimshottariDasha(moonLongitude: number, dateOfBirth: string): DashaPeriod[] {
  const nakshatra = getNakshatraInfo(moonLongitude);
  const lord = nakshatra.lord;

  const degInNakshatra = moonLongitude % (360 / 27); // 0 to 13.3333 degrees
  const fractionElapsed = degInNakshatra / (360 / 27);
  const totalYearsForLord = DASHA_YEARS[lord];
  const remainingYears = totalYearsForLord * (1 - fractionElapsed);

  const birthDate = new Date(dateOfBirth);
  const periods: DashaPeriod[] = [];

  let currentDate = new Date(birthDate);
  const startIndex = DASHA_ORDER.indexOf(lord);

  // First partial dasha
  const endFirst = new Date(currentDate);
  endFirst.setFullYear(endFirst.getFullYear() + Math.floor(remainingYears));
  endFirst.setMonth(endFirst.getMonth() + Math.round((remainingYears % 1) * 12));

  const now = new Date();

  periods.push({
    planet: lord,
    planetSanskrit: PLANET_METADATA[lord.toLowerCase()]?.sanskrit || lord,
    startDate: currentDate.toISOString().split('T')[0],
    endDate: endFirst.toISOString().split('T')[0],
    durationYears: Number(remainingYears.toFixed(1)),
    isCurrent: now >= currentDate && now <= endFirst,
  });

  currentDate = new Date(endFirst);

  // Subsequent full dashas for 120 years total
  for (let i = 1; i < 9; i++) {
    const pLord = DASHA_ORDER[(startIndex + i) % 9];
    const pYears = DASHA_YEARS[pLord];

    const pEnd = new Date(currentDate);
    pEnd.setFullYear(pEnd.getFullYear() + pYears);

    periods.push({
      planet: pLord,
      planetSanskrit: PLANET_METADATA[pLord.toLowerCase()]?.sanskrit || pLord,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: pEnd.toISOString().split('T')[0],
      durationYears: pYears,
      isCurrent: now >= currentDate && now <= pEnd,
    });

    currentDate = new Date(pEnd);
  }

  return periods;
}

/** Calculate Mangal Dosha, Kaal Sarp Dosha, and Saturn Sade Sati */
export function calculateDoshas(planets: PlanetPosition[], lagnaSignId: number): DoshaAnalysis {
  const mars = planets.find((p) => p.id === 'mars')!;
  const saturn = planets.find((p) => p.id === 'saturn')!;
  const moon = planets.find((p) => p.id === 'moon')!;
  const rahu = planets.find((p) => p.id === 'rahu')!;
  const ketu = planets.find((p) => p.id === 'ketu')!;

  // Mangal Dosha checks Mars in Houses 1, 2, 4, 7, 8, 12 from Lagna or Moon
  const marsHouseLagna = mars.house;
  const isMangalLagna = [1, 2, 4, 7, 8, 12].includes(marsHouseLagna);

  let marsHouseMoon = mars.signId - moon.signId + 1;
  if (marsHouseMoon <= 0) marsHouseMoon += 12;
  const isMangalMoon = [1, 2, 4, 7, 8, 12].includes(marsHouseMoon);

  const hasMangal = isMangalLagna || isMangalMoon;
  const mangalPlacements = [];
  if (isMangalLagna) mangalPlacements.push(`Mars in House ${marsHouseLagna} from Ascendant (Lagna)`);
  if (isMangalMoon) mangalPlacements.push(`Mars in House ${marsHouseMoon} from Moon Sign`);

  // Kaal Sarp Dosha check (If all planets sun..saturn lie between Rahu & Ketu axis)
  const rahuLong = rahu.longitude;
  const ketuLong = ketu.longitude;
  const otherPlanets = planets.filter((p) => !['rahu', 'ketu'].includes(p.id));

  let countOneWay = 0;
  otherPlanets.forEach((p) => {
    let diff = normalizeAngle(p.longitude - rahuLong);
    let rkDiff = normalizeAngle(ketuLong - rahuLong);
    if (diff < rkDiff) countOneWay++;
  });

  const hasKaalSarp = countOneWay === 7 || countOneWay === 0;

  // Sade Sati check (Saturn in 12th, 1st, or 2nd house from Moon Sign)
  let saturnDiff = saturn.signId - moon.signId;
  if (saturnDiff > 6) saturnDiff -= 12;
  if (saturnDiff < -6) saturnDiff += 12;

  const isSadeSati = [-1, 0, 1].includes(saturnDiff);
  let phase: 'First Phase (Rising)' | 'Second Phase (Peak)' | 'Third Phase (Setting)' | undefined = undefined;
  if (saturnDiff === -1) phase = 'First Phase (Rising)';
  if (saturnDiff === 0) phase = 'Second Phase (Peak)';
  if (saturnDiff === 1) phase = 'Third Phase (Setting)';

  return {
    mangalDosha: {
      hasDosha: hasMangal,
      severity: isMangalLagna && isMangalMoon ? 'High' : hasMangal ? 'Moderate' : 'None',
      description: hasMangal
        ? 'Mars placement creates Manglik influence affecting marriage and relationship dynamics. Remedial rituals or marrying another Manglik are traditional mitigations.'
        : 'No significant Manglik placement detected in primary natal chart houses.',
      placements: mangalPlacements,
      remedies: [
        'Kumbh Vivah ceremony prior to marriage.',
        'Chanting Hanuman Chalisa or Mangal Stotra regularly on Tuesdays.',
        'Donating red lentils (Masoor Dal) and copper items on Tuesdays.',
      ],
    },
    kaalSarpDosha: {
      hasDosha: hasKaalSarp,
      type: hasKaalSarp ? 'Anant / Vasuki Kaal Sarp' : undefined,
      description: hasKaalSarp
        ? 'All 7 major planets are hemmed between Rahu and Ketu nodes. May create initial delays followed by remarkable breakthroughs.'
        : 'Planets are well distributed across the zodiac without total nodal hemming.',
      remedies: [
        'Perform Rahu-Ketu Shanti Puja at Trimbakeshwar or Sri Kalahasti.',
        'Worship Lord Shiva with Mahamrityunjaya Mantra on Mondays.',
      ],
    },
    sadeSati: {
      isSadeSati,
      phase,
      saturnSign: saturn.signName,
      moonSign: moon.signName,
      description: isSadeSati
        ? `Transit Saturn is currently in proximity to your birth Moon sign (${phase}). A 7.5-year period emphasizing discipline and maturity.`
        : 'Saturn is currently in a harmonious relative position to your birth Moon sign.',
      remedies: [
        'Light a mustard oil lamp under a Peepal tree on Saturdays.',
        'Chant Shani Mantra: Om Sham Shanayscharaya Namah.',
      ],
    },
  };
}

/** Ashtakoota 36-Point Gun Milan Matching for Two Charts */
export function calculateGunMilan(boyMoonSignId: number, boyNakshatraIndex: number, girlMoonSignId: number, girlNakshatraIndex: number): GunMilanResult {
  const kootas: KootaResult[] = [];

  // 1. Varna (1 Point)
  const varnaScores: { [key: number]: number } = { 1: 3, 2: 2, 3: 1, 4: 4, 5: 3, 6: 2, 7: 1, 8: 4, 9: 3, 10: 2, 11: 1, 12: 4 };
  const boyVarna = varnaScores[boyMoonSignId];
  const girlVarna = varnaScores[girlMoonSignId];
  const varnaPts = boyVarna >= girlVarna ? 1 : 0;
  kootas.push({
    name: 'Varna',
    sanskritName: 'वर्ण',
    maxPoints: 1,
    obtainedPoints: varnaPts,
    description: 'Measures spiritual ego and work compatibility.',
    boyAttribute: `Varna Grade ${boyVarna}`,
    girlAttribute: `Varna Grade ${girlVarna}`,
  });

  // 2. Vashya (2 Points)
  const vashyaPts = boyMoonSignId === girlMoonSignId ? 2 : (boyMoonSignId + girlMoonSignId) % 2 === 0 ? 1 : 0.5;
  kootas.push({
    name: 'Vashya',
    sanskritName: 'वश्य',
    maxPoints: 2,
    obtainedPoints: vashyaPts,
    description: 'Measures mutual attraction and influence in relationship.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignId - 1].name,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignId - 1].name,
  });

  // 3. Tara (3 Points)
  const taraDiff = Math.abs(boyNakshatraIndex - girlNakshatraIndex) % 9;
  const taraPts = [1, 3, 5, 7].includes(taraDiff) ? 1.5 : 3;
  kootas.push({
    name: 'Tara',
    sanskritName: 'तारा',
    maxPoints: 3,
    obtainedPoints: taraPts,
    description: 'Measures health, destiny, and longevity alignment.',
    boyAttribute: `Star ${boyNakshatraIndex + 1}`,
    girlAttribute: `Star ${girlNakshatraIndex + 1}`,
  });

  // 4. Yoni (4 Points)
  const yoniPts = (boyNakshatraIndex % 14 === girlNakshatraIndex % 14) ? 4 : Math.abs(boyNakshatraIndex - girlNakshatraIndex) % 4 === 0 ? 3 : 2;
  kootas.push({
    name: 'Yoni',
    sanskritName: 'योनि',
    maxPoints: 4,
    obtainedPoints: yoniPts,
    description: 'Measures physical affinity and intimate compatibility.',
    boyAttribute: `Yoni Type ${(boyNakshatraIndex % 7) + 1}`,
    girlAttribute: `Yoni Type ${(girlNakshatraIndex % 7) + 1}`,
  });

  // 5. Maitri (5 Points)
  const maitriPts = (boyMoonSignId % 4 === girlMoonSignId % 4) ? 5 : Math.abs(boyMoonSignId - girlMoonSignId) <= 3 ? 4 : 2.5;
  kootas.push({
    name: 'Graha Maitri',
    sanskritName: 'ग्रह मैत्री',
    maxPoints: 5,
    obtainedPoints: maitriPts,
    description: 'Measures mental compatibility and friendship between lords.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignId - 1].lord,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignId - 1].lord,
  });

  // 6. Gana (6 Points)
  const boyGana = boyNakshatraIndex % 3;
  const girlGana = girlNakshatraIndex % 3;
  const ganaPts = boyGana === girlGana ? 6 : (boyGana === 0 && girlGana === 1) || (boyGana === 1 && girlGana === 0) ? 5 : 1;
  const GANA_NAMES = ['Deva (Divine)', 'Manushya (Human)', 'Rakshasa (Fiery)'];
  kootas.push({
    name: 'Gana',
    sanskritName: 'गण',
    maxPoints: 6,
    obtainedPoints: ganaPts,
    description: 'Measures temperament, behavior, and lifestyle compatibility.',
    boyAttribute: GANA_NAMES[boyGana],
    girlAttribute: GANA_NAMES[girlGana],
  });

  // 7. Bhakoot (7 Points)
  const signDistance = Math.abs(boyMoonSignId - girlMoonSignId);
  const bhakootPts = [0, 1, 3, 4, 7, 8, 9, 10].includes(signDistance) ? 7 : 0;
  kootas.push({
    name: 'Bhakoot',
    sanskritName: 'भकूट',
    maxPoints: 7,
    obtainedPoints: bhakootPts,
    description: 'Measures emotional happiness, family growth, and prosperity.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignId - 1].sanskrit,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignId - 1].sanskrit,
  });

  // 8. Nadi (8 Points)
  const boyNadi = boyNakshatraIndex % 3;
  const girlNadi = girlNakshatraIndex % 3;
  const nadiPts = boyNadi !== girlNadi ? 8 : 0;
  const NADI_NAMES = ['Adi (Beginner)', 'Madhya (Middle)', 'Antya (End)'];
  kootas.push({
    name: 'Nadi',
    sanskritName: 'नाडी',
    maxPoints: 8,
    obtainedPoints: nadiPts,
    description: 'Measures genetic compatibility, health, and progeny.',
    boyAttribute: NADI_NAMES[boyNadi],
    girlAttribute: NADI_NAMES[girlNadi],
  });

  const totalPoints = kootas.reduce((sum, k) => sum + k.obtainedPoints, 0);

  let compatibilityLevel: 'Excellent' | 'Good' | 'Average' | 'Not Recommended' = 'Not Recommended';
  let recommendation = '';

  if (totalPoints >= 28) {
    compatibilityLevel = 'Excellent';
    recommendation = 'Outstanding compatibility! Highly auspicious match for marriage with exceptional harmony and prosperity.';
  } else if (totalPoints >= 21) {
    compatibilityLevel = 'Good';
    recommendation = 'Very good compatibility score. Favorable for a happy and successful marriage.';
  } else if (totalPoints >= 18) {
    compatibilityLevel = 'Average';
    recommendation = 'Acceptable score (above 18 points minimum). Remedies for low Nadi/Bhakoot recommended if present.';
  } else {
    compatibilityLevel = 'Not Recommended';
    recommendation = 'Below the recommended minimum threshold of 18 points. Astrology consultation is advised.';
  }

  return {
    boyName: 'Groom',
    girlName: 'Bride',
    boyMoonSign: ZODIAC_SIGNS[boyMoonSignId - 1].name,
    girlMoonSign: ZODIAC_SIGNS[girlMoonSignId - 1].name,
    boyNakshatra: `Nakshatra #${boyNakshatraIndex + 1}`,
    girlNakshatra: `Nakshatra #${girlNakshatraIndex + 1}`,
    totalPoints,
    maxPoints: 36,
    kootas,
    recommendation,
    compatibilityLevel,
  };
}
