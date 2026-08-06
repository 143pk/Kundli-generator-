import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Sparkles, Search, Globe } from 'lucide-react';
import { BirthDetails, CityData } from '../types/kundli';
import { POPULAR_CITIES } from '../data/cities';

interface BirthFormProps {
  onSubmit: (details: BirthDetails) => void;
  initialDetails?: BirthDetails;
}

export const BirthForm: React.FC<BirthFormProps> = ({ onSubmit, initialDetails }) => {
  const [name, setName] = useState(initialDetails?.name || 'Rahul Sharma');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialDetails?.gender || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(initialDetails?.dateOfBirth || '1995-08-15');
  const [timeOfBirth, setTimeOfBirth] = useState(initialDetails?.timeOfBirth || '08:30');
  const [placeName, setPlaceName] = useState(initialDetails?.placeName || 'New Delhi, India');
  const [latitude, setLatitude] = useState<number>(initialDetails?.latitude || 28.6139);
  const [longitude, setLongitude] = useState<number>(initialDetails?.longitude || 77.209);
  const [timezone, setTimezone] = useState<number>(initialDetails?.timezone || 5.5);

  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSelectCity = (city: CityData) => {
    setPlaceName(city.name);
    setLatitude(city.lat);
    setLongitude(city.lng);
    setTimezone(city.tz);
    setShowCityDropdown(false);
    setCitySearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeName,
      latitude,
      longitude,
      timezone,
    });
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400">Enter Birth Details (Janam Kundli)</h2>
          <p className="text-xs text-slate-400">Accurate time and coordinates yield precise planetary positions & dasha</p>
        </div>
        <div className="rounded-full bg-amber-500/10 p-2 text-amber-400">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name & Gender */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="input-name" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <User className="h-3.5 w-3.5 text-amber-400" /> Full Name
            </label>
            <input
              id="input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="input-gender" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  id={`btn-gender-${g}`}
                  onClick={() => setGender(g)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold capitalize transition ${
                    gender === g
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm'
                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Date & Time of Birth */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="input-dob" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-amber-400" /> Date of Birth
            </label>
            <input
              id="input-dob"
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="input-tob" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-amber-400" /> Time of Birth (24-Hour Format)
            </label>
            <input
              id="input-tob"
              type="time"
              required
              value={timeOfBirth}
              onChange={(e) => setTimeOfBirth(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Row 3: Place of Birth & Quick City Auto-Suggest */}
        <div className="relative">
          <label htmlFor="input-place" className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> Place of Birth / City Search
            </span>
            <span className="text-[11px] text-amber-500/80">Select from quick list or edit manually below</span>
          </label>

          <div className="relative">
            <input
              id="input-place"
              type="text"
              required
              value={placeName}
              onFocus={() => setShowCityDropdown(true)}
              onChange={(e) => {
                setPlaceName(e.target.value);
                setCitySearch(e.target.value);
                setShowCityDropdown(true);
              }}
              placeholder="Type city name (e.g. New Delhi, Mumbai, New York...)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 pl-9 text-sm text-slate-100 placeholder-slate-500 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          </div>

          {/* City Dropdown */}
          {showCityDropdown && (
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl backdrop-blur-lg">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Popular Cities
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-slate-200 hover:bg-amber-500/20 hover:text-amber-300"
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Lat: {city.lat}°, Lng: {city.lng}°, UTC{city.tz >= 0 ? `+${city.tz}` : city.tz}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400">
                  No preset match found. You can manually enter Latitude/Longitude below.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coordinates & Timezone Details (Manual Adjustments) */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 sm:grid-cols-3">
          <div>
            <label htmlFor="input-lat" className="mb-1 block text-[11px] font-semibold text-slate-400">
              Latitude (Decimal °)
            </label>
            <input
              id="input-lat"
              type="number"
              step="0.0001"
              required
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="input-lng" className="mb-1 block text-[11px] font-semibold text-slate-400">
              Longitude (Decimal °)
            </label>
            <input
              id="input-lng"
              type="number"
              step="0.0001"
              required
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="input-tz" className="mb-1 block text-[11px] font-semibold text-slate-400">
              Timezone Offset (Hours UTC)
            </label>
            <input
              id="input-tz"
              type="number"
              step="0.25"
              required
              value={timezone}
              onChange={(e) => setTimezone(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="btn-generate-kundli"
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
        >
          <Sparkles className="h-5 w-5 transition group-hover:rotate-12" />
          <span>Generate Free Janam Kundli</span>
        </button>
      </form>
    </div>
  );
};
