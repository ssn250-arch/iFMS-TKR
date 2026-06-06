import React, { useState } from 'react';

// Import semua komponen dan pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ICTLog from './pages/ICTLog'; 
import AduanICT from './pages/AduanICT'; // Import modul ServeDesk+ baru
import ConstructionModal from './components/ConstructionModal';

function App() {
  // State untuk kawal paparan utama (home, form, aduan)
  const [currentView, setCurrentView] = useState('home');
  
  // State untuk kawal Modal (buka atau tutup)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buka borang Log Penggunaan (berserta auto-scroll ke atas)
  const handleOpenForm = () => {
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buka portal Aduan Kerosakan ICT (berserta auto-scroll ke atas)
  const handleOpenAduan = () => {
    setCurrentView('aduan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Kembali ke Menu Utama (berserta auto-scroll ke atas)
  const handleBackHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Latar belakang grid hanya aktif jika BUKAN dalam modul aduan
    <div 
      className="min-h-screen flex flex-col text-slate-800 bg-slate-50 relative" 
      style={currentView !== 'aduan' ? { backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' } : {}}
    >
      
      {/* 1. NAVBAR UTAMA (Disembunyikan jika dalam modul Aduan) */}
      {currentView !== 'aduan' && (
        <Navbar currentView={currentView} onBackHome={handleBackHome} />
      )}

      {/* 2. KAWAL PAPARAN (CONDITIONAL RENDERING) */}
      {currentView === 'home' && (
        <Home 
          onOpenForm={handleOpenForm} 
          onOpenAduan={handleOpenAduan} 
          onOpenModal={() => setIsModalOpen(true)}  
        />
      )}

      {currentView === 'form' && (
        <ICTLog onBack={handleBackHome} /> 
      )}

      {currentView === 'aduan' && (
        <AduanICT onBack={handleBackHome} />
      )}

      {/* 3. FOOTER UTAMA (Disembunyikan jika dalam modul Aduan) */}
      {currentView !== 'aduan' && <Footer />}

      {/* 4. MODAL DALAM PEMBINAAN */}
      {isModalOpen && (
        <ConstructionModal onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}

export default App;