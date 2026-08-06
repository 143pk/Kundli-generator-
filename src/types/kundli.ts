export type AyanamshaSystem = 'lahiri' | 'krishnamurti' | 'raman' | 'fagan_bradley' | 'tropical';
export type NodeCalculation = 'true' | 'mean';
export type HouseSystem = 'equal' | 'sripati' | 'placidus';

export interface EngineSettings {
  ayanamshaSystem: AyanamshaSystem;
  nodeCalculation: NodeCalculation;
  houseSystem: HouseSystem;
  useTopocentricCorrection: boolean;
  deltaTCorrection: boolean;
}

export interface BirthDetails {
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  placeName: string;
  latitude: number; // Decimal degrees
  longitude: number; // Decimal degrees
  timezone: number; // Offset in hours (e.g., +5.5 for IST)
  engineSettings?: EngineSettings;
}

export type DignityState = 'Exalted' | 'Moolatrikona' | 'Own Sign' | 'Great Friend' | 'Friend' | 'Neutral' | 'Enemy' | 'Great Enemy' | 'Debilitated';

export interface PlanetPosition {
  id: string; // 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'
  name: string; // English
  sanskritName: string; // Sanskrit/Hindi name (Surya, Chandra, Mangal...)
  symbol: string;
  longitude: number; // 0° to 360° total sidereal longitude
  signId: number; // 1 to 12 (1 = Aries/Mesha, 12 = Pisces/Meena)
  signName: string; // English
  signSanskrit: string; // Mesha, Vrishabha...
  signLord: string;
  degreeInSign: number; // 0° to 30°
  formattedDegree: string; // e.g. "14° 23' 12\""
  nakshatra: string;
  nakshatraLord: string;
  pada: number; // 1 to 4
  house: number; // 1 to 12 relative to Lagna
  isRetrograde: boolean;
  isCombust?: boolean;
  speed?: number; // Daily motion in degrees per day
  formattedSpeed?: string; // e.g. "+0° 59' 08\" / day"
  dignity?: DignityState;
  combustOrb?: number; // Angular distance to Sun in degrees
}

export interface HouseInfo {
  houseNumber: number; // 1 to 12
  signId: number;
  signName: string;
  signSanskrit: string;
  signLord: string;
  startDegree: number;
  cuspDegree?: number; // House cusp degree
  formattedCuspDegree?: string;
  planetsPresent: PlanetPosition[];
  significance: string;
  sanskritTitle: string;
}

export interface EphemerisDiagnostics {
  julianDay: number;
  julianCenturies: number;
  gmst: number; // Greenwich Mean Sidereal Time (deg)
  lst: number; // Local Sidereal Time (deg)
  obliquityEcliptic: number; // True Obliquity (deg)
  ayanamshaValue: number; // Ayanamsha in degrees
  ayanamshaName: string;
  deltaTSeconds: number;
  nodeMode: string;
  houseSystemName: string;
  geocentricLatitude: number;
  geocentricLongitude: number;
}

export interface ChartData {
  lagnaSignId: number;
  lagnaSignName: string;
  lagnaSignSanskrit: string;
  lagnaDegree: number;
  formattedLagnaDegree: string;
  ayanamsha: number; // Ayanamsha value
  ayanamshaName: string;
  planets: PlanetPosition[];
  houses: HouseInfo[];
  navamshaPlanets: { [planetId: string]: number }; // Sign ID (1-12) for D9
  dashamshaPlanets?: { [planetId: string]: number }; // Sign ID (1-12) for D10
  diagnostics?: EphemerisDiagnostics;
}

export interface DashaPeriod {
  planet: string;
  planetSanskrit: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent: boolean;
  subPeriods?: {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }[];
}

export interface DoshaAnalysis {
  mangalDosha: {
    hasDosha: boolean;
    severity: 'None' | 'Low' | 'Moderate' | 'High';
    description: string;
    placements: string[];
    remedies: string[];
  };
  kaalSarpDosha: {
    hasDosha: boolean;
    type?: string;
    description: string;
    remedies: string[];
  };
  sadeSati: {
    isSadeSati: boolean;
    phase?: 'First Phase (Rising)' | 'Second Phase (Peak)' | 'Third Phase (Setting)';
    saturnSign: string;
    moonSign: string;
    description: string;
    remedies: string[];
  };
}

export interface KundliReport {
  birthDetails: BirthDetails;
  chartData: ChartData;
  dashaPeriods: DashaPeriod[];
  doshaAnalysis: DoshaAnalysis;
  panchang: {
    tithi: string;
    vaara: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
  summary: {
    sunSign: string;
    moonSign: string;
    ascendantSign: string;
    nakshatra: string;
    nakshatraLord: string;
    pada: number;
    gan: string;
    yoni: string;
    nadi: string;
  };
}

export interface KootaResult {
  name: string;
  sanskritName: string;
  maxPoints: number;
  obtainedPoints: number;
  description: string;
  boyAttribute: string;
  girlAttribute: string;
}

export interface GunMilanResult {
  boyName: string;
  girlName: string;
  boyMoonSign: string;
  girlMoonSign: string;
  boyNakshatra: string;
  girlNakshatra: string;
  totalPoints: number;
  maxPoints: number;
  kootas: KootaResult[];
  recommendation: string;
  compatibilityLevel: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
}

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  tz: number;
}
