import React, { useState, useRef } from 'react';
import { User, IdCard, MapPin, Server, PcCase, Calendar, Clock, ClipboardList, Send, Loader2, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png'; 

const ICTLog = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nama: '', matrik: '', lokasi: '', noserver: '', nopc: '', tarikh: '', masaGuna: '', tujuan: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const pdfRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tarikhParts = formData.tarikh.split('-');
    const tarikhFormatted = tarikhParts.length === 3 ? `${tarikhParts[2]}/${tarikhParts[1]}/${tarikhParts[0]}` : formData.tarikh;
    const masaRekod = new Date().toLocaleString('ms-MY', { dateStyle: 'full', timeStyle: 'short' });

    document.getElementById('pdf-tarikh-display').innerText = tarikhFormatted;
    document.getElementById('pdf-masa-rekod').innerText = masaRekod;

    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, { scale: 1.2, logging: false, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const safeName = formData.nama.replace(/[^a-zA-Z0-9]/g, '_');
      const safeLokasi = formData.lokasi.replace(/[^a-zA-Z0-9]/g, '');
      // Kalau noserver kosong, kita tak masukkan dalam nama fail
      const serverPart = formData.noserver ? `_${formData.noserver.replace(/\s+/g, '')}` : '';
      const fileName = `Log_${safeLokasi}${serverPart}_${formData.nopc}_${safeName}.pdf`;
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      const scriptURL = 'https://script.google.com/macros/s/AKfycby_rBOx4PAO8gAN1Hzzx2XKSBD2iDinACJ4Q_15pHtt9zL3MsPq7DeScvRka-tL6rWi7w/exec';
      
      fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({ fileName: fileName, fileData: pdfBase64, lokasi: formData.lokasi }),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        redirect: "follow"
      }).catch(err => console.error("Ralat background upload:", err));

      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({ nama: '', matrik: '', lokasi: '', noserver: '', nopc: '', tarikh: '', masaGuna: '', tujuan: '' });
        setIsSubmitting(false);
        setShowSuccess(false);
        if(onBack) onBack(); 
      }, 2500);

    } catch (error) {
      console.error("Ralat: ", error);
      alert("Maaf, terdapat ralat teknikal semasa menjana fail PDF.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 fade-in relative">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-slate-200 bg-white">
        
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
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" placeholder="Masukkan nama penuh anda" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">No. Matrik <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdCard className="w-5 h-5 text-slate-400" /></div>
                <input type="text" name="matrik" value={formData.matrik} onChange={handleChange} required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base" placeholder="Contoh: 123456" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi (Lab) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="w-5 h-5 text-slate-400" /></div>
                {/* TUKAR: Value kosong dan disable opsyen pertama bertindak sebagai placeholder */}
                <select name="lokasi" value={formData.lokasi} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${!formData.lokasi ? 'text-slate-400' : 'text-slate-900'}`}>
                  <option value="" disabled hidden>Pilih lokasi makmal</option>
                  <option value="Lab Aplikasi" className="text-slate-900">Lab Aplikasi</option>
                  <option value="Lab Server" className="text-slate-900">Lab Server</option>
                  <option value="Lab Troubleshooting" className="text-slate-900">Lab Troubleshooting</option>
                  <option value="Lab Maintenance" className="text-slate-900">Lab Maintenance</option>
                </select>
              </div>
            </div>

            {formData.lokasi === 'Lab Server' && (
              <div>
                {/* TUKAR: Buang bintang merah, tambah tag (Pilihan) */}
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Server <span className="text-slate-400 font-normal text-xs ml-1">(Pilihan)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Server className="w-5 h-5 text-slate-400" /></div>
                  {/* TUKAR: Buang 'required' dan warnakan placeholder kelabu */}
                  <select name="noserver" value={formData.noserver} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${!formData.noserver ? 'text-slate-400' : 'text-slate-900'}`}>
                    <option value="" disabled hidden>Pilih nombor server</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={`Server ${i + 1}`} className="text-slate-900">Server {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">No. PC <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PcCase className="w-5 h-5 text-slate-400" /></div>
                <select name="nopc" value={formData.nopc} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${!formData.nopc ? 'text-slate-400' : 'text-slate-900'}`}>
                  <option value="" disabled hidden>Sila pilih PC</option>
                  {[...Array(30)].map((_, i) => (
                    <option key={i} value={`PC ${i + 1}`} className="text-slate-900">PC {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tarikh Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="w-5 h-5 text-slate-400" /></div>
                {/* TUKAR: Guna onFocus dan onBlur untuk papar placeholder dd/mm/yyyy */}
                <input 
                  type="text" 
                  name="tarikh" 
                  value={formData.tarikh} 
                  onChange={handleChange} 
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                  placeholder="dd/mm/yyyy"
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base placeholder:text-slate-400" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Masa Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock className="w-5 h-5 text-slate-400" /></div>
                {/* TUKAR: Guna onFocus dan onBlur untuk papar placeholder --:-- -- */}
                <input 
                  type="text" 
                  name="masaGuna" 
                  value={formData.masaGuna} 
                  onChange={handleChange} 
                  onFocus={(e) => (e.target.type = 'time')}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                  placeholder="--:-- --"
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base placeholder:text-slate-400" 
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tujuan Penggunaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute top-3.5 left-3 flex items-start pointer-events-none"><ClipboardList className="w-5 h-5 text-slate-400" /></div>
                <textarea name="tujuan" value={formData.tujuan} onChange={handleChange} rows="3" required className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base placeholder:text-slate-400" placeholder="Contoh: Menyiapkan tugasan AutoCAD, carian internet..."></textarea>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all transform active:scale-95 text-base disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{isSubmitting ? 'Memproses...' : 'Hantar Rekod Sekarang'}</span>
            </button>
          </div>
        </form>

        {/* Paparan State Berjaya (Overlay) */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 text-emerald-600 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Maklumat Diterima!</h3>
            <p className="text-slate-600 text-sm sm:text-base">Maklumat anda sedang disimpan dengan selamat. Sila tunggu sebentar.</p>
          </div>
        )}
      </div>

      {/* ==========================================
          TEMPLATE PDF TERSEMBUNYI (DISOROK DARI UI)
          ========================================== */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        
        <div ref={pdfRef} style={{ width: '800px', backgroundColor: '#ffffff', padding: '50px', border: '1px solid #cbd5e1', borderRadius: '12px', fontFamily: '"Poppins", sans-serif', color: '#334155' }}>
          
          <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '25px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>
              <img src={logo} alt="Logo ADTEC" style={{ height: '85px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <h1 style={{ color: '#0f172a', margin: '0', fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>REKOD PENGGUNAAN MAKMAL KOMPUTER</h1>
            <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>TKR ADTEC JTM Kampus Sandakan</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <tbody>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', width: '35%', fontWeight: '600' }}>Nama Pelajar</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', width: '5%' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.nama}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. Matrik</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.matrik}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Lokasi Makmal</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.lokasi}</td></tr>
              
              {/* Akan papar nombor server jika dipilih, atau biarkan baris ni jika tidak dipilih tetapi Lab Server dipilih */}
              {formData.lokasi === 'Lab Server' && formData.noserver && (
                <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. Server</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.noserver}</td></tr>
              )}
              
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. PC</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.nopc}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Tarikh Penggunaan</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td id="pdf-tarikh-display" style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}></td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Masa Penggunaan</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.masaGuna}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Tarikh & Masa Rekod Dijana</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td id="pdf-masa-rekod" style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}></td></tr>
              <tr><td style={{ padding: '14px 0', fontWeight: '600', verticalAlign: 'top' }}>Tujuan Penggunaan</td><td style={{ padding: '14px 0', verticalAlign: 'top' }}>:</td><td style={{ padding: '14px 0', color: '#0f172a' }}>{formData.tujuan}</td></tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '50px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>Dokumen ini dijana secara automatik oleh Sistem E-Log Makmal Komputer.</p>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default ICTLog;