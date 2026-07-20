import React from 'react';
import { Wrench, MonitorSmartphone, ArrowRight } from 'lucide-react';

const Home = ({ onOpenForm, onOpenAduan }) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative fade-in">
      {/* Kesan Cahaya (Glow Effects) */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
      <div 
        className="absolute bottom-10 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none" 
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 mt-8">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm">
            Portal Rasmi
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Integrated ICT Facility<br className="hidden sm:block" /> Management System
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Portal rasmi pengurusan fasiliti dan peralatan ICT bagi Bengkel Teknologi Komputer (Rangkaian) ADTEC JTM Kampus Sandakan.
          </p>
        </div>

        {/* Grid Menu Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          
          {/* KAD 1: Log Penggunaan Peralatan ICT (Aktif) */}
          <button 
            onClick={onOpenForm} 
            className="text-left w-full card-hover-effect group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg block overflow-hidden isolate outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Aktif
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-50 group-hover:scale-110 transition-transform duration-500">
              <MonitorSmartphone className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">Log Penggunaan Peralatan ICT</h2>
            <p className="text-sm sm:text-base text-slate-500 mb-6">Pendaftaran masuk untuk pelajar sebelum menggunakan kemudahan PC, pelayan, dan makmal TKR.</p>
            <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Buka Borang Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
          
          {/* KAD 2: Aduan Kerosakan ICT (Telah Diaktifkan) */}
          <button 
            onClick={onOpenAduan} 
            className="text-left w-full card-hover-effect group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg block overflow-hidden isolate outline-none focus:ring-4 focus:ring-orange-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Aktif
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-orange-50 group-hover:scale-110 transition-transform duration-500">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 group-hover:text-orange-700 transition-colors">Aduan Kerosakan ICT</h2>
            <p className="text-sm sm:text-base text-slate-500 mb-6">Sistem pelaporan masalah teknikal, kerosakan PC, atau isu rangkaian untuk tindakan penyelenggaraan.</p>
            <div className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Buka Portal ServeDesk+</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

        </div>
      </div>
    </main>
  );
};

export default Home;