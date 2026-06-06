import React, { useState } from 'react';

// Import semua komponen dan pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ICTLog from './pages/ICTLog';
import AduanICT from './pages/AduanICT'; 
import ConstructionModal from './components/ConstructionModal';

function App() {
  // State untuk kawal paparan utama (Home atau Form)
  const [currentView, setCurrentView] = useState('home');
  
  // State untuk kawal Modal (buka atau tutup)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi pintar untuk buka borang (berserta auto-scroll ke atas)
  const handleOpenForm = () => {
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi pintar untuk kembali ke Menu Utama (berserta auto-scroll ke atas)
  const handleBackHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Latar belakang dengan corak grid (radial-gradient)
    <div 
      className="min-h-screen flex flex-col text-slate-800 bg-slate-50 relative" 
      style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      
      {/* 1. NAVBAR - Menerima state semasa dan fungsi kembali ke Home */}
      <Navbar currentView={currentView} onBackHome={handleBackHome} />

      {/* 2. KAWAL PAPARAN (CONDITIONAL RENDERING) */}
      {currentView === 'home' ? (
        <Home 
          onOpenForm={handleOpenForm} 
          onOpenModal={() => setIsModalOpen(true)}  
        />
      ) : (
        <ICTLog onBack={handleBackHome} /> 
      )}

      {/* 3. FOOTER */}
      <Footer />

      {/* 4. MODAL DALAM PEMBINAAN */}
      {isModalOpen && (
        <ConstructionModal onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}

export default App;