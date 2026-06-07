import React from 'react';
import { Cone } from 'lucide-react';

const ConstructionModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 fade-in">
      {/* Latar Belakang Gelap (Klik untuk tutup) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Kad Modal Utama */}
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-popIn border border-slate-100 z-10">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Cone className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Harap Maklum</h3>
        <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed">
          Modul <strong>Aduan Kerosakan ICT</strong> kini sedang dalam fasa pembinaan dan naik taraf. Ia akan dibuka tidak lama lagi.
        </p>
        <button 
          onClick={onClose} 
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default ConstructionModal;