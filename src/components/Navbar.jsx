import React, { useState, useEffect } from 'react';
import { Home, Layers, MonitorSmartphone } from 'lucide-react';
import logo from '../assets/logo.png'; // Pastikan path ke logo betul

const Navbar = ({ currentView, onBackHome }) => {
  // State untuk kesan scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Jika scroll ke bawah dan melepasi 50px, sembunyikan header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // Jika scroll ke atas, tunjukkan semula header
      else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Bersihkan event listener bila komponen tak digunakan
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    // Tambah logik isVisible pada className: translate-y-0 (tunjuk) / -translate-y-full (sorok)
    <nav className={`glass-nav sticky top-0 z-40 border-b border-slate-200/60 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-3 sm:py-0 gap-3 sm:gap-0">
          
          {/* Bahagian Logo & Butang Kembali Moden */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            {currentView === 'form' && (
              <button 
                onClick={onBackHome} 
                className="group flex items-center gap-2.5 px-2 py-2 sm:px-3 sm:py-2 bg-white/80 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-blue-700 font-semibold text-sm backdrop-blur-sm active:scale-95"
              >
                <div className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white p-1.5 rounded-full transition-all duration-300 shadow-inner">
                  <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
                <span className="hidden sm:inline pr-2 tracking-wide">Menu Utama</span>
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