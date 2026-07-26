import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc,
  deleteDoc, 
  serverTimestamp, 
  query 
} from 'firebase/firestore';
import { 
  Monitor, 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  User, 
  ClipboardList,
  ShieldCheck, 
  X, 
  ChevronDown, 
  Briefcase, 
  Clock, 
  Calendar, 
  Send, 
  Lock, 
  LogOut, 
  Download,
  BarChart3,
  PieChart,
  Eye,
  Loader2,
  FileWarning,
  FileSpreadsheet,
  ExternalLink,
  FolderOpen,
  CloudUpload,
  Filter,
  Search,
  Sparkles,
  ArrowLeft,
  ImagePlus,
  Trash2,
  Edit,
  FileText,
  Activity,
  History
} from 'lucide-react';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxa6aBPzFBWf0TL9NfWlNQIi8PGFoh3aXWs6iMxG888qpzW5HTrPltTzzSysJ-IJDXs-w/exec"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "servedesk-adtec.firebaseapp.com",
  projectId: "servedesk-adtec",
  storageBucket: "servedesk-adtec.firebasestorage.app",
  messagingSenderId: "1047170959965",
  appId: "1:1047170959965:web:d610c273dc130a44e75bb4"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'pc-maint-adtec-sdk';

const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1WWXxJ6AXbXIY3nmc9glds-RPKCPfZ2cw?usp=drive_link";

const INSTRUCTORS = [
  "Ts. Nurzharfan bin Rafei Bui",
  "Ts. Syed Mohd Yusri bin Syed Yusoff",
  "Ts. Muhammad Hifzan bin Salimun"
];

const LABS = [
  "Lab Aplikasi-TKR",
  "Lab Troubleshooting-TKR",
  "Lab Maintenance-TKR",
  "Lab Server-TKR",
  "BPPA" ,
  "BPSM" ,
  "BPPL" ,
  "Unit Kewangan" ,
  "Unit Perkhidmatan" ,
  "Unit Pentadbiran" ,
  "CESS" ,
  "TELCOM" ,
  "TE" ,
  "TPPU " ,
  "TKIM" ,
  "TFLSOG" ,
  "TAUTO"
];

const CATEGORIES = [
  "Perkakasan (Hardware)",
  "Perisian (Software)",
  "Rangkaian (Network)",
  "Sistem (System)",
  "Emel (Email)",
  "Lain-lain (Others)"
];

const TECH_DETAILS = {
  "Perkakasan (Hardware)": ["Motherboard", "CPU", "RAM", "PSU", "Monitor", "Printer", "Lain-lain"],
  "Perisian (Software)": ["MS Windows", "MS Office", "Antivirus", "Driver Issue", "Lain-lain"],
  "Rangkaian (Network)": ["Lan Cable", "Switch", "Router", "Access Point", "Lain-lain"]
};

const AUTH_CONFIG = {
  admin: { username: "admin", pass: "12345678" },
  juruteknik: { username: "tkr", pass: "12345678" }
};

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    if (timestamp instanceof Date) return timestamp.toLocaleDateString('ms-MY');
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toLocaleDateString('ms-MY');
    return 'Sedang diproses...';
};

const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    if (timestamp instanceof Date) return timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
    return '...';
};

const PDFContent = ({ item, idPrefix }) => (
  <div 
    id={`${idPrefix}-${item.id}`} 
    className="bg-white"
    style={{ 
      width: '210mm', 
      minHeight: '296mm', 
      padding: '18mm', 
      boxSizing: 'border-box', 
      color: '#000', 
      fontFamily: 'Arial, Helvetica, sans-serif',
      position: 'relative'
    }}
  >
    <div style={{ textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '12px', paddingBottom: '10px' }}>
      <div style={{ display: 'block', margin: '0 auto 10px auto', textAlign: 'center' }}>
        <img 
          src="https://lh3.googleusercontent.com/d/1tdlSW4TjrK7v5xqhVCZsyUhFTBJKOk5Z" 
          alt="Logo" 
          style={{ maxWidth: '110mm', width: '100%', height: 'auto', aspectRatio: '2000 / 1000', display: 'inline-block' }}
        />
      </div>
      <h2 style={{ margin: '2px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>BORANG ADUAN KEROSAKAN ICT</h2>
      <p style={{ margin: '2px 0 0 0', fontSize: '10px', lineHeight: '1.4' }}>
        Batu 5, Jalan Sibuga, 90000 Sandakan, Sabah | Tel: 089-240500 | Fax: 089-240555
      </p>
    </div>

    <div style={{ marginBottom: '12px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
      NO. RUJUKAN: <span style={{ fontWeight: 'normal', borderBottom: '1px solid #000', paddingRight: '40px' }}>{item.formNo || 'TIADA'}</span>
    </div>

    <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>1. MAKLUMAT PENGADU</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '10px' }}>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', width: '30%', fontWeight: 'bold' }}>Nama Pengadu</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.applicantName ? item.applicantName.toUpperCase() : '-'}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold' }}>Unit / Jabatan</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.unit ? item.unit.toUpperCase() : '-'}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold' }}>Jawatan</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.position ? item.position.toUpperCase() : '-'}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold' }}>No. Telefon</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.phone || '-'}</td>
        </tr>
      </tbody>
    </table>

    <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>2. BUTIRAN KEROSAKAN KOMPUTER</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10px' }}>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', width: '30%', fontWeight: 'bold' }}>Lokasi / Lab</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.lab || '-'}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold' }}>ID Peralatan / PC</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>PC-{item.pcNo} {item.assetNo ? `(${item.assetNo})` : ''}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold' }}>Kategori Aduan</td>
          <td style={{ border: '1px solid #000', padding: '7px' }}>{item.category || '-'}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '7px', fontWeight: 'bold', verticalAlign: 'top' }}>Perincian Masalah</td>
          <td style={{ border: '1px solid #000', padding: '10px', minHeight: '50px', verticalAlign: 'top', lineHeight: '1.4' }}>
            {item.issue || '-'}
          </td>
        </tr>
      </tbody>
    </table>

    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '15px' }}>
      TARIKH ADUAN: {formatDate(item.dateCreated)}
    </div>

    <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>3. LAPORAN PENYELENGGARAAN & PENGESAHAN</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '9px', marginBottom: '15px' }}>
      <tbody>
        <tr>
          <td style={{ width: '50%', border: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>TINDAKAN JURUTEKNIK:</div>
            <div style={{ border: '1px dashed #ccc', padding: '6px', minHeight: '80px', backgroundColor: '#fafafa', marginBottom: '15px' }}>
               <strong>{item.techCategory}: {item.techItem}</strong><br/>
               {item.technicalAction || 'Menunggu pembaikan...'}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '130px', borderBottom: '1px solid #000', margin: '0 auto' }}></div>
              <div style={{ fontSize: '8px', marginTop: '3px' }}>Tandatangan Juruteknik</div>
              <div style={{ fontSize: '8px', fontWeight: 'bold', marginTop: '2px' }}>({item.technicianName || '......................................'})</div>
            </div>
          </td>
          <td style={{ width: '50%', border: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>PENGESAHAN UNIT ICT:</div>
            <div style={{ border: '1px solid #eee', padding: '6px', minHeight: '60px', marginBottom: '35px', fontStyle: 'italic', fontSize: '8px' }}>
               Telah disemak dan disahkan kerosakan telah dibaiki mengikut spesifikasi.
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', marginTop: '3px' }}>Disahkan Oleh:</div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '2px', textTransform: 'uppercase', color: '#166534' }}>{item.verifiedBy || 'MENUNGGU PENGESAHAN'}</div>
              <div style={{ fontSize: '8px', marginTop: '4px' }}>Tarikh: {formatDate(item.dateVerified)}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    {item.proofImages && item.proofImages.length > 0 && (
      <div style={{ pageBreakBefore: 'always', border: '1px solid #ccc', padding: '15px', backgroundColor: '#fafafa', marginTop: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '15px', textTransform: 'uppercase', borderBottom: '2px solid #ddd', paddingBottom: '8px' }}>
            LAMPIRAN BUKTI TINDAKAN KEROSAKAN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          {item.proofImages.map((src, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#fff', textAlign: 'center' }}>
                <img src={src} alt={`Bukti ${index + 1}`} style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>
    )}

    <div style={{ marginTop: '40px', border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', pageBreakInside: 'avoid' }}>
      BORANG INI ADALAH CETAKAN DIGITAL SERVEDESK+ - TIDAK MEMERLUKAN TANDATANGAN PENGADU
    </div>

    <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '8px', fontStyle: 'italic', color: '#888' }}>
      ServeDesk+ ADTEC SDK | {new Date().toLocaleString('ms-MY')}
    </div>
  </div>
);

export default function ServeDesk({ onBackHome }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => sessionStorage.getItem('serveDesk_role') || 'pemohon'); 
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [filterLab, setFilterLab] = useState('Semua Makmal');
  const [driveUploadStatus, setDriveUploadStatus] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  const [isInstAuthenticated, setIsInstAuthenticated] = useState(() => sessionStorage.getItem('serveDesk_auth') === 'true');
  const [loginInput, setLoginInput] = useState({ username: '', pass: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTechModal, setActiveTechModal] = useState(null);
  const [activeVerifyModal, setActiveVerifyModal] = useState(null);
  const [activePreviewItem, setActivePreviewItem] = useState(null);
  const [itemToReject, setItemToReject] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: '', unit: '', position: '', phone: '', email: '',
    pcNo: '', lab: '', category: '', assetNo: '', issue: ''
  });

  const [actionData, setActionData] = useState({
    text: '', techName: '', techCategory: '', techItem: ''
  });

  const [proofImages, setProofImages] = useState([]);
  const [verifyName, setVerifyName] = useState('');
  const [isGeneratingIssue, setIsGeneratingIssue] = useState(false);
  const [isGeneratingAction, setIsGeneratingAction] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Ralat Auth:", error);
      }
    };
    initAuth();

    if (!window.html2pdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const complaintsCol = collection(db, 'artifacts', appId, 'public', 'data', 'complaints');
    const q = query(complaintsCol);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a, b) => {
         const timeA = a.dateCreated?.seconds || Date.now();
         const timeB = b.dateCreated?.seconds || Date.now();
         return timeB - timeA;
      });
      setComplaints(data);
      setLoading(false);
    }, (error) => {
      console.error("Ralat Firestore:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('serveDesk_role', role);
  }, [role]);

  const techNotificationCount = complaints.filter(c => c.status === 'Baru').length;
  const instructorNotificationCount = complaints.filter(c => c.status === 'Penyelenggaraan').length;

  const filteredComplaints = complaints.filter(c => {
    const matchesLab = filterLab === 'Semua Makmal' || c.lab === filterLab;
    const matchesSearch = (c.applicantName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (c.formNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (c.issue?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesLab && matchesSearch;
  });

  const stats = {
    baru: complaints.filter(c => c.status === 'Baru').length,
    proses: complaints.filter(c => c.status === 'Penyelenggaraan').length,
    selesai: complaints.filter(c => c.status === 'Selesai').length,
    total: complaints.length
  };

  // LOGIK SMART FILTERING UNTUK DASHBOARD MAKMAL BERMASALAH
  const activeLabStats = LABS.map(lab => {
    return {
      lab,
      count: complaints.filter(c => c.lab === lab).length
    };
  }).filter(l => l.count > 0).sort((a, b) => b.count - a.count);

  const handleSystemLogin = (e) => {
    e.preventDefault();
    const configKey = (role === 'juruteknik') ? 'juruteknik' : 'admin';
    const credentials = AUTH_CONFIG[configKey];

    if (loginInput.username === credentials.username && loginInput.pass === credentials.pass) {
      setIsInstAuthenticated(true);
      sessionStorage.setItem('serveDesk_auth', 'true');
      setLoginError('');
      setLoginInput({ username: '', pass: '' });
    } else {
      setLoginError(`Kredential ${configKey.toUpperCase()} tidak sah.`);
    }
  };

  const generateFormNumber = () => {
    const year = new Date().getFullYear();
    const count = complaints.filter(c => {
        const d = c.dateCreated?.toDate ? c.dateCreated.toDate() : new Date();
        return d.getFullYear() === year;
    }).length + 1;
    return `ADTEC/SDK/ICT/${year}/${String(count).padStart(3, '0')}`;
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!formData.lab || !formData.category) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', editingId);
        await updateDoc(docRef, {
          ...formData,
          dateUpdated: serverTimestamp()
        });
      } else {
        const complaintsCol = collection(db, 'artifacts', appId, 'public', 'data', 'complaints');
        const newFormNo = generateFormNumber();
        await addDoc(complaintsCol, {
          ...formData, 
          formNo: newFormNo,
          status: 'Baru', 
          technicalAction: '', 
          technicianName: '',
          techCategory: '', 
          techItem: '', 
          verifiedBy: '', 
          dateVerified: null,
          proofImages: [],
          dateCreated: serverTimestamp(), 
          dateUpdated: serverTimestamp()
        });
      }

      setShowSuccessAnim(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessAnim(false);
        setFormData({ applicantName: '', unit: '', position: '', phone: '', email: '', pcNo: '', lab: '', category: '', assetNo: '', issue: '' });
        setEditingId(null);
        setShowForm(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      applicantName: item.applicantName || '',
      unit: item.unit || '',
      position: item.position || '',
      phone: item.phone || '',
      email: item.email || '',
      pcNo: item.pcNo || '',
      lab: item.lab || '',
      category: item.category || '',
      assetNo: item.assetNo || '',
      issue: item.issue || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Adakah anda pasti mahu memadam rekod aduan ini secara kekal?")) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'complaints', id));
      } catch (err) {
        console.error("Gagal memadam:", err);
        alert("Gagal memadam rekod.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - proofImages.length;
    
    if (files.length > remainingSlots) {
        alert(`Anda hanya boleh menambah ${remainingSlots} keping gambar lagi.`);
    }

    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600; 
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const base64Compressed = canvas.toDataURL('image/jpeg', 0.6); 
                setProofImages(prev => [...prev, base64Compressed]);
            };
        };
    });
  };

  const handleUpdateAction = async () => {
    if (!actionData.text || !actionData.techName || !actionData.techCategory || !activeTechModal) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', activeTechModal);
      await updateDoc(docRef, {
        technicalAction: actionData.text, 
        technicianName: actionData.techName,
        techCategory: actionData.techCategory, 
        techItem: actionData.techItem,
        proofImages: proofImages,
        status: 'Penyelenggaraan', 
        dateUpdated: serverTimestamp()
      });
      setShowSuccessAnim(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessAnim(false);
        setActiveTechModal(null);
        setActionData({ text: '', techName: '', techCategory: '', techItem: '' });
        setProofImages([]);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const uploadToDrive = async (complaintId, filename) => {
    const element = document.getElementById(`pdf-content-hidden-${complaintId}`);
    if (!element || !window.html2pdf) {
      console.error("Elemen PDF tiada atau Library tidak sedia");
      return false;
    }

    setDriveUploadStatus('uploading');

    const opt = { 
      margin: 0, 
      filename: filename, 
      image: { type: 'jpeg', quality: 1.0 }, 
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        windowWidth: 794 
      }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      const pdfBase64 = await window.html2pdf()
        .set(opt)
        .from(element)
        .outputPdf('datauristring')
        .then(res => res.split(',')[1]);

      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          pdfBase64,
          filename
        })
      });

      setDriveUploadStatus('success');
      return true;

    } catch (err) {
      console.error("Upload Drive gagal:", err);
      setDriveUploadStatus('error');
      return false;
    }
  };

  const handleVerify = async () => {
    if (!verifyName) return;
    setIsSubmitting(true);

    try {
      const item = complaints.find(c => c.id === activeVerifyModal);
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', activeVerifyModal);

      await updateDoc(docRef, {
        status: 'Selesai',
        verifiedBy: verifyName,
        dateVerified: new Date()
      });

      setTimeout(async () => {
          const filename = `Arkib_${item.formNo.replace(/\//g, '-')}_${item.applicantName.replace(/\s+/g, '_')}.pdf`;
          await uploadToDrive(activeVerifyModal, filename);

          setActiveVerifyModal(null);
          setVerifyName('');
          setIsSubmitting(false);
          setDriveUploadStatus(null);
      }, 1500);

    } catch (err) {
      console.error("Ralat semasa pengesahan:", err);
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!itemToReject || !isInstAuthenticated) return;
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', itemToReject);
        await updateDoc(docRef, {
            status: 'Ditolak',
            dateUpdated: serverTimestamp(),
            verifiedBy: 'Admin (Ditolak)'
        });
        setItemToReject(null);
    } catch (err) {
        console.error("Gagal menolak aduan:", err);
    }
  };

  const handleExportCSV = () => {
    if (complaints.length === 0) return;
    const headers = ["No. Borang", "Nama Pengadu", "Unit", "Jawatan", "Telefon", "Makmal", "No. PC", "Kategori", "Isu", "Status", "Tindakan", "Juruteknik", "Disahkan", "Tarikh"];
    const rows = complaints.map(c => [
      c.formNo || '-',
      c.applicantName || '-',
      c.unit || '-',
      c.position || '-',
      c.phone || '-',
      c.lab || '-',
      c.pcNo || '-',
      c.category || '-',
      `"${(c.issue || '').replace(/"/g, '""')}"`,
      c.status || '-',
      `"${(c.technicalAction || '').replace(/"/g, '""')}"`,
      c.technicianName || '-',
      c.verifiedBy || '-',
      formatDate(c.dateCreated)
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Database_ServeDesk_ADTEC_${new Date().toLocaleDateString('ms-MY')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFFromPreview = (itemId) => {
    const element = document.getElementById(`pdf-content-${itemId}`);
    if (!element) return;

    const safeName = (activePreviewItem?.applicantName || 'Borang').replace(/[^a-z0-9]/gi, '_');
    const filename = `Borang_Aduan_ADTEC_${safeName}.pdf`;

    const opt = { 
      margin: 0, 
      filename: filename, 
      image: { type: 'jpeg', quality: 1.0 }, 
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        windowWidth: 794
      }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    window.html2pdf().set(opt).from(element).save();
  };

  const callGeminiAI = async (text, roleType) => {
    if (!text || text.trim() === '') return text;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let systemPrompt = "";
    if (roleType === 'pemohon') {
      systemPrompt = "Anda adalah pembantu AI pakar IT. Kembangkan nota ringkas pengguna mengenai masalah komputer kepada satu perenggan pendek yang lengkap, profesional, dan mudah difahami dalam Bahasa Melayu moden. Jangan tambah fakta teknikal baru, cuma perbaiki ayat. Terus berikan jawapan akhir tanpa mukadimah atau petikan.";
    } else {
      systemPrompt = "Anda adalah pembantu AI untuk juruteknik IT. Kembangkan nota kerja ringkas kepada laporan log tindakan yang lengkap, profesional dan ringkas dalam Bahasa Melayu moden. Terus berikan jawapan akhir tanpa mukadimah atau petikan.";
    }

    const payload = {
        contents: [{ parts: [{ text: text }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (response.ok && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text.trim();
        } else {
            console.error("AI Error Details:", result);
            const errorMsg = result.error?.message || "Ralat tidak diketahui";
            alert(`Ralat Google AI:\n${errorMsg}\n\nPastikan API Key anda betul.`);
        }
    } catch (error) {
        console.error("AI Fetch Error:", error);
        alert("Gagal menyambung ke pelayan AI Google. Sila semak sambungan internet anda.");
    }
    return text; 
  };

  const handleAIGenerateIssue = async () => {
      if (!formData.issue) return;
      setIsGeneratingIssue(true);
      const enhancedText = await callGeminiAI(formData.issue, 'pemohon');
      setFormData({...formData, issue: enhancedText});
      setIsGeneratingIssue(false);
  };

  const handleAIGenerateAction = async () => {
      if (!actionData.text) return;
      setIsGeneratingAction(true);
      const enhancedText = await callGeminiAI(actionData.text, 'juruteknik');
      setActionData({...actionData, text: enhancedText});
      setIsGeneratingAction(false);
  };

  return (
    <div 
      className="min-h-screen font-sans text-slate-900 flex flex-col overflow-x-hidden relative"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }}
    >
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none overflow-hidden" style={{ height: 0, width: 0 }}>
        {complaints.filter(c => c.status === 'Selesai' || c.status === 'Penyelenggaraan').map(item => (
          <PDFContent key={item.id} item={item} idPrefix="pdf-content-hidden" />
        ))}
      </div>

      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center overflow-x-auto gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            <div className="flex items-center gap-3 text-left cursor-pointer shrink-0">
              <button 
                onClick={onBackHome} 
                className="mr-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all border border-slate-200"
                title="Kembali ke Sistem Utama"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-3 text-left cursor-pointer shrink-0" onClick={() => setRole('dashboard')}>
                <img 
                   src="https://lh3.googleusercontent.com/d/1tdlSW4TjrK7v5xqhVCZsyUhFTBJKOk5Z" 
                   alt="Logo ADTEC Sandakan" 
                   className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" 
                />
                <div className="flex flex-col text-left hidden lg:flex">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">ServeDesk+</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">ADTEC JTM SANDAKAN</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 gap-1 shrink-0">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, count: 0 },
                { id: 'pemohon', label: 'Pemohon', icon: User, count: 0 },
                { id: 'juruteknik', label: 'Juruteknik', icon: Wrench, count: techNotificationCount },
                { id: 'pengajar', label: 'Pengajar', icon: ShieldCheck, count: instructorNotificationCount }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    if (role !== r.id) { 
                      setIsInstAuthenticated(false); 
                      sessionStorage.removeItem('serveDesk_auth'); 
                    }
                    setRole(r.id);
                  }}
                  className={`relative px-4 md:px-5 py-2 rounded-xl text-xs font-black capitalize transition-all flex items-center gap-2 active:scale-95 ${
                    role === r.id ? 'bg-white shadow-md text-indigo-600 border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <r.icon size={14} />
                  <span className="hidden sm:inline">{r.label}</span>
                  {r.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[8px] text-white items-center justify-center border border-white font-bold">{r.count}</span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
               {isInstAuthenticated && (
                  <button onClick={() => { setIsInstAuthenticated(false); sessionStorage.removeItem('serveDesk_auth'); }} className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all hover:bg-red-100">
                    <LogOut size={14} /> <span className="hidden sm:inline">Keluar</span>
                  </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `nav div::-webkit-scrollbar { display: none; }`}} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-indigo-600 animate-in fade-in duration-500">
             <Loader2 className="animate-spin mb-4" size={48} />
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Memuatkan Pangkalan Data...</p>
          </div>
        ) : role === 'dashboard' ? (
          <div className="animate-in fade-in duration-700 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Utama</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Status Penyelenggaraan ADTEC JTM Kampus Sandakan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Jumlah Aduan', val: stats.total, color: 'blue', icon: ClipboardList },
                    { label: 'Menunggu', val: stats.baru, color: 'amber', icon: AlertCircle },
                    { label: 'Dibaiki', val: stats.proses, color: 'indigo', icon: Wrench },
                    { label: 'Selesai', val: stats.selesai, color: 'emerald', icon: CheckCircle },
                ].map((s) => (
                    <div key={s.label} className="bg-white/90 backdrop-blur-sm p-6 rounded-[2.5rem] border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                        <div className={`bg-${s.color}-50 text-${s.color}-600 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform border border-${s.color}-100`}>
                            <s.icon size={24} />
                        </div>
                        <p className="text-4xl font-black text-slate-800 tracking-tighter">{s.val}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SMART FILTERING: Hanya papar makmal yang ada kes */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] border border-slate-200/80 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100"><Activity size={20}/></div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Kekerapan Aduan Makmal</h3>
                        </div>
                        
                        {activeLabStats.length > 0 ? (
                            <div className="space-y-6">
                                {activeLabStats.map((item, index) => {
                                    const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                    return (
                                        <div key={item.lab} className="relative group">
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-400 w-4">#{index + 1}</span>
                                                    <p className="text-sm font-bold text-slate-700">{item.lab}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">{item.count} Kes</p>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden ml-7 w-[calc(100%-28px)]">
                                                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-1000 group-hover:from-indigo-400 group-hover:to-blue-300" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center">
                                <div className="bg-emerald-50 p-5 rounded-full text-emerald-500 mb-4 border-4 border-emerald-100/50"><ShieldCheck size={36} /></div>
                                <p className="text-sm font-black text-slate-700 uppercase">Semua Makmal Beroperasi Cemerlang!</p>
                                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Tiada Kerosakan Direkodkan Buat Masa Ini</p>
                            </div>
                        )}
                    </div>

                    {/* LIVE FEED: Log Aktiviti Terkini */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] border border-slate-200/80 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-100 p-2 rounded-xl text-slate-600 border border-slate-200"><History size={20}/></div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Log Aktiviti Terkini</h3>
                        </div>
                        <div className="space-y-3">
                            {complaints.slice(0, 4).map(c => (
                                <div key={c.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default">
                                    <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${c.status === 'Baru' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : c.status === 'Selesai' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]'}`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.lab} <span className="text-slate-400 font-normal ml-1">| PC-{c.pcNo}</span></p>
                                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{c.status === 'Baru' ? c.issue : c.technicalAction}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{formatDate(c.dateUpdated || c.dateCreated)} - {formatTime(c.dateUpdated || c.dateCreated)}</p>
                                    </div>
                                </div>
                            ))}
                            {complaints.length === 0 && <p className="text-[10px] text-slate-400 text-center py-6 font-bold uppercase tracking-widest">Tiada Aktiviti Direkodkan</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] border border-slate-200/80 shadow-sm p-8 h-fit sticky top-28">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-600 border border-slate-200"><PieChart size={20}/></div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Kategori Isu</h3>
                    </div>
                    <div className="space-y-4">
                        {['Perkakasan', 'Perisian', 'Rangkaian'].map(cat => {
                            const count = complaints.filter(c => c.category.includes(cat)).length;
                            return (
                                <div key={cat} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 transition-all">
                                    <div className={`h-3 w-3 rounded-full shadow-sm ${cat === 'Perkakasan' ? 'bg-orange-500' : cat === 'Perisian' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                                    <div className="flex-grow">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</p>
                                        <p className="text-sm font-black text-slate-700">{count} Kes</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          </div>
        ) : (role === 'pengajar' || role === 'juruteknik') && !isInstAuthenticated ? (
          <div className="flex items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/90 backdrop-blur-md rounded-[3rem] border border-slate-200/80 shadow-2xl p-10 md:p-16 max-w-md w-full relative overflow-hidden text-center">
               <div className="bg-indigo-50 text-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-indigo-100"><Lock size={32} /></div>
               <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">PENGESAHAN STAF</h2>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 mb-10">Masukkan kredential petugas {role.toUpperCase()}</p>
               <form onSubmit={handleSystemLogin} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Username</label>
                    <input type="text" required className="w-full bg-white border-2 border-slate-200/80 rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 shadow-sm transition-all" placeholder="Username" value={loginInput.username} onChange={(e) => setLoginInput({...loginInput, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Kata Laluan</label>
                    <input type="password" required className="w-full bg-white border-2 border-slate-200/80 rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 shadow-sm transition-all" placeholder="••••••••" value={loginInput.pass} onChange={(e) => setLoginInput({...loginInput, pass: e.target.value})} />
                  </div>
                  {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 p-2 rounded-lg border border-red-100">{loginError}</p>}
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.8rem] uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">Log Masuk</button>
               </form>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 text-left">
            {role === 'pengajar' && isInstAuthenticated && (
              <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/80 p-8 mb-8 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100 text-white border border-indigo-500">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Papan Kawalan Pengajar</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Sahkan Penyelenggaraan & Arkib Digital</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="grid grid-cols-2 sm:flex gap-3 w-full lg:w-auto">
                      <button onClick={handleExportCSV} className="bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 shadow-sm">
                        <FileSpreadsheet size={16} className="text-emerald-600" /> Export CSV
                      </button>
                      <a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 border border-indigo-700">
                        <FolderOpen size={16} /> Arkib Drive <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Menunggu Tindakan</p>
                    <p className="text-2xl font-black text-slate-800">{stats.baru}</p>
                  </div>
                  <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Perlu Sahkan</p>
                    <p className="text-2xl font-black text-slate-800">{stats.proses}</p>
                  </div>
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Sudah Selesai</p>
                    <p className="text-2xl font-black text-slate-800">{stats.selesai}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jumlah Aduan</p>
                    <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                  </div>
                </div>
              </div>
            )}

            {role === 'pemohon' && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/80 p-8 md:p-10 mb-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                       <Monitor size={14} /> Sokongan Teknikal
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase mb-3">
                      Aduan Kerosakan ICT
                    </h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg mb-6">
                      Platform rasmi untuk melaporkan kerosakan perkakasan, perisian, atau masalah rangkaian di makmal dan bengkel. Kami sentiasa bersedia membantu anda.
                    </p>
                    <button onClick={() => {setEditingId(null); setShowForm(true);}} className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-indigo-100 transition-all active:scale-95 border border-indigo-700">
                       <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> Lapor Kerosakan Baru
                    </button>
                  </div>
                  <div className="hidden md:flex relative z-10 w-full max-w-xs justify-end">
                     <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-inner text-center w-full relative">
                        <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-600">
                           <Monitor size={32} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Sistem</p>
                        <p className="text-sm font-black text-emerald-600 flex items-center justify-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span> Sedia Menerima
                        </p>
                     </div>
                  </div>
                </div>

                {/* Seksyen Langkah-langkah Baharu Untuk Pemohon - MODERN UI */}
                <div className="px-2 sm:px-8 mb-4">
                  <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Bagaimana Ia Berfungsi?</h3>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 relative">
                    
                    {/* Langkah 1 */}
                    <div className="flex-1 relative group animate-in fade-in slide-in-from-bottom-8 duration-500">
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">1</div>
                      <div className="h-full bg-white/80 backdrop-blur-sm p-8 pt-10 rounded-3xl border-2 border-transparent hover:border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform duration-300">
                          <FileText size={24} />
                        </div>
                        <h4 className="font-black text-slate-800 text-base uppercase tracking-tight mb-2">Lapor Kerosakan</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Pemohon mengisi borang aduan digital dengan butiran masalah yang dihadapi.</p>
                      </div>
                    </div>

                    {/* Langkah 2 */}
                    <div className="flex-1 relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">2</div>
                      <div className="h-full bg-white/80 backdrop-blur-sm p-8 pt-10 rounded-3xl border-2 border-transparent hover:border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-rotate-12 transition-transform duration-300">
                          <Wrench size={24} />
                        </div>
                        <h4 className="font-black text-slate-800 text-base uppercase tracking-tight mb-2">Penyelenggaraan</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Juruteknik ICT memeriksa, membaiki, dan merekod log pembaikan dalam sistem.</p>
                      </div>
                    </div>

                    {/* Langkah 3 */}
                    <div className="flex-1 relative group animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">3</div>
                      <div className="h-full bg-white/80 backdrop-blur-sm p-8 pt-10 rounded-3xl border-2 border-transparent hover:border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform duration-300">
                          <ShieldCheck size={24} />
                        </div>
                        <h4 className="font-black text-slate-800 text-base uppercase tracking-tight mb-2">Pengesahan</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Pengajar menyemak hasil kerja dan membuat pengesahan akhir secara digital.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {role !== 'pemohon' && (
              <>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
                  <div className="flex flex-col md:flex-row gap-4 w-full flex-grow">
                    <div className="relative flex-grow">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Cari No. Borang, Nama Pengadu, atau Isu..." 
                        className="w-full bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative w-full md:w-64 shrink-0">
                      <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        value={filterLab} 
                        onChange={(e) => setFilterLab(e.target.value)} 
                        className="w-full bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Semua Makmal</option>
                        {LABS.map(lab => <option key={lab} value={lab}>{lab}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredComplaints.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-md p-24 rounded-[3.5rem] border-2 border-dashed border-slate-200/80 flex flex-col items-center text-center shadow-sm">
                      <ClipboardList size={64} className="text-slate-300 mb-6 opacity-50" />
                      <h3 className="font-black text-slate-800 text-2xl mb-2 tracking-widest uppercase">Tiada Rekod Dijumpai</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cuba tukar penapis atau kata kunci carian anda</p>
                    </div>
                  ) : (
                    filteredComplaints.map((item) => (
                      <div key={item.id} className="relative bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                        <div className="p-8 flex flex-col xl:flex-row gap-8">
                          <div className="xl:w-60 shrink-0 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-slate-100 pb-6 xl:pb-0 xl:pr-8">
                            <div>
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 border ${
                                item.status === 'Baru' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                item.status === 'Penyelenggaraan' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  item.status === 'Baru' ? 'bg-amber-500' : 
                                  item.status === 'Penyelenggaraan' ? 'bg-indigo-500 animate-pulse' : 
                                  item.status === 'Selesai' ? 'bg-emerald-500' : 'bg-red-500'
                                }`}></span>
                                {item.status}
                              </div>
                              
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Maklumat Masa</p>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                                  <Calendar size={14} className="text-slate-400"/> {formatDate(item.dateCreated)}
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 text-xs font-black">
                                  <Clock size={14} className="text-indigo-400"/> {formatTime(item.dateCreated)}
                                </div>
                              </div>
                            </div>

                            {item.formNo && (
                              <div className="mt-6">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">No. Rujukan</p>
                                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 text-center shadow-inner">
                                  {item.formNo}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">{item.lab}</span>
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">{item.category}</span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                              PC-{item.pcNo} 
                              <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-md font-mono shadow-sm">#{item.assetNo || 'NA'}</span>
                            </h3>
                            
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 relative shadow-inner">
                              <AlertCircle className="absolute -top-3 -right-3 text-amber-500 bg-white rounded-full p-0.5 shadow-sm" size={24} />
                              <p className="text-slate-700 text-sm font-medium leading-relaxed italic">"{item.issue}"</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="flex items-center gap-3 border border-slate-100 p-3.5 rounded-2xl bg-white shadow-sm hover:border-indigo-100 transition-colors">
                                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100"><User size={16} /></div>
                                  <div>
                                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pengadu</p>
                                     <p className="text-xs font-black text-slate-800">{item.applicantName}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-3 border border-slate-100 p-3.5 rounded-2xl bg-white shadow-sm hover:border-indigo-100 transition-colors">
                                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100"><Briefcase size={16} /></div>
                                  <div>
                                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Unit / Jawatan</p>
                                     <p className="text-xs font-black text-slate-800 truncate">{item.unit}</p>
                                  </div>
                               </div>
                            </div>
                          </div>

                          <div className="xl:w-80 shrink-0 border-t xl:border-t-0 xl:border-l border-slate-100 pt-6 xl:pt-0 xl:pl-8 flex flex-col">
                            <div className="flex-grow mb-6">
                               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">LOG TINDAKAN ICT</h4>
                               
                               {item.technicalAction ? (
                                 <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3 shadow-inner">
                                    <div className="flex flex-wrap gap-2">
                                       <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter">{item.techCategory}</span>
                                       <span className="bg-white text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[8px] font-black shadow-sm">{item.techItem}</span>
                                    </div>
                                    <p className="text-xs text-slate-800 font-bold italic leading-snug">"{item.technicalAction}"</p>
                                    <div className="flex items-center gap-2 pt-2 border-t border-indigo-100/50 mt-2">
                                      <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center text-[8px] font-black text-indigo-700 uppercase shadow-sm border border-indigo-100">
                                        {item.technicianName?.charAt(0) || 'T'}
                                      </div>
                                      <p className="text-[9px] text-indigo-700 font-black uppercase tracking-tighter">{item.technicianName}</p>
                                    </div>
                                 </div>
                               ) : (
                                 <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                   Menunggu Juruteknik
                                 </div>
                               )}
                               
                               {item.verifiedBy && (
                                 <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                                   <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-100"><ShieldCheck size={18} /></div>
                                   <div className="text-left overflow-hidden">
                                      <p className="text-[9px] text-emerald-700 font-black uppercase leading-none mb-1 tracking-widest">Disahkan Oleh</p>
                                      <p className="text-xs font-black text-slate-800 leading-tight truncate">{item.verifiedBy}</p>
                                      <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
                                        {formatDate(item.dateVerified)}
                                      </p>
                                   </div>
                                 </div>
                               )}
                            </div>

                            {/* BARISAN BUTANG TINDAKAN (TERMASUK EDIT & PADAM) */}
                            <div className="space-y-3 mt-auto">
                              <div className="flex gap-2">
                                {role === 'juruteknik' && item.status !== 'Selesai' && item.status !== 'Ditolak' && isInstAuthenticated && (
                                  <button 
                                    onClick={() => { 
                                      setActiveTechModal(item.id); 
                                      setActionData({ text: item.technicalAction || '', techName: item.technicianName || '', techCategory: item.techCategory || '', techItem: item.techItem || '' }); 
                                      setProofImages(item.proofImages || []);
                                    }} 
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all border border-indigo-700"
                                  >
                                    Update Log
                                  </button>
                                )}
                                
                                {role === 'pengajar' && item.status === 'Penyelenggaraan' && isInstAuthenticated && (
                                  <button onClick={() => setActiveVerifyModal(item.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-700">
                                    <CheckCircle size={14}/> Sahkan & Arkib
                                  </button>
                                )}

                                {role === 'pengajar' && (item.status === 'Baru' || item.status === 'Penyelenggaraan') && isInstAuthenticated && (
                                    <button onClick={() => setItemToReject(item.id)} className="bg-white text-red-600 hover:bg-red-50 p-3.5 rounded-xl transition-all active:scale-95 border border-slate-200 shadow-sm" title="Tolak Aduan">
                                        <X size={16} />
                                    </button>
                                )}
                              </div>

                              {/* BUTANG EDIT & PADAM UNTUK STAF */}
                              {isInstAuthenticated && (
                                 <div className="flex gap-2 border-t border-slate-100 pt-3 mt-1">
                                    <button onClick={() => handleEditClick(item)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider" title="Edit Borang">
                                       <Edit size={14}/> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider" title="Padam Rekod">
                                       <Trash2 size={14}/> Padam
                                    </button>
                                 </div>
                              )}
                              
                              {item.status === 'Selesai' && (
                                <button onClick={() => setActivePreviewItem(item)} className="w-full bg-slate-900 text-white hover:bg-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-800 shadow-md mt-2">
                                  <Eye size={14}/> Papar Borang Digital
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* MODAL: Aduan Baru / Edit Borang */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-start justify-center p-4 py-10 sm:py-16 z-50 overflow-y-auto text-left">
          <div className={`bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full relative overflow-hidden transform transition-all duration-500 border border-slate-100 ${isSubmitting ? 'scale-95 opacity-50' : 'scale-100'}`}>
            {showSuccessAnim && (
                <div className="absolute inset-0 z-[60] bg-white flex flex-col items-center justify-center animate-in fade-in">
                    <div className="bg-emerald-50 p-6 rounded-full animate-bounce border-[8px] border-emerald-100/50"><CheckCircle size={80} className="text-emerald-500" /></div>
                    <h2 className="text-3xl font-black text-slate-800 mt-8 uppercase tracking-tighter">{editingId ? 'Borang Dikemas Kini!' : 'Aduan Berjaya Dihantar!'}</h2>
                </div>
            )}
            
            <div className="bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl border border-indigo-100"><Send size={22} /></div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase leading-none">{editingId ? 'Edit Aduan Kerosakan' : 'Borang Aduan Kerosakan'}</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">Sokongan Teknikal ICT ADTEC SDK</p>
                  </div>
                </div>
                <button disabled={isSubmitting} onClick={() => {setShowForm(false); setEditingId(null);}} className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-2.5 rounded-xl transition-all border border-slate-200"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmitComplaint} className="p-8 md:p-10 bg-slate-50/50">
              <div className="space-y-10">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div> 1. Maklumat Pengadu
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Nama Penuh <span className="text-red-500">*</span></label>
                        <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="Masukkan nama penuh" value={formData.applicantName} onChange={(e) => setFormData({...formData, applicantName: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Unit / Jabatan <span className="text-red-500">*</span></label>
                        <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="Contoh: Unit ICT" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Jawatan <span className="text-red-500">*</span></label>
                        <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="Contoh: Pengajar" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">No. Telefon <span className="text-red-500">*</span></label>
                        <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="01X-XXXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Alamat Emel <span className="text-red-500">*</span></label>
                        <input type="email" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="emel@adtec.edu.my" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="h-2 w-2 rounded-full bg-slate-800"></div> 2. Butiran Kerosakan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Lokasi / Makmal <span className="text-red-500">*</span></label>
                        <select required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold outline-none cursor-pointer focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 appearance-none" value={formData.lab} onChange={(e) => setFormData({...formData, lab: e.target.value})}>
                          <option value="">-- Pilih Lokasi --</option>
                          {LABS.map(lab => <option key={lab} value={lab}>{lab}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">No. PC / ID Aset <span className="text-red-500">*</span></label>
                        <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="Contoh: PC-01 / Aset-123" value={formData.pcNo} onChange={(e) => setFormData({...formData, pcNo: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Kategori Isu Utama <span className="text-red-500">*</span></label>
                        <select required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold outline-none cursor-pointer focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option value="">-- Pilih Kategori Masalah --</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2 relative mt-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Perincian Masalah <span className="text-red-500">*</span></label>
                        <textarea required disabled={isSubmitting || isGeneratingIssue} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold h-32 resize-none leading-relaxed focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none pb-14" placeholder="Sila nyatakan kerosakan secara terperinci... Contoh: CPU berbunyi bising dan tidak memaparkan skrin." value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})}></textarea>
                        
                        <div className="absolute bottom-3 left-4 right-3 flex justify-between items-center">
                            <span className="text-[9px] text-slate-400 font-bold hidden sm:block italic">Klik butang AI untuk perkemaskan susunan ayat anda.</span>
                            <button type="button" onClick={handleAIGenerateIssue} disabled={isGeneratingIssue || !formData.issue} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-200 ml-auto shadow-sm">
                                {isGeneratingIssue ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} AI Bantu Tulis
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button type="button" disabled={isSubmitting} onClick={() => {setShowForm(false); setEditingId(null);}} className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs active:scale-95 hover:bg-slate-50 shadow-sm">BATAL</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 border border-indigo-700 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>{editingId ? 'SIMPAN KEMAS KINI' : 'HANTAR ADUAN'} <Send size={18}/></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Update Log Juruteknik */}
      {activeTechModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto text-left">
          <div className={`bg-white rounded-[3rem] shadow-2xl max-md w-full relative overflow-hidden transform transition-all ${isSubmitting ? 'scale-95' : 'scale-100'}`}>
            {showSuccessAnim && (
                <div className="absolute inset-0 z-[60] bg-white flex flex-col items-center justify-center animate-in fade-in">
                    <div className="bg-indigo-100 p-6 rounded-full animate-pulse border-[10px] border-indigo-50"><Wrench size={60} className="text-indigo-600" /></div>
                    <h2 className="text-2xl font-black text-slate-800 mt-8 uppercase tracking-tighter">Log Diperbaharui</h2>
                </div>
            )}
            <button disabled={isSubmitting} onClick={() => { setActiveTechModal(null); setProofImages([]); }} className="absolute top-8 right-10 text-slate-400 hover:text-slate-600 transition-all z-10"><X size={24} /></button>
            
            <div className="flex items-center gap-4 p-10 pb-0">
                <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl border border-indigo-100"><Wrench size={24} /></div>
                <div><h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Update Tindakan</h2><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Log Penyelenggaraan ICT</p></div>
            </div>
            
            <div className="p-10 space-y-5">
              <input type="text" required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all" placeholder="Nama Juruteknik" value={actionData.techName} onChange={(e) => setActionData({...actionData, techName: e.target.value})} />
              <select required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all appearance-none" value={actionData.techCategory} onChange={(e) => setActionData({...actionData, techCategory: e.target.value, techItem: ''})}>
                <option value="">-- Kategori Tindakan --</option>
                {Object.keys(TECH_DETAILS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {actionData.techCategory && (
                <select required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 focus:bg-white animate-in fade-in outline-none transition-all appearance-none" value={actionData.techItem} onChange={(e) => setActionData({...actionData, techItem: e.target.value})}>
                    <option value="">-- Pilih Item Berkenaan --</option>
                    {TECH_DETAILS[actionData.techCategory].map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              )}
              
              <div className="relative">
                  <textarea required disabled={isSubmitting || isGeneratingAction} className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold h-32 resize-none focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all pb-12" placeholder="Nota ringkas kerja yang dilakukan..." value={actionData.text} onChange={(e) => setActionData({...actionData, text: e.target.value})}></textarea>
                  <button type="button" onClick={handleAIGenerateAction} disabled={isGeneratingAction || !actionData.text} className="absolute bottom-3 right-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-200 shadow-sm">
                      {isGeneratingAction ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} AI Susun Ayat
                  </button>
              </div>

              {/* RUANGAN MUAT NAIK GAMBAR BUKTI */}
              <div className="space-y-3 mt-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Gambar Bukti (Maksimum 3)</label>
                  
                  {proofImages.length > 0 && (
                      <div className="flex gap-3 mb-3 flex-wrap">
                          {proofImages.map((src, idx) => (
                              <div key={idx} className="relative group">
                                  <img src={src} alt="Preview" className="h-20 w-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                                  <button type="button" onClick={() => setProofImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform">
                                      <Trash2 size={12} />
                                  </button>
                              </div>
                          ))}
                      </div>
                  )}

                  {proofImages.length < 3 && (
                      <label className="border-2 border-dashed border-slate-300 rounded-[1.5rem] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-colors">
                          <ImagePlus size={24} className="text-slate-400 mb-2" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Muat Naik Gambar</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isSubmitting} />
                      </label>
                  )}
              </div>

              <button onClick={handleUpdateAction} disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] uppercase tracking-widest text-xs active:scale-95 shadow-md shadow-indigo-100 flex items-center justify-center gap-3 transition-all border border-indigo-700 mt-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "SAHKAN TINDAKAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pengesahan Pengajar */}
      {activeVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-sm w-full p-10 relative animate-in slide-in-from-bottom-8 border border-slate-100">
            <button disabled={isSubmitting} onClick={() => setActiveVerifyModal(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-all bg-slate-50 p-2 rounded-xl"><X size={20} /></button>
            <div className="text-center mb-10 mt-4">
              <div className="bg-emerald-50 text-emerald-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-[6px] border-emerald-100/50">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Pengesahan Akhir</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">Sahkan Penyelenggaraan Telah Selesai</p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <select disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-sm font-black focus:ring-2 focus:ring-emerald-100 focus:bg-white outline-none appearance-none cursor-pointer transition-all" value={verifyName} onChange={(e) => setVerifyName(e.target.value)}>
                  <option value="">-- Pilih Nama Pengajar --</option>
                  {INSTRUCTORS.map(name => (<option key={name} value={name}>{name}</option>))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={18} /></div>
              </div>

              {isSubmitting && driveUploadStatus === 'uploading' && (
                <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3 animate-pulse border border-indigo-100">
                  <CloudUpload className="text-indigo-600 animate-bounce" size={20} />
                  <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Menyusun Folder & Muat Naik...</span>
                </div>
              )}

              <button onClick={handleVerify} disabled={!verifyName || isSubmitting} className={`w-full text-white font-black py-5 rounded-[1.5rem] transition-all uppercase tracking-widest text-xs active:scale-95 flex items-center justify-center border ${verifyName && !isSubmitting ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 border-emerald-700' : 'bg-slate-300 border-slate-400 cursor-not-allowed opacity-70'}`}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "SELESAIKAN ADUAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tolak Aduan */}
      {itemToReject && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-[70] text-center">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 animate-in zoom-in border border-slate-100">
            <div className="bg-red-50 text-red-600 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-red-100">
                <FileWarning size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tolak Aduan?</h2>
            <p className="text-xs text-slate-500 mt-3 font-medium px-4">Rekod aduan ini akan dibatalkan serta-merta. Pastikan anda mempunyai alasan munasabah.</p>
            <div className="flex gap-4 mt-8">
                <button onClick={() => setItemToReject(null)} className="flex-1 bg-slate-50 text-slate-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 border border-slate-200 hover:bg-slate-100 transition-all">Batal</button>
                <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-md shadow-red-100 active:scale-95 border border-red-700 transition-all">Tolak Terus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRATINJAU BORANG */}
      {activePreviewItem && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full relative animate-in zoom-in flex flex-col h-[90vh]">
            <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center shrink-0 rounded-t-[2rem]">
               <div className="flex items-center gap-4 text-left ml-2">
                  <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100"><Eye size={20}/></div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Pratinjau Borang</h2>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Format A4 Digital ServeDesk+</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 mr-2">
                  <button onClick={() => generatePDFFromPreview(activePreviewItem.id)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all border border-indigo-700 hidden sm:flex">
                    <Download size={14}/> MUAT TURUN
                  </button>
                  <button onClick={() => setActivePreviewItem(null)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all"><X size={20}/></button>
               </div>
            </div>
            
            <div className="flex-grow p-4 md:p-10 overflow-y-auto bg-slate-100 flex justify-center items-start">
               <PDFContent item={activePreviewItem} idPrefix="pdf-content" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}