import React, { useState, useEffect } from 'react';
import { 
  Building2, User, FileText, ShieldCheck, Wallet, History, LogOut, 
  CheckCircle, Loader2, ArrowRight, Search, Plus, UserCircle, Key, Activity,
  Globe, Zap, UploadCloud, FileCheck, XCircle, Clock, X, Users
} from 'lucide-react';
import { getContract } from "./utils/contract";
import { ethers } from "ethers";

import CONTRACT_ABI from "./contracts/DigitalDocumentRegistryABI.json";

const CONTRACT_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const API_URL = 'http://localhost:5000/api';

console.log("ABI loaded:", CONTRACT_ABI.length); // Testing, remove nanti

// --- 1. COMPONENTS (VIEWS & SECTIONS) ---

// --- Dashboard Home View (Dynamic Data) ---
const DashboardHome = ({ user, documents }) => {
  const totalDocs = documents.length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const verifiedDocs = documents.filter(d => d.status === 'verified').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-3">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-indigo-100 text-lg max-w-xl">
            {user?.role === 'citizen' 
              ? 'Your documents are secure. You can upload new files for verification.' 
              : `You have ${pendingDocs} new document(s) waiting for verification.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><FileText size={24}/></div>
          <p className="text-slate-500 text-sm font-bold uppercase">Total Documents</p>
          <p className="text-3xl font-black text-slate-800">{totalDocs}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><ShieldCheck size={24}/></div>
          <p className="text-slate-500 text-sm font-bold uppercase">Verified Status</p>
          <p className="text-3xl font-black text-emerald-600">{verifiedDocs} <span className="text-sm text-slate-400 font-medium">/ {totalDocs || 1}</span></p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={24}/></div>
          <p className="text-slate-500 text-sm font-bold uppercase">Pending</p>
          <p className="text-3xl font-black text-orange-600">{pendingDocs}</p>
        </div>
      </div>
    </div>
  );
};

// --- Issue Document View (Institution - Integrated) ---
const IssueDocumentView = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({ title: '', type: 'KTP', citizenName: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', type: 'KTP', citizenName: '' }); // Reset form
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Plus className="text-blue-600"/> Issue New Document</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Document Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
            >
              <option value="KTP">KTP (Identity Card)</option>
              <option value="KK">KK (Family Card)</option>
              <option value="Ijazah">Ijazah (Certificate)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Document Title</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. E-KTP 2025" 
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">Citizen Name</label>
          <input 
            value={formData.citizenName}
            onChange={(e) => setFormData({...formData, citizenName: e.target.value})}
            className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Full Name of Citizen" 
            required
          />
        </div>
        <button disabled={loading} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl w-full flex justify-center items-center gap-2 hover:bg-slate-800 transition disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin"/> : 'Record to Blockchain'}
        </button>
      </form>
    </div>
  );
};

// --- My Documents View (Citizen - Integrated) ---
const MyDocumentsView = ({ documents, onUpload, loading }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Surat Keterangan' });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setIsUploading(false);
    setFormData({ title: '', type: 'Surat Keterangan' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-600"/> My Digital Documents</h2>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          {isUploading ? <X size={18}/> : <UploadCloud size={18}/>}
          {isUploading ? 'Cancel' : 'Request Document'}
        </button>
      </div>

      {isUploading && (
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-blue-300 mb-6 animate-fadeIn">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Request New Document</h3>
          <form onSubmit={handleUploadSubmit} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Document Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Surat Keterangan</option>
                  <option>Akta Kelahiran (Scan)</option>
                  <option>Ijazah (Scan)</option>
                  <option>NPWP</option>
                </select>
             </div>
             <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description / Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Request for SKCK"
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border px-4 py-2 rounded-lg"
                />             
             <button disabled={loading}  onClick={submitDocument} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 transition w-full md:w-auto min-w-[120px] flex justify-center">
               {loading ? <Loader2 className="animate-spin" size={20}/> : 'Submit Request'}
             </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24}/></div>
              {doc.status === 'verified' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1"><CheckCircle size={12}/> Verified</span>}
              {doc.status === 'pending' && <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1"><Clock size={12}/> Pending</span>}
              {doc.status === 'rejected' && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1"><XCircle size={12}/> Rejected</span>}
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1">{doc.title}</h3>
            <p className="text-xs text-slate-400 font-mono mb-2 truncate" title={doc.hash}>{doc.hash}</p>
            <p className="text-xs text-slate-500 mb-6">Date: {doc.date}</p>
            
            <button className="w-full py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">View Details</button>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="col-span-3 text-center py-10 text-slate-400 font-medium">
             No documents found.
          </div>
        )}
      </div>
    </div>
  );
};

const submitDocument = async () => {
  const cid = await uploadToIPFS();

  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer
  );

  const tx = await contract.uploadDocument(
    "Judul Dokumen",
    cid,
    new Date().toISOString().split("T")[0]
  );

  await tx.wait();
  alert("Document uploaded to blockchain!");
};

const uploadToIPFS = async () => {
  if (!file) return alert("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: "b99421d4f149de72f26e",
      pinata_secret_api_key: "4ff3c923cc120651098296df1508943a25faa0a97850f6ff7cb5ce4bcb1c838f",
    },
    body: formData,
  });

  const data = await res.json();
  return data.IpfsHash; 
};

// --- Wallet View (Integrated) ---
const WalletView = ({ wallet }) => (
  <div className="animate-fadeIn max-w-2xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Wallet className="text-blue-600"/> Digital Wallet</h2>
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white shadow-2xl mb-8">
      <p className="text-slate-400 mb-2">Wallet Balance</p>
      <h3 className="text-5xl font-black mb-8">0.00 <span className="text-2xl text-slate-500">ETH</span></h3>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-xs uppercase mb-1">Address</p>
          <p className="font-mono bg-white/10 px-3 py-1 rounded-lg text-sm">{wallet || 'Not Connected'}</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/> Connected</div>
      </div>
    </div>
  </div>
);

// --- History View (Shared) ---
const HistoryView = () => (
  <div className="animate-fadeIn">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><History className="text-blue-600"/> Activity History</h2>
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      {[1,2,3,4].map((item) => (
        <div key={item} className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Activity size={18}/></div>
            <div>
              <p className="font-bold text-slate-800">Document Activity</p>
              <p className="text-xs text-slate-400">2 hours ago • ID: #829102</p>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-400">-0.0001 ETH</span>
        </div>
      ))}
    </div>
  </div>
);

// --- Verification View (Institution - Integrated) ---
const VerificationView = ({ documents, onVerifyAction }) => {
  const pendingDocs = documents.filter(d => d.status === 'pending');
  const [loadingId, setLoadingId] = useState(null);

  const handleAction = async (id, action) => {
    setLoadingId(id);
    await onVerifyAction(id, action);
    setLoadingId(null);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Search className="text-blue-600"/> Verify Document</h2>
      
      {/* Existing Search Functionality */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8 max-w-3xl">
        <p className="text-slate-500 mb-6">Enter the unique hash ID of the document to verify its authenticity on the blockchain.</p>
        <div className="flex gap-3 mb-6">
          <input className="flex-1 px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 0x829..." />
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Check</button>
        </div>
      </div>

      {/* NEW: Pending Verification List */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <FileCheck className="text-orange-500"/> Pending Verification Requests
           <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingDocs.length}</span>
        </h3>

        {pendingDocs.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No pending documents to verify.</p>
            </div>
        ) : (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase">Owner</th>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase">Document</th>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase">Date</th>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {pendingDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-indigo-50/30 transition">
                        <td className="p-6 font-bold text-slate-700">{doc.owner}</td>
                        <td className="p-6">
                            <div className="font-bold text-slate-800">{doc.title}</div>
                            <div className="text-xs text-slate-400 font-mono truncate max-w-[150px]" title={doc.hash}>{doc.hash}</div>
                        </td>
                        <td className="p-6 text-sm text-slate-500">{doc.date}</td>
                        <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => handleAction(doc.id, 'rejected')}
                                    disabled={loadingId === doc.id}
                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                >
                                    <XCircle size={20}/>
                                </button>
                                <button 
                                    onClick={() => handleAction(doc.id, 'verified')}
                                    disabled={loadingId === doc.id}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 disabled:bg-slate-400"
                                >
                                    {loadingId === doc.id ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle size={16}/>}
                                    Verify
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

// --- Profile View (Integrated) ---
const ProfileView = ({ user, onLogout }) => (
  <div className="animate-fadeIn max-w-2xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><UserCircle className="text-blue-600"/> Profile Settings</h2>
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={40}/></div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
          <p className="text-slate-500 capitalize">{user?.role} Account</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
          <span className="text-slate-600 font-bold">Email Connected</span>
          <span className="text-slate-400 text-sm">{user?.email || 'Connected'}</span>
        </div>
        <button onClick={onLogout} className="text-red-500 font-bold text-sm hover:underline">Disconnect & Logout</button>
      </div>
    </div>
  </div>
);

// --- Document Products Section (Preserved) ---
const DocumentProducts = () => {
  const documents = [
    { id: 1, title: "KTP (ID Card)", desc: "Essential identity document secured on blockchain for authorized access only.", icon: User },
    { id: 2, title: "KK (Family Card)", desc: "Protect family info in a decentralized ledger ensuring transparency.", icon: Users },
    { id: 3, title: "Akta Kelahiran", desc: "Authentic birth certificates, verifiable and tamper-proof.", icon: FileText },
    { id: 4, title: "Sertifikat Tanah", desc: "Property ownership fully secured, preventing fraudulent claims.", icon: Building2 },
  ];

  return (
    <section className="py-20 px-4 mx-4 md:mx-10 mb-20 rounded-[3rem] bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Document Products</h2>
          <p className="text-blue-100 text-lg font-medium">Your documents, all within a decentralized and secure environment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-indigo-500/30">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-inner">
                <doc.icon className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3">{doc.title}</h3>
              <p className="text-sm text-blue-100 leading-relaxed opacity-90 font-light">
                {doc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Partners Section ---
import imigrasiLogo from "./assets/imigrasibg.png";
import polriLogo from "./assets/polri.png";
import tniLogo from "./assets/tnibg.png";

const Partners = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Partner Institution</h2>
        <p className="text-green-600 font-bold tracking-widest uppercase text-xs mb-16">MEET OUR TRUSTED PARTNERS</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
          
          {/* Kementerian Imigrasi */}
          <div className="group flex flex-col items-center gap-6 cursor-default">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border-[6px] border-slate-100 group-hover:border-green-100 group-hover:bg-green-50 transition-all duration-500 shadow-sm group-hover:scale-110 overflow-hidden">
              <img 
                src={imigrasiLogo} // Panggil variabel import tadi
                alt="Logo Imigrasi" 
                className="w-20 h-20 object-contain drop-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <span className="font-bold text-slate-700 text-base tracking-tight group-hover:text-green-700 transition-colors">
              Imigrasi
            </span>
          </div>

          {/* POLRI */}
          <div className="group flex flex-col items-center gap-6 cursor-default">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border-[6px] border-slate-100 group-hover:border-green-100 group-hover:bg-green-50 transition-all duration-500 shadow-sm group-hover:scale-110 overflow-hidden">
              <img 
                src={polriLogo} // Panggil variabel import tadi
                alt="Logo POLRI"
                className="w-20 h-20 object-contain drop-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <span className="font-bold text-slate-700 text-base tracking-tight group-hover:text-green-700 transition-colors">
              POLRI
            </span>
          </div>

          {/* TNI */}
          <div className="group flex flex-col items-center gap-6 cursor-default">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border-[6px] border-slate-100 group-hover:border-green-100 group-hover:bg-green-50 transition-all duration-500 shadow-sm group-hover:scale-110 overflow-hidden">
               <img 
                src={tniLogo} // Panggil variabel import tadi
                alt="Logo TNI" 
                className="w-20 h-20 object-contain drop-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <span className="font-bold text-slate-700 text-base tracking-tight group-hover:text-green-700 transition-colors">
              TNI
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};


// --- 2. MAIN COMPONENTS ---

const Navbar = ({ isLoggedIn, onLoginClick, onSignUpClick, onLogout, user }) => (
  <nav className="flex justify-between items-center px-6 md:px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 transition-all">
    <div className="text-2xl font-extrabold tracking-tight flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent" onClick={() => window.location.reload()}>
        E-Government
    </div>
    <div className="flex gap-4">
      {!isLoggedIn ? (
        <>
          <button onClick={onSignUpClick} className="hidden md:block px-5 py-2.5 text-slate-600 font-bold hover:text-indigo-600 transition">Register</button>
          <button onClick={onLoginClick} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300">Login / Sign In</button>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <span className={`hidden md:flex text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border ${user?.role === 'citizen' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
            {user?.role} Portal
          </span>
          <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition text-sm">
            <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </div>
  </nav>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-md p-4 transition-all animate-fadeIn">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl transform transition-all scale-100 border border-white/50 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"><X size={16} /></button>
        {title && <h2 className="text-2xl font-black mb-6 text-slate-800 text-center">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

const Sidebar = ({ user, activeMenu, onMenuClick, notificationCount }) => {
  const citizenMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: UserCircle },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
    { id: 'history', label: 'Activity History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];
  const institutionMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'issue', label: 'Issue Document', icon: Plus },
    { id: 'verify', label: 'Verification Services', icon: Search, badge: notificationCount },
    { id: 'history', label: 'Issuance History', icon: History },
    { id: 'profile', label: 'Institution Profile', icon: User },
  ];
  const menus = user?.role === 'citizen' ? citizenMenus : institutionMenus;

  return (
    <div className="w-72 bg-white border-r border-indigo-50 min-h-[calc(100vh-85px)] hidden md:flex flex-col shadow-sm">
      <div className="p-6">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 ml-2">Main Menu</h3>
        <div className="space-y-3">
          {menus.map((menu) => (
            <button key={menu.id} onClick={() => onMenuClick(menu.id)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeMenu === menu.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
              <div className="flex items-center gap-4">
                <menu.icon size={20} className={activeMenu === menu.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
                {menu.label}
              </div>
              {menu.badge > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{menu.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 mt-auto">
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-900 mb-2">
            <div className="p-1.5 bg-indigo-200 rounded-full"><Key size={12} className="text-indigo-700" /></div>
            <span className="text-xs font-bold uppercase tracking-wider">Wallet Connected</span>
          </div>
          <p className="text-xs font-mono text-slate-500 truncate bg-white/50 p-2 rounded-lg border border-indigo-100/50">{user?.wallet || 'Connecting...'}</p>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, description, icon: Icon, onClick, colorTheme, buttonText }) => {
  const themes = {
    emerald: { bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', shadow: 'hover:shadow-emerald-500/40', textColor: 'text-emerald-600', subText: 'text-emerald-50' },
    blue: { bg: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600', shadow: 'hover:shadow-indigo-500/40', textColor: 'text-indigo-600', subText: 'text-indigo-100' }
  };
  const theme = themes[colorTheme] || themes.emerald;
  return (
    <div onClick={onClick} className={`group cursor-pointer relative w-full md:w-80 ${theme.bg} rounded-[2rem] p-1 shadow-2xl ${theme.shadow} hover:-translate-y-2 transition-all duration-500`}>
      <div className="bg-white/10 backdrop-blur-sm h-full w-full rounded-[1.8rem] p-8 border border-white/20">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition shadow-inner"><Icon size={40} className="text-white drop-shadow-md" /></div>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
        <p className={`${theme.subText} text-center text-sm mb-8 font-medium`}>{description}</p>
        <div className={`bg-white ${theme.textColor} font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl transition`}>{buttonText} <ArrowRight size={16} /></div>
      </div>
    </div>
  );
};

// --- Hero & Landing ---
const Hero = () => {
  const [docHash, setDocHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if(!docHash) return;
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}/verify/${docHash}`);
        const data = await res.json();
        setResult(data);
    } catch(err) {
        setResult({ valid: false });
    }
    setLoading(false);
  };

  return (
    <section className="relative text-center pt-20 pb-40 px-4 overflow-hidden">
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 shadow-sm"><ShieldCheck size={16} /> Blockchain Powered Security</div>
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Decentralized <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">E-Government</span></h1>
      <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed font-medium">Store, issue, and verify official state documents with immutable blockchain technology. <span className="text-indigo-600">Secure. Transparent. Efficient.</span></p>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white max-w-2xl mx-auto relative z-10 transform translate-y-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-3xl opacity-80"></div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Search size={20} /></div> Public Document Verification</h3>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed text-left">Verify the authenticity of any document issued on our blockchain without logging in.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" value={docHash} onChange={(e) => setDocHash(e.target.value)} placeholder="Enter Document Hash" className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
          <button onClick={handleVerify} disabled={loading} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95">{loading ? <Loader2 className="animate-spin" size={18}/> : 'Check'}</button>
        </div>
        {result && (
          <div className={`p-5 rounded-2xl border-l-4 animate-fadeIn text-left ${result.valid ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-rose-50 border-rose-500 text-rose-900'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${result.valid ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{result.valid ? <CheckCircle size={20} /> : <X size={20} />}</div>
              <div>
                <h4 className="font-bold text-lg">{result.valid ? 'Document Verified & Authentic' : 'Document Not Found / Invalid'}</h4>
                {result.valid && (<div className="text-sm mt-2 space-y-1 opacity-90 font-medium"><p>Type: <span className="font-normal">{result.type}</span></p><p>Owner: <span className="font-normal">{result.owner}</span></p><p>Issued: <span className="font-normal">{result.date}</span></p></div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Landing Page ---
const LandingPage = ({ onOpenAuth }) => (
  <div className="min-h-screen bg-slate-50 font-sans">
    <Hero />
    <div className="mt-24 px-4 mb-32">
      <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Portal</h2><p className="text-slate-500">Select your role to access the specific dashboard</p></div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        <ServiceCard title="Citizen" description="Access your digital wallet, view documents, and check history." icon={User} colorTheme="emerald" buttonText="Login as Citizen" onClick={() => onOpenAuth('login', 'citizen')} />
        <ServiceCard title="Institution" description="Issue new documents, verify citizens, and manage records." icon={Building2} colorTheme="blue" buttonText="Login as Institution" onClick={() => onOpenAuth('login', 'institution')} />
      </div>
    </div>
    
    <DocumentProducts />
    <Partners />

    <footer className="bg-white border-t border-slate-200 py-10 mt-20"><div className="max-w-6xl mx-auto px-4 text-center"><p className="text-slate-500 font-medium">© 2025 Decentralized E-Government. Secured by Blockchain Technology.</p></div></footer>
  </div>
);

// --- 3. CONTROLLERS & APP ---

const Dashboard = ({ user, documents, fetchDocs, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // --- ACTIONS ---
const handleRequestDoc = async (data) => {
  setLoading(true);
  const token = localStorage.getItem("token");

  try {
    const contract = await getContract();

    const tx = await contract.uploadDocument(
      data.title,
      "TEMP_HASH",
      new Date().toISOString().slice(0, 10)
    );

    await tx.wait(); // cukup tunggu sukses

    // SIMPAN KE DATABASE (tanpa documentId dulu)
    await fetch(`${API_URL}/documents/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.title,
        type: data.type,
        txHash: tx.hash,
      }),
    });

    await fetchDocs();
    setActiveMenu("documents");
  } catch (err) {
    console.error("Blockchain error:", err);
    alert("Transaction failed");
  }

  setLoading(false);
};

  const handleIssueDoc = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL}/documents/issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        await fetchDocs(); // Refresh
        setActiveMenu('dashboard');
    } catch(err) {
        console.error(err);
    }
    setLoading(false);
  };

  const handleVerifyDoc = async (id, status) => {
  const token = localStorage.getItem('token');

  try {
    const contract = await getContract();

    let tx;
    if (status === 'verified') {
      tx = await contract.verifyDocument(id);
    } else {
      tx = await contract.rejectDocument(id);
    }

    await tx.wait();

    // Update database
    await fetch(`${API_URL}/documents/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status,
        txHash: tx.hash
      })
    });

    await fetchDocs();
  } catch (err) {
    console.error(err);
    alert("Verification failed");
  }
};

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardHome user={user} documents={documents} />;
      case 'issue': return <IssueDocumentView onSubmit={handleIssueDoc} loading={loading} />;
      case 'documents': return <MyDocumentsView documents={documents} onUpload={handleRequestDoc} loading={loading} />;
      case 'wallet': return <WalletView wallet={user.wallet} />;
      case 'verify': return <VerificationView documents={documents} onVerifyAction={handleVerifyDoc} />;
      case 'history': return <HistoryView />;
      case 'profile': return <ProfileView user={user} onLogout={onLogout} />;
      default: return <DashboardHome user={user} documents={documents} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar user={user} activeMenu={activeMenu} onMenuClick={setActiveMenu} notificationCount={documents.filter(d => d.status === 'pending').length} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'citizen' });

  // Auto Login Check
  useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
             const storedUser = JSON.parse(localStorage.getItem('user'));
             if(storedUser) {
                setUser(storedUser);
                fetchDocuments(token);
             }
        }
    };
    checkAuth();
  }, []);

  const fetchDocuments = async (token) => {
    try {
        const res = await fetch(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if(Array.isArray(data)) {
            setDocuments(data);
        }
    } catch(err) {
        console.log("Fetch error", err);
    }
  };

  const handleAuthSubmit = async () => {
    const endpoint = modalMode === 'login' ? '/auth/login' : '/auth/register';
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authForm)
        });
        const data = await res.json();
        
        if (res.ok) {
            if (modalMode === 'login') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                fetchDocuments(data.token);
                setShowModal(false);
            } else {
                setModalMode('login'); 
                alert('Registration successful! Please login.');
            }
        } else {
            alert(data.message || 'Action failed');
        }
    } catch(err) {
        alert('Connection Failed. Ensure Backend Server is Running!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDocuments([]);
  };

  const handleOpenAuth = (mode, role = 'citizen') => {
    setModalMode(mode);
    setAuthForm({ ...authForm, role });
    setShowModal(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        isLoggedIn={!!user} 
        user={user}
        onLoginClick={() => handleOpenAuth('login')} 
        onSignUpClick={() => handleOpenAuth('signup')} 
        onLogout={handleLogout} 
      />
      
      {!user ? <LandingPage onOpenAuth={handleOpenAuth} /> 
             : <Dashboard user={user} documents={documents} fetchDocs={() => fetchDocuments(localStorage.getItem('token'))} onLogout={handleLogout}/>}
      
      {/* Auth Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'login' ? 'Welcome Back' : 'Create Account'}>
         <div className="space-y-4">
            {modalMode === 'signup' && (
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                    <input className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                           value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} placeholder="John Doe"/>
                </div>
            )}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                       value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} placeholder="name@example.com"/>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                <input type="password" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                       value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} placeholder="••••••••"/>
            </div>
            {modalMode === 'signup' && (
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Account Type</label>
                    <div className="flex gap-4">
                        <button onClick={() => setAuthForm({...authForm, role: 'citizen'})} className={`flex-1 py-3 rounded-xl border font-bold ${authForm.role === 'citizen' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-400'}`}>Citizen</button>
                        <button onClick={() => setAuthForm({...authForm, role: 'institution'})} className={`flex-1 py-3 rounded-xl border font-bold ${authForm.role === 'institution' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-400'}`}>Institution</button>
                    </div>
                </div>
            )}
            <button onClick={handleAuthSubmit} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg transition">
                {modalMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
         </div>
      </Modal>
    </div>
  );
}