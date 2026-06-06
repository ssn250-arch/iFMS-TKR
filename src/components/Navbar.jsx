import React from 'react';
import { ChevronLeft, Layers, MonitorSmartphone } from 'lucide-react';
import logo from '../assets/logo.png'; // Pastikan path ke logo betul

const Navbar = ({ currentView, onBackHome }) => {
  return (
    <nav className="glass-nav sticky top-0 z-40 border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-3 sm:py-0 gap-3 sm:gap-0">
          
          {/* Bahagian Logo & Butang Kembali */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            {currentView === 'form' && (
              <button 
                onClick={onBackHome} 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}
            <img src={logo} alt="Logo ADTEC" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" />
          </div>

          {/* Bahagian Tajuk Sistem */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-100 shadow-inner">
              <div className={`p-1.5 rounded-full text-white shadow-md ${currentView === 'home' ? 'bg-gradient-to-tr from-blue-700 to-indigo-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'}`}>
                {currentView === 'home' ? <Layers className="w-5 h-5" /> : <MonitorSmartphone className="w-4 sm:w-5 h-4 sm:h-5" />}
              </div>
              <span className={`font-bold tracking-wide bg-clip-text text-transparent ${currentView === 'home' ? 'text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-900 to-indigo-800' : 'text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-800 to-indigo-800 uppercase font-extrabold'}`}>
                {currentView === 'home' ? 'iFMS-TKR' : 'E-Log Makmal Komputer'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;