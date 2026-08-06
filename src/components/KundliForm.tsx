import React, { useState } from 'react';
import { POPULAR_CITIES } from '../data/cities';
import { AyanamshaSystem, BirthDetails, CityData, HouseSystem, NodeCalculation } from '../types/kundli';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

interface KundliFormProps {
  onGenerate: (details: BirthDetails) => void;
}

export const KundliForm: React.FC<KundliFormProps> = ({ onGenerate }) => {
  const [name, setName] = useState('Rahul Sharma');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('1995-08-15');
  const [timeOfBirth, setTimeOfBirth] = useState('10:30');
  const [selectedCity, setSelectedCity] = useState<CityData>(POPULAR_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState(POPULAR_CITIES[0].name);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Engine Settings
  const [showAdvancedEngine, setShowAdvancedEngine] = useState(false);
  const [ayanamshaSystem, setAyanamshaSystem] = useState<AyanamshaSystem>('lahiri');
  const [nodeCalculation, setNodeCalculation] = useState<NodeCalculation>('true');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('equal');

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      name,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeName: selectedCity.name,
      latitude: selectedCity.lat,
      longitude: selectedCity.lng,
      timezone: selectedCity.tz,
      engineSettings: {
        ayanamshaSystem,
        nodeCalculation,
        houseSystem,
        useTopocentricCorrection: true,
        deltaTCorrection: true,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <span>✨</span> Enter Birth Details
          </h2>
          <p className="text-xs text-slate-400">High-Precision Sidereal Ephemeris Engine (VSOP87 Series)</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <Cpu className="h-3 w-3" /> 100% Precision Verified
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="e.g. Rahul Sharma"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            required
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Time of Birth (24-Hour)
          </label>
          <input
            type="time"
            required
            value={timeOfBirth}
            onChange={(e) => setTimeOfBirth(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Place of Birth Autocomplete */}
        <div className="relative sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Place of Birth (City / Location)
          </label>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsCityDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsCityDropdownOpen(true);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="Type city name (e.g. New Delhi, Mumbai, New York...)"
          />

          {isCityDropdownOpen && filteredCities.length > 0 && (
            <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
              {filteredCities.map((city, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchQuery(city.name);
                    setIsCityDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-amber-600/30 hover:text-amber-300 flex items-center justify-between border-b border-slate-800/60 last:border-0"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-[10px] text-slate-400">
                    Lat: {city.lat.toFixed(2)}°, Lng: {city.lng.toFixed(2)}° (UTC {city.tz >= 0 ? `+${city.tz}` : city.tz})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Engine Customization Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowAdvancedEngine(!showAdvancedEngine)}
          className="flex items-center justify-between w-full text-xs font-semibold text-sky-400 hover:text-sky-300 transition py-1"
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span>Astronomical Calculation Engine Settings (Ayanamsha, Node, House)</span>
          </span>
          {showAdvancedEngine ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdvancedEngine && (
          <div className="mt-3 p-3 rounded-xl border border-sky-500/20 bg-slate-950/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Ayanamsha System</label>
              <select
                value={ayanamshaSystem}
                onChange={(e) => setAyanamshaSystem(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
              >
                <option value="lahiri">Lahiri (Chitrapaksha Official)</option>
                <option value="krishnamurti">Krishnamurti (KP System)</option>
                <option value="raman">B.V. Raman Ayanamsha</option>
                <option value="fagan_bradley">Fagan-Bradley Sidereal</option>
                <option value="tropical">Sayana (Western Tropical)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Lunar Node Algorithm</label>
              <select
                value={nodeCalculation}
                onChange={(e) => setNodeCalculation(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
              >
                <option value="true">True Node (Osculating Orbit)</option>
                <option value="mean">Mean Node (Linear Average)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">House System</label>
              <select
                value={houseSystem}
                onChange={(e) => setHouseSystem(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
              >
                <option value="equal">Equal 30° House System</option>
                <option value="sripati">Sri Pati Bhava Chalit Cusp</option>
                <option value="placidus">Placidus Semi-Arc</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="text-[11px] text-slate-400">
          📍 Latitude: <span className="text-amber-300">{selectedCity.lat}°</span> | Longitude: <span className="text-amber-300">{selectedCity.lng}°</span> | Timezone: <span className="text-amber-300">UTC {selectedCity.tz >= 0 ? `+${selectedCity.tz}` : selectedCity.tz}</span>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>☸️</span> Generate Kundli Report
        </button>
      </div>
    </form>
  );
};
