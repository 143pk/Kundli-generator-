import React, { useState } from 'react';
import { Header } from './components/Header';
import { BirthForm } from './components/BirthForm';
import { KundliChart } from './components/KundliChart';
import { PlanetaryTable } from './components/PlanetaryTable';
import { DashaTimeline } from './components/DashaTimeline';
import { DoshaSection } from './components/DoshaSection';
import { HouseAnalysis } from './components/HouseAnalysis';
import { GunMilanTool } from './components/GunMilanTool';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { BirthDetails, KundliReport } from './types/kundli';
import { generateKundli } from './utils/kundliCalc';
import { Compass, Sparkles, Sun, Moon, MapPin, Calendar, Clock, UserCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'kundli' | 'matching' | 'faq'>('kundli');

  // Initial default birth details
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    name: 'Rahul Sharma',
    gender: 'male',
    dateOfBirth: '1995-08-15',
    timeOfBirth: '08:30',
    placeName: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  const [report, setReport] = useState<KundliReport>(() => generateKundli(birthDetails));

  const handleFormSubmit = (details: BirthDetails) => {
    setBirthDetails(details);
    const newReport = generateKundli(details);
    setReport(newReport);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onPrint={handlePrint} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Ad Banner Slot 1: Top Bar */}
        <AdBanner slotId={1} label="Top Banner Advertisement" />

        {/* Hero Section */}
        <section className="my-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nirayana Sidereal Vedic Ephemeris Engine</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">
            Vedic Kundli Generator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Generate accurate Janam Kundli birth charts, Lagna D1 & Navamsha D9 divisional charts, 120-year Vimshottari Dasha, planetary positions, Mangal Dosha, and 36-Guna Kundli matching online for free.
          </p>
        </section>

        {/* TAB 1: Kundli Generator */}
        {activeTab === 'kundli' && (
          <div className="space-y-8">
            {/* Ad Banner Slot 2: Above Birth Details Form */}
            <AdBanner slotId={2} label="Form Header Advertisement" />

            {/* Form Section */}
            <section id="section-form">
              <BirthForm onSubmit={handleFormSubmit} initialDetails={birthDetails} />
            </section>

            {/* Ad Banner Slot 3: Below Birth Details Form */}
            <AdBanner slotId={3} label="Post-Form Advertisement" />

            {/* Report Output Section */}
            {report && (
              <div className="space-y-8">
                {/* Summary Card */}
                <section id="section-summary" className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-amber-400" />
                        <span>Janam Kundli Report for {report.birthDetails.name}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Born on {report.birthDetails.dateOfBirth} at {report.birthDetails.timeOfBirth} in {report.birthDetails.placeName}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-semibold text-amber-300">
                        Ascendant: {report.summary.ascendantSign}
                      </span>
                      <span className="rounded-lg bg-sky-500/10 border border-sky-500/30 px-3 py-1 font-semibold text-sky-300">
                        Moon Sign: {report.summary.moonSign}
                      </span>
                      <span className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1 font-semibold text-rose-300">
                        Nakshatra: {report.summary.nakshatra} (Pada {report.summary.pada})
                      </span>
                    </div>
                  </div>

                  {/* Quick Summary Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sun Sign</span>
                      <span className="font-bold text-amber-400 mt-1 block">{report.summary.sunSign}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Moon Sign</span>
                      <span className="font-bold text-sky-400 mt-1 block">{report.summary.moonSign}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nakshatra Lord</span>
                      <span className="font-bold text-rose-400 mt-1 block">{report.summary.nakshatraLord}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Gana</span>
                      <span className="font-bold text-emerald-400 mt-1 block">{report.summary.gan}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Yoni</span>
                      <span className="font-bold text-purple-400 mt-1 block">{report.summary.yoni}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nadi</span>
                      <span className="font-bold text-amber-300 mt-1 block">{report.summary.nadi}</span>
                    </div>
                  </div>
                </section>

                {/* Ad Banner Slot 4: Above Charts */}
                <AdBanner slotId={4} label="Chart Section Advertisement" />

                {/* Charts Grid: D1 Lagna & D9 Navamsha */}
                <section id="section-charts" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <KundliChart chartData={report.chartData} title="Lagna D1 Birth Chart" type="d1" />
                  <KundliChart chartData={report.chartData} title="Navamsha D9 Chart" type="d9" />
                </section>

                {/* Planetary Positions Table */}
                <section id="section-planets">
                  <PlanetaryTable chartData={report.chartData} />
                </section>

                {/* Ad Banner Slot 5: Between Planetary Table and Dasha Timeline */}
                <AdBanner slotId={5} label="Planetary Table Banner" />

                {/* Vimshottari Dasha Timeline */}
                <section id="section-dasha">
                  <DashaTimeline dashaPeriods={report.dashaPeriods} />
                </section>

                {/* Ad Banner Slot 6: Inside Doshas */}
                <AdBanner slotId={6} label="Dosha Section Advertisement" />

                {/* Dosha Analysis */}
                <section id="section-doshas">
                  <DoshaSection dosha={report.doshaAnalysis} />
                </section>

                {/* Ad Banner Slot 7: Above House Analysis */}
                <AdBanner slotId={7} label="House Analysis Banner" />

                {/* House Analysis (12 Bhavas) */}
                <section id="section-houses">
                  <HouseAnalysis chartData={report.chartData} />
                </section>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Gun Milan / Matching */}
        {activeTab === 'matching' && (
          <div className="space-y-8">
            {/* Ad Banner Slot 8: Above Gun Milan */}
            <AdBanner slotId={8} label="Matching Section Advertisement" />

            <section id="section-matching">
              <GunMilanTool />
            </section>
          </div>
        )}

        {/* TAB 3: FAQ / Knowledge Base */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            {/* Ad Banner Slot 9: Above FAQs */}
            <AdBanner slotId={9} label="Knowledge Base Advertisement" />

            <section id="section-faq">
              <FAQSection />
            </section>
          </div>
        )}

        {/* Ad Banner Slot 10: Footer Top Banner */}
        <AdBanner slotId={10} label="Bottom Footer Advertisement" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
