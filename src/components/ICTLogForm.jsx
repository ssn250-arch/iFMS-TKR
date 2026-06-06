import React, { useState } from 'react';
import { User, IdCard, MapPin, Server, PcCase, Calendar, Clock, ClipboardList, Send } from 'lucide-react';

const ICTLog = ({ onBack }) => {
  const [lokasi, setLokasi] = useState('');

  // Untuk handle form submission sementara
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Fungsi hantar borang akan dikemaskini nanti!");
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-slate-200">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-500 rounded-full opacity-10 blur-xl"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Pendaftaran Penggunaan</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Sila lengkapkan maklumat di bawah sebelum menggunakan kemudahan makmal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Penuh <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="w-5 h-5 text-slate-400" /></div>
                <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" placeholder="Masukkan nama penuh anda" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">No. Matrik <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdCard className="w-5 h-5 text-slate-400" /></div>
                <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" placeholder="Contoh: 123456" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi (Lab) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="w-5 h-5 text-slate-400" /></div>
                <select required value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base">
                  <option value="" disabled hidden>Pilih Makmal</option>
                  <option value="Lab Aplikasi">Lab Aplikasi</option>
                  <option value="Lab Server">Lab Server</option>
                  <option value="Lab Troubleshooting">Lab Troubleshooting</option>
                  <option value="Lab Maintenance">Lab Maintenance</option>
                </select>
              </div>
            </div>

            {/* Muncul hanya jika Lab Server dipilih */}
            {lokasi === 'Lab Server' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Server <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Server className="w-5 h-5 text-slate-400" /></div>
                  <select required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base">
                    <option value="" disabled selected hidden>Pilih Server</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={`Server ${i + 1}`}>Server {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">No. PC <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PcCase className="w-5 h-5 text-slate-400" /></div>
                <select required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base">
                  <option value="" disabled selected hidden>Pilih PC</option>
                  {[...Array(30)].map((_, i) => (
                    <option key={i} value={`PC ${i + 1}`}>PC {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tarikh Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="w-5 h-5 text-slate-400" /></div>
                <input type="date" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Masa Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock className="w-5 h-5 text-slate-400" /></div>
                <input type="time" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tujuan Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute top-3.5 left-3 flex items-start pointer-events-none"><ClipboardList className="w-5 h-5 text-slate-400" /></div>
                <textarea rows="3" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" placeholder="Contoh: Menyiapkan tugasan AutoCAD, carian internet..."></textarea>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all transform active:scale-95 text-base">
              <Send className="w-5 h-5" />
              <span>Hantar Rekod Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ICTLog;