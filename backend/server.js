import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5001

// Manually create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs'); // Set EJS as view engine
app.set('views', path.join(__dirname, 'views')); // Set path to your views folder

// Serve static files (like images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: '*', // or use specific origin like 'https://monkfish-app-cemkx.ondigitalocean.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'; // Fallback to local DB if MONGODB_URI is not provided
mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path where the uploaded files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save with unique names based on timestamp
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

// Fetch a single business by ID
app.get('/businesses/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID:', id); // Log the received ID to check its format

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ObjectId format');
        return res.status(400).render('error', { message: 'Invalid Business ID format', error: null });
    }

    try {
        const business = await Business.findById(id);
        if (!business) {
            console.error('Business not found with the given ID');
            return res.status(404).render('error', { message: 'Business not found', error: null });
        }
        res.render('business', { business });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).render('error', { message: 'Database error occurred', error: err });
    }
});

// Handle POST request to create a new business
app.post('/api/businesses', upload.single('mainImage'), async (req, res) => {
    try {
        const { businessName, description } = req.body;
        const mainImage = req.file ? `uploads/${req.file.filename}` : null;

        const business = new Business({
            businessName,
            mainImage,
            description,
        });

        await business.save();
        res.status(201).json({ message: 'Business created successfully', business });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the business' });
    }
});

// Handle fetching all businesses (API route)
app.get('/api/businesses', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching businesses' });
    }
});

// Serve React Frontend (Ensure React build is correctly served)
app.use(express.static(path.join(__dirname, 'build'))); // Correct static path to React build

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // Serve React app for all other routes
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

