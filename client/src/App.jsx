import React, { useState } from 'react';
import { 
  Building2, User, FileText, ShieldCheck, Wallet, History, LogOut, 
  CheckCircle, Loader2, ArrowRight, Search, Plus, UserCircle, Key, Activity,
  Globe, Award, Zap, Heart, Lock, Users, Briefcase, X, Menu, CreditCard
} from 'lucide-react';

// 1. SUB-COMPONENTS (VIEWS)

//Dashboard Home 
const DashboardHome = ({ userType }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="p-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
      <div className="relative z-10">
        <h2 className="text-4xl font-black mb-3">Welcome back, {userType === 'citizen' ? 'Citizen' : 'Institution'}!</h2>
        <p className="text-indigo-100 text-lg max-w-xl">Your blockchain identity is active. {userType === 'citizen' ? 'Your documents are secure.' : 'Ready to issue new credentials.'}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><FileText size={24}/></div>
        <p className="text-slate-500 text-sm font-bold uppercase">Total Documents</p>
        <p className="text-3xl font-black text-slate-800">12</p>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><ShieldCheck size={24}/></div>
        <p className="text-slate-500 text-sm font-bold uppercase">Verified Status</p>
        <p className="text-3xl font-black text-emerald-600">Active</p>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Activity size={24}/></div>
        <p className="text-slate-500 text-sm font-bold uppercase">Transactions</p>
        <p className="text-3xl font-black text-purple-600">24</p>
      </div>
    </div>
  </div>
);

// Issue Document (Institution)
const IssueDocumentView = ({ onSubmit, loading }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fadeIn">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Plus className="text-blue-600"/> Issue New Document</h2>
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">Document Type</label>
          <select className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50">
            <option>KTP (Identity Card)</option>
            <option>KK (Family Card)</option>
            <option>Ijazah (Certificate)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">Citizen NIK</label>
          <input className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="16-digit NIK" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-600 mb-2">Full Name</label>
        <input className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Citizen Name" />
      </div>
      <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl w-full flex justify-center items-center gap-2 hover:bg-slate-800 transition">
        {loading ? <Loader2 className="animate-spin"/> : 'Record to Blockchain'}
      </button>
    </form>
  </div>
);

//My Documents (Citizen) 
const MyDocumentsView = () => (
  <div className="space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-600"/> My Digital Documents</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {['KTP Digital', 'Kartu Keluarga', 'Akta Kelahiran'].map((doc, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24}/></div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">Verified</span>
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">{doc}</h3>
          <p className="text-xs text-slate-400 font-mono mb-6">0x71C...9A23</p>
          <button className="w-full py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">View Details</button>
        </div>
      ))}
    </div>
  </div>
);

// Wallet (Citizen) 
const WalletView = () => (
  <div className="animate-fadeIn max-w-2xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Wallet className="text-blue-600"/> Digital Wallet</h2>
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white shadow-2xl mb-8">
      <p className="text-slate-400 mb-2">Wallet Balance</p>
      <h3 className="text-5xl font-black mb-8">0.45 <span className="text-2xl text-slate-500">ETH</span></h3>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-xs uppercase mb-1">Address</p>
          <p className="font-mono bg-white/10 px-3 py-1 rounded-lg text-sm">0x71C9...9A23</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/> Connected</div>
      </div>
    </div>
  </div>
);

// History (Shared) 
const HistoryView = () => (
  <div className="animate-fadeIn">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><History className="text-blue-600"/> Activity History</h2>
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      {[1,2,3,4].map((item) => (
        <div key={item} className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Activity size={18}/></div>
            <div>
              <p className="font-bold text-slate-800">Document Verified</p>
              <p className="text-xs text-slate-400">2 hours ago • ID: #829102</p>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-400">-0.0001 ETH</span>
        </div>
      ))}
    </div>
  </div>
);

// Verification (Institution) 
const VerificationView = () => (
  <div className="animate-fadeIn max-w-2xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Search className="text-blue-600"/> Verify Document</h2>
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <p className="text-slate-500 mb-6">Enter the unique hash ID of the document to verify its authenticity on the blockchain.</p>
      <div className="flex gap-3 mb-6">
        <input className="flex-1 px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 0x829..." />
        <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Check</button>
      </div>
    </div>
  </div>
);

// Profile (Shared) 
const ProfileView = ({ userType }) => (
  <div className="animate-fadeIn max-w-2xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><UserCircle className="text-blue-600"/> Profile Settings</h2>
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={40}/></div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">{userType === 'citizen' ? 'Susi Susanti' : 'Dukcapil Jakarta'}</h3>
          <p className="text-slate-500">{userType === 'citizen' ? 'Citizen Account' : 'Government Institution'}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
          <span className="text-slate-600 font-bold">Email Connected</span>
          <span className="text-slate-400 text-sm">Email Connected to Wallet</span>
        </div>
        <button className="text-red-500 font-bold text-sm hover:underline">Disconnect Wallet</button>
      </div>
    </div>
  </div>
)
// 2. MAIN COMPONEN

const Navbar = ({ isLoggedIn, onLoginClick, onSignUpClick, onLogout, activeUserType }) => (
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
          <span className={`hidden md:flex text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border ${activeUserType === 'citizen' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
            {activeUserType} Portal
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

const Sidebar = ({ userType, activeMenu, onMenuClick }) => {
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
    { id: 'verify', label: 'Verification Services', icon: Search },
    { id: 'history', label: 'Issuance History', icon: History },
    { id: 'profile', label: 'Institution Profile', icon: User },
  ];
  const menus = userType === 'citizen' ? citizenMenus : institutionMenus;

  return (
    <div className="w-72 bg-white border-r border-indigo-50 min-h-[calc(100vh-85px)] hidden md:flex flex-col shadow-sm">
      <div className="p-6">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 ml-2">Main Menu</h3>
        <div className="space-y-3">
          {menus.map((menu) => (
            <button key={menu.id} onClick={() => onMenuClick(menu.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeMenu === menu.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
              <menu.icon size={20} className={activeMenu === menu.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
              {menu.label}
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
          <p className="text-xs font-mono text-slate-500 truncate bg-white/50 p-2 rounded-lg border border-indigo-100/50">0x71C...9A23</p>
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

const Hero = () => {
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleVerify = () => {
    if(!docId) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      if (docId.includes('123')) { setResult({ valid: true, owner: 'Budi Santoso', type: 'KTP Digital', date: '2024-01-20' }); } else { setResult({ valid: false }); }
    }, 1500);
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
          <input type="text" value={docId} onChange={(e) => setDocId(e.target.value)} placeholder="Enter Document Hash / ID (Try '123')" className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
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

// 3. PAGE CONTROLLERS

const LandingPage = ({ onSelectRole }) => (
  <div className="min-h-screen bg-slate-50 font-sans">
    <Hero />
    <div className="mt-24 px-4 mb-32">
      <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Portal</h2><p className="text-slate-500">Select your role to access the specific dashboard</p></div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        <ServiceCard title="Citizen" description="Access your digital wallet, view documents, and check history." icon={User} colorTheme="emerald" buttonText="Login as Citizen" onClick={() => onSelectRole('citizen')} />
        <ServiceCard title="Institution" description="Issue new documents, verify citizens, and manage records." icon={Building2} colorTheme="blue" buttonText="Login as Institution" onClick={() => onSelectRole('institution')} />
      </div>
    </div>
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16"><h2 className="text-4xl font-black text-slate-900 mb-6">About Us</h2><p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">At E-Government, we believe that the security and authenticity of your personal documents should be guaranteed in the digital age.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition border border-slate-100"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Globe size={28} /></div><h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3><p className="text-slate-600 leading-relaxed">To create a world where personal documents are secure, immutable, and easily verifiable.</p></div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition border border-slate-100"><div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><Zap size={28} /></div><h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3><p className="text-slate-600 leading-relaxed">Empowering individuals and revolutionizing document management through decentralized technology.</p></div>
        </div>
      </div>
    </section>
    <footer className="bg-white border-t border-slate-200 py-10 mt-20"><div className="max-w-6xl mx-auto px-4 text-center"><p className="text-slate-500 font-medium">© 2025 Decentralized E-Government. Secured by Blockchain Technology.</p></div></footer>
  </div>
);

const Dashboard = ({ userType }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIssue = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowSuccessModal(true); }, 2000);
  };

  // LOGIKA RENDER KONTEN BERDASARKAN MENU YANG DIPILIH
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardHome userType={userType} />;
      case 'issue': return <IssueDocumentView onSubmit={handleIssue} loading={loading} />;
      case 'documents': return <MyDocumentsView />;
      case 'wallet': return <WalletView />;
      case 'verify': return <VerificationView />;
      case 'history': return <HistoryView />;
      case 'profile': return <ProfileView userType={userType} />;
      default: return <DashboardHome userType={userType} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar userType={userType} activeMenu={activeMenu} onMenuClick={setActiveMenu} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Recorded Successfully!</h3>
          <p className="text-slate-500 mb-6">The document hash has been deployed into the blockchain.</p>
          <button onClick={() => setShowSuccessModal(false)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">OK</button>
        </div>
      </Modal>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeUserType, setActiveUserType] = useState(null); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState('login'); 

  const handleNavbarLogin = () => { setModalMode('login'); setShowLoginModal(true); };
  const handleNavbarSignUp = () => { setModalMode('signup'); setShowLoginModal(true); };
  const handleRoleSelect = (role) => { setActiveUserType(role); setModalMode('login'); setShowLoginModal(true); };
  
  const performLogin = () => { setShowLoginModal(false); setCurrentPage('dashboard'); };
  const handleLogout = () => { setCurrentPage('home'); setActiveUserType(null); };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar isLoggedIn={currentPage === 'dashboard'} activeUserType={activeUserType} onLoginClick={handleNavbarLogin} onSignUpClick={handleNavbarSignUp} onLogout={handleLogout} />
      {currentPage === 'home' && <LandingPage onSelectRole={handleRoleSelect} />}
      {currentPage === 'dashboard' && <Dashboard userType={activeUserType} />}
      
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        {!activeUserType ? (
          <div className="text-center">
            <h2 className="text-2xl font-black mb-2 text-slate-800">Select Account Type</h2>
            <p className="text-slate-500 mb-8 text-sm">Please select your role to continue.</p>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setActiveUserType('citizen')} className="p-4 border-2 border-slate-100 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition flex flex-col items-center gap-3 group"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition"><User size={24} /></div><span className="font-bold text-slate-700">Citizen</span></button>
               <button onClick={() => setActiveUserType('institution')} className="p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center gap-3 group"><div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition"><Building2 size={24} /></div><span className="font-bold text-slate-700">Institution</span></button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4 cursor-pointer text-slate-400 hover:text-indigo-600 transition" onClick={() => setActiveUserType(null)}><ArrowRight className="rotate-180" size={14} /> <span className="text-xs font-bold uppercase tracking-wide">Change Role</span></div>
            <h2 className="text-2xl font-black mb-6 capitalize text-slate-800 text-center">{modalMode} as {activeUserType}</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label><div className="relative"><Wallet size={16} className="absolute left-4 top-4 text-slate-400"/><input type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-slate-700" placeholder="Enter email address connected to wallet" /></div></div>
              <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label><input type="password" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" /></div>
              <button onClick={performLogin} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg transition">{modalMode === 'login' ? 'Access Portal' : 'Create Account'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
