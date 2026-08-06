import { GunMilanResult, KootaResult } from '../types/kundli';
import { NAKSHATRAS, ZODIAC_SIGNS } from './ephemeris';

export function calculateGunMilan(
  boyName: string,
  boyMoonSignIndex: number, // 0 to 11
  boyNakshatraIndex: number, // 0 to 26
  girlName: string,
  girlMoonSignIndex: number,
  girlNakshatraIndex: number
): GunMilanResult {
  const kootas: KootaResult[] = [];

  // 1. Varna Koota (1 point)
  // Brahmin, Kshatriya, Vaishya, Shudra based on signs
  const varnaOrder = [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]; // 3=Brahmin, 2=Kshatriya, 1=Vaishya, 0=Shudra
  const boyVarna = varnaOrder[boyMoonSignIndex];
  const girlVarna = varnaOrder[girlMoonSignIndex];
  const varnaPts = boyVarna >= girlVarna ? 1 : 0;
  kootas.push({
    name: 'Varna',
    sanskritName: 'वर्ण',
    maxPoints: 1,
    obtainedPoints: varnaPts,
    description: 'Ego and spiritual compatibility.',
    boyAttribute: ['Shudra', 'Vaishya', 'Kshatriya', 'Brahmin'][boyVarna],
    girlAttribute: ['Shudra', 'Vaishya', 'Kshatriya', 'Brahmin'][girlVarna],
  });

  // 2. Vashya Koota (2 points)
  const vashyaPts = (boyMoonSignIndex + girlMoonSignIndex) % 2 === 0 ? 2 : 1;
  kootas.push({
    name: 'Vashya',
    sanskritName: 'वश्य',
    maxPoints: 2,
    obtainedPoints: vashyaPts,
    description: 'Mutual attraction and dominance balance.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignIndex].sanskrit,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignIndex].sanskrit,
  });

  // 3. Tara Koota (3 points)
  const countFromGirlToBoy = ((boyNakshatraIndex - girlNakshatraIndex + 27) % 27) + 1;
  const countFromBoyToGirl = ((girlNakshatraIndex - boyNakshatraIndex + 27) % 27) + 1;
  const tara1 = countFromGirlToBoy % 9;
  const tara2 = countFromBoyToGirl % 9;
  const auspiciousTaras = [1, 2, 4, 6, 8, 0];
  let taraPts = 0;
  if (auspiciousTaras.includes(tara1) && auspiciousTaras.includes(tara2)) taraPts = 3;
  else if (auspiciousTaras.includes(tara1) || auspiciousTaras.includes(tara2)) taraPts = 1.5;

  kootas.push({
    name: 'Tara',
    sanskritName: 'तारा',
    maxPoints: 3,
    obtainedPoints: taraPts,
    description: 'Destiny and longevity alignment.',
    boyAttribute: NAKSHATRAS[boyNakshatraIndex].name,
    girlAttribute: NAKSHATRAS[girlNakshatraIndex].name,
  });

  // 4. Yoni Koota (4 points)
  const yoniMatch = (boyNakshatraIndex % 14) === (girlNakshatraIndex % 14);
  const yoniPts = yoniMatch ? 4 : (boyNakshatraIndex + girlNakshatraIndex) % 3 === 0 ? 3 : 2;
  kootas.push({
    name: 'Yoni',
    sanskritName: 'योनि',
    maxPoints: 4,
    obtainedPoints: yoniPts,
    description: 'Physical and intimacy compatibility.',
    boyAttribute: `Yoni Group ${(boyNakshatraIndex % 14) + 1}`,
    girlAttribute: `Yoni Group ${(girlNakshatraIndex % 14) + 1}`,
  });

  // 5. Graha Maitri (5 points)
  const lordMatch = ZODIAC_SIGNS[boyMoonSignIndex].lord === ZODIAC_SIGNS[girlMoonSignIndex].lord;
  const maitriPts = lordMatch ? 5 : (boyMoonSignIndex + girlMoonSignIndex) % 2 === 0 ? 4 : 1;
  kootas.push({
    name: 'Graha Maitri',
    sanskritName: 'ग्रह मैत्री',
    maxPoints: 5,
    obtainedPoints: maitriPts,
    description: 'Psychological and friendship compatibility.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignIndex].lord,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignIndex].lord,
  });

  // 6. Gana Koota (6 points)
  const gans = ['Deva', 'Manushya', 'Rakshasa'];
  const boyGan = gans[boyNakshatraIndex % 3];
  const girlGan = gans[girlNakshatraIndex % 3];
  let ganaPts = 0;
  if (boyGan === girlGan) ganaPts = 6;
  else if ((boyGan === 'Deva' && girlGan === 'Manushya') || (boyGan === 'Manushya' && girlGan === 'Deva')) ganaPts = 5;
  else if (boyGan === 'Deva' && girlGan === 'Rakshasa') ganaPts = 1;

  kootas.push({
    name: 'Gana',
    sanskritName: 'गण',
    maxPoints: 6,
    obtainedPoints: ganaPts,
    description: 'Temperament and behavioral compatibility.',
    boyAttribute: boyGan,
    girlAttribute: girlGan,
  });

  // 7. Bhakoot Koota (7 points)
  const signDiff = Math.abs(boyMoonSignIndex - girlMoonSignIndex);
  let bhakootPts = 7;
  if ([1, 5, 6, 8].includes(signDiff)) bhakootPts = 0; // Dosha combinations: 2-12, 6-8, 5-9

  kootas.push({
    name: 'Bhakoot',
    sanskritName: 'भकूट',
    maxPoints: 7,
    obtainedPoints: bhakootPts,
    description: 'Family welfare, health, and prosperity.',
    boyAttribute: ZODIAC_SIGNS[boyMoonSignIndex].name,
    girlAttribute: ZODIAC_SIGNS[girlMoonSignIndex].name,
  });

  // 8. Nadi Koota (8 points)
  const nadis = ['Adi', 'Madhya', 'Antya'];
  const boyNadi = nadis[boyNakshatraIndex % 3];
  const girlNadi = nadis[girlNakshatraIndex % 3];
  const nadiPts = boyNadi !== girlNadi ? 8 : 0; // Nadi Dosha if same Nadi

  kootas.push({
    name: 'Nadi',
    sanskritName: 'नाडी',
    maxPoints: 8,
    obtainedPoints: nadiPts,
    description: 'Genetic compatibility and health of offspring.',
    boyAttribute: boyNadi,
    girlAttribute: girlNadi,
  });

  const totalPoints = kootas.reduce((sum, k) => sum + k.obtainedPoints, 0);

  let recommendation = '';
  let compatibilityLevel: 'Excellent' | 'Good' | 'Average' | 'Not Recommended' = 'Average';

  if (totalPoints >= 28) {
    compatibilityLevel = 'Excellent';
    recommendation = 'Exceptional astrological match! The alliance promises great marital happiness, prosperity, and mental harmony.';
  } else if (totalPoints >= 18) {
    compatibilityLevel = 'Good';
    recommendation = 'Good astrological match. Auspicious for marriage with minor remediable differences.';
  } else if (totalPoints >= 12) {
    compatibilityLevel = 'Average';
    recommendation = 'Average score. Careful review of individual Kundli charts and remedies is recommended before proceeding.';
  } else {
    compatibilityLevel = 'Not Recommended';
    recommendation = 'Below recommended threshold (18 Gunas). Detailed chart consultation and remedy evaluation advised.';
  }

  return {
    boyName: boyName || 'Boy',
    girlName: girlName || 'Girl',
    boyMoonSign: ZODIAC_SIGNS[boyMoonSignIndex].name,
    girlMoonSign: ZODIAC_SIGNS[girlMoonSignIndex].name,
    boyNakshatra: NAKSHATRAS[boyNakshatraIndex].name,
    girlNakshatra: NAKSHATRAS[girlNakshatraIndex].name,
    totalPoints,
    maxPoints: 36,
    kootas,
    recommendation,
    compatibilityLevel,
  };
}
