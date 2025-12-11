const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// --- KONFIGURASI ---
const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/egov_db'; 
const JWT_SECRET = 'kunci_rahasia_negara_sangat_aman_123'; 

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE ---
// Kita tambahkan opsi agar koneksi lebih stabil
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DATABASE TERHUBUNG: MongoDB Siap!'))
  .catch(err => {
    // Jangan crash, tapi beritahu errornya
    console.log('------------------------------------------------');
    console.error('❌ DATABASE ERROR: Gagal terhubung ke MongoDB.');
    console.error('   Penyebab: Aplikasi MongoDB belum diinstall atau belum jalan.');
    console.error('   Solusi: Install "MongoDB Community Server" (versi MSI).');
    console.log('------------------------------------------------');
  });

// --- MODEL DATABASE ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'institution'], required: true },
  walletAddress: { type: String, default: () => '0x' + crypto.randomBytes(20).toString('hex') },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Document = mongoose.model('Document', documentSchema);

// --- MIDDLEWARE AUTH ---
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Akses Ditolak' });
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token Invalid' });
  }
};

// --- ROUTES ---

// [PENTING] Route Halaman Depan agar tidak "Cannot GET /"
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 
    ? '<span style="color:green; font-weight:bold;">Terhubung (Aman) 🟢</span>' 
    : '<span style="color:red; font-weight:bold;">Terputus (Error) 🔴</span>';

  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #2563eb;">✅ Server E-Government Berjalan!</h1>
      <p>Backend siap melayani request dari Frontend.</p>
      <div style="background:#f3f4f6; padding: 20px; border-radius: 10px; display:inline-block; text-align:left;">
         <p>🔌 Port Server: <b>${PORT}</b></p>
         <p>🗄️ Status Database: ${dbStatus}</p>
      </div>
      ${mongoose.connection.readyState !== 1 ? '<p style="color:red; margin-top:20px;">⚠️ Mohon nyalakan aplikasi MongoDB di komputer Anda.</p>' : ''}
    </div>
  `);
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, wallet: user.walletAddress } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Document Routes
app.get('/api/documents', authenticate, async (req, res) => {
  try {
    let docs = req.user.role === 'citizen' ? await Document.find({ ownerId: req.user.id }) : await Document.find();
    res.json(docs.map(doc => ({
      id: doc._id, title: doc.title, type: doc.type, hash: doc.hash, status: doc.status,
      date: doc.createdAt.toISOString().split('T')[0], owner: doc.ownerName
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/documents/request', authenticate, async (req, res) => {
  if (req.user.role !== 'citizen') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { title, type } = req.body;
    const hash = '0x' + crypto.createHash('sha256').update(title + req.user.id + Date.now()).digest('hex');
    const newDoc = new Document({ title, type, hash, ownerName: req.user.name, ownerId: req.user.id, status: 'pending' });
    await newDoc.save();
    res.status(201).json({ message: 'Success', doc: newDoc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/documents/:id/verify', authenticate, async (req, res) => {
  if (req.user.role !== 'institution') return res.status(403).json({ message: 'Forbidden' });
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: 'Updated', doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- JALANKAN SERVER ---
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));