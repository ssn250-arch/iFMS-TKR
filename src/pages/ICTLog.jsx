import React, { useState, useRef, useEffect } from 'react';
import { User, IdCard, BookOpen, MapPin, Server, PcCase, Calendar, Clock, ClipboardList, Send, Loader2, CheckCircle, Lock, LogOut, Filter, Search, Download } from 'lucide-react';
import html2canvas from 'html2canvas-pro'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png'; 

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

// ==========================================
// ⚠️ MASUKKAN CONFIG FIREBASE KAU DI SINI
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDxQbSs1KNzTcqGQ0qoaG8ul8Is3ITESCA",
  authDomain: "servedesk-adtec.firebaseapp.com",
  projectId: "servedesk-adtec",
  storageBucket: "servedesk-adtec.firebasestorage.app",
  messagingSenderId: "1047170959965",
  appId: "1:1047170959965:web:d610c273dc130a44e75bb4"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const ICTLog = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nama: '', matrik: '', semester: '', lokasi: '', noserver: '', nopc: '', tarikh: '', masaGuna: '', tujuan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const pdfRef = useRef(null);

  const [viewMode, setViewMode] = useState('form');
  const [loginInput, setLoginInput] = useState({ username: '', pass: '' });
  const [loginError, setLoginError] = useState('');
  const [logs, setLogs] = useState([]);
  const [filterLab, setFilterLab] = useState('Semua Makmal');
  const [searchTerm, setSearchTerm] = useState('');
  
  const adminPdfRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      await addDoc(collection(db, 'ict_usage_logs'), {
        ...formData,
        tarikhFormatted: tarikhFormatted,
        timestamp: serverTimestamp()
      });

      const element = pdfRef.current;
      const canvas = await html2canvas(element, { scale: 1.2, logging: false, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const safeName = formData.nama.replace(/[^a-zA-Z0-9]/g, '_');
      const safeLokasi = formData.lokasi.replace(/[^a-zA-Z0-9]/g, '');
      const serverPart = (formData.noserver && formData.noserver !== 'Tiada') ? `_${formData.noserver.replace(/\s+/g, '')}` : '';
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
        setFormData({ nama: '', matrik: '', semester: '', lokasi: '', noserver: '', nopc: '', tarikh: '', masaGuna: '', tujuan: '' });
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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginInput.username === 'admin' && loginInput.pass === '12345678') {
      setViewMode('adminDashboard');
      setLoginError('');
      setLoginInput({ username: '', pass: '' });
    } else {
      setLoginError('Sila semak semula ID dan Kata Laluan anda.');
    }
  };

  useEffect(() => {
    if (viewMode === 'adminDashboard') {
      const q = query(collection(db, 'ict_usage_logs'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setLogs(data);
      });
      return () => unsubscribe();
    }
  }, [viewMode]);

  const filteredLogs = logs.filter(log => {
    const matchesLab = filterLab === 'Semua Makmal' || log.lokasi === filterLab;
    const matchesSearch = log.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.matrik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.nopc?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLab && matchesSearch;
  });

  const downloadAdminReport = async () => {
    if (filteredLogs.length === 0) return alert("Tiada rekod untuk dimuat turun.");
    setIsDownloading(true);
    
    try {
      // 1. Format Kertas: 'l' (Landscape), 'mm' (Milimeter), 'a4' (Saiz)
      const pdf = new jsPDF('l', 'mm', 'a4'); 

      // 2. Lukis Logo ADTEC (Ambil dari UI supaya tajam)
      const logoElement = document.querySelector("img[alt='Logo ADTEC']");
      if (logoElement) {
          const canvas = document.createElement('canvas');
          canvas.width = logoElement.naturalWidth || 500;
          canvas.height = logoElement.naturalHeight || 200;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(logoElement, 0, 0, canvas.width, canvas.height);
          const logoData = canvas.toDataURL('image/png');
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const logoW = 35; // Lebar logo di PDF
          const logoH = (canvas.height * logoW) / canvas.width; // Nisbah tinggi automatik
          pdf.addImage(logoData, 'PNG', (pdfWidth - logoW) / 2, 10, logoW, logoH);
      }

      // 3. Susun Tajuk Utama Laporan
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("LAPORAN KESELURUHAN LOG PENGGUNAAN MAKMAL ICT", pageWidth / 2, 35, { align: 'center' });

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(71, 85, 105); // Warna Slate-600
      pdf.text(`Sistem Pemantauan Fasiliti ADTEC Sandakan | Tarikh Janaan: ${new Date().toLocaleDateString('ms-MY')}`, pageWidth / 2, 42, { align: 'center' });

      // 4. Proses Data untuk AutoTable
      const tableColumn = ["No.", "Nama Pelajar", "Matrik", "Sem", "Lokasi", "No. PC / Server", "Tarikh & Masa", "Tujuan"];
      const tableRows = [];

      filteredLogs.forEach((log, index) => {
        tableRows.push([
          index + 1,
          log.nama,
          log.matrik,
          log.semester,
          log.lokasi,
          `${log.nopc}${log.noserver && log.noserver !== 'Tiada' ? `\n(${log.noserver})` : ''}`,
          `${log.tarikhFormatted || log.tarikh}\n${log.masaGuna}`,
          log.tujuan
        ]);
      });

      // 5. Lukis Jadual Gred Profesional
      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 50, // Mula lukis jadual di bawah tajuk
        theme: 'grid',
        styles: { 
          fontSize: 8, 
          cellPadding: 4, 
          textColor: [15, 23, 42], // Teks gelap
          valign: 'middle' 
        },
        headStyles: { 
          fillColor: [30, 41, 59], // Warna Slate-800
          textColor: [255, 255, 255], 
          halign: 'center' 
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          2: { halign: 'center', cellWidth: 20 },
          3: { halign: 'center', cellWidth: 16 },
          5: { cellWidth: 28 },
          6: { cellWidth: 28 }
        },
        didDrawPage: function (data) {
          // Tambah muka surat di setiap bahagian bawah kertas
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(
            `Muka Surat ${data.pageNumber}`,
            data.settings.margin.left,
            pdf.internal.pageSize.getHeight() - 10
          );
        }
      });

      // 6. Simpan Fail
      pdf.save(`Laporan_Log_ICT_${new Date().toLocaleDateString('ms-MY').replace(/\//g, '-')}.pdf`);

    } catch (error) {
      console.error("Gagal menjana PDF:", error);
      alert("Ralat teknikal semasa memuat turun laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 fade-in relative w-full">
      
      {viewMode === 'form' && (
        <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-slate-200 bg-white">
          <button onClick={() => setViewMode('adminLogin')} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-2 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded-full transition-all z-50 cursor-pointer shadow-sm active:scale-95" title="Log Masuk Admin"><Lock size={18} /></button>
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Semester <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BookOpen className="w-5 h-5 text-slate-400" /></div>
                  <select name="semester" value={formData.semester} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${!formData.semester ? 'text-slate-400' : 'text-slate-900'}`}>
                    <option value="" disabled hidden>Pilih semester</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi (Lab) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="w-5 h-5 text-slate-400" /></div>
                  <select name="lokasi" value={formData.lokasi} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${!formData.lokasi ? 'text-slate-400' : 'text-slate-900'}`}>
                    <option value="" disabled hidden>Pilih lokasi makmal</option>
                    <option value="Lab Aplikasi">Lab Aplikasi</option>
                    <option value="Lab Server">Lab Server</option>
                    <option value="Lab Troubleshooting">Lab Troubleshooting</option>
                    <option value="Lab Maintenance">Lab Maintenance</option>
                  </select>
                </div>
              </div>
              {formData.lokasi === 'Lab Server' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Server <span className="text-slate-400 font-normal text-xs ml-1">(Pilihan)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Server className="w-5 h-5 text-slate-400" /></div>
                    <select name="noserver" value={formData.noserver || "Tiada"} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base ${(!formData.noserver || formData.noserver === 'Tiada') ? 'text-slate-400' : 'text-slate-900'}`}>
                      <option value="Tiada">-- Tiada (Abaikan) --</option>
                      {[...Array(7)].map((_, i) => (<option key={i} value={`Server ${i + 1}`}>Server {i + 1}</option>))}
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
                    {[...Array(30)].map((_, i) => (<option key={i} value={`PC ${i + 1}`}>PC {i + 1}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tarikh Penggunaan <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="w-5 h-5 text-slate-400" /></div>
                  <input type="date" name="tarikh" value={formData.tarikh} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${!formData.tarikh ? 'text-slate-400' : 'text-slate-900'}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Masa Penggunaan <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock className="w-5 h-5 text-slate-400" /></div>
                  <input type="time" name="masaGuna" value={formData.masaGuna} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${!formData.masaGuna ? 'text-slate-400' : 'text-slate-900'}`} />
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

          {showSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 text-emerald-600 animate-bounce"><CheckCircle className="w-12 h-12" /></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Maklumat Diterima!</h3>
              <p className="text-slate-600 text-sm sm:text-base">Maklumat anda sedang disimpan dengan selamat. Sila tunggu sebentar.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'adminLogin' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 md:p-16 max-w-md w-full relative overflow-hidden text-center animate-in fade-in slide-in-from-bottom-4">
            <button onClick={() => setViewMode('form')} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors">Batal</button>
            <div className="bg-indigo-50 text-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><Lock size={32} /></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">LOG MASUK ADMIN</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 mb-10">Pangkalan Data ICT Log</p>
            <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Username</label>
                <input type="text" required className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="Username" value={loginInput.username} onChange={(e) => setLoginInput({...loginInput, username: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Kata Laluan</label>
                <input type="password" required className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="••••••••" value={loginInput.pass} onChange={(e) => setLoginInput({...loginInput, pass: e.target.value})} />
              </div>
              {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{loginError}</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.8rem] uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 active:scale-95 transition-all">Sahkan Akses</button>
            </form>
        </div>
      )}

      {viewMode === 'adminDashboard' && (
        <div className="w-full max-w-7xl animate-in fade-in duration-500">
          
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100 text-white"><ClipboardList size={32} /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Sejarah Log ICT</h2>
                <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-3">Sistem Pemantauan Makmal ADTEC</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={downloadAdminReport} 
                disabled={isDownloading || filteredLogs.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md shadow-emerald-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />} 
                {isDownloading ? 'Menjana PDF...' : 'Muat Turun PDF'}
              </button>

              <button onClick={() => setViewMode('form')} className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-red-100">
                <LogOut size={16} /> Log Keluar
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Cari Nama Pelajar, Matrik, atau No. PC..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative w-full md:w-64 shrink-0">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select value={filterLab} onChange={(e) => setFilterLab(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold shadow-sm outline-none appearance-none cursor-pointer">
                <option>Semua Makmal</option>
                <option value="Lab Aplikasi">Lab Aplikasi</option>
                <option value="Lab Server">Lab Server</option>
                <option value="Lab Troubleshooting">Lab Troubleshooting</option>
                <option value="Lab Maintenance">Lab Maintenance</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Maklumat Pelajar</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi & PC</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Masa & Tarikh</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredLogs.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">Tiada rekod ditemui</td></tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5">
                          <p className="font-bold text-slate-800">{log.nama}</p>
                          <p className="text-xs text-slate-500 mt-1">{log.matrik} • <span className="text-indigo-500 font-semibold">{log.semester}</span></p>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-slate-800 bg-slate-100 inline-block px-2 py-1 rounded-md text-xs">{log.lokasi}</p>
                          <p className="text-xs text-slate-500 mt-2 font-mono font-semibold">{log.nopc} {log.noserver && log.noserver !== 'Tiada' ? `(${log.noserver})` : ''}</p>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-slate-800">{log.tarikhFormatted || log.tarikh}</p>
                          <p className="text-xs text-slate-500 mt-1">{log.masaGuna}</p>
                        </td>
                        <td className="p-5 max-w-xs">
                          <p className="text-xs text-slate-600 truncate" title={log.tujuan}>{log.tujuan}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-500 font-bold tracking-widest uppercase">
              Jumlah Rekod: {filteredLogs.length}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TEMPLATE PDF TERSEMBUNYI UNTUK PELAJAR
          ========================================== */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={pdfRef} style={{ width: '800px', backgroundColor: '#ffffff', padding: '50px', border: '1px solid #cbd5e1', borderRadius: '12px', fontFamily: '"Poppins", sans-serif', color: '#334155' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '25px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}><img src={logo} alt="Logo ADTEC" style={{ height: '85px', width: 'auto', objectFit: 'contain' }} /></div>
            <h1 style={{ color: '#0f172a', margin: '0', fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>REKOD PENGGUNAAN MAKMAL KOMPUTER</h1>
            <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>TKR ADTEC JTM Kampus Sandakan</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <tbody>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', width: '35%', fontWeight: '600' }}>Nama Pelajar</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', width: '5%' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.nama}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. Matrik</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.matrik}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Semester</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.semester}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Lokasi Makmal</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.lokasi}</td></tr>
              {formData.lokasi === 'Lab Server' && formData.noserver && formData.noserver !== 'Tiada' && (
                <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. Server</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.noserver}</td></tr>
              )}
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>No. PC</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.nopc}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Tarikh Penggunaan</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td id="pdf-tarikh-display" style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}></td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Masa Penggunaan</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}>{formData.masaGuna}</td></tr>
              <tr><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', fontWeight: '600' }}>Tarikh & Masa Rekod Dijana</td><td style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0' }}>:</td><td id="pdf-masa-rekod" style={{ padding: '14px 0', borderBottom: '1px dashed #e2e8f0', color: '#0f172a' }}></td></tr>
              <tr><td style={{ padding: '14px 0', fontWeight: '600', verticalAlign: 'top' }}>Tujuan Penggunaan</td><td style={{ padding: '14px 0', verticalAlign: 'top' }}>:</td><td style={{ padding: '14px 0', color: '#0f172a' }}>{formData.tujuan}</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: '50px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}><p style={{ margin: 0 }}>Dokumen ini dijana secara automatik oleh Sistem E-Log Makmal Komputer.</p></div>
        </div>
      </div>

      {/* ==========================================
          TEMPLATE PDF TERSEMBUNYI UNTUK ADMIN (TABLE)
          ========================================== */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={adminPdfRef} style={{ width: '1123px', padding: '40px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
           <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid #1e293b', paddingBottom: '15px' }}>
               
               {/* LOGO DITAMBAH DI SINI (ALIGN CENTER) */}
               <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '15px' }}>
                   <img src={logo} alt="Logo ADTEC" style={{ height: '85px', width: 'auto', objectFit: 'contain' }} />
               </div>
               
               <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase' }}>LAPORAN KESELURUHAN LOG PENGGUNAAN MAKMAL ICT</h2>
               <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Sistem Pemantauan Fasiliti ADTEC Sandakan | Tarikh Janaan: {new Date().toLocaleDateString('ms-MY')}</p>
           </div>
           
           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '20px' }}>
              <thead>
                 <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', textAlign: 'left' }}>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '25%' }}>Nama Pelajar & Matrik</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '10%', textAlign: 'center' }}>Semester</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '15%' }}>Lokasi Makmal</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '15%' }}>No. PC / Server</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '15%' }}>Tarikh & Masa</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px 8px', width: '15%' }}>Tujuan</th>
                 </tr>
              </thead>
              <tbody>
                 {filteredLogs.map((log, index) => (
                     <tr key={log.id}>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}><strong>{log.nama}</strong><br/><span style={{fontSize: '10px', color: '#64748b'}}>{log.matrik}</span></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>{log.semester}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{log.lokasi}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{log.nopc} {log.noserver && log.noserver !== 'Tiada' ? `(${log.noserver})` : ''}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{log.tarikhFormatted || log.tarikh}<br/><span style={{fontSize: '10px', color: '#64748b'}}>{log.masaGuna}</span></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{log.tujuan}</td>
                     </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </main>
  );
};

export default ICTLog;