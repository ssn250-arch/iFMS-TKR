import React, { useState } from 'react';

// Import semua komponen dan pages yang kau dah buat
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ICTLog from './pages/ICTLog'; // Pastikan nama fail ni betul ikut folder kau
import ConstructionModal from './components/ConstructionModal';

function App() {
  // State untuk kawal paparan utama (Home atau Form)
  const [currentView, setCurrentView] = useState('home');
  
  // State untuk kawal Modal (buka atau tutup)
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // Class CSS ni ambil dari body kod asal kau (latar belakang grid)
    <div className="min-h-screen flex flex-col text-slate-800 bg-slate-50 relative" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      
      {/* 1. KELUARKAN NAVBAR */}
      <Navbar currentView={currentView} onBackHome={() => setCurrentView('home')} />

      {/* 2. KAWAL PAPARAN (CONDITIONAL RENDERING) */}
      {currentView === 'home' ? (
        <Home 
          onOpenForm={() => setCurrentView('form')} // Bila kad Log diklik, tukar view ke form
          onOpenModal={() => setIsModalOpen(true)}  // Bila kad Aduan diklik, buka modal
        />
      ) : (
        <ICTLog onBack={() => setCurrentView('home')} /> // Bila butang kembali di klik kat form, balik ke home
      )}

      {/* 3. KELUARKAN FOOTER */}
      <Footer />

      {/* 4. KELUARKAN MODAL JIKA STATE isModalOpen == true */}
      {isModalOpen && (
        <ConstructionModal onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}

export default App;