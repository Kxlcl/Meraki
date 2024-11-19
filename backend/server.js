import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Static File Serving for React
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'build'))); // Correct path to "build"

// MongoDB Connection
const DB_URI = 'mongodb+srv://merakiadmin:kM8VyIcA2K0bgZay@cluster0.op3vy.mongodb.net/';
mongoose
    .connect(DB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Mongoose Schema and Model
const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    mainImage: { type: String },
    description: { type: String, required: true },
});
const Business = mongoose.model('Business', businessSchema);

// Routes
app.post('/api/businesses', upload.single('mainImage'), async (req, res) => {
    try {
        const { businessName, description } = req.body;
        const mainImage = req.file ? req.file.path : null;

        const business = new Business({
            businessName,
            mainImage,
            description,
        });

        await business.save();
        res.status(201).json({ message: 'Business created successfully', business });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the business' });
    }
});

app.get('/api/businesses', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching businesses' });
    }
});

// Serve React Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // Correct static path
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
