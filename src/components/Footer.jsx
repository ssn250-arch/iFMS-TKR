import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    // Tambah w-full dan mt-auto supaya ia tolak ke bawah dan penuh kiri kanan
    <footer className="bg-slate-900 text-slate-400 py-4 sm:py-6 md:py-8 border-t border-slate-800 relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] sm:text-xs md:text-sm tracking-wide leading-relaxed">
          Hak cipta terpelihara &copy; {currentYear} 
          <br className="block sm:hidden" />
          <span className="hidden sm:inline mx-2 text-slate-600">|</span> 
          TKR ADTEC JTM Kampus Sandakan.
        </p>
      </div>
    </footer>
  );
};

export default Footer;