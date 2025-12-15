const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');


require("dotenv").config();


// --- KONFIGURASI ---
const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/egov_db'; 
const JWT_SECRET = 'kunci_rahasia_negara_sangat_aman_123'; 

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Multer (memory storage) for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

  // === BLOCKCHAIN DATA ===
  blockchainId: { type: Number },          // id dari smart contract
  txHash: { type: String },                // hash transaksi
  contractAddress: { type: String },       // address contract

  ipfsCid: { type: String },               // optional (nanti)
  
  ownerName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

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
      id: doc._id,
      title: doc.title,
      type: doc.type,
      hash: doc.ipfsCid || doc.txHash || (doc._id && doc._id.toString()),
      status: doc.status,
      date: doc.createdAt.toISOString().split('T')[0],
      owner: doc.ownerName
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post(
  "/api/documents/request",
  authenticate,
  upload.single("file"), // ⬅️ INI PENTING
  async (req, res) => {

    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const { title, type } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "File tidak ditemukan" });
      }

      // 1️⃣ Upload file ke IPFS
      const ipfsCid = await uploadToIPFS(
        req.file.buffer,
        req.file.originalname
      );

      // 2️⃣ Simpan metadata ke MongoDB
      const newDoc = new Document({
        title,
        type,
        ipfsCid,
        ownerName: req.user.name,
        ownerId: req.user.id,
        status: "pending",
      });

      await newDoc.save();

      // 3️⃣ Return ke frontend
      res.status(201).json({
        id: newDoc._id,
        title: newDoc.title,
        type: newDoc.type,
        ipfsCid,
        status: newDoc.status,
        date: newDoc.createdAt.toISOString().split("T")[0],
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Institution: Issue document endpoint (creates a verified document record)
app.post('/api/documents/issue', authenticate, async (req, res) => {
  if (req.user.role !== 'institution') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { title, type, citizenName, ownerId, txHash, ipfsCid } = req.body;

    const newDoc = new Document({
      title,
      type,
      ipfsCid: ipfsCid || null,
      txHash: txHash || null,
      ownerName: citizenName || req.user.name,
      ownerId: ownerId || undefined,
      status: 'verified'
    });

    await newDoc.save();

    res.status(201).json({ message: 'Document issued', id: newDoc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/documents/:id/verify', authenticate, async (req, res) => {
  if (req.user.role !== 'institution') return res.status(403).json({ message: 'Forbidden' });
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: 'Updated', doc });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

async function uploadToIPFS(buffer, filename) {
  try {
    // Node 18+ provides global `FormData` and `fetch` — create a Blob from the buffer
    const form = new FormData();
    const blob = new Blob([buffer]);
    form.append('file', blob, filename);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
      body: form,
    });

    const json = await res.json();
    return json.IpfsHash;
  } catch (err) {
    console.error('IPFS upload failed', err);
    throw err;
  }
}

// Public verification endpoint used by frontend
app.get('/api/verify/:hash', async (req, res) => {
  try {
    const h = req.params.hash;
    const doc = await Document.findOne({ $or: [{ _id: h }, { ipfsCid: h }, { txHash: h }] });
    if (!doc) return res.json({ valid: false });
    res.json({ valid: true, type: doc.type, owner: doc.ownerName, date: doc.createdAt.toISOString().split('T')[0] });
  } catch (err) {
    res.status(500).json({ valid: false });
  }
});


// --- JALANKAN SERVER ---
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));