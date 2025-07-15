// index.js (full updated with smarter AI and better schema)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Schema
const clothesSchema = new mongoose.Schema({
  season: String,
  gender: String,
  type: String,
  subType: String,
  color: String,
  style: String,
  images: [{ filename: String, path: String }],
  geminiOutput: String,
  uploadedBy: {
    type: String,
    enum: ['user', 'company'],
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
});
const Clothes = mongoose.model('Clothes', clothesSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function getBase64FromUrl(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

function extractDetail(text, key) {
  const match = text.match(new RegExp(`${key}\s*[:\-–]\s*(.+)`, 'i'));
  return match ? match[1].split(/[.,\n]/)[0].trim().toLowerCase() : '';
}

async function predictClothingAttributes(imageUrl) {
  try {
    const prompt = `You are a fashion expert. Analyze the uploaded clothing image and identify the following:\n1. Gender (male/female/unisex)\n2. Season (summer/winter/monsoon/all seasons)\n3. Type (upper-wear, bottom-wear, full-body, accessory)\n4. Subtype (e.g., t-shirt, suit, kurta, lehenga, saree, hoodie, tracksuit, coat, jeans, etc.)\n5. Color (main visible color)\n6. Style (casual, formal, traditional, sporty, streetwear, partywear, business, ethnic)\n\nRespond in the following format:\nGender: ...\nSeason: ...\nType: ...\nSubtype: ...\nColor: ...\nStyle: ...`;

    const base64Image = await getBase64FromUrl(imageUrl);

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          ],
        },
      ],
    });

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('🧠 Gemini Output:\n', text);

    return {
      gender: extractDetail(text, 'Gender') || 'unisex',
      season: extractDetail(text, 'Season') || 'all seasons',
      type: extractDetail(text, 'Type') || 'upper-wear',
      subType: extractDetail(text, 'Subtype') || 't-shirt',
      color: extractDetail(text, 'Color') || 'unknown',
      style: extractDetail(text, 'Style') || 'casual',
      geminiOutput: text,
    };
  } catch (err) {
    console.error('❌ Gemini Prediction Error:', err);
    return {
      gender: 'unisex',
      season: 'summer',
      type: 'upper-wear',
      subType: 't-shirt',
      color: 'unknown',
      style: 'casual',
      geminiOutput: 'Prediction failed',
    };
  }
}

// Upload Route
app.post('/upload-clothes', upload.array('images', 10), async (req, res) => {
  try {
    const ip = req.hostname === 'localhost' ? 'localhost' : req.hostname;
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: `https://${ip}/uploads/${file.filename}`,
    }));

    const predictions = await Promise.all(
      files.map(async (file) => {
        const attr = await predictClothingAttributes(file.path);
        return { ...attr, image: file };
      })
    );

    const saved = await Clothes.insertMany(
      predictions.map((item) => ({
        season: item.season,
        gender: item.gender,
        type: item.type,
        subType: item.subType,
        color: item.color,
        style: item.style,
        geminiOutput: item.geminiOutput,
        uploadedBy: 'user',
        images: [item.image],
      }))
    );

    res.status(201).json({ message: '✅ Upload + Prediction successful', saved });
  } catch (err) {
    console.error('❌ Upload Failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Fetch Clothes
app.get('/clothes', async (req, res) => {
  try {
    const clothes = await Clothes.find().sort({ createdAt: -1 });
    res.json(clothes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clothes' });
  }
});

// Delete Clothing Item
app.delete('/clothes/:id', async (req, res) => {
  try {
    await Clothes.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Failed:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
