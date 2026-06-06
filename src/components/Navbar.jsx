import React, { useState, useEffect } from 'react';
import { Home, Layers, MonitorSmartphone } from 'lucide-react';
import logo from '../assets/logo.png'; // Pastikan path ke logo betul

const Navbar = ({ currentView, onBackHome }) => {
  const [isVisible, setIsVisible] = useState(true);

  // 1. Tunjukkan header secara paksa setiap kali pertukaran view (Home / Form)
  useEffect(() => {
    setIsVisible(true);
  }, [currentView]);

  // 2. Logik Auto-Hide yang dikemaskini (Lebih agresif dan tepat)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Jika berada di paling atas skrin (Top), sentiasa tunjuk header
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } 
      // Jika scroll turun (lebih 5px untuk elak skrin bergetar) -> Sorok Header
      else if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } 
      // Jika scroll naik semula -> Tunjuk Header
      else if (currentScrollY < lastScrollY - 5) {
        setIsVisible(true);
      }

      // Kemaskini titik terakhir scroll
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Fungsi khas bila butang "Menu Utama" ditekan
  const handleHomeClick = () => {
    if (onBackHome) onBackHome();
    // Skrol perlahan ke atas bila kembali ke Home
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setIsVisible(true); // Paksa header keluar semula
  };

  return (
    <nav className={`glass-nav sticky top-0 z-40 border-b border-slate-200/60 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-row items-center justify-between h-16 sm:h-20 py-2 sm:py-0">
          
          {/* Bahagian Logo & Butang Kembali */}
          <div className="flex items-center gap-2 sm:gap-4">
            {currentView === 'form' && (
              <button 
                onClick={handleHomeClick} 
                className="group flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-white/80 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full shadow-sm transition-all duration-300 text-slate-600 hover:text-blue-700 font-semibold text-xs sm:text-sm active:scale-95"
              >
                <div className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white p-1 sm:p-1.5 rounded-full transition-all duration-300">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <span className="hidden sm:inline pr-1 tracking-wide">Menu Utama</span>
              </button>
            )}
            <img src={logo} alt="Logo ADTEC" className="h-8 sm:h-12 w-auto object-contain drop-shadow-sm" />
          </div>

          {/* Bahagian Tajuk Sistem */}
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-50 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full border border-slate-100 shadow-inner">
              <div className={`p-1 sm:p-1.5 rounded-full text-white shadow-md ${currentView === 'home' ? 'bg-gradient-to-tr from-blue-700 to-indigo-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'}`}>
                {currentView === 'home' ? <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> : <MonitorSmartphone className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
              </div>
              <span className={`font-bold tracking-wide bg-clip-text text-transparent ${currentView === 'home' ? 'text-xs sm:text-base md:text-lg bg-gradient-to-r from-blue-900 to-indigo-800' : 'text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-blue-800 to-indigo-800 uppercase font-extrabold'}`}>
                {currentView === 'home' ? 'iFMS-TKR' : 'E-Log Makmal'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;