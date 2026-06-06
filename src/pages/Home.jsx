import React from 'react';
import { MonitorSmartphone, Wrench } from 'lucide-react';

const Home = ({ onOpenForm, onOpenAduan }) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 fade-in relative z-10 w-full max-w-7xl mx-auto">
      
      {/* Bahagian Header Utama */}
      <div className="text-center mb-8 sm:mb-12">
         <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-blue-100">Portal Rasmi</div>
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight">
           Integrated Facility <br className="hidden sm:block" /> Management System
         </h1>
         <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
           Pusat sehenti pengurusan fasiliti dan peralatan ICT bagi Jabatan Teknologi Komputer (Rangkaian) ADTEC Sandakan.
         </p>
      </div>

      {/* Bahagian Kad Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full max-w-5xl">
         
         {/* KAD 1: Log Penggunaan */}
         <div className="glass-panel rounded-[2rem] p-6 sm:p-8 card-hover-effect flex flex-col h-full bg-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 sm:mb-8">
               <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shadow-inner">
                  <MonitorSmartphone size={32} strokeWidth={1.5} />
               </div>
               <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Aktif
               </span>
            </div>
            <div className="flex-grow">
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Log Penggunaan Peralatan ICT</h2>
               <p className="text-slate-500 text-sm leading-relaxed">Pendaftaran masuk untuk pelajar sebelum menggunakan kemudahan makmal, PC, atau pelayan (server).</p>
            </div>
            <button onClick={onOpenForm} className="w-full mt-6 bg-slate-900 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 text-sm sm:text-base">
               Akses Log Masuk
            </button>
         </div>

         {/* KAD 2: Aduan Kerosakan ICT */}
         <div className="glass-panel rounded-[2rem] p-6 sm:p-8 card-hover-effect flex flex-col h-full bg-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 sm:mb-8">
               <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl shadow-inner">
                  <Wrench size={32} strokeWidth={1.5} />
               </div>
               <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Aktif
               </span>
            </div>
            <div className="flex-grow">
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Aduan Kerosakan ICT</h2>
               <p className="text-slate-500 text-sm leading-relaxed">Sistem pelaporan masalah teknikal, kerosakan PC, atau isu rangkaian untuk tindakan penyelenggaraan.</p>
            </div>
            <button onClick={onOpenAduan} className="w-full mt-6 bg-slate-900 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 text-sm sm:text-base">
               Akses Portal Aduan
            </button>
         </div>

      </div>
    </main>
  );
};

export default Home;